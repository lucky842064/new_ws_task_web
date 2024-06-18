<template>
    <div class="person_c">
        <page-header title="绑定提现信息" :show-icon="true"></page-header>
        <div class="person_content">
            <template v-if="curIndex==0">
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
            <template v-else-if="curIndex==1">
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
            <van-action-sheet :round="false" v-model="selectBank" :actions="malayBank" @close="hideBankSelect" @select="changeSelect" cancel-text="取消" />
            <div class="button_area">
                <van-button type="danger" @click="submitBtn">保存</van-button>
            </div>
        </div>
    </div>
</template>
<script>
import { wealthinfo } from "../../api/pay";
import PageHeader from "@/components/Header";
export default {
    name: "mine",
    components: { PageHeader},
    data() {
        return {
            bankName:"",
            collectCard:"",
            collectName:"",
            openBranch:"",
            usdtCard:"",
            verify_code:"",
            countTime:"",
            selectBank:false,
            bankArray:[],
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
                { name: ('BSN')}
            ]
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.User.userInfo;
        }
    },
    created() {
        this.curIndex = this.$route.query.type;
        // this.initBankInfo();
    },
    mounted() { },
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
		},
        getVerfyBtn(){
            var regMobile =  /^1[3456789]\d{9}$/;
            if(this.userInfo.user_key == ""){
                return this.$toast("请输入手机号");
            }
            let params = {
                // digital: Number(this.code_verify_v),
				// uuid: this.uuid,
                type:2,
                mobile:this.userInfo.user_key,
            }
            // sendcode().then(res => {
            //     if(res.code == undefined){
            //         this.settime();
            //     }
            // });
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
            // myaccount().then(res => {
            //     this.userPhone = res.phone || "";
            //     this.wechatNum = res.wx || "";
            //     this.superAccount = res.pid || "";
            //     this.extensCode = res.user_code || "";
            // });
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
                // addbank(params).then(() => {
                //     this.initBankInfo();
                //     this.$toast("保存完成");
                //     setTimeout(() =>{
                //         this.$router.back();
                //     },500)
                // });
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
