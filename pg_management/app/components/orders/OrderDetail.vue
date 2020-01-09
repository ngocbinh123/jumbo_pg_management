<template>
  <GridLayout rows="50,15, auto,auto,auto, auto, 10,auto,auto,auto, auto, 10, auto,auto,*" columns="50,*,10,50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="5" width="100%">
        <Label text="CHI TIẾT ĐƠN HÀNG" class="text-center"/>
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="$modal.close();" row="0" col="0" />

    <Label text="Thông Tin Khách Hàng:" class="header" row="2" col="0" colSpan="5" />

    <Label :text="'fa-user' | fonticon" class="far font-icon font-icon-size-18"  row="3" col="0" />
    <Label :text="orderDetail.fullname" class="text-center txt-value" textWrap="true" row="3" col="1" colSpan="4"/>

    <Label :text="'fa-mobile-alt' | fonticon" class="fas font-icon font-icon-size-18"  row="4" col="0" />
    <Label :text="orderDetail.mobilephone" class="text-center txt-value" textWrap="true" row="4" col="1" />

    <Label :text="'fa-map-marker-alt' | fonticon" class="fas icon-address" style="margin: 5 0 0 0; font-size:18" row="5" col="0" />
    <Label :text="getCustomerAddress(orderDetail)" class="text-center txt-value" textWrap="true" row="5" col="1" colSpan="4" />

    <Label text="Chi tiết đơn hàng:" class="header" row="7" col="0" colSpan="5" />

    <Label :text="'fa-barcode' | fonticon" class="fas font-icon font-icon-size-18" row="8" col="0" />
    <Label :text="orderDetail.abiz_ordercode" class="trans-code-value" row="8" col="1" colSpan="4"/>

    <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon font-icon-size-18" row="9" col="0" />
    <Label :text="orderDetail.abiz_outletid.text" class="trans-code-value" row="9" col="1" colSpan="4" />

    <GridLayout row="10" col="0" colSpan="5" rows="auto, auto, auto" columns="100, *" class="edt-box">
      <Label text="Tổng tiền SP:" class="text-right" textWrap="true" row="0" col="0" />          
      <Label :text="formatCurrency(orderDetail.abiz_netamount)" class="text-right" textWrap="true" row="0" col="1" />
      <Label text="VAT (10%):" class="text-right" textWrap="true" row="1" col="0" />
      <Label :text="formatCurrency(orderDetail.abiz_taxtamount)" class="text-right" textWrap="true" row="1" col="1" />
      <Label text="Tổng cộng:" class="text-right border-top lbl-sum" textWrap="true" row="2" col="0" />
      <Label :text="formatCurrency(orderDetail.abiz_amount)" class="text-right lbl-sum-value border-top"  padding ="0" textWrap="true" row="2" col="1" />
    </GridLayout>
    
    <Label text="Danh sách sản phẩm:" class="header" row="12" col="0" colSpan="5" />

    <GridLayout class="lout-columns" rows="*" columns="5,*, 40,100, 120" row="13" col="0" colSpan="5">
      <Label text="Tên SP" class="column-name text-center" row="0" col="1"/>
      <Label text="SL" class="column-name text-right" row="0" col="2" />
      <Label text="Đơn Giá" class="column-name text-center" row="0" col="3" />
      <Label text="Tổng" class="column-name text-center" row="0" col="4" />
    </GridLayout>

    <ListView for="item in orderDetail.records" row="14" col="0" colSpan="5">
      <v-template>
        <GridLayout rows="*" columns="5,*, 40,100, 120" class="lout-padding-ver">
          <Label :text="item.abiz_productid.text" class="lbl-name" textWrap="false" row="0" col="1" padding="0 5 0 2" />
          <Label :text="item.abiz_quantity" class="lbl-number text-right" row="0" col="2" />
          <Label :text="formatCurrency(item.aboz_unitprice).replace('VND', '').trim()" class="lbl-pricce text-right" row="0" col="3" padding="0 2 0 5" />
          <Label :text="formatCurrency(item.abiz_netamount).replace('VND', '').trim()" class="lbl-total text-right" row="0" col="4" padding="0 2 0 5" />
        </GridLayout>
      </v-template>
    </ListView>
    <ActivityIndicator v-show="isProcessing" busy="true" row="0" col="0" rowSpan="15" colSpan="5" />
  </GridLayout>
</template>
<script>
import Constant from "../../data/Constant";
import ApiService from "../../service/BackEndService";
import CurrenntUser from "../../data/CurrentUser";
import StringConst from "../../assets/StringConst";
import Helper from "../../helper/PopularHelper";

export default {
    props: ["transaction"],
    data() {
        return {
            isProcessing: false,
            orderDetail: {
                abiz_orderid: this.$props.transaction.abiz_orderid,
                fullname: this.$props.transaction.abiz_contactid.text,
                mobilephone: "",
                abiz_provinceid: {
                    text: "",
                    value: ""
                },
                abiz_districtid: {
                    text: "",
                    value: ""
                },
                abiz_ward: "",
                abiz_street: "",
                abiz_ordercode: this.$props.transaction.abiz_ordercode,
                abiz_outletid: {
                    text: this.$props.transaction.abiz_outletid.text,
                    value: this.$props.transaction.abiz_outletid.value
                },
                abiz_netamount: "",
                abiz_taxtamount: "",
                abiz_amount: this.$props.transaction.abiz_totalamountrollup,
                records: [
                    {
                        abiz_productid: {
                            text: "",
                            value: ""
                        },
                        abiz_quantity: "",
                        aboz_unitprice: "",
                        abiz_netamount: ""
                    }
                ]
            }
        };
    },
    created() {
        this.orderDetail.abiz_amount = this.$props.transaction.abiz_totalamountrollup;
        const vat = Math.ceil(this.orderDetail.abiz_amount/11);

        this.orderDetail.abiz_taxtamount = vat;
        this.orderDetail.abiz_netamount = this.orderDetail.abiz_amount-vat;  

        this.getRemoteOrderDetail();

        const cacheCustomer = this.$store.state.customers.find(el => el.contactid == this.$props.transaction.abiz_contactid.value);
        if (cacheCustomer != undefined) {
            this.orderDetail.mobilephone = cacheCustomer.mobilephone;
            this.orderDetail.abiz_street = cacheCustomer.abiz_street;
            this.orderDetail.abiz_ward = cacheCustomer.abiz_ward;
            this.orderDetail.abiz_districtid = cacheCustomer.abiz_districtid;
            this.orderDetail.abiz_provinceid = cacheCustomer.abiz_provinceid;
        }
    },
    methods: {
        getCustomerAddress(orderDetail) {
            return Helper.getFullCustomerAddress(orderDetail);
        },
        formatCurrency(currency) {
            return Helper.formatCurrencystr(currency);
        },
        getRemoteOrderDetail() {
            this.isProcessing = true;
            ApiService.methods.getOrderDetail(this.$props.transaction.abiz_orderid,CurrenntUser.methods.getBearId())
            .catch(error => {
                this.isProcessing = false;
                if (error == undefined) {
                    return;
                }

                var errMsg = error.message;
                if (errMsg.includes("UnknownHostException")) {
                    errMsg = StringConst.msg_unknow_host_exception;
                }
                setTimeout(() => {
                    this.showDlg(StringConst.lbl_error, errMsg);
                }, 500);
                
            })
            .then(response => {
                this.isProcessing = false;
                if (response == undefined) {
                    return;
                }
                this.orderDetail = response;
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
}
</script>