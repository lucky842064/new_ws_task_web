<template>
    <div ref="wrap notic_template" class="wrap notice_temp" >
        <van-notice-bar left-icon = "volume-o" :scrollable = isScroll 
            :speed = speed :class="from == true ? 'notice_first' : 'notice_second'" color="#333" :text="content">
            <template v-slot:left-icon>
                <i class='laba'></i>
            </template>
        </van-notice-bar>
    </div>
</template>
<script>
export default {
    props: {
        content: {
            type: String,
            default: ""
        },
        speed: {
            type: Number,
            default: 100
        },
        from: {
            type: Boolean,
            default: false
        },
        isScroll: {
            type: Boolean,
            default: false
        }
    },
    mounted() {},
    data() {
        return {
            icon_url:"../assets/images/home/icon_laba.png"
        };
    },
    methods: {
    }
};
</script>
<style lang="scss" scoped>
.wrap {
    width: 100%;
    // float: left;
}
.notice_first, .notice_second{
    height: 80px;
    font-size: 28px;
    line-height: 80px;
    background-color: transparent;
}

::v-deep{
    .laba{
        background: url('../assets/images/zdq/laba@2x.png') center center no-repeat;
        display:inline-block;width: 28px;height: 34px;background-size: contain;margin-right:20px;
    }
}

</style>