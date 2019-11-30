<template>
  <StackLayout id="home_parent">
    <RadCalendar
      id="chkInCalendar"
      eventsViewMode="None"
      selectionMode="Single"
      :viewMode="viewCalendarMode"
      transitionMode="Stack"
      locale="vi-VN"
      @dateSelected="onDateSelected"
      @dateDeselected="onDateDeselected"
      @navigatedToDate="onNavigatedToDate"
      @navigatingToDateStarted="onNavigatingToDateStarted"
      @viewModeChanged="onViewModeChanged"
    />
    <GridLayout columns="*, 100, *" rows="*, 50">
      <ListView row="0" colSpan="3" rowSpan="2" for="item in currCheckInList">
        <v-template>
          <GridLayout flexDirection="row" row="*" columns="50, 50, auto" class="ls-item-check-in">
            <!-- late -->
            <Label :text="'fa-circle' | fonticon" class="far font-icon-late" v-if="item.statuscode.value == 100000000" row="0" col="0" rowSpan="2"/>
            <!-- miss -->
            <Label :text="'fa-times-circle' | fonticon" class="fas font-icon-missed" v-if="item.statuscode.value == 100000001" row="0" col="0" rowSpan="2"/>
            <!-- ontime -->
            <Label :text="'fa-check-circle' | fonticon" class="fas font-icon-ontime" v-if="item.statuscode.value == 2" row="0" col="0" rowSpan="2"/>
            <!-- plainning -->
            <Label :text="'fa-circle' | fonticon" class="far font-icon-plainning" v-if="item.statuscode.value == 1" row="0" col="0" rowSpan="2"/>  

            <Label :text="item.abiz_requestedtime" class row="0" col="1" rowSpan="2" />
            <StackLayout row="0" col="2">
              <Label :text="item.s_abiz_outletid.text" class="item-header" textWrap="true"/>
              <Label :text="item.o_abiz_addresscalculated" class="item-header-sub" textWrap="true"/>
            </StackLayout>
          </GridLayout>
        </v-template>
      </ListView>
      <Button
        id="btn_check_in"
        text="CHẤM CÔNG"
        class="btn-fill-bg"
        row="2"
        col="1"
        v-show="isSelectedCurrentDate && currCheckInList.length > 0"
        @tap="onClickCheckIn()"
        :isEnabled="!isChkInProscess"
      />
      <ActivityIndicator v-show="isChkInProscess" busy="true" row="0" colSpan="3" rowSpan="2" />
      <Label v-if="!isChkInProscess && currCheckInList.length == 0" text="Không có dữ liệu Chấm công." class="text-center" margin="24" color="red" row="0" colSpan="3" rowSpan="2" />

    </GridLayout>
  </StackLayout>
</template>
<script>
import Vue from "nativescript-vue";
import CalendarView from "nativescript-ui-calendar/vue";
Vue.use(CalendarView);

import CheckIn from "../CheckIn/CheckIn";
import TakePicForChkIn from "../CheckIn/TakePictureForCheckIn";
import Transition from "../../share/Transition";
import CurrentUser from "../../data/CurrentUser";
import StringConst from "../../assets/StringConst";
import ApiService from '../../service/BackEndService';
import * as firebase from"nativescript-plugin-firebase";
import Constant from "../../data/Constant";

// const ObservableArray = require("tns-core-modules/data/observable-array")
//   .ObservableArray;
// const Constant = require("../../data/Constant");
const now = new Date();
export default {
  mounted() {
    this.fetchCheckInSchedules();
  },
  created() {
    this.trackintPage();
    var current = new Date();
    var firstDate = new Date(current.getFullYear(), current.getMonth(), 1);
    var lastDate = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    this.minDate = firstDate;
    this.maxDate = lastDate;
  },
  data() {
    return {
      viewCalendarMode: "Week",
      isChkInProscess: false,
      minDate: new Date(now.getFullYear(), now.getMonth(), 1),
      maxDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      currentDate: now,
      selectedDate: now,
      isSelectedCurrentDate: true,
      currCheckInList: []
    };
  },
  methods: {
    trackintPage() {
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
    isToday(date) {
      return (
        date.getDate() == now.getDate() &&
        date.getMonth() == now.getMonth() &&
        date.getFullYear() == now.getFullYear()
      );
    },
    onDateSelected(args) {
      const selectedDateStr =args.date.getFullYear() + "-" +  (args.date.getMonth()+1) + "-" +  args.date.getDate();
      if (selectedDateStr == this.selectedDate) {
        return;  
      }

      this.selectedDate = selectedDateStr;
      this.isSelectedCurrentDate = this.isToday(args.date);
      this.fetchCheckInSchedules(); 
    },
    onDateDeselected(args) {
    },
    onNavigatedToDate(args) {
    },
    onNavigatingToDateStarted(args) {
    },
    onViewModeChanged(args) {
      args.object.viewMode = "Week";
    },
    callBackCheckIn(data) {
      this.isChkInProscess = false;
      if(data == undefined || !data.isSuccess) {
        return;
      }
      
      this.fetchCheckInSchedules();
      this.showDlg(StringConst.lbl_success, StringConst.msg_check_in_success);
    },
    showCheckInPage(chkItem) {
      this.$showModal(CheckIn, { 
        fullscreen: true, 
        animated: true,
        transition: Transition.pageTransition,
        props: { checkInItem: chkItem }
        }).then(this.callBackCheckIn);
    },
    onClickCheckIn() {
      this.isChkInProscess = true;
      this.showCheckInPage({});
    },
    fetchCheckInSchedules() {
      // console.log("BEARER", CurrentUser.methods.getBearId());
      this.isChkInProscess = true;
      this.currCheckInList = [];
      ApiService.methods.getSessions(this.selectedDate, CurrentUser.methods.getBearId())
      .then(this.callbackGetSessionSuccess)
      .catch(this.callbackGetSessionFail);
    },
    callbackGetSessionSuccess(obj) {
      this.isChkInProscess = false;
      this.currCheckInList = obj.records;
    },
    callbackGetSessionFail(error) {
      this.isChkInProscess = false;
      this.showDlg(StringConst.lbl_error, error.message);
    },
    openCamera() {
      this.$showModal(TakePicForChkIn, {
              fullscreen: true,
              animated: true
          });
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

#home_parent {
}
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
    vertical-align: top;
    text-align: center;
}

.font-icon-late {
    color: orange;
    vertical-align: top;
    text-align: center;
}

.font-icon-missed {
    color: $color-accent;
    vertical-align: top;
    text-align: center;
}

.font-icon-plainning {
    // color: $color-primary;
    vertical-align: top;
    text-align: center;
}
</style>