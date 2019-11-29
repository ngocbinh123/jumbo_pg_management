<template>
  <GridLayout rows="50, *" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
      <Label text="DANH SÁCH SẢN PHẨM" class="text-center" />
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <ListView row="1" col="0" colSpan="2" for="item in products" class="ls-group" @itemTap="onSelectedProvince">
        <v-template>
            <GridLayout class="ls-group-item" rows="*" columns="*, auto, auto">
                <Label :text="item.abiz_name" row="0" col="0" />
                <Label :text="item.abiz_salesprice" row="0" col="1" />
                <Label :text="' '+ item.transactioncurrencyid.text" row="0" col="2" />
            </GridLayout>            
        </v-template>
    </ListView>    
    <ActivityIndicator v-show="products.length == 0" busy="true"  row="0" col="0" colSpan ="2" rowSpan="3"/>
  </GridLayout>
</template>

<script>
import CurrentUser from '../../data/CurrentUser';
import ApiService from '../../service/BackEndService';
import Remember from '../../share/Remember';

export default {
    props: ["dateStr","timeStr"],
    created() {
        this.getProducts();        
    },
    data() {
        return {
            products:[]
        };
    },
    methods: {
        closePage() {
            this.$modal.close();
        },
        onSelectedProvince(event) {
            this.$modal.close({
                isSuccess: true, 
                selected: event.item
            });
        },
        getProducts() {
            ApiService.methods
                .getProducts(this.$props.dateStr, this.$props.timeStr,CurrentUser.methods.getBearId())
                .catch(this.callBackFail)
                .then(this.getProductsSuccess);
        },
        getProductsSuccess(obj) {
            if (obj == undefined) {
                return;
            }
            this.products = obj.records;
        },
        callBackFail(error) {
            console.log("GET_PRODUCTS_ERROR", error.message);
        }
    }
}
</script>

<style lang="scss">
    .ls-group-item{
        font-family: "f_arima_madurai_medium";
        color: black;
        font-size: 16;
        padding: 8 12;
    }
</style>