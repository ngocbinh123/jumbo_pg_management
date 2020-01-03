<template>
  <GridLayout id="trans_parent" columns="*" rows="auto, *">
    <GridLayout rows="10, 60, *" columns="50, *, 50" row="1" col="0">
      <ListView row="0" col="0" colSpan="3" rowSpan="3" for="customer in remoteCustomers"  @itemTap="onCustomerSelected">
        <v-template>
          <GridLayout flexDirection="row" rows="auto, auto, auto, auto" columns="10,*, 10" class="ls-item-check-in">
            <StackLayout orientation="horizontal" class="parent-center" row="0" col="1">
              <Label :text="'fa-address-card' | fonticon" class="far font-icon font-icon-size-14" width="6%" />
              <Label :text="customer.abiz_contactcode" class="item-header-sub" textWrap="true" />
            </StackLayout>
            <StackLayout orientation="horizontal" class="parent-center" row="1" col="1">
              <Label :text="'fa-user' | fonticon" class="far font-icon font-icon-size-14" width="6%" />
              <Label :text="customer.fullname" class="item-header text-color-primary-dark" textWrap="true" />
            </StackLayout>
            <StackLayout orientation="horizontal" class="parent-center" row="2" col="1">
              <Label :text="'fa-mobile-alt' | fonticon" class="fas font-icon font-icon-size-14" width="6%"/>
              <Label :text="customer.mobilephone" class="item-header-sub" textWrap="true" />
            </StackLayout>
            <StackLayout orientation="horizontal" class="parent-center" row="3" col="1">
              <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon font-icon-size-14" style="vertical-align:top; padding:5 0 0 0" width="6%"/>
              <Label :text="getCustomerAddress(customer)" textWrap="true" class="item-header-sub"/>                  
            </StackLayout>
          </GridLayout>
        </v-template>
      </ListView>
      <Button class="btn btn-add" text="+" row="1" col="2" @tap="createCustomer()"/>

      <Label v-if="!isProcessing && remoteCustomers.length == 0" text="Hiện tại không có khách hàng." class="text-center" margin="24" color="red" row="0" col="0" colSpan="3" rowSpan="3" />
    </GridLayout>
    
    <ActivityIndicator v-show="isProcessing" busy="true" row="0" col="0" rowSpan="2" />
  </GridLayout>
</template>
<script>
// pages 
import UserDetail from "../Customer/UserDetail";
// import CreateTransaction from "../Transaction/CreateTransaction";
import CreateCustomer from "../Customer/CreateNewCustomer";
// import TransactionDetail from "./TransactionDetail";
// import DatePickerDlg from "../Dialog/DateWithoutLimitPickerDlg";

// other
import CurrentUser from "../../data/CurrentUser";
import StringConst from "../../assets/StringConst";
import ApiService from "../../service/BackEndService";
import Helper from '../../helper/PopularHelper';
import Remember from '../../share/Remember';
import * as firebase from"nativescript-plugin-firebase";
import Constant from "../../data/Constant";
import { error } from '@nativescript/core/trace/trace';

export default {
  created() {
    var currentDate = new Date();
    this.selectedDate = Helper.getCurrentDateStr();

    this.remoteCustomers = Remember.getRemoteCustomers().records;
    this.remoteOrders = Remember.getRemoteOrders().records;

    this.getRemoteCustomers();
    this.getRemoteOrders();
  },
  data() {
    return {
      count: this.$store.state.count,
      isProcessing: false,
      selectedIndex: 0,
      searchTransValue:"",
      selectedDate: "",
      remoteCustomers: [],
      remoteOrders: [],
      transList:[],
      tabs: ["ĐƠN HÀNG", "KHÁCH HÀNG"],
      selectedTabItem: 0
    };
  },
  methods: {
    trackingPage() {
      firebase.analytics.logEvent({
      key: Constant.KEY_PAGE_VIEW,
      parameters: [
          {
            key: Constant.KEY_PAGE_ID, 
            value: "TAB_ORDER"
          }
        ]
      });
    },
    onSelectedIndexChange(arg) {
      console.log("onSelectedIndexChange: ", arg.value);
      this.selectedTabItem = arg.value;
    },
    onCustomerSelected(event) {
      if (this.isProcessing) {
        return;
      }

      this.isProcessing = true;
      this.$showModal(UserDetail, { 
        fullscreen: true, 
        animated: true,
        props: { customer: event.item }
      }).then(result => {this.isProcessing = false});
    },
    createCustomer() {
      if (this.isProcessing) {
        return
      }
      this.isProcessing = true;
      this.$showModal(CreateCustomer, { 
        fullscreen: true,
         animated: true,
        }).then(this.callbackCreateCustomer);
    },
    callbackCreateCustomer(response) {
      this.isProcessing = false;
      if(response == undefined || !response.isSuccess) {
        return;
      }

      const oldCustomer = this.remoteCustomers.find(el => Helper.equalsIgnoreCase(el.contactid, response.customer.contactid));
      if (oldCustomer != undefined) {
        this.showDlg(StringConst.lbl_notification, "Khách hàng này đã có trong hệ thống với tên là: " + oldCustomer.fullname + ".");
      }else {
        this.remoteCustomers.unshift(response.customer);
        this.onCustomerSelected({ item: response.customer});
      }
    },
    getRemoteOrders() {
       this.isProcessing = true;
      ApiService.methods.getOrders(Helper.convertLocalDateToRequestDate(this.selectedDate), CurrentUser.methods.getBearId())
        .then(json => {
          this.remoteOrders = json.records;
          this.isProcessing = false;
          Remember.setRemoteOrders(json);
        })
        .catch(error => {
          this.isProcessing = false;
        });
    },
    getRemoteCustomers() {
      this.isProcessing = true;
      const currentDate= Helper.getCurrentDateStrForRequest();
      ApiService.methods.getCustomers(currentDate,CurrentUser.methods.getBearId())
      .then(json => {
        this.remoteCustomers = json.records;
        Remember.setRemoteCustomers(json);
        this.isProcessing = false;
      })
      .catch(error => {
        console.log("GET_REMOTE_CUSTOMER_ERROR", error.message);
        this.isProcessing = false;
      });
    },
    showDlg(dlgTitle, dlgMsg) {
      return alert({
        title: dlgTitle,
        okButtonText: StringConst.lbl_close,
        message: dlgMsg
      });
    },
    getLocalGender(gendercode) {
      return !gendercode.value ? "" : gendercode.value == Constant.GENDER.Male.value ? Constant.GENDER.Male.text : Constant.GENDER.Female.text;
    },
    convertRequestDateToLocalDate(remoteDate) {
      return Helper.convertRequestDateToLocalDate(remoteDate);
    }, 
    formatCurrencystr(currency) {
      return Helper.formatCurrencystr(currency);
    },
    getCustomerAddress(customer) {
      return Helper.getFullCustomerAddress(customer);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../app-variables.scss";

.seg-bar {
  font-family: "f_arima_madurai_extra_bold", "Arima Madurai";
  color: $color-primary-dark;
  font-size: 18;
  font-weight: bolder;
}
.page_title_small {
  font-family: "f_arima_madurai_bold", "Arima Madurai";
  color: $color-accent;
  margin: 0;
  vertical-align: middle;
}

.parent-center {
  vertical-align: middle;
  margin: 6 0 0 0;
}

.icon {
  width: 16;
  vertical-align: middle;
}

.icon-small {
  width: 14;
  vertical-align: middle;
}

.time {
  font-size: 16;
  vertical-align: middle; 
}

.date {
  font-family: "f_arima_madurai_thin", "Arima Madurai";
  font-size: 16;
  vertical-align: middle; 
}
</style>