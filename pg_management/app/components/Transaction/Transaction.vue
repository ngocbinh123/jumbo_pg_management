<template>
  <GridLayout id="trans_parent" columns="*" rows="*">
    <TabView 
    tabTextColor="#008C99"
    selectedTabTextColor="white"
    tabBackgroundColor="#007882"
    androidOffscreenTabLimit="0"
    androidSelectedTabHighlightColor="white"
    :selectedIndex="selectedIndex" 
    col="0" row="0">
      <TabViewItem title="ĐƠN HÀNG">
        <GridLayout rows="10, 60, *" columns="10, *, 50">
          <Label :text="date" class="page_title_small text-center" row="1" col="0"  colSpan="3"/>
          <!-- <Image src="res://ic_alarm_primary" row="1" col="0" class="icon" v-show="false"/> -->
          <TextField id="txt_search_transaction" 
            row="1" col="1"
            v-model="searchTransValue"
            v-show="false"
            hint="Tìm kiếm đơn hàng" class="txt-search"/>
          <Button class="btn btn-add" text="+" row="1" col="2" @tap="createTransaction()"/>
          <ListView row="2" col="0" colSpan="3" rowSpan="2" for="item in transList" @itemTap="onSelectedTransaction">
            <v-template>
              <GridLayout flexDirection="row" rows="*,*,*,*" columns="10,100,*" class="ls-item-check-in">
                <Label :text="item.time" class="text-center time"  row="0" col="1"/>
                <Label :text="item.code" class="item-header" textWrap="true" row="0" col="2"/>

                <Label :text="item.date" class="text-center date" row="1" col="1"/>

                <StackLayout orientation="horizontal" class="parent-center" row="1" col="2">
                  <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon"  width="8%" />
                  <Label :text="item.store" class="item-header-sub" textWrap="true" />
                </StackLayout>
                <StackLayout orientation="horizontal" class="parent-center" row="2" col="2">
                  <Label :text="'fa-user' | fonticon" class="far font-icon" width="8%" />
                  <Label :text="item.customer.name" class="item-header-sub" />                  
                </StackLayout>

                <StackLayout orientation="horizontal" class="parent-center" row="3" col="2">
                  <Label :text="'fa-money-bill-alt' | fonticon" class="far font-icon"  width="8%"/>
                  <Label :text="item.displayTransTotal" class="item-header-sub" />                  
                </StackLayout>
              </GridLayout>
            </v-template>
          </ListView>
        </GridLayout>
      </TabViewItem>
      <TabViewItem title="KHÁCH HÀNG" >
        <GridLayout rows="10, 60, *" columns="10, *, 50">
          <Label :text="date" class="page_title_small text-center" row="1" col="0"  colSpan="3"/>
          <TextField id="txt_search_transaction" 
            row="1" col="1"
            v-model="searchTransValue"
            v-show="false"
            hint="Tìm kiếm đơn hàng" class="txt-search"/>
          <Button class="btn btn-add" text="+" row="1" col="2" @tap="createCustomer()"/>
          <ListView row="2" col="0" colSpan="3" rowSpan="2" for="customer in $store.state.customers"  @itemTap="onCustomerSelected">
            <v-template>
              <GridLayout flexDirection="row" rows="*,*,*" columns="10,50,*" class="ls-item-check-in">
                <Label :text="customer.id" class="text-center time"  row="0" col="1"/>
                <Label :text="customer.name" class="item-header" textWrap="true" row="0" col="2"/>
                <StackLayout orientation="horizontal" class="parent-center" row="1" col="2">
                  <Label :text="'fa-mobile-alt' | fonticon" class="fas font-icon font-icon-size-14" width="6%" row="1" col="2" />
                  <Label :text="customer.phone" class="item-header-sub" textWrap="true" />
                </StackLayout>
                <StackLayout orientation="horizontal" class="parent-center" row="2" col="2">
                  <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon font-icon-size-14" width="6%" row="1" col="2" />
                  <Label :text="customer.address" class="item-header-sub" />                  
                </StackLayout>
              </GridLayout>
            </v-template>
          </ListView>
        </GridLayout>
      </TabViewItem>
    </TabView>
    <ActivityIndicator v-show="isProcessing" busy="true" row="0" col="0"/>
  </GridLayout>
</template>
<script>
// pages 
import UserDetail from "../Customer/UserDetail";
import CreateTransaction from "../Transaction/CreateTransaction";
import CreateCustomer from "../Customer/CreateNewCustomer";
import TransactionDetail from "./TransactionDetail";

// other
import CurrentUser from "../../data/CurrentUser";
import StringConst from "../../assets/StringConst";

// models
import CustomerModel from "../../data/objects/Customer";

export default {
  created() {
    // this.$store.dispatch('getAllCustomers');
    this.customers = CustomerModel.customers;

    for(var i = 0; i < this.customers.length; i++) {
      const now = new Date();
      var time = (now.getHours() -1) + ":";
      if(i==0) {
        time+="00";
      }else {
        time+=9+ i*5 + i%2;
      }

      var item = {
        id: (i+1)*100,
        code:"COD-" + now.getFullYear()+ "-"+ now.getTime() + 1,
        customer: this.customers[i],
        store:"Takashimaya Vietnam",
        time: time,
        date: "Hôm nay",
        transTotal: 280000,
        displayTransTotal:"280,000 VND",
        products:[
          {
            id:1010,
            model:"MOD-2019-101",
            name:"Sản Phẩm 101",
            number:2,
            price:140000,
            total:280000            
          }
        ]
      }
      this.transList.push(item);
    }
    
    var currentDate = new Date();
    this.date = currentDate.getDate() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getFullYear();
  },
  data() {
    return {
      count: this.$store.state.count,
      isProcessing: false,
      selectedIndex: 0,
      searchTransValue:"",
      date: "",
      customers: [],
      transList:[]
    };
  },
  methods: {
    onSelectedTransaction(event) {
      if (this.isProcessing) {
        return
      }

      this.isProcessing = true;
      this.$showModal(TransactionDetail, { 
        fullscreen: true,
        animated: true,
        props: { transaction: event.item }
      }).then(result => {this.isProcessing = false});
    },
    onCustomerSelected(event) {
      if (this.isProcessing) {
        return;
      }

      this.isProcessing = true;
      this.$showModal(UserDetail, { 
        fullscreen: false, 
        animated: true,
        props: { customer: event.item }
      }).then(result => {this.isProcessing = false});
    },
    createTransaction() {
      if (this.isProcessing) {
        return
      }

      this.isProcessing = true;
      this.$showModal(CreateTransaction, { 
        fullscreen: true,
        animated: true,
        }).then(this.callbackCreateTransaction);
    },
    callbackCreateTransaction(response) {
      this.isProcessing = false;

      if (response == undefined || !response.isSuccess) {
        return;
      }

      this.transList.unshift(response.transaction);
    },
    createCustomer() {
      if (this.isProcessing) {
        return
      }
      this.isProcessing = true;
      this.$showModal(CreateCustomer, { 
        fullscreen: true,
         animated: true,
        }).then(this.callbackCreateCustomer);
    },
    callbackCreateCustomer(response) {
      this.isProcessing = false;
      if(response == undefined || !response.isSuccess) {
        return;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../app-variables.scss";
.page_title_small {
  color: $color-accent;
  margin: 0;
  vertical-align: middle;
}

.parent-center {
  vertical-align: middle;
}
.txt-search {
  border-width: 0.5;
  border-color:$color-border;
  border-radius: 50%;
  padding: 2 12;
  font-size: 16;
}
.icon {
  width: 16;
  vertical-align: middle;
}

.icon-small {
  width: 14;
  vertical-align: middle;
}

.item-header {
  font-size: 16;
  vertical-align: middle;
  margin-left: 4; 
  color: $color-primary-dark;
}

.item-header-sub {
  font-family: "f_arima_madurai_regular";
  font-size: 14;
  vertical-align: middle; 
  margin-left: 8; 
}

.time {
  font-size: 16;
  vertical-align: middle; 
}

.date {
  font-family: "f_arima_madurai_thin";
  font-size: 16;
  vertical-align: middle; 
}
</style>