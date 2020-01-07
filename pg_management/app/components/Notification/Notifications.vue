<template>
  <GridLayout rows="50, *" columns="50,*" class="page-parent">
    <ListView row="0" col="0" colSpan="2" rowSpan="2" for="item in $store.state.notifications" class="ls-group" @itemTap="onSelectedItem" v-show="$store.state.notifications.length > 0">
        <v-template>
            <GridLayout rows="auto,*" columns="auto, 12, *" class="ls-group-item">
                <Label :text="item.time" class="text-center" row="0" col="0" />
                <Label :text="item.date" class="text-center" row="1" col="0" />
                <Label :text="item.name" class="item-header text-ver-top" textWrap="true" row="0" col="2" />
                <Label :text="item.body" class="item-header-sub" textWrap="true" row="1" col="2" />
            </GridLayout>
        </v-template>
    </ListView>    
    <Label v-show="$store.state.notifications.length == 0" text="Hiện tại không có thông báo." class="text-center text-ver-middle" color="red" row="0" col="0" colSpan="2" rowSpan="2" />
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
import StringConst from '../../assets/StringConst';
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
            ApiService.methods
                .getNotifications(CurrentUser.methods.getBearId())
                .catch(this.callBackFail)
                .then(response => {
                    this.isProcessing = false;
                    if (response == undefined) {
                        return;
                    }
                this.$store.dispatch('pushNotifications', response.records);
                });
        },
        callBackFail(error) {
            console.log("GET_PROVINCE_ERROR", error.message);
            this.isProcessing = false;
            // var message = error.message.includes("UnknownHostException") ? StringConst.msg_unknow_host_exception : error.message;
            // this.showDlg(StringConst.lbl_error, message);
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

<style lang="scss">
    .ls-group-item{
        font-family: "f_arima_madurai_medium";
        color: black;
        font-size: 16;
        padding: 8 12;
    }
</style>