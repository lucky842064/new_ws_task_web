<template>
    <div class="play_warp">
        <page-header style="position: fixed;top: 0;left: 0; z-index: 9;" title="视频播放" :show-icon="true"></page-header>
        <video v-if="videoUrl!=''"  :src="videoUrl" controls="controls" autoplay="autoplay"></video>
        <div class="player_list">
          <ul>
            <li v-for="(item,index) in videoList" :key="index" :class="item.video_url == videoUrl ? 'videoActive':''" @click="changePlay(item)">视频教学{{index+1}}-{{item.video_name}}</li>
          </ul>
        </div>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
export default {
    name: "buy",
    components: { PageHeader},
    data() {
        return {
          videoUrl:"",
          videoList:[]
        };
    },
    created(){
      if(sessionStorage.getItem("teachVideo") !=null){
        this.videoList = JSON.parse(sessionStorage.getItem("teachVideo"));
        // this.videoUrl = this.videoList[0].video_url;
      }
    },
    mounted(){
    },
    methods: {
      changePlay(val){
        this.videoUrl = val.video_url;
      }
    }
};
</script>
<style lang="scss" scoped>
.play_warp{
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #f2f2f2f2;
  margin-top: 90px;
  video{
    width: 100%;
    max-height: 80%;
  }
  .player_list{
    width: 100%;
    float: left;
    padding: 0 30px;
    background-color: #fff;
    box-sizing: border-box;
    ul li{
      width: 100%;
      float: left;
      font-size: 0.32rem;
      padding: 25px 0;
      border-bottom: 1px solid #e8e8e8;
    }
  }
}
</style>
<style>
  .vjs-big-play-button{
      position: absolute !important;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
  }
  .videoActive{
    color: #a6540c;
  }
  /* .video-js .vjs-big-play-button{
    width: 100px;
    height: 80px;
  } */
</style>
