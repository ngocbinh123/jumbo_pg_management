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
  </GridLayout>
</template>
<script>
import StringConst from "../../assets/StringConst";
import CustomerMeta from "../../data/formMeta/CustomerMeta";
import ApiService from "../../service/BackEndService";
import CurrentUser from '../../data/CurrentUser';
export default {
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

      const provinceId = CustomerMeta.provinces.find(el => el.abiz_name == this.customer.address).abiz_locationid;
      const newCustomer = {
        id: 191,
        name: this.customer.name,
        sex: this.customer.sex,
        phone: this.customer.phone,
        address: this.customer.address,
        provinceId: provinceId,
        contactId: ""
      } 

      this.senDataToServer(newCustomer);     
    },
    senDataToServer(customer) {
      this.processing = true;
      ApiService.methods.createNewCustomer(customer, CurrentUser.methods.getBearId())
      .then(json => this.callBackSendDataSuccess(json, customer))
      .catch(this.callBackSendDataFail);
    },
    callBackSendDataSuccess(json, newCustomer) {
      newCustomer.contactId = json.abiz_contactid;

      this.$store.dispatch('insertCustomer', newCustomer);
      this.$modal.close({
        isSuccess: true,
        customer: newCustomer
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