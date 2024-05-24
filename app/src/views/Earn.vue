<template>
    <div class="earn_new">
        <!-- <div class="head_bg"></div> -->
        <header>推荐</header>
        <div class="imgct">
            <div class="photo">
                <div class="title_img">
                    <img src="../assets/images/zdq/share_title@2x.png">
                </div>
                <div class="qr_code_ct">
                    <vue-qr :logoSrc="require('../assets/images/zdq/48.png')" :text="userCode" logoMargin=2 colorDark="#000" colorLight="#fff" 
                            margin=0  :logoScale="0.2" :size="90"></vue-qr>
                </div>
            </div>
            <div class="btn_ct" @click="saveQRCode"></div>
        </div>
        <div class="qr_ct">
            <div class="name">
                <span class="mark"></span><label>邀请好友</label>
            </div>
            <ul>
                <li>
                    <div>
                        <label>推荐码</label>
                        <span>{{userInfo.user_code}}</span>
                    </div>
                    <van-button class="copay_text"
                            v-clipboard:copy="userInfo.user_code"
                            v-clipboard:success="clipboardSuccessHandler">
                            复制
                    </van-button>
                </li>
                <li>
                    <div>
                        <label>邀请链接</label>
                        <span>{{userCode}}</span>
                    </div>
                    <van-button class="copay_path"
                        v-clipboard:copy = "userCode"
                        v-clipboard:success="clipboardSuccessHandler">
                            复制
                    </van-button>
                </li>
            </ul>
            <!-- <div class="qr_code_ct">
                <vue-qr  :text="userCode" colorDark="#000" colorLight="#fff" margin=0  :logoScale="0.6" :size="120"></vue-qr>
            </div>
            <div class="btn_ct"><span class="save_btn">保存二维码</span></div> -->
        </div>

        <div class="data_info">
            <div class="row">
                <div class="item" >
                    <a class="num">{{spreadData.team_num?spreadData.team_num:0}}</a>
                    <p>团队人数</p>
                </div>
                <div class="item">
                    <div class="num">{{spreadData.day_add_member?(spreadData.day_add_member):0}}</div>
                    <p>今日新增数量</p>
                </div>
            </div>
            <div class="row2" @click="$router.push('/branchDetail')">查看详情</div>
        </div>
        
    </div>
</template>
<script>
// import PageHeader from "@/components/Header";
import { spreadList,giveflow,getUserInfo } from "@/api/user";
import {fmoney,dateStamp } from "@/utils/tool";
import vueQr from 'vue-qr'
// import Header from '../components/Header.vue';
import html2canvas from "html2canvas"

export default {
    name: "buy",
    components: { vueQr},
    data() {
        return {
            datetime: "",
            showData:false,
            showCard:false,
            pickerShow:true,
            userInfo:"",
            currentTime: new Date().getTime(),
            earnList:["推广","团队","返佣"/*,"FAQ"*/],
            accountList:["推广","团队","返佣"/*,"FAQ"*/],
            orderList:["01","02","03"],
            returnList:[],
            spreadData:"",
            progress:50,
            profitTimeL:"0",
            nextPhone:"",
            show:false,
            curIndex:0,
            userCode:"",
            Stime:"",
            Etime:"",
            title:"",
            page:1,
            limit:30,
            total:0,

        };
    },
    computed: {
        userConfig() {
            return this.$store.state.User.config;
        },
    },
    created() {
        this.title = this.$route.meta.title;
        this.$store.dispatch("User/viplist");
        this.currentTime = new Date(); //给当前时间赋值
        this.datetime = this.$Helper.format_date(this.currentTime).split(" ")[0]; //给单元格显示当前时间的变量赋值
        this.Stime = this.datetime+" "+"00"+":"+"00"+":"+"00";
        this.Etime = this.datetime+" "+"23"+":"+"59"+":"+"59";
        if(sessionStorage.getItem("typeId") != undefined && sessionStorage.getItem("typeId") != null){
            this.curIndex = Number(sessionStorage.getItem("typeId"));
        }
        if(sessionStorage.getItem("storageInfo") != null && sessionStorage.getItem("storageInfo") != undefined){
            this.userInfo = JSON.parse(sessionStorage.getItem("storageInfo"))
            this.userCode = this.userInfo.share_url+'?code='+this.userInfo.user_code;
        }else{
            this.$nextTick(() => {
                this.bindQRCode();
            })
        }

        this.initSpread();
    },
    
    methods: {
        photoDom(dom , callback){
            html2canvas(dom,{
                logging: false,
                allowTaint: true,
                scale: window.devicePixelRatio,
                // width: shareContent.clientWidth, //dom 原始宽度
                // height: shareContent.clientHeight,
                scrollY: 0,
                scrollX: 0,
                useCORS: true,
                backgroundColor: '#ffffff',
            }).then(function(canvas){
                // console.log(canvas);
                let imgUrl = canvas.toDataURL( "image/png" );
                var tempLink = document.createElement('a');
                tempLink.style.display = 'none';
                tempLink.href = imgUrl;
                tempLink.setAttribute('download', ('蓝鸟分享海报'));
                if (typeof tempLink.download === 'undefined') {
                    tempLink.setAttribute('target', '_blank');
                }
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                window.URL.revokeObjectURL(imgUrl);
                
                callback && callback.call()
            })
        },
        saveQRCode(){
            const dom = document.querySelector('.earn_new .photo')
            this.photoDom(dom , () => {
                this.$toast.success(('下载成功'))
            })
        },
        //推广列表
        initSpread() {
            spreadList({}).then(res => {
                this.spreadData = res;
            });
        },
         //返佣列表
        return_list() {
            giveflow({
                page: this.page,
                limit: this.limit,
                stime: this.Stime == "" ? 0 : this.Stime == null ? 0 : dateStamp(this.Stime),
                etime: this.Etime == "" ? 0 : this.Etime == null ? 0 : dateStamp(this.Etime),
                phone_no: this.nextPhone
            }).then(res => {
                this.returnList = res.list || [];
                this.list = res.list || [];
                this.total = res.total;
            });
        },
        bindQRCode () {
            getUserInfo({}).then(res => {
                this.userInfo = res;
                this.userCode = res.share_url+'?code='+res.user_code;
            })
        },
        changePull(){
            this.showData = true;
        },
        changeData(){
            this.datetime = this.$Helper.format_date(this.currentTime).split(" ")[0];
            this.Stime = this.datetime+" "+"00"+":"+"00"+":"+"00";
            this.Etime = this.datetime+" "+"23"+":"+"59"+":"+"59";
            this.showData = false;
        },
        onChange(event) {
            sessionStorage.setItem("typeId",event)
            this.curIndex = event;
            if(this.curIndex == 2){
                this.return_list();
            }else if(this.curIndex == 0){
                this.initSpread();
                if(sessionStorage.getItem("storageInfo") != null && sessionStorage.getItem("storageInfo") != undefined){
                    this.userInfo = JSON.parse(sessionStorage.getItem("storageInfo"))
                    this.userCode = this.userInfo.share_url+'?user_code='+this.userInfo.user_code;
                }else{
                    this.$nextTick(() => {
                        this.bindQRCode();
                    })
                }
            }
        },
        clipboardSuccessHandler({ value, event }) {
            this.$toast(`${this.$t("home_031")}${this.$t("other_006")}`);
        },
        //跳转提交订单
        jumpUserBtn(idx){
            if(idx == '01'){
                this.$router.push("/userList");
            }else if(idx == '02'){
                // profitDetail
                this.$router.push("/profitDetail");
            }else if(idx == '03'){
                this.$router.push("/withdrawDeDetail");
            }
        },
        onClose() {
            this.show = false
        },
        submitBtn(){
            this.show = false;
        },
        // 格式化金额
        formatMoney(point) {
            return fmoney(point,2);
        },
        // 搜索
        serchBtn(){
            this.page = 1;
            this.return_list();
        }
    }
};
</script>
<style lang="scss" scoped>
.earn_new{
    background-color: #fff;position: relative;text-align:center;
    min-height: 100vh;padding-bottom: 160px;overflow-y:scroll;
    >header{
        font-size: 36px;color: #141414;height: 88px;font-weight: bold;text-align: center;
        line-height: 88px;background-color: #fff;margin-bottom: 26px;border-bottom: 1px solid #D8D8D8;
    }
    .imgct{
        margin: 0 26px 34px;width: 698px;height: 1088px;position: relative;text-align: center;
        .photo{
            padding-top: 64px;
            position: absolute;width: 100%;height: 100%;background: url('../assets/images/zdq/share_bg@2x.png') left top no-repeat;background-size:contain;
        }
        .title_img{
            margin-bottom: 22px;
            img{
                width: 318px;
            }
        }
        .btn_ct{
            position: absolute;bottom: 58px;left: 50%;transform: translateX(-50%);
            width: 400px;height: 82px;background: url('../assets/images/zdq/share_btn@2x.png') center center no-repeat;background-size: contain;
        }
        .qr_code_ct{
            margin-bottom: 40px;background-color: #fff;display: inline-block;padding:14px 14px 0px;
        }
    }
    .data_info{
        background: #F2F7FF;margin:0 40px 20px;border-radius: 12px;
        .row{
            border-bottom: 1px solid #D9DDE5;display:flex;
            &:nth-last-child(1){border: 1px transparent;}
            .item{
                width: 50%;border-right: 1px solid #D9DDE5;height: 148px;
                display: flex;align-content:center;justify-content:center;flex-direction:column;
                &:nth-last-child(1){border: 1px transparent;}
                .num{
                    font-size: 40px;color: #FF5500;font-weight: bold;
                }
                p{
                    font-size: 24px;color: #5E5E5E;
                }
            }
        }
        .row2{
            height: 72px;display: flex;align-items: center;justify-content: center;
            color: #1677FE;font-size: 24px;
        }
    }
    .qr_ct{
        background-color: #fff;padding: 0px 40px;
        .name{
            display: flex;align-items:center;margin-bottom: 40px;
            .mark{
                width: 6px;height: 36px;background: #006BFF;margin-right: 10px;
            }
            label{
                color: #141414;font-size: 36px;font-weight: bold;
            }
        }
        >ul{
            >li{
                height: 112px;background-color: #F2F7FF;border-radius: 12px;
                display: flex;align-items: center;padding: 0 24px;
                margin-bottom: 20px;
                >div{
                    flex-grow: 1;text-align: left;
                    display: flex;align-content:center;flex-direction:column;
                    label, span{
                        font-size: 28px;color: #313131;
                    }
                    label{width: 130px;display:inline-block;margin-right: 30px;color: #666666;}
                    span{
                        overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display:inline-block;
                        max-width: 320px;color: #1677FE;font-weight: bold;
                    }
                }
                >button{
                    flex-shrink: 0;font-size: 24px;color: #FFFFFF;font-weight: bold;
                    background-color: #1677FE;width: 188px;height: 64px;border-radius: 36px;
                }
            }
        }
        .qr_code_ct{
            margin-bottom: 40px;background-color: #fff;display: inline-block;padding:10px;
        }
        .btn_ct{text-align: center;display: flex;align-items: center;justify-content: center;}
        .save_btn{
            width: 242px;height: 64px;background: #1677FE;border-radius: 39px;color: #FFFFFF;text-align: center;
            line-height: 64px;font-size: 24px;display: inline-block;
        }
    }
    ::v-deep{
        button{
            border-radius: 22px;background: #5178F6;color: #FFFFFF;width: 86px;height: 43px;display: inline-block;
            font-size: 24px;
        }
        .van-button__text{
            white-space: nowrap;
        }
    }
}
</style>