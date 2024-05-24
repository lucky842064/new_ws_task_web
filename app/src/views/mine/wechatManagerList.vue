<template>
    <div class="wechatManagerList" ref="wechatManagerList">
        <page-header style="position: fixed;top: 0;left: 0; z-index: 9;" title="微信托管列表" :show-icon="true"></page-header>
        <div class="list">
            <van-list
                v-model="loading"
                :finished="finished"
                immediate-check=false
                offset=1
                finished-text="没有更多了"
                @load="onLoad"
            >
            <van-cell v-for="(item, index) in list" :key="index" >
                <div class="list_item" >
                    <div class="flexC_S top">
                        <span>托管收益：{{item.work_point/10000}}</span>
                        <span>微信号：{{item.wx}}</span>
                    </div>
                    <div class="flexC_S">
                        <div>
                            <p>{{item.auto_status == 0?'未开启托管':'已开启托管'}}</p>
                            <div><van-button :type="item.auto_status == 0?'info':'primary'" @click="managerHandle(item)">{{item.auto_status == 0?'开启托管':'取消托管'}}</van-button></div>
                        </div>
                        <div>
                            <p></p>
                            <div><van-button type="primary" @click="selectProvice(item)">{{item.currProvince?item.currProvince: '选择省份'}}</van-button></div>
                        </div>
                        <div>
                            <p :style="{color: item.online_status ==0?'#999': '#07c160'}">{{item.online_status ==0?'离线':'在线'}}</p>
                            <div><van-button type="info" @click="scanCode(item)" :disabled="item.online_status == 0 && !item.currProvince">扫码登陆</van-button></div>
                        </div>
                    </div>
                </div>
            </van-cell>
            </van-list>
        </div>
        <van-popup
        v-model="showProvince"
        position="bottom"
        :style="{ height: '300px' }"
        >
        <van-picker
            title="选择省份"
            show-toolbar
            :columns="provinceColumns"
            @confirm="onConfirm"
            @cancel="onCancel"
            />
        </van-popup>
        <van-popup v-model="showScanCode" :style="{ width: '80%', 'border-radius': '4px' }">
            <div class="scanCode_ct">
                <div class="title">
                    扫码登陆
                    <p>已选择 {{country_code}},请确保所选地区和手机微信所在省份地区一致</p>
                </div>
                <div class="content">
                    <van-loading v-if="!scanCodeUrl"></van-loading>
                    <vue-qr v-else :text="scanCodeUrl" colorDark="#000" colorLight="#fff"  :logoScale="0.2" :size="300"></vue-qr>
                </div>
                <div class="bottom" @click="scanPanelSure">
                    确定
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
import {List ,Cell, Popup } from 'vant'
import { memberAutoaccountlist, memberDoauto, taskGetpadqrcode, taskGetpadstatemore } from '@/api/wx.js'
import vueQr from 'vue-qr';
import { mapState } from 'vuex';

export default {
    name: "wechatManagerList",
    components: { 
        PageHeader,
        vueQr,
        'van-list': List,
        'van-cell': Cell
    },
    data() {
        return {
            showProvince: false,
            showScanCode: false,
            scanCodeUrl: '',

            list: [],
            currPgaeList: [],

            loading: false,
            finished: false,
            pageData:{
                page: 1,
                limit: 7,
            },
            totalPage: 100,
            provinceColumns:[
                '北京', '天津', '上海', '重庆', '河北', '河南', '山西', '山东', '陕西', '湖北', '湖南', '海南',
                '广东', '广西', '江西', '福建', '浙江', '江苏', '安徽', '贵州', '四川', '云南', '青海', '宁夏', 
                '甘肃', '西藏', '新疆', '内蒙古', '辽宁', '吉林', '黑龙江', '香港', '澳门', '台湾'
            ],
            currProvince: '选择省份',
            currItem: null,
            sendPage: 1,
            country_code: '',
            wk_name: '',
        };
    },
    created(){
        // this.onLoad()
        this.wk_name = process.env.VUE_APP_NAME;
    },
    beforeDestroy(){
        this.setIntervalId && window.clearInterval(this.setIntervalId)
        this.$refs.wechatManagerList.removeEventListener('scroll', this.scrollHandle)
    },
    computed: {
		...mapState({
			userInfo: state => state.User.userInfo,
		}),
	},
    methods:{
        scanPanelSure(){
            this.showScanCode = false
            this.$dialog.alert({
                title: this.$t("other_008"),
                message: '扫码登录成功后，请点击【开启托管】按钮，开启自动收益之旅。',
                confirmButtonColor: "rgb(255,2,65)",
                confirmButtonText: this.$t("other_005"),
                // cancelButtonText: this.$t("other_004")
            }).then(() => {
               
            });
        },
        scanCode(item){
            if(!item.currProvince){
                return this.$toast('请选择省份')
            }

            this.showScanCode = true
            this.scanCodeUrl = ""
            this.country_code = item.currProvince
            taskGetpadqrcode({
                ip_region: item.currProvince,
                wx: item.wx
            }).then(res =>{
                this.scanCodeUrl = res.qr_code_url
            })
        },
        selectProvice(item){
            this.showProvince = true
            this.currItem = item
        },
        onConfirm(item){
            console.log('confirm', item)
            if(!this.currItem.currProvince){
                this.$set(this.currItem, 'currProvince', item)
            }else {
                this.currItem.currProvince = item
            }
            // this.currItem.currProvince = item
            this.showProvince = false
        },
        onCancel(item){
            console.log('onCancel', item)
            this.showProvince = false
        },
        onLoad() {
            if(this.finished) return
            memberAutoaccountlist(this.pageData).then(data => {
                if(this.pageData.page == 1){
                    this.list = data.list || []
                }else {
                     this.list.push.apply(this.list, data.list || [])
                }
               
                this.currPgaeList = this.list.slice((this.pageData.page -1)*this.pageData.limit, this.pageData.page * this.pageData.limit)
                this.totalPage = data.total
                
                this.loading = false
                if(this.list.length >= data.total){
                    this.finished = true
                }else{
                    this.pageData.page++;
                }
                this.startListener()
            })
        },
        startListener(){
            if(this.setIntervalId) return
            // this.setIntervalId && window.clearInterval(this.setIntervalId)
            if(!this.setIntervalId) {
                // this.$refs.wechatManagerList.addEventListener('scroll', this.scrollHandle)
                this.setIntervalId = window.setInterval(() => {
                    let start = (this.sendPage -1)*this.pageData.limit
                    let end = (this.sendPage)*this.pageData.limit
                    if(start > this.list.length-1){
                        this.sendPage = 1
                        start = (this.sendPage -1)*this.pageData.limit
                        end = (this.sendPage)*this.pageData.limit
                    }
                    let wxs = this.list.slice(start, end).map((item) => item.wx)

                    taskGetpadstatemore({wxs}).then(res => {
                        let results = res.wxs
                        this.list.forEach((item) => {
                            let o = results.find((item2) => item2.wx == item.wx )
                            o && (item.online_status = o.state)
                        })
                    })
                    if(this.sendPage < this.totalPage){
                        this.sendPage++
                    }else {
                        this.sendPage = 1
                    }
                },  20* 1000)
            }
        },
        scrollHandle(){
            let scrollTop = this.$refs.wechatManagerList.scrollTop
            let scrollHeight = this.$refs.wechatManagerList.scrollHeight
            let clientHeight = this.$refs.wechatManagerList.clientHeight

            if(scrollTop <= 0){
                this.pageData.page -= 1
            }
            if(scrollHeight <= clientHeight + scrollTop + 3){
                this.$refs.wechatManagerList.removeEventListener('scroll', this.scrollHandle)
                this.onLoad()
            }
            if(this.pageData.page < 1) this.pageData.page = 1
            this.currPgaeList = this.list.slice((this.pageData.page -1)*this.pageData.limit, this.pageData.page * this.pageData.limit)
        },
        managerHandle(item){
            if(item.online_status ==0 && item.auto_status == 0){
                return this.$toast('请扫码登陆之后再开启托管')
            }
            if(item.auto_status == 1){
                this.$dialog.confirm({
                    title: this.$t("other_008"),
                    message: '取消托管，会损失托管收益，请联系客服，进行取消托管操作',
                    confirmButtonColor: "rgb(255,2,65)",
                    confirmButtonText: this.$t("other_005"),
                    cancelButtonText: this.$t("other_004")
                }).then(() => {
                     this.$Helper.toOutLink(this.userInfo.kefu + '&appid=30301&ostype=devtype&appname=' + this.userInfo.wk_name + '&userid=' + this.userInfo.user_id + '&username=' + this.userInfo.user_key + '&point=' + this.userInfo.point + '&ip=' + this.userInfo.myip + '&prov=' + this.userInfo.mycityname, 1)
                    // memberDoauto({
                    //     wx: item.wx,
                    //     auto_status: item.auto_status == 0?1: 0
                    // }).then(res => {
                    //     item.auto_status = res.auto_status
                    // })
                });
            }else {
                memberDoauto({
                    wx: item.wx,
                    auto_status: item.auto_status == 0?1: 0
                }).then(res => {
                    item.auto_status = res.auto_status
                })
            }
        }
    }

}
</script>
<style lang="scss" scoped>
.wechatManagerList{
    padding: 1.15rem .15rem .4rem .15rem;
    background-color: #f2f2f2;
    font-size: 12px;
    border-radius: 4px;
    overflow: scroll;
    box-sizing: border-box;
    height: 100vh;
    // .list, .van-cell{
    //     background-color: #f2f2f2;
    // }
    .list{
        // overflow: visible;
    }
    .list_item{
        padding-bottom: .1rem .15rem .45rem .15rem;
        // border-bottom: 1px solid #cecece;
        background-color: #fff;
        margin-bottom: .2rem;
        .top{
            border-bottom: 1px dashed #cecece;
            padding-bottom: .2rem;
            margin-bottom: .2rem;
        }
        p{
            height: 48px;
        }
    }
    .flexC_S{
        display: flex;
        justify-content: space-between;
        >div{
            text-align: center;
        }
    }
    .scanCode_ct{
        position: relative;
        height: 100%;
        .title{
            text-align: center;
            font-size: 32px;
            p{color: #ff0000;font-size: 12px;}
        }
        .content{
            text-align:center;min-height:200px;display:flex;align-items: center;justify-content: center;
        }
        .bottom{
            background-color: #fff;
            left: 0;
            bottom: 0;
            width: 100%;
            text-align: center;height: 86px;line-height: 86px;font-size: 32px;
            border-top: 1px solid #cecece;
        }
    }
    ::v-deep{
        .van-cell{
            margin-bottom: .15rem;
        }
    }
}
</style>