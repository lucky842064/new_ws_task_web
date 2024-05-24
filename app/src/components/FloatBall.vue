<template>
   <div class="float" v-clickoutside="closeOnclick">
      <div ref="dragIcon"
           class="dragIcon"
           @touchstart.stop="handleTouchStart"
           @touchmove.prevent.stop="handleTouchMove($event)"
           @touchend.stop="handleTouchEnd"
           :style="{left: left + 'px',top: top + 'px',width: itemWidth + 'px',height: itemHeight + 'px'}"
           @click="show_panel"
           :class="isShow && 'show'">
      </div>
      <div class="float-box" :class="!isShow && 'show'">
         <div class="float-content">
            <div class="icon-box" @click="clearCache">
               <span class="icon clear-cache"></span>
               <div class="text">清除缓存</div>
            </div>
            <div class="icon-box" @click="refresh">
               <span class="icon refresh"></span>
               <div class="text">刷新</div>
            </div>
            <div class="icon-box">
               <span class="icon back"></span>
               <div class="text">退出</div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
    import {clickoutside} from "../common/clickOutside";
    export default {
        directives:{clickoutside},
        data(){
            return{
                itemWidth:44,
                itemHeight:44,
                left: 0,
                top: 0,
                startToMove: false,
                isShow: true,
                timer: null,
                currentTop: null,
                clientW: document.documentElement.clientWidth,//视口宽
                clientH: document.documentElement.clientHeight,//视口高
            }
        },
        created () {
            this.left = (this.clientW - this.itemWidth - 15)
            this.top = ((this.clientH/2+80) - this.itemHeight/2)
        },
        mounted() {

        },
        beforeDestroy() {
        },
        methods: {
            clearCache(){
               plus.storage.clear();
               this.$toast('清除成功')
            },
            refresh(){
               this.$router.go(0)
            },
            quit(){
               plus.runtime.quit();
            },
            show_panel(){
              this.isShow = false;
            },
            closeOnclick() {
                this.isShow = true;
            },
            handleTouchStart() {
                this.startToMove = true
                this.$refs.dragIcon.style.transition = "none"
            },
            handleTouchMove(e) {
                const clientX = e.targetTouches[0].clientX;//手指相对视口的x
                const clientY = e.targetTouches[0].clientY;//手指相对视口的y
                const isInScreen = clientX <= this.clientW && clientX >= 0 && clientY <= this.clientH && clientY >=0
                if(this.startToMove && e.targetTouches.length === 1) {
                    if(isInScreen) {
                        this.left = clientX - this.itemWidth/2
                        this.top = clientY - this.itemHeight/2
                    }
                }
            },
            handleTouchEnd() {
                if(this.left < (this.clientW / 2)) {
                    this.left = 15;
                    this.handleIconY()
                } else {
                    this.left = this.clientW - this.itemWidth - 15;//不让贴边 所以减15
                    this.handleIconY()
                }
                this.$refs.dragIcon.style.transition = "all .3s"
            },
            handleIconY() {
                if (this.top < 0) {
                    this.top = 15;
                } else if(this.top + this.itemHeight > this.clientH) {
                    this.top = this.clientH - this.itemHeight - 15;//不让帖下边所以减15
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
   .dragIcon {
      position: fixed;
      background-image: url("../assets/images/common/aids.png");
      width: 0.88rem;
      height: 0.88rem;
      background-size: 100% 100%;
      z-index: 99;
      display: none;
      &.show{
         display: block;
      }
   }
   .float-box {
      position: fixed;
      margin:auto;
      left:0;
      right:0;
      width: 440px;
      height: 180px;
      bottom:18vh;
      background: #1B1A1D;
      border-radius: 16px;
      padding-top: 30px;
      transition: width 500ms ease;
      transform: scale(0);
      z-index: 11;
      &.show {
         transform: scale(1);
      }
      .float-content {
         display: flex;
         align-items: center;
         justify-content: space-between;
         text-align: center;
         .icon-box {
            padding: 0 31px;
            line-height: 60px;
            .icon {
               display: inline-block;
               height: 0.48rem;
               width: 0.48rem;
               background-size: 100% 100%;
               &.clear-cache {
                  background-image: url('../assets/images/common/clear-cache.png');
               }
               &.refresh {
                  background-image: url('../assets/images/common/refresh.png');
               }
               &.back {
                  background-image: url('../assets/images/common/back.png');
               }
            }
            .text {
               font-size: 30px;
               color: #FFFFFF;
            }
         }
      }
   }
</style>
