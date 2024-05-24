<template>
    <div class="wechatList" ref="wechatList">
        <header>微信列表</header>
        <div class="ads_ct">
            <img src="../../assets/images/new/ads.jpg">
        </div>
        <div class="totalct">
            <div class="ct">
                <img src="../../assets/images/wechat@2x.png"><span>微信总个数：</span><i>{{dataList.length}}个</i>
            </div>
        </div>
        <!-- <div class="data_info">
            <div class="income">
                <p class="num">
                    {{ (userInfo.auto_gain?userInfo.auto_gain/10000 : 0).toFixed(2) }}
                </p>
                <p>任务收益</p>
            </div>
            <div class="line"></div>
            <div class="wechat">
                <p class="num">{{ userInfo.wx_num || 0 }}</p> 
                <p>微信数量</p>
            </div>
        </div> -->
        <div class="list">
            <van-list
                v-model="loading"
                :finished="finished"
                immediate-check=false
                offset=1
                finished-text="没有更多了"
                @load="onLoad"
            >
                <van-cell>
                    <div class="list_item_head">
                        <span>微信昵称</span>
                        <span>在线状态</span>
                        <span>任务选项</span>
                    </div>
                </van-cell>
                <van-cell v-for="(item, index) in dataList" :key="index" >
                    <div class="list_item" >
                        <span><img class="head" v-if="item.wx_img" :src="item.wx_img">{{item.wx_no }}</span>
                        <span>
                            <!-- {{!item.wx_id?'--':item.wx_state == 1?'在线': '离线'}} -->
                            <template v-if="!item.wx_id">--</template>
                            <template v-else>
                                <!-- <template v-if="item.wx_state == 1">
                                    在线<van-button type="info" style="margin-left: 4px;" size="small" @click="loginByItem(item)">重登</van-button>
                                </template>
                                <template v-else>
                                    离线<van-button type="info" style="margin-left: 4px;" size="small" @click="loginByItem(item)">登陆</van-button>
                                </template> -->
                                {{item.wx_state == 1?'在线':'离线'}}
                                <van-button v-if="item.wx_state != 1" type="info" style="margin-left: 4px;" size="small" @click="loginByItem(item)">登陆</van-button>
                                <van-button type="warning" style="margin-left: 4px;" size="small" @click="delByItem(item)">删除</van-button>
                            </template>
                        </span>
                        <span style="taskct" @click="openTaskPanel(item)">
                            <!-- <template v-if="!item.wx_id">
                                --
                            </template>
                            <template  v-else>
                                <template v-if="item.wx_state == 0">
                                    请点击登陆按钮
                                </template>
                                <template v-else>
                                    任务进行中...
                                </template>
                            </template> -->
                            <label>{{item.wxtask.length}}项任务</label><span class="mark"></span>
                        </span>
                    </div>
                </van-cell>
            </van-list>
        </div>
        <div class="btn_ct">
            <div class="btns">
                <van-button type="info" :class="[selectAtelier?'Atelier':'NoAtelier']" @click="selectAtelier = !selectAtelier">
                    <label :class="[selectAtelier?'':'personal']">{{selectAtelier?'√':''}}</label><span>{{selectAtelier?'工作室模式':'个人版'}}</span>
                </van-button>
                <van-button type="info"  @click="addScanHandle22">
                    <!-- <div class="top">新增微信号(微信扫码登陆)</div> -->
                    <!-- <div class="bottom">此处禁止上方已登录的微信号</div>     -->
                    <label class="plus">+</label><span>扫码添加微信</span>
                </van-button>
                <!-- <van-button type="info" @click="shoudongScan22">
                    <div class="top">手动选省扫码登录</div>
                    <div class="bottom">(工作室多微信入口)</div>
                </van-button> -->
            </div>
            <div class="acc">
                <p>* 默认是扫码添加微信(个人版),不需选择省份，可以直接登录；选择工作室模式，扫码添加微信(工作室),必需选择省份，否则不能登录。</p>
                <p>* 只要手机端微信已经显示登录，即表示已经登录成功，需要5-10分钟出现在这里。</p>
                <p>* 必须用手机微信的“扫一扫”功能扫描二维码才能登录，长按识别二维码无法成功。</p>
            </div>
        </div>

        <van-popup
            v-model="showProvince"
            position="bottom"
            :style="{ height: '300px' }"
            >
            <van-picker
                title="请选择微信登录IP所在省份"
                show-toolbar
                :columns="provinceColumns"
                @confirm="onConfirm"
                @cancel="onCancel"
                />
        </van-popup>

        <van-popup v-model="showScanCode" :style="{ width: '94%', 'border-radius': '4px' }">
            <div class="scanCode_ct">
                <div class="title">
                    <h2>
                        扫码登陆<van-icon name="close" class="close" @click="scanPanelSure"></van-icon>
                    </h2>
                    <p>微信扫码登录是不可以扫描相册内二维码的哦~！</p>
                    <p>请使用其他手机对此二维码拍照后，再使用任务微信扫码登录。</p>
                </div>
                <div class="content">
                    <van-loading v-if="!scanCodeUrl && !scanCodeUrlError"></van-loading>
                    <!-- <vue-qr v-else :text="scanCodeUrl" colorDark="#000" colorLight="#fff"  :logoScale="0.2" :size="300"></vue-qr> -->
                    <img :src="scanCodeUrl" v-if="scanCodeUrl">
                    <p v-else-if="scanCodeUrlError">{{scanCodeUrlError}}</p>
                </div>
                <div class="bottom" >
                    <!-- {{message?message:'正在生产二维码'}} -->
                    手机微信扫码点击确认后关闭此窗口！
                    <p>(需要等待5-10分钟，平台才会显示微信状态!)</p>
                </div>
            </div>
        </van-popup>

        <van-popup v-model="showScanCodeList" :style="{ width: '94%', 'border-radius': '4px' }">
            <div class="scanCode_ct scanCode_ct_repeat">
                <div class="title">
                    <h2>
                        提示<van-icon name="close" class="close" @click="showScanCodeList = false"></van-icon>
                    </h2>
                    <p>您已扫码登录过以下账号，如果是重新登录，请点击 登录 按钮，重新扫码。</p>
                </div>
                <div class="content">
                    <ul>
                        <li v-for="(item, index) in dataList" :key="index">
                            <span><img class="head" v-if="item.wx_img" :src="item.wx_img">{{item.wx_no }}</span>
                            <span>
                                <template v-if="!item.wx_id">--</template>
                                <template v-else>
                                    {{item.wx_state == 1?'在线':'离线'}}
                                    <van-button v-if="item.wx_state != 1" type="info" style="margin-left: 4px;" size="small" @click="loginByItem(item)">登陆</van-button>
                                    <van-button v-if="item.wx_state == 1" type="warning" style="margin-left: 4px;" size="small" @click="delByItem(item)">删除</van-button>
                                </template>
                            </span>
                            <span>
                                <template v-if="!item.wx_id">
                                    --
                                </template>
                                <template  v-else>
                                    <template v-if="item.wx_state == 0">
                                        请点击登陆按钮
                                    </template>
                                    <template v-else>
                                        任务进行中...
                                    </template>
                                </template>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="bottom" >
                    <p>如果是从未扫码登录过的新号，请点击下方按钮，进行扫码</p>
                    <div class="btn22">
                        <van-button type="info" style="width:45%;"  @click="addScanHandle">
                            新增微信号(微信扫码登陆)
                        </van-button>
                        <van-button type="info" style="width:45%;" @click="shoudongScan">
                            手动选省扫码登录
                        </van-button>
                    </div>
                </div>
            </div>
        </van-popup>

        <van-popup v-model="taskPanelShow">
			<div class="panel">
				<div class="title">执行任务项</div>
                <!-- <div>
                    {{ JSON.stringify( currOpenItem ) }}
                </div> -->
				<div class="content">
					<div class="item">
						<div class="text">1、阅读文章(给微信文章刷阅读量)</div>
                        <!--  :class="{on: currOpenItem.wxtask && currOpenItem.wxtask.includes(1), off: currOpenItem.wxtask && !currOpenItem.wxtask.includes(1)}" -->
						<div class="btn" @click="switchHandle(1)" :class="{on: currOpenItem.wxtask && currOpenItem.wxtask.includes(1), off: currOpenItem.wxtask && !currOpenItem.wxtask.includes(1)}">
							<span class="switch_c" ></span>
						</div>
					</div>
					<div class="item">
						<div class="text">2、文章点赞(给微信文章刷点赞量)</div>
						<div class="btn" @click="switchHandle(2)" :class="{on: currOpenItem.wxtask && currOpenItem.wxtask.includes(2), off: currOpenItem.wxtask && !currOpenItem.wxtask.includes(2)}">
							<span class="switch_c"></span>
						</div>
					</div>
					<div class="item">
						<div class="text">3、推广任务(自动点击和推广一些广告)</div>
						<div class="btn on" @click="switchHandle(3)">
							<span class="switch_c"></span>
						</div>
					</div>
					<div class="item">
						<div class="text">4、微信签到(给一些签到功能刷热度)</div>
						<div class="btn" @click="switchHandle(4)" :class="{on: currOpenItem.wxtask && currOpenItem.wxtask.includes(4), off: currOpenItem.wxtask && !currOpenItem.wxtask.includes(4)}">
							<span class="switch_c"></span>
						</div>
					</div>
				</div>
				<div class="sure_btn" @click="taskPanelShow = false">确定</div>
				<p class="tip">*您可以通过手机微信监控，随时关闭</p>
			</div>
		</van-popup>
    </div>
</template>
<script>
// import PageHeader from "@/components/Header";
import {List ,Cell, Button, Toast } from 'vant'
import { newloginGetqrcode, newloginGetwxlist, newloginGetcurrentprovince, newloginDeletewx } from '@/api/wx.js'
// import vueQr from 'vue-qr';
import { mapState } from 'vuex';
import '@vant/touch-emulator'


export default {
    name: "wechatList",
    components: { 
        // PageHeader,
        // vueQr,
        'van-list': List,
        'van-cell': Cell,
        'van-button': Button
    },
    data(){
        return {
            showProvince: false,
            showScanCode: false,

            showScanCodeList: false,

            loading: false,
            finished: false,
            pageData:{
                page: 1,
                limit: 1000,
            },
            provinceColumns:[
                '北京', '天津', '上海', '重庆', '河北', '河南', '山西', '山东', '陕西', '湖北', '湖南', '海南',
                '广东', '广西', '江西', '福建', '浙江', '江苏', '安徽', '贵州', '四川', '云南', '青海', '宁夏', 
                '甘肃', '西藏', '新疆', '内蒙古', '辽宁', '吉林', '黑龙江', '香港', '澳门', '台湾'
            ],

            scanCodeUrl: '',
            scanCodeUrlError: '',
            account1: '',
            dataList: [],

            currCountry: '',
            currProvince: '',
            setIntervalId: null,

            repeatRequestNewloginGetqrcodeId:null,
            message: '',

            taskPanelShow: false,
            wxTaskList: [],
            currOpenItem: {},
            test: 1,
            selectAtelier: false,
        }
    },
    computed: {
		...mapState({
			userInfo: state => state.User.userInfo,
		}),
	},
    created(){
        newloginGetcurrentprovince().then(res => {
            this.currCountry = res.country
            this.currProvince = res.province
        })
        this.setIntervalId = window.setInterval(() => {
            this.pageData.page = 1
            this.finished = false
            this.onLoad()
        }, 40*1000)
        console.log('localstorge.test', localStorage.getItem('test'))
        this.test = localStorage.getItem('test') || this.test
        this.test++
    },
    beforeMount(){
        localStorage.setItem('test', this.test)
    },
    beforeDestroy(){
        window.clearInterval(this.setIntervalId)
        if(this.wxTaskList.length){
            localStorage.setItem('wxTaskList', JSON.stringify(this.wxTaskList))
        }
        // localStorage.setItem('test', this.test)
    },
    methods:{
        switchHandle(index){
            if(index == 3){
                return Toast('该任务不能关闭!')
            }
            if(this.currOpenItem.wxtask.indexOf(index) == -1){
                this.currOpenItem.wxtask.push(index)
            }else {
                this.currOpenItem.wxtask.splice(this.currOpenItem.wxtask.indexOf(index), 1)
            }
        },
        openTaskPanel(item){
            this.taskPanelShow = true
            this.currOpenItem = item
            // this.$toast('敬请关注')
        },
        shoudongScan22(){
            if(this.dataList.length){
                 this.showScanCodeList = true
            }else {
                this.showProvince = true
            }
        },
        addScanHandle22(){
            if(!this.selectAtelier && this.currProvince && this.currCountry){
                this.onConfirm(this.currProvince, this.currCountry)
            }else{
                this.showProvince = true
            }
        },  
        shoudongScan(){
            this.showScanCodeList = false
            
            this.showProvince = true
        },
        addScanHandle(){
            this.showScanCodeList = false

            if(this.currProvince && this.currCountry){
                this.onConfirm(this.currProvince, this.currCountry)
            }else{
                this.showProvince = true
            }
        },  
        onConfirm(item, currCountry){
            this.scanCodeUrl = ""
            this.scanCodeUrlError = ""
            newloginGetqrcode({
                "country": "中国", //currCountry==this.currCountry?currCountry:"中国",
                "province": item,
                "account": ''
            }).then(res => {
                this.scanCodeUrl = res.qrcode
                this.account1 = res.account
                this.message = res.msg

                // if(res.code == 999){
                //     this.$toast.success('登录成功')
                //     this.showScanCode = false
                // }else if(res.code == -1){
                //     this.$toast.fail('登录失败')
                // } else {
                //     this.repeatRequestNewloginGetqrcodeId = window.setInterval(() => {

                //         newloginGetqrcode({
                //             "country": this.currCountry?this.currCountry:"中国",
                //             "province": item,
                //             "account": this.account1
                //         }).then(res => {
                //             this.scanCodeUrl = res.qrcode
                //             this.account1 = res.account
                //             this.message = res.msg
                //         })

                //     }, 10*1000)
                // }
            }).catch(err => {
                console.log('wechatList error', err)
                this.scanCodeUrlError = err
            })
            this.showProvince = false
            this.showScanCode = true
        },
        loginByItem(item){
            this.showScanCode = true
            this.scanCodeUrl = ''
            newloginGetqrcode({
                "country":  item.country,
                "province": item.province,
                "account":  item.account
            }).then(res => {
                // this.$toast.success('登录成功')
                this.scanCodeUrl = res.qrcode
            }).catch((err) => {
                this.scanCodeUrlError = err
                // this.$toast('登录失败')
            })
        },
        delByItem(item){
            newloginDeletewx({id: item.id}).then(res => {
                this.pageData.page = 1
                this.finished = false
                this.onLoad()
            })
        },
        onCancel(item){
            console.log('onCancel', item)
            this.showProvince = false
        },
        onLoad() {
            if(this.finished) return
            this.loading = true
            if(this.wxTaskList.length){
                localStorage.setItem('wxTaskList', JSON.stringify(this.wxTaskList))
            }
            newloginGetwxlist(this.pageData).then(data => {
                // data.list = [{wx_no: 'aaaa', wx_state: 1}]
                this.wxTaskList = localStorage.getItem('wxTaskList') || []
                if(localStorage.getItem('wxTaskList')){
                    this.wxTaskList = JSON.parse(localStorage.getItem('wxTaskList'))
                }
                this.wxTaskList = this.wxTaskList || []
                
                data.list.forEach((item) => {
                    this.wxTaskList.forEach((item2) => {
                        if(item2.wx_no == item.wx_no){
                            item.wxtask = item2.wxtask
                        }
                    })
                    item.wxtask = item.wxtask || [1, 2, 3, 4]
                })
                // if(this.wxTaskList.length == 0){
                    this.wxTaskList = data.list
                // }

                if(this.pageData.page == 1){
                    this.dataList = data.list || []
                }else {
                     this.dataList.push.apply(this.dataList, data.list || [])
                }
                this.totalPage = data.total
                
                this.loading = false
                if(this.dataList.length >= data.total){
                    this.finished = true
                }else{
                    this.pageData.page++;
                }
            })
        },
        scanPanelSure(){
            this.showScanCode = false
            this.repeatRequestNewloginGetqrcodeId && window.clearInterval(this.repeatRequestNewloginGetqrcodeId)
        }
    }
}
</script>
<style lang="scss" scoped>
.wechatList{
    position: relative;
    // padding-top: 88px;
    // padding-bottom: 144px;
    height: calc(100vh - 144px);
    box-sizing: border-box;
    overflow: auto;
    // background: #F6F6F6;
    display: flex;flex-direction:column;
    .totalct{
        padding: 0 24px;background-color: #F1F1F1;
        .ct{
            display: flex;align-items: center;height: 64px; 
            border-bottom: 1px solid #D8D8D8;
        }
        img{width: 34px;margin-right: 8px;}
        span{font-size: 24px;color: #666666;;}
        i{font-style: normal;color: #FF5500;font-size: 24px;}
    }
    >header{
        font-size: 36px;color: #141414;height: 88px;font-weight: bold;text-align: center;line-height: 88px;
    }
    .ads_ct{
       overflow: hidden;display:flex;
        img{width: 100%;}
    }
    .list{
        flex-grow: 1;overflow-y: scroll;
    }
    .data_info{
        /*padding: 40px 130px;*/display: flex;align-items: center;height: 146px;
        justify-content: space-around;background-color:#fff;margin: 0 26px 21px;border-radius: 20px;
        .line{
            height: 67px;border: 1px dashed #CBCBCB;
        }
        .income {
            text-align: center;
            p{font-size: 24px;font-weight: bold;}
            .num{
                color: #FF8D12;
                font-size: 28px;
            }
        }
        .wechat{
            text-align: center;
            p{font-size: 24px;font-weight: bold;}
            .num{
                color: #5178F6;
                font-size: 28px;
            }
        }
    }
    .btn_ct{
        // position: absolute;
        bottom: 0px;
        left: 0;width: 100%;text-align: center;
        background-color: #fff;
        .btn{
            background: url('../../assets/images/new/loginBtn.png') center center no-repeat;
        }
        .top{font-size: 14px;}
        .bottom{font-size: 16px;}
        .btns{
            margin-bottom: 32px;justify-content: center;display: flex;
        }
        .NoAtelier{
            background-color: #ccc !important;color: #666;
        }
        .personal{
            display: inline-block;width: 24px;height: 24px;border-radius: 50%;background-color: #999;
        }
        button{
            label{margin-right: 6px;font-weight: bold;}
            &:nth-child(1){width: 30%;}
            &:nth-child(2){width: 60%;margin-left: 8px;}
        }
        .van-button--info{
            background-color: #006BFF;border:transparent;border-radius: 48px;
        }
        .plus{font-size: 36px;}
        .acc{
            font-size: 24px;color: #ADADAD;margin: 0 30px;text-align: left;
            p{
                margin-bottom: 24px;
                &:nth-last-child(1){
                    margin-bottom: 0px;
                }
            }
        }
    }
    .list_item_head{
        display: flex;align-items: center;justify-content: space-between;
        background-color: #F1F1F1;
        .line{
            height: 37px;border: 1px dashed #CBCBCB;
        }
        span{font-size: 24px;color: #000000;font-weight: bold;}
    }
    .list_item{
        display: flex;align-items: center;
        justify-content: space-between;
        .head{
            height: .6rem;
            width: .6rem;margin-right: .1rem;
        }
        span{font-size: 28px;}
        &>span:nth-child(1){
            width: 30%;line-height: 1;
            display: flex;align-items: center;
        }
        &>span:nth-child(2){
            width: 40%;text-align: center;
            display: flex;align-items: center;justify-content: center;
        }
        &>span:nth-child(3){
            width: 30%;text-align: right;
            display: flex;align-items: center;justify-content: flex-end;
        }
        .taskct{
            display: flex;align-items: center;justify-content: center;
        }
        .mark{
            display: inline-block;border-top: 14px solid #333;border-right: 14px solid transparent;border-left: 14px solid transparent;
            margin-left: 6px;border-radius: 14px;
        }
    }
    .tip{
        font-size: 24px;text-align: center;background-color: #FFF0E5;color:#AD5D23;text-align: center;
    }

    ::v-deep{
        .van-list{
            height: 100%;
            overflow-y: scroll;
            .van-cell{
                &:nth-child(1){
                    background-color: #F1F1F1;
                }
                &::after{
                    left:0;right: 0;
                    border-bottom: 1px solid #ebedf0;
                }
            }
        }
        .scanCode_ct{
            text-align: center;
            .content{
                display: flex;align-items: center;justify-content: center;
                min-height: 2.5rem;padding: .2rem 0;
                p{text-align: center;font-size: .36rem;}
            }
            .title{
                font-size: .32rem;    
                padding: .2rem 0.1rem;
                border-bottom: 1px solid #ececec;
                .close{font-size: 48px;float: right;position: relative;right: .2rem;}
            }
            .bottom{font-size: .36rem;padding: .2rem;
                border-top: 1px solid #ececec;
            }
        }
        .van-ellipsis{
            white-space: pre-wrap;
        }

        .scanCode_ct_repeat{
            .content{
                display: flex;flex-direction: column;
            }
            ul{width: 100%;}
            li{
                list-style: none;
                >span{
                    display: inline-block;white-space:pre-wrap;
                    &:nth-child(1){
                        width: 20%;
                    }
                    &:nth-child(2){
                        width: 40%;font-size: 0.36rem;
                    }
                    &:nth-child(3){
                        width: 40%;font-size: 0.36rem;text-align: right;
                    }
                }
            }
            .btn22{
                display: flex;align-items: center;justify-content: space-around;
                .position{width: 45%;}
            }
            .bottom{
                >p{
                    margin-bottom: .2rem;
                }
            }
        }
    }

    .panel{
        width: 626px;border-radius: 12px;background-color: #fff;z-index: 1111;
        padding: 72px 40px 56px;
        .title{
            margin-bottom: 62px;font-weight: bold;font-size: 48px;text-align: center;    
            display: flex;justify-content: center;
        }
        .content{
            .item{
                display: flex;align-items: center;justify-content: space-between;margin-bottom: 28px;
                .btn{
                    width: 75px;height: 40px;background-color: #1677FE;position: relative;border-radius: 20px;flex-shrink: 0;padding: 4px;
                    .switch_c{
                        width: 32px;height: 32px;background-color: #FFFFFF;position: absolute;border-radius: 50%;
                        transition: all .7s;
                    }
                }
                .on{
                    .switch_c{
                        left: 4px;
                    }
                }
                .off{
                    background-color: #DDDDDD;
                    .switch_c{    
                        left: 39px;
                    }
                }
                .text{
                    font-size: 26px;color: #060606;flex-grow: 1;white-space: pre-wrap;
                }
                &:nth-last-child(1){margin-bottom: 72px;}
            }
        }
        .sure_btn{
            height: 88px;background: #006BFF;border-radius: 44px;color: #FFFFFF;font-weight: bold;
            text-align: center;line-height: 88px;margin-bottom: 24px;font-size: 32px;
        }
        .tip{
            font-size: 24px;color: #ADADAD;text-align: center;background-color: rgba(0,0,0,0);
        }
    }
}
</style>