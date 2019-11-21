<template>
    <Page actionBarHidden="true">
        <StackLayout>

        </StackLayout>
    </Page>
</template>

<script>
import App from './App';
import Login from './Login';
import ChangePass from './ChangePassword';

const transition = require("../share/Transition");
const timerModule = require("tns-core-modules/timer");
const remember = require("../share/Remember");

export default {
    created() {
        // this.$store.dispatch('getAllCustomers');
        // const nowInt = (new Date()).getTime();
        // const lastTimeUpdateProvince = Remember.getLastTimeUpadteProvinces();
        // if (!lastTimeUpdateProvince || (nowInt - lastTimeUpdateProvince) > Constant.TIME_CACHE_PROVINCES) {
        //     this.getProvinces();
        // }
        setTimeout(() => {
            this.gotoMain();
        }, 500);

    },
    methods: {
        gotoMain() {
            this.$navigateTo(App, {
                clearHistory: true,
                animated: true,
                transition: transition.pushPageTransition
            });
        }
    }
}
</script>