<template>
  <GridLayout rows="50, *, auto" columns="50, *, 50" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="3" width="100%">
        <Label text="NOTIFICATION" textWrap="true" class="text-center"/>
    </FlexboxLayout>
    
    <StackLayout class="margin-top" row="1" col="0" colSpan="3" style="margin: 32 16">
        <Label :text="notification.name" class="dlg_title text-center" />
        <Label :text="notification.datetime" class="item-header-sub text-center" style="font-size:16" />
        <Label :text="notification.body" textWrap="true" class="" style="font-size:16; margin: 16 0 0 0"/>
    </StackLayout>
    <Button text="CLOSE" class="btn btn-fill-bg"  @tap="closePage()" row="2" col="0" colSpan="3"/>
    <ActivityIndicator v-show="isProcessing" busy="true" row="0" col="0" rowSpan="15" colSpan="5" />
  </GridLayout>
</template>
<script>
import * as firebase from"nativescript-plugin-firebase";
import Constant from "../../data/Constant";
import ApiService from "../../service/BackEndService";
import CurrenntUser from "../../data/CurrentUser";
import StringConst from "../../assets/StringConst";
import Helper from "../../helper/PopularHelper";

export default {
  props: ["notification"],
  created() {
    this.trackingPage();
  },
  data() {
    return {
      isProcessing: false
    };
  },
  methods: {
    trackingPage() {
      firebase.analytics.logEvent({
      key: Constant.KEY_PAGE_VIEW,
      parameters: [
          {
            key: Constant.KEY_PAGE_ID, 
            value: "SHOW_NOTIFICATION_DETAIL"
          }
        ]
      });
    },
    closePage() {
      this.$modal.close();
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
</style>