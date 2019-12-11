<template>
  <GridLayout id="trans_parent" columns="*" rows="*">
    <TabView 
    tabTextColor="#008C99"
    selectedTabTextColor="white"
    tabBackgroundColor="#007882"
    androidOffscreenTabLimit="0"
    androidSelectedTabHighlightColor="white"
    :selectedIndex="selectedIndex" 
    col="0" row="0">
      <TabViewItem title="ĐƠN HÀNG">
        <GridLayout rows="10, 60, *" columns="10, *, 50">
          <Label :text="date" class="page_title_small text-center" row="1" col="0"  colSpan="3"/>
          <Button class="btn btn-add" text="+" row="1" col="2" @tap="createTransaction()"/>
          <ListView row="2" col="0" colSpan="3" rowSpan="2" for="item in remoteOrders" @itemTap="onSelectedTransaction">
            <v-template>
              <GridLayout flexDirection="row" rows="*,*,*,*" columns="10,100,*" class="ls-item-check-in">
                <Label :text="item.abiz_ordertime" class="text-center time"  row="0" col="1"/>
                <Label :text="item.abiz_ordercode" class="item-header" textWrap="true" row="0" col="2"/>

                <Label :text="convertRequestDateToLocalDate(item.abiz_orderdate)" class="text-center date" row="1" col="1"/>

                <StackLayout orientation="horizontal" class="parent-center" row="1" col="2">
                  <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon"  width="8%" />
                  <Label :text="item.abiz_outletid.text" class="item-header-sub" textWrap="true" />
                </StackLayout>
                <StackLayout orientation="horizontal" class="parent-center" row="2" col="2">
                  <Label :text="'fa-user' | fonticon" class="far font-icon" width="8%" />
                  <Label :text="item.abiz_contactid.text" class="item-header-sub" />                  
                </StackLayout>

                <StackLayout orientation="horizontal" class="parent-center" row="3" col="2">
                  <Label :text="'fa-money-bill-alt' | fonticon" class="far font-icon"  width="8%"/>
                  <Label :text="item.abiz_totalamountrollup" class="item-header-sub" />                  
                </StackLayout>
              </GridLayout>
            </v-template>
          </ListView>
          <Label v-if="!isProcessing && remoteOrders.length == 0" text="Hiện tại Không có đơn hàng." class="text-center" margin="24" color="red" row="2" col="0" colSpan="3" rowSpan="2" />

        </GridLayout>
      </TabViewItem>
      <TabViewItem title="KHÁCH HÀNG" >
        <GridLayout rows="10, 60, *" columns="10, *, 50">
          <Button class="btn btn-add" text="+" row="1" col="2" @tap="createCustomer()"/>
          <ListView row="0" col="0" colSpan="3" rowSpan="3" for="customer in remoteCustomers"  @itemTap="onCustomerSelected">
            <v-template>
              <GridLayout flexDirection="row" rows="*,*,*" columns="10,100,*" class="ls-item-check-in">
                <Label :text="customer.abiz_contactcode" class="text-center time"  row="0" col="1"/>
                <Label :text="customer.fullname" class="item-header" textWrap="true" row="0" col="2"/>
                <StackLayout orientation="horizontal" class="parent-center" row="1" col="2">
                  <Label :text="'fa-mobile-alt' | fonticon" class="fas font-icon font-icon-size-14" width="6%" row="1" col="2" />
                  <Label :text="customer.mobilephone" class="item-header-sub" textWrap="true" />
                </StackLayout>
                <StackLayout orientation="horizontal" class="parent-center" row="2" col="2">
                  <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon font-icon-size-14" width="6%" row="1" col="2" />
                  <Label :text="customer.abiz_provinceid.text" class="item-header-sub" />                  
                </StackLayout>
              </GridLayout>
            </v-template>
          </ListView>
          <Label v-if="!isProcessing && remoteCustomers.length == 0" text="Hiện tại không có khách hàng." class="text-center" margin="24" color="red" row="0" col="0" colSpan="3" rowSpan="3" />
        </GridLayout>
      </TabViewItem>
    </TabView>
    <ActivityIndicator v-show="isProcessing" busy="true" row="0" col="0"/>
  </GridLayout>
</template>
<script>
// pages 
import UserDetail from "../Customer/UserDetail";
import CreateTransaction from "../Transaction/CreateTransaction";
import CreateCustomer from "../Customer/CreateNewCustomer";
import TransactionDetail from "./TransactionDetail";

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
    this.date = Helper.getCurrentDateStr();

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
      date: "",
      remoteCustomers: [],
      remoteOrders: [],
      transList:[]
    };
  },
  methods: {
    trackintPage() {
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
    onSelectedTransaction(event) {
      if (this.isProcessing) {
        return
      }

      this.isProcessing = true;
      var selected = {
        id: event.item.abiz_orderid,
        code: event.item.abiz_ordercode,
        store: event.item.abiz_outletid.text,
        transTotal: event.item.abiz_totalamountrollup,
        displayTransTotal: Helper.formatCurrencystr(event.item.abiz_totalamountrollup),

        customer: {
            id: "",
            fullname: "",
            mobilephone: "",
            address: "",
            gender: ""
        },
        time: Helper.convertRequestDateToLocalDate(event.item.abiz_orderdate),
        date: event.item.abiz_ordertime,
        products: []
      };

      const orderCustomer = this.remoteCustomers.find(el => el.contactid == event.item.abiz_contactid.value || el.fullname == event.item.abiz_contactid.text || el.mobilephone == event.item.mobilephone);
      if(orderCustomer != undefined) {
        selected.customer.id = 101;
        selected.customer.fullname = orderCustomer.fullname;
        selected.customer.mobilephone = orderCustomer.mobilephone;
        selected.customer.address = orderCustomer.abiz_provinceid.text;
        selected.customer.gender = this.getLocalGender(orderCustomer.gendercode);
      }
      const that = this;
      const query = "SELECT productId, productName, number, price, total, invoiceCode FROM InvoiceDetail WHERE invoiceCode = ?";
      this.$store.state.database.all(query, [selected.code]).then(result => {
        result.forEach(row => {
          var product = {
              id:row[0],
              model:"",
              name: row[1],
              number: row[2],
              price: row[3],
              total: row[4]  
          };
          selected.products.push(product);
        });
        
        that.openTransactionDetail(selected);
      }, error => {
          console.log("SELECT INVOICE DETAIL ERROR", error);
          this.openTransactionDetail(selected);
      });
    },
    openTransactionDetail(transaction) {
      this.$showModal(TransactionDetail, { 
        fullscreen: true,
        animated: true,
        props: { transaction: transaction }
      }).then(result => {
        this.isProcessing = false
      });
    },
    onCustomerSelected(event) {
      if (this.isProcessing) {
        return;
      }

      this.isProcessing = true;
      this.$showModal(UserDetail, { 
        fullscreen: false, 
        animated: true,
        props: { customer: event.item }
      }).then(result => {this.isProcessing = false});
    },
    createTransaction() {
      if (this.isProcessing) {
        return
      }

      this.isProcessing = true;
      this.$showModal(CreateTransaction, { 
        fullscreen: true,
        animated: true,
        }).then(this.callbackCreateTransaction);
    },
    callbackCreateTransaction(response) {
      this.isProcessing = false;
      if (response == undefined || !response.isSuccess) {
        return;
      }

      const isNewCustomer = this.remoteCustomers.find(el => el.contactid == response.rermoteCustomer.contactid || 
                                                    el.abiz_contactcode == response.rermoteCustomer.abiz_contactcode|| 
                                                    el.fullname == response.rermoteCustomer.fullname || 
                                                    el.mobilephone == response.rermoteCustomer.mobilephone) == undefined;

      if (isNewCustomer) {
        this.remoteCustomers.unshift(response.rermoteCustomer);
      }
      this.getRemoteOrders();
      this.openTransactionDetail(response.transaction);
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

      const isExist = this.remoteCustomers.find(el => el.contactid == response.customer.contactid || 
                                                    el.abiz_contactcode == response.customer.abiz_contactcode|| 
                                                    el.fullname == response.customer.fullname || 
                                                    el.mobilephone == response.customer.mobilephone) != undefined;
      if (isExist) {
        this.showDlg(StringConst.lbl_notification, StringConst.msg_the_customer_is_exist);
      }else {
        this.remoteCustomers.unshift(response.customer);
        this.onCustomerSelected({ item: response.customer});
      }
    },
    getRemoteOrders() {
      ApiService.methods.getOrders(Helper.getCurrentDateStrForRequest(), CurrentUser.methods.getBearId())
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
        okButtonText: stringConst.lbl_close,
        message: dlgMsg
      });
    },
    getLocalGender(gendercode) {
      return !gendercode.value ? "" : gendercode.value == Constant.GENDER.Male.value ? Constant.GENDER.Male.text : Constant.GENDER.Female.text;
    },
    convertRequestDateToLocalDate(remoteDate) {
      return Helper.convertRequestDateToLocalDate(remoteDate);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../app-variables.scss";
.page_title_small {
  color: $color-accent;
  margin: 0;
  vertical-align: middle;
}

.parent-center {
  vertical-align: middle;
}
.txt-search {
  border-width: 0.5;
  border-color:$color-border;
  border-radius: 50%;
  padding: 2 12;
  font-size: 16;
}
.icon {
  width: 16;
  vertical-align: middle;
}

.icon-small {
  width: 14;
  vertical-align: middle;
}

.item-header {
  font-size: 16;
  vertical-align: middle;
  margin-left: 4; 
  color: $color-primary-dark;
}

.item-header-sub {
  font-family: "f_arima_madurai_regular";
  font-size: 14;
  vertical-align: middle; 
  margin-left: 8; 
}

.time {
  font-size: 16;
  vertical-align: middle; 
}

.date {
  font-family: "f_arima_madurai_thin";
  font-size: 16;
  vertical-align: middle; 
}
</style>