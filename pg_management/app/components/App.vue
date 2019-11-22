<template>
  <Page actionBarHidden="true">
    <GridLayout rows="*, auto">
      <FlexBoxLayout id="page_content" row="0">
        <Home v-show="selectedIndex==0"></Home>
        <Transaction v-show="selectedIndex==1"></Transaction>
        <Account v-show="selectedIndex==2"></Account>
      </FlexBoxLayout>
      <BottomNavigationBar
        class="custom-bottom-navigation-bar"
        @tabPressed="onBottomNavigationTabPressed"
        @tabSelected="onBottomNavigationTabSelected"
        @tabReselected="onBottomNavigationTabReselected"
        row="1"
      >
        <BottomNavigationTab title="Chấm Công" icon="res://ic_home" />
        <BottomNavigationTab title="Đơn Hàng" icon="res://ic_cart" />
        <BottomNavigationTab title="Tài Khoản" icon="res://ic_user" />
      </BottomNavigationBar>
    </GridLayout>
  </Page>
</template>

<script >
import Home from "./Home/Home";
import Transaction from "./Transaction/Transaction";
import Account from "./Account/Account";
import Customer from "../data/objects/Customer";
import Remember from "../share/Remember";
import ApiService from "../service/BackEndService";
import CurrentUser from '../data/CurrentUser';
import Constant from "../data/Constant";
export default {
  components: {
    Home,
    Transaction,
    Account
  },
  data() {
    return {
      selectedIndex: 0,
      msg: "Hello World!"
    };
  },
  created() {
    this.$store.dispatch('getAllCustomers');
    const nowInt = (new Date()).getTime();
    const lastTimeUpdateProvince = Remember.getLastTimeUpadteProvinces();
    if (!lastTimeUpdateProvince || (nowInt - lastTimeUpdateProvince) > Constant.TIME_CACHE_PROVINCES) {
      this.getProvinces();
    }
  },
  methods: {
    onBottomNavigationTabPressed: function(args) {
      console.log(`pressed tab index:  ${args.index}`);
    },
    onBottomNavigationTabSelected: function(args) {
      this.selectedIndex = args.newIndex;
      console.log(`old tab index:  ${args.oldIndex}`);
      console.log(`selected tab index:  ${args.newIndex}`);
    },
    onBottomNavigationTabReselected: function(args) {
      console.log(`reselected tab index:  ${args.index}`);
    },
    getProvinces() {
      this.processing = true;
      ApiService.methods
        .getProvinces(CurrentUser.methods.getBearId())
        .catch(this.callBackFail)
        .then(this.getProvincesSuccess);
    },
    getProvincesSuccess(obj) {
      if (obj.records.length > 0) {
        const now = (new Date()).getTime();
        Remember.setLastTimeUpadteProvinces(now);
        this.$store.dispatch('insertProvinces', obj);
      }
      this.processing = false;
    },
    callBackFail(error) {
      this.processing = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../app-variables";

BottomNavigationTab {
  font-family: "f_arima_madurai_bold";
}
.custom-bottom-navigation-bar {
  active-color: $color-primary-dark;
  background-color: white;
  inactive-color: $color-sliver;
}

.page_content {
  background: $color-primary-dark;
}
</style>
