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
        <GridLayout rows="10, 40, *" columns="10, *, 50">
          <Label :text="date" class="page_title_small text-center" row="1" col="0"  colSpan="3"/>
          <Image src="res://ic_alarm_primary" row="1" col="0" class="icon" v-show="false"/>
          <TextField id="txt_search_transaction" 
            row="1" col="1"
            v-model="searchTransValue"
            v-show="false"
            hint="Tìm kiếm đơn hàng" class="txt-search"/>
          <Image src="res://ic_add_primary" row="1" col="2" class="icon"/>
          <ListView row="2" col="0" colSpan="3" rowSpan="2" for="item in transList">
            <v-template>
              <GridLayout flexDirection="row" rows="*,*,*" columns="10,100,*" class="ls-item-check-in">
                <Label :text="item.time" class="text-center time"  row="0" col="1"/>
                <Label :text="item.code" class="item-header" textWrap="true" row="0" col="2"/>

                <Label :text="item.date" class="text-center date" row="1" col="1"/>

                <StackLayout orientation="horizontal" class="parent-center" row="1" col="2">
                  <Image src="res://ic_place_primary" row="1" col="2" class="icon-small"/>
                  <Label :text="item.store" class="item-header-sub" textWrap="true" />
                </StackLayout>
                <StackLayout orientation="horizontal" class="parent-center" row="2" col="2">
                  <Image src="res://ic_person_primary" row="1" col="2" class="icon-small"/>
                  <Label :text="item.customer.name" class="item-header-sub" />                  
                </StackLayout>
              </GridLayout>
            </v-template>
          </ListView>
        </GridLayout>
      </TabViewItem>
      <TabViewItem title="KHÁCH HÀNG">
        <GridLayout rows="10, 40, *" columns="10, *, 50">
          <Label :text="date" class="page_title_small text-center" row="1" col="0"  colSpan="3"/>
          <Image src="res://ic_alarm_primary" row="1" col="0" class="icon" v-show="false"/>
          <TextField id="txt_search_transaction" 
            row="1" col="1"
            v-model="searchTransValue"
            v-show="false"
            hint="Tìm kiếm đơn hàng" class="txt-search"/>
          <Image src="res://ic_add_primary" row="1" col="2" class="icon"/>
          <ListView row="2" col="0" colSpan="3" rowSpan="2" for="customer in customers">
            <v-template>
              <GridLayout flexDirection="row" rows="*,*,*" columns="10,50,*" class="ls-item-check-in">
                <Label :text="customer.id" class="text-center time"  row="0" col="1"/>
                <Label :text="customer.name" class="item-header" textWrap="true" row="0" col="2"/>
                <StackLayout orientation="horizontal" class="parent-center" row="1" col="2">
                  <Image src="res://ic_phone_primary" row="1" col="2" class="icon-small"/>
                  <Label :text="customer.phone" class="item-header-sub" textWrap="true" />
                </StackLayout>
                <StackLayout orientation="horizontal" class="parent-center" row="2" col="2">
                  <Image src="res://ic_place_primary" row="1" col="2" class="icon-small"/>
                  <Label :text="customer.address" class="item-header-sub" />                  
                </StackLayout>
              </GridLayout>
            </v-template>
          </ListView>
        </GridLayout>
      </TabViewItem>
    </TabView>
  </GridLayout>
</template>
<script>
import CheckIn from "../CheckIn/CheckIn";
import Transition from "../../share/Transition";
import CurrentUser from "../../data/CurrentUser";
import StringConst from "../../assets/StringConst";

export default {
  created() {
    
    var customer1 = {
      id: 10*10,
      name: "Nguyễn Văn Tân",
      sex: "Nam",
      phone: "0921111222",
      address:"Hồ Chí Minh"
    };
    this.customers.push(customer1);

    var customer2 = {
      id: 11*10,
      name: "Trần Ngọc Dung",
      sex: "Nữ",
      phone: "0931434343",
      address:"Hồ Chí Minh"
    };
    this.customers.push(customer2);

    var customer3 = {
      id: 12*10,
      name: "Lê Tuấn Thanh",
       sex: "Nam",
      phone: "0931232654",
      address:"Hồ Chí Minh"
    };
    this.customers.push(customer3);

    var customer4 = {
      id: 13*10,
      name: "Hà Nguyễn Minh Tuấn",
       sex: "Nam",
      phone: "09315566654",
      address:"Hồ Chí Minh"
    };
    this.customers.push(customer4);

    var customer5 = {
      id: 14*10,
      name: "Phạm Thị Loan",
      sex: "Nữ",
      phone: "0931191169",
      address:"Hồ Chí Minh"
    };
    this.customers.push(customer5);

    var customer6 = {
      id: 15*10,
      name: "Đỗ Văn Công",
      sex: "Nam",
      phone: "09222876123",
      address:"Hồ Chí Minh"
    };
    this.customers.push(customer6);

    var customer7 = {
      id: 16*10,
      name: "Lê Thị Tú",
      sex: "Nữ",
      phone: "0931551124",
      address:"Hồ Chí Minh"
    };
    this.customers.push(customer7);

    var customer8 = {
      id: 17*10,
      name: "Huỳnh Anh Tuấn",
      sex: "Nam",
      phone: "09312411581",
      address:"Hồ Chí Minh"
    };
    this.customers.push(customer8);

    var customer9 = {
      id: 18*10,
      name: "Phạm Nguyễn Thanh Tâm",
      sex: "Nam",
      phone: "0931241179",
      address:"Hồ Chí Minh"
    };
    this.customers.push(customer9);

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
        model: "MOD-" + i,
        name: "Sản Phẩm " + i,
        time: time,
        date: "Hôm nay"
      }
      this.transList.push(item);
    }
    
    var currentDate = new Date();
    this.date = currentDate.getDate() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getFullYear();
  },
  data() {
    return {
      selectedIndex: 0,
      searchTransValue:"",
      date: "",
      customers:[],
      transList:[]
    };
  },
  methods: {
    selectedIndex(args) {

    }
  }
};
</script>

<style scoped lang="scss">
@import "../../app-variables.scss";

#trans_parent {
}

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
  margin-left: 4; 
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