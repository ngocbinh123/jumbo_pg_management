<template>
  <GridLayout rows="50,20, auto,30,30,20,auto,auto,auto, auto, 20, auto,auto,*" columns="50,*,10,50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="5" width="100%">
        <Label text="CHI TIẾT ĐƠN HÀNG" class="text-center"/>
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <Label text="Thông Tin Khách Hàng:" class="header" row="2" col="0" colSpan="5" />

    <Label :text="'fa-user' | fonticon" class="far font-icon font-icon-size-18"  row="3" col="0" />
    <Label :text="transaction.customer.fullname" class="text-center txt-value" textWrap="true" row="3" col="1" colSpan="4"/>

    <Label :text="'fa-mobile-alt' | fonticon" class="fas font-icon font-icon-size-18"  row="4" col="0" v-show="!!transaction.customer.mobilephone" />
    <Label :text="transaction.customer.mobilephone" class="text-center txt-value" textWrap="true" row="4" col="1" />

    <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon font-icon-size-18" row="4" col="3" v-show="!!transaction.customer.address" />
    <Label :text="transaction.customer.address" class="text-center txt-value" textWrap="true" row="4" col="4" />

    <Label text="Chi tiết đơn hàng:" class="header" row="6" col="0" colSpan="5" />

    <Label :text="'fa-barcode' | fonticon" class="fas font-icon font-icon-size-18" row="7" col="0" />
    <Label :text="transaction.code" class="trans-code-value" row="7" col="1" colSpan="4"/>

    <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon font-icon-size-18" row="8" col="0" />
    <Label :text="transaction.store" class="trans-code-value" row="8" col="1" colSpan="4" />

    <Label :text="'fa-money-bill-alt' | fonticon" class="far font-icon font-icon-size-18" row="9" col="0" v-show="transaction.transTotal <= 0" />
    <Label :text="transaction.displayTransTotal" class="trans-total-value" row="9" col="1" colSpan="4" v-show="transaction.transTotal <= 0" />

    <GridLayout row="9" col="0" colSpan="5" rows="auto, auto, auto" columns="100, *" class="edt-box" v-show="transaction.transTotal > 0">
      <Label text="Tổng tiền SP:" class="text-right" textWrap="true" row="0" col="0" />          
      <Label :text="totalWithoutVATStr" class="text-right" textWrap="true" row="0" col="1" />
      <Label text="VAT (10%):" class="text-right" textWrap="true" row="1" col="0" />
      <Label :text="vatStr" class="text-right" textWrap="true" row="1" col="1" />
      <Label text="Tổng cộng:" class="text-right border-top lbl-sum" textWrap="true" row="2" col="0" />
      <Label :text="totalStr" class="text-right lbl-sum-value border-top"  padding ="0" textWrap="true" row="2" col="1" />
    </GridLayout>
    
    <Label text="Danh sách sản phẩm:" class="header" row="11" col="0" colSpan="5" />

    <GridLayout class="lout-columns" rows="*" columns="40,*, 40,100, 100" row="12" col="0" colSpan="5">
      <!-- <Label text="ID" class="column-name text-center" row="0" col="0" /> -->
      <Label text="Tên SP" class="column-name text-center" row="0" col="0" colSpan="2" />
      <Label text="SL" class="column-name text-center" row="0" col="2" />
      <Label text="Đơn Giá" class="column-name text-center" row="0" col="3" />
      <Label text="Tổng" class="column-name text-center" row="0" col="4" />
    </GridLayout>

    <ListView for="item in transaction.products" row="13" col="0" colSpan="5">
      <v-template>
        <GridLayout rows="*" columns="40,*, 40,100, 100" class="lout-padding-ver">
          <Label :text="item.name" class="lbl-name text-center"  row="0" col="0" colSpan="2"/>
          <Label :text="item.number" class="lbl-number text-center" row="0" col="2" />
          <Label :text="formatCurrentcy(item.price)" class="lbl-pricce text-center" row="0" col="3" />
          <Label :text="formatCurrentcy(item.total)" class="lbl-total text-center" row="0" col="4" />
        </GridLayout>
      </v-template>
    </ListView>
  </GridLayout>
</template>
<script>
import Helper from "../../helper/PopularHelper";
import Constant from "../../data/Constant";

export default {
  props: ["transaction"],
  created() {
    if (this.transaction.transTotal > 0) {
      const vat = Math.ceil(this.transaction.transTotal/11);
      this.vatStr = Helper.formatCurrencystr(vat);
      this.totalWithoutVATStr = Helper.formatCurrencystr(this.transaction.transTotal-vat);  
      this.totalStr = Helper.formatCurrencystr(this.transaction.transTotal);  
    }
  },
  data() {
    return {
      totalWithoutVATStr: "",
      totalStr: "", 
      vatStr: ""
    };
  },
  methods: {
    closePage() {
      this.$modal.close();
    },
    formatCurrentcy(num) {
      return Helper.formatCurrencystr(num, "");
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
    font-family: "f_arima_madurai_bold";
    vertical-align: middle;
    text-align: right;
    padding: 5 0;
}

.trans-code-value, .trans-total-value {
    // font-family: "f_arima_madurai_bold";
    vertical-align: middle;
    text-align: left;
    padding: 5 0;
}

.trans-total-value {
    font-family: "f_arima_madurai_bold";
    color: $color-accent;
}

#btn_back {
    width: 24;
    height: 24;
    position: relative;
    top: 0;
    left: 0;
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