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
          <TextField id="txt_search_transaction" 
            row="1" col="1"
            v-model="searchTransValue"
            v-show="false"
            hint="Tìm kiếm đơn hàng" class="txt-search"/>
          <Button class="btn btn-add" text="+" row="1" col="2" @tap="createTransaction()"/>
          <ListView row="2" col="0" colSpan="3" rowSpan="2" for="item in $store.state.invoices" @itemTap="onSelectedTransaction">
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
          <!-- <Label text="Thêm Khách Hàng" class="page_title_small text-center" row="1" col="0"  colSpan="3"/> -->
          <TextField id="txt_search_transaction" 
            row="1" col="1"
            v-model="searchTransValue"
            v-show="false"
            hint="Tìm kiếm đơn hàng" class="txt-search"/>
          <Button class="btn btn-add" text="+" row="1" col="2" @tap="createCustomer()"/>
          <ListView row="0" col="0" colSpan="3" rowSpan="3" for="customer in $store.state.customers"  @itemTap="onCustomerSelected">
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
import ApiService from "../../service/BackEndService";
import Helper from '../../helper/PopularHelper';
import Remember from '../../share/Remember';
export default {
  created() {
    this.getRemoteCustomers();
    this.getRemoteOrders();
    var currentDate = new Date();
    this.date = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
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
      
      if (event.item.products.length == 0) {
        let that = this;
        const query = "SELECT productId, productName, number, price, total, invoiceId FROM InvoiceDetail WHERE invoiceId = ?";
        this.$store.state.database.all(query, [event.item.id]).then(result => {
          result.forEach(row => {
            var product = {
                id:row[0],
                model:"",
                name: row[1],
                number: row[2],
                price: row[3],
                total: row[4]  
            };
            event.item.products.push(product);
          });
          that.openTransactionDetail(event.item);
        }, error => {
            console.log("SELECT INVOICE DETAIL ERROR", error);
        });
      }else {
        this.openTransactionDetail(event.item);
      }
    },
    openTransactionDetail(transaction) {
      this.$showModal(TransactionDetail, { 
        fullscreen: true,
        animated: true,
        props: { transaction: transaction }
      }).then(result => {
        this.isProcessing = false
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

      this.openTransactionDetail(response.transaction);
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

      const event = {
        item: response.customer
      };
      this.onCustomerSelected(event);
    },
    getRemoteOrders() {
      const currentDate= Helper.getCurrentDateStrForRequest();
      const lastDate = Remember.getLastDateGetRemoteOrders();
      if (lastDate == currentDate) {
        return;
      }

      ApiService.methods.getOrders(currentDate, CurrentUser.methods.getBearId())
        .then(this.callbackGetOrdersSuccess)
        .catch(this.callbackGetOrderFail);
    },
    callbackGetOrdersSuccess(json) {
      if (json == undefined) {
        return;
      }

      const currentDate= Helper.getCurrentDateStrForRequest();
      Remember.setLastDateGetRemoteOrders(currentDate);
      
      if (json.records.length == 0) {
        return
      }
      json.records.forEach(order => {
        if (order.abiz_contactid.value == null) {
          return;    
        }
      
        const isNotExisted = this.$store.state.invoices.find(el => el.code == order.abiz_ordercode) == undefined;
        if (isNotExisted) {
          var newTransaction = {
            id: Math.floor(Math.random() * 100) + 100,
            code:order.abiz_ordercode,
            customer: {
              id: Math.floor(Math.random() * 100) + 100,
              name: order.abiz_contactid.text,
              phone: "",
              address: "", 
              contactId: order.abiz_contactid.value
            },
            store: order.abiz_outletid.text,
            time: order.abiz_ordertime,
            date: Helper.convertRequestDateToLocalDate(order.abiz_orderdate),
            transTotal: order.abiz_totalamountrollup,
            displayTransTotal: Helper.formatCurrencystr(order.abiz_totalamountrollup),
            products: []
          }
          this.$store.dispatch('insertInvoice', newTransaction);;
        }
      });
    },
    callbackGetOrderFail(error) {

    },
    getRemoteCustomers() {
      const currentDate= Helper.getCurrentDateStrForRequest();
      const lastDate = Remember.getLastDateGetRemoteCustomers();
      if (lastDate == currentDate) {
        return;
      }

      ApiService.methods.getCustomers(currentDate,CurrentUser.methods.getBearId())
      .then(this.callbackGetRemoteCustomerSuccess)
      .catch(this.callbackGetRemoteCustomerFail);
    },
    callbackGetRemoteCustomerSuccess(json) {
      json.records.forEach(remote => {
        var isExist = this.$store.state.customers.find(el => el.contactid == remote.abiz_contactid) != undefined;
        if (!isExist) {
          var customer = {
            id: Math.floor(Math.random() * 100) + 100,
            name: remote.fullname,
            sex: remote.gendercode.value == 1 ? "Nam" : "Nữ",
            phone: remote.mobilephone,
            address: remote.abiz_provinceid.text,
            contactId: remote.contactid
          }
          this.$store.dispatch('insertCustomer', customer);
        }
        
      });
      const currentDate= Helper.getCurrentDateStrForRequest();
      Remember.setLastDateGetRemoteCustomers(currentDate);
      this.isProcessing = false;
    },
    callbackGetRemoteCustomerFail(error) {
      console.log("GET_REMOTE_CUSTOMER_ERROR", error.message);
      this.isProcessing = false;
    },
    showDlg(dlgTitle, dlgMsg) {
      return alert({
        title: dlgTitle,
        okButtonText: stringConst.lbl_close,
        message: dlgMsg
      });
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