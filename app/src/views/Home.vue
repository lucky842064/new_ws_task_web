<template>
    <div class="home-content">
        <div class="home_content">
            <van-swipe class="my_swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(item,idx) in list" :key="idx">
                    <img :src="item" alt="">
                </van-swipe-item>
            </van-swipe>
            <!-- <NoticeBar :isScroll= true :list="noticeCont" :from="true" /> -->
            <div class="task_settl">
                <van-notice-bar speed='20' :left-icon="require('../assets/images/home/earn-icon-a.png')" scrollable text="中午12点到晚上6点执行任务，期间挂机享受收益，请保持在线！" />
            </div>
            <div class="mian_continer">
                <div class="task-pro">
                    <div class="left-pro">
                        <p>{{ teamStemp.today_income || 0}}</p>
                        <p>{{ $t("home_023") }}</p>
                    </div>
                    <div class="right-pro">
                        <p>{{ teamStemp.yesterday_income || 0 }}</p>
                        <p>{{ $t("home_024") }}</p>
                    </div>
                </div>
                <div class="code-area">
                    <van-collapse v-model="activeName" :border = false accordion>
                        <van-collapse-item name="1" color="#1989fa" :value="activeName==1?'点击收起':'点击添加'">
                            <template #title>
                                <div>
                                    <van-icon :name="require('../assets/images/home/erweima.png')" />扫码添加WS
                                </div>
                            </template>
                            <div class="code-mian">
                                <div class="code_area">
                                    <div class="area_icon" @click="showProvince=true">
                                        <!-- <span class="text_left">当前位置：</span> -->
                                        <!-- <img class="weizhi_icon" src="../assets/images/home/weizhi.png" alt="" srcset=""> -->
                                        <span class="area_name">当前位置：{{loginArea||'~'}}</span>
                                        <img class="down_icon" src="../assets/images/home/xiala_icon.png">
                                    </div>
                                    <div class="update_btn">
                                        <!-- <van-button type="primary" @click.stop :disabled="countTime>0&&countTime<60" @click="showProvince=true">修改</van-button> -->
                                        <van-button :disabled="countTime>0&&countTime<60" @click="refreQrBtn">{{countTime==60?'刷新二维码':countTime+'s后刷新'}}</van-button>
                                    </div>
                                </div>
                                <div class="code-tips">
                                    <p>二维码处于灰色破损状态时，点击刷新二维。WhatsApp扫码,切勿长按识別二维码且截图保存扫码无效!</p>
                                    <!-- <p></p> -->
                                </div>
                                <div class="qr-code" v-show="errState">
                                    <!-- <van-loading v-if="qrCodeImg==''" size="24px">加载中...</van-loading> -->
                                    <div ref="qrcodeImg" id="qrcodeImg"></div>
                                    <!-- <img v-else :src="qrCodeImg" alt=""> -->
                                </div>
                                <div class="err_code" v-show="!errState">
                                    <img src="../assets/images/home/qr_err.png" alt="" srcset="">
                                </div>
                                <!-- <van-button type="danger" :disabled="countTime>0&&countTime<60" @click="refreQrBtn">{{countTime ==60?'刷新二维码':countTime+'s后刷新'}}</van-button> -->
                                <p>手机端WhatsApp扫码点击确认后，可点击收起！</p>
                                <p>（等待3-5分钟，点击刷新列表查看WhatsApp状态）</p>
                            </div>
                            <template #right-icon >
                                <van-icon name="" :color="color"/>
                            </template>
                        </van-collapse-item>
                    </van-collapse>
                </div>
                <div class="wecht-list">
                    <div class="wecht-lable">
                        <span class="item_title" v-for="(item,idx) in lableItem" :key="idx">
                            {{item}}
                            <span class="reash_btn" v-if="idx==2" @click="initWechatList(1,2)">
                                <img class="loading_icon" :class="isLoading?'loading_active':''" src="../assets/images/home/jiazai.png" alt="">
                                <span>刷新</span>
                            </span>
                        </span>
                    </div>
                    <div class="wecht-mess">
                        <!-- <template> -->
                        <template v-if="wechaList!=undefined&&wechaList!=null&&wechaList.length>0">
                            <div class="item_title item_mess" v-for="item in wechaList" :key="item.id">
                                <span class="item_title">{{item.account}}</span>
                                <span class="item_title item_status" :style="'color:'+(item.status!=2?'#D32C2C':'#28C445')">
                                    <a class="line_status" :class="item.status!=2?'down_status':''" href=""></a>
                                    {{statusOption[item.status]}}
                                </span>
                                <span class="item_title">
                                    <!-- <span class="line_up" :style="'color:'+(item.wx_state==0?'#28C445':'#D32C2C')" v-text="item.wx_state==0?'重登':''" @click="handelBtn(item)"></span> -->
                                    <span class="del-btn" @click="showDelBtn(item)">删除</span>
                                </span>
                            </div>
                        </template>
                        <template v-else>
                            <div class="item_mess">
                                <img class="empty_data" src="../assets/images/home/empty_icon.png" alt="" srcset="">
                                <div class="empty_text">尚未添加微信，无法开始赚钱 赶快去添加吧~</div>
                            </div>
                        </template>
                        <!-- <div class="page_footer">
                            <div class="paging_left">
                                <template v-if="total>6">
                                    <PrevNext :len="wechaList.length" :page="page" :limit="limit" :total="total" @to-prev="onPrev" @to-next="onNext"></PrevNext>
                                </template>
                            </div>
                            <div class="refash_right" @click="initWechatList(1,2)">
                                <span>刷新列表</span>
                            </div>
                        </div> -->
                    </div>
                </div>
                <div class="task_disc">
                    <p>* 手机端微信扫码点击确认后，可点击收起。</p>
                    <p>* 等待3-5分钟，点击刷新列表查看微信状态。</p>
                    <p class="point_tips">* 随时查看,保持在线,上号之后系统在自行执行任务,切勿私自操作,影响收益。</p>
                    <p class="point_tips">* 请大家挂机正常的vx！注册不满一月的新vx号，未实名的vx请勿挂机！</p>
                </div>
            </div>
        </div>
        <van-popup v-model="showProvince" position="bottom" :style="{ height: '260px' }">
            <van-picker title="选择省份" show-toolbar visible-item-count="4" value-key="name" :columns="provinceColumns" @confirm="onConfirm" @cancel="showProvince=false" />
        </van-popup>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'
import { mapState } from 'vuex';
import { setTimeout } from 'timers';
import { fmoney } from '../utils/tool';
import Global from '../core/Global';
import { Toast,Dialog} from 'vant';
import PrevNext from "@/components/PrevNext";
import { spreadList,msgOnline } from '@/api/user';
import { getincome,getaccountlist,delaccount,getqrcode } from'@/api/home'
export default {
	name: 'home',
	components: {},
	data() {
		return {
            page:1,
            total:0,
            limit:6,
			iphoneX: '',
            IpObj:"",
            isLoading:false,
            visible:true,
            userProvince:"",
            errState:false,
            qrCodeImg:"",
            activeName:1,
            teamStemp:'',
            loginArea:'印度尼西亚',
            loginCode:62,
            qrCodeType:0,
            countTime:60,
            refreState:false,
            showProvince:false,
            wetIcon:require('../assets/images/home/weixin-icon.png'),
			lableItem:['WS昵称','登录状态','操作'],
            statusOption:["","离线","在线","登录中","登录失败","离线中"],
            wechaList:[],
            list:[
                "https://img0.baidu.com/it/u=132095580,3308868527&fm=253&fmt=auto&app=138&f=JPG?w=592&h=296",
                "https://img0.baidu.com/it/u=1709064170,207840351&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=278",
                "https://img.tuguaishou.com/ips_templ_preview/53/2e/fa/lg_4426904_1634807148_61712d6ccc0a7.jpg!w1024_w?auth_key=2286544142-0-0-0408fba029f3f735dad77672222c8957",
            ],
            provinceColumns:[
                {   code:62,
                    name:"印度尼西亚"
                },
                {   code:91,
                    name:"印度"
                },
                {   code:55,
                    name:"巴西"
                },
                {   code:971,
                    name:"阿拉伯联合酋长国"
                },
                {   code:92,
                    name:"巴基斯坦 "
                },
                {   code:95,
                    name:"缅甸 "
                },
                {   code:856,
                    name:"老挝"
                }
            ]
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.User.userInfo,
		})
	},
    created(){
        // this.$store.dispatch('User/getUserInfo');
        // setTimeout(()=>{
        //     this.IpObj=JSON.parse(sessionStorage.getItem('storageIP'))
        //     this.userProvince = this.IpObj.province !=undefined?this.IpObj.province:'' 
        // },500)
    },
    activated(){
        this.activeName="";
        this.initSpread();
        // this.initNotic();
        this.initWechatList();
    },
    mounted() {
        // this.initSpread();
	},
	methods: {
        initNotic(){
            let isNotic = JSON.parse(sessionStorage.getItem('niticState'));
            if(isNotic !== '2' && isNotic !== 2){
                msgOnline({}).then(res => {
                    let noticList = res.tip||[];
                    if(noticList.length > 0){
                        let noticCont = noticList[0];
                        sessionStorage.setItem('niticState',1);
                        setTimeout(()=>{
                            this.$popDialog({ title:noticCont.title, content:noticCont.text});
                        },1000)
                    }
                })
            }
        },
        onChange(idx){
            if(idx==1&&this.qrCodeType!=1){
                this.errState = true;
                this.initQrcode();
            }
        },
        //刷新二维码
        refreQrBtn(){
            this.initQrcode();
        },
        initQrcode(row,tips){
            getqrcode({country_name:this.loginArea,country_code:String(this.loginCode)}).then(res => {
                if(res.qr_code){
                    this.errState = true;
                    this.createQrcode(res.qr_code)
                    // this.qrCodeImg = res.qr_code;
                    this.settime();
                    tips!=undefined?Toast(tips+'完成'):'';
                    this.initWechatList();
                }else{
                    Toast(res.msg)
                    this.settime();
                    this.errState = false;
                    this.loginArea=this.userProvince;
                }
            })
        },
        settime() {
			if (this.countTime == 0) {
                this.refreState=false;
				this.countTime = 60;
				return;
			} else {
				this.countTime--;
			}
			setTimeout(() => {
				this.settime();
			}, 1000); //设置定时任务，1000毫秒为1秒
		},
        initWechatList(num,idx){
            this.isLoading=idx==2?true:false;
            this.page=num!=undefined?num:this.page;
            getaccountlist().then(res => {
                this.isLoading=false;
                this.total = Math.ceil(res.total/this.limit);
                this.wechaList = res.list;
            })
        },
        createQrcode(qrCode){
            new QRCode(this.$refs.qrcodeImg, {
                text: qrCode,
                width: 182,
                height: 182,
                colorDark: "#333333",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.L
            })
        },
        handelBtn(row){
            let tipsText = row.wx_state===0?'上线':'下线'
            Dialog.confirm({
                title:"提示",
                message:"你确定要"+tipsText+"吗？",
                cancelButtonText:"取消",
                confirmButtonText:"确定",
                beforeClose: ((action, done) => {
                    if (action === 'confirm') {
                        this.initQrcode(row,tipsText);
                        // apiAddfun(params).then(res => {
                        //     if(res.errorCode == 0){
                        //         this.userAllAdress();
                        //         id==null?this.collectAdress():this.userAllAdress();
                        //         done()
                        //     }else{
                        //         done(false)
                        //     }
                        // })
                        done();
                    }else{
                        done();
                    }
                })
            });
        },
        showDelBtn(row){
            // if(row.wx_state==1){
            //     Toast('当前账号在线，无法删除');
            //     return;
            // }
            let tipsText = row.status==2?'删除在线WhatsApp号会导致没有收益，确定要删除吗?':'你确定要删除该WhatsApp号吗？'
            Dialog.confirm({
                title:"提示",
                message:tipsText,
                cancelButtonText:"取消",
                confirmButtonText:"确定",
                beforeClose: ((action, done) => {
                    if (action === 'confirm') {
                        delaccount({account: row.account}).then(res => {
                            Toast('删除完成')
                            this.initWechatList();
                        })
                        done();
                    }else{
                        done();
                    }
                })
            });
        },
        async initSpread() {
          this.teamStemp = await getincome({});
        },
        onConfirm(val){
            this.loginArea = val.name;
            this.loginCode = val.code;
            this.qrCodeType = 1;
            this.qrCodeImg="";
            this.errState = false;
            this.initQrcode();
            this.activeName='1';
            this.$refs.qrcodeImg.textContent="";
            this.showProvince=false;
        },
        // 格式化金额
		formatMoney(point) {
			return fmoney(point, 2);
		},
        onPrev() {
            this.page--;
            this.initWechatList();
        },
        onNext() {
            this.page++;
            this.initWechatList();
        }
	}
};
</script>
<style lang="scss">
    .van-notice-bar__left-icon, .van-notice-bar__right-icon{
        min-width: 0;
        padding-right: 5px;
    }
    .home-content{
        .van-cell{
            display: flex;
            padding: 10px 0;
        }
        .van-collapse-item__content{
            padding: 12px 0;
        }
        .van-cell--clickable:active{
            background-color: transparent !important;
        }
        .van-cell__value{
            span{
                display: inline-block;
                width: 76px;
                height: 26px;
                color: #fff;
                font-size: 12px;
                text-align: center;
                border-radius: 18px;
                background-color: $color-theme !important;
            }
        }
    }
</style>
<style lang="scss" scoped>
    .home-content {
        height: 100%;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #f2f2f2;
        -webkit-overflow-scrolling: touch; 
        padding-bottom: 120px;
        .home_content{
            width: 100%;
            float: left;
            .my_swipe{
                width: 100%;
                height: 320px;
                // margin-bottom: 30px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .task-pro{
                width: 100%;
                display: flex;
                padding: 20px 0;
                border-radius: 10px;
                flex-direction: row;
                background-color: $color-theme;
                .left-pro, .right-pro{
                    flex: 1;
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
            .task_settl{
                // display: flex;
                font-size: 24px;
                font-weight: 500;
                // margin-top: 30px;
                margin-bottom: 30px;
                align-items: center;
                // border-radius: 12px;
                // padding: 24px 0 24px 26px;
                background-color: #fff;
                .van-notice-bar{
                    padding: 0 8px;
                    font-size: 15px;
                    background-color: transparent;
                }
                img{
                    width: 30px;
                    height: 30px;
                    // margin-right: 10px;
                }
                span{
                    color: $home-bind-button;
                }
            }
            .mian_continer{
                width: 100%;
                padding: 0 20px;
                box-sizing: border-box;
            }
            .code-area, .wecht-list{
                width: 100%;
                margin-top: 32px;
                border-radius: 20px;
                background-color:$font-color-white;
                .van-collapse{
                    padding: 4px 13px;
                    box-sizing: border-box;
                }
                .van-cell__title{
                    position: relative;
                    z-index: 1;
                    .van-icon{
                        font-size: 22px;
                        margin-right: 4px;
                    }
                    div{
                        display: flex;
                        font-weight: 500;
                        font-size: 16px;
                        align-items: center;
                    }
                }
                .code-title, .code-mian{
                    width: 100%;
                    display: flex;
                    // padding-bottom: 21px;
                    border-bottom: 1px solid #e5e5e5;
                    // .wechat-icon, .task-logo{
                    // }
                    .wechat-icon{
                        flex-grow: 1;
                        color: #141414;
                        font-size: 32px;
                        display: flex;
                        font-weight: 500;
                        align-items: center;
                        img{
                            width: 44px;
                            height: 38px;
                            margin-right: 9px;
                        }
                        span{
                            font-weight: 600;
                        }
                    }
                    .task-logo{
                        flex-grow: 0;
                        img{
                            width: 158px;
                            height: auto;
                            float: right;
                        }
                    }
                }
                .code-mian{
                    width: 100%;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    border-bottom: none;
                    .code_area{
                        width: 100%;
                        height: 72px;
                        display: flex;
                        padding: 0 40px;
                        border-radius: 40px;
                        box-sizing: border-box;
                        background-color: #F6F6F6;
                        .area_icon{
                            flex-grow: 1;
                            display: flex;
                            align-items: center;
                            .weizhi_icon{
                                width:34px;
                                height: 32px;
                            }
                            .down_icon{
                                width:28px;
                                margin-left: 8px;
                            }
                            .text_left{
                                color: #939393;
                                font-size: 26px;
                            }
                            .area_name{
                                color: #141414;
                                font-size: 28px;
                                margin-left: 3px;
                                font-weight: 400;
                            }
                        }
                        .update_btn {
                            flex-grow: 0;
                            font-size: 24px;
                            display: flex;
                            align-items: center;
                            .van-button{
                                width: auto;
                                height: 26px;
                                padding: 0;
                                outline: none;
                                border: none;
                                color: #ff976a; 
                                background: transparent;
                            }
                            .van-button::before{
                                background-color:transparent!important;
                            }
                        }
                    }
                    .code-tips{
                        font-size: 24px;
                        font-weight: 400;
                        color: #939393;
                        margin: 20px 0 10px 0;
                        p{
                            text-align: center;
                            color: $home-bind-button;
                        }
                    }  
                    .qr-code, .err_code{
                        width: 364px;
                        height: 364px;
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: center;
                        img{
                            width: 100%;
                        }
                    }
                    .err_code{
                        // width: 324px;
                        // height: 324px;
                        span{
                            font-size: 12px;
                        }
                    }
                    .van-button{
                        width: 235px;
                        height: 34px;
                        background: $home-bind-button;
                        border-radius: 34px;
                        margin: 24px 0 21px 0;
                    }
                    p{
                        font-size: 24px;
                        font-weight: 400;
                        line-height: 36px;
                        color: #ADADAD;
                    } 
                }
            }
            .wecht-list{
                padding: 0 30px 5px 30px;
                .wecht-lable, .wecht-mess{
                    width: 100%;
                    display: flex;
                    font-size: 24px;
                    font-weight: 500;
                    color: #000000;
                    line-height: 88px;
                    border-bottom: 1px solid #f2f2f2;
                    .item_title{
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .line_up{
                            margin-right: 8px;
                        }
                        .reash_btn{
                            color: #4e6ef2;
                            display: flex;
                            align-items: center;
                            .loading_icon{
                                width: 32px;
                                height: 32px;
                                margin: 0 3px 0 10px;
                            }
                            .loading_active{
                                width: 32px;
                                height: 32px;
                                -webkit-animation: rotation 15s linear infinite;
                                animation: rotation .8s linear infinite;
                            }
                            @keyframes rotation {
                                0% {
                                    -webkit-transform: rotate(0deg);
                                }
                        
                                100% {
                                    -webkit-transform: rotate(360deg);
                                }
                            }
                        }
                    }
                    .item_mess, .empty_mess{
                        width: 100%;
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: center;
                        border-bottom: 1px solid #f2f2f2;
                            .item_status{
                                display: flex;
                                align-items: center;
                                box-sizing: border-box;
                                .line_status, .down_status{
                                    width: 14px;
                                    height: 14px;
                                    margin-right: 8px;
                                    border-radius: 50%;
                                    background: #28C445;
                                }
                                .down_status{
                                    background: #D32C2C;
                                }
                            }
                            .empty_data{
                                width: 146px;
                                height: 122px;
                                margin: 61px 0 41px 0;
                            }
                            .empty_text{
                                width: 100%;
                                color: #aaa;
                                display: flex;
                                margin-bottom: 96px;
                                justify-content: center;
                            }
                    }
                    .item_mess:last-child{
                        border-bottom: none !important;
                    }
                    .page_footer{
                        width: 100%;
                        display: flex;
                        margin: 18px 0;
                        .paging_left{
                            flex-grow: 1;
                        }
                        .refash_right{
                            display: flex;
                            flex-grow: 0;
                            align-items: center;
                            justify-content: center;
                            span{
                                display: flex;
                                width: 152px;
                                height: 44px;
                                color: $home-bind-button;
                                align-items: center;
                                font-size: 24px;
                                border-radius: 26px;
                                justify-content: center;
                                border: 1px solid $home-bind-button;
                            }
                        }
                    }
                }
                .wecht-mess{
                    display: block;
                    color: #141414;
                    border-bottom: none;
                    .on-line{
                        color: #28C445;
                        margin-right: 24px;
                    }
                    .down-line{
                        color: #F52C2C;
                    }
                    .del-btn{
                        color: #A8A8A8;
                    }
                }
            }
            .task_disc{
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                p{
                    display: flex;
                    width: 100%;
                    font-size: 24px;
                    font-weight: 400;
                    color: #ADADAD;
                    align-items: center;
                    letter-spacing: 1px;
                    margin-bottom: 20px;
                }
                p:nth-child(1){
                    margin-top: 40px;
                }
                .point_tips{
                    color: #F52C2C;
                }
            }
        }
    }
</style>
