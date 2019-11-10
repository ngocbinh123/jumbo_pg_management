<template>
  <GridLayout class="page-parent" rows="50,*" columns="30,*">
    <Image id="btn_back" src="res://ic_left_arrow_white" @tap="closePage()" row="0" col="0"/>
    <Label text="THÔNG TIN CHẤM CÔNG" class="title-white text-center"  row="0" col="0" colSpan="2"/>
    <FlexboxLayout row="0" col="0" rowSpan="2" colSpan="2">
      <GridLayout class="page-content" rows="auto,auto,auto,auto,40,50" columns="50, *" >
        <Image src="res://ic_id_card_primary" class="icon" row="0" col="0" />
        <Label class="lbl-value" :text="userId" row="0" col="1"/>
        
        <Image src="res://ic_person_primary" class="icon" row="1" col="0" />
        <Label class="lbl-value" :text="userName" row="1" col="1"/>

        <Image src="res://ic_alarm_primary" class="icon" row="2" col="0" />
        <Label :text="checkInTime" class="lbl-value text-bold" row="2" col="1"/>

        <Image src="res://ic_place_primary" class="icon" row="3" col="0" />
        <Label :text="checkInItem.store" class="lbl-value" row="3" col="1" />
        <Button
          id="btn_submit"
          class="btn-primary"
          text="Gửi"
          @tap="submitData()"
          row="5"
          col="0"
          colSpan="2"
        />
      </GridLayout>
    </FlexboxLayout>
  </GridLayout>
</template>

<script>
import Constant from "../../data/Constant";
import CurrentUser from "../../data/CurrentUser";

export default {
  created() {
    const now = new Date();
    var hour = now.getHours();
    if(hour < 10) {
      hour = "0" + hour;
    }
  
    var min = now.getMinutes();
    if(min < 10) {
      min =  "0" + min;
    }
    this.checkInTime = hour + ":" + min;
  },
  props: ["checkInItem"],
  data() {
    return {
      userId: CurrentUser.methods.getUserId(),
      userName: CurrentUser.methods.getUserName(),
      checkInTime: "",
      store: this.$props.checkInItem.store
    };
  },
  methods: {
    closePage(){
      this.$modal.close({
        isSuccess: false,
        item: this.$props.checkInItem
      });
    },
    submitData() {
      this.$props.checkInItem.state = Constant.CHECK_IN_STATE.CHECKED;
      this.$modal.close({
        isSuccess: true,
        item: this.$props.checkInItem
      });
    }
  }
};
</script>


<style scoped lang="scss">
@import "../../app-variables.scss";

.page-parent {
  justify-content: center;
  align-items: center;
  background-image: linear-gradient($color-primary-dark, $color-primary);
}

FlexboxLayout {
  justify-content: center;
  align-items: center;
}

.page-content {
  width: 90%;
  padding: 12 16;
  background-color: $color-bg-white;
  border-radius: 10%;
}

.lbl-value {
  vertical-align: middle;
  font-size: 18;
  text-align: left;
}

.title-white {
  color: white;
  vertical-align: middle;
  font-family: "f_arima_madurai_bold";
  font-size: 24;
}

#btn_submit {
  margin-left: 5%;
  margin-right: 5%;
  font-family: "f_arima_madurai_extra_bold";
}

#btn_back {
  margin-left: 6%;
  width: 6%;
}
</style>
