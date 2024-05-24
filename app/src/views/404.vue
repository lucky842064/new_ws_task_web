<template>
  <div class="wrap">
    <div class="img-box">
      <img src="../assets/images/empty/404.png" alt="404" class="bg" />
    </div>
    <div class="title">
      抱歉!您遇到了404页面…
    </div>
    <div class="cause">
      <div class="left">可能原因:</div>
      <div class="right">
        <div>网络信号不好</div>
        <div>找不到请求页面</div>
        <div>输入的不正确</div>
      </div>
    </div>
    <div class="btn_wrap">
      <div class="btn" @click="back">回到首页</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    back() {
        this.$router.replace("/home")
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  .img-box {
    display: block;
    text-align: center;
    padding-top: 300px;
    img {
      display: inline-block;
      height: 500px;
      width: 420px;
    }
  }
  .title {
    text-align: center;
    font-size: 36px;
    color: #000000;
  }
  .cause {
    display: flex;
    width: 380px;
    margin: 0.2rem auto;
    align-items: flex-start;
    .left {
      padding-top: 2px;
      margin-right: 0.2rem;
      font-size: 30px;
      color: #999999;
    }
    .right {
      font-size: 30px;
      color: #666666;
      line-height: 54px;
      text-align: left;
    }
  }
  .btn_wrap {
    position: fixed;
    width: 100%;
    height: 500px;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  .btn {
    display: block;
    width: 428px;
    background:  $color-theme;
    box-shadow: 0px 0px 17px 4px rgba(51, 104, 255, 0.19);
    border-radius: 44px;
    font-size: 36px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    height: 88px;
    line-height: 88px;
    text-align: center;
  }
}
.bg {
  width: 100%;
  display: block;
  height: 100%;
}
</style>
