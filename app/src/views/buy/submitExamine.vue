<template>
    <div class="task_content">
        <page-header :title="title" :show-icon="true"></page-header>
        <div class="task_content">
            <div class="head_warp">
                <div class="order_time">
                    <van-count-down use-slot :time="time" @change="onChange">
                        <img src = "../../assets/images/buy/invite_icon.png" alt="">
                        剩余 <span class="item">{{ timeData.hours }}</span> 时
                        <span class="item">{{ timeData.minutes }}</span> 分
                        <span class="item">{{ timeData.seconds }}</span> 秒
                    </van-count-down>
                </div>
                <div class="group_code">
                    <div class="Qr_code"  v-if="code_url==''">
                        <img :src="qrImg" alt="" @click="showPreview">
                        <span>点击放大保存到手机</span>
                    </div>
                    <div class="vue_qr" v-if="code_url!=''" @click="showPreview1">
                        <vue-qr  :text="code_url" colorDark="#000" colorLight="#fff"  :logoScale="0.2" :size="200"></vue-qr>
                        <span>点击放大保存</span>
                    </div>
                    <div class="group_task">
                        <div class="">加粉结束后，你的推广微信请尽快退出推广群，避免占用群好友位</div>
                        <div class="">开始时间：{{sTime}}</div>
                        <div class="">结束时间：{{eTime}}</div>
                    </div>
                </div>
            </div>
            <div class="history_recors_warp">
                <div class="history_content">
                    <ul class="history_recors_title">
                        <li>序号</li>
                        <!-- <li>任务类型</li> -->
                        <li>手机号码</li>
                        <li>微信昵称</li>
                        <li>分组标签</li>
                    </ul>
                    <div class="history_recors">
                        <ul class="history_list" v-for="(iten,index) in taskInfo" :key="index">
                            <li>{{index+1}}</li>
                            <li>{{iten.phone_no}}</li>
                            <li>
                                <template v-if="iten.nick_name == ''">...</template>
                                <template v-else>{{iten.nick_name}}</template>
                            </li>
                            <li>
                               <template v-if="iten.tag_name == ''">...</template>
                               <template v-else>{{iten.tag_name}}</template>
                            </li>
                            <!-- <li>
                                <span v-if="iten.status == 1" class="wechat_color">未加群</span>
                                <span v-else style="color:#2872eb;">已加群</span>
                            </li> -->
                        </ul>
                    </div>
                </div>
            </div>
            <van-button class="order_submit_btn" @click="submitBtn">提交审核</van-button>
            <div class="rulse_text">
                <van-cell :border="false"  title="规则说明"/>
                <van-cell :border="false" style="color:red" title="1、先扫码进群，把添加的好友拉进微信群，再提交审核"/>
                <van-cell :border="false" title="2、每日微信群发任务，只能提交一次验群审核,针对恶意提交审核的用户将进行惩罚"/>
                <van-cell :border="false" title="3、结算任务奖励=实际进群资源*任务单价"/>
                <van-cell :border="false" title="4、任务时间内未提交审核，该审核申请取消,申请后,恶意卡单不完成的用户将予以惩罚"/>
            </div>
        </div>
        <van-dialog v-model="qrcodeImg.show" @confirm="qrcodeImg.show=false" confirm-button-text="关闭" style="text-align:center">
            <!-- <img :src="userHeadList[checkIndex]" class="check_image" /> -->
            <h4 style="margin-top:10px;color:#f56c6c;font-size:18px;">请截图保存到相册</h4>
            <vue-qr :text="qrcodeImg.code_url" colorDark="#000" colorLight="#fff" :size='400'></vue-qr>
        </van-dialog> 
         <popDialog ref="isDialog" :title = "titleTips" :titleContent = "dialogContent" :isCancel = true :isConfirm = true @confirm_btn = "confirm_btn"></popDialog>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
import popDialog from "@/components/popDialog";
import { reqgrouptask,commitgrouptask } from "@/api/task";
import { formatTime } from "@/utils/tool";
import vueQr from 'vue-qr'

export default {
    name: "buy",
    components: { PageHeader,popDialog,vueQr},
    data() {
        return {
            titleTips:"提示",
            dialogContent:"请确定是否已完成微信加粉，如未加粉提交审核将会导致验粉作废!",
            showMask:false,
            page:1,
            limit:999,
            task_id:"",
            qrImg:"",
            code_url:'',
            sTime:"",
            eTime:"",
            time: 0,
            timer:"",
            setinTime:0,
            timeData: {},
            taskInfo:[],
            qrcodeImg:{
                show:false,
                url:'',
                code_url:'',
            }
        };
    },
    created() {
        this.title = this.$route.meta.title;
        this.task_id = this.$route.query.task_id;
        this.initTaskInfo();
    },
    methods: {
        // 初始化任务列表
        initTaskInfo(){
            let params = {
                task_order:Number(this.task_id),
                page:this.page,
                limit:this.limit
            }
            reqgrouptask(params).then(res => {
                this.qrImg = res.group_url;
                this.sTime = formatTime(res.stime);
                this.eTime = formatTime(res.etime);
                this.code_url = res.code_url;
                this.setinTime = res.last_time;
                this.time = res.last_time*1000;
                this.taskInfo = res.list;
                this.showPreview1();
                // this.timer = setInterval(() =>{
                //     this.setinTime --;
                //     if(this.setinTime <= 1){
                //         this.$refs.isDialog.showDialog()
                //         clearTimeout(this.timer)
                //     }
                // },1000)
            });
        },
        showPreview(){
            this.showMask = true;
        },
        showPreview1(){
            this.qrcodeImg.code_url = this.code_url;
            this.qrcodeImg.show = true;
        },
        onChange(e) {
            this.timeData = e;
        },
        downloadImg: function(url) {
            plus.gallery.save(url, function () {
                plus.nativeUI.alert("保存图片成功");
            },function(){
                plus.nativeUI.alert("保存失败");
            });
        },
        // 提交订单
        submitBtn(){
            this.$refs.isDialog.showDialog();
        },
        // 订单失效
        confirm_btn(){
            let params = {
                task_id:Number(this.task_id)
            }
            commitgrouptask(params).then(res => {
                this.$refs.isDialog.dialogModel = false;
                this.$toast("订单已完成！");
                setTimeout( () =>{
                    this.$router.push({path:'/home'});
                },1000)
            });
        }
    },
    beforeDestroy() {
        if(this.timer) {
    　		clearInterval(this.timer);
        }
    }
};
</script>
<style lang="scss" scoped>
.task_content{
    width: 100%;
    float: left;
    overflow-y: auto;
    padding-bottom: 20px;
}
.mask_bg{
    img{
        max-width: initial;
        width: 450px;
    }
}
.head_warp{
    width: 100%;
    height: 360px;
    float: left;
    margin-bottom: 140px;
    // background: linear-gradient(to bottom, #ff614b 0%,#ff8d70 100%);
    background: url("../../assets/images/buy/exam_bg.png");
    background-size: 100% 100%;
    background-repeat:no-repeat;
        .order_time{
            display: table;
            margin: 0 auto;
            margin-top: 48px;
            .van-count-down{
                color: #fff;
                font-size: 0.28rem;
                img{
                    float: left;
                    width: 18px;
                    height: 20px;
                    margin-right: 12px;
                    // margin-top: 5px;
                }
                .item{
                    color: #0084ff;
                    font-size: 0.28rem;
                    background-color: #fff;
                }
            }
        }
        .group_code{
            width: 690px;
            padding: 34px 21px 34px 30px;
            box-sizing: border-box;
            display: table;
            margin: 0 auto;
            margin-top: 42px;
            border-radius: 8px;
            background-color: #fff;
            box-shadow: 0 8px 5px -3px #ececec;
            .Qr_code{
                width: 220px;
                float: left;
                img{
                    width: 100%;
                    height: 220px;
                }
                span{
                    width: 100%;
                    float: left;
                    font-size: 24px;
                    color: #989898;
                    text-align: center;
                }
            }
            .vue_qr{
                width:160px;
                float: left;
                span{
                    width: 100%;
                    float: left;
                    font-size: 24px;
                    color: #989898;
                    text-align: center;
                }  
            }
            .group_task{
                width: 410px;
                float: right;
                // background-color: goldenrod;
                font-size: 24px;
                    div{
                        border-bottom: 1px solid #cdcdcd;
                    }
                    div:nth-child(1){
                        height: 75px;
                        color: #f4280f;
                    }
                    div:nth-child(2), div:nth-child(3){
                        height: 60px;
                        line-height: 60px;
                        color: #010101;
                    }
            }
        }
}
.history_recors_warp{
    width: 100%;
    display: table;
    margin: 0 auto;
    padding: 0 30px;
    box-sizing: border-box;
}
.history_content{
    width: 100%;
    float: left;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid #d1d1d1;
    border-bottom: 1px solid transparent;
    .history_recors_title, .history_list{
        width: 100%;
        float: left;
        li{
            width: 25%;
            float: left;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 24px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            border-bottom: 1px solid #d1d1d1;
            border-left: 1px solid #d1d1d1;
            // .wechat_color{
            //    color:#08a01a;
            // }
            // .short_color{
            //    color:#2b73eb;
            // }
            // .friend_color{
            //    color:#793aeb;
            // }
        }
        li:nth-child(1){
            width: 10%;
            border-left: 1px solid transparent;
        }
        li:nth-child(3){
            padding: 0 10px;
            width: 35%;
        }
        li:nth-child(4){
            padding: 0 10px;
            width: 30%;
        }
    }
    .history_recors_title{
        background-color: #f2f2f2 ;
    }
    .history_list{
        li{
            height: 70px;
            line-height: 70px;
        }
    }
}
.rulse_text{
    width: 100%;
    float: left;
}
.order_submit_btn{
    color:#ffffff;
    margin-top: 20px;
    font-size: 0.32rem;
    border-radius: 8px;
    border-color: #ff6529;
    background-color: #ff6529;
}
</style>
