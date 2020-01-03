<template>
  <GridLayout rows="50, *" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
      <Label text="CHỌN GIỚI TÍNH" class="text-center" />
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <ListView row="1" col="0" colSpan="2" for="item in genders" class="ls-group" @itemTap="onSelectedGender">
        <v-template>
            <StackLayout class="ls-group-item">
                <Label :text="item" width="100%" />
            </StackLayout>
        </v-template>
    </ListView>    
  </GridLayout>
</template>

<script>
import Constant from "../../data/Constant";

export default {
    data() {
        return {
            genders: [Constant.GENDER.Male.text, Constant.GENDER.Female.text]
        }
    },
    methods: {
        closePage() {
            this.$modal.close();
        },
        onSelectedGender(event) {
            this.$modal.close({
                isSuccess: true, 
                selected: event.item
            });
        }
    }
}
</script>

<style lang="scss">
    .ls-group-item{
        font-family: "f_arima_madurai_medium";
        color: black;
        font-size: 16;
        padding: 8 12;
    }
</style>