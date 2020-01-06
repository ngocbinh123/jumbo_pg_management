<template>
  <GridLayout rows="50,20,auto,30,70" columns="40,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="3" width="100%">
      <Label text="CẬP NHẬT SỐ LƯỢNG" class="text-center" />
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <GridLayout rows="*,20,*" columns="100,10,*" row="2" col="0" colSpan="2">
        <Label text="Sản Phẩm:" class="text-right" row="0" col="0" />
        <Label :text="product.name" class="text-left" row="0" col="2" />
        <Label text="Số Lượng:" class="text-right text-ver-middel" row="2" col="0" />
        <TextField
            id="txt_number"
            class="edt-border"
            v-model="number"
            keyboardType="number"
            autocorrect="false"
            row="2" col="2"
        />
    </GridLayout>
    <Button
      id="btn_change"
      text="CẬP NHẬT"
      class="btn btn-fill-bg"
      @tap="submiData()"
      row="5"
      col="0"
      colSpan="3"
    />
  </GridLayout>
</template>
<script>
import StringConst from "../../assets/StringConst";
export default {
  created() {
    this.number = this.$props.product.number
  },
  props: ["product"],
  data() {
    return {
        number: 1
    };
  },
  methods: {
    closePage() {
      this.$modal.close();
    },
    submiData() {
      if (this.number > 10) {
        this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_product_number_out_of_scope_max
        );
        return;
      } else if (this.number < 1) {
        this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_product_number_out_of_scope_min
        );
        return;
      }else if (this.number == this.product.number) {
        this.closePage();
      }
      
      this.$modal.close({
        isSuccess: true,
        newNumber: parseInt(this.number)
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
@import "../../app-variables.scss";

.page-parent {
  justify-content: center;
  align-items: center;
}

.txt-value {
  text-align: left;
  vertical-align: middle;
}

.text-ver-middel {
 vertical-align: middle;
}
</style>