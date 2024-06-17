<template>
    <van-dialog class="notic_cover" :before-close="colseNotic" v-model="visible" :showConfirmButton='true' confirm-button-text="关闭" :title="title" style="width:85%;">
        <!-- <van-icon class="close_btn" name="cross" @click="colseNotic" /> -->
        <div class="notic_content">{{content}}</div>
    </van-dialog>
</template>
<style lang="scss">
    .notic_cover{
        .van-dialog__header{
            padding-top: 15px !important;
        }
        .van-dialog__footer{
            width: 100%;
        }
    }
</style>
<style lang="scss" scoped>
.notic_cover{
    width: 100%;
    float: left;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: row;
    .close_btn{
        font-size: 38px;
        position: absolute;
        top: 31px;
        right: 31px;
    }
    .notic_content{
        width: 100%;
        float: left;
        // max-height: 280px;
        font-size: 28px;
        padding: 0 30px 10px 30px;
        text-align: justify;
        box-sizing: border-box;
        padding-bottom: 20px;
    }
}
</style>
<script>
export default {
    props: {
        title: {
            type: String,
            default: "" //默认高度
        },
        type:{
            type: String,
            default: "" 
        },
        content: {
            type: String,
            default: "" 
        }
    },
    data() {
        return {
            qqCode:"",
            wechatCode:"",
            visible:false,
            adverImg:[]
        };
    },
    mounted() {
    },
    methods: {
        colseNotic(action, done) {
            if (action === "confirm") {
                document.getElementById("app").removeChild(this.$el);
                sessionStorage.setItem('niticState',2);
                done()
            }
        }
    },
    watch:{
       visible(val){
           if(val == true){
                this.$nextTick(() => {
                    if(this.$refs.contactModel !=undefined){
                        this.$refs.contactModel.style.height = this.$refs.pilotModel.offsetHeight+84+"px"
                    }
                });
           }
       } 
    }
};
</script>