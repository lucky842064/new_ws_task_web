<template>
	<div class="login">
		<div class="LanguageSwitcher" @click="$Helper.toOutLink(kefu,1)">
            <img src="../../assets/images/sign/login-kf.png" alt="register" />
        </div>
		<!-- <div class="head_bg"></div> -->
		<div class="body">
			<div class="sign_login sign_login1" v-if="is_login">
				<div class="logo_img">
					<img src='../../assets/images/lanniao.png'>
				</div>
				<div class="uilist">
					<div class="uilist_div account">
						<img src="../../assets/images/sign/phone.png" alt />
						<input v-model="username" :placeholder="$t('login_004')" :maxlength="11" name="pattern" type="text" />
					</div>
					<div class="uilist_div pwd">
						<img src="../../assets/images/sign/lock.png" alt />
						<input v-model="password" :placeholder="$t('login_008')" :maxlength="20" name="pattern" :type="regEye ? 'password' : 'text'" />
						<i :class="[regEye ? 'icon_biyan' : 'icon_zhenyan']" @click="eyeBol()"></i>
					</div>
				</div>
				<p class="login_btn">
					<a @click="onSubmit">{{ $t('login_001') }}</a>
				</p>
				<p class="register_btn">
					<a @click="isLoginFunc">{{ $t('login_002') }}</a><span></span>
					<a @click="forgetFunc">{{ $t('login_021') }}</a>
				</p>
			</div>
			<div class="sign_login sign_login2" v-else>
				<div class="uilist">
					<div class="left_ct">
						<div class="back_icon">
							<img src="../../assets/images/sign/left.png" alt @click="() => is_login = !is_login" />
						</div>
						<div class="serve_area" @click="isDialong=true">
							<img src="../../assets/images/ms_serve.png" alt="" srcset="">
							<span>{{ $t('mine_040') }}</span>
						</div>
					</div>
					<div class="logo_img">
						<img src='../../assets/images/lanniao.png'>
					</div>
					<div class="uilist_div account">
						<img src="../../assets/images/sign/phone.png" alt />
						<input v-model="mobile" :placeholder="$t('login_004')" name="pattern" type="text" />
					</div>
					<div class="uilist_div pwd">
						<img src="../../assets/images/sign/lock.png" alt />
						<input v-model="pwd" :placeholder="$t('login_008')" name="pattern" :type="regEye1 ? 'password' : 'text'" />
						<i :class="[regEye1 ? 'icon_biyan' : 'icon_zhenyan']" @click="eyeBol1()"></i>
					</div>
					<div class="uilist_div pwd">
						<img src="../../assets/images/sign/lock.png" alt />
						<input v-model="password1" :placeholder="$t('login_010')" name="pattern" :type="regEye2 ? 'password' : 'text'" />
						<i :class="[regEye2 ? 'icon_biyan' : 'icon_zhenyan']" @click="eyeBol2()"></i>
					</div>
					<div class="uilist_div pwd">
						<img src="../../assets/images/sign/tuiguang.png" alt />
						<input style="flex-grow:1;" v-model="user_code" :placeholder="$t('login_011')" autocomplete="off" name="pattern" type="text" :disabled="!!code_location" />
					</div>
					<div class="uilist_div verfy_code">
						<div class="input_code">
							<img src="../../assets/images/sign/secret.png" alt />
							<input style="flex-grow:1;" v-model="user_verify" @blur="valid_captcha" :placeholder="$t('login_012')" autocomplete="off" name="pattern" type="text" :disabled="!!code_location" />
						</div>
						<span id="TencentCaptcha" data-appid="2004381688" data-cbfn="callbackName" data-biz-state="data-biz-state"
        				type="button" class="verfy_title" >{{countTime == 60?verTitle:`${countTime}秒后重新获取` }}</span>
					</div>
				</div>
				<!-- 注册 -->
				<p class="btn">
					<a @click="Subregister()">{{ $t('login_002') }}</a>
				</p>
				<p class="register_btn">
					已有账号？<a @click="() => is_login = !is_login" class="register_text">{{ $t('login_015') }}>></a>
				</p>
			</div>
		</div>
		<i id="verify_ct"></i>
		<popDialog :showModel="isDialong" @closeBtn="closeDialong"></popDialog>
	</div>
</template>
<script>
import { getVersion, getCaptcha, loginDigital } from '../../api/user';
import WebsiteSetting from '../../mixin/websiteSetting.js';
import Global from '../../core/Global';
import {parseParam} from '../../utils/tool'
import popDialog from "@/components/serveDialog";
import {encryption, decryption} from '@/utils/tool.js'

export default {
	mixins: [WebsiteSetting],
	components: {popDialog},
	data() {
		return {
			msg: '',
			wk_name: '',
			stateSetp:0,
			isDialong: false,
			sendState:false,
			logoImg: require('../../assets/images/' + process.env.VUE_APP_FLAG + '.png'),
			code_location: false,
			pattern: /\d{6}/,
			is_login: true,
			username: '',
			password: '',
			isValidate: true,
			isAndroid: false,
			isIOS: false,
			regEye: true,
			regEye1: true,
			regEye2: true,
			usernamebol: false,
			passwordbol: false,
			mobilebol: false,
			mobile: '',
			user_code: '',
			user_verify: '',
			verif_captcha: '',
			user_codeBol: false,
			password1: '',
			passwordBol1: false,
			pwd: '',
			pwdBol: false,
			language: 'cn',
			autologin: false,
			device: '',
			mac: '',
			kefu: '',
			version: '',
			gr: '',
			gv: '',
			langArr: [
				{ text: 'zh', value: 'zh' },
				{ text: 'en', value: 'en' },
				{ text: 'th', value: 'th' },
			],
			verTitle: '获取验证码',
			countTime: 60,
			qrcodeImg: {
				show: false,
				url: '',
			},
			num1 : 2,
			num2: 3,
			operate: 'jia',
			code_verify_v: '',
			uuid: '',
			code_verify_v_r: '',
			captchaIns: null
		}
	},
	methods: {
		closeDialong(){
            this.isDialong=false;
        },
		NECaptcha(){
            var that = this;
            var neWidth = document.documentElement.clientWidth >= 330 ? '288px' : document.documentElement.clientWidth - 42 + 'px';
                initNECaptcha({
                    captchaId: 'd8db14fab5d143219a496e7a48aa0db0',
                    element: '#captcha',
                    mode: 'popup',
                    width: neWidth,
                    onVerify: function (err, data) {
                        if (!err) {
                            setTimeout(()=>{
                                that.verif_captcha = data.validate;
                                that.isValidate = false;
                                // that.NECaptcha();
                                that.getVerfyBtn()
                            },1000)
                        }
                    }
                }, function onload(instance) {
                    that.captchaIns = instance
                }, function onerror(err) {
                    console.log(err);
            })
        },
		getVerfyBtn() {
			if(!this.mobile){
				this.$toast('请收入手机号')
			}
			var regMobile = new RegExp(/^1[3456789]\d{9}$/);
			if (this.mobile == '') {
				return this.$toast('请输入手机号');
			} else if (!regMobile.test(this.mobile)) {
				return this.$toast('请输入正确的手机号');
			}
			let params = {
                type:1,
                code:86,
				lang:"cn",
                mobile:encryption(this.mobile),
				user_code: String(this.user_code),
            }
			getCaptcha(params).then(res => {
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
			setTimeout(() => {
				this.settime();
			}, 1000); //设置定时任务，1000毫秒为1秒
		},
		getUrlCode(data) {
			let obj = data;
			try {
				obj = JSON.parse(data);
			} catch (error) {}
			if (obj.version) {
				this.version = obj.version;
				Global.Setting.storage.set('version', this.version);
			}
			if (obj.device) {
				this.device = obj.device;
			}
			if (obj.mac) {
				this.mac = obj.mac;
			}
			let code = obj.code || "";
			code = code.replace(/\|/gi, '&');
			code = code.replace(/\?/gi, '&');
			let arr = code.split('&');
			let find = arr.find(el => el.includes('code=')) || '';
			code = find.replace('code=', '');
			if (code) {
				this.updateCode(code);
			}
		},
		getCode() {
			if (Global.Setting.SystemInfo.version) {
				this.getUrlCode(Global.Setting.SystemInfo);
			} else {
				if (this.$Helper.isAndroid()) {
					window.getUrlCode = this.getUrlCode;
					// window.location.href = "getCode://xxx.com";
				} else {
					if (location.search) {
						let str = location.search.replace('?', '');
						let arr = str.split('&');
						let find = arr.find(el => el.includes('code=')) || '';
						let code = find.replace('code=', '');
						this.updateCode(code);
					}
					if (this.$route.query.code) {
						let code = this.$route.query.code;
						this.updateCode(code);
					}
				}
			}
		},
		updateCode(code) {
			this.user_code = (code);
		},

		valid_captcha() {
			if (!this.user_verify) {
				this.captchaBol = true;
			} else {
				this.captchaBol = false;
			}
		},
		valid_pass() {
			const regex = /^[0-9A-Za-z]{6,20}$/;
			if (!this.password || !regex.test(this.password)) {
				return this.$toast(this.$t('login_007'));
			}
		},
		valid_phone() {
			let reg = new RegExp(/^1[3456789]\d{9}$/);
			if (!this.username || !reg.test(this.username)) {
				return this.$toast(this.$t('login_009'));
			}
		},
		eyeBol() {
			this.regEye = !this.regEye;
		},
		eyeBol1() {
			this.regEye1 = !this.regEye1;
		},
		eyeBol2() {
			this.regEye2 = !this.regEye2;
		},
		isLoginFunc() {
			this.username = '';
			this.password = '';
			this.usernamebol = false;
			this.passwordbol = false;
			this.is_login = false;
			// this.$nextTick(() => {
			// 	this.NECaptcha();
			// });
			setTimeout(() => {
				window.callbackName = this.callbackName
				window.TencentCaptcha && (
					new window.TencentCaptcha(document.querySelector('#TencentCaptcha'), '2004381688', this.callbackName, {type: 'embed'})
				)
			}, 10);

			// loginDigital().then(res => {
			// 		this.num1 = res.num
			// 		this.num2 = res.num_2
			// 		this.operate = res.code == 0? 'jia' : res.code == 1? 'jian': res.code ==2?'cheng': 'cheng'
			// 		this.uuid = res.uuid
			// 		this.code_verify_v_r = res.code == 0? (res.num + res.num_2): res.code == 1? (res.num - res.num_2): res.code ==2?(res.num * res.num_2): ''
			// 	})
		},
		isregisterFunc() {
			this.username = '';
			this.password = '';
			this.usernamebol = false;
			this.passwordbol = false;
			this.userAccount();
			this.is_login = true;
		},
		//登录
		onSubmit() {
			let reg = new RegExp(/^1[3456789]\d{9}$/);
			if (!this.username /*|| !reg.test(this.username)*/) {
				// return this.$toast(this.$t('login_007'));
				return this.$toast('手机号不能为空！')
			}
			const regex = /^[0-9A-Za-z]{6,20}$/;
			if (!this.password || !regex.test(this.password)) {
				return this.$toast(this.$t('login_009'));
			}
			let params = {
				code: 86,
				mobile: this.username,
				pwd: md5(this.password),
				autologin: this.autologin,
				lang: '17691235264',
				device: this.device,
				mac: this.mac
			};
			const Toast = this.$toast.loading({
				duration: 3000,
				message: this.$t('login_013'),
				forbidClick: true,
				loadingType: 'spinner',
			});
			this.$store.dispatch('User/userLogin', params).then(respon => {
				// this.checkChange();
				Toast.clear();
				try {
					if (this.$Helper.isAndroid()) {
						JSInterface.onLoginin();
					} else if (this.$Helper.isIos()) {
						let params = { method: 'onLoginin' };
						window.webkit.messageHandlers.jsCallNativeMethod.postMessage(params);
					}
				} catch (e) {}
				this.$router.push('/home');
			}).catch(error => {
				if (window.location.host == 'fcwk.dpqcblzs.com' || window.location.host == 'fcwk.hnjsjzdl.com' || window.location.host == 'www.mifengxj.com') {
					this.qrcodeImg.show = true;
				}
				Toast.clear();
			});
		},
		locacionData() {
			getVersion({}).then(res => {
				let server = res;
				localStorage.setItem('myip', server.ip);
				localStorage.setItem('mycityname', server.ip_local);
				this.kefu = server.app_config.kefu + '&appid=30301&ostype=devtype&appname=' + this.wk_name + '&ip=' + server.ip + '&prov=' + server.ip_local;
			});
		},
		//注册
		Subregister() {
			let reg = new RegExp(/^1[3456789]\d{9}$/);
			if (!this.mobile || !reg.test(this.mobile)) {
				return this.$toast(this.$t('login_007'));
			}
			let regex = /^[0-9A-Za-z]{6,20}$/;
			if (!this.pwd || !regex.test(this.pwd)) {
				return this.$toast(this.$t('login_009'));
			}
			if (this.password1 !== this.pwd) {
				return this.$toast(this.$t('login_020'));
			}
			if (!this.user_verify) {
				return this.$toast(this.$t('buy_025'));
			}
			this.getmsg();
			if (this.user_code.length > 10) {
				if (this.user_code.indexOf('user_code') > -1) {
					this.user_code = this.user_code.split('=').pop().split('|').shift();
				}
			}
			let params = {
				code: 86,
				captcha: this.user_verify,
				mobile: this.mobile,
				pwd: md5(this.pwd),
				user_code: String(this.user_code),
				autologin: this.autologin,
				lang: '',//this.language,
				device: this.device,
				mac: this.mac,
				gr: this.gr,
				gv: this.gv,
				os: this.$Helper.isAndroid() || this.$Helper.judgeClient() == 'Android' ? 2 : this.$Helper.isIos() || this.$Helper.judgeClient() == 'ios' ? 3 : 1,
				w: window.screen.width,
				h: window.screen.height,
			};
			const Toast = this.$toast.loading({
				duration: 3000,
				message: this.$t('login_013'),
				forbidClick: true,
				loadingType: 'spinner',
			});
			this.$store.dispatch('User/userRegister', params).then(() => {
				Toast.clear();
				let nnobj = { mobile: this.mobile, pwd: this.pwd, autologin: 0 };
				this.$router.replace('/home');
				try {
					if (this.$Helper.isAndroid()) {
						JSInterface.onLoginin();
					} else if (this.$Helper.isIos()) {
						let params = { method: 'onLoginin' };
						window.webkit.messageHandlers.jsCallNativeMethod.postMessage(params);
					}
				} catch (e) {}
            }).catch(() => {
              this.loading = false;
            });
		},

		// 忘记密码
		forgetFunc() {
			this.$router.push('/forgot-password');
		},

		checkChange() {
			var storage = window.localStorage;
			if (this.autologin == true) {
				storage['loginphone'] = this.username;
				storage['loginpwd'] = this.password;
				storage['isstorename'] = 'yes';
			} else {
				storage['loginphone'] = this.username;
				storage['loginname'] = this.password;
				storage['isstorename'] = 'no';
			}
		},
		userAccount() {
			var storage = window.localStorage;
			if (storage['isstorename'] == 'yes') {
				this.autologin = true;
				this.username = storage['loginphone'];
				this.password = storage['loginpwd'];
				this.onSubmit();
			} else {
				this.autologin = false;
				this.username = storage['loginphone'];
				this.password = storage['loginpwd'];
			}
		},
		getmsg() {
			this.gr = '';
			this.gv = '';
			var cvs = document.createElement('canvas');
			if (cvs && 'function' == typeof cvs.getContext) {
				var strArr = ['webgl', 'webgl2', 'experimental-webgl2', 'experimental-webgl'];
				for (var ii = 0; ii < strArr.length; ii++) {
					var str = strArr[ii];
					var ctx = cvs.getContext(str);
					if (ctx) {
						this.gv = ctx.getParameter(ctx.VERSION);
						var ext = ctx.getExtension('WEBGL_debug_renderer_info');
						if (ext) {
							this.gr = ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL);
						}
					}
				}
			}
		},
		callbackName(res) {
			// 返回结果
			// ret         Int       验证结果，0：验证成功。2：用户主动关闭验证码。
			// ticket      String    验证成功的票据，当且仅当 ret = 0 时 ticket 有值。
			// CaptchaAppId       String    验证码应用ID。
			// bizState    Any       自定义透传参数。
			// randstr     String    本次验证的随机串，请求后台接口时需带上。
			setTimeout(() => this.countTime = 60, 10)
			if(!this.mobile){
				return this.$toast('请输入手机号')
			}
			let reg = new RegExp(/^1[3456789]\d{9}$/);
			if (!this.mobile || !reg.test(this.mobile)) {
				return this.$toast('请输入正确的手机号');
			} else if (this.user_code == '') {
				return this.$toast('请输入邀请码');
			}
			// res（用户主动关闭验证码）= {ret: 2, ticket: null}
			// res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
			// res（客户端出现异常错误 仍返回可用票据） = {ret: 0, ticket: "String", randstr: "String",  errorCode: Number, errorMessage: "String"}
			if (res.ret === 0) {
				// 复制结果至剪切板
				// let str = `【randstr】->【${res.randstr}】      【ticket】->【${res.ticket}】`;
				// let ipt = document.createElement('input');
				// ipt.value = str;
				// document.body.appendChild(ipt);
				// ipt.select();
				// document.execCommand("Copy");
				// document.body.removeChild(ipt);
				let params = {
					// digital: Number(this.code_verify_v),
					// uuid: this.uuid,
					type: 1,
					code: 86,
					mobile: encryption(this.mobile),
					lang: '',//'cn',
					rand_str: res.randstr,
					ticket: res.ticket
				};
				getCaptcha(params).then(res => {
						this.settime();
				}).catch(e => {
					this.countTime = 60;
				});
			}
		}
	},
	created() {
		if(window.location.href.indexOf('=') >-1){
			this.is_login = false;
			// let pp = 'https://jz427.com/?r=tljqiu/register#/login'
			this.user_code = window.location.href.split("=").pop().split("#").shift();
			setTimeout(() => {
				window.callbackName = this.callbackName
				window.TencentCaptcha && (
					new window.TencentCaptcha(document.querySelector('#TencentCaptcha'), '2004381688', this.callbackName, {type: 'embed'})
				)
			}, 10);
		}else{
			const obj = parseParam()
			if(obj['code']){
				this.is_login = false;
				this.user_code = obj['code']
			}
			this.wk_name = process.env.VUE_APP_NAME;
			this.locacionData();
			if (this.$Helper.openInWebview()) {
				this.getCode();
			}
		}
		// this.userAccount();
	},
	mounted() {
		this.$nextTick(() => {
			if (Global.Setting.SystemInfo.version) {
				setTimeout(() => {
					Global.NativeEvent.hideSplashView();
				}, 500);
			} else {
				this.version = '10004';
			}
		});
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
.login {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	position: relative;
	min-height: 100vh;
	// background: url('../../assets/images/login_bg.png') no-repeat;
	background-size: 100% 100%;
	.auto_login {
		font-size: 20px;
		color: #717171;
		display: flex;
		align-items: center;
	}
	.kefu {
		position: absolute;
		right: 48px;
		top: 48px;
		width: 0.8rem;
	}
	.logo_img {
		display: block;
		width: 168px;
		// height: 213px;
		margin: 0 auto;
		margin-bottom: 100px;
		position: relative;z-index: 1;
	}
	.body {
		// padding-top: 80px;
		position: relative;z-index: 1;
		margin: 0 48px;
		input {
			background: transparent !important;border: transparent;outline: none;
			font-size: 28px;color: #626262;padding-left: 25px;flex-grow: 1;
		}
		.sign_login1{
			padding-top: 148px;
		}
		.sign_login {
			position: relative;
			z-index: 2;
			.left_ct{
				width: 100%;
				height: 88px;
				display: flex;
				align-items: center;
				.back_icon{
					flex: 1;
					img{
						width: 18px;
					}
				}
				.serve_area{
					display: flex;
					align-items: center;
					img{
						width: 32px;
						height: 40px;
						margin-right: 8px;
					}
					span{
						color: #F52C2C;
						font-size: 28px;
						font-weight: 600;
					}
				}
			}
			.name{font-size: 48px;color: #141414;font-weight: bold;margin-bottom: 64px;}
			.uilist {
				overflow: hidden;
				.uilist_div, .verfy_code, .visit_code{
					// border-bottom: 1px solid #E7E7E7;
					display: flex;
					border-radius: 12px;
					align-items: center;
					padding: 0 22px;
					height: 88px;
					box-sizing: border-box;
					background-color: #F6F6F6;
					margin-bottom: 32px;
					>img{width: 23px;height: auto;}
					&:nth-last-child(1){
						border-bottom: transparent;
						margin-bottom: 56px;
					}
				}
				.verfy_code, .visit_code{
					display: flex;
					padding: 0;
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
						display: flex;
						width: 254px;
						height: 100%;
						flex-grow: 0;
						color: #fff;
						border: none;
						border-radius: 12px;
						justify-content: center;
						align-items: center;
						background-color: #F52C2C;
						font-size: 24px;
						margin-left: 8px;
					}
				}
				.visit_code{
					background-color: #F6F6F6;
					.verfy_title{
						width: 240px;
						height: 56px;
						border-radius: 27px;
						margin-right: 16px;
					}
				}
			}
			.forget_ct{
				display: flex;justify-content: space-between;margin-bottom: 92px;
				span{
					color: $color-theme;font-size: 26px;
				}
			}
			.fotpas {
				display: flex;
				line-height: 0.5rem;
				margin-top: 20px;
				a {
					flex: 1;
					font-size: 0.24rem;
					color: rgb(113, 113, 113);
				}
				a:nth-child(2) {
					color: #1073b8;
					text-align: center;
					img {
						width: 32px;
						display: inline-block;
						vertical-align: middle;
						margin-left: 10px;
						margin-top: -10px;
					}
				}
				a:nth-child(3) {
					text-align: right;
					padding-right: 10px;
				}
			}
			.tip{font-size: 12px;margin-top: .8rem;text-align: center;}
		}
		// .sign_login2{
		// 	.uilist{
		// 		margin-bottom: 86px;
		// 	}
		// }
		.btn,
		.login_btn,
		.login_btn,
		.tourist_btn {
			margin-bottom: 45px;
			// height: 0.89rem;
			a {
				display: inline-block;
				width: 100%;
				line-height: 88px;
				border-radius: 50px;
				height: 88px;
				font-size: 34px;
				color: #FFFFFF;
				text-align: center;
				background: $home-bind-button;
			}
			a:nth-child(2) {
				background: #fff;
				margin-top: 0.6rem;
				border: 1px solid #1073b8;
				color: #1073b8;
			}
		}
		.register_btn{
			text-align: center;display:flex;align-items:center;justify-content:center;
			font-size: 24px;font-weight:bold;
			span{
				margin: 0 24px;display: inline-block;width: 2px;
				height: 23px;background: #D7D7D7;
			}
			a {
				// display: inline-block;
				// border: 2px solid $color-theme;
				// width: 100%;
				// line-height: 100px;
				// border-radius: 50px;
				// height: 100px;
				font-size: 24px;
				color: #000;
				font-weight: bold;
				// color: $color-theme;
				// text-align: center;
				// background-color: #F6F6F6;
			}
			.register_text{
				color: $home-bind-button;
			}
		}
		.tourist_btn a {
			color: $color-theme;
			margin-top: 23px;
			border: 1px solid $color-theme;
			background-color: #fff !important;
		}
	}
}

::-webkit-input-placeholder {
	color: #a7a7a7;
}
:-moz-placeholder {
	/* Firefox 18- */
	color: #a7a7a7;
}
::-moz-placeholder {
	/* Firefox 19+ */
	color: #a7a7a7;
}
:-ms-input-placeholder {
	color: #a7a7a7;
}
.LanguageSwitcher {
	position: fixed;
	right: 48px;
	top: 16px;
	display: flex;
	font-size: 20px;
	line-height: 30px;
	z-index: 3000;
	display: flex;
	align-items: center;
	img {
		width: 0.62rem;
		height: 0.6rem;
	}
}
::v-deep {
	.van-ellipsis {
		padding-right: 0.1rem;
	}
	.van-dropdown-menu__title::after {
		right: 2px !important;
	}
	// .van-checkbox__icon--checked .van-icon {
	// 	background-color: #1073b8;
	// 	border-color: #1073b8;
	// }
	.van-dropdown-menu__bar {
		box-shadow: none;
	}
	.van-icon{
		border-color: $color-theme;
	}
	.van-checkbox__icon--checked .van-icon{
		background-color: $color-theme;
		border-color: $color-theme;
	}
}

.verson_content,
.verson_server {
	width: 100%;
	text-align: center;
	color: #c8c9cc;
	padding: 60px 0;
	font-size: 28px;
	// position: absolute;
	right: 0;
	bottom: 0;
	z-index: 1;
	box-sizing: border-box;
	.customer-icon{
		width: 55px;
	}
	p{
		color:#2D2D2D;font-size: 28px;
	}
}
.verson_content{
	padding-top: 265px;
	.top{
		display: flex;align-items: center;justify-content: center;margin-bottom: 48px;
		.line{
			width: 152px;height: 1px;background: #D8D8D8;display: inline-block;
		}
		i{
			font-style: normal;color: #A7A7A7;font-size: 24px;margin: 0 6px;
		}
	}
}
.verson_server {
	bottom: 60px;
	text-align: center;
	color: #1073b8;
}
.server_content {
	width: 140px;
	margin: 0 auto;
}
.verson_server span {
	float: left;
}
.verson_server img {
	width: 32px;
	height: 30px;
	float: left;
	margin: 2px 0 0 10px;
	// display: table-cell;
	// vertical-align: middle;
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
</style>
