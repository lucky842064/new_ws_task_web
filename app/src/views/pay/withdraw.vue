<template>
	<div class="withdraw">
		<div class="panel">
			<page-header title="提现" :show-icon="true"></page-header>
			<van-tabs title-active-color="red" :active="curIndex" @change="onChange">
                <van-tab :title="item" v-for="(item,index) in personList" :key="index"></van-tab>
            </van-tabs>
			<div class="draw_main">
				<div class="card_box">
					<div class="card">
						<div class="title">
							<span>{{ $t('buy_008') }}</span>
						</div>
						<div class="amount van-ellipsis">
							{{ userInfo.point || 50000 }}
						</div>
						<div class="btn-withdraw">
							<van-button type="danger" @click="submitFn">{{ $t('mine_015') }}</van-button>
						</div>
					</div>
				</div>
				<div class="share_box">
					<div class="share_link">
						<span class="account_name" v-text="curIndex==0?'银行账号：':'USDT地址：'"></span>
						<span class="account_text" v-text="curIndex==0?userInfo.bank_no||'请添加银行账号':userInfo.usdt_trc||'请添加USDT地址'"></span>
					</div>
					<div class="share_btn" @click="bindCardBtn">
						<van-button type="danger" @click="bindCardBtn">{{curIndex==0&&userInfo.bank_no!=''?'修改':curIndex==2&&userInfo.usdt_trc!=''?'修改':'添加'}}</van-button>
					</div>
				</div>
			</div>
		</div>
		<div class="tip">
			<div class="cash_adverice">
				<div class="title-tip">{{ $t('mine_016') }}</div>
				<div>
					<van-tag type="warning" /> 最低体现金额100元
				</div>
				<template v-if="curIndex == 0 && userInfo.fee_ali != 0">
					<div v-if="userInfo.fee_type_ali == 0">
						<van-tag type="warning" />
						每次提现收取{{ userInfo.fee_ali }}元的手续费
					</div>
					<div v-else-if="userInfo.fee_type_ali == 1">
						<van-tag type="warning" />
						每次提现收取{{ userInfo.fee_ali }}%的手续费
					</div>
				</template>
				<template v-if="curIndex == 1 && userInfo.fee != 0">
					<div v-if="userInfo.fee_type == 0">
						<van-tag type="warning" />
						每次提现收取{{ userInfo.fee }}元的手续费
					</div>
					<div v-else-if="userInfo.fee_type == 1">
						<van-tag type="warning" />
						每次提现收取{{ userInfo.fee }}%的手续费
					</div>
				</template>
				<div style="color:#F52C2C;">
					<van-tag type="warning" />
					当日21点前提现,当日晚上24点之前到账。
				</div>
				<div>
					<van-tag type="warning" />
					本平台是第三方合作安全出款，收到款项后请勿转回。
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import popDialog from '@/components/popDialog';
import { fmoney } from '@/utils/tool';
import { wealthinfo, putpoint } from '@/api/pay';
import PageHeader from '@/components/Header';
import { setTimeout } from 'timers';
export default {
	components: { PageHeader },
	data() {
		return {
			curIndex:"0",
			WithdMoney:0,
			title: '温馨提示',
			personList:["提现到银行卡","USDT账户确认"],
			radio: '',
			putValue: null,
			collectText: '收款账号',
			showAuditModel: false,
			withdraw_active:false,
			insufficientBalance: false,
			balance_tip: false,
			loading: false,
			userInfo: '',
			sysInfo: {},
			weekArry: '',
			processing: 0,
			taken: 0,
			minAmount: 0,
			canDrawNumber: '',
			resultDrawNumber: '',
			is_prevent: false,
			minCash: '',
		};
	},
	created() {
		// this.$store.dispatch('User/getUserInfo');
		// this.loading = true;
		// this.getWealInfo();
	},
	mounted() {
		if (this.$route.params && this.$route.params.back) {
			this.is_prevent = true;
		}
	},
	methods: {
		getWealInfo() {
			wealthinfo().then(res => {
				this.userInfo = res;
			})
		},
		toFocus() {
			this.$refs.pointField.focus();
		},
		testingMoney(){
			if(!/^[1-9]\d*00$/.test(this.WithdMoney)){
				if(this.WithdMoney<100){
					this.WithdMoney=100
				}else{
					this.WithdMoney=this.WithdMoney.slice(0,1)+'00'
				}
			}
		},
		submitFn() {
			if (this.userInfo.put_type == "") {
				this.$toast('当前不可提现');
				return;
			}
			if( this.curIndex==0&&this.userInfo.ali_no==''){
				this.$toast('请先绑定支付宝');
			}else if(this.curIndex==1&&this.userInfo.bank_no==''){
				this.$toast('请先绑定银行卡');
			} else if(this.curIndex==2&&this.userInfo.usdt_trc==''){
				this.$toast('请先绑定USDT地址');
			} else {
				let point = this.getPutPoint();
				this.$refs.showAuditModel.showDialog();
			}
		},
		getPutPoint() {
			let init = (this.userInfo.point || 0) / 10000;
			init = init - (init % (this.userInfo.hundred || 1));
			let min = this.curIndex==0?this.userInfo.min_point_ali:this.curIndex==1?this.userInfo.min_point:100;
			let max = this.curIndex==0?this.userInfo.max_point_ali:this.curIndex==1?this.userInfo.max_point_ali:10000000;
			if (init < min) {
				return 0;
			} else if (init > max) {
				return max * 10000;
			} else {
				return init * 10000;
			}
		},
		toOutLink(e) {
			if (e.target.className == 'toOutLink') {
				this.$Helper.toOutLink(this.info.kefu, 1);
			}
		},
		// 确认提现
		confirm_btn() {
			// let cashOut = this.userInfo.point / 10000 > this.userInfo.max_point ? this.userInfo.max_point : this.userInfo.point / 10000;
			if(this.curIndex == 0){
				if(this.userInfo.point / 10000 > this.max_point){
					return this.$toast('提现超出最大限制')
				}
				if(this.userInfo.point / 10000 < this.min_point){
					return this.$toast('提现低于最小限制')
				}
			}
			if(this.curIndex == 1 ){
				if(this.userInfo.point / 10000 > this.userInfo.max_point_ali) {
					return this.$toast('提现超出最大限制')
				}
				if(this.userInfo.point / 10000 < this.userInfo.min_point_ali) {
					return this.$toast('提现低于最小限制')
				}
			}
			
			let cashOut = this.getPutPoint();
			// WithdMoney
			// putpoint({ point: parseInt(cashOut / 10000), put_type:this.curIndex==0?'5':this.curIndex==1?'4':'8'}).then(res => {
			putpoint({point:parseInt(this.WithdMoney), put_type:this.curIndex==0?'5':this.curIndex==1?'4':'8'}).then(res => {
				if(res.code == undefined){
					this.$refs.showAuditModel.closeModel();
					this.$store.dispatch('User/getUserInfo', true);
					this.$toast.success(this.$t('buy_031'));
					this.getWealInfo();
					setTimeout(() => {
						this.$router.go(-1);
					}, 500);
				}
			}).catch(e => {
				this.$dialog.alert({
					title: this.$t('other_008'),
					message: e,
					confirmButtonText: '确定',
					showCancelButton: false,
					confirmButtonColor: '#4b5bc2',
				});
			});
		},
		onClickLeft() {
			this.$router.go(-1);
		},
		on_return() {
			if (this.is_prevent) {
				this.$router.push('/mine');
			}
		},
		goSet() {
			if(!this.radio){
				return this.$toast( '请选择一项提现方式' )
			}
			this.$router.push({ path: '/personCenter', query: { type: 1, pay: this.radio } });
		},
		// 格式化金额
        formatMoney(point) {
            return fmoney(point,2);
        },
		// 切换首款类型
		changeType(idx) {
			if (this.radio == '4') {
				this.withdraw_active = this.userInfo.bank_no;
			} else if (this.radio == '5') {
				this.withdraw_active = this.userInfo.ali_no;
			} else if (this.radio == '6') {
				this.withdraw_active = this.userInfo.tng_wallet_no;
			} else if (this.radio == '7') {
				this.withdraw_active = this.userInfo.th_bank_no;
			} else if (this.radio == '8') {
				this.withdraw_active = this.userInfo.usdt_trc;
			} else if (this.radio == '9') {
				this.withdraw_active = this.userInfo.my_bank_no;
			}
		},
		onChange(idx){
			this.curIndex=idx;
		},
		bindCardBtn(){
			// this.$router.push("/personCenter");
			this.$router.push({path:'/personCenter', query: { type:this.curIndex } });
		}
	},
};
</script>
<style lang='scss'>
.bank_account .van-field__label {
	width: 100px;
	padding: 5px 0;
	padding-left: 20px;
	color: #2c3e50;
	margin: 0 !important;
}
.bank_account .van-cell__value {
	/* background-color: #f2f2f2; */
	padding: 5px 0;
	border-radius: 5px;
}
.van-cell {
	border-bottom: none !important;
}
.van-radio__icon--checked .van-icon {
	background-color: #ff5414;
	border-color: #ff5414;
}
.van-cell--clickable:active {
	background-color: transparent;
}
.van-tabs__wrap{
	border-bottom:1px solid #D8D8D8 !important;
}
</style>
<style lang="scss" scoped>
.editor-icon {
	width: 32px;
}
.withdraw {
	width: 100%;
	float: left;
	overflow-y: auto;
	height: 100vh;
	position: relative;
	background-color: #fff;
	-webkit-overflow-scrolling: touch;


	.header {
		background: #000000;
		padding: 0.3rem 0.4rem;
		.nav {
			height: 46px;
			display: flex;
			justify-content: space-between;
			color: #ffffff;
			align-items: center;
			font-size: 32px;
			.ke-fu-icon {
				img {
					width: 42px;
					height: 42px;
				}
			}
		}
	}
	.panel {
		width: 100%;
		float: left;
		box-sizing: border-box;
		position: relative;
		z-index: 3;
		box-sizing: border-box;
		// background-image: url('../../assets/images/home/shouye_01.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		.draw_main{
			display: flex;
			width: 100%;
			flex-direction: column;
			padding: 30px 24px 0 24px;
			box-sizing: border-box;
			.card_box {
				width: 100%;
				margin-bottom: 24px;
				padding-top: 30px;
				.card {
					height: 447px;
					background-color: $home-bind-button;
					border-radius: 10px;
					text-align: center;
					border-radius: 20px;
					.title {
						padding-top: 64px;
						font-size: 28px;
						// color: rgb(102, 102, 102);
						// 
						span {
							vertical-align: middle;
							color: #fff;
						}
						img {
							height: 0.34rem;
							width: 0.4rem;
							vertical-align: middle;
						}
					}
					.amount {
						font-family: 'Arial MT';
						color: #fff;
						font-weight: 500;
						text-align: center;
						margin-top: 40px;
						font-size: 75px;
					}
					.desc {
						display: flex;
						padding: 40px 0;
						margin-top: 10px;
						span {
							color: #cccccc;
							border-left: 1px solid #cccccc;
						}
					}
					.btn-withdraw {
						width: 100%;
						float: left;
						padding: 0 50px;
						margin-top: 57px;
						box-sizing: border-box;
						.van-button {
							width: 100%;
							padding: 0;
							height: 44px;
							border-radius: 44px;
							font-size: 0.32rem;
							font-weight: bold;
							border-color: #fff;
							background-color: #fff;
							color: $home-bind-button;
						}
					}
				}
			}
		}
		.share_box{
			width: 100%;
			display: flex;
			padding: 38px 32px;
			box-sizing: border-box;
			background: #FFE9E9;
			border-radius: 20px;
			.share_link, .share_btn{
				flex-grow: 1;
				// justify-content: space-between;
				.van-button{
					width: 56px;
					height: 24px;
					color: #feeeee;
					float: right;
					font-size: 12px;
					border-radius: 36px;
				}
			}
			.share_link{
				display: flex;
				font-size: 28px;
				// flex-wrap: wrap;
				align-items: center;
				.account_name{
					font-weight: 400;
					color: #666666;
				}
				.account_text{
					width: max-content;
					color:#999999;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowra
				}
				p:nth-child(2){
					color: #F52C2C;
				}
			}
			.share_btn{
				flex-grow: 0;
			}
		}
	}
	.tip {
		width: 100%;
		display: flex;
		font-size: 28px;
		color: #666666;
		line-height: 54px;
		padding: 0 30px;
		flex-direction: column;
		.bank_account {
			width: 100%;
			float: left;
			padding: 22px 0;
			// margin-bottom: 40px;
			border-bottom: 1px solid #ebedf0;
			.van-cell {
				width: 80%;
				float: left;
				padding: 0;
			}
			.van-hairline--top-bottom::after,
			.van-hairline-unset--top-bottom::after {
				border-width: 0;
			}
			.revise_account {
				width: 120px;
				height: 0;
				float: right;
				line-height: 0px;
				color: $color-theme;
				margin-top: 4px;
				padding: 32px 0 28px 30px;
				border-radius: 10px;
				border-color: $color-theme;
				background-color: transparent;
				.van-button__text {
					margin-left: 0px;
				}
				.van-button__icon {
					margin-right: -45px;
					margin-top: -1px;
				}
			}
		}
		.pay_type {
			padding-bottom: 0;
			border-bottom: transparent;
			.van-cell {
				padding: 16px 0;
				width: 100%;
				border-bottom: 1px solid #ebedf0;
				.van-cell__title,
				.van-cell__value {
					padding-left: 20px;
				}
			}
		}
		.item {
			width: 100%;
			float: left;
			padding: 20px 0;
			margin-bottom: 20px;
			border-bottom: 1px solid #e6e6e6;
			.title {
				float: left;
				font-size: 34px;
				color: #666666;
				letter-spacing: 0.58px;
			}
			.fake-input {
				width: 4rem;
				float: left;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-left: 30px;
				font-size: 30px;
				color: #999999;
				&.active {
					color: #000000;
					font-weight: 500;
				}
			}
			.fake-btn {
				width: 100px;
				display: flex;
				line-height: initial;
				padding: 2px 0;
				color: #000;
				align-items: center;
				justify-content: center;
				border-radius: 10px;
				border: 1px solid #000;
				// position: absolute;
				// top: 0.3rem;
				// right: 0.2rem;
				// top: 0.25rem;
				// color: #000;
				// width: 100px;
				// height: 0;
				// line-height: 0;
				// padding: 30px 0 20px 0;
				// text-align: center;
				// border: 1px solid #000;
				// border-radius: 10px;
			}
		}
		.cash_adverice {
			width: 100%;
			float: left;
			margin-top: 20px;
			padding-left: 20px;
			padding-bottom: 20px;
			box-sizing: border-box;
			.van-tag {
				width: 8px;
				height: 8px;
				padding: 0;
				margin: -8px 5px 0 0;
				line-height: 0;
				border-radius: 50%;
				background-color: #000;
			}
			.trends_content {
				color: #ee0a24;
				font-weight: 600;
				font-size: 32px;
			}
		}
		.title-tip {
			font-size: 35px;
			color: #000000;
			font-weight: 500;
			padding: 0.1rem 0;
		}
		.blue {
			margin-left: 4px;
			color: $color-theme;
			text-decoration: underline;
		}
		.red {
			color: $home-risk-value;
		}
	}

	.tip-box {
		height: 200px;
		padding: 40px 30px;
		.value {
			font-size: 30px;
			color: #000000;
			text-align: center;
		}
		.red {
			font-size: 30px;
			color: $color-theme;
			font-weight: bolder;
		}
	}
	::v-deep {
		.van-dialog__confirm {
			font-weight: bold;
		}
		.header{
			color: #fff;
		}
	}
}
.van-field__control {
	font-size: 0.38rem;
	font-weight: 500;
}
.userinfo-point {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 4px;
	color: rgb(30, 55, 145);
}
// .van-cell__title, .van-field__label {
//     width: 85px;
//     padding: 5px 0;
//     color: #2c3e50;
//     margin: 0 !important;
// }
.custom_dialog__message {
	-webkit-box-flex: 1;
	-webkit-flex: 1;
	padding-bottom: 20px;
	flex: 1;
	max-height: 60vh;
	padding: 30px;
	// padding: 26px 20px;
	overflow-y: auto;
	font-size: 0.28rem;
	white-space: pre-wrap;
	text-align: center;
	word-wrap: break-word;
	-webkit-overflow-scrolling: touch;
	.custom_money{
		width: 230px;
		margin: 0 auto;
		display: flex;
		margin-bottom: 25px;
		align-items: center;
		position: relative;
		border-bottom: 1px solid #979797;
		input{
			width: 100%;
			height: 64px;
			outline: none;
			border: none;
			color: #000;
			font-weight: 500;
			text-align: center;
			font-size: 28px;
			padding-left: 10px;
			background: transparent;
		}
		.symbol_icon{
			color: #060606;
			display: flex;
			font-size: 38px;
			align-items: center;
		}
	}
}
</style>
