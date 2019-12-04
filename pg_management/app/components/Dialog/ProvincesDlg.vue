<template>
  <GridLayout rows="50, *" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
      <Label text="CHỌN TỈNH/ THÀNH PHỐ" class="text-center" />
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <ListView row="1" col="0" colSpan="2" for="item in $store.state.provinces" class="ls-group" @itemTap="onSelectedProvince">
        <v-template>
            <Label :text="item.name" class="ls-group-item"/>
        </v-template>
    </ListView>    
    <ActivityIndicator v-show="$store.state.provinces.length == 0" busy="true"  row="0" col="0" colSpan ="2" rowSpan="3"/>
  </GridLayout>
</template>

<script>
import CurrentUser from '../../data/CurrentUser';
import ApiService from '../../service/BackEndService';
import Remember from '../../share/Remember';
import * as firebase from"nativescript-plugin-firebase";
import Constant from "../../data/Constant";

export default {
    created() {
        if ( this.$store.state.provinces.length == 0) {
            this.getProvinces();
        }
        this.trackingPage();
    },
    methods: {
        trackingPage() {
            firebase.analytics.logEvent({
            key: Constant.KEY_PAGE_VIEW,
            parameters: [
                {
                    key: Constant.KEY_PAGE_ID, 
                    value: "DLG_ADDRESS_PROVINCE"
                }
                ]
            });
        },
        closePage() {
            this.$modal.close();
        },
        onSelectedProvince(event) {
            this.$modal.close({
                isSuccess: true, 
                selected: event.item
            });
        },
        getProvinces() {
            ApiService.methods
                .getProvinces(CurrentUser.methods.getBearId())
                .catch(this.callBackFail)
                .then(this.getProvincesSuccess);
        },
        getProvincesSuccess(obj) {
            if (obj == undefined) {
                return;
            }
            if (obj.records.length > 0) {
                // const now = (new Date()).getTime();
                // Remember.setLastTimeUpadteProvinces(now);
                this.$store.dispatch('insertProvinces', obj);
            }
        },
        callBackFail(error) {
            console.log("GET_PROVINCE_ERROR", error.message);
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