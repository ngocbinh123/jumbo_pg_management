<template>
  <GridLayout rows="50,20, auto, auto, auto, auto 30, 70" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
      <Label text="THÊM SẢN PHẨM" class="text-center" />
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <!-- <RadDataForm :source="product" :metadata="selectProductMeta" row="2" col="0" colSpan="2" /> -->
    <Label text="Sản Phẩm" row="2" col="0" colSpan="2" margin="0 0 0 12" />
    
    <GridLayout orientation="horizontal" class="edt-box" row="3" col="0" colSpan="2" rows="*" columns="6, *, 30" @tap="showProducts()">
        <Label v-model="product.name" class="text-value" row="0" col="1" margin="0 0 0 0" />
        <Label :text="'fa-caret-down' | fonticon" class="fas text-center font-icon-size-24" row="0" col="2" />
    </GridLayout>

    <Label text="Số Lượng" row="4" col="0" colSpan="2" margin="24 0 0 12" />
    <TextView v-model="product.number"  keyboardType="number" autocorrect="false" class="edt-box" row="5" col="0" colSpan="2" />
    <Button
      id="btn_add_product"
      text="Thêm"
      class="btn btn-fill-bg"
      @tap="submiData()"
      row="7"
      col="0"
      colSpan="2"
    />
  </GridLayout>
</template>
<script>
import StringConst from "../../assets/StringConst";
import SelectProductMeta from "../../data/formMeta/SelectProductMeta";
import ProductList from "../../data/objects/Product";
import ProductListDlg from "../Product/ProductList"
export default {
  props: ["dateStr","timeStr"],
  data() {
    return {
      selectProductMeta: SelectProductMeta,
      products: ProductList.getProductList(),
      product: {
        id: "",
        name: "Chọn sản phẩm",
        number: 1,
        price: "",
        currencyUnit:""
      }
    };
  },
  methods: {
    closePage() {
      this.$modal.close();
    },
    showProducts() {
      this.$showModal(ProductListDlg, {
        fullscreen: true,
        animated: true,
        props: {
          dateStr: this.$props.dateStr,
          timeStr: this.$props.timeStr
        }
      }).then(this.callBackSelectProduct);
    },
    callBackSelectProduct(result) {
      if (result == undefined || !result.isSuccess) {
        return;

      }

      this.product.id = result.selected.abiz_productid;
      this.product.name = result.selected.abiz_name;
      this.product.price = result.selected.abiz_salesprice;
      this.producr.currencyUnit = result.selected.transactioncurrencyid.text;

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
      }else if (!this.product.id || !this.product.name || this.product.name == "Chọn sản phẩm") {
           this.showDlg(
          StringConst.lbl_notification,
          StringConst.msg_please_choos_product
        );
        return;
      }

      var selectedProduct = {
                id: this.product.id,
                model: this.product.name,
                name: this.product.name,
                number: this.product.number,
                price: this.product.price,
                total: this.product.price * this.product.number
            };

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