<template>
  <Page actionBarHidden="true">
    <GridLayout rows="50, *" columns="*" >
      <FlexboxLayout class="page" row="0" col="1" rowSpan="2">
        <GridLayout rows="auto, auto, auto" columns="*">
          <StackLayout>
            <Label text="UPDATE PASSWORD" class="page_title_small" />
            <TextField
              id="txt_old_pass"
              v-model="user.oldPass"
              hint="Current Password"
              secure="true"
              autocorrect="false"
              class="input-margin"
            />
            <TextField
              id="txt_new_pass"
              v-model="user.newPass"
              hint="New Passowrd"
              secure="true"
              autocorrect="false"
              class="input-margin"
            />
            <TextField
              id="txt_confirm_pass"
              v-model="user.confirmPass"
              hint="Please fill new password again"
              secure="true"
              autocorrect="false"
              class="input-margin"
            />
            <Button id="btn_submit" @tap="validateInput()" text="UPDATE" class="btn btn-primary input-margin" :isEnabled = "!processing"  />
          </StackLayout>
          <ActivityIndicator v-show="processing" busy="true"/>
        </GridLayout>
      </FlexboxLayout>
      <Label :text="'fa-arrow-left' | fonticon" class="fas font-icon-default text-color-white font-icon-size-28 text-ver-top text-left " style="margin-left: 5%; margin-top: 24;" v-show="isShowBackButton" @tap="$navigateBack" row="0" col="0" />
    </GridLayout>
  </Page>
</template>

<script>
import Login from "./Login";
import CurrentUser from '../data/CurrentUser';
import QueryBuilder from "../storaged/QueryBuilder";
const stringConst = require("../assets/StringConst");
const apiService = require("../service/BackEndService");
const remember = require("../share/Remember");
const transition = require("../share/Transition");

export default {
  created() {
    this.isShowBackButton = !remember.getFroceChangePass();
  },
  data() {
    return {
      isShowBackButton: false,
      processing: false,
      user: {
        oldPass: "",
        newPass: "",
        confirmPass: ""
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

      if (this.user.confirmPass != this.user.newPass) {
        this.showDlg(
          stringConst.lbl_notification,
          stringConst.msg_confirm_new_pass_is_not_match
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
      // CurrentUser.methods.logout();

      // this.$store.state.tables.forEach(tableName => {
      //   var query = QueryBuilder.buildQueryDeleteAll(tableName);
      //     this.$store.state.database.execSQL(query, []).then(result => {}).catch((error) => {})
      // });

    
      Promise.all([new Promise((resolve, reject) => {
        CurrentUser.methods.logout();

        this.$store.customers = [];
        this.$store.provinces = [];
        this.$store.invoices = [];
        resolve("Clear all cache successful.");
      }), new Promise((resolve, reject) => {
        this.$store.state.tables.forEach(tableName => {
          var query = QueryBuilder.buildQueryDeleteAll(tableName);
            this.$store.state.database.execSQL(query, []).then(result => {}).catch((error) => {})
        });
        resolve("Clear all records successful.");
      })]).then(values => {
        this.processing = false;
        this.gotoLogin();
      })
    },
    gotoLogin() {
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

<style scoped lang="scss">
@import "../app-variables.scss";

FlexboxLayout,
AbsoluteLayout {
  justify-content: center;
  align-items: center;
  background: $color-primary;
}

StackLayout {
  width: 90%;
  padding: 12 16;
  background-color: #f0f0f0;
  border-radius: 10%;
}

.input-margin {
  margin: 0 0 12 0;
}

#btn_submit {
  margin: 12 0;
}

TextField {
  border-width: 0.5;
  border-color: $color-primary;
  border-radius: 8;
  padding: 12 16;
}

.page_title_small {
  margin-bottom: 32;
}
</style>
