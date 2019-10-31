<template>
  <Page actionBarHidden="true">
    <FlexboxLayout class="page">
      <GridLayout row="auto, auto, auto">
        <StackLayout>
          <Label text="Xin Chào" class="page_title" />
          <Label text="Hãy đăng nhập bằng tài khoản của bạn." class="page_sub_title" textWrap="true"/>
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
          <Button id="btn_login" @tap="validateInput()" text="Đăng Nhập" class="btn btn-primary" :isEnabled ="!processing"/>
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
import Vue from "nativescript-vue";
import fetchModule from "tns-core-modules/fetch";
const configApi = require("../service/config");
const stringConst = require("../assets/StringConst");


export default {
  data() {
    return {
      processing: false,
      user: {
        email: "nguyengocbinh@gmail.com",
        password: "JsgkHSZBJO"
      }
    };
  },
  methods: {
    validateInput() {
      if (!this.user.email || !this.user.password) {
        this.showDlg(stringConst.lbl_notification, stringConst.msg_fill_emai_pass);
        return;
      }

      if (!this.validateEmail()) {
        this.showDlg(stringConst.lbl_notification, stringConst.msg_email_not_match);
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
      fetchModule
        .fetch(configApi.loginUrl, {
          method: "POST",
          headers: configApi.headers,
          body: JSON.stringify({
            Email: this.user.email,
            Password: this.user.password
          }),
        })
        .then(
          response => {
            var contentJson = JSON.parse(response._bodyInit);
            if (response.ok) {
              this.loginSuccess(contentJson);
            } else {
              var errMsg = contentJson.error_message;
              if (errMsg == "Your email and password not match") {
                errMsg = stringConst.msg_email_pass_not_math;
              }
              this.loginFail(errMsg);
            }
          },
          e => {
            var errMsg = e.message;
            if (errMsg.includes("UnknownHostException")) {
              errMsg = stringConst.msg_unknow_host_exception;
            }
            this.loginFail(errMsg);
          }
        );
    },
    loginSuccess(json) {
      this.processing = false;
      var forceChangePass = json.abiz_forcechangepassword.value;
      var clientCode = json.abiz_clientcode.value;

      if (forceChangePass) {
        confirm({
          title: stringConst.lbl_change_pass,
          message: stringConst.msg_should_change_pass,
          okButtonText: stringConst.lbl_accept
        }).then(function(result) {
          Vue.prototype.$navigateTo(ChangePass, {
            clearHistory: true,
            animated: true,
            transition: {
              name: "fade",
              duration: 700
            }
          });
        });
      } else {
        this.gotoHome();
      }
    },
    loginFail(errMessage) {
      this.processing = false;
      this.showDlg(stringConst.lbl_login_fail, errMessage);
    },
    gotoHome() {
      this.$navigateTo(Home, {
        clearHistory: true,
        animated: true,
        transition: {
          name: "fade",
          duration: 700
        }
      });
    },
    updatedPassSuccess(isUpdated) {
      this.processing = false;
      this.gotoHome();
    },
    forgotPassword() {
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
            this.showDlg(
              stringConst.lbl_success,
              stringConst.msg_enter_your_email
            );
          } else {
            this.showDlg(stringConst.lbl_notification, stringConst.msg_email_pass_not_math);
          }
        }
      });
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
