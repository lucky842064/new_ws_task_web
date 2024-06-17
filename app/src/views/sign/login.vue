<template>
	<div class="login_warp">
		<div class="login_main">
			<div class="sign_login">
				<div class="head_title">{{ $t('login_029') }}</div>
				<div class="uilist">
					<div class="uilist_div account">
						<img src="../../assets/images/sign/icon_ren.png" alt />
						<input v-model="username" :placeholder="$t('login_004')" autocomplete="off" />
					</div>
					<div class="uilist_div pwd">
						<img src="../../assets/images/sign/icon_suo.png" alt />
						<input v-model="password" :placeholder="$t('login_008')" :type="regEye ? 'password' : 'text'" oninput="value=value.replace(/[^\w_]/g,'')" />
						<i :class="[regEye ? 'icon_biyan' : 'icon_zhenyan']" @click="eyeBol"></i>
						<span class="forget_text" @click="forgetFunc">忘记密码</span>
					</div>
				</div>
				<div class="login_btn">
					<van-button type="danger" :loading="isLoading" @click="handleLogin" loading-text="登录中...">登录</van-button>
					<van-button @click="goRegister" >{{ $t('login_002') }}</van-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import WebsiteSetting from '../../mixin/websiteSetting.js';
export default {
	mixins: [WebsiteSetting],
	data() {
		return {
			regEye:true,
			username:"",
			password:"",
		}
	},
	methods: {
		eyeBol() {
			this.regEye = !this.regEye;
		},
		goRegister() {
			this.$router.push("/register")
		},
		forgetFunc(){

		},
		//登录
		handleLogin() {
			const regex = /^[0-9A-Za-z]{6,20}$/;
			const reg = new RegExp(/^1[3456789]\d{9}$/);
			if (!this.username /*|| !reg.test(this.username)*/) {
				// return this.$toast(this.$t('login_007'));
				return this.$toast('手机号不能为空！')
			}
			if (!this.password) {
				return this.$toast(this.$t('login_008'));
			}
			let params = {
				account: this.username,
				pwd:this.password
			};
			const Toast = this.$toast.loading({
				duration: 3000,
				message: this.$t('login_013'),
				forbidClick: true,
				loadingType: 'spinner',
			});
			this.isLoading= true;
			this.$store.dispatch('User/userLogin', params).then(res => {
				Toast.clear();
				setTimeout(()=>{this.isLoading= false},2000)
				if(!res.token) return;
				this.$router.push('/home');
				this.isLoading= false
			}).catch(error => {
				this.isLoading= false
				if (window.location.host == 'fcwk.dpqcblzs.com' || window.location.host == 'fcwk.hnjsjzdl.com' || window.location.host == 'www.mifengxj.com') {
					this.qrcodeImg.show = true;
				}
				Toast.clear();
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.login_warp {
	width: 100%;
	height: 100%;
	padding: 0 48px;
	box-sizing: border-box;
	box-sizing: border-box;
	position: relative;
	min-height: 100vh;
	.login_main {
		width: 100%;
		position: relative;
		input {
			background: transparent !important;
			border: transparent;
			outline: none;
			font-size: 28px;
			color: #626262;
			padding-left: 25px;
			flex-grow: 1;
		}
		.sign_login {
			display: flex;
			width: 100%;
			position: relative;
			flex-direction: column;
			.nav_top{
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
			.uilist {
				overflow: hidden;
				.uilist_div{
					position: relative;
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
					.forget_text{
						color: #323aa2;
						font-size: 28px;
						position: absolute;
						right: 0;
						bottom: -50px;
					}
				}
			}
		}
		.login_btn{
			width: 100%;
			display: flex;
			margin-top: 20px;
			flex-direction: column;
			.van-button{
				width: 100%;
				border: none;
				border-radius: 6px;
				margin-bottom: 20px;
			}
			.van-button:nth-child(2){
				color: #323aa2;
				background: #e9edfe;
			}
		}
	}
}
.icon_biyan, .icon_zhenyan {
	width: 40px;
	height: 20px;
	background: url("../../assets/images/sign/icon_biyan.png") no-repeat;
	background-size: 100% 100% !important;
}
.icon_zhenyan {
	background: url("../../assets/images/sign/icon_zhenyan.png") no-repeat;
}

::-webkit-input-placeholder {
	color: #a7a7a7;
}
:-moz-placeholder {
	color: #a7a7a7;
}
::-moz-placeholder {
	color: #a7a7a7;
}
:-ms-input-placeholder {
	color: #a7a7a7;
}
.head_title{
	width: 100%;
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center; 
	margin: 20% 0 10% 0;
}
</style>
