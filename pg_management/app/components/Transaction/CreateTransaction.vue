<template>
  <GridLayout rows="50,100,*" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
        <Label text="TẠO ĐƠN HÀNG MỚI" class="text-center"/>
    </FlexboxLayout>
    <Image id="btn_back" src="res://ic_left_arrow_white" @tap="closePage()" row="0" col="0" />

    <Label text="Khách Hàng" class="header" row="1" col="0" colSpan="2"  />
    <RadDataForm :source="customer" :metadata="customerMetadata" row="2" col="0" colSpan="2" />
  </GridLayout>
</template>
<script>
export default {
  data() {
    return {
      customerMetadata: {
        "isReadOnly": false,
        "commitMode": "Immediate",
        "validationMode": "Immediate",
        "propertyAnnotations":[
          {
            "name": "id",
            "displayName": "Mã Khách Hàng",
            "index": 0,
            "editor": "Number",
            'readOnly': true
          },
          {
            "name": "name",
            "displayName": "Họ Tên",
            "index": 1,
          },
          {
            "name": "sex",
            "displayName": "Giới Tính",
            "index": 2,
            "editor": "Picker",
            "valuesProvider": ["Nam", "Nữ"]
          },
          {
            "name": "phone",
            "displayName": "Số Điện THoại",
            "index": 3,
            "editor": "Number",
          },
           {
            "name": "address",
            "displayName": "Địa Chỉ",
            "index": 4,
            "editor": "Picker",
            "valuesProvider": ["Hồ Chí Minh", "Hà Nội", "Vũng Tàu", "Đồng Nai", "Biên Hoà", "Long An", "Cần Thơ", "Tây Ninh", "Bình Dương", "Tiền Giang", "An Giang", "Vĩnh Long", "Châu Đốc", "Đồng Tháp", "Phú Quốc", "Cà Mau", "Đà Lạt", "Nha Trang", "Đà Nẵng", "Bình Định", "Thanh Hoá", "Nơi khác"]
          },
        ]
      },
      customer:{
        id:200, 
        name:"Nguyen Văn A",
        sex:"Nam",
        phone:"",
        address:"Hồ Chí Minh"

      },
        products: ["aaa","bbb"
        ]
    };
  },
  methods: {
    closePage() {
      this.$modal.close();
    }
  }
};
</script>
<style scroped lang="scss">
.page-parent {
  justify-content: center;
  align-items: center;
}

.txt-value {
  text-align: left;
  vertical-align: middle;
}
#btn_back {
    width: 24;
    height: 24;
    position: relative;
    top: 0;
    left: 0;
}

.drobox {
    border-color: grey;
    border-width: 1;
    text-align: center;
    align-content: center;

}
</style>