<template>
  <GridLayout rows="50,*,*,*,*,*" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="90%">
        <Label text="KHÁCH HÀNG" class="text-center"/>
    </FlexboxLayout>
    <Image id="btn_back" src="res://ic_left_arrow_white" @tap="closePage()" row="0" col="0" />
    <Image src="res://ic_id_card_primary" class="icon" row="1" col="0" />
    <Label :text="customer.id" class="txt-value text-center" textWrap="true" row="1" col="1" />

    <Image src="res://ic_person_primary" class="icon" row="2" col="0" />
    <Label :text="customer.name" class="text-center txt-value" textWrap="true" row="2" col="1" />

    <Image src="res://ic_gender_primary" class="icon" row="3" col="0" />
    <Label :text="customer.sex" class="text-center txt-value" textWrap="true" row="3" col="1" />

    <Image src="res://ic_phone_primary" class="icon" row="4" col="0" />
    <Label :text="customer.phone" class="text-center txt-value" textWrap="true" row="4" col="1" />

    <Image src="res://ic_place_primary" class="icon" row="5" col="0" />
    <Label :text="customer.address" class="text-center txt-value" textWrap="true" row="5" col="1" />
  </GridLayout>
</template>
<script>
export default {
  props: ["customer"],
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
</style>