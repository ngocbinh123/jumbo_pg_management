<template>
  <GridLayout rows="50,50,*,70" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
      <Label text="KHÁC HÀNG MỚI" class="text-center" />
    </FlexboxLayout>
    <Image id="btn_back" src="res://ic_left_arrow_white" @tap="closePage()" row="0" col="0" />

    <Label text="Thông Tin Khách Hàng:" class="header" row="1" col="0" colSpan="2" />
    <RadDataForm :source="customer" :metadata="customerMetadata" row="2" col="0" colSpan="2" />
    <Button
      id="btn_submit_customer"
      text="Hoàn Thành"
      class="btn btn-primary"
      @tap="submiData()"
      row="3"
      col="0"
      colSpan="2"
    />
  </GridLayout>
</template>
<script>
import StringConst from "../../assets/StringConst";
import CustomerMeta from "../../data/formMeta/CustomerMeta";
export default {
  data() {
    return {
      customerMetadata: CustomerMeta,
      customer: {
        id: Math.floor(Math.random() * 100) + 100,
        name: "",
        sex: "Nam",
        phone: "",
        address: "Hồ Chí Minh"
      }
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
      } else if (
        this.customer.phone.length != 10 ||
        !this.customer.phone.startsWith("0")
      ) {
        this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_phone_no_math
        );
        return;
      }
      this.$modal.close({
        isSuccess: true,
        customer: this.customer
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
.page-parent {
  justify-content: center;
  align-items: center;
}

.txt-value {
  text-align: left;
  vertical-align: middle;
}
#btn_back {
  width: 24;
  height: 24;
  position: relative;
  top: 0;
  left: 0;
}

.drobox {
  border-color: grey;
  border-width: 1;
  text-align: center;
  align-content: center;
}
#btn_submit_customer {
  margin-left: 10;
  margin-right: 10;
}
</style>