<template>
  <GridLayout rows="50,20, *,30, 70" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
      <Label text="THÊM SẢN PHẨM" class="text-center" />
    </FlexboxLayout>
    <Image id="btn_back" src="res://ic_left_arrow_white" @tap="closePage()" row="0" col="0" />
    <RadDataForm :source="product" :metadata="selectProductMeta" row="2" col="0" colSpan="2" />
    <Button
      id="btn_add_product"
      text="Thêm"
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
  data() {
    return {
      selectProductMeta: SelectProductMeta,
      products: ProductList.getProductList(),
      product: {
        name: "",
        number: 1
      }
    };
  },
  methods: {
    closePage() {
      this.$modal.close();
    },
    submiData() {
      if (this.product.number > 10) {
        this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_product_number_out_of_scope_max
        );
        return;
      } else if (this.product.number < 1) {
        this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_product_number_out_of_scope_min
        );
        return;
      }else if (!this.product.name || this.product.name == "Chọn Sản Phẩm") {
           this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_please_choos_product
        );
        return;
      }

      var selectedProduct = {
          id:-1
      };
      this.products.forEach(element => {
          if(element.name == this.product.name) {
            selectedProduct = {
                id: element.id,
                model: element.model,
                name: element.name,
                number: this.product.number,
                price: element.price,
                total: element.price * this.product.number
            };
            return;
          }
      });

      this.$modal.close({
        isSuccess: selectedProduct.id != -1,
        product: selectedProduct
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
#btn_add_product {
  margin-left: 10;
  margin-right: 10;
}
</style>