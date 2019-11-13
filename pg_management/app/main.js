import Vue from 'nativescript-vue'
import App from './components/App'
import Login from './components/Login'
import ChangePass from './components/ChangePassword'
import BottomNavigationBar from 'nativescript-bottom-navigation/vue';
import RadDataForm from 'nativescript-ui-dataform/vue';
import store from './store'
const remember = require("./share/Remember");
Vue.use(BottomNavigationBar);
Vue.use(RadDataForm);

Vue.registerElement("DropDown", () => require("nativescript-drop-down/drop-down").DropDown)

// import $ from 'jquery';
// import '@progress/kendo-ui';
// import '@progress/kendo-theme-default/dist/all.css'
// import { AutoComplete, ComboBox, DropDownList, MultiSelect, DropdownsInstaller } from '@progress/kendo-dropdowns-vue-wrapper';
// import JSZip from 'jszip';

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
            return h('frame', [h(App)]);
        }
        return h('frame', [h(Login)]);
    }
}).$start()