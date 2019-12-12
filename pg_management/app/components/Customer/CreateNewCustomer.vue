<template>
  <GridLayout rows="50,50,*,70" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
      <Label text="KHÁC HÀNG MỚI" class="text-center" />
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <Label text="Thông Tin Khách Hàng:" class="header" row="1" col="0" colSpan="2" />
    <RadDataForm :source="customer" :metadata="customerMetadata" row="2" col="0" colSpan="2" />
    <Button
      id="btn_submit_customer"
      text="Hoàn Thành"
      class="btn btn-fill-bg"
      @tap="submiData()"
      :isEnabled="!processing"
      row="3"
      col="0"
      colSpan="2"
    />
    <ActivityIndicator v-show="processing" busy="true" row="0" col="0" colSpan="2" rowSpan="4" />

  </GridLayout>
</template>
<script>
import StringConst from "../../assets/StringConst";
import CustomerMeta from "../../data/formMeta/CustomerMeta";
import ApiService from "../../service/BackEndService";
import CurrentUser from '../../data/CurrentUser';
import Constant from "../../data/Constant";
import Validation from "../../share/Validation";
export default {
  created() {
  },
  data() {
    return {
      customerMetadata: CustomerMeta,
      customer: {
        name: "",
        sex: "Nam",
        phone: "",
        address: "Hồ Chí Minh"
      },
      processing: false,
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
      }

      var errMessage = Validation.validPhoneNumber(this.customer.phone);
      if (!!errMessage) {
        this.showDlg(StringConst.lbl_notification,errMessage);
        return;
      }

      const provinceId = CustomerMeta.provinces.find(el => el.abiz_name == this.customer.address).abiz_locationid;
      const newCustomer = {
        name: this.customer.name,
        sex: this.customer.sex,
        phone: this.customer.phone,
        address: this.customer.address,
        provinceId: provinceId,
      }
      
      this.processing = true;
      ApiService.methods.createNewCustomer(newCustomer, CurrentUser.methods.getBearId())
      .then(this.callBackSendDataSuccess)
      .catch(this.callBackSendDataFail);
    },
    callBackSendDataSuccess(json) {
      this.$modal.close({
        isSuccess: true,
        customer: json
      });
      this.processing = false;
    },
    callBackSendDataFail(error) {
      this.showDlg(StringConst.lbl_error, error.message);
      this.processing = false;
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


#btn_submit_customer {
  margin-left: 10;
  margin-right: 10;
}
</style>