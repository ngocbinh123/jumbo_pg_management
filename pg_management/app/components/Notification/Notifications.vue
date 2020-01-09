<template>
  <GridLayout rows="50, *" columns="50,*" class="page-parent">

    <RadListView ref="listView" pullToRefresh="true"  @pullToRefreshInitiated="getRemoteNotifications" :pullToRefreshStyle="pullToRefreshStyle"
    row="0" col="0" colSpan="2" rowSpan="2" for="item in $store.state.notifications" class="ls-group" @itemTap="onSelectedItem">
        <v-template>
            <GridLayout rows="auto,*" columns="auto, 12, *" class="ls-group-item">
                <Label :text="item.time" class="text-center" row="0" col="0" />
                <Label :text="item.date" class="text-center" row="1" col="0" />
                <Label :text="item.name" class="item-header text-ver-top" textWrap="true" row="0" col="2" />
                <Label :text="item.body" class="item-header-sub" textWrap="true" row="1" col="2" />
            </GridLayout>
        </v-template>
    </RadListView>    
    <ActivityIndicator v-show="isProcessing" busy="true"  row="0" col="0" colSpan ="2" rowSpan="3"/>
    <Label v-show="$store.state.notifications.length == 0" text="Hiện tại không có thông báo." class="text-center text-ver-middle" color="red" row="0" col="0" colSpan="2" rowSpan="2" />
  </GridLayout>
</template>

<script>
import CurrentUser from '../../data/CurrentUser';
import ApiService from '../../service/BackEndService';
import Remember from '../../share/Remember';
import Constant from '../../data/Constant';
import NotificationDetail from './NotificationDetail';
import Helper from '../../helper/PopularHelper';
import StringConst from '../../assets/StringConst';
export default {
    created() {
        this.getRemoteNotifications();
    },
    data() {
       return {
           isShow: true,
            isProcessing: false,
            remoteNotifications: [],
            pullToRefreshStyle: Constant.pullToRefreshStyle
       }
    },
    methods: {
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
        getRemoteNotifications(args) {
            if (args == undefined) {
                this.isProcessing = true;
            }

            ApiService.methods
                .getNotifications(CurrentUser.methods.getBearId())
                .catch(error => {
                    if (args != undefined) {
                        args.object.notifyPullToRefreshFinished();   
                    }
                    this.callBackFail(error);
                })
                .then(response => {
                    this.isProcessing = false;
                    if (response == undefined) {
                        return;
                    }
                    this.$store.dispatch('pushNotifications', response.records);
                    if (args != undefined) {
                    args.object.notifyPullToRefreshFinished();   
                    }
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