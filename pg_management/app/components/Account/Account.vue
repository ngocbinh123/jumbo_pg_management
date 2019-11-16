<template>
  <GridLayout id="account_parent" columns="*" rows="auto, *, auto">
    <Button id="btn_logout" @tap="confirmLogoutOut()" class="btn-secondary" text="ĐĂNG XUẤT" row="3" colspan="3" />
  </GridLayout>
</template>

<script>
import Transition from "../../share/Transition";
import ResourceString from "../../assets/StringConst";
import CurrentUser from "../../data/CurrentUser";

import Login from "../Login";

export default {
  data() {
    return {
      isProcessing: false
    };
  },
  methods: {
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
      CurrentUser.methods.logout();
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

#btn_logout {
  margin: 12;
}
</style>