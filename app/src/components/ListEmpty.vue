<template>
   <div class="empty" :class="type !== 'team' && 'lower'">
      <div class="icon">
         <van-image :src="require(`../assets/images/empty/${type}.png`)" alt="empty"></van-image>
      </div>
      <div class="reason">
         {{content}}
      </div>
      <div class="redirect" @click="$router.push('/home')" v-if="type === 'team'">
         <!-- <span>{{$t('home_032')}}</span> -->
         <span class="arrow"> ></span>
      </div>
   </div>
</template>
<script>
   export default {
       props:{
           type:String,
           content:String,
       }
   }
</script>
<style lang="scss">
   .empty {
      padding-top: 100px;
      &.lower {
         padding-top: 220px;
      }
      .icon {
         text-align: center;
         img {
            height: 176px;
            width: 350px;
         }
      }
      .reason {
         font-size: 28px;
         color: #999999;
         text-align: center;
      }
      .redirect {
         font-size: 30px;
         color: $color-theme;
         text-align: center;
      }
   }
</style>
