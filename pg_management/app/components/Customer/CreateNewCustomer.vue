<template>
  <GridLayout rows="50,*" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
      <Label text="KHÁC HÀNG MỚI" class="text-center" />
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />
    <ScrollView row="1" col="0" colSpan="2">
      <GridLayout rows="50, *, 30, 70" columns="*" >
        <Label text="Thông Tin Khách Hàng:" class="header" row="0" col="0" />
        <GridLayout class="data-form" row="1" col="0" rows="auto, auto, 20, auto, auto, 20, auto, auto, 20, auto, auto, 20, auto, auto" columns="*" >
          <Label text="Họ Tên" class="text-label" row="0" col="0" />
          <TextField v-model="customer.name" hint="Nhập họ tên khách hàng" class="text-value input-border" margin="4 12" padding="12 18" row="1" col="0" />

          <Label text="Giới Tính" class="text-label" row="3" col="0" />
          <GridLayout orientation="horizontal" class="box-border" row="4" col="0" rows="*" columns="6, *, 30" @tap="showGenders()">
              <Label :text="customer.sex" class="text-value" row="0" col="1" />
              <Label :text="'fa-sort-down' | fonticon" class="fas  font-icon-size-24 text-center" row="0" col="2" />
          </GridLayout>

          <Label text="Số Điện Thoại" class="text-label" row="6" col="0" />
          <TextField v-model="customer.phone" hint="Nhập số điện thoại của khách hàng" keyboardType="phone" class="text-value input-border" margin="4 12" padding="12 18" row="7" col="0" />

          <Label text="Tỉnh/ Thành Phố" class="text-label" row="9" col="0" />
          <GridLayout orientation="horizontal" class="box-border" row="10" col="0" colSpan="2" rows="*" columns="6, *, 30" @tap="showProvinces()">
              <Label :text="customer.province.name" class="text-value" row="0" col="1" />
              <Label :text="'fa-sort-down' | fonticon" class="fas  font-icon-size-24 text-center" row="0" col="2" />
          </GridLayout>

          <Label text="Quận/ Huyện" class="text-label" row="12" col="0"  colSpan="2" />
          <GridLayout orientation="horizontal" class="box-border" row="13" col="0" colSpan="2" rows="*" columns="6, *, 30"  @tap="showDisctricts()">
              <Label :text="customer.district.name" class="text-value"  row="0" col="1" />
              <Label :text="'fa-sort-down' | fonticon" class="fas font-icon-size-24 text-center" row="0" col="2" />
          </GridLayout>
        </GridLayout>
        <Button
          id="btn_submit_customer"
          text="Hoàn Thành"
          class="btn btn-fill-bg"
          @tap="submiData()"
          :isEnabled="!processing"
          row="3"
          col="0"
        />
      </GridLayout>
    </ScrollView>
    <ActivityIndicator v-show="processing" busy="true" row="0" col="0" colSpan="2" rowSpan="2" />
  </GridLayout>
</template>
<script>
import StringConst from "../../assets/StringConst";
import ApiService from "../../service/BackEndService";
import CurrentUser from '../../data/CurrentUser';
import Constant from "../../data/Constant";
import Validation from "../../share/Validation";
import GenderDlg from "../Dialog/GenderDlg";
import ProvincesDlg from "../Dialog/ProvincesDlg";
import DistrictsDlg from "../Dialog/DisctrictsDlg";

export default {
  created() {
  },
  data() {
    return {
      customer: {
        name: "",
        sex: "Nam",
        phone: "",
        province: {
            id:"",
            name: ""
        },
        district: {
            id:"",
            name: ""
        },
      },
      processing: false,
    };
  },
  methods: {
    closePage() {
      this.$modal.close();
    },
    submiData() {
      this.processing = true;
      if (!this.customer.name) {
        this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_pls_fill_name
        );
        this.processing = false;
        return;
      }

      var errMessage = Validation.validPhoneNumber(this.customer.phone);
      if (!!errMessage) {
        this.showDlg(StringConst.lbl_notification,errMessage);
        this.processing = false;        
        return;
      }

      if (this.customer.province.id == "") {
        this.showDlg(StringConst.lbl_notification,StringConst.msg_please_fill_province);
        this.processing = false;        
        return;
      }

      if (this.customer.district.id == "") {
        this.showDlg(StringConst.lbl_notification,StringConst.msg_please_fill_district);
        this.processing = false;        
        return;
      }
 
      ApiService.methods.createNewCustomer(this.customer, CurrentUser.methods.getBearId())
      .then(this.callBackSendDataSuccess)
      .catch(this.callBackSendDataFail);
    },
    callBackSendDataSuccess(json) {
      this.$modal.close({
        isSuccess: true,
        customer: json
      });
      this.processing = false;
    },
    callBackSendDataFail(error) {
      this.showDlg(StringConst.lbl_error, error.message);
      this.processing = false;
    },
    showDlg(dlgTitle, dlgMsg) {
      return alert({
        title: dlgTitle,
        okButtonText: StringConst.lbl_close,
        message: dlgMsg
      }); 
    },
    showProvinces() {
      if (this.processing) {
        return;
      }

      this.processing = true;
      this.$showModal(ProvincesDlg, {
          fullscreen: true, 
          animated: true
          
      }).then(result => {
        this.processing = false;
        if (result == undefined) {
          return;
        }
        this.customer.province = result.selected;
        this.customer.district = {
            id: "",
            name: ""
        };
      });
    },
    showDisctricts() {
      if (this.processing) {
        return;
      }

      this.processing = true;
      if (this.customer.province.id == "") {
        this.showDlg(StringConst.lbl_notification,StringConst.msg_please_fill_province);
        this.processing = false;        
        return;
      }

      this.$showModal(DistrictsDlg, {
          fullscreen: true, 
          animated: true,
          props: {
          title: "QUẬN/ HUYỆN CỦA " + this.customer.province.name.toUpperCase(),
          province: this.customer.province
      }
          
      }).then(result => {
        this.processing = false;
        if (result == undefined) {
          return;
        }
        this.customer.district = result.selected;
      });
    },
    showGenders() {
      if (this.processing) {
        return;
      }

      this.processing = true;
      this.$showModal(GenderDlg, { 
        fullscreen: false, 
        animated: true
      }).then(result => {
        this.processing = false;
        if (result == undefined) {
          return;
        }
        this.customer.sex = result.selected;
      }); 
    }
  }
};
</script>
<style scroped lang="scss">
  .page-parent {
    justify-content: center;
    align-items: center;
  }


  #btn_submit_customer {
    margin-left: 10;
    margin-right: 10;
  }

  .data-form {
    .text-label {
      margin-left: 12;
      font-family: "f_arima_madurai_thin";
    }

    .text-value {
      text-align: left;
      margin-left: 0;
      padding: 8 4 8 0;
    }
  }

</style>