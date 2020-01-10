<template>
  <GridLayout rows="50, *" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
      <Label :text="$props.title" class="text-center" />
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <ListView row="1" col="0" colSpan="2" for="item in disctricts" class="ls-group" @itemTap="onSelectedDistrict">
        <v-template>
             <GridLayout rows="*" columns="20, *,50,5" class="ls-group-item">
                <Label :text="'fa-circle' | fonticon" class="far font-icon font-icon-size-14 text-left" color="grey" row="0" col="0"  />
                <Label :text="item.abiz_name" class="item-header margin-left" row="0" col="1" />
                <Label :text="'fa-chevron-right' | fonticon" class="fas font-iconfont-icon-size-24 text-right" color="grey" row="0" col="2"  />
            </GridLayout>
        </v-template>
    </ListView>    
    <ActivityIndicator v-show="processing" busy="true"  row="0" col="0" colSpan ="2" rowSpan="3"/>
  </GridLayout>
</template>

<script>
import CurrentUser from '../../data/CurrentUser';
import ApiService from '../../service/BackEndService';
import Remember from '../../share/Remember';
import * as firebase from"nativescript-plugin-firebase";
import Constant from "../../data/Constant";

export default {
    props: ["title","province"],
    created() {
        this.getDistricts();
        this.trackingPage();
    },
    data() {
        return {
            processing: true,
            disctricts: []
        }
    }, 
    methods: {
        trackingPage() {
            firebase.analytics.logEvent({
            key: Constant.KEY_PAGE_VIEW,
            parameters: [
                {
                    key: Constant.KEY_PAGE_ID, 
                    value: "DLG_ADDRESS_DISTRICT"
                }
                ]
            });
        },
        closePage() {
            this.$modal.close();
        },
        onSelectedDistrict(event) {
            this.$modal.close({
                isSuccess: true, 
                selected: {
                    id: event.item.abiz_locationid,
                    name: event.item.abiz_name
                }
            });
        },
        getDistricts() {
            ApiService.methods
                .getDistricts(this.$props.province.id ,CurrentUser.methods.getBearId())
                .catch(this.callBackFail)
                .then(this.getDisctrictSuccess);
        },
        getDisctrictSuccess(obj) {
            this.disctricts = obj.records;
            this.processing = false;
        },
        callBackFail(error) {

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