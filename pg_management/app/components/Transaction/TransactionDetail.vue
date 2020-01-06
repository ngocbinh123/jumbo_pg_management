<template>
  <GridLayout rows="50,15, auto,auto,auto, auto, 10,auto,auto,auto, auto, 10, auto,auto,*" columns="50,*,10,50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="5" width="100%">
        <Label text="CHI TIẾT ĐƠN HÀNG" class="text-center"/>
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <Label text="Thông Tin Khách Hàng:" class="header" row="2" col="0" colSpan="5" />

    <Label :text="'fa-user' | fonticon" class="far font-icon font-icon-size-18"  row="3" col="0" />
    <Label :text="customer.fullname" class="text-center txt-value" textWrap="true" row="3" col="1" colSpan="4"/>

    <Label :text="'fa-mobile-alt' | fonticon" class="fas font-icon font-icon-size-18"  row="4" col="0" />
    <Label :text="customer.mobilephone" class="text-center txt-value" textWrap="true" row="4" col="1" />

    <Label :text="'fa-map-marker-alt' | fonticon" class="fas icon-address" style="margin: 5 0 0 0; font-size:18" row="5" col="0" />
    <Label :text="customer.address" class="text-center txt-value" textWrap="true" row="5" col="1" colSpan="4" />

    <Label text="Chi tiết đơn hàng:" class="header" row="7" col="0" colSpan="5" />

    <Label :text="'fa-barcode' | fonticon" class="fas font-icon font-icon-size-18" row="8" col="0" />
    <Label :text="orderDetail.code" class="trans-code-value" row="8" col="1" colSpan="4"/>

    <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon font-icon-size-18" row="9" col="0" />
    <Label :text="orderDetail.store" class="trans-code-value" row="9" col="1" colSpan="4" />

    <Label :text="'fa-money-bill-alt' | fonticon" class="far font-icon font-icon-size-18" row="10" col="0" v-show="orderDetail.transTotal <= 0" />
    <Label :text="formatCurrentcy(orderDetail.transTotal)" class="trans-total-value" row="10" col="1" colSpan="4" v-show="orderDetail.transTotal <= 0" />

    <GridLayout row="10" col="0" colSpan="5" rows="auto, auto, auto" columns="100, *" class="edt-box" v-show="orderDetail.transTotal > 0">
      <Label text="Tổng tiền SP:" class="text-right" textWrap="true" row="0" col="0" />          
      <Label :text="totalWithoutVATStr" class="text-right" textWrap="true" row="0" col="1" />
      <Label text="VAT (10%):" class="text-right" textWrap="true" row="1" col="0" />
      <Label :text="vatStr" class="text-right" textWrap="true" row="1" col="1" />
      <Label text="Tổng cộng:" class="text-right border-top lbl-sum" textWrap="true" row="2" col="0" />
      <Label :text="totalStr" class="text-right lbl-sum-value border-top"  padding ="0" textWrap="true" row="2" col="1" />
    </GridLayout>
    
    <Label text="Danh sách sản phẩm:" class="header" row="12" col="0" colSpan="5" />

    <GridLayout class="lout-columns" rows="*" columns="40,*, 40,100, 100" row="13" col="0" colSpan="5">
      <Label text="Tên SP" class="column-name text-center" row="0" col="0" colSpan="2" />
      <Label text="SL" class="column-name text-right" row="0" col="2" />
      <Label text="Đơn Giá" class="column-name text-center" row="0" col="3" />
      <Label text="Tổng" class="column-name text-center" row="0" col="4" />
    </GridLayout>

    <ListView for="item in products" row="14" col="0" colSpan="5">
      <v-template>
        <GridLayout rows="*" columns="40,*, 40,100, 100" class="lout-padding-ver">
          <Label :text="item.name" class="lbl-name"  row="0" col="0" colSpan="2" padding="0 5 0 2" />
          <Label :text="item.number" class="lbl-number text-right" row="0" col="2" />
          <Label :text="formatCurrentcy(item.price)" class="lbl-pricce text-right" row="0" col="3" padding="0 2 0 5" />
          <Label :text="formatCurrentcy(item.total)" class="lbl-total text-right" row="0" col="4" padding="0 2 0 5" />
        </GridLayout>
      </v-template>
    </ListView>
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
  props: ["transaction"],
  created() {
    this.trackingPage();
    this.getLocalData();
  },
  data() {
    return {
      customer: {
        fullname: this.transaction.customer.fullname,
        mobilephone: this.transaction.customer.mobilephone,
        address: this.transaction.customer.address
      },
      orderDetail: {
        code: this.transaction.code,
        store: this.transaction.store,
        transTotal: this.transaction.transTotal
      },
      products: [],
      totalWithoutVATStr: "",
      totalStr: "", 
      vatStr: "",
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
            value: "SHOW_ORDER_DETAIL"
          }
        ]
      });
    },
    getRemoteOrderDetail() {
      this.isProcessing = true;
      ApiService.methods.getOrderDetail(this.$props.transaction.id,CurrenntUser.methods.getBearId())
      .then(this.getRemoteOrderDetailSuccess)
      .catch(this.getRemoteOrderDetailFail);
    },
    getRemoteOrderDetailSuccess(response) {
      if (response == undefined) {
        this.isProcessing = false;
        return;
      }

      Promise.all([new Promise((resolve, reject) => {
        this.orderDetail.code = response.abiz_ordercode;
        this.orderDetail.store = response.abiz_outletid.text;

        this.customer.fullname = response.fullname;
        this.customer.mobilephone = response.mobilephone;
        this.customer.address = Helper.getFullCustomerAddress(response);

        this.totalWithoutVATStr = Helper.formatCurrencystr(response.abiz_netamount.replace(",",""));
        this.vatStr = Helper.formatCurrencystr(response.abiz_taxtamount.replace(",",""));
        this.totalStr = Helper.formatCurrencystr(response.abiz_amount.replace(",",""));
        resolve('calucte total done');
      }), new Promise((resolve, reject)=> {
        var remoteProducts = [];
        response.records.forEach(remote => {
          var product = {
            id:remote.abiz_productid.value,
            name: remote.abiz_productid.text,
            number: remote.abiz_quantity,
            price: remote.aboz_unitprice,
            total: remote.abiz_netamount  
          };
          remoteProducts.push(product);
        });
        this.products = remoteProducts;
        resolve('get Products Done');
      })])
      .then((result) => {
        this.isProcessing = false;
      }).catch((err) => {
        this.isProcessing = false;
      });
    },
    getRemoteOrderDetailFail(error) {
      this.isProcessing = false;
      if (error == undefined) {
        return;
      }
      var errMsg = error.message;
      if (errMsg.includes("UnknownHostException")) {
        errMsg = StringConst.msg_unknow_host_exception;
      }
      this.showDlg(StringConst.lbl_error, errMsg);
    },
    getLocalData() {
      Promise.all([new Promise((resolve, reject) => {
        if (this.orderDetail.transTotal > 0) {
          const vat = Math.ceil(this.orderDetail.transTotal/11);
          this.vatStr = Helper.formatCurrencystr(vat);
          this.totalWithoutVATStr = Helper.formatCurrencystr(this.orderDetail.transTotal-vat);  
          this.totalStr = Helper.formatCurrencystr(this.orderDetail.transTotal);  
        }
        resolve('calucalated done');
      }), new Promise((resolve, reject)=> {
        if (this.$props.transaction.hasOwnProperty("products") && this.transaction.products.length > 0) {
          this.products = this.$props.transaction.products;
          resolve('get Products Done');
        }

        const query = "SELECT productId, productName, number, price, total, invoiceCode FROM InvoiceDetail WHERE invoiceCode = ?";
        this.$store.state.database.all(query, [this.orderDetail.code])
          .then(result => {
            var localProducts = [];
            result.forEach(row => {
              var product = {
                id:row[0],
                name: row[1],
                number: row[2],
                price: this.formatCurrentcy(row[3]),
                total: this.formatCurrentcy(row[4])  
              };
             localProducts.push(product);
            });

            this.products = localProducts;
            resolve('hello');
          })
          .catch(error => {
            reject(error.message);
          });
      })]).then(values => {
        this.isProcessing = false;
        if (this.products.length == 0) {
          this.getRemoteOrderDetail();
        }
      }).catch(error => {
        this.isProcessing = false;
        if (this.products.length == 0) {
          this.getRemoteOrderDetail();
        }
      });
    },
    closePage() {
      this.$modal.close();
    },
    formatCurrentcy(num) {
      if (num.toString().includes(",")) {
        return num;
      }
      return Helper.formatCurrencystr(num, "");

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

.page-parent {
  justify-content: center;
  align-items: center;
}

.txt-value {
  text-align: left;
  vertical-align: middle;
}

.trans-code, .trans-total {
    font-family: "f_arima_madurai_bold", "Arima Madurai";
    vertical-align: middle;
    text-align: right;
    padding: 5 0;
}

.trans-code-value, .trans-total-value {
    // font-family: "f_arima_madurai_bold", "Arima Madurai";
    vertical-align: middle;
    text-align: left;
    padding: 5 0;
}

.trans-total-value {
    font-family: "f_arima_madurai_bold", "Arima Madurai";
    color: $color-accent;
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

.border-top {
  border-top-color: $color-border;
  border-top-width: 0.5;
}
</style>