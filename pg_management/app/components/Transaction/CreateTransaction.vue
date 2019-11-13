<template>
  <GridLayout rows="50,50,*,50,60,*,10" columns="40,*,40" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="3" width="100%">
      <Label text="TẠO ĐƠN HÀNG MỚI" class="text-center" />
    </FlexboxLayout>
    <Image id="btn_back" src="res://ic_left_arrow_white" @tap="closePage()" row="0" col="0" />
    <Image id="btn_done" src="res://ic_check_white" @tap="submiData()" row="0" col="2" />

    <Label text="Thông Tin Khách Hàng:" class="header" row="1" col="0" colSpan="3" />
    <RadDataForm :source="customer" :metadata="customerMetadata" row="2" col="0" colSpan="3" />

    <Label text="Chi Tiết Đơn Hàng:" class="header" row="3" col="0" colSpan="2" />
    <Image id="btn_add_procuct" src="res://ic_add_primary" @tap="addProduct()" row="3" col="2" />
   
    <GridLayout class="lout-columns" rows="*,*" columns="30,*, 40,70, 100" row="4" col="0" colSpan="3">
      <label text="Tổng Cộng:" class="lbl-sum text-right" row="0" col="1" colSpan="2" />
      <Label :text="displayTransTotal" class="lbl-sum-value tex-center" row="0" col="3" colSpan="2"/>

      <Label text="ID" class="column-name text-center" row="1" col="0" />
      <Label text="Tên SP" class="column-name text-center" row="1" col="1" />
      <Label text="SL" class="column-name text-center" row="1" col="2" />
      <Label text="Đơn Giá" class="column-name text-center" row="1" col="3" />
      <Label text="Tổng" class="column-name text-center" row="1" col="4" />
    </GridLayout>

    <ListView for="item in products" row="5" col="0" colSpan="3" rowSpan="2">
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
import StringConst from "../../assets/StringConst";
import CustomerMeta from "../../data/formMeta/CustomerMeta";
import SelectProduct from "./SelectProduct";
import ChangeProductNumber from "./ChangeProductNumber";

export default {
  data() {
    return {
      transTotal:0,
      displayTransTotal:"0 VND",
      customerMetadata: CustomerMeta,
      customer: {
        id: Math.floor(Math.random() * 100) + 100,
        name: "",
        sex: "Nam",
        phone: "",
        address: "Hồ Chí Minh"
      },
      products:[]
    };
  },
  methods: {
    closePage() {
      this.$modal.close();
    },
    submiData() {
      if (!this.customer.name) {
        this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_pls_fill_name
        );
        return;
      } else if (!this.customer.phone) {
        this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_pls_fill_phone
        );
        return;
      } else if (this.customer.phone.length != 10 || !this.customer.phone.startsWith("0")) {
        this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_phone_no_math
        );
        return;
      }else if(this.transTotal == 0) {
        this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_trans_have_no_product
        );
        return;
      }

      const now = new Date();
      var time = now.getHours() + ":";
      var min = now.getMinutes();
      if (min < 10) {
        time+= "0"+min;
      }else {
        time+=min;
      }

      var newTransaction = {
        id: Math.floor(Math.random() * 100) + 100,
        code:"COD-" + now.getFullYear()+ "-"+ now.getTime() + 1,
        customer: this.customer,
        store:"Takashimaya Vietnam",
        time: time,
        date: "Hôm nay",
        transTotal: this.transTotal,
        displayTransTotal: this.displayTransTotal,
        products: this.products
      }

      this.$modal.close({
        isSuccess: true,
        customer: this.customer,
        transaction: newTransaction
      });
    },
    addProduct() {
       this.$showModal(SelectProduct, { 
        fullscreen: false,
        animated: true,
        }).then(this.callbackAddProduct);
    },
    callbackAddProduct(response) {
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
    selectedProduct(item) {
      // "Bạn chọn " + item.name + " là để:"
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
</style>