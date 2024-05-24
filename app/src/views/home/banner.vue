<template>
    <!-- <img src="../../assets/images/home/banner.png" alt="banner" /> -->
    <div class="banner">
        <van-swipe class="my-swipe" :autoplay="5000">
            <!-- <van-swipe-item v-for="(item,index) in list" :key="index" @click="bannerJump(item)"> -->
            <van-swipe-item v-for="(item,index) in list" :key="index" @click="$Helper.toOutLink(item.open_url)">
                <img :src="item.url" alt="banner" />
            </van-swipe-item>
        </van-swipe>
    </div>
    <!-- <div class="swiper-container" :key="timestamp">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item,index) in list" :key="index">
                <img :src="item.url" :data-jump="bannerJump(item)" alt="banner" />
            </div>
        </div>
        <div class="swiper-pagination"></div>
    </div>-->
</template>
<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            mySwiper: null,
            timestamp: new Date().getTime()
        };
    },
    created(){
        console.log('banner list', this.list)
    },
    methods: {
        jumpUrl(val){
            if(val.open_url.indexOf("http://") > -1 || val.open_url.indexOf("https://") > -1){
                window.location.href = val.open_url;
            }
        },
        bannerJump(item) {
            let url = item.open_url;
            if (url) {
                url = item.open_url.includes("http://") || item.open_url.includes("https://") ? item.open_url : "http://" + item.open_url;
                window.open(url, "_blank")
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.banner{
    // padding: 29px 20px 30px 20px;
    box-sizing: border-box;
    background-color: #fff;
    margin: 0 24px;
}
.my-swipe {
    width: 100%;
    // height: 2.82rem;
    border-radius: 0.1rem;
}
::v-deep .van-swipe-item {
    text-align: center;
}
img {
    width: 100%;
    // height: 2.82rem;
    border-radius: 0.1rem;
}
::v-deep{
    .van-swipe__indicators{
        bottom: 0.3rem!important;
    }
    .van-swipe__track, .van-swipe-item{
        width: 100% !important;
    }
}
// .swiper-container {
//     margin-top: 20px;
//     width: 750px;
//     height: 320px;
//     margin-bottom: 10px;
//     overflow: visible !important;
// }
// .swiper-container .swiper-wrapper .swiper-slide {
//     width: 640px;
//     border-radius: 20px;
// }
// .swiper-container .swiper-wrapper .swiper-slide img {
//     width: 100%;
//     height: 320px;
//     border-radius: 20px;
// }
// .swiper-container .swiper-wrapper .swiper-slide-prev {
//     margin-top: 18px;
//     height: 284px !important;
// }
// .swiper-container .swiper-wrapper .swiper-slide-prev img {
//     height: 284px !important;
// }
// .swiper-container .swiper-wrapper .swiper-slide-next {
//     margin-top: 18px;
//     height: 284px !important;
// }
// .swiper-container .swiper-wrapper .swiper-slide-next img {
//     height: 284px !important;
// }
// .swiper-container .swiper-wrapper .swiper-slide-active {
//     width: 640px;
// }

// .swiper-pagination {
//     bottom: -30px !important;
// }
// .swiper-pagination .swiper-pagination-bullet {
//     width: 12px;
//     height: 12px;
//     background: #ff1e1e;
// }
// .swiper-pagination .swiper-pagination-bullet-active {
//     width: 21px;
//     height: 12px;
//     background: #e75230;
//     border-radius: 6px;
// }
// ::v-deep .swiper-pagination-bullet {
//     width: 0.16rem;
//     height: 0.16rem;
//     border-radius: 0.08rem;
//     box-sizing: border-box;
// }
// ::v-deep .swiper-pagination {
//     bottom: 0rem !important;
// }
// ::v-deep.swiper-pagination-bullet-active {
//     outline: none !important;
// }
</style>
