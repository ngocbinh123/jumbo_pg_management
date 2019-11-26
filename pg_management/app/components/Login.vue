<template>
  <Page actionBarHidden="true">
    <FlexboxLayout class="page">
      <GridLayout row="auto, auto, auto">
        <StackLayout>
          <Label text="Xin Chào" class="page_title" />
          <Label
            text="Hãy đăng nhập bằng tài khoản của bạn."
            class="page_sub_title"
            textWrap="true"
          />
          <TextField
            id="txt_email"
            v-model="user.email"
            hint="Email"
            keyboardType="email"
            autocorrect="false"
          />
          <TextField
            id="txt_pass"
            v-model="user.password"
            hint="Mật khẩu"
            secure="true"
            autocorrect="false"
            returnKeyType="done"
            @returnPress="startLogigning"
          />
          <Button
            id="btn_login"
            @tap="validateInput()"
            text="Đăng Nhập"
            class="btn btn-primary"
            :isEnabled="!processing"
          />
          <Label id="lbl_forgot_pass" @tap="forgotPassword()" text="Bạn quên mật khẩu?" />
        </StackLayout>
        <ActivityIndicator v-show="processing" busy="true" />
      </GridLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
import Home from "./App";
import ChangePass from "./ChangePassword";
import Customer from "../data/objects/Customer";

import Vue from "nativescript-vue";

const stringConst = require("../assets/StringConst");
const apiService = require("../service/BackEndService");
const remember = require("../share/Remember");
const transition = require("../share/Transition");

export default {
  created() {
    if (TNS_ENV !== 'production') {
      this.user.email = "nguyengocbinh@gmail.com";
      this.user.password = "binh@2019";
    }
  },
  data() {
    return {
      processing: false,
      user: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    validateInput() {
      if (!this.user.email || !this.user.password) {
        this.showDlg(
          stringConst.lbl_notification,
          stringConst.msg_fill_emai_pass
        );
        return;
      }

      if (!this.validateEmail()) {
        this.showDlg(
          stringConst.lbl_notification,
          stringConst.msg_email_not_match
        );
        return;
      }

      this.processing = true;
      this.login();
    },
    validateEmail() {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(this.user.email);
    },
    login() {
      apiService.methods
        .login(this.user.email, this.user.password)
        .catch(this.apiRequestFail)
        .then(this.loginSuccess);
    },
    getUserInfo(beaerId) {
      this.processing = true;
      apiService.methods
        .getUserInfo(beaerId)
        .catch(this.getInfoFail)
        .then(this.getInfoSuccess);
    },
    getInfoSuccess(json) {
      this.processing = false;
      remember.setUserName(json.abiz_name);
      remember.setUserCode(json.abiz_usercode);
      remember.setUserAddress(json.abiz_addresscalculated);
    
      remember.setUserGender(json.abiz_gender.text);
      remember.setUserIDCard(json.abiz_identitycard);
      remember.setUserPhone(json.abiz_mobilephone);
      remember.setUserGID(json.abiz_usergid);

      remember.setUserCateogry(json.abiz_categorycode.text);
      remember.setUserChanel(json.abiz_channelcode.text);
      remember.setUserClientCode(json.abiz_clientcode.text);

      remember.setUserManagerName(json.manager_abiz_name);
      remember.setUserManagerEmail(json.manager_emailaddress);
      remember.setUserManagerPhone(json.manager_abiz_mobilephone);

      // birthday field in response have comple format.
      var birthday = json.abiz_birthday;
      if (birthday.includes("T")) {
        birthday = birthday.split("T")[0];
        const dateArr = birthday.split("-");
        if (dateArr.length == 3) {
          birthday = dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0];
        }
      }
      remember.setUserBirthday(birthday);
      
      this.getDataBeforeGotoHome();
    },
    getInfoFail(error) {
      this.processing = false;
      this.getDataBeforeGotoHome();
    },
    getDataBeforeGotoHome() {
      this.processing = true;
      var customers = Customer.customers;
      // this.$store.dispatch('insertAllCustomers', customers);
      for(var index = 0; index < customers.length; index++) {
        this.$store.dispatch('insertCustomer', customers[index]);
      }

      this.gotoHome();
    },
    loginSuccess(json) {
      var forceChangePass = json.abiz_forcechangepassword.value;
      // fix_bug: mobile don't know type of forceChangePass is String or Boolean
      if (typeof(forceChangePass) == 'string') {
        forceChangePass = forceChangePass.toLowerCase();
         forceChangePass = (forceChangePass == 'true');
      }
      // end fix_bug

      var beaerId = json.abiz_bearerid;
      var userId = json.abiz_ntgroupuserid;

      remember.setUserEmail(this.user.email.trim());
      remember.setUserName(this.user.email.trim());
      remember.setUserId(userId);
      remember.setBearId(beaerId);
      remember.setFroceChangePass(forceChangePass);
      this.processing = false;
      if (forceChangePass) {
        confirm({
          title: stringConst.lbl_change_pass,
          message: stringConst.msg_should_change_pass,
          okButtonText: stringConst.lbl_accept
        }).then(function(result) {
          Vue.prototype.$navigateTo(ChangePass, {
            clearHistory: true,
            animated: true,
            transition: transition.pageTransition
          });
        });
      }else {
        this.getUserInfo(beaerId);
      }

    },
    apiRequestFail(e) {
      var errMsg = e.message;
      if (errMsg.includes("UnknownHostException")) {
        errMsg = stringConst.msg_unknow_host_exception;
      }
      this.processing = false;
      this.showDlg(stringConst.lbl_fail, errMsg);
    },
    gotoHome() {
      this.$navigateTo(Home, {
        clearHistory: true,
        animated: true,
        transition: transition.pageTransition
      });
    },
    updatedPassSuccess(isUpdated) {
      this.processing = false;
      this.getDataBeforeGotoHome();
    },
    forgotPassword() {
      if (this.processing) {
        return;
      }
      prompt({
        title: stringConst.lbl_restore_pass,
        message: "Xin hãy nhập Email mà bạn đã đăng ký với hệ thống.",
        inputType: "email",
        defaultText: "",
        okButtonText: stringConst.lbl_send,
        cancelButtonText: stringConst.lbl_cancel
      }).then(data => {
        if (data.result) {
          var formatReq = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          var userEmail = data.text.trim();
          if (formatReq.test(userEmail)) {
            this.resetPass(userEmail);
          } else {
            this.showDlg(
              stringConst.lbl_notification,
              stringConst.msg_email_pass_not_math
            );
          }
        }
      });
    },
    resetPass(email) {
      apiService.methods
        .resetPass(email)
        .catch(this.apiRequestFail)
        .then(this.resetPassSuccess);
    },
    resetPassSuccess(json) {
      if (!json) {
        return;
      }
      this.processing = false;
      this.showDlg(stringConst.lbl_success, stringConst.msg_reset_pass_success);
    },
    startLogigning() {
      if (this.user.email && this.user.password) {
        this.validateInput();
      }
    },

    showDlg(dlgTitle, dlgMsg) {
      return alert({
        title: dlgTitle,
        okButtonText: stringConst.lbl_close,
        message: dlgMsg
      });
    }
  }
};
</script>

<style scoped>
FlexboxLayout,
AbsoluteLayout {
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-image: linear-gradient(#007882, #22aa8f);
}

StackLayout {
  width: 90%;
  padding: 12 16;
  background-color: #f0f0f0;
  border-radius: 10%;
}

#txt_email,
#btn_login {
  margin-bottom: 12;
}

#txt_pass {
  margin-bottom: 16;
}

#lbl_forgot_pass {
  font-size: 14px;
  font-weight: 300;
  text-align: center;
  font-style: italic;
  margin-top: 12;
  margin-bottom: 12;
}

#lbl_forgot_pass:focus,
:active,
:hover {
  font-weight: 500;
  color: blue;
}

TextField {
  border-width: 0.5;
  border-color: #22aa8f;
  border-radius: 8;
  padding: 12 16;
}
</style>
