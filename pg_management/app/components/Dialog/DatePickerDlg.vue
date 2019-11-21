<template>
  <GridLayout rows="50,20, *,30, 70" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
      <Label :text="$props.title" class="text-center" />
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <DatePicker v-model="selectedDate" row="2" col="0" colSpan="2" />
    <Button
      id="btn_complete"
      text="XONG"
      class="btn btn-fill-bg"
      @tap="submiData()"
      row="4"
      col="0"
      colSpan="2"
    />
  </GridLayout>
</template>
<script>
import StringConst from "../../assets/StringConst";
import SelectProductMeta from "../../data/formMeta/SelectProductMeta";
import ProductList from "../../data/objects/Product";

export default {
    props: ["title","defaultDate"],
    created() {
        if (!!this.$props.defaultDate) {
          var dateArr = this.$props.defaultDate.split("/");
          if (dateArr.length == 3) {
            this.selectedDate = new Date(dateArr[2], dateArr[1]-1,dateArr[0]);
          }
        }
    },
    data() {
        return {
            selectedDate: new Date()
        };
    },
    methods: {
        closePage() {
        this.$modal.close();
        },
        submiData() {
            this.$modal.close({
                isSuccess: true,
                selectedDate: this.selectedDate,
                selectedDateStr: this.selectedDate.getDate() + "/" + (this.selectedDate.getMonth() + 1)+ "/" + this.selectedDate.getFullYear()
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
#btn_add_product {
  margin-left: 10;
  margin-right: 10;
}
</style>