<template>
    <Page actionBarHidden="true">
        <StackLayout>
        </StackLayout>
    </Page>
</template>

<script>
import App from './App';
import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";
import Remember from "../share/Remember"; 
const transition = require("../share/Transition");

export default {
    created() {
        Remember.setIsAndroidDevice(isAndroid);
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