<template>
  <Page actionBarHidden="true">
    <FlexboxLayout class="page">
      <GridLayout row="auto, auto, auto">
        <StackLayout>
          <Label text="CẬP NHẬT MẬT KHẨU" class="page_title_small" />
          <TextField
            id="txt_old_pass"
            v-model="user.oldPass"
            hint="Mật khẩu hiện tại"
            secure="true"
            autocorrect="false"
          />
          <TextField
            id="txt_new_pass"
            v-model="user.newPass"
            hint="Mật khẩu"
            secure="true"
            autocorrect="false"
          />
          <Button id="btn_submit" @tap="validateInput()" text="CẬP NHẬT" class="btn btn-primary" />
        </StackLayout>
        <ActivityIndicator v-show="processing" busy="true"></ActivityIndicator>
      </GridLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
import Home from "./App";

export default {
  data() {
    return {
      processing: false,
      user: {
        oldPass: "",
        newPass: ""
      }
    };
  },
  methods: {
    validateInput() {
      if (!this.user.oldPass || !this.user.newPass) {
        this.showDlg(
          "THÔNG BÁO",
          "Xin hãy nhập đầy đủ mật khẩu hiện tại và mật khẩu mới."
        );
        return;
      }

      if (this.user.newPass.length < 6) {
        this.showDlg(
          "THÔNG BÁO",
          "Mật khẩu mới phải ít nhất 6 ký tự."
        );
        return;
      }

      this.processing = true;
      this.submitData();
    },

    submitData() {
      this.processing = false;
      this.$navigateTo(Home, {
        clearHistory: true,
        animated: true,
        transition: {
          name: "fade",
          duration: 700
        }
      });
    },

    showDlg(dlgTitle, dlgMsg) {
      return alert({
        title: dlgTitle,
        okButtonText: "Đóng",
        message: dlgMsg
      });
    }
  }
};
</script>

<style scoped>
FlexboxLayout,
AbsoluteLayout {
  justify-content: center;
  align-items: center;
  background-size: cover;
  background: linear-gradient(#007882, #22aa8f);
}

StackLayout {
  width: 90%;
  padding: 12 16;
  background-color: #f0f0f0;
  border-radius: 10%;
}

#txt_old_pass,
#btn_submit {
  margin-bottom: 12;
}

#txt_new_pass {
  margin-bottom: 16;
}

TextField {
  border-width: 0.5;
  border-color: #22aa8f;
  border-radius: 8;
  padding: 12 16;
}

.page_title_small {
  margin-bottom: 32;
}
</style>
