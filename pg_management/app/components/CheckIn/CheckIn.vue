<template>
  <GridLayout class="page-parent" rows="50,*" columns="30,*">
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />
    
    <Label text="THÔNG TIN CHẤM CÔNG" class="title-white text-center"  row="0" col="0" colSpan="2"/>
    <FlexboxLayout row="0" col="0" rowSpan="2" colSpan="2">
      <GridLayout class="page-content" rows="40,40,40,40,40,50" columns="50, *" >
        <!-- <Image src="res://ic_id_card_primary" class="icon" row="0" col="0" /> -->
        <Label :text="'fa-address-card' | fonticon" class="far font-icon font-icon-size-24"  @tap="closePage()" row="0" col="0" />
        <Label class="lbl-value" :text="userId" row="0" col="1"/>
        
        <Label :text="'fa-user' | fonticon" class="far font-icon font-icon-size-24"  @tap="closePage()" row="1" col="0" />
        <Label class="lbl-value" :text="userName" row="1" col="1"/>

        <Label :text="'fa-clock' | fonticon" class="far font-icon font-icon-size-24"  @tap="closePage()" row="2" col="0" />
        <Label :text="checkInTime" class="lbl-value text-bold" row="2" col="1"/>

        <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon font-icon-size-24"  @tap="closePage()" row="3" col="0" />
        <Label :text="locationtr" class="lbl-value" row="3" col="1" />
        <ActivityIndicator v-show="processing" busy="true" row="0" col="0" colSpan="2" rowSpan="5" />
        <Button
          id="btn_submit"
          class="btn-primary"
          :text="this.location == null ? 'Lấy Vị Trí Của Bạn' : 'Gửi'"
          @tap="onClickButton()"
          row="5"
          col="0"
          colSpan="2"
        />
      </GridLayout>
    </FlexboxLayout>
  </GridLayout>
</template>

<script>
import Constant from "../../data/Constant";
import StringConst from "../../assets/StringConst";
import CurrentUser from "../../data/CurrentUser";
import ApiService from "../../service/BackEndService";
import * as Geolocation from 'nativescript-geolocation';
export default {
  created() {
    this.startGetLocation();
    const now = new Date();
    var hour = now.getHours();
    if(hour < 10) {
      hour = "0" + hour;
    }
  
    var min = now.getMinutes();
    if(min < 10) {
      min =  "0" + min;
    }
    this.checkInTime = hour + ":" + min;
  },
  props: ["checkInItem"],
  data() {
    return {
      locationFailure:false,
      location:null, 
      locationtr: "",
      userId: CurrentUser.methods.getUserId(),
      userName: CurrentUser.methods.getUserName(),
      checkInTime: "",
      store: "",
      processing: false
    };
  },
  methods: {
    startGetLocation() {
      this.processing = true;
      Geolocation.enableLocationRequest(true)
        .then(() => {
            Geolocation.isEnabled().then(isLocationEnabled => {
                console.log('result is '+isLocationEnabled);
                if(!isLocationEnabled) {
                    this.locationFailure = true;
                    return;
                }

                // MUST pass empty object!!
                Geolocation.getCurrentLocation({})
                .then(result => {
                    this.location = result;
                    this.locationtr = result.latitude + " - " + result.longitude;
                    this.processing = false;
                })
                .catch(e => {
                    console.log('loc error', e);
                    this.processing = false;
                });
            });
        });
    },
    closePage(){
      this.$modal.close({
        isSuccess: false,
        item: {}
      });
    },
    onClickButton() {
      if (this.location == null) {
        this.startGetLocation();
      }else{
        this.submitData();  
      }
    },
    submitData() {
      this.processing = true;
      const now = new Date();
      const checkInDate = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
      const data = {
        date: checkInDate,
        time: this.checkInTime,
        latitude: this.location.latitude,
        longitude: this.location.longitude
      };
      ApiService.methods.checkInOut(data, CurrentUser.methods.getBearId())
      .then(this.submitDataSuccess)
      .catch(this.submitDataFail);
    },
    submitDataSuccess(json) {
      this.processing = false;
      this.$modal.close({
        isSuccess: true,
        item: {}
      });
    }, 
    submitDataFail(error) {
      this.processing = false;
      this.showDlg(StringConst.lbl_error, error.message);
    },
    showDlg(dlgTitle, dlgMsg) {
      return alert({
        title: dlgTitle,
        okButtonText: StringConst.lbl_close,
        message: dlgMsg
      });
    }
  }
};
</script>


<style scoped lang="scss">
@import "../../app-variables.scss";

.page-parent {
  justify-content: center;
  align-items: center;
  background-image: linear-gradient($color-primary-dark, $color-primary);
}

FlexboxLayout {
  justify-content: center;
  align-items: center;
}

.page-content {
  width: 90%;
  padding: 12 16;
  background-color: $color-bg-white;
  border-radius: 10%;
}

.lbl-value {
  vertical-align: middle;
  font-size: 18;
  text-align: left;
}

.title-white {
  color: white;
  vertical-align: middle;
  font-family: "f_arima_madurai_bold";
  font-size: 24;
}

#btn_submit {
  margin-left: 5%;
  margin-right: 5%;
  font-family: "f_arima_madurai_extra_bold";
}

#btn_back {
  margin-left: 6%;
  width: 6%;
}
</style>
