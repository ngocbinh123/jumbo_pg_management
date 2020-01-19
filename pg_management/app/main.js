import Vue from 'nativescript-vue'
import App from './components/App'
import Login from './components/Login'
import ChangePass from './components/ChangePassword'
import SplashScreen from './components/SplashScreen';
import RadDataForm from 'nativescript-ui-dataform/vue';
import RadListView from 'nativescript-ui-listview/vue';
import { TNSFontIcon, fonticon } from 'nativescript-fonticon';
import store from './store'
var firebase = require("nativescript-plugin-firebase");
// import VueDevtools from 'nativescript-vue-devtools';

const remember = require("./share/Remember");
Vue.use(RadDataForm);
Vue.use(RadListView);

TNSFontIcon.debug = true
TNSFontIcon.paths = {
    'fa': './assets/css/fontawesome.css',
}
TNSFontIcon.loadCss()
Vue.filter('fonticon', fonticon)

if (TNS_ENV !== 'production') {
    // Vue.use(VueDevtools)
}

firebase.init({
    // Optionally pass in properties for database, authentication and cloud messaging,
    // see their respective docs.
    onPushTokenReceivedCallback: function(token) {
        remember.setFCMToken(token);
        console.log("Firebase push token: " + token);
    },
    onMessageReceivedCallback: function(message) {
        console.log("onMessageReceivedCallback", message);
    }
}).then(
    function() {
        console.log("firebase.init done");
    },
    function(error) {
        console.log("firebase.init error: " + error);
    }
);
Vue.prototype.$firebase = firebase;

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

new Vue({
    store,
    render(h) {
        var bearId = remember.getBearId();
        var forceChangePass = remember.getFroceChangePass();

        if (forceChangePass) {
            return h('frame', [h(ChangePass)]);
        } else if (bearId) {
            return h('frame', [h(SplashScreen)]);
        }
        return h('frame', [h(Login)]);
        // return h('frame', [h(SplashScreen)]);

    }
}).$start()