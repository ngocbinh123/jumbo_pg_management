<template>
  <GridLayout id="account_parent" columns="*" rows="150, *, auto">
    <GridLayout class="account-header" rows="20,90,*" columns="*,90,*" row="0" col="0" colSpan="3">
      <Label id="btn_logout" @tap="confirmLogoutOut()" :text="'fa-sign-out-alt' | fonticon" class="fas font-icon-defaut text-color-white font-icon-size-28 text-right" row="0" col="2" rowSpan="2" />
      <GridLayout class="lout-circle" row="1" col="1" rows="auto" columns="auto">
      </GridLayout>
      <Label :text="'fa-user' | fonticon" class="fas font-avatar text-color-white font-icon-size-avatar" row="1" col="1"  />
      <Label :text="user.name" class="text-user-name" row="2" column="0" colSpan="3" />
    </GridLayout>
    <ScrollView row="1" col="0" colSpan="3" rowSpann="2">
      <GridLayout class="account-body" rows="20, 50, auto, 20, 50,*,20" columns="*, 50">
          <Label text="Thông Tin Tài Khoản:" class="text-part-header" row="1" col="0" />    
          <Label @tap="refreshAccountInfo()" :text="'fa-sync-alt' | fonticon" class="fas font-icon font-icon-size-24 text-right" row="1" col="1"/>

          <GridLayout class="account-part" rows="20, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, *" columns="50, *,50" row="2" col="0" colSpan="2">
              <Label :text="'fa-id-card' | fonticon" class="fas icon-field-user" row="1" col="0" />
              <StackLayout class="lout-info" row="1" col="1" colSpan="2">
                <Label text="Mã GID" class="text-label"/>              
                <Label :text="user.gid" class="text-value" textWrap="true"/>              
              </StackLayout>

              <Label :text="'fa-id-badge' | fonticon" class="far icon-field-user" row="2" col="0" />
              <StackLayout class="lout-info" row="2" col="1" colSpan="2">
                <Label text="Mã Nhân Viên" class="text-label"/>              
                <Label :text="user.code" class="text-value" textWrap="true"/>              
              </StackLayout>

              <Label :text="'fa-address-card' | fonticon" class="far icon-field-user" row="3" col="0" />
              <StackLayout class="lout-info" row="3" col="1" colSpan="2">
                <Label text="CMND (Thẻ căn cước công nhân)" class="text-label"/>              
                <Label :text="user.idCard" class="text-value" textWrap="true"/>              
              </StackLayout>

              <Label :text="'fa-envelope' | fonticon" class="far icon-field-user" row="4" col="0" />
              <StackLayout class="lout-info" row="4" col="1" colSpan="2">
                <Label text="Email" class="text-label"/>              
                <Label :text="user.email" class="text-value" textWrap="true"/>              
              </StackLayout>

              <Label :text="'fa-birthday-cake' | fonticon" class="fas icon-field-user" row="5" col="0" />
              <StackLayout class="lout-info" row="5" col="1" colSpan="2">
                <Label text="Ngày Sinh Nhật" class="text-label"/>              
                <Label :text="user.birthday" class="text-value" textWrap="true"/>              
              </StackLayout>
              <Label :text="'fa-edit' | fonticon" class="far icon-edit" row="5" col="2" @tap="onClickUpdateBirthday()" />

              <Label :text="'fa-mobile-alt' | fonticon" class="fas icon-field-user" row="6" col="0" />
              <StackLayout class="lout-info" row="6" col="1" colSpan="2">
                <Label text="Số Điện Thoại" class="text-label"/>              
                <Label :text="user.phone" class="text-value" textWrap="true"/>              
              </StackLayout>
              <Label :text="'fa-edit' | fonticon" class="far icon-edit" row="6" col="2" @tap="onClickUpdatePhoneNumber()" />

              <Label :text="'fa-home' | fonticon" class="fas icon-field-user" row="7" col="0" />
              <StackLayout class="lout-info" row="7" col="1" colSpan="2">
                <Label text="Địa Chỉ" class="text-label"/>              
                <Label :text="user.address" class="text-value" textWrap="true"/>              
              </StackLayout>
              <Label :text="'fa-edit' | fonticon" class="far icon-edit" row="7" col="2" @tap="onClickUpdateAddress()" />

              <Label :text="'fa-venus-mars' | fonticon" class="fas icon-field-user" row="8" col="0" />
              <StackLayout class="lout-info" row="8" col="1" colSpan="2">
                <Label text="Giới Tính" class="text-label"/>              
                <Label :text="user.gender" class="text-value" textWrap="true"/>              
              </StackLayout>

              <Label :text="'fa-th' | fonticon" class="fas icon-field-user" row="9" col="0" />
              <StackLayout class="lout-info" row="9" col="1" colSpan="2">
                <Label text="Ngành Hàng" class="text-label"/>              
                <Label :text="user.category" class="text-value" textWrap="true"/>              
              </StackLayout>

              <Label :text="'fa-chalkboard' | fonticon" class="fas icon-field-user" row="10" col="0" />
              <StackLayout class="lout-info" row="10" col="1" colSpan="2">
                <Label text="Kênh Bán Hàng" class="text-label"/>              
                <Label :text="user.channel" class="text-value" textWrap="true"/>              
              </StackLayout>

              <Label :text="'fa-handshake' | fonticon" class="fas icon-field-user" row="11" col="0" />
              <StackLayout class="lout-info-no-border" row="11" col="1" colSpan="2">
                <Label text="Đối Tác" class="text-label"/>              
                <Label :text="user.client" class="text-value" textWrap="true"/>              
              </StackLayout>            
          </GridLayout>

          <Label text="Thông Tin Người Quản Lý:" class="text-part-header" row="4" col="0" colSpan="2"/>    
          <GridLayout class="account-part" rows="20, auto, auto, *" columns="50, *,50" row="5" col="0" colSpan="2">
            <Label :text="'fa-user-tie' | fonticon" class="fas icon-field-user" row="1" col="0" />
              <StackLayout class="lout-info" row="1" col="1" colSpan="2">
                <Label text="Họ Tên" class="text-label"/>              
                <Label :text="user.manager.name" class="text-value" textWrap="true"/>              
              </StackLayout>

              <Label :text="'fa-mobile-alt' | fonticon" class="fas icon-field-user" row="2" col="0" />
              <StackLayout class="lout-info" row="2" col="1" colSpan="2">
                <Label text="Số Điện Thoại" class="text-label"/>              
                <Label :text="user.manager.phone" class="text-value" textWrap="true"/>              
              </StackLayout>

              <Label :text="'fa-envelope' | fonticon" class="far icon-field-user" row="3" col="0" />
              <StackLayout class="lout-info-no-border" row="3" col="1" colSpan="2">
                <Label text="Email" class="text-label"/>              
                <Label :text="user.manager.email" class="text-value" textWrap="true"/>              
              </StackLayout>     
          </GridLayout>
          <ActivityIndicator v-show="isProcessing" busy="true" row="0" colSpan="6" rowSpan="2" />
      </GridLayout>
    </ScrollView>
    <!-- <Button id="btn_logout" @tap="confirmLogoutOut()" class="btn-secondary" text="ĐĂNG XUẤT" row="3" colspan="3" /> -->
  </GridLayout>
</template>

<script>
import DatePickerDlg from "../Dialog/DatePickerDlg";
import AddressDlg from "../Dialog/AddressDlg";
import Transition from "../../share/Transition";
import ResourceString from "../../assets/StringConst";
import CurrentUser from "../../data/CurrentUser";
import Remember from "../../share/Remember";
import Login from "../Login";
import Validation from "../../share/Validation";
import ApiService from "../../service/BackEndService";
import { error } from '@nativescript/core/trace/trace';
import QueryBuilder from '../../storaged/QueryBuilder';
import * as firebase from"nativescript-plugin-firebase";
import Constant from "../../data/Constant";
export default {
  data() {
    return {
      isProcessing: false,
      user: {}
    };
  },
  created() {
    this.user = CurrentUser.getUserInfo();
    this.trackingPage();
  },
  methods: {
    trackingPage() {
      firebase.analytics.logEvent({
      key: Constant.KEY_PAGE_VIEW,
      parameters: [
          {
            key: Constant.KEY_PAGE_ID, 
            value: "TAB_ACCOUNT"
          }
        ]
      });
    },
    refreshAccountInfo() {
      if (this.isProcessing) {
        return;
      }

      this.isProcessing = true;
      ApiService.methods
        .getUserInfo(CurrentUser.methods.getBearId())
        .catch(this.callBackServiceFail)
        .then(this.getInfoSuccess);
    },
    getInfoSuccess(json) {
       this.isProcessing = false;
      CurrentUser.methods.saveUserInfo(json);
      this.user = CurrentUser.getUserInfo();
    },
    onClickUpdateBirthday() {
      if (this.isProcessing) {
        return;
      }

      this.$showModal(DatePickerDlg, { 
        fullscreen: false, 
        animated: true,
        props: { 
          title: ResourceString.lbl_update_birthday,
          defaultDate: this.user.birthday
        }
      }).then(this.callBackOnTapUpdateBirhday);
    },
    callBackOnTapUpdateBirhday(result) {
      if (result == undefined || !result.isSuccess) {
        return;
      }
      const errMessage = Validation.validBirhtday(result.selectedDate);
      if (!!errMessage) {
        this.showDlg(ResourceString.lbl_error, errMessage);
        return;       
      }

      this.isProcessing = true;  

      const apibBithday = result.selectedDate.getFullYear() + "-" + (result.selectedDate.getMonth() + 1) + "-" + result.selectedDate.getDate();
      ApiService.methods.updateUserBirthday(apibBithday, CurrentUser.methods.getBearId())
        .then(obj => this.callBackUpdateBirthday(obj, result.selectedDateStr))
        .catch(this.callBackServiceFail);
        
    },
    callBackUpdateBirthday(obj, newBirthdayStr) {
      this.isProcessing = false;        
      this.user.birthday = newBirthdayStr;
      CurrentUser.methods.updateBirthday(newBirthdayStr);
    },
    onClickUpdatePhoneNumber() {
      if (this.isProcessing) {
        return;
      }

      prompt({
        title: ResourceString.lbl_update_phone,
        message: ResourceString.msg_please_fill_phone,
        inputType: "phone",
        defaultText: "",
        okButtonText: ResourceString.lbl_update,
        cancelButtonText: ResourceString.lbl_cancel
      }).then(this.callBackOnTapUpdatePhone);
    },
    callBackOnTapUpdatePhone(result) {
        if (!result.result || this.user.phone == result.text) {
          return;
        }
        const newPhone = result.text;
        const errMessage = Validation.validPhoneNumber(newPhone);
        if (!!errMessage) {
          this.showDlg(ResourceString.lbl_error, errMessage);
          return;
        }
        this.isProcessing = true;        
        ApiService.methods.updateUserPhoneNumber(newPhone, CurrentUser.methods.getBearId())
          .then(obj => this.callBackUpdatePhoneNunber(obj, newPhone))
          .catch(this.callBackServiceFail);
    },
    callBackServiceFail(error) {
      this.isProcessing = false;
      var message = error.message.includes("UnknownHostException") ? ResourceString.msg_unknow_host_exception : error.message;
      this.showDlg(ResourceString.lbl_error, message);      
    },
    callBackUpdatePhoneNunber(obj, newPhone) {
      this.user.phone = newPhone;
      CurrentUser.methods.updatePhone(newPhone);
      this.isProcessing = false;
    },
    onClickUpdateAddress() {
      if (this.isProcessing) {
        return;
      }

      this.$showModal(AddressDlg, { 
        fullscreen: true, 
        animated: true,
        props: { 
          title: ResourceString.lbl_update_address
        }
      }).then(this.callBackOnTapUpdateAddress);
    },
    callBackOnTapUpdateAddress(result) {
      if (result == undefined) {
        return;
      }

      this.isProcessing = true;
      const addressObj = {
        provinceId: result.selectedProvince.id,
        districtId: result.selectedDistrict.id,
        ward: result.selectedWard,
        street: result.selectedStreet
      };
      ApiService.methods.updateAddress(addressObj, CurrentUser.methods.getBearId())
        .then(obj => this.callBackUpdateAddress(obj, result.addressStr))
        .catch(this.callBackServiceFail);
    },
    callBackUpdateAddress(obj, addressStr) {
      this.user.address = addressStr;
      CurrentUser.methods.updateAddress(addressStr);
      this.isProcessing = false;
    },
    confirmLogoutOut() {
      if (this.isProcessing) {
        return;
      }
      this.isProcessing = true;
      confirm({
        title:  ResourceString.lbl_logout_question,
        okButtonText: ResourceString.lbl_logout,
        cancelButtonText: ResourceString.lbl_no,
        message:  ResourceString.msg_sure_logout
      }).then(this.startLogout);
    },
    startLogout(isAccept) {
      if (!isAccept) {
        this.isProcessing = false;
        return;
      }
      
      this.isProcessing = true;
      CurrentUser.methods.logout();
      
      this.$store.state.tables.forEach(tableName => {
        var query = QueryBuilder.buildQueryDeleteAll(tableName);
        this.$store.state.database.execSQL(query, []).then(result => {
          console.log("LOGOUT: SUCCESS DELETE RECORDS IN " + tableName, result)
        })
        .catch((error) => {
          console.log("LOGOUT: ERROR: DELETE RECORDS IN " + tableName , error);
        })
      });

      this.$store.customers = [];
      this.$store.provinces = [];
      this.$store.invoices = [];

      this.backToLogin();
    },
    backToLogin() {
      this.$navigateTo(Login, {
        clearHistory: true,
        animated: true,
        transition: Transition.pageTransition
      });
    },
    showDlg(dlgTitle, dlgMsg) {
      return alert({
        title: dlgTitle,
        okButtonText: ResourceString.lbl_close,
        message: dlgMsg
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../app-variables.scss";
#account_parent {
  justify-content: center;
  align-items: center;
}

.account-header {
  background-image: linear-gradient($color-primary-dark, $color-primary);
}

.lout-circle {
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  border-width: 0.5;
  border-color: white;
}

.avatar {
  vertical-align: middle;
  text-align: center;
  color: white;
  font-size: 24;
}

#btn_logout {
  margin: 12;
}

.text-user-name {
  color: white;
  font-size: 24;
  vertical-align: middle;
  text-align: center;
  font-family: "f_arima_madurai_extra_bold";
}
.account-body {
  margin: 0 12;
}

.icon-field-user {
    color: $color-primary;
    vertical-align: top;
    text-align: center;
    font-size: 24;
}

.icon-edit{
    color:grey;
    vertical-align: top;
    text-align: center;
    font-size: 18;
}

.account-part {
  border-radius: 20%;
  border-width: 1;
  border-color: $color-primary-dark;
  margin: 8 0 4 0;
}

.text-part-header {
    font-family: "f_arima_madurai_extra_bold";
    color: $color-primary-dark;
    font-size: 20;
    vertical-align: middle;
    padding: 0;
}

.text-label {
  text-align: left;
  font-family: "f_arima_madurai_thin";
}

.text-value {
  text-align: left;
}

.lout-info {
  border-bottom-width: 0.5;
  border-bottom-color: $color-border;
  padding-bottom: 8;
  margin-bottom: 18;
  margin-right: 12;
  // vertical-align: top;
}

.lout-info-no-border {
  margin-bottom: 18;
  margin-right: 12;
}
</style>