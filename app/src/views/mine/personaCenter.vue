<template>
    <div class="person_c">
        <page-header :title="title" :show-icon="true"></page-header>
        <div class="person_content">
            <template v-if="curIndex==0">
                <div class="user_info alipay_info">
                    <span class="lable_text">支付宝号</span>
                    <van-field v-model="alipayCard" placeholder="请输入支付宝收款账号" :border="false" />
                </div>
                <div class="user_info">
                    <span class="lable_text">收款姓名</span>
                    <van-field v-model="alipayName" placeholder="请输入收款姓名" :border="false" />
                </div>
            </template>
            <template v-else-if="curIndex==1">
                  <div class="user_info bank_account" @click="showBank">
                    <span class="lable_text">开户银行</span>
                    <div class="flex-between">
                        <van-field v-model="bankName" :readonly = true placeholder="请输入开户银行" :border="false" />
                        <van-icon name="arrow" style="transition: all .3s linear" :style="{transform: `rotate(${selectBank == true ? 90 : 0}deg)`}" />
                    </div>
                </div>
                <div class="user_info">
                    <span class="lable_text">收款卡号</span>
                    <van-field v-model="collectCard" :maxlength="19" placeholder="请输入收款卡号" :border="false" />
                </div>
                <div class="user_info">
                    <span class="lable_text">收款姓名</span>
                    <van-field v-model="collectName" placeholder="请输入收款姓名" :border="false" />
                </div>
                <div class="user_info">
                    <span class="lable_text">开户支行</span>
                    <van-field v-model="openBranch" placeholder="请输入开户支行" :border="false" />
                </div>
            </template>
            <template v-else-if="curIndex==2">
                <div class="user_info alipay_info">
                    <span class="lable_text">USDT地址</span>
                    <van-field v-model="usdtCard" placeholder="请输入USDT地址" :border="false" />
                </div>
            </template>
            <div class="user_info">
                <span class="lable_text">验证码</span>
                <van-field class="cell-block" :border="false" type="text" placeholder="请输入验证码" v-model="verify_code">
                    <template #button>
                        <van-button size="small" type="primary" id="TencentCaptcha" data-appid="2004381688" data-cbfn="callbackName" data-biz-state="data-biz-state" @click="getVerfyBtn">
                            {{countTime == 60?'发送验证码':`${countTime}秒后重新获取` }}</van-button>
                    </template>
                </van-field>
            </div>
            <van-action-sheet :round = "false" v-model = "selectBank" :actions="chinaBank" @close="hideBankSelect" @select="changeSelect" cancel-text="取消" />
            <div class="button_area">
                <van-button type="danger" @click="submitBtn">保存</van-button>
            </div>
        </div>
    </div>
</template>
<script>
import { addbank,myaccount,updateinfo, getCaptcha, sendcode, loginDigital } from "@/api/user";
import { wealthinfo, putpoint } from "../../api/pay";
import PageHeader from "@/components/Header";
export default {
    name: "mine",
    components: { PageHeader},
    data() {
        return {
            selectBank:false,
            personList:["账户信息","收款信息"],
            activeNames: ['1'],
            curIndex:"0",
            payType:"",
            title:"",
            jumpObj:{},
            userPhone: "",
            wechatNum: "",
            userName: "",
            superAccount: "",
            extensCode: "",
            bankName: "",
            collectCard: "",
            collectName: "",
            openBranch: "",
            alipayCard:"",
            alipayName:"",
            tng_wallet_no:"",
            tng_wallet_name:"",
            th_bank_no:"",
            th_bank_user_name:"",
            th_bank_name:"",
            bankArray:[],
            chinaBank: [
                {name: "国家开发银行"},
                {name: "中国工商银行"},
                {name: "中国农业银行"},
                {name: "中国银行"},
                {name: "中国建设银行"},
                {name: "中国邮政储蓄银行"},
                {name: "中国进出口银行"},
                {name: "中国农业发展银行"},
                {name: "交通银行"},
                {name: "招商银行"},
                {name: "上海浦东发展银行"},
                {name: "兴业银行"},
                {name: "华夏银行"},
                {name: "广东发展银行"},
                {name: "中国民生银行"},
                {name: "中信银行"},
                {name: "中国光大银行"},
                {name: "恒丰银行"},
                {name: "浙商银行"},
                {name: "渤海银行"},
                {name: "平安银行"},
                {name: "东亚银行"},
                {name: "上海农村商业银行"},
                {name: "玉溪市商业银行"},
                {name: "尧都农商行"},
                {name: "北京银行"},
                {name: "上海银行"},
                {name: "江苏银行"},
                {name: "杭州银行"},
                {name: "南京银行"},
                {name: "宁波银行"},
                {name: "徽商银行"},
                {name: "长沙银行"},
                {name: "成都银行"},
                {name: "重庆银行"},
                {name: "大连银行"},
                {name: "南昌银行"},
                {name: "福建海峡银行"},
                {name: "汉口银行"},
                {name: "温州银行"},
                {name: "青岛银行"},
                {name: "台州银行"},
                {name: "嘉兴银行"},
                {name: "常熟农村商业银行"},
                {name: "南海农村信用联社"},
                {name: "常州农村信用联社"},
                {name: "内蒙古银行"},
                {name: "绍兴银行"},
                {name: "顺德农商银行"},
                {name: "吴江农商银行"},
                {name: "齐商银行"},
                {name: "贵阳市商业银行"},
                {name: "遵义市商业银行"},
                {name: "湖州市商业银行"},
                {name: "龙江银行"},
                {name: "浙江泰隆商业银行"},
                {name: "广东省农村信用社联合社"},
                {name: "东莞农村商业银行"},
                {name: "浙江民泰商业银行"},
                {name: "广州银行"},
                {name: "辽阳市商业银行"},
                {name: "江苏省农村信用联合社"},
                {name: "廊坊银行"},
                {name: "浙江稠州商业银行"},
                {name: "德阳商业银行"},
                {name: "晋中市商业银行"},
                {name: "苏州银行"},
                {name: "桂林银行"},
                {name: "乌鲁木齐市商业银行"},
                {name: "成都农商银行"},
                {name: "张家港农村商业银行"},
                {name: "东莞银行"},
                {name: "莱商银行"},
                {name: "北京农村商业银行"},
                {name: "天津农商银行"},
                {name: "上饶银行"},
                {name: "富滇银行"},
                {name: "重庆农村商业银行"},
                {name: "鞍山银行"},
                {name: "宁夏银行"},
                {name: "河北银行"},
                {name: "华融湘江银行"},
                {name: "自贡市商业银行"},
                {name: "云南省农村信用社"},
                {name: "吉林银行"},
                {name: "东营市商业银行"},
                {name: "昆仑银行"},
                {name: "鄂尔多斯银行"},
                {name: "邢台银行"},
                {name: "晋商银行"},
                {name: "天津银行"},
                {name: "营口银行"},
                {name: "吉林农信"},
                {name: "山东农信"},
                {name: "西安银行"},
                {name: "河北省农村信用社"},
                {name: "宁夏黄河农村商业银行"},
                {name: "贵州省农村信用社"},
                {name: "阜新银行"},
                {name: "湖北银行黄石分行"},
                {name: "浙江省农村信用社联合社"},
                {name: "新乡银行"},
                {name: "湖北银行宜昌分行"},
                {name: "乐山市商业银行"},
                {name: "江苏太仓农村商业银行"},
                {name: "驻马店银行"},
                {name: "赣州银行"},
                {name: "无锡农村商业银行"},
                {name: "广西北部湾银行"},
                {name: "广州农商银行"},
                {name: "江苏江阴农村商业银行"},
                {name: "平顶山银行"},
                {name: "泰安市商业银行"},
                {name: "南充市商业银行"},
                {name: "重庆三峡银行"},
                {name: "中山小榄村镇银行"},
                {name: "邯郸银行"},
                {name: "库尔勒市商业银行"},
                {name: "锦州银行"},
                {name: "齐鲁银行"},
                {name: "青海银行"},
                {name: "阳泉银行"},
                {name: "盛京银行"},
                {name: "抚顺银行"},
                {name: "郑州银行"},
                {name: "深圳农村商业银行"},
                {name: "潍坊银行"},
                {name: "九江银行"},
                {name: "江西省农村信用"},
                {name: "河南省农村信用"},
                {name: "甘肃省农村信用"},
                {name: "四川省农村信用"},
                {name: "广西省农村信用"},
                {name: "陕西信合"},
                {name: "武汉农村商业银行"},
                {name: "宜宾市商业银行"},
                {name: "昆山农村商业银行"},
                {name: "石嘴山银行"},
                {name: "衡水银行"},
                {name: "信阳银行"},
                {name: "鄞州银行"},
                {name: "张家口市商业银行"},
                {name: "许昌银行"},
                {name: "济宁银行"},
                {name: "开封市商业银行"},
                {name: "威海市商业银行"},
                {name: "湖北银行"},
                {name: "承德银行"},
                {name: "丹东银行"},
                {name: "金华银行"},
                {name: "朝阳银行"},
                {name: "临商银行"},
                {name: "包商银行"},
                {name: "兰州银行"},
                {name: "周口银行"},
                {name: "德州银行"},
                {name: "三门峡银行"},
                {name: "安阳银行"},
                {name: "安徽省农村信用社"},
                {name: "湖北省农村信用社"},
                {name: "湖南省农村信用社"},
                {name: "广东南粤银行"},
                {name: "洛阳银行"},
                {name: "农信银清算中心"},
                {name: "城市商业银行资金清算中心"}
            ],
            thailBank: [
                { name: ('Bangkok Bank')},
                { name: ('Bangkok Bank for Agriculture and Agricultural Cooperatives')},
                { name: ('Bank of Ayudhya (Krungsri)')},
                { name: ('CIMB Thai Bank')},
                { name: ('Government Savings Bank')},
                { name: ('GOVERNMENT HOUSING BANK')},
                { name: ('Kasikorn Bank')},
                { name: ('Kiatnakin Bank')},
                { name: ('Krung Thai Bank')},
                { name: ('Siam Commercial Bank')},
                { name: ('Standard Chartered Bank (Thai)')},
                { name: ('Thanachart Bank')},
                { name: ('TISCO Bank')},
                { name: ('TMB Bank')},
                { name: ('United Overseas Bank (Thai)')},
                { name: ('KASIKORNBANK PUBLIC COMPANY LIMITED')},
                { name: ('CITIBANK N.A. (CITI) BANGKOK BRANCH')},
                { name: ('SUMITOMO MITSUI BANKING CORPORATION')},
                { name: ('DEUTSCHE BANK AKTIENGESELLSCHAFT (DB)')},
                { name: ('THAI CREDIT RETAIL BANK PUBLIC COMPANY LIMITED (TCRB)')},
                { name: ('MIZUHO BANKLTD.')},
                { name: ('LAND AND HOUSES RETAIL BANK PUBLIC COMPANY LIMITED')},
                { name: ('ISLAMIC BANK OF THAILAND (ISBT)')},
                { name: ('INDUSTRIAL AND COMMERCIAL BANK OF CHAINA (THAI)')},
                { name: ('HONGKONG and SHANGHAI CORPORATION LTD.')},
                { name: ('Bank of China')},
                { name: ('TMBThanachart Bank （TTB）')},
                { name: ('Kbank')},
                { name: ('INDUSTRIAL AND COMMERCIAL BANK OF CHINA')},
                { name: ('Iowa State Bank and Trust Company')},
                { name: ('Bank of Thailand')},
                { name: ('Export-Import Bank of Thailand')},
                { name: ('LH Bank')},
                { name: ('SME Development Bank')},
                { name: ('Australia and New Zealand Banking Group Limited')},
            ],
            malayBank: [
                { name: ('Bangkok Bank')},
                { name: ('Maybank')},
                { name: ('CIMB Bank')},
                { name: ('Public Bank Berhad')},
                { name: ('RHB Bank')},
                { name: ('Hong Leong Bank')},
                { name: ('AmBank')},
                { name: ('Alliance Bank Malaysia Berhad')},
                { name: ('Affin Bank')},
                { name: ('HSBC')},
                { name: ('Bank Islam Malaysia')},
                { name: ('OCBC')},
                { name: ('AGRO')},
                { name: ('Bank Rakyat')},
                { name: ('BSN')},
            ],
            put_type: [],

            usdtCard: '',
            my_bank_no: '',
            my_bank_name: '',
            my_bank_user_name: '',
            wealthinfoData: {},

            usdt_trc: '',
            countTime:  60,
            verify_code: '',

            num1 : 2,
			num2: 3,
			operate: 'jia',
			code_verify_v: '',
			uuid: '',
			code_verify_v_r: '',
        };
    },
    computed: {
        userInfo() {
            return this.$store.state.User.userInfo;
        }
    },
    created() {
        this.title = this.$route.meta.title;
        this.curIndex = this.$route.query.type;
        this.initBankInfo();
    },
    mounted() {
        // this.$nextTick(() => {
        //     window.callbackName = this.callbackName
        //     window.TencentCaptcha && (
        //         new window.TencentCaptcha(document.querySelector('#TencentCaptcha'), '2004381688', this.callbackName, {type: 'embed'})
        //     )
        // })
    },
    methods: {
        callbackName(res) {
				// 返回结果
                this.countTime =  60
                if(!this.userInfo.user_key){
                    return this.$toast('请输入手机号!')
                }
                let reg = new RegExp(/^1[3456789]\d{9}$/);
                if (!this.userInfo.user_key || !reg.test(this.userInfo.user_key)) {
                    return this.$toast('请输入正确的手机号');
                }
				if (res.ret === 0) {
					// 复制结果至剪切板
					let params = {
						// digital: Number(this.code_verify_v),
						// uuid: this.uuid,
						type: 2,
						code: 86,
						mobile: this.userInfo.user_key,
						lang: '',//'cn',
						rand_str: res.randstr,
                        ticket: res.ticket
					};
					getCaptcha(params).then(res => {
						this.settime();
					});
				}
		},
        getVerfyBtn(){
            var regMobile =  /^1[3456789]\d{9}$/;
            if(this.userInfo.user_key == ""){
                return this.$toast("请输入手机号");
            }/*else if(!regMobile.test(that.forgot_data.mobile)){
                return that.$toast("请输入正确的手机号");
            }*/
            // if(this.code_verify_v != this.code_verify_v_r){
			// 	return this.$toast('请输入正确的校验码')
			// }
            let params = {
                // digital: Number(this.code_verify_v),
				// uuid: this.uuid,
                type:2,
                mobile:this.userInfo.user_key,
            }
            sendcode().then(res => {
                if(res.code == undefined){
                    this.settime();
                }
            });
        },
        settime(obj) {
            if (this.countTime == 0) {
                this.countTime = 60;
                return;
            } else {
                this.countTime--;
            }
            setTimeout(() =>{this.settime() },1000);//设置定时任务，1000毫秒为1秒
        },

        showBank(){
            this.selectBank = true;
        },
        changeSelect(val){
            this.bankName=val.name;
            this.selectBank = false;
        },
        hideBankSelect(){
            this.selectBank = false;
        },
        onchangeBank(ele){
            if(ele.length > 1){
                this.activeNames.splice(0,1)
            }
            this.bankType=ele;
            this.bankArray = ele==1?this.chinaBank:ele==4?this.thailBank:ele == 6?this.malayBank:"";
            // this.bankArray = ele==1?this.chinaBank:ele==4?this.thailBank:ele == 6?this.malayBank:"";
        },
        initBankInfo(){
             wealthinfo().then(res => {
                this.bankName = res.bank_name,
                this.collectCard = res.bank_no,
                this.usdtCard = res.usdt_trc,
                this.collectName = res.bank_user_name,
                this.bank_zhi = res.openBranch||"",
                this.alipayCard = res.ali_no,
                this.alipayName = res.ali_user_name
            })
        },
        initUserInfo(){
            myaccount().then(res => {
                this.userPhone = res.phone || "";
                this.wechatNum = res.wx || "";
                this.superAccount = res.pid || "";
                this.extensCode = res.user_code || "";
            });
        },
        onChange(event) {
            this.curIndex = event;
            if(event == 0){
                this.initUserInfo();
            }else{
                this.payType = 3;
                this.initBankInfo();
            }
        },
        submitBtn(){
            const verify = [];
            // const regBank = /^([1-9]{1})(\d{6}\d{14}|\d{18})$/;
            // if(this.curIndex == "0"){
            //     verify.push({ name: "推广码", value: this.extensCode })
            //     verify.push({ name: "上级账号", value: this.superAccount })
            //     verify.push({ name: "微信号", value: this.wechatNum })
            //     verify.push({ name: "手机号", value: this.userPhone })
            // }else{
            //     if(this.payType == 1){
            //         verify.push({ name: "开户支行", value: this.openBranch })
            //         verify.push({ name: "收款姓名", value: this.collectName })
            //         verify.push({ name: "收款帐号", value: this.collectCard })
            //         verify.push({ name: "开户银行", value: this.bankName })  
            //     }else if(this.payType == 2){
            //         verify.push({ name: "收款姓名", value: this.alipayName })
            //         verify.push({ name: "支付宝号", value: this.alipayCard })  
            //     }else{
            //         verify.push({ name: "开户支行", value: this.openBranch })
            //         verify.push({ name: "收款姓名", value: this.collectName })
            //         verify.push({ name: "收款帐号", value: this.collectCard })
            //         verify.push({ name: "开户银行", value: this.bankName }) 
            //         verify.push({ name: "收款姓名", value: this.alipayName })
            //         verify.push({ name: "支付宝号", value: this.alipayCard })
            //     }
            // }
            // let flag = true
            // verify.forEach(item => {
            //     if (!item.value) {
            //         this.$toast(this.$t(`${item.name}不能为空`))
            //         flag = false
            //         return
            //     }
            // })
            // if(flag){

                let params ={
                    captcha: this.verify_code,
                    bank_name:this.bankName,
                    bank_no:this.collectCard,
                    bank_user_name:this.collectName,
                    bank_zhi:this.openBranch || "",
                    ali_no:this.alipayCard,
                    usdt_trc:this.usdtCard,
                    ali_user_name:this.alipayName
                }
                // if(this.curIndex == "0"){
                //     params.bank_name=this.bankName,
                //     params.bank_no=this.collectCard,
                //     params.bank_user_name=this.collectName,
                //     params.bank_zhi=this.openBranch || ""
                // }else{
                //     params.ali_no=this.alipayCard,
                //     params.ali_user_name=this.alipayName
                // }
                addbank(params).then(() => {
                    this.initBankInfo();
                    this.$toast("保存完成");
                    setTimeout(() =>{
                        this.$router.back();
                    },500)
                });
        },
        restForm(){
            this.userPhone = "";
            this.wechatNum = "";
            this.userName = "";
            this.superAccount = "";
            this.extensCode = "";
            this.bankName = "";
            this.collectCard = "";
            this.collectName = "";
            this.openBranch = "";
            this.alipayName = "";
            this.alipayCard = "";
        }
    }
};
</script>
<style lang="scss">
    .person_content{
        .van-collapse-item__content{
            padding: 0 !important;
        }
    }
</style>
<style lang="scss" scoped>
.person_c {
    width: 100%;
    height: 100%;
    float: left;
    font-size: 0.32rem;
    background-color: #f2f2f2;
    .person_content{
        width: 100%;
        height: 100vh;
        float: left;
        margin-top: 20px;
        padding: 25px 30px 0 30px;
        box-sizing: border-box;
        background-color: #fff;
        .user_info{
            width: 100%;
            height: 96px;
            float: left;
            border-bottom: 1px solid #EEEEEE;
            display: flex;
            align-items: center;
            background-color: #fff;
            justify-content: space-between;
            .van-cell{flex-grow: 1;}
            .lable_text{
                width: 2rem;
                color: #969799;
                line-height: 80px;
                float: left;
                margin-right: -10px;
                margin-left: 20px;
            }
            .van-icon{
                float: right;
                // margin-top: 10px;
            }
            .van-cell{
                width: 3.5rem;
                padding: 8px 0;
                background-color: transparent;
            }
        }
        .alipay_info{
            margin-top: 20px;
        }
        .van-tabs__wrap{
            font-size: 0.32rem;
        }
        .bank_list{
            width: 100%;
            height: 400px;
        }
        .van-collapse-item__content{
            padding: 0 !important;
        }
        .button_area{
            width: 100%;
            float: left;
            padding: 0 30px;
            margin-top: 114px;
            .van-button{
                height: 44px;
                width: 100%;
                border: none;
                border-radius: 44px;
                font-size: 0.32rem;
                background-color:$home-bind-button;
            }
        }
        .first_title, .bank_account{
            margin-top: 20px;
        }
        .bank_account{
            .van-cell{
                float: left;
            }
            .van-icon{
                font-size: 0.36rem;
            }
        }
        .van-action-sheet{
            max-height: 40%;
        }
        .van-action-sheet__item{
            // line-height: 0px;
            padding: 20px 0;
        }
        .van-action-sheet__cancel{
            padding: 12px 0;
            border-top: 1px solid #f2f2f2;
        }
    }
    .flex-between{
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-grow: 1;
    }

}
.valid_title{
    padding: 30px 32px 10px;font-size: 24px;
}
.num_validate_ct{
	display: flex; align-items: center;
	span{display: inline-block;width: 60px !important;height: 45px;margin: 0 !important;}
	.img_1{
		background: url('../../assets/images/new/1.jpg') left top no-repeat;background-size: contain;
	}
	.img_2{
		background: url('../../assets/images/new/2.jpg') left top no-repeat;background-size: contain;
	}
	.img_3{
		background: url('../../assets/images/new/3.jpg') left top no-repeat;background-size: contain;
	}
	.img_4{
		background: url('../../assets/images/new/4.jpg') left top no-repeat;background-size: contain;
	}
	.img_5{
		background: url('../../assets/images/new/5.jpg') left top no-repeat;background-size: contain;
	}
	.img_6{
		background: url('../../assets/images/new/6.jpg') left top no-repeat;background-size: contain;
	}
	.img_7{
		background: url('../../assets/images/new/7.jpg') left top no-repeat;background-size: contain;
	}
	.img_8{
		background: url('../../assets/images/new/8.jpg') left top no-repeat;background-size: contain;
	}
	.img_9{
		background: url('../../assets/images/new/9.jpg') left top no-repeat;background-size: contain;
	}
	.img_0{
		background: url('../../assets/images/new/0.jpg') left top no-repeat;background-size: contain;
	}
	.img_deng{
		background: url('../../assets/images/new/deng.jpg') left top no-repeat;background-size: contain;
	}
	.img_jia{
		background: url('../../assets/images/new/jia.jpg') left top no-repeat;background-size: contain;
	}
	.img_jian{
		background: url('../../assets/images/new/jian.jpg') left top no-repeat;background-size: contain;
	}
	.img_cheng{
		background: url('../../assets/images/new/cheng.jpg') left top no-repeat;background-size: contain;
	}
	.img_wen{
		background: url('../../assets/images/new/wen.jpg') left top no-repeat;background-size: contain;
	}
}
::v-deep {
    .van-cell__value{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        .van-field__body{
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
        .van-button--primary, .van-button--info{
            background-color: $color-theme;
            border-color:  $color-theme;
        }
        .van-button--info{
            opacity: 0.75;pointer-events: none;
        }
    }
}
</style>
