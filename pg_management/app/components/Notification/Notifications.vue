<template>
  <GridLayout rows="50, *" columns="50,*" class="page-parent">
    <ListView row="0" col="0" colSpan="2" rowSpan="2" for="item in remoteNotifications" class="ls-group" @itemTap="onSelectedItem">
        <v-template>
            <GridLayout rows="auto,*" columns="auto, 12, *" class="ls-group-item">
                <Label :text="getDateFromStr(item.abiz_datetime, false)" class="text-center" row="0" col="0" />
                <Label :text="getDateFromStr(item.abiz_datetime)" class="text-center" row="1" col="0" />
                <Label :text="item.abiz_title" class="item-header text-ver-top" textWrap="true" row="0" col="2" />
                <Label :text="item.abiz_body" class="item-header-sub" textWrap="true" row="1" col="2" />
            </GridLayout>
        </v-template>
    </ListView>    
    <ActivityIndicator v-show="isProcessing" busy="true"  row="0" col="0" colSpan ="2" rowSpan="3"/>
  </GridLayout>
</template>

<script>
import CurrentUser from '../../data/CurrentUser';
import ApiService from '../../service/BackEndService';
import Remember from '../../share/Remember';
import * as firebase from 'nativescript-plugin-firebase';
import Constant from '../../data/Constant';
import NotificationDetail from './NotificationDetail';
import Helper from '../../helper/PopularHelper';
export default {
    created() {
        this.trackingPage();
        this.getRemoteNotifications();
    },
    data() {
       return {
           isProcessing: false,
           remoteNotifications: []
       }
    },
    methods: {
        trackingPage() {
            firebase.analytics.logEvent({
            key: Constant.KEY_PAGE_VIEW,
            parameters: [
                {
                    key: Constant.KEY_PAGE_ID, 
                    value: "PAGE_NOTIFICATIONS"
                }
                ]
            });
        },
        closePage() {
            this.$modal.close();
            this.getRemoteNotifications();
        },
        getDateFromStr(dateStr, isDate = true) {
            const dateArr = dateStr.split(" ");  
            return dateArr[isDate ? 0 : 1];
        },
        onSelectedItem(event) {
            if (this.isProcessing) {
                return;
            }
            this.isProcessing = true;
            this.$showModal(NotificationDetail, { 
                fullscreen: !CurrentUser.isAndroidDevice, 
                animated: true,
                props: {
                    notification: event.item
                }
            }).then(() => this.isProcessing = false);
        },
        getRemoteNotifications() {
            this.isProcessing = true;
            var promise = new Promise(() => {
                const item = {
                    abiz_datetime: Helper.getCurrentDateStr() + " " + Helper.getCurrentTimeStr(),
                    abiz_title: 'Nộp ảnh 3x4 làm hồ sơ',
                    abiz_body: 'Các bạn nhớ nộp ảnh 3x4 để làm hồ sơ, hạn chót là ngày 20/02/2020 nhé'
                }
                for(let index = 0; index < 100; index++) {
                    this.remoteNotifications.push(item);
                }

                this.isProcessing = false;
            });

            Promise.all([promise]);
            // ApiService.methods
            //     .getProvinces(CurrentUser.methods.getBearId())
            //     .catch(this.callBackFail)
            //     .then(response => {
            //         this.remoteNotifications = response.records;
            //         this.isProcessing = false;
            //     });
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