<template>
  <StackLayout id="home_parent">
    <RadCalendar
      id="chkInCalendar"
      eventsViewMode="None"
      selectionMode="Single"
      :viewMode="viewCalendarMode"
      transitionMode="Stack"
      :minDate="minDate"
      :maxDate="maxDate"
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
            <Image src="res://ic_check_white" row="0" col="0" rowSpan="2" :class="item.state == 1 ? 'cbx-checked' : item.state == 0 ? 'cbx-ready' : 'cbx'"/>
            <Label :text="item.time" class row="0" col="1" rowSpan="2" />
            <StackLayout row="0" col="2">
              <Label :text="item.store" class="item-header" textWrap="true"/>
              <Label :text="item.address" class="item-header-sub" textWrap="true"/>
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
        v-show="isSelectedCurrentDate"
        @tap="onClickCheckIn()"
        :isEnabled="!isChkInProscess"
      />
    </GridLayout>
  </StackLayout>
</template>
<script>
import Vue from "nativescript-vue";
import CalendarView from "nativescript-ui-calendar/vue";
Vue.use(CalendarView);

import CheckIn from "../CheckIn/CheckIn";
import Transition from "../../share/Transition";
import CurrentUser from "../../data/CurrentUser";
import StringConst from "../../assets/StringConst";

const ObservableArray = require("tns-core-modules/data/observable-array")
  .ObservableArray;
const Constant = require("../../data/Constant");
const now = new Date();
export default {
  mounted() {
    var ls = [];
    // dummy data 
    for(var i = 9; i < 22; i++) {
      var currentHour = now.getHours();
      var itemState = Constant.CHECK_IN_STATE.UNCHECK;

      if (i == currentHour) {
        // itemState = Constant.CHECK_IN_STATE.READY;
        itemState = now.getMinutes() <= Constant.CHECK_IN_TIME_BY_MIN ? Constant.CHECK_IN_STATE.READY : Constant.CHECK_IN_STATE.CHECKED;
      } else if(i - currentHour == 1 &&  now.getMinutes() > Constant.CHECK_IN_TIME_BY_MIN) {
        itemState = Constant.CHECK_IN_STATE.READY;
      } else if(i - currentHour < 0) {
        itemState = Constant.CHECK_IN_STATE.CHECKED;
      }
      var item = {
          id: i*100,
          store: "Takashimaya Vietnam",
          address: "92-94 Nam Kỳ Khởi Nghĩa, Bến Nghé, Q.1",
          time: i + ":00",
          date: now.toLocaleDateString(),
          state: itemState
        };
        ls.push(item);
        this.currCheckInList.push(item);
    }

    var yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    for(var i=7; i < 23; i=i+4) {
      var itemState = Constant.CHECK_IN_STATE.CHECKED;
      var item = {
          id: i * 100,
          store: "Takashimaya Vietnam",
          address: "92-94 Nam Kỳ Khởi Nghĩa, Bến Nghé, Q.1",
          time: i + ":00",
          date: yesterday.toLocaleDateString(),
          state: itemState
        };
        ls.push(item);
    }

    var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
    for(var i = 7; i < 23; i= i + 4) {
      var itemState = Constant.CHECK_IN_STATE.UNCHECK;
      var item = {
          id: i*100,
          store: "Takashimaya Vietnam",
          address: "92-94 Nam Kỳ Khởi Nghĩa, Bến Nghé, Q.1",
          time: i + ":00",
          date: tomorrow.toLocaleDateString(),
          state: itemState
        };
        ls.push(item);
    }
    this.checkInList = ls;
  },
  created() {
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
      checkInList: [],
      currCheckInList: []
    };
  },
  methods: {
    isToday(date) {
      return (
        date.getDate() == now.getDate() &&
        date.getMonth() == now.getMonth() &&
        date.getFullYear() == now.getFullYear()
      );
    },
    onDateSelected(args) {
      const selectedDateStr = args.date.toLocaleDateString();
      this.selectedDate = selectedDateStr;
      this.isSelectedCurrentDate = this.isToday(args.date);
      this.currCheckInList = this.checkInList.filter(function(item) {
        return item.date == selectedDateStr;
      });
    },
    onDateDeselected(args) {
    },
    onNavigatedToDate(args) {
    },
    onNavigatingToDateStarted(args) {
    },
    onViewModeChanged(args) {
      console.log("onViewModeChanged: " + args.newValue);
      args.object.viewMode = "Week";
    },
    callBackCheckIn(data) {
      this.isChkInProscess = false;
      if(data == undefined || !data.isSuccess) {
        return;
      }
      
      var currHour = (new Date()).getHours();
      var newReadyItems = this.currCheckInList.filter(function(item) { 
        const itemHour = item.time.split(":")[0]
        return item.state == Constant.CHECK_IN_STATE.UNCHECK &&  currHour < itemHour;
      });

      if(newReadyItems.length > 0) {
        newReadyItems[0].state = Constant.CHECK_IN_STATE.READY;
      }
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
      var readyItems = this.currCheckInList.filter(function(item) { 
        return item.state == Constant.CHECK_IN_STATE.READY;
      });

      if(readyItems.length == 0) {
        var currHour = (new Date()).getHours();
        var newReadyItems = this.currCheckInList.filter(function(item) { 
          const itemHour = item.time.split(":")[0]
          return item.state == Constant.CHECK_IN_STATE.UNCHECK &&  currHour < itemHour;
        });

        if(newReadyItems.length > 0) {
          newReadyItems[0].state = Constant.CHECK_IN_STATE.READY;
          readyItems.push(newReadyItems[0]);
        }
      }

      if(readyItems.length > 0) {
        var firstReadyItem = readyItems[0];
        var readyHourMin = firstReadyItem.time.split(":"); 
        var readyDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), readyHourMin[0], readyHourMin[1], 0);
        var currDate = new Date();
        currDate.setMilliseconds(0);
        var spaceTime = Math.abs(readyDate.getTime() - currDate.getTime());
        if(Constant.CHECK_IN_TIME - spaceTime >= 1) {
          this.showCheckInPage(firstReadyItem);
        }else {
          this.isChkInProscess = false;
          this.showDlg(StringConst.lbl_notification, StringConst.msg_dont_allow_check_in);
          // this.showCheckInPage(firstReadyItem);
        } 
      } else {
        this.isChkInProscess = false;
      }
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
</style>