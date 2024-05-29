<template>
    <div class="home-content">
        <div class="ifrem_box">
            <iframe class="ifrem_src" :src="iframeSrc"></iframe>
        </div>
        <div class="user_info">
            <div class="mess-box">
                <img class="user_head" :src="require(`../../src/assets/images/head/${userInfo.head||0}.png`)" alt="" @click="$router.push('/myhead')">
                <!-- <img class="user_head" :src="$store.state.User.userHeadList[userInfo.head||0]" @click="$router.push('/myhead')" /> -->
                <!-- <img class="user_head" src="../assets/images/head/11.png" alt=""> -->
                <div class="info-data">
                    <p>{{userInfo.user_key}}</p>
                    <p>账户收益：<span>{{formatMoney(userInfo.point)||0}}</span>元</p>
                </div>
            </div>
            <div class="btn">
                <van-button @click="jumpDraw">提现</van-button>
            </div>
        </div>
        <div class="home_content">
            <!-- <NoticeBar :isScroll= true :list="noticeCont" :from="true" /> -->
            <div class="task-pro">
                <div class="task-item">
                    <div class="left-pro">
                        <p>{{ formatMoney(teamStemp.today_point || 0)}}</p>
                        <p>{{ $t("home_023") }}</p>
                    </div>
                    <div class="right-pro">
                        <p>{{ formatMoney(teamStemp.yesterday_point || 0) }}</p>
                        <p>{{ $t("home_024") }}</p>
                    </div>
                    <div class="show_detail" @click="jumpDetail">账单明细</div>
                </div>
                <!-- <div class="task-item">
                    <div class="left-pro">
                        <p>{{ userInfo.team_complete || 0}}</p>
                        <p>今日完成任务量(单)</p>
                    </div>
                    <div class="right-pro">
                        <p>{{ userInfo.yes_complete || 0 }}</p>
                        <p>昨日完成任务量(单)</p>
                    </div>
                </div> -->
            </div>
            <div class="task-income">
                <div class="task-item">
                    <div class="left-pro">
                        <p>今日完成任务量(单)</p>
                        <p>{{ teamStemp.team_complete || 0}}</p>
                    </div>
                    <div class="right-pro">
                         <p>昨日完成任务量(单)</p>
                        <p>{{ teamStemp.yes_complete || 0 }}</p>
                    </div>
                    <div class="show_detail" @click="$router.push('/finshTask')">查看详情></div>
                </div>
            </div>

            <div class="code-area">
                <div class="code-title">
                    <div class="line-left"></div>
                    <div class="wechat-icon">
                        <span>邀请好友</span>
                    </div>
                    <!-- <div class="task-logo" @click="jumpInvit">
                        已邀请 <span>{{teamStemp.team_num||0}}</span> 人，今日邀请 <span>{{teamStemp.day_add_member||0}}</span> 人 <span class="jump_detail">下线管理>></span>
                    </div> -->
                    <div class="task-logo">
                        已邀请 <span>{{teamStemp.team_num||0}}</span> 人，今日邀请 <span>{{teamStemp.day_add_member||0}}</span> 人
                    </div>
                </div>
            </div>
            <div class="share_box share_first share_top">
                <div class="share_link">
                    <p>邀请码：{{userInfo.user_code||'...'}}</p>
                </div>
                <div class="share_btn">
                    <van-button v-clipboard:copy="userInfo.user_code" v-clipboard:success="copySuccess">复制邀请码</van-button>
                </div>
            </div>
            <div class="share_box share_first">
                <div class="share_link">
                    <p>链接：{{userInfo.share_url+"?r="+userInfo.user_code||'...'}}</p>
                </div>
                <div class="share_btn">
                    <van-button v-clipboard:copy="userInfo.share_url+'?r='+userInfo.user_code" v-clipboard:success="copySuccess">复制链接</van-button>
                </div>
            </div>
            <div class="share_box share_last">
                <div class="share_link">
                    <p>下载兼职APP</p>
                </div>
            </div>
            <!-- <div class="poster-area">
                <div class="poster_img" ref="posterHtml">
                    <van-button type="danger" @click="downApp">下载i兼职APP</van-button>
                </div>
            </div> -->
            <van-button class="login_out" type="danger" @click="logoutHandle">退出登录</van-button>
        </div>

        <div class="serve" @click="isDialong=true">
            <img src="../assets/images/ms_serve.png" alt="" srcset="">
            <p>客服</p>
        </div>
        <popDialog :showModel="isDialong" @closeBtn="closeDialong"></popDialog>
    </div>
</template>
<script>
import { mapState } from "vuex";
import jumpUrl from "@/utils/helper"
import WebsiteSetting from "../mixin/websiteSetting";
// import NoticeBar from "./home/noticeBar";
import { fmoney,timeStamp,formatTime1 } from "../utils/tool";
import { spreadList } from "@/api/user";
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas';
import popDialog from "@/components/serveDialog";

export default {
    mixins: [WebsiteSetting],
    name: "mine",
    components: {
        popDialog
        // NoticeBar,
        // qrcode
    },
    data() {
        return {
            wk_name:'',
            iframeSrc:'',
            teamStemp:"",
            vitivetext:"88888888888",
            vipStatus: {
                status: true
            },
            isDialong: false,
            isAndroid: false,
            isIOS: false,
            active: 0,
            serveModel:false,
            myip:localStorage.getItem('myip'),
            mycityname:localStorage.getItem('mycityname'),
            level: 0,
            level_name: "",
            noticeCont: [],
            daily_num: 0,
            version:"",
            lang: "",
            msg: 0,
            newStatus:0,
            appTown: true,
            appAccount: {},
            extenData: {},
            posterContent: '', // 文案内容
            posterImgName: '宣传海报', // 最终生成的海报图片名称
            posterImg: require('../assets/images/home/bill-bg.png'),
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.User.userInfo
        })
    },
    created() {
        this.$store.dispatch('User/getUserInfo');
        this.initSpread();
    },
    mounted(){
        // this.$nextTick(()=>{
        //    setTimeout(()=>{
        //         this.createQrcode();
        //    },1000)
        // })
    },
    methods: {
        closeDialong(){
            this.isDialong=false;
        },
        //推广列表
        initSpread() {
            spreadList({}).then(res => {
                this.teamStemp = res;
            });
        },
        localStorageSetItem(key ,value){
            if (key == null || key == undefined){
                return 
            }
            if (value == null || value == undefined){
                return 
            }
            if (this.isIOS) {
                let params = {"method":"localStorageSetItem","key":key,"value":value}
                window.webkit.messageHandlers.jsCallNativeMethod.postMessage(params); 
            }else if(this.isAndroid){  
                JSInterface.localStorageSetItem(key,value)
            }
        },
        logoutHandle() {
            this.$dialog.confirm({
                title: this.$t("other_008"),
                message: this.$t("mine_055"),
                confirmButtonColor: "rgb(255,2,65)",
                confirmButtonText: this.$t("other_005"),
                cancelButtonText: this.$t("other_004")
            }).then(() => {
                this.$store.dispatch("User/logoutUser");
                var storage = window.localStorage;
                storage["isstorename"] =  "no";
                try{
                    if(this.isAndroid){
                        JSInterface.onLoginout();
                    }else if(this.isIOS){
                        let params = {"method":"onLoginout"};
                        window.webkit.messageHandlers.jsCallNativeMethod.postMessage(params);
                    }
                }catch(e){}
                this.$router.push("/login")
            });
        },
        clipboardSuccessHandler({ value, event }) {
            this.$toast(`${this.$t("home_031")}${this.$t("other_006")}`);
        },
        createQrcode(){
            let qrCode = this.userInfo.share_url+"?r="+this.userInfo.user_code;
            new QRCode(this.$refs.qrcodeImg, {
                text:qrCode,
                width: 85,
                height: 85,
                colorDark: "#333333", //二维码颜色
                colorLight: "#ffffff", //二维码背景色
                correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
            })
        },
        createPoster () {
            const _this = this
            html2canvas(_this.$refs.posterHtml, {
                useCORS: true,
                allowTaint: false,
                logging: false,
                letterRendering: true,
                onclone (doc) {
                    // console.log(doc);
                    // let e = doc.querySelector('#posterHtml')
                    // e.style.display = 'block'
                }
            }).then(canvas => {
                let canvasImg = canvas.toDataURL('image/png');
                _this.imgDown(canvasImg)
            })
        },
        imgDown (img) {     
            var alink = document.createElement("a");
                alink.download = this.userInfo.user_code+timeStamp()
                alink.href = img;
                document.body.appendChild(alink);
                alink.click();
                alink.remove();
        },
        creatQrBtn(){
            this.createPoster()
        },
        copySuccess(){
            this.$toast(`${this.$t("home_031")}${this.$t("other_006")}`);
        },
        // 格式化金额
        formatMoney(point) {
            return fmoney(point,2);
        },
        jumpDetail(){
            this.$router.push("/betrecord");
        },
        jumpInvit(){
            this.$router.push("/invitFriend");
        },
        jumpDraw(){
            this.$router.push("/withdraw");
        },
        downApp(){
            if(jumpUrl.judgeClient() == 'ios'){
                this.iframeSrc = `https://www.lucky365.me/code/${this.userInfo.user_code}?dt=${formatTime1()}`
                setTimeout(function () {
                    window.location.href = "https://www.lucky365.me/install.mobileprovision";
                },4000);
            // jumpUrl.toOutLink('https://ios.jianzhi9.com')
            }else{
            window.open('https://998html.oss-cn-hangzhou.aliyuncs.com/IJZ_1.0.apk', "_self")
            }
        }
    }
};
</script>
<style lang="scss" scoped>
    .home-content {
        height: 100%;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #f2f2f2;
        -webkit-overflow-scrolling: touch; 
        padding-bottom: 120px;
        .ifrem_box{
            height: 0;
            opacity: 0;
        }
        .serve{
            width: 108px;
            height: 108px;
            position: fixed;
            right: 0;
            z-index: 2;
            bottom: 185px;
            border-radius: 50%;
            background-color: #fff;
            // box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 50px;
            img{
                display: block;
                width: 40px;
                height: 50px;
                margin: 0 auto;
                margin-top: 14px;
            }
            p{
                width: 100%;
                float: left;
                font-weight: 600;
                text-align: center;
                font-size: 24px;
                color: $home-bind-button;
            }
        }
        .user_info{
            width: 100%;
            display: flex;
            padding: 20px 32px;
            box-sizing: border-box;
            background: #fff;
            border-bottom: 1px solid #d8d8d8;
            .mess-box{
                display: flex;
                flex-grow: 2;
                .user_head{
                    width: 104px;
                    height: 104px;
                    border-radius: 50%;
                    margin-right: 16px;
                }
                .info-data{
                    display: flex;
                    flex-wrap: wrap;
                    padding: 14px 0;
                    box-sizing: border-box;
                    align-items: center;
                    p{
                        width: 100%;
                        font-size: 32px;
                        color: #000000;
                    }
                    p:nth-child(1){
                        font-weight: 600;
                    }
                    p:nth-child(2){
                        color: #999999;
                        font-size: 28px;
                        span{
                            color:#F52C2C;
                        }
                    }
                }
            }
            .btn{
                flex-grow: 0;
                display: flex;
                align-items: center;
                .van-button{
                    color: $font-color-pale;
                    height: 34px;
                    width: 65px;
                    border-radius: 34px;
                    background-color: $color-theme;
                }
            }
        }
        .home_content{
            width: 100%;
            float: left;
            padding: 24px 32px;
            box-sizing: border-box;
            .task-pro{
                width: 100%;
                border-radius: 10px;
                background-color: $color-theme;
                .task-item{
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: row;
                    .left-pro, .right-pro{
                        padding: 20px 0;
                        flex: 1;
                        border-bottom: 1px solid #fff;
                        p{
                            width: 100%;
                            display: flex;
                            color: #fff;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                    .left-pro p:nth-child(1), .right-pro p:nth-child(1){
                        font-size: 48px;
                    }
                    .left-pro p:nth-child(2), .right-pro p:nth-child(2){
                        font-size: 24px;
                        font-weight: 400;
                        margin-top: 12px;
                    }
                    .left-pro{
                        border-right: 1px solid #fff;
                    }
                }
            }
            .task-income{
                width: 100%;
                display: flex;
                margin-top: 20px;
                border-radius: 10px;
                background-color: #fff;
                // background-color: $home-bind-button;
                .task-item{
                    width: 100%;
                    display: flex;
                    padding: 20px 0;
                    .left-pro, .right-pro{
                        width: 100%;
                        flex-grow: 2;
                        border-right: 1px solid #E3E3E3;
                        // border-bottom: 1px solid #f75656;
                        p{
                            width: 100%;
                            height: 33px;
                            display: flex;
                            color: #000;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                    .show_detail{
                        width: 362px;
                        flex-grow: 1;
                        text-decoration: none;
                        color: $home-month-value;
                    }
                    .left-pro p:nth-child(1), .right-pro p:nth-child(1){
                        font-size: 24px;
                        font-weight: 400;
                        margin-top: 12px;
                        margin-bottom: 3px;
                    }
                    .left-pro p:nth-child(2), .right-pro p:nth-child(2){
                        font-size: 32px;
                        font-weight: 600;
                    }
                }
            }
            .show_detail{
                width: 100%;
                height: 72px;
                text-align: center;
                font-size: 24px;
                font-weight: 400;
                color: #07c160;
                line-height: 72px;
                text-decoration: underline;
            }
            .code-area{
                width: 100%;
                margin: 56px 0 40px 0;
                border-radius: 20px;
                .code-title{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    .line-left{
                        width: 6px;
                        height: 36px;
                        margin-right: 9px;
                        background: #F52C2C;
                    }
                    .wechat-icon{
                        color: #141414;
                        font-size: 32px;
                        display: flex;
                        font-weight: 500;
                        align-items: center;
                        span{
                            font-weight: 600;
                        }
                    }
                    .task-logo{
                        font-size: 24px;
                        font-weight: 400;
                        color: #999999;
                        margin-top: 8px;
                        margin-left: 11px;
                        span{
                            color: #F52C2C;
                        }
                        .jump_detail{
                            text-align: right;
                        }
                    }
                }
            }
            .poster-area{
                width: 100%;
                margin-top: 22px;
                position: relative;
                background: transparent;
                .poster_img{
                   width: 100%; 
                   height: 584px;
                   position: relative;
                   background: url('../assets/images/home/down_bg.png') no-repeat;
                   background-size: cover;
                    .van-button{
                        width: 165px;
                        height: 41px;
                        border-radius: 22px;
                        position: absolute;
                        left: 50%;
                        bottom: 32px;
                        color: #F80000;
                        background: transparent;
                        transform: translateX(-50%);
                        border-color: #F80000;

                    }
                   .qr-code{
                        width: 400px;
                        height: 300px;
                        // background-color: violet;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        position: absolute;
                        left: 50%;
                        bottom: 130px;
                        transform: translateX(-50%);
                        p{
                            width: 100%;
                            color: #FFF346;
                            font-size: 32px;
                            text-align: center;
                        }
                        .qr_img{
                            display: flex;
                            width: 190px;
                            height: 190px;
                            overflow: hidden;
                            box-sizing: border-box;
                            background-color: #fff;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                }
                img{
                    display: block;
                    width: 100%;
                    height: auto;
                }
            }
            .share_box{
                width: 100%;
                display: flex;
                // margin-bottom: 20px;
                padding: 20px 32px;
                box-sizing: border-box;
                background: #8283e0;
                // border-radius: 12px;
                .share_link, .share_btn{
                    flex-grow: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .van-button{
                        color: #feeeee;
                        float: right;
                        width: 94px;
                        height: 32px;
                        font-size: 12px;
                        border-radius: 36px;
                        border: none;
                        background-color: $color-theme;
                    }
                }
                .share_btn{
                    flex-grow: 0;
                }
                .share_link{
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    p{
                        width: 100%;
                        font-size: 24px;
                        font-weight: 400;
                        margin-bottom: 6px;
                        color: #fff;
                    }
                    p:nth-child(2){
                        color: #F52C2C;
                    }
                }
            }
            .share_top{
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
            }
            .share_first{
                border-bottom: 1px solid #E3E3E3;
            }
            .share_last{
                border-bottom-left-radius: 12px;
                border-bottom-right-radius: 12px;
            }
            .login_out{
                width: 100%;
                height: 88px;
                display: flex;
                z-index: 1;
                justify-content: center;
                margin-top: 32px;
                color: #999999;
                border-color: #fff;
                background-color: #fff;
                border-radius: 12px;
            }
        }
    }
</style>
