<template>
  <GridLayout rows="50,60,auto,60,auto,*,10" columns="40,*,50" class="page-parent">
    <ActivityIndicator v-show="isProcessing" busy="true" row="0" col="0" colSpan="3" rowSpan="6" />
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="3" width="100%">
      <Label text="CREATE NEW ORDER" class="text-center" />
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <Label :text="'fa-check' | fonticon" class="fas btn-done"  @tap="submiData()" :isEnabled="!isProcessing" row="0" col="2" />

    <Label text="Customer Information:" class="header" row="1" col="0" colSpan="2" />
    <Button class="btn btn-add" text="+" @tap="addCustomer()" :isEnabled="!isProcessing" row="1" col="2" />     

    <StackLayout row="2" col="0" colSpan="3" v-show="!!customer.fullname">
      <StackLayout orientation="horizontal" class="lout-info">
        <Label :text="'fa-user' | fonticon" class="far font-icon font-icon-size-18"/>
        <Label :text="customer.fullname" class="text-center txt-value" textWrap="true"/>
      </StackLayout>

      <StackLayout orientation="horizontal" class="lout-info" >
        <Label :text="'fa-mobile-alt' | fonticon" class="fas font-icon font-icon-size-18" />
        <Label :text="customer.mobilephone" class="text-center txt-value" textWrap="true" />
      </StackLayout>

      <StackLayout orientation="horizontal" class="lout-info">
        <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon font-icon-size-18" v-show="!!customer.address" />
        <Label :text="customer.address" class="text-center txt-value" textWrap="true" v-show="!!customer.address" />
      </StackLayout>
    </StackLayout>
    <Label text="Please tab + to add customer." class="text-center" textWrap="true" color="red" margin="24" row="2" col="0" colSpan="3" v-show="!customer.fullname"/>

    <Label text="Order Detail:" class="header text-ver-middle" row="3" col="0" colSpan="2" />
    <Button class="btn btn-add" text="+" @tap="addProduct()" :isEnabled="!isProcessing" row="3" col="2" />
    
    <GridLayout class="lout-columns" rows="auto,auto,auto,*" columns="40,auto, 40,100, *" row="4" col="0" colSpan="3">
      
      <StackLayout row="0" col="2" colSpan="3" orientation="horizontal" class="edt-box" @tap="onClickDate()">
          <Label :text="'fa-calendar-alt' | fonticon" class="far font-icon font-icon-size-18"  margin="0 8 0 0" />
          <Label :text="transDate" class="text-center txt-value" textWrap="true" />
      </StackLayout>

      <StackLayout row="0" col="0" colSpan="2" orientation="horizontal" class="edt-box" @tap="onClickTime()">
          <Label :text="'fa-clock' | fonticon" class="far font-icon font-icon-size-18"  margin="0 8 0 0"/>
          <Label :text="transTime" class="text-center txt-value" textWrap="true" />
      </StackLayout>

      <GridLayout row="1" col="0" colSpan="5" rows="auto, auto, auto" columns="100, *" class="edt-box" v-show="this.transTotal != 0">
          <Label text="Tổng tiền SP:" class="text-right" textWrap="true" row="0" col="0" />          
          <Label :text="displayTransTotal" class="text-right" textWrap="true" row="0" col="1" />
          <Label text="VAT (10%):" class="text-right" textWrap="true" row="1" col="0" />
          <Label :text="calculateVAT()" class="text-right" textWrap="true" row="1" col="1" />
          <Label text="Tổng cộng:" class="text-right border-top lbl-sum" textWrap="true" row="2" col="0" />
          <Label :text="calculateTotal()" class="text-right lbl-sum-value border-top"  padding ="0" textWrap="true" row="2" col="1" />
      </GridLayout>
    
      <Label text="Model" class="column-name text-center" row="3" col="0" colSpan="2" />
      <Label text="Num" class="column-name text-right" row="3" col="2" />
      <Label text="Unit Price" class="column-name text-center" row="3" col="3" />
      <Label text="Total" class="column-name text-center" row="3" col="4" />
    </GridLayout>

    <ListView for="item in products" row="5" col="0" colSpan="3" rowSpan="2" @itemTap="selectedProduct">
      <v-template>
        <GridLayout rows="*" columns="40,*, 40,100, 120" class="lout-padding-ver">
          <Label :text="item.name" class="lbl-name" row="0" col="0"  colSpan="2" />
          <Label :text="item.number" class="lbl-number text-right" row="0" col="2" />
          <Label :text="formatCurrentcy(item.price)" class="lbl-pricce text-right" row="0" col="3" />
          <Label :text="formatCurrentcy(item.total)" class="lbl-total text-right" row="0" col="4" />
        </GridLayout>
      </v-template>
    </ListView>
  </GridLayout>
</template>
<script>
import StringConst from "../../assets/StringConst";
import SelectProduct from "./SelectProduct";
import ChangeProductNumber from "./ChangeProductNumber";
import Helper from '../../helper/PopularHelper';
import ApiService from '../../service/BackEndService';
import CreateNewCustomer from "../Customer/CreateNewCustomer";
import DatePickerDlg from '../Dialog/DatePickerDlg';
import TimePickerDlg from '../Dialog/TimePickerDlg';
import CurrentUser from '../../data/CurrentUser';
import * as firebase from"nativescript-plugin-firebase";
import Constant from "../../data/Constant";
import Remember from '../../share/Remember';

export default {
  created() {
    firebase.analytics.logEvent({
      key: Constant.KEY_PAGE_VIEW,
      parameters: [
        {
          key: Constant.KEY_PAGE_ID, 
          value: "CREATE_NEW_ORDER"
        }
      ]
    });
  },
  data() {
    return {
      isProcessing: false,
      transDate: Helper.getCurrentDateStr(),
      transTime: Helper.getCurrentTimeStr(),
      transTotal:0,
      displayTransTotal:"0 VND",
      customer:{
        contactId: "",
        fullname: "",
        address: "",
        mobilephone: "",
      },
      rermoteCustomer: {},
      products:[]
    };
  },
  methods: {
    onClickDate() {
       if (this.isProcessing) {
        return;
      }
      this.isProcessing = true;

      this.$showModal(DatePickerDlg, { 
        fullscreen: false,
        animated: true,
        props: { 
          title: StringConst.lbl_create_trans_date,
          defaultDate: this.transDate
        }
      }).then(this.callbackSelectDate);
    },
    callbackSelectDate(result) {
      this.isProcessing = false;
      if (result == undefined || !result.isSuccess) {
        return;
      }
      this.transDate = result.selectedDateStr;
    },
    onClickTime() {
      if (this.isProcessing) {
        return;
      }
      this.isProcessing = true;

      this.$showModal(TimePickerDlg, { 
        fullscreen: false,
        animated: true,
        props: { 
          title: StringConst.lbl_create_trans_time,
          selectedTime: this.selectedTimeStr
        }
      }).then(this.callbackSelectTime);
    },
    callbackSelectTime(result) {
      this.isProcessing = false;
      if (result == undefined || !result.isSuccess) {
        return;
      }
      this.transTime = result.selectedTimeStr;
    },
    closePage() {
      this.$modal.close();
    },
    addCustomer() {
      this.isProcessing = true;
      this.$showModal(CreateNewCustomer, { 
        fullscreen: true,
         animated: true,
      }).then(this.callbackCreateCustomer);
    },
    callbackCreateCustomer(response) {
      this.isProcessing = false;
      if(response == undefined || !response.isSuccess) {
        return;
      }
      this.rermoteCustomer = response.customer;
      this.customer.contactId = response.customer.contactid;
      this.customer.fullname = response.customer.fullname;
      this.customer.mobilephone = response.customer.mobilephone;
      this.customer.address = this.getCustomerAddress(response.customer);

    },
    submiData() {
      if (this.isProcessing) {
        return;
      }

      if (!this.customer.fullname) {
        this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_pls_add_customer
        );
        return;
      } else if(this.transTotal == 0) {
        this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_trans_have_no_product
        );
        return;
      }

      const now = new Date();
      if (Helper.getCurrentDateStr() == this.transDate) {
        const timeArr = this.transTime.split(":");
        if (timeArr[0] > now.getHours() ||(timeArr[0] == now.getHours() && timeArr[1] > now.getMinutes() )) {
          this.showDlg(
            StringConst.lbl_notification,
            StringConst.msg_trans_date_is_in_future
          );
          return;
        }
      } 
      
      const transDate = this.transDate.split("/");
      if (transDate[2] != now.getFullYear()) {
          this.showDlg(
            StringConst.lbl_notification,
            StringConst.msg_trans_date_is_in_prev_year
          );
        return;
      }

      const total = this.calculateTotal();
      const message = "- Customer: " + this.customer.fullname + "\n- Order date: " + this.transTime + "  " + this.transDate + "\n- Total: " + total + " (included tax)";

      confirm({
        title: StringConst.lbl_pls_check_order,
        message: message,
        okButtonText: StringConst.lbl_create_order,
        cancelButtonText: StringConst.lbl_cancel,
      }).then(result => {
        if (result) {
          this.startCreateOrder();
        }
      });    
    },
    startCreateOrder() {
      const now = new Date();
      const vat = Math.ceil(this.transTotal * 0.1);
      const total = this.transTotal + vat;

      var newTransaction = {
        id: Math.floor(Math.random() * 100) + 100,
        code:"COD-" + now.getFullYear()+ "-"+ now.getTime() + 1,
        customer: this.customer,
        store:"",
        time: this.transTime,
        date: this.transDate,
        requestDate: Helper.convertLocalDateToRequestDate(this.transDate),
        transTotal: total,
        displayTransTotal: Helper.formatCurrencystr(total),
        products: this.products,

        abiz_orderid: "",
        abiz_contactid: {
            text: this.customer.fullname,
            value: ""
        },
        abiz_ordercode: "",
        abiz_orderdate: this.transDate,
        abiz_ordertime: this.time,
        abiz_outletid: {
            text: "",
            value: ""
        },
        abiz_totalamountrollup: total
      }

      this.uploadTransaction(newTransaction);
    },
    uploadTransaction(newTransaction) {
      this.isProcessing = true;

      ApiService.methods.submitOrder(newTransaction, CurrentUser.methods.getBearId())
      .then(json => this.callbackUploadTransactionSuccess(json, newTransaction))
      .catch(this.callbackUploadTransactionFail);
    },
    callbackUploadTransactionSuccess(json, transaction) {
      ApiService.methods.getOrders(transaction.requestDate, CurrentUser.methods.getBearId())
        .then(json => this.callbackGetOrdersSuccess(json, transaction))
        .catch(error => this.callbackUploadGetOrderFail(error, transaction));
    },
    callbackGetOrdersSuccess(json, transaction) {
    if (json == undefined) {
      return;
    }

    // Remember.setRemoteOrders(json);
    // this.$store.dispatch('pushOrders', json.records);
    
    var order = json.records.find(el => el.abiz_contactid.value.toLowerCase() == transaction.customer.contactId.toLowerCase());
    if (order != undefined) {
        transaction.code = order.abiz_ordercode;
        transaction.store = order.abiz_outletid.text;
      }
      this.$store.dispatch('insertInvoice', transaction);
      this.$modal.close({
        isSuccess: true,
        customer: this.customer,
        transaction: transaction,
        rermoteCustomer: this.rermoteCustomer,
        remoteOrder: order
      });
      this.isProcessing = false;

    },
    callbackUploadGetOrderFail(error, transaction) {
      console.log("GET ORDERS LIST ERROR", error.message);

      this.$store.dispatch('insertInvoice', transaction);
      this.$modal.close({
        isSuccess: true,
        customer: this.customer,
        transaction: transaction
      });
      this.isProcessing = false;
    },
    callbackUploadTransactionFail(error) {
      this.showDlg(StringConst.lbl_error, error.message);
      this.isProcessing = false;
    },
    addProduct() {
      if (this.isProcessing) {
        return;
      }
      this.isProcessing = true;
      
      this.$showModal(SelectProduct, { 
        fullscreen: false,
        animated: true,
        props: {
          dateStr: Helper.convertLocalDateToRequestDate(this.transDate),
          timeStr: this.transTime
        }
      }).then(this.callbackAddProduct);
    },
    callbackAddProduct(response) {
      this.isProcessing = false;
      if(response == undefined || !response.isSuccess) {
        return;
      }

      var found = this.products.find(function(element) { 
        return element.id == response.product.id; 
      });

      if (found == undefined || found == null) {
        this.products.unshift(response.product);
      }else {
        found.number += response.product.number;
        found.total += response.product.total;
      }

      this.transTotal += response.product.total;
      this.displayTransTotal = Helper.formatCurrencystr(this.transTotal);
    },
    selectedProduct(event) {
      const item = event.item;
      action("YOU choose " + item.name + " to ", 
      StringConst.lbl_close, 
      [StringConst.lbl_update_number, StringConst.lbl_delete])
        .then(result => this.callBackSelectedProduct(result, item));
    },
    callBackSelectedProduct(result, item) {
      if (result == StringConst.lbl_update_number) {
        this.$showModal(ChangeProductNumber, {
          fullscreen: false, 
          animated: true,
          props: { product: item }
        }).then(res => this.callBackChangeSelectedProductNumber(res, item));
      }else if (result == StringConst.lbl_delete) {
        confirm({
          title: StringConst.lbl_delete + " " + item.name,
          message: StringConst.msg_sure_delete_product,
          okButtonText: StringConst.lbl_accept,
          cancelButtonText: StringConst.lbl_cancel
        }).then(isAccept => {
          if (isAccept == undefined || !isAccept) {
            return
          }

          const itemIndex = this.products.indexOf(item);
          if (itemIndex > -1 && itemIndex < this.products.length) {
            this.products.splice(itemIndex, 1);
            
            this.transTotal = this.transTotal - item.total; 
            this.displayTransTotal = Helper.formatCurrencystr(this.transTotal);
          }
        });
      }
    },
    callBackChangeSelectedProductNumber(response, item) {
      if (response == undefined || !response.isSuccess) {
        return
      }

      const oldTotal = item.total;
      item.number = response.newNumber;
      item.total = item.number * item.price;

      this.transTotal = this.transTotal - oldTotal + item.total; 
      this.displayTransTotal = Helper.formatCurrencystr(this.transTotal);
    },
    callBackDeleteSelectedProduct(result, item) {
      if (result == undefined || !result.result) {
        return
      }

      const itemIndex = this.products.indexOf(item);
      if (itemIndex > -1 && itemIndex < this.products.length) {
        this.products.splice(itemIndex, 1);
        
        this.transTotal = this.transTotal - item.total; 
        this.displayTransTotal = Helper.formatCurrencystr(this.transTotal);
      }
    },
    formatCurrentcy(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    },
    calculateVAT() {
      const vat = Math.ceil(this.transTotal *0.1);
      return this.formatCurrentcy(vat) + " VND";
    },
    calculateTotal() {
      const vat = Math.ceil(this.transTotal *0.1);
      return this.formatCurrentcy(this.transTotal + vat) + " VND";
    },
    showDlg(dlgTitle, dlgMsg) {
      return alert({
        title: dlgTitle,
        okButtonText: StringConst.lbl_close,
        message: dlgMsg
      });
    },
    getCustomerAddress(customer) {
      return Helper.getFullCustomerAddress(customer);
    }
  }
};
</script>
<style scroped lang="scss">
@import "../../app-variables.scss";
.page-parent {
  justify-content: center;
  align-items: center;
}

.txt-value {
  text-align: left;
  vertical-align: middle;
}
#btn_done,
#btn_done, #btn_add_procuct {
  width: 24;
  height: 24;
  position: relative;
  top: 0;
  left: 0;
}

#btn_done:active,
:hover {
  background: $color-primary;
  border-color: $color-primary;
  border-width: 1;
}

.drobox {
  border-color: grey;
  border-width: 1;
  text-align: center;
  align-content: center;
}
#btn_submit_trans {
  margin-left: 10;
  margin-right: 10;
}
.column-name {
  font-family: "f_arima_madurai_bold", "Arima Madurai";
  font-weight: bold;
  font-size: 18px;
}

.lbl-id,
.lbl-name,
.lbl-number,
.lbl-price,
.lbl-total {
  font-size: 16;
}

.text-right {
  text-align: right;
}

.border-top {
  border-top-color: $color-border;
  border-top-width: 0.5;
}

.lout-columns {
  border-bottom-color: $color-border;
  border-bottom-width: 0.5;
}
.lbl-sum, .lbl-sum-value {
  font-family: "f_arima_madurai_extra_bold", "Arima Madurai";
  font-weight: bold;
  text-align: right;
}

.lbl-sum-value {
  color: $color-accent;
}

.lout-padding-ver {
  padding: 4 0;
}

.lout-info {
  margin: 4 12 12;
  Label.font-icon {
    width: 10%;
  }
}
</style>