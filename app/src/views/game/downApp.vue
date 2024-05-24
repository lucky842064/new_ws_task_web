<template>
  <div class="what_app" id="dialogue_box"> 
      <div class="down_main">
        <div class="item-01">
          <p>请务必复制您的<span>邀请码</span>，才能开始赚钱哦～</p>
          <p>{{message}}</p>
          <p>
            <van-button v-clipboard:copy="message" v-clipboard:success="copySuccess">
              <img src="../../assets/images/mine/copay_icon.png" alt="" srcset="">
            </van-button>
          </p>
        </div>
        <div class="network_jum">
          <van-button class="down_01" @click="showRegister">立即注册</van-button>
          <van-button class="down_02" v-clipboard:copy="androidMes" v-clipboard:success="">下载APP</van-button>
        </div>
        <div class="use_tips">
            <img src="../../assets/images/mine/iphone_icon.png" alt="" srcset="">
            <span>查看苹果系统安装教程</span>
        </div>
      </div>
      <van-overlay :show="showModel">
        <div class="wrapper_pop">
          <div class="sign_login">
            <div class="uilist">
              <div class="logo_img">
                <img src='../../assets/images/lanniao.png'>
              </div>
              <div class="uilist_div account">
                <img src="../../assets/images/sign/phone.png" alt />
                <input v-model="user_account" :placeholder="$t('login_004')" autocomplete="off" type="tel" />
              </div>
              <div class="uilist_div">
                <img src="../../assets/images/sign/lock.png" alt />
                <input v-model="pwd" :placeholder="$t('login_008')" autocomplete="off" :type="regEye1 ? 'password' : 'text'" />
                <i :class="[regEye1 ? 'icon_biyan' : 'icon_zhenyan']" @click="eyeBol1()"></i>
              </div>
              <div class="uilist_div">
                <img src="../../assets/images/sign/lock.png" alt />
                <input v-model="password1" :placeholder="$t('login_010')" :type="regEye2 ? 'password' : 'text'" />
                <i :class="[regEye2 ? 'icon_biyan' : 'icon_zhenyan']" @click="eyeBol2()"></i>
              </div>
              <div class="uilist_div">
                  <img src="../../assets/images/sign/tuiguang.png" alt />
                  <input style="flex-grow:1;" v-model="user_code" :placeholder="$t('login_011')" autocomplete="off" type="text" />
              </div>
              <div class="uilist_div verfy_code">
                <div class="input_code">
                  <img src="../../assets/images/sign/secret.png" alt />
                  <input style="flex-grow:1;" v-model="user_verify" @blur="valid_captcha" :placeholder="$t('login_012')" autocomplete="off" type="text"/>
                </div>
                <span id="TencentCaptcha" data-appid="2004381688" data-cbfn="callbackName" data-biz-state="data-biz-state" type="button" class="verfy_title" >{{countTime == 60?verTitle:`${countTime}秒后重新获取` }}</span>
              </div>
            </div>
            <p class="btn">
              <a @click="Subregister">{{ $t('login_002') }}</a>
            </p>
            <div class="use_tips pop_tips">
                <img class="pop_img" src="../../assets/images/serveImg.png" alt="" srcset="">
                <span>联系客服</span>
            </div>
          </div>
        </div>
      </van-overlay> 
  </div>
</template>
<script>
import { Toast,Button,Popup,Overlay } from 'vant';
// import {formatTime} from "@/utils/tools.js"
import jumpUrl from "@/utils/helper"
// import hex_md5 from '@/utils/md5.js'
export default {
  name: "App",
  components: {
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Overlay.name]: Overlay
  },
  data() {
    return {
      showModel:false,
      regEye1: true,
			regEye2: true,
      user_verify:"",
      user_code:"", 
      password1:"", 
      pwd:"", 
      user_account:"",
      countTime:60,
      verTitle: '点击获取验证码',
      message:"7608",
      androidMes:"",
      device: '',
			mac: '',
			kefu: '',
			version: '',
			gr: '',
			gv: ''
    }
  },
  mounted(){
    // console.log(jumpUrl.judgeClient());
  },
  created(){
    this.getCode();
    if(window.location.search.indexOf('=') >-1){
      this.message = window.location.search.split("=").pop();
    //   this.androidMes = '|'+hex_md5('https://jianzhi434.com/'+this.message+'10000')+'|'+"https://jianzhi434.com/"+'|'+this.message+'|'+'10000'+'|'+formatTime()
    }
  },
  methods: {
    showRegister(){
      this.showModel=true;
      this.$nextTick(()=>{
        window.callbackName = this.callbackName
				window.TencentCaptcha && (
					new window.TencentCaptcha(document.querySelector('#TencentCaptcha'), '2004381688', this.callbackName, {type: 'embed'})
				)
      })
    },
    copySuccess(){
      Toast("复制成功");
    },
    //注册
		Subregister() {
			let reg = new RegExp(/^1[3456789]\d{9}$/);
			if (!this.user_account || !reg.test(this.user_account)) {
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
        lang: '',
				code: 86,
				captcha: this.user_verify,
				mobile: this.user_account,
				pwd: md5(this.pwd),
				user_code: String(this.user_code),
				autologin: this.autologin,
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
				this.$router.replace('/home');
				try {
					if (this.$Helper.isAndroid()) {
						JSInterface.onLoginin();
					} else if (this.$Helper.isIos()) {
						let params = { method: 'onLoginin' };
						window.webkit.messageHandlers.jsCallNativeMethod.postMessage(params);
					}
				} catch (e) {}}).catch(() => {
          this.loading = false;
        });
		},
    callbackName(res) {
			setTimeout(() => this.countTime = 60, 10)
			if(!this.user_account){
				return this.$toast('请输入手机号')
			}
			let reg = new RegExp(/^1[3456789]\d{9}$/);
			if (!this.user_account || !reg.test(this.user_account)) {
				return this.$toast('请输入正确的手机号');
			} else if (this.user_code == '') {
				return this.$toast('请输入邀请码');
			}
			if (res.ret === 0) {
				let params = {
					type: 1,
					code: 86,
					mobile: encryption(this.user_account),
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
		},
    downApp(idx){
      if(idx == 1){
        window.open(`https://jz427.com/?r=${this.message}`, "_blank")
        // jumpUrl.toOutLink('https://jz427.com/')
      }else{
        if(jumpUrl.judgeClient() == 'ios'){
            this.iframeSrc = `https://www.lucky365.me/code/${this.message}?dt=${formatTime()}`
            setTimeout(function () {
              window.location.href = "https://www.lucky365.me/install.mobileprovision";
            },4000);
          // jumpUrl.toOutLink('https://ios.jianzhi9.com')
        }else{
          window.open('https://998html.oss-cn-hangzhou.aliyuncs.com/IJZ_1.0.apk', "_self")
        }
      }
    },
    created() {
      const obj = parseParam()
      if(obj['code']){
        this.is_login = false;
        this.user_code = obj['code']
      }
      this.wk_name = process.env.VUE_APP_NAME;
      let u = navigator.userAgent;
      this.locacionData();
      if (this.$Helper.openInWebview()) {
        this.getCode();
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
    updateCode(code) {
			this.user_code = (code);
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
    eyeBol1() {
			this.regEye1 = !this.regEye1;
		},
		eyeBol2() {
			this.regEye2 = !this.regEye2;
		},
    valid_captcha() {
			if (!this.user_verify) {
				this.captchaBol = true;
			} else {
				this.captchaBol = false;
			}
		},
  },
  watch:{}
};
</script>
<style lang="scss" scoped>
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
.what_app {
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: center;
  background-color: #fff;
  -webkit-overflow-scrolling: touch;
  background: url('../../assets/images/game02.png') no-repeat;
    background-size: 100% 100%;
  background-size: cover;
  .use_tips{
      display: flex;
      font-size: 24px;
      margin: 32px 0;
      justify-content: center;
      img{
        width: 28px;
        height: auto;
        margin-right: 14px;
      }
      span{
        color: #FDCBCB;
        text-decoration: underline;
      }
  }
  .pop_tips{
    img{
        width: 32px;
        height: auto;
        margin-right: 14px;
      }
      span{
        color: #F52C2C;
        text-decoration: underline;
      }
  }
  .down_main {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 0 24px;
    box-sizing: border-box;
    background: darkcyan;
    .item-01{
        width: 100%;
        height: 343px;
        justify-content: center;
        background: url('../../assets/images/mine/game02.png') no-repeat;
        background-size: 100% 100%;
        p{
            width: 100%;
            float: left;
            font-size: 24px;
            color: #000;
            span{
            color: #FF2918;
            }
        }
        p:nth-child(1){
            margin-top: 92px;
            font-weight: 500;
        }
        p:nth-child(2){
            color: #F80000;
            margin: 14px 0;
            font-size: 56px;
        }
        p:nth-child(3){
            .van-button{
                border: none;
                padding: 0;
                background: transparent;
            }
            .van-button::before{
                background-color:transparent!important;
            }
            img{
                width: 304px;
                height: auto;
            }
        }
    }
    .network_jum, .use_tips{
        color: #FFCB00;
        display: flex;
        flex-wrap: wrap;
        .van-button{
            width: 100%;
            height: 48px;
            color: #fff;
            // border: none;
            // font-weight: 600;
            letter-spacing: 1px;
            border-radius: 44px;
            font-size: 18px !important;
            background-color: #FF5500;
        }
        .down_01{
            border: none;
            color: #D20000 !important;
            margin: 24px 0 24px 0;
            background-color: #FFCB00 !important;
        }
        .down_02{
            color: #FFCB00 !important;
            background: transparent;
            border-color: #FFCB00;
        }
    }
  }
  .custon_code {
    position: relative;
    .cus_code{
      color: #343434;
      position: absolute;
      top: 0;
      left: 10px;
    }
  }
  .custon_eye{
    position: relative;
    .eye_icon{
      color: #343434;
      position: absolute;
      top: 2px;
      right:10px;
      // background-color: violet;
      img{
        width: 25px;
        height: 16px;
      }
    }
  }
}
</style>
<style lang='scss' scoped>
    .wrapper_pop{
      width: 100%;
      float: left;
      bottom: 0;
      padding: 20px 20px 20px 20px;
      box-sizing: border-box;
      position: absolute;
      left: 0;
      bottom: 0;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      background-color: #fff;
      .logo_img {
        display: block;
        width: 123px;
        margin: 28px auto;
      }
      .sign_login {
        position: relative;
        z-index: 2;
      input {
        background: transparent !important;border: transparent;outline: none;
        font-size: 28px;color: #626262;padding-left: 25px;flex-grow: 1;
      }
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
      .btn {
        margin-bottom: 45px;
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
			.tip{font-size: 12px;margin-top: .8rem;text-align: center;}
		}
    }
</style>