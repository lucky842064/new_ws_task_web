<template>
    <div class="reset-password">
        <page-header :title="$t('login_003')"></page-header>
        <div class="content-block">
            <van-cell-group>
                <van-field
                    :label="$t('mine_021')"
                    class="cell-block"
                    :border="false"
                    autocomplete="off"
                    :right-icon="regEye0 ? 'closed-eye': 'eye-o'"
                    :type="regEye0 ? 'password': 'text'"
                    @click-right-icon="regEye0 = !regEye0"
                    :placeholder="$t('login_031',{value:$t('mine_021')})"
                    v-model="oPwd"
                ></van-field>
                <van-field
                    :label="$t('mine_023')"
                    class="cell-block"
                    :border="false"
                    autocomplete="off"
                    :right-icon="regEye1 ? 'closed-eye': 'eye-o'"
                    :type="regEye1 ? 'password': 'text'"
                    @click-right-icon="regEye1 = !regEye1"
                    :placeholder="$t('login_031',{value:$t('mine_023')})"
                    v-model="nPwd"
                ></van-field>
                <van-field
                    :label="$t('mine_026')"
                    class="cell-block"
                    :border="false"
                    autocomplete="off"
                    :right-icon="regEye2 ? 'closed-eye': 'eye-o'"
                    :type="regEye2 ? 'password': 'text'"
                    @click-right-icon="regEye2 = !regEye2"
                    :placeholder="$t('login_031',{value:$t('mine_026')})"
                    v-model="cPwd"
                ></van-field>
                <!-- <van-field
                    label="验证码"
                    class="cell-block"
                    :border="false"
                    type="text"
                    v-model="verify_code">
                    <template #button>
                        <van-button size="small" type="primary" id="TencentCaptcha" data-appid="2004381688" data-cbfn="callbackName" data-biz-state="data-biz-state" 
                          @click="getVerfyBtn"  >{{countTime == 60?'发送验证码':`${countTime}秒后重新获取` }}</van-button>
                    </template>
                </van-field> -->
                <!-- <van-field
                    label="校验码"
                    class="cell-block"
                    :border="false"
                    type="text"
                    :placeholder="请输入正确的校验码"
                    v-model="code_verify_v"
                >
                    <template #button>
                        <div class="num_validate_ct">
                            <span :class="'img_'+num1"></span>
                            <span :class="'img_'+operate"></span>
                            <span :class="'img_'+num2"></span>
                            <span :class="'img_deng'"></span>
                            <span :class="'img_wen'"></span>
                        </div>
                    </template>
                </van-field> -->
            </van-cell-group>
            <van-button type="danger" :loading="isLoading" @click="submitFun">{{ $t('buy_069') }}</van-button>
        </div>
        <!-- <van-button type="success" :loading="isLoading" @click="submitFun">主要按钮</van-button> -->
    </div>
</template>
<script>
import { mapState } from "vuex";
import { revisepwd } from "@/api/login";
import PageHeader from "@/components/Header";

export default {
    components: {
        PageHeader
    },
    name: "reset-pwd",
    data() {
        return {
            oPwd:"",    
            nPwd:"", 
            cPwd:"", 
            isLoading:false,
            regEye0: true,
            regEye1: true,
            regEye2: true,
            countTime:  60,

            num1 : 2,
			num2: 3,
			operate: 'jia',
			code_verify_v: '',
			uuid: '',
			code_verify_v_r: '',
        };
    },
    computed: {
        active: function() {
            return (
                this.forgetData.oldPwd &&
                this.forgetData.new_pwd &&
                this.confirm_pwd
            );
        },
         ...mapState({
            userInfo: state => state.User.userInfo
        })
    },
    methods: {
        submitFun() {
            if (!this.oPwd) {
                return this.$t('login_031',{value:this.$t('mine_021')})
            }
            if (!this.cPwd) {
                return this.$t('login_031',{value:this.$t('mine_023')});
            }else if(this.nPwd !== this.cPwd){
                return this.$toast(this.$t('login_020'))
            }
            this.isLoading=true;
            revisepwd({old_pwd:this.oPwd,new_pwd:this.nPwd}).then(res => {
                this.isLoading=false;
                if(res.code) return;
                this.$dialog.confirm({
                    title: this.$t("other_008"),
                    message: this.$t("login_018"),
                    confirmButtonText: this.$t("buy_069"),
                    showCancelButton: false
                }).then(() => {
                    this.$store.dispatch("User/logoutUser");
                    this.$router.push({ name: "/login" });
                })
            })
        }
    }
};
</script>
<style lang="scss" scoped>
.reset-password {
    height: 100vh;
    background-color: #f2f2f2;
}
.header {
    height: 102px;
    width: 100%;
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    font-size: 36px;
    background-image: linear-gradient(90deg, #709fff 0%, #597ef7 100%);
    div i {
        vertical-align: middle;
    }
}
.cell-block {
    padding: 24px;
    height: 90px;
    background: #ffffff;
    border-radius: 20px;
    margin: 20px 0;
    color: #666666;
}
.van-cell-group {
    background-color: transparent;
}
.content-block {
    padding: 0 35px;
    .van-cell{
        border-radius: 5px;
    }
}
.submit-button {
    // width: 680px;
    padding:20px 0;
    margin: 60px 35px;
    text-align: center;
    font-size: 36px;
    color: #ffffff;
    border-radius: 10px;
    border-color: $color-theme;
    background-color: $color-theme;
    &.active {
        background: $home-bind-button;
    }
}
.verify-img-block {
    vertical-align: middle;
    img {
        height: 100%;
    }
}
.header-nav {
    display: flex;
    height: 88px;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-left: 10%;
    margin-bottom: 20px;
    .nav-item {
        margin-right: 20%;
        .title {
            font-size: 32px;
            color: #7e868d;
        }
        .b_line {
            height: 6px;
            width: 50px;
            border-radius: 3px;
            position: relative;
            margin: 20px auto 0 auto;
            visibility: hidden;
            &.active {
                visibility: visible;
            }
        }
    }
}
::v-deep {
    .van-field__label {
        width: 60px;
    }
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
            border-color: $color-theme;
        }
        .van-button--info{
            opacity: 0.75;pointer-events: none;
        }
    }
}
.van-button{
    width: 100%;
    border-radius: 5px;
}
</style>
<style lang="scss">
    .content-block {
        .van-field__label{
            width: 140px !important;
        }
    }
</style>
