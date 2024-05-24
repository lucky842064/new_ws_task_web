<template>
    <div class="reset-password">
        <page-header :title="$t('login_003')"></page-header>
        <div class="content-block">
            <van-cell-group>
                <van-field
                    :label="$t('mine_021')"
                    class="cell-block"
                    :border="false"
                    :right-icon="regEye0 ? 'closed-eye': 'eye-o'"
                    :type="regEye0 ? 'password': 'text'"
                    @click-right-icon="regEye0 = !regEye0"
                    :placeholder="$t('mine_022')"
                    v-model="forgetData.oldPwd"
                ></van-field>
                <van-field
                    :label="$t('mine_023')"
                    class="cell-block"
                    :border="false"
                    :right-icon="regEye1 ? 'closed-eye': 'eye-o'"
                    :type="regEye1 ? 'password': 'text'"
                    @click-right-icon="regEye1 = !regEye1"
                    :placeholder="$t('mine_024')"
                    v-model="forgetData.new_pwd"
                ></van-field>
                <van-field
                    label="确认密码"
                    class="cell-block"
                    :border="false"
                    :right-icon="regEye2 ? 'closed-eye': 'eye-o'"
                    :type="regEye2 ? 'password': 'text'"
                    @click-right-icon="regEye2 = !regEye2"
                    :placeholder="$t('mine_025')"
                    v-model="confirm_pwd"
                ></van-field>
                <van-field
                    label="验证码"
                    class="cell-block"
                    :border="false"
                    type="text"
                    v-model="verify_code"
                >
                    <template #button>
                        <van-button size="small" type="primary" id="TencentCaptcha" data-appid="2004381688" data-cbfn="callbackName" data-biz-state="data-biz-state" 
                          @click="getVerfyBtn"  >{{countTime == 60?'发送验证码':`${countTime}秒后重新获取` }}</van-button>
                        <!-- <van-button size="small" type="info" v-else>{{countTime}} 秒后重新获取</van-button>   -->
                    </template>
                </van-field>
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
        </div>
        <div class="submit-button" :class="active && 'active'" @click="submitFun">{{$t('mine_014')}}</div>
    </div>
</template>
<script>
import PageHeader from "../../components/Header";
import { updateinfo, getCaptcha, sendcode, loginDigital } from "../../api/user";
import { mapState } from "vuex";

export default {
    components: {
        PageHeader
    },
    name: "reset-pwd",
    data() {
        return {
            forgetData: {
                oldPwd: "",
                new_pwd: "",
                type: 2
            },
            confirm_pwd: "",
            verify_code: '',

            type: 3,
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
    created() {
        console.log('userInfo', this.userInfo)
        // loginDigital().then(res => {
		// 	this.num1 = res.num
		// 	this.num2 = res.num_2
		// 	this.operate = res.code == 0? 'jia' : res.code == 1? 'jian': res.code ==2?'cheng': 'cheng'
		// 	this.uuid = res.uuid
		// 	this.code_verify_v_r = res.code == 0? (res.num + res.num_2): res.code == 1? (res.num - res.num_2): res.code ==2?(res.num * res.num_2): ''
		// })
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
				console.log('callback:', res);
                if(!this.userInfo.user_key){
                    this.countTime =  60
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
            let that = this;
            var regMobile =  /^1[3456789]\d{9}$/;
            if(that.userInfo.user_key == ""){
                return that.$toast("请输入手机号");
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
                mobile:     that.userInfo.user_key,
            }
            sendcode().then(res => {
                that.settime();
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

        submitFun() {
            if (this.verifyFormData(this.forgetData)) {
                let params = {
                    type: 2,
                    wx: "",
                    old_pwd: md5(this.forgetData.oldPwd),
                    new_pwd: md5(this.forgetData.new_pwd),
                    captcha: this.verify_code,
                };
                updateinfo(params).then(res => {
                    this.$dialog
                        .confirm({
                            title: this.$t("other_008"),
                            message: this.$t("login_018"),
                            confirmButtonText: "OK",
                            showCancelButton: false
                        })
                        .then(() => {
                            this.$store.dispatch("User/logoutClearAndJump");
                            this.$router.push({ name: "login" });
                        });
                }).catch(error => {
                    this.$toast(error || error.msg);
                });
            }
        },
        verifyFormData(item) {
            const reg = /^[0-9A-Za-z]{6,20}$/;
            let result = false;
            if (!item.oldPwd) {
                this.$toast(this.$t("mine_022"));
            } else if (!item.new_pwd) {
                this.$toast(this.$t("mine_024"));
            } else if (!reg.test(item.new_pwd)) {
                this.$toast(this.$t("login_009"));
            } else if (!this.confirm_pwd) {
                this.$toast(this.$t("mine_025"));
            } else if (item.new_pwd !== this.confirm_pwd) {
                this.$toast(this.$t("login_020"));
            } else if (!this.verify_code) {
                this.$toast('请输入验证码');
            } else {
                result = true;
            }
            return result;
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
</style>
