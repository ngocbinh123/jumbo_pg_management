<template>
  <Page actionBarHidden="true">
    <FlexboxLayout class="page">
      <GridLayout row="auto, auto, auto">
        <StackLayout>
          <Label text="CẬP NHẬT MẬT KHẨU" class="page_title_small" />
          <TextField
            id="txt_old_pass"
            v-model="user.oldPass"
            hint="Mật khẩu hiện tại"
            secure="true"
            autocorrect="false"
          />
          <TextField
            id="txt_new_pass"
            v-model="user.newPass"
            hint="Mật khẩu mới"
            secure="true"
            autocorrect="false"
          />
          <Button id="btn_submit" @tap="validateInput()" text="CẬP NHẬT" class="btn btn-primary" :isEnabled = "!processing"  />
        </StackLayout>
        <ActivityIndicator v-show="processing" busy="true"/>
      </GridLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
import Login from "./Login";
const stringConst = require("../assets/StringConst");
const apiService = require("../service/BackEndService");
const remember = require("../share/Remember");
const transition = require("../share/Transition");
export default {
  data() {
    return {
      processing: false,
      user: {
        oldPass: "",
        newPass: ""
      }
    };
  },
  methods: {
    validateInput() {
      if (!this.user.oldPass || !this.user.newPass) {
        this.showDlg(
          stringConst.lbl_notification,
          stringConst.msg_fill_current_new_pass
        );
        return;
      }

      if (this.user.newPass.length < 6) {
        this.showDlg(
          stringConst.lbl_notification,
          stringConst.msg_pass_should_be_least_6_characters
        );
        return;
      }

      if (this.user.oldPass == this.user.newPass) {
        this.showDlg(
          stringConst.lbl_notification,
          stringConst.msg_new_pass_diff_curr_pass
        );
        return;
      }

      this.processing = true;
      this.submitData();
    },

    submitData() {
      var bearId = remember.getBearId();
      apiService.methods
        .changepassword(this.user.oldPass, this.user.newPass, bearId)
        .catch(this.apiRequestFail)
        .then(this.apiRequestSuccess);
    },

    apiRequestSuccess(json) {
      if(!json) {
        return;
      }
      remember.setFroceChangePass(false);
      this.processing = false;
      this.$navigateTo(Login, {
        clearHistory: true,
        animated: true,
        transition: transition.prePageTransition
      });
    },
    apiRequestFail(e) {
      var errMsg = e.message;
      if (errMsg.includes("UnknownHostException")) {
        errMsg = stringConst.msg_unknow_host_exception;
      }
      this.processing = false;
      this.showDlg(stringConst.lbl_fail, errMsg);
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
  background: linear-gradient(#007882, #22aa8f);
}

StackLayout {
  width: 90%;
  padding: 12 16;
  background-color: #f0f0f0;
  border-radius: 10%;
}

#txt_old_pass,
#btn_submit {
  margin-bottom: 12;
}

#txt_new_pass {
  margin-bottom: 16;
}

TextField {
  border-width: 0.5;
  border-color: #22aa8f;
  border-radius: 8;
  padding: 12 16;
}

.page_title_small {
  margin-bottom: 32;
}
</style>
