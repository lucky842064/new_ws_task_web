<template>
  <div class="loadingPancel" :class="[mask?'mask':'',fixed?'fixed':'']" :style="{width:w,height:h}">
    <van-loading />
  </div>
</template>
<script>
export default {
  props: {
    w: {
      type: String,
      default: () => "100%"
    },
    h: {
      type: String,
      default: () => "100%"
    },
    mask: {
      default: () => false
    },
    fixed: {
      default: () => false
    }
  }
};
</script>
<style lang="scss" scoped>
.loadingPancel {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mask {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.5);
}
.fixed {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.5);
}
</style>