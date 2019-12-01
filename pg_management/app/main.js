import Vue from 'nativescript-vue'
import App from './components/App'
import Login from './components/Login'
import ChangePass from './components/ChangePassword'
import SplashScreen from './components/SplashScreen';
import RadDataForm from 'nativescript-ui-dataform/vue';
import { TNSFontIcon, fonticon } from 'nativescript-fonticon';
import store from './store'
// import VueDevtools from 'nativescript-vue-devtools';

const remember = require("./share/Remember");
Vue.use(RadDataForm);
Vue.registerElement("DropDown", () => require("nativescript-drop-down/drop-down").DropDown)

TNSFontIcon.debug = true
TNSFontIcon.paths = {
    'fa': './assets/css/fontawesome.css',
}
TNSFontIcon.loadCss()
Vue.filter('fonticon', fonticon)

if (TNS_ENV !== 'production') {
    // Vue.use(VueDevtools)
}

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