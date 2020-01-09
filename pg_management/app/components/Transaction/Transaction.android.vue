<template>
  <GridLayout id="trans_parent" columns="*" rows="*">
    <TabView 
        tabTextColor="#85AB98"
        selectedTabTextColor="white"
        tabBackgroundColor="#07612C"
        androidOffscreenTabLimit="0"
        androidSelectedTabHighlightColor="white"
        :selectedIndex="selectedIndex" 
        col="0" row="0">
      <TabViewItem title="ĐƠN HÀNG">
        <GridLayout rows="10, 60, *" columns="100, *, 50">
          <StackLayout orientation="horizontal" row="1" col="0" >
            <Label :text="'fa-calendar-alt' | fonticon" class="far font-icon font-icon-size-28 margin-left" @tap="chooseDate()" />
            <Label :text="'fa-calendar-day' | fonticon" class="fas font-icon font-icon-size-28 margin-left"  @tap="resetDateToToDay()" />
          </StackLayout>
          <Label :text="selectedDate" class="page_title_small text-center" row="1" col="0"  colSpan="3"/>
          <Button class="btn btn-add" text="+" row="1" col="2" @tap="createTransaction()"/>
          
          <RadListView 
            ref="listView" pullToRefresh="true"  @pullToRefreshInitiated="getRemoteOrders" :pullToRefreshStyle="pullToRefreshStyle"
            row="2" col="0" colSpan="3" rowSpan="2" for="item in $store.state.orders" @itemTap="onSelectedTransaction">
            <v-template>
              <GridLayout flexDirection="row" rows="*,*,*,*" columns="10,100,*" class="ls-item-check-in">
                <Label :text="item.abiz_ordertime" class="text-center time"  row="0" col="1"/>
                <Label :text="item.abiz_ordercode" class="item-header" textWrap="true" row="0" col="2"/>

                <StackLayout orientation="horizontal" class="parent-center" row="1" col="2">
                  <Label :text="'fa-map-marker-alt' | fonticon" class="fas font-icon"  width="10%" />
                  <Label :text="item.abiz_outletid.text" class="item-header-sub" textWrap="true" />
                </StackLayout>

                <StackLayout orientation="horizontal" class="parent-center" row="2" col="2">
                  <Label :text="'fa-user' | fonticon" class="far font-icon" width="10%" />
                  <Label :text="item.abiz_contactid.text" class="item-header-sub" />                  
                </StackLayout>

                <StackLayout orientation="horizontal" class="parent-center" row="3" col="2">
                  <Label :text="'fa-money-bill-alt' | fonticon" class="far font-icon"  width="10%"/>
                  <Label :text="formatCurrencystr(item.abiz_totalamountrollup)" class="item-header-sub" />                  
                </StackLayout>
              </GridLayout>
            </v-template>
          </RadListView>
          <Label v-if="!isProcessing && $store.state.orders.length == 0" text="Không có đơn hàng cho ngày được chọn." class="text-center" margin="24" color="red" row="2" col="0" colSpan="3" rowSpan="2" />

        </GridLayout>
      </TabViewItem>
      <TabViewItem title="KHÁCH HÀNG" >
        <GridLayout rows="10, 60, *" columns="10, *, 50">
          <Button class="btn btn-add" text="+" row="1" col="2" @tap="createCustomer()"/>
          <RadListView 
            ref="listView" pullToRefresh="true"  @pullToRefreshInitiated="getRemoteCustomers" :pullToRefreshStyle="pullToRefreshStyle"
            row="0" col="0" colSpan="3" rowSpan="3" for="customer in $store.state.customers"  @itemTap="onCustomerSelected">
            <v-template>
              <GridLayout flexDirection="row" rows="auto, auto, auto, auto" columns="10,*, 10" class="ls-item-check-in">
                <StackLayout orientation="horizontal" class="parent-center" row="0" col="1">
                  <Label :text="'fa-address-card' | fonticon" class="far font-icon font-icon-size-14" width="6%" />
                  <Label :text="customer.abiz_contactcode" class="item-header-sub" textWrap="true" />
                </StackLayout>
                <StackLayout orientation="horizontal" class="parent-center" row="1" col="1">
                  <Label :text="'fa-user' | fonticon" class="far font-icon font-icon-size-14" width="6%" />
                  <Label :text="customer.fullname" class="item-header" textWrap="true" />
                </StackLayout>
                <StackLayout orientation="horizontal" class="parent-center" row="2" col="1">
                  <Label :text="'fa-mobile-alt' | fonticon" class="fas font-icon font-icon-size-14" width="6%"/>
                  <Label :text="customer.mobilephone" class="item-header-sub" textWrap="true" />
                </StackLayout>
                <StackLayout orientation="horizontal" class="parent-center" row="3" col="1">
                  <Label :text="'fa-map-marker-alt' | fonticon" class="fas icon-address" style="margin: 5 0 0 0" width="6%"/>
                  <Label :text="getCustomerAddress(customer)" textWrap="true" class="item-header-sub" />                  
                </StackLayout>
              </GridLayout>
            </v-template>
          </RadListView>
          <Label v-if="!isProcessing && $store.state.customers.length == 0" text="Hiện tại không có khách hàng." class="text-center" textWrap="true" margin="24" color="red" row="0" col="0" colSpan="3" rowSpan="3" />
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
import TransactionDetail from "../orders/OrderDetail";
import DatePickerDlg from "../Dialog/DateWithoutLimitPickerDlg";

// other
import CurrentUser from "../../data/CurrentUser";
import StringConst from "../../assets/StringConst";
import ApiService from "../../service/BackEndService";
import Helper from '../../helper/PopularHelper';
import Remember from '../../share/Remember';
import Constant from "../../data/Constant";

export default {
  created() {
    const cacheOrders = Remember.getRemoteOrders().records;
    if (cacheOrders.length > 0 && cacheOrders[0].abiz_orderdate == Helper.getCurrentDateStrForRequest()) {
      this.$store.dispatch('pushOrders', cacheOrders);
    }

    const cacheCustomers = Remember.getRemoteCustomers().records;
    if (cacheCustomers.length > 0) {
      this.$store.dispatch('pushCustomers', cacheCustomers);
    }

    this.getRemoteCustomers();
    this.getRemoteOrders();
  },
  data() {
    return {
      isProcessing: false,
      selectedIndex: 0,
      selectedDate: Helper.getCurrentDateStr(),
      pullToRefreshStyle: Constant.pullToRefreshStyle
    };
  },
  methods: {
    onSelectedTransaction(event) {
      this.openTransactionDetail(event.item);
    },
    openTransactionDetail(transaction) {
      if (this.isProcessing) {
        return;
      }
      this.isProcessing = true;
      this.$showModal(TransactionDetail, { 
        fullscreen: true,
        animated: true,
        props: { transaction: transaction }
      }).then(result => {
        this.isProcessing = false;
      });
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
      this.openTransactionDetail(response.remoteOrder);
      this.getRemoteOrders();
      this.getRemoteCustomers();
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

      const oldCustomer = this.$store.state.customers.find(el => Helper.equalsIgnoreCase(el.contactid, response.customer.contactid));
      if (oldCustomer != undefined) {
        this.showDlg(StringConst.lbl_notification, "Khách hàng này đã có trong hệ thống với tên là: " + oldCustomer.fullname + ".");
      }else {
        this.$store.state.customers.unshift(response.customer);
        this.onCustomerSelected({ item: response.customer});
      }
    },
    resetDateToToDay() {
      this.selectedDate = Helper.getCurrentDateStr();
      this.getRemoteOrders();
    },
    chooseDate() {
      if (this.isProcessing) {
        return;
      }
      this.isProcessing = true;
      this.$showModal(DatePickerDlg, { 
        fullscreen: false, 
        animated: true,
        props: { 
          title: StringConst.lbl_change_other_date,
          defaultDate: this.selectedDate
        }
      }).then(result => {
        this.isProcessing = false;
        if (result == undefined || !result.isSuccess) {
          return;
        }    
       this.selectedDate = result.selectedDateStr;
       this.getRemoteOrders();
      });
    },
    getRemoteOrders(args) {
      if (args == undefined) {
        this.isProcessing = true;
      }
      ApiService.methods.getOrders(Helper.convertLocalDateToRequestDate(this.selectedDate), CurrentUser.methods.getBearId())
        .then(json => {
          this.isProcessing = false;
          if (args != undefined) {
            args.object.notifyPullToRefreshFinished();  
          }

          this.$store.dispatch('pushOrders', json.records);
          Remember.setRemoteOrders(json);
        })
        .catch(error => {
          this.isProcessing = false;
          if (args != undefined) {
            args.object.notifyPullToRefreshFinished();   
          } 
          if (this.$store.state.orders[0].abiz_orderdate != Helper.convertLocalDateToRequestDate(this.selectedDate)) {
            this.$store.dispatch('pushOrders', []);
          }
        });
    },
    getRemoteCustomers(args) {
      if (args == undefined) {
        this.isProcessing = true;
      }
      const currentDate= Helper.getCurrentDateStrForRequest();
      ApiService.methods.getCustomers(currentDate,CurrentUser.methods.getBearId())
      .then(json => {
        this.isProcessing = false;
        if (args != undefined) {
          args.object.notifyPullToRefreshFinished();  
        }
        if (json == undefined) {
          return;
        }
        this.$store.dispatch('pushCustomers', json.records);
        Remember.setRemoteCustomers(json);
      })
      .catch(error => {
        console.log("GET_REMOTE_CUSTOMER_ERROR", error.message);
        this.isProcessing = false;
        if (args != undefined) {
          args.object.notifyPullToRefreshFinished();  
        }
      });
    },
    showDlg(dlgTitle, dlgMsg) {
      return alert({
        title: dlgTitle,
        okButtonText: StringConst.lbl_close,
        message: dlgMsg
      });
    },
    getLocalGender(gendercode) {
      return !gendercode.value ? "" : gendercode.value == Constant.GENDER.Male.value ? Constant.GENDER.Male.text : Constant.GENDER.Female.text;
    },
    convertRequestDateToLocalDate(remoteDate) {
      return Helper.convertRequestDateToLocalDate(remoteDate);
    }, 
    formatCurrencystr(currency) {
      return Helper.formatCurrencystr(currency);
    },
    getCustomerAddress(customer) {
      return Helper.getFullCustomerAddress(customer);
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

.item-header,.item-header-sub {
  font-size: 14;
  vertical-align: middle;
  margin-left: 8; 
  
}

.item-header {
  color: $color-primary-dark;
  font-size: 16;
}

.item-header-sub {
  font-family: "f_arima_madurai_regular", "Arima Madurai";
}

.time {
  font-size: 16;
  vertical-align: middle; 
}

.date {
  font-family: "f_arima_madurai_thin", "Arima Madurai";
  font-size: 16;
  vertical-align: middle; 
}
</style>