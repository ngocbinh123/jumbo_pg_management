<template>
  <GridLayout rows="50,20, *,30, 70" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
      <Label :text="$props.title" class="text-center" />
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <TimePicker v-model="selectedTime" row="2" col="0" colSpan="2" />
    <Button
      id="btn_complete"
      text="XONG"
      class="btn btn-fill-bg"
      @tap="submiData()"
      row="4"
      col="0"
      colSpan="2"
    />
  </GridLayout>
</template>
<script>
export default {
    props: ["title","selectedTime"],
    created() {
        if (!!this.$props.selectedTime) {
            this.selectedTime = this.$props.selectedTime;          
        }
    },
    data() {
        return {
            selectedTime: "12:00"
        };
    },
    methods: {
        closePage() {
          this.$modal.close();
        },
        submiData() {
            var time = this.selectedTime.getHours() + ":";
            const min = this.selectedTime.getMinutes();
            if (min > 9) {
                time+=min;
            }else {
                time+="0"+min;
            }
            this.$modal.close({
                isSuccess: true,
                selectedTime: this.selectedTime,
                selectedTimeStr: time
            });
        }
    }
};
</script>
<style scroped lang="scss">
.page-parent {
  justify-content: center;
  align-items: center;
}
</style>