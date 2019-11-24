<template>
    <Page actionBarHidden="true">
        <StackLayout>
        </StackLayout>
    </Page>
</template>

<script>
import App from './App';
const transition = require("../share/Transition");

export default {
    created() {
    
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