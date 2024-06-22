<template>
    <div class="person_c">
        <page-header title="绑定提现信息" :show-icon="true"></page-header>
        <div class="person_content">
            <template v-if="curIndex==1">
                <div class="user_info">
                    <span class="lable_text">收款卡号</span>
                    <van-field v-model="collectCard" :maxlength="19" placeholder="请输入收款卡号" :border="false" />
                </div>
                <div class="user_info bank_account" @click="showBank">
                    <span class="lable_text">开户银行</span>
                    <div class="flex-between">
                        <van-field v-model="bankName" :readonly = true placeholder="请输入开户银行" :border="false" />
                        <van-icon name="arrow" style="transition: all .3s linear" :style="{transform: `rotate(${selectBank == true ? 90 : 0}deg)`}" />
                    </div>
                </div>
                <div class="user_info">
                    <span class="lable_text">收款姓名</span>
                    <van-field v-model="collectName" placeholder="请输入收款姓名" :border="false" />
                </div>
                <!-- <div class="user_info">
                    <span class="lable_text">收款姓名</span>
                    <van-field v-model="collectName" placeholder="请输入收款姓名" :border="false" />
                </div>
                <div class="user_info">
                    <span class="lable_text">开户支行</span>
                    <van-field v-model="openBranch" placeholder="请输入开户支行" :border="false" />
                </div> -->
            </template>
            <template v-else-if="curIndex==2">
                <div class="user_info alipay_info">
                    <span class="lable_text">USDT地址</span>
                    <van-field v-model="collectCard" placeholder="请输入USDT地址" :border="false" />
                </div>
            </template>
            <!-- <div class="user_info">
                <span class="lable_text">验证码</span>
                <van-field class="cell-block" :border="false" type="text" placeholder="请输入验证码" v-model="verify_code">
                    <template #button>
                        <van-button size="small" type="primary" id="TencentCaptcha" data-appid="2004381688" data-cbfn="callbackName" data-biz-state="data-biz-state" @click="getVerfyBtn">
                            {{countTime == 60?'发送验证码':`${countTime}秒后重新获取` }}</van-button>
                    </template>
                </van-field>
            </div> -->
            <van-action-sheet :round="false" v-model="selectBank" :actions="malayBank" @close="hideBankSelect" @select="changeSelect" cancel-text="取消" />
            <div class="button_area">
                <van-button type="danger" @click="submitBtn" :loading="isLoading">保存</van-button>
            </div>
        </div>
    </div>
</template>
<script>
import { getwithdrawcard,dowithdrawcard } from "@/api/pay";
import PageHeader from "@/components/Header";
export default {
    name: "mine",
    components: { PageHeader},
    data() {
        return {
            bank_id:"",
            bankName:"",
            collectCard:"",
            collectName:"",
            openBranch:"",
            usdtCard:"",
            verify_code:"",
            countTime:"",
            isLoading:false,
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
        this.initBankInfo();
    },
    mounted() { },
    methods: {
        async initBankInfo(){
        const {bank_name,card_no,payee_name,id} = await getwithdrawcard({type:Number(this.curIndex)});
            this.bank_id = id||"";
            this.bankName = bank_name||"";
            this.collectCard = card_no||"";
            this.collectName = payee_name||"";
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
        async submitBtn(){
            let params = {};
            if(this.curIndex == 1){
                params ={
                    ptype:this.bank_id?2:1,
                    type:Number(this.curIndex),
                    card_no:this.collectCard,
                    bank_name:this.bankName,
                    payee_name:this.collectName
                }
            }else{
                params ={
                    ptype:this.bank_id?2:1,
                    type:Number(this.curIndex),
                    card_no:this.collectCard
                }
            }
            this.bank_id?params.id=this.bank_id:"";
            if(this.curIndex==1&&!this.collectCard){
                return this.$toast('请输入收款卡号')
            }else if(this.curIndex==2&&!this.collectCard){
                return this.$toast('请输入USTD账户')
            }else if(this.curIndex==1&&!this.bankName){
                return this.$toast('请选择开户银行')
            }else if(this.curIndex==1&&!this.collectName){
                return this.$toast('请输入收款人姓名')
            }
            this.isLoading = true;
            const res = await dowithdrawcard(params);
            this.isLoading = false;
            if(res.code) return;
            this.$toast('操作完成');
            setTimeout(() => {this.$router.go(-1)},500);
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
