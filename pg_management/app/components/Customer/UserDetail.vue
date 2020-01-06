<template>
  <GridLayout rows="50,50,50,50,50,auto,20" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
        <Label text="KHÁCH HÀNG" class="tool-bar-title text-center"/>
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <Label :text="'fa-address-card' | fonticon" class="far font-icon font-icon-size-18"  row="1" col="0" />
    <Label :text="customer.abiz_contactcode" class="txt-value text-center" textWrap="true" row="1" col="1" />

    <Label :text="'fa-user' | fonticon" class="far font-icon font-icon-size-18" row="2" col="0"  />
    <Label :text="customer.fullname" class="text-center txt-value" textWrap="true" row="2" col="1" />

    <Label :text="'fa-venus-mars' | fonticon" class="fas font-icon font-icon-size-18"  row="3" col="0" />
    <Label :text="formatGender(customer.gendercode)" class="text-center txt-value" textWrap="true" row="3" col="1" />

    <Label :text="'fa-mobile-alt' | fonticon" class="fas font-icon font-icon-size-18"  row="4" col="0" />
    <Label :text="customer.mobilephone" class="text-center txt-value" textWrap="true" row="4" col="1" />

    <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon font-icon-size-18" style="vertical-align:top; margin: 6 0 0 0" row="5" col="0" />
    <Label :text="getCustomerAddress(customer)" class="txt-value" style="vertical-align:top; padding:0 0 0 5, margin-left:0;" textWrap="true" row="5" col="1" />
  </GridLayout>
</template>
<script>
import Constant from '../../data/Constant';
import Helper from '../../helper/PopularHelper';

export default {
  props: ["customer"],
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    closePage() {
      this.$modal.close();
    },
    formatGender(remoteGender) {

      if (remoteGender.value == Constant.GENDER.Male.value) {
        return Constant.GENDER.Male.text;
      }else if (remoteGender.value == Constant.GENDER.Female.value) {
        return Constant.GENDER.Female.text;
      }

      return "";
    },
    getCustomerAddress(customer) {
      return Helper.getFullCustomerAddress(customer);
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
</style>