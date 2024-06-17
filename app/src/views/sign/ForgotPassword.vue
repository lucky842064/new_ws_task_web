<template>
    <div class="forgot">
        <div class="header">
            <!-- <div class="nav">
                <div class="left-icon" @click="onClickLeft">
                    <van-icon name="arrow-left"></van-icon>
                </div>
                <div class="title">{{$t('login_021')}}</div>
                <div class="ke-fu-icon" @click="$Helper.toOutLink(kefu,1)">
                    <img src="../../assets/images/sign/login-kf.png" alt="ke-fu" />
                </div>
            </div> -->
            <div class="left_ct" @click="onClickLeft">
				<img src="../../assets/images/sign/left.png" alt @click="() => is_login = !is_login" />
			</div>
        </div>
        <div class="content-box">
            <div class="content">
                <div class="name">
					找回密码
				</div>
                <ul>
                    <!-- <p v-show="mobilebol">{{$t('login_006')}}</p> -->
                    <li style="display:flex;">
                        <span>
                            <img src="../../assets/images/sign/phone.png" alt />
                        </span>
                        <input style="flex-grow:1;" v-model="forgot_data.mobile" :placeholder="$t('login_004')" name="pattern" @blur="valid_mobile" type="text" />
                    </li>
                    <p v-show="mobilebol">{{$t('login_007')}}</p>
                    <!-- <li>
                        <span><img src="../../assets/images/sign/icon_ren.png" alt=""></span>
                        <input v-model="forgot_data.mobile" :placeholder="$t('login_004')"    name="pattern" @blur="valid_mobile" type="text">
                    </li>  
                    <p v-show='mobilebol'>{{$t('login_007')}}</p>-->
                    <!-- <li>
                        <span>
                            <img src="../../assets/images/sign/secret.png" alt />
                        </span>
                        <span id="captcha" style="width:100%;" @click="getVerfyBtn"></span>
                    </li> -->
                    <li class="verfy_code" style="display:flex;">
                        <div class="input_code">
							<img src="../../assets/images/sign/secret.png" alt />
							<input class="icon_yzm" style="flex-grow:1;" v-model="forgot_data.user_verify" :placeholder="$t('login_012')" name="pattern" @blur="valid_captcha" type="text" />
						</div>
                        <!-- <span>
                            <img src="../../assets/images/sign/secret.png" alt />
                        </span> -->
                        <!-- <input class="icon_yzm" style="flex-grow:1;" v-model="forgot_data.user_verify" :placeholder="$t('login_012')" name="pattern" @blur="valid_captcha" type="text" /> -->
                        <span id="TencentCaptcha" data-appid="2004381688" data-cbfn="callbackName" data-biz-state="data-biz-state" 
                            class="verfy_title" >{{countTime == 60?verTitle:`${countTime}秒后重新获取` }}</span>
                        <!-- <span class="verfy_title" v-show="isValidate" id="captcha"></span> -->
                        <!-- <span class="verfy_title" @click="getVerfyBtn">{{countTime == 60?verTitle:`${countTime}秒后重新获取` }}</span> -->
                    </li>
                    <!-- <p v-show="captchaBol">{{$t('login_012')}}</p> -->
                    <!-- <li class="verfy_code" style="display:flex;justify-content: space-between;">
                        <span style="display:flex;align-items:center;">
                            <img src="../../assets/images/sign/secret.png" alt />
                        </span>
                        <input style="flex:1;"  class="icon_yzm" v-model="code_verify_v" placeholder="请输入校验码" name="pattern" type="text" />
                        <div class="num_validate_ct">
							<span :class="'img_'+num1"></span>
							<span :class="'img_'+operate"></span>
							<span :class="'img_'+num2"></span>
							<span :class="'img_deng'"></span>
							<span :class="'img_wen'"></span>
						</div>
                    </li> -->
                    <li>
                        <span>
                            <img src="../../assets/images/sign/lock.png" alt />
                        </span>
                        <input v-model="forgot_data.new_pwd" :placeholder="$t('login_008')" name="pattern"  @blur="valid_pwd" :type="regEye1?'password':'text'" />
                        <i :class="[regEye1 ? 'icon_biyan': 'icon_zhenyan']" @click="eyeBol1()"></i>
                    </li>
                    <p v-show="pwdBol">{{$t('login_009')}}</p>
                    <li style="border-bottom: transparent;">
                        <span>
                            <img src="../../assets/images/sign/lock.png" alt />
                        </span>
                        <input v-model="password1" :placeholder="$t('login_010')" name="pattern" @blur="valid_pass1" :type="regEye2?'password':'text'" />
                        <i :class="[regEye2 ? 'icon_biyan': 'icon_zhenyan']" @click="eyeBol2()"></i>
                    </li>
                    <p v-show="passwordBol1">{{$t('login_010')}}</p>
                </ul>
                <!-- <van-cell-group>
                   <van-field
                           class="cell-block"
                           placeholder="请输入手机号"
                           left-icon="location-acc"
                           @blur="em_status.phone = forgot_data.mobile.length < 1"
                           @input="em_status.phone = forgot_data.mobile.length < 1"
                           :error="em_status.phone"
                           v-model="forgot_data.mobile"></van-field>
                   <div class="flex-row">
                       <van-field
                               v-model="forgot_data.captcha"
                               name="pattern"
                               :error="em_status.captcha_code"
                               left-icon="location-valid"
                               placeholder="请输入验证码"
                       />
                       <TimeCount :phone="forgot_data.mobile" type="3"/>
                   </div>
                   <van-field
                           class="cell-block"
                           :right-icon="regEye1 ? 'closed-eye': 'eye-o'"
                           :type="regEye1 ? 'password': 'text'"
                           @click-right-icon="regEye1 = !regEye1"
                           :error="em_status.pwd"
                           placeholder="请输入新密码"
                           left-icon="location-pwd"
                           v-model="forgot_data.newPwd"></van-field>
                   <van-field
                           class="cell-block"
                           :right-icon="regEye2 ? 'closed-eye': 'eye-o'"
                           :type="regEye2 ? 'password': 'text'"
                           @click-right-icon="regEye2 = !regEye2"
                           placeholder="再次确认新密码"
                           left-icon="location-pwd"
                           :error="em_status.con_pwd"
                           v-model="con_pwd"></van-field>
                </van-cell-group>-->
            </div>
            <div class="submitBtn" @click="submit">{{$t('other_005')}}</div>
        </div>
    </div>
</template>
<script>
import WebsiteSetting from "../../mixin/websiteSetting.js";
import { countrycode, allCode } from "../../common/countrycode.js";
import {encryption, decryption} from '@/utils/tool.js'

export default {
    mixins: [WebsiteSetting],
    name: "ForgotPassword",
    components: {  },
    data() {
        return {
            option1: [],
            forgot_data: {
                code: 86,
                mobile: "",
                new_pwd: "",
                captcha: "",
                user_verify: "",
            },
            regEye1: true,
            regEye2: true,
            kefu: "",
            isValidate: true,
            codeCity: "",
            password1: "",
            countTime:60,
            verTitle:"获取验证码",
            passwordBol1: false,
            mobilebol: false,
            pwdBol: false,
            captchaBol: false,

            num1 : 2,
			num2: 3,
			operate: 'jia',
			code_verify_v: '',
			uuid: '',
			code_verify_v_r: '',
            captchaIns: null,
        };
    },
    destroyed () {
        this.captchaIns = null
    },
    methods: {
        NECaptcha(){
            var that = this;
            var neWidth = document.documentElement.clientWidth >= 330 ? '288px' : document.documentElement.clientWidth - 42 + 'px';
                initNECaptcha({
                    captchaId: 'd8db14fab5d143219a496e7a48aa0db0', // 从易盾申请的验证码id
                    element: '#captcha', // 容器元素/容易元素选择器
                    mode: 'popup', // 验证码模式
                    width: neWidth, // 验证按钮宽度，推荐260px-400px
                    onVerify: function (err, data) { // 验证码验证结束回调函数
                    console.log(data);
                        if (!err) {
                            setTimeout(()=>{
                                that.verif_captcha = data.validate;
                                that.isValidate = false;
                                that.NECaptcha();
                                that.getVerfyBtn()
                            },1000)
                        }
                    }
                }, function onload(instance) { // 初始化成功后得到验证实例instance，可以调用实例的方法。
                    that.captchaIns = instance
                }, function onerror(err) {
                    console.log(err);
            })
        },
        eyeBol1() {
            this.regEye1 = !this.regEye1;
        },
        eyeBol2() {
            this.regEye2 = !this.regEye2;
        },
        inputFun(e) {
            let code = e.target.value;
            let obj = allCode.find(el => el.value.indexOf(code) > -1) || {};
            this.codeCity = obj.en;
        },
        changeCity(val) {
            this.forgot_data.code = this.option1.filter(
                item => item.name == val
            )[0].value;
        },
        ChangeVal(val) {
            this.code = val;
        },
        valid_mobile() {
            let reg = new RegExp(/^[0-9A-Za-z]*$/);
            if (!this.forgot_data.mobile /*|| !reg.test(this.forgot_data.mobile)*/) {
                // return this.$toast(`${this.$t("login_007")},${this.$t("login_005")}`);
                return this.$toast('手机号不能为空')
                // this.mobilebol = true;
            }
        },
        valid_captcha() {
            if (!this.forgot_data.user_verify) {
                return this.$toast(this.$t("login_012"));
            }
        },
        valid_pwd() {
            const regex = /^[0-9A-Za-z]{6,20}$/;
            if ( !this.forgot_data.new_pwd || !regex.test(this.forgot_data.new_pwd)) {
                return this.$toast(this.$t("login_009"));
            }
        },
        valid_pass1() {
            if (this.password1 !== this.forgot_data.new_pwd) {
                return this.$toast(this.$t("login_020"));
            }
        },
        submit() {
            let reg = new RegExp(/^[0-9]*$/);
            if (!this.forgot_data.mobile /*|| !reg.test(this.forgot_data.mobile)*/ || !this.forgot_data.code) {
               return this.$toast(`${this.$t("login_007")},${this.$t("login_005")}`);
                // return (this.mobilebol = true);
            }
            if (!this.forgot_data.user_verify) {
                return this.$toast(this.$t("login_012"));
                // return (this.captchaBol = true);
            }
            const regex = /^[0-9A-Za-z]{6,20}$/;
            if ( !this.forgot_data.new_pwd || !regex.test(this.forgot_data.new_pwd)) {
                return this.$toast(this.$t("login_009"));
                // return (this.pwdBol = true);
            }
            if (this.password1 !== this.forgot_data.new_pwd) {
                return this.$toast(this.$t("login_020"));
                // return (this.passwordBol1 = true);
            }
            let param = {
                code:86,
                captcha:this.forgot_data.user_verify,
                new_pwd:md5(this.forgot_data.new_pwd),
                mobile:this.forgot_data.mobile,
                lang:"cn",
            };
            // forgetPassword(param).then(() => {
            //     this.$toast.success(this.$t("login_018"));
            //     const timer = setTimeout(() => {
            //         this.$router.push("/login");
            //     }, 200);
            // });
        },
        onClickLeft() {
            this.$router.go(-1);
        },
        getVerfyBtn(){
            var regMobile =  /^1[3456789]\d{9}$/;
            if(this.forgot_data.mobile == ""){
                return this.$toast("请输入手机号");
            } else if(!regMobile.test(this.forgot_data.mobile)){
                return this.$toast("请输入正确的手机号");
            }
            let params = {
                type:2,
                code:86,
                verif_captcha:this.verif_captcha,
                // mobile:this.forgot_data.mobile,
                mobile: encryption(this.forgot_data.mobile),
                lang:"cn",
            }
            // getCaptcha(params).then(res => {
            //     if(res.code == undefined){
            //         this.settime();
            //     }
            // }).catch(e => {
			// 	this.countTime = 60;
			// });
        },
        settime(obj) {
            if (this.countTime == 0) {
                this.countTime = 60;
                this.isValidate = true;
                return;
            } else {
                this.countTime--;
            }
            setTimeout(() =>{this.settime() },1000);//设置定时任务，1000毫秒为1秒
        },
        // getVersion() {
        //     getVersion({}).then(res => {
        //         if (res.code == 0) {
        //             this.kefu = res.data.data.app_config.kefu+'&appid=30301&appname=蚂蚁外快'+'&ip='+res.data.data.ip+'&prov='+res.data.data.ip_local;
        //             localStorage.setItem('myip', res.data.data.ip)
        //             localStorage.setItem('mycityname', res.data.data.ip_local)
        //         }
        //     });
        // },
        callbackName(res) {
				// 返回结果
				if (res.ret === 0) {
					// 复制结果至剪切板
                    this.countTime = 60;
                    if(!this.forgot_data.mobile){
					    return this.$toast('请输入手机号')
                    }
                    let reg = new RegExp(/^1[3456789]\d{9}$/);
                    if (!this.forgot_data.mobile || !reg.test(this.forgot_data.mobile)) {
                        return this.$toast('请输入正确的手机号');
                    }
					let params = {
						// digital: Number(this.code_verify_v),
						// uuid: this.uuid,
						type: 2,
						code: 86,
						mobile: encryption(this.forgot_data.mobile),
						lang: '',//'cn',
						rand_str: res.randstr,
                        ticket: res.ticket
					};
					// getCaptcha(params).then(res => {
					// 	this.settime();
					// }).catch(e => {
					// 	this.countTime = 60;
					// })
				}
		}
    },
     
    created() {
        this.option1 = [];
        countrycode.map(item => {
            let obj = {
                value: item.value,
                name: item.en
            };
            this.option1.push(obj);
        });
        this.getVersion();
        this.forgot_data.code = this.option1[0].value;
        this.codeCity = this.option1[0].name;

        // loginDigital().then(res => {
		// 	this.num1 = res.num
		// 	this.num2 = res.num_2
		// 	this.operate = res.code == 0? 'jia' : res.code == 1? 'jian': res.code ==2?'cheng': 'cheng'
		// 	this.uuid = res.uuid
		// 	this.code_verify_v_r = res.code == 0? (res.num + res.num_2): res.code == 1? (res.num - res.num_2): res.code ==2?(res.num * res.num_2): ''
		// })
    },
    mounted() {
        this.$nextTick(() => {
            // this.NECaptcha();
            window.callbackName = this.callbackName
            window.TencentCaptcha && (
                new window.TencentCaptcha(document.querySelector('#TencentCaptcha'), '2004381688', this.callbackName, {type: 'embed'})
            )
        })
    }
};
</script>
<style>
    .yidun_intellisense--light{
        width: 100%;
        /* border-radius: 12px; */
        /* height: 44px; */
    }
    .yidun_intellisense--light .yidun_intelli-control{
        height: 88px !important;
        border: none !important;
        line-height: 88px !important;
        border-radius: 12px !important;
        text-align: center;
    }
</style>
<style lang="scss" scoped>
[class*="van-hairline"]::after {
    border: none;
}
.forgot {
    height: 100vh;
    background: url('../../assets/images/login_bg.png') no-repeat;
	background-size: 100% 100%;
    .header {
        // height: 92px;
        // display: flex;align-items:center;justify-content:space-between;
        padding: 0 30px;
        .left_ct{
			height: 88px;display: flex;align-items: center;margin-bottom: 92px;
			>img{
				width: 18px;
			}
		}
		.name{font-size: 48px;color: #141414;font-weight: bold;margin-bottom: 64px;}
    }
    .content-box {
        .content {
            // padding: 0.6rem;
            // background-color: #FFFFFF;
            // box-shadow: 0 4px 12px 0 rgba(0,0,0,0.05);
            // border-radius: 20px;
            margin: 0 48px;border-radius: 20px;
            .name{font-size: 48px;color: #141414;font-weight: bold;margin-bottom: 64px;}
            .flex-row {
                display: flex;
                align-items: flex-end;
                // border-bottom: 1px solid #eeeeee;
                .van-cell {
                    margin-bottom: 0;
                    overflow: auto;
                }
            }
            ul {
                overflow: hidden;
                li {
                    // border-bottom: 1px solid #E7E7E7;
                    height: 105px;
                    border-radius: 12px;
					display: flex;
                    align-items: center;
                    padding: 0 22px;
					height: 88px;
                    box-sizing: border-box;
                    background-color: #F6F6F6;
                    margin-bottom: 32px;
					&:nth-last-child(1){
						border-bottom: transparent;margin-bottom: 56px;
					}
                    input {
                        background: transparent !important;border: transparent;outline: none;
                        font-size: 28px;color: #CDCDCD;padding-left: 25px;flex-grow: 1;
                    }

                    width: 100%;
                    float: left;
                    // margin-top: 0.4rem;
                    position: relative;
                    display: flex;align-items:center;
                    
                    span {
                        float: left;
                        img {
                            display: block;width:22px;
                        }
                    }

                    input {
                        background-color: #fff;
                        padding-left: 0.3rem;
                        border: none;
                        margin: 0;
                        outline: none;
                        font-size: 28px;
                        float: left;
                        flex: 1;
                        color:#626262;
                    }
                    .phone {
                        width: 3rem;
                        padding-left: 0.2rem !important;
                    }
                    .icon_yzm {
                        // width: 4rem;
                    }
                    i {
                        position: absolute;
                        top: 0.35rem;
                        right: 0.35rem;
                    }
                    .icon_biyan {
                        height: 0.17rem;
                        width: 0.33rem;
                        right: 0.38rem;
                        background: url("../../assets/images/sign/icon_biyan.png")
                            no-repeat;
                        background-size: 100% 100% !important;
                    }
                    .icon_zhenyan {
                        height: 0.2rem;
                        width: 0.4rem;
                        right: 0.35rem;
                        background: url("../../assets/images/sign/icon_zhenyan.png")
                            no-repeat;
                        background-size: 100% 100% !important;
                    }
                    .select {
                        position: absolute;
                        left: 0.45rem;
                        /* top: 0.15rem; */
                        width: 3rem;
                        height: 0.86rem;
                        opacity: 0;
                    }
                    .ccode {
                        position: relative;
                        width: 3rem;
                        height: 0.86rem;
                        float: left;
                        input {
                            width: 3rem;
                            float: left;
                            border-right: 0.01rem solid #ccc;
                            font-size: 0.3rem;
                            height: 0.86rem;
                            border: 0;
                            position: relative;
                        }
                        .iconX {
                            width: 0.2rem;
                            height: 0.13rem;
                            background: url("../../assets/images/sign/iconX.png") no-repeat;
                            background-size: 100% 100%;
                            top: 0.2rem;
                            right: 0;
                        }
                    }
                }
                p{
                    color: red;
                    font-size: 0.3rem;
                    line-height: 0.5rem;
                }
                .verfy_code{
					display: flex;
					padding: 0;
					border-radius: 12px;
					align-items: center;
					height: 88px;
                    background-color: transparent;
					.input_code{
                        display: flex;
						flex-grow: 1;
						height: 100%;
                        align-items: center;
						border-radius: 12px;
						padding-left: 22px;
						box-sizing: border-box;
						background-color: #F6F6F6;
						>img{width: 23px;height: auto;}
						&:nth-last-child(1){
							border-bottom: transparent;
							margin-bottom: 56px;
						}
					}
					.verfy_title{
						width: 284px;
                        height: 100%;
						flex-grow: 0;
						display: flex;
						color: #fff;
						border-radius: 12px;
						justify-content: center;
						align-items: center;
						background-color: #F52C2C;
						font-size: 24px;
						margin-left: 8px;
					}
				}
                .loginTip {
                    text-align: center;
                    font-size: 0.3125rem;
                    color: #717171;
                    margin-top: 0.5rem;
                    span {
                        color: red;
                    }
                }
            }
        }
        .submitBtn {
            margin: 24px 48px 0 48px;
            height: 88px;text-align: center;
            line-height: 88px;
            background: $home-bind-button;
            border: none;
            border-radius: 50px;
            font-weight: 500;
            font-size: 34px;
            color: #ffffff;
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
    .van-cell {
        padding: 10px 0;
        margin: 10px 0;
    }
    .van-cell:not(:last-child)::after {
        border-bottom: 1px solid #eeeeee;
        left: 1px;
    }
    .van-icon-arrow-left{
        color: #fff;font-size: .38rem;
    }
}
</style>
