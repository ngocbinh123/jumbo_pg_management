<template>
  <GridLayout rows="50,60,auto,60,auto,*,10" columns="40,*,50" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="3" width="100%">
      <Label text="TẠO ĐƠN HÀNG MỚI" class="text-center" />
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <Label :text="'fa-check' | fonticon" class="fas btn-done"  @tap="submiData()" :isEnabled="!isProcessing" row="0" col="2" />

    <Label text="Thông Tin Khách Hàng:" class="header" row="1" col="0" colSpan="2" />
    <Button class="btn btn-add" text="+" @tap="addCustomer()" :isEnabled="!isProcessing" row="1" col="2" />     

    <StackLayout row="2" col="0" colSpan="2">
      <StackLayout orientation="horizontal" class="lout-info">
        <Label :text="'fa-user' | fonticon" class="far font-icon font-icon-size-18"/>
        <Label :text="customer.name" class="text-center txt-value" textWrap="true"/>

        <Label :text="'fa-venus-mars' | fonticon" class="fas font-icon font-icon-size-18" margin="0 0 0 20" v-show="!!customer.sex" />
        <Label :text="customer.sex" class="text-center txt-value" textWrap="true" />
      </StackLayout>

      <StackLayout orientation="horizontal" class="lout-info" >
        <Label :text="'fa-mobile-alt' | fonticon" class="fas font-icon font-icon-size-18" />
        <Label :text="customer.phone" class="text-center txt-value" textWrap="true" />
      </StackLayout>

      <StackLayout orientation="horizontal" class="lout-info">
        <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon font-icon-size-18" />
        <Label :text="customer.address" class="text-center txt-value" textWrap="true" />
      </StackLayout>
    </StackLayout>

    <Label text="Chi Tiết Đơn Hàng:" class="header text-ver-middle" row="3" col="0" colSpan="2" />
    <Button class="btn btn-add" text="+" @tap="addProduct()" :isEnabled="!isProcessing" row="3" col="2" />
    
    <GridLayout class="lout-columns" rows="auto,auto,auto,*" columns="30,*, 40,70, 100" row="4" col="0" colSpan="3">
      
      <StackLayout row="0" col="0" colSpan="4" orientation="horizontal" class="edt-box" @tap="onClickDate()">
          <Label :text="'fa-calendar-alt' | fonticon" class="far font-icon font-icon-size-18"  margin="0 8 0 0" />
          <Label :text="transDate" class="text-center txt-value" textWrap="true" />
      </StackLayout>

       
      <StackLayout row="1" col="0" colSpan="4" orientation="horizontal" class="edt-box" @tap="onClickTime()">
          <Label :text="'fa-clock' | fonticon" class="far font-icon font-icon-size-18"  margin="0 8 0 0"/>
          <Label :text="transTime" class="text-center txt-value" textWrap="true" />
      </StackLayout>

      <GridLayout row="2" col="0" colSpan="4" rows="auto, auto" columns="30, *" class="edt-box">
          <Label :text="'fa-money-bill-alt' | fonticon" row="0" col="0" class="far font-icon font-icon-size-18"/>
          <Label :text="displayTransTotal" class="text-center txt-value lbl-sum-value" textWrap="true" row="0" col="1" />
          <Label text="(Chưa bao gồm VAT)" class="text-caption" textWrap="true" row="1" col="0" colSpan="2" />
      </GridLayout>
    
      <!-- <label text="Tổng Cộng (Chưa VAT):" class="lbl-sum text-right" row="2" col="0" colSpan="3" />
      <Label :text="displayTransTotal" class="lbl-sum-value tex-center" row="2" col="3" colSpan="2"/> -->

      <!-- <Label text="ID" class="column-name text-center" row="3" col="0" /> -->
      <Label text="Tên SP" class="column-name text-center" row="3" col="0" colSpan="2" />
      <Label text="SL" class="column-name text-center" row="3" col="2" />
      <Label text="Đơn Giá" class="column-name text-center" row="3" col="3" />
      <Label text="Tổng" class="column-name text-center" row="3" col="4" />
    </GridLayout>

    <ListView for="item in products" row="5" col="0" colSpan="3" rowSpan="2" @itemTap="selectedProduct">
      <v-template>
        <GridLayout rows="*" columns="40,*, 40,70, 100" class="lout-padding-ver">
          <!-- <Label :text="item.id" class="lbl-id text-center" row="0" col="0" /> -->
          <Label :text="item.name" class="lbl-name text-center" row="0" col="0"  colSpan="2" />
          <Label :text="item.number" class="lbl-number text-center" row="0" col="2" />
          <Label :text="item.price" class="lbl-pricce text-center" row="0" col="3" />
          <Label :text="item.total" class="lbl-total text-center" row="0" col="4" />
        </GridLayout>
      </v-template>
    </ListView>
  </GridLayout>
</template>
<script>
import StringConst from "../../assets/StringConst";
import CustomerMeta from "../../data/formMeta/CustomerMeta";
import SelectProduct from "./SelectProduct";
import ChangeProductNumber from "./ChangeProductNumber";
import Helper from '../../helper/PopularHelper';
import ApiService from '../../service/BackEndService';
import CreateNewCustomer from "../Customer/CreateNewCustomer";
import DatePickerDlg from '../Dialog/DatePickerDlg';
import TimePickerDlg from '../Dialog/TimePickerDlg';
import CurrentUser from '../../data/CurrentUser';

export default {
  data() {
    return {
      isProcessing: false,
      transDate: Helper.getCurrentDateStr(),
      transTime: Helper.getCurrentTimeStr(),
      transTotal:0,
      displayTransTotal:"0 VND",
      customer: {
        id: 111,
        name: "",
        sex: "",
        phone: "",
        address: "",
        provinceId: "",
        contactId: ""
      },
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
      this.customer = response.customer;
    },
    submiData() {
      if (this.isProcessing) {
        return;
      }
      
      if (!this.customer.name) {
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

      var newTransaction = {
        id: Math.floor(Math.random() * 100) + 100,
        code:"COD-" + now.getFullYear()+ "-"+ now.getTime() + 1,
        customer: this.customer,
        store:"",
        time: this.transTime,
        date: this.transDate,
        requestDate: Helper.convertLocalDateToRequestDate(this.transDate),
        transTotal: this.transTotal,
        displayTransTotal: this.displayTransTotal,
        products: this.products
      }

      this.uploadTransaction(newTransaction);
    },
    uploadTransaction(newTransaction) {
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
      var order = json.records.find(el => json.records[0].abiz_contactid.value.toLowerCase() == transaction.customer.contactId.toLowerCase());
      if (order != undefined) {
        transaction.code = order.abiz_ordercode;
        // transaction.time = order.abiz_ordertime;
        transaction.store = order.abiz_outletid.text;
        transaction.total = order.abiz_totalamountrollup;
        transaction.displayTransTotal = Helper.formatCurrencystr(order.abiz_totalamountrollup);
      }

      this.$store.dispatch('insertInvoice', transaction);
      this.$modal.close({
        isSuccess: true,
        customer: this.customer,
        transaction: transaction
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
      this.displayTransTotal = this.formatCurrentcy(this.transTotal);
    },
    selectedProduct(event) {
      const item = event.item;
      action("Bạn chọn " + item.name + " là để:", 
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
            this.displayTransTotal = this.formatCurrentcy(this.transTotal);
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
      this.displayTransTotal = this.formatCurrentcy(this.transTotal);
    },
    callBackDeleteSelectedProduct(result, item) {
      if (result == undefined || !result.result) {
        return
      }

      const itemIndex = this.products.indexOf(item);
      if (itemIndex > -1 && itemIndex < this.products.length) {
        this.products.splice(itemIndex, 1);
        
        this.transTotal = this.transTotal - item.total; 
        this.displayTransTotal = this.formatCurrentcy(this.transTotal);
      }
    },
    showDlg(dlgTitle, dlgMsg) {
      return alert({
        title: dlgTitle,
        okButtonText: StringConst.lbl_close,
        message: dlgMsg
      });
    },
    formatCurrentcy(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " VND";
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
  font-family: "f_arima_madurai_bold";
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

.lout-columns {
  border-bottom-color: $color-border;
  border-bottom-width: 0.5;
}
.lbl-sum, .lbl-sum-value {
  font-family: "f_arima_madurai_extra_bold";
  font-weight: bold;
  font-size: 16px;
  text-align: right;
}

.lbl-sum-value {
  color: $color-accent;
  padding-right: 10;
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