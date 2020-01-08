<template>
  <GridLayout rows="50, *, 50" columns="50,*, 100, *, 50" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="5" width="100%" height="50">
      <Label :text="localSelectedDateStr" class="text-center title-page" />
    </FlexboxLayout>
    <Label :text="'fa-calendar-alt' | fonticon" class="far btn-calendar"  @tap="chooseDate()" row="0" col="4" />
    <Label :text="'fa-calendar-day' | fonticon" class="fas btn-calendar"  @tap="resetDateToToDay()" row="0" col="0" />
        
    <RadListView 
      ref="listView" pullToRefresh="true"  @pullToRefreshInitiated="fetchCheckInSchedules" :pullToRefreshStyle="pullToRefreshStyle"
      row="1" colSpan="5" rowSpan="3" for="msgItem in messages" v-show="messages.length > 0">
       <v-template>
        <Label :text="msgItem" class="text-left" textWrap="true" margin="12 6"/>
       </v-template>
    </RadListView>

    <RadListView 
      ref="listView" pullToRefresh="true"  @pullToRefreshInitiated="fetchCheckInSchedules" :pullToRefreshStyle="pullToRefreshStyle"
      row="1" colSpan="5" rowSpan="3" for="item in currCheckInList" v-show="messages.length == 0">
      <v-template>
        <GridLayout flexDirection="row" rows="auto, auto" columns="50, 50, *" class="ls-item-check-in">
          <!-- late -->
          <Label :text="'fa-circle' | fonticon" class="far font-icon-late" v-if="item.statuscode.value == 100000000" row="0" col="0" />
          <!-- miss -->
          <Label :text="'fa-times-circle' | fonticon" class="fas font-icon-missed" v-if="item.statuscode.value == 100000001" row="0" col="0"/>
          <!-- ontime -->
          <Label :text="'fa-check-circle' | fonticon" class="fas font-icon-ontime" v-if="item.statuscode.value == 2" row="0" col="0" />
          <!-- plainning -->
          <Label :text="'fa-circle' | fonticon" class="far font-icon-plainning" v-if="item.statuscode.value == 1" row="0" col="0" />  

          <Label :text="item.abiz_requestedtime" class="" row="0" col="1" />
          
          <Label :text="item.s_abiz_outletid.text" class="item-header text-ver-middle" textWrap="true"  row="0" col="2"/>
          <Label :text="item.o_abiz_addresscalculated" class="item-header-sub" textWrap="true" row="1" col="2" />
        </GridLayout>
      </v-template>
    </RadListView>
    <Button
      id="btn_check_in"
      text="CHẤM CÔNG"
      class="btn-fill-bg"
      row="2"
      col="2"
      v-show="isToday(localSelectedDateStr) && currCheckInList.length > 0"
      @tap="validCheckInOutTime()"
      :isEnabled="!isChkInProscess"
    />
    <ActivityIndicator v-show="isChkInProscess" busy="true" row="0" colSpan="5" rowSpan="3" />
    <Label v-if="!isChkInProscess && currCheckInList.length == 0 && messages.length == 0" text="Không có dữ liệu Chấm công." class="text-center" margin="24" color="red" row="1" colSpan="5" rowSpan="3" />
    </GridLayout>
</template>
<script>
import TakePicForChkIn from "../CheckIn/TakePictureForCheckIn";
import Transition from "../../share/Transition";
import CurrentUser from "../../data/CurrentUser";
import StringConst from "../../assets/StringConst";
import ApiService from '../../service/BackEndService';
import * as firebase from"nativescript-plugin-firebase";
import Constant from "../../data/Constant";
import Helper from "../../helper/PopularHelper";
import * as Geolocation from 'nativescript-geolocation';
import DatePickerDlg from "../Dialog/DateWithoutLimitPickerDlg";

export default {
  mounted() {
    this.fetchCheckInSchedules();
    this.trackingPage();
  },
  data() {
    return {
      localSelectedDateStr: Helper.getCurrentDateStr(),
      isChkInProscess: false,
      currCheckInList: [], 
      messages: [],
      pullToRefreshStyle: Constant.pullToRefreshStyle
    };
  },
  methods: {
    trackingPage() {
      firebase.analytics.logEvent({
      key: Constant.KEY_PAGE_VIEW,
      parameters: [
          {
            key: Constant.KEY_PAGE_ID, 
            value: "TAB_HOME"
          }
        ]
      });
    },
    isToday(dateStr) {
      return Helper.isToday(dateStr)
    },
    resetDateToToDay() {
      this.localSelectedDateStr = Helper.getCurrentDateStr();
      this.fetchCheckInSchedules();
    },
    chooseDate() {
      if (this.isChkInProscess) {
        return;
      }
      this.isChkInProscess = true;
      this.$showModal(DatePickerDlg, { 
        fullscreen: !CurrentUser.isAndroidDevice(), 
        animated: true,
        props: { 
          title: StringConst.lbl_change_checkin_date,
          defaultDate: this.localSelectedDateStr
        }
      }).then(result => {
        this.isChkInProscess = false;
        if (result == undefined || !result.isSuccess) {
          return;
        }    
       this.localSelectedDateStr = result.selectedDateStr;
       this.fetchCheckInSchedules(); 
      });
    },
    fetchCheckInSchedules(args) {
      if (args == undefined) {
        this.isChkInProscess = true;
      }

      this.currCheckInList = [];
      const requestSelectedDate = Helper.convertLocalDateToRequestDate(this.localSelectedDateStr);
      ApiService.methods.getSessions(requestSelectedDate, CurrentUser.methods.getBearId())
      .then(obj => {
        this.messages = obj.messages;
        this.currCheckInList = obj.records;
        this.isChkInProscess = false;
        if (args != undefined) {
          args.object.notifyPullToRefreshFinished();   
        } 
      })
      .catch(error => {
        if (args != undefined) {
          args.object.notifyPullToRefreshFinished();   
        }
        this.callApiServiceFail(error);
      });
    },
    openCamera(curLoction) {
      this.isChkInProscess = true;
      this.$showModal(TakePicForChkIn, {
              fullscreen: true,
              animated: true,
              props: {
                location: curLoction
              }
          }).then(response => {
            this.isChkInProscess = false;
            if (response.isSuccess) {
              this.fetchCheckInSchedules();
              this.showDlg(StringConst.lbl_success, StringConst.msg_check_in_success);
            }else {
              this.showDlg(StringConst.lbl_notification,StringConst.msg_please_should_take_picture_before);
            }
          });
    },
    validCheckInOutTime() {
      this.isChkInProscess = true;
      const data = {
        date: Helper.getCurrentDateStrForRequest(),
        time: Helper.getCurrentTimeStr()
      };
      ApiService.methods.validInOutTimeUrl(data, CurrentUser.methods.getBearId())
      .then(this.validCheckInOutTimeSuccess)
      .catch(this.callApiServiceFail);
    },
    validCheckInOutTimeSuccess(json) {
      this.isChkInProscess = false;
      if (json == undefined) {
        return;
      }
      this.startGetLocation();
    },
    startGetLocation() {
      this.isChkInProscess = true;
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
                    this.isChkInProscess = false;
                    this.getAddressByLocation(result.latitude, result.longitude);
                })
                .catch(e => {
                  console.log('loc error', e);
                    this.isChkInProscess = false;
                    this.showDlg(StringConst.lbl_notification, StringConst.msg_request_location_permission_fail);
                });
            });
        });
    },
    getAddressByLocation(curLatitude, curLongitude) {
      this.isChkInProscess = true;
      const data = {
        latitude: curLatitude,
        longitude: curLongitude
      };

      ApiService.methods.getLocationAdrress(data, CurrentUser.methods.getBearId())
        .then(obj => {
          this.isChkInProscess = false;
          this.openCamera({
            latitude: curLatitude,
            longitude: curLongitude,
            address: obj.abiz_address
          });
        })
        .catch(this.callApiServiceFail);
    },
    callApiServiceFail(error) {
      this.isChkInProscess = false;
      var message = error.message.includes("UnknownHostException") ? StringConst.msg_unknow_host_exception : error.message;
      this.showDlg(StringConst.lbl_error, message);
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

<style scroped lang="scss">
@import "../../app-variables.scss";

#btn_check_in {
  font-size: 14;
  padding: 0%;
  margin-bottom: 12;
}

.ls-item-check-in {
  padding-top: 12;
  padding-bottom: 12;
}
.item-header-sub {
  font-size: 14;
}

.font-icon-ontime {
    color: $color-primary;
    vertical-align: middle;
    text-align: center;
}

.font-icon-late {
    color: orange;
    vertical-align: middle;
    text-align: center;
}

.font-icon-missed {
    color: $color-accent;
    vertical-align: middle;
    text-align: center;
}

.font-icon-plainning {
    // color: $color-primary;
    vertical-align: middle;
    text-align: center;
}
</style>