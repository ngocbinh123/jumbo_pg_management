<template>
  <Page actionBarHidden="true">
    <GridLayout rows="*" columns="*">
      <TabView 
        iosIconRenderingMode="alwaysOriginal"
        tabTextColor="gray"
        selectedTabTextColor="#008C99"
        tabBackgroundColor="white"
        androidOffscreenTabLimit="0"
        androidSelectedTabHighlightColor="white"
        :selectedIndex="selectedIndex" 
        androidTabsPosition="bottom"
        col="0" row="0"
      >
        <TabViewItem title="Chấm Công" iconSource="res://ic_home">
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
import Constant from "../data/Constant";

import Home from "./Home/Home";
import Transaction from "./Transaction/Transaction";
import Account from "./Account/Account";
import Customer from "../data/objects/Customer";
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
    this.$store.dispatch('getAllCustomers');
    this.$store.dispatch('getInvoices');
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
