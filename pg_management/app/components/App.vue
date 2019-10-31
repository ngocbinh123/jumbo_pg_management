<template>
  <Page>
    <ActionBar title="NT Group" android:flat="true" />
    <TabView
      android:tabBackgroundColor="#007882"
      android:tabTextColor="#006069"
      android:selectedTabTextColor="#ffffff"
      androidSelectedTabHighlightColor="#ffffff"
    >
      <TabViewItem title="Siêu Thị">
        <GridLayout columns="*" rows="*">
          <Label class="message" text="Danh sách siêu thị" col="0" row="0" />
        </GridLayout>
      </TabViewItem>
      <TabViewItem title="Sản Phẩm">
        <GridLayout columns="*" rows="*">
          <Label class="message" text="Danh sách sản phẩm" col="0" row="0" />
        </GridLayout>
      </TabViewItem>
      <TabViewItem title="Tài Khoản">
        <GridLayout columns="*" rows="*">
          <Label class="message" text="Thông tin tài khoản" col="0" row="0" />
        </GridLayout>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script >
export default {
  data() {
    return {
      msg: "Hello World!"
    };
  }
};
</script>

<style scoped>
ActionBar {
  background-color: #007882;
  color: #ffffff;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}
</style>
