<template>
  <GridLayout rows="50,20, auto,auto, 20, auto, auto, 20, auto, auto, 20, auto, auto, *, 70" columns="50,*" class="page-parent">
    <FlexboxLayout class="tool-bar" row="0" col="0" colSpan="2" width="100%">
      <Label :text="$props.title" class="text-center" />
    </FlexboxLayout>
    <Label :text="'fa-chevron-left' | fonticon" class="fas btn-back"  @tap="closePage()" row="0" col="0" />

    <Label text="Tỉnh/ Thành Phố" class="text-label" row="2" col="0"  colSpan="2" />

    <GridLayout orientation="horizontal" class="dropbox" row="3" col="0" colSpan="2" rows="*" columns="6, *, 30" @tap="showProvinces()">
        <Label :text="selectedProvince.name" class="text-value" row="0" col="1" />
        <Label :text="'fa-sort' | fonticon" class="fas icon-sort" row="0" col="2" />
    </GridLayout>

    <Label text="Quận/ Huyện" class="text-label" row="5" col="0"  colSpan="2" />
    <GridLayout orientation="horizontal" class="dropbox" row="6" col="0" colSpan="2" rows="*" columns="6, *, 30"  @tap="showDisctricts()">
        <Label :text="selectedDistrict.name" class="text-value"  row="0" col="1" />
        <Label :text="'fa-sort' | fonticon" class="fas icon-sort" row="0" col="2"/>
    </GridLayout>

    <Label text="Phường" class="text-label" row="8" col="0"  colSpan="2" />
    <TextView v-model="selectedWard" 
        hint="Nhập phường"
        class="edt-box" row="9" col="0"  colSpan="2" maxLength="50" autocapitalizationType="words" returnKeyType="next" ke/>
    
    <Label text="Số Nhà Và Tên Đường" class="text-label" row="11" col="0"  colSpan="2" />
    <TextView v-model="selectedStreet" 
        hint="Nhập địa chỉ nhà và tên đường"
        class="edt-box" row="12" col="0"  colSpan="2" maxLength="50" autocapitalizationType="words" returnKeyType="done" />

    <Button
      text="HOÀN THÀNH"
      class="btn btn-fill-bg"
      @tap="submiData()"
      row="14"
      col="0"
      colSpan="2"
    />
  </GridLayout>
</template>
<script>
import ProvincesDlg from './ProvincesDlg';
import DisctrictsDlg from './DisctrictsDlg';
import StringConst from '../../assets/StringConst';
import Constant from "../../data/Constant";

export default {
    created() {
        this.$store.dispatch('getAllProvinces');
    },
    props: ["title"],
    data() {
        return {
            selectedProvince: {
                id:"",
                name: " "
            },
            selectedDistrict: {
                id:"",
                name: " "
            },
            selectedWard: "",
            selectedStreet: ""
        }
    }, 
    methods: {
        showProvinces() {
            this.$showModal(ProvincesDlg, {
                fullscreen: true, 
                animated: true
               
            }).then(this.callBackShowProvinces);
        },
        callBackShowProvinces(result) {
            if (result == undefined) {
                return;
            }
            this.selectedProvince = result.selected;
            this.selectedDistrict = {
                id: "",
                name: ""
            };
        },
        showDisctricts() {
            if (!this.selectedProvince.id) {
                this.showDlg(StringConst.lbl_notification, StringConst.msg_should_choose_province_before);
                return;
            }
            this.$showModal(DisctrictsDlg, {
                fullscreen: true, 
                animated: true,
                props: {
                    title: "QUẬN/ HUYỆN CỦA " + this.selectedProvince.name.toUpperCase(),
                    province: this.selectedProvince
                }
            }).then(this.callBackShowDistrict);
        },
        callBackShowDistrict(result) {
            if (result == undefined) {
                return;
            }
            this.selectedDistrict = result.selected;
        },
        closePage() {
          this.$modal.close();
        },
        submiData() {
            if (!this.selectedProvince.id || !this.selectedDistrict.id || !this.selectedWard || !this.selectedStreet) {
                this.showDlg(StringConst.lbl_notification, StringConst.msg_should_fill_address);
                return;
            }

            const street = this.selectedStreet.trim();
            const ward = this.selectedWard.trim();

            this.$modal.close({
                selectedProvince: this.selectedProvince,
                selectedDistrict: this.selectedDistrict,
                selectedWard: ward,
                selectedStreet: street, 
                addressStr: street + ", " + ward + ", " + this.selectedDistrict.name + ", " + this.selectedProvince.name
            });
        },
        showDlg(dlgTitle, dlgMsg) {
            return alert({
                title: dlgTitle,
                okButtonText: StringConst.lbl_close,
                message: dlgMsg
            });
        }
    }
}
</script>

<style scoped lang="scss">
    .text-label {
        text-align: left;
        font-family: "f_arima_madurai_thin", "Arima Madurai";
        margin-left: 12;
    }

    .text-value {
        text-align: left;
        margin-left: 0;
        padding: 8 4 8 0;
    }


</style>