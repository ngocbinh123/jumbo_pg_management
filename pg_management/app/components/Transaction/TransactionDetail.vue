<template>
  <GridLayout rows="50,20, auto,auto,auto,20,auto,auto,auto, 20, auto,auto,*" columns="50,*,10,50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="5" width="100%">
        <Label text="CHI TIẾT ĐƠN HÀNG" class="text-center"/>
    </FlexboxLayout>
    <Image id="btn_back" src="res://ic_left_arrow_white" @tap="closePage()" row="0" col="0" />

    <Label text="Thông Tin Khách Hàng:" class="header" row="2" col="0" colSpan="5" />

    <Image src="res://ic_person_primary" class="icon" row="3" col="0" />
    <Label :text="transaction.customer.name" class="text-center txt-value" textWrap="true" row="3" col="1" colSpan="1"/>

    <Image src="res://ic_id_card_primary" class="icon" row="3" col="3" />
    <Label :text="transaction.customer.id" class="txt-value text-center" textWrap="true" row="3" col="4" />

    <!-- <Image src="res://ic_gender_primary" class="icon" row="2" col="4" />
    <Label :text="transaction.customer.sex" class="text-center txt-value" textWrap="true" row="2" col="5" /> -->

    <Image src="res://ic_phone_primary" class="icon" row="4" col="0" />
    <Label :text="transaction.customer.phone" class="text-center txt-value" textWrap="true" row="4" col="1" />

    <Image src="res://ic_place_primary" class="icon" row="4" col="3" />
    <Label :text="transaction.customer.address" class="text-center txt-value" textWrap="true" row="4" col="4" />

    <Label text="Chi tiết đơn hàng:" class="header" row="6" col="0" colSpan="5" />
    <Image src="res://ic_tag_primary" class="icon" row="7" col="0" />
    <Label :text="transaction.code" class="trans-code-value" row="7" col="1" colSpan="4"/>

    <Image src="res://ic_coin_primary" class="icon" row="8" col="0" />
    <Label :text="transaction.displayTransTotal" class="trans-total-value" row="8" col="1" colSpan="4" />

    <Label text="Danh sách sản phẩm:" class="header" row="10" col="0" colSpan="5" />

    <GridLayout class="lout-columns" rows="*" columns="30,*, 40,70, 100" row="11" col="0" colSpan="5">
      <Label text="ID" class="column-name text-center" row="0" col="0" />
      <Label text="Tên SP" class="column-name text-center" row="0" col="1" />
      <Label text="SL" class="column-name text-center" row="0" col="2" />
      <Label text="Đơn Giá" class="column-name text-center" row="0" col="3" />
      <Label text="Tổng" class="column-name text-center" row="0" col="4" />
    </GridLayout>

    <ListView for="item in transaction.products" row="12" col="0" colSpan="5">
      <v-template>
        <GridLayout rows="*" columns="40,*, 40,70, 100" @tap="selectedProduct(item)">
          <Label :text="item.id" class="lbl-id text-center" row="0" col="0" />
          <Label :text="item.name" class="lbl-name text-center" row="0" col="1" />
          <Label :text="item.number" class="lbl-number text-center" row="0" col="2" />
          <Label :text="item.price" class="lbl-pricce text-center" row="0" col="3" />
          <Label :text="item.total" class="lbl-total text-center" row="0" col="4" />
        </GridLayout>
      </v-template>
    </ListView>
  </GridLayout>
</template>
<script>
export default {
  props: ["transaction"],
  data() {
    return {};
  },
  methods: {
    closePage() {
      this.$modal.close();
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
  font-size: 16px;
  text-align: right;
}

.lbl-sum-value {
  color: $color-accent;
  padding-right: 10;
}
</style>