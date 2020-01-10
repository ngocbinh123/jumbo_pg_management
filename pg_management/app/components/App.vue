<template>
  <Page actionBarHidden="true">
    <GridLayout rows="*" columns="*">
      <TabView 
        iosIconRenderingMode="automatic"
        tabTextFontSize="14"
        tabTextColor="gray"
        selectedTabTextColor="#07612C"
        tabBackgroundColor="white"
        androidOffscreenTabLimit="0"
        androidSelectedTabHighlightColor="white"
        :selectedIndex="selectedIndex" 
        androidTabsPosition="bottom"
        col="0" row="0">
      
        <TabViewItem title="Schedule" iconSource="res://ic_checkin_list">
          <Home></Home>
        </TabViewItem>
        <TabViewItem title="Orders" iconSource="res://ic_cart">
          <OrderList></OrderList>
        </TabViewItem>
        <TabViewItem title="Notifications" iconSource="res://ic_bell" >
          <Notifications></Notifications>
        </TabViewItem>
        <TabViewItem title="Setting" iconSource="res://ic_user" >
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
import Account from "./Account/Account";
import CustomerList from "./Customer/CustomerList";
import Notifications from "./Notification/Notifications";
import OrderList from './orders/Orders';

export default {
  components: {
    Notifications,
    Home,
    Account,
    CustomerList,
    OrderList
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
  font-family: "f_arima_madurai_bold", "Arima Madurai";
}
</style>
