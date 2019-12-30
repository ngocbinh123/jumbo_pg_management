<template>
  <Page actionBarHidden="true">
    <GridLayout rows="*" columns="*">
      <TabView 
        iosIconRenderingMode="alwaysOriginal"
        tabTextColor="gray"
        selectedTabTextColor="#07612C"
        tabBackgroundColor="white"
        androidOffscreenTabLimit="0"
        androidSelectedTabHighlightColor="white"
        :selectedIndex="selectedIndex" 
        androidTabsPosition="bottom"
        col="0" row="0"
      >
        <TabViewItem title="Chấm Công" iconSource="res://ic_checkin_list">
          <Home></Home>
        </TabViewItem>
        <TabViewItem title="Đơn Hàng" iconSource="res://ic_cart">
          <Transaction></Transaction>
        </TabViewItem>
        <TabViewItem title="Tài Khoản" iconSource="res://ic_user" >
          <Account></Account>
        </TabViewItem>
      </TabView>
    </GridLayout>
  </Page>
</template>

<script >
import * as firebase from"nativescript-plugin-firebase";
import Constant from "../data/Constant";

import Home from "./Home/Home";
import Transaction from "./Transaction/Transaction";
import Account from "./Account/Account";

export default {
  components: {
    Home,
    Transaction,
    Account
  },
  data() {
    return {
      selectedIndex: 0
    };
  },
  created() {
    firebase.analytics.logEvent({
      key: Constant.KEY_PAGE_VIEW,
      parameters: [
        {
          key: Constant.KEY_PAGE_ID, 
          value: "APP"
        }
      ]
    });
  },
  methods: {

  }
};
</script>

<style scoped lang="scss">
@import "../app-variables";

TabViewItem {
  font-family: "f_arima_madurai_bold";
}
</style>
