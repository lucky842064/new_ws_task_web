<template>
	<div class="withdraw">
		<div class="panel">
			<page-header title="提现" :show-icon="true"></page-header>
			<van-tabs title-active-color="red" :active="curIndex" @change="onChange">
                <van-tab :title="item" v-for="(item,idx) in personList" :key="idx"></van-tab>
            </van-tabs>
			<div class="draw_main">
				<div class="card_box">
					<div class="card">
						<div class="title">
							<span>{{ $t('buy_008') }}</span>
						</div>
						<div class="amount van-ellipsis">
							{{ WithdMoney || 0 }}
						</div>
						<div class="btn-withdraw">
							<van-button type="danger" @click="submitBtn">{{ $t('mine_015') }}</van-button>
						</div>
					</div>
				</div>
				<div class="share_box">
					<div class="share_link">
						<span class="account_name" v-text="curIndex==0?'银行账号：':'USDT地址：'"></span>
						<span class="account_text" v-text="curIndex==0?card_no||'请添加银行账号':card_no||'请添加USDT地址'"></span>
					</div>
					<div class="share_btn" @click="bindCardBtn">
						<van-button type="danger">{{curIndex==0&&card_no?'修改':curIndex==1&&card_no?'修改':'添加'}}</van-button>
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
		<van-popup :close-on-click-overlay="false" :overlay="true" v-model="showModel">
			<div class="dialog_content">
				<div class="header_title">提现</div>
				<div class="header_tips">当前可提现金额为{{WithdMoney}}元</div>
				<van-cell-group inset :border="false">
					<van-field v-model="withdraw_num" type="number" clearable placeholder="请输入提现金额" />
				</van-cell-group>
				<div class="custom_dialog__footer">
					<van-button class="custom_dialog_cancel" @click="showModel=false">{{ $t('other_004') }}</van-button>
					<span class="model_line"></span>
					<van-button class="custom_dialog_confirm" :loading="isLoading" loading-text="提交中..." @click="withdrawBtn">{{ $t('other_005') }}</van-button>
				</div>
			</div>
		</van-popup>
	</div>
</template>
<script>
import { getaccountincome } from '@/api/bill';
import { getwithdrawcard,savewithdrawapproval } from '@/api/pay';
import PageHeader from '@/components/Header';
import { setTimeout } from 'timers';
export default {
	components: { PageHeader },
	data() {
		return {
			card_no:"",
			bank_name:"",
			payee_name:"",
			curIndex:"0",
			WithdMoney:0,
			userInfo:"",
			isLoading:false,
			withdraw_num:null,
			personList:["提现到银行卡","提现到USDT账户"],
			showModel: false,
			is_prevent: false
		}
	},
	created() {
		this.getUserIncome();
		this.getBankInfo();
	},
	mounted() {
		if (this.$route.params && this.$route.params.back) {
			this.is_prevent = true;
		}
	},
	methods: {
		async getUserIncome(){
			let { income } = await getaccountincome();
			this.WithdMoney = income||0;
		},
		async getBankInfo(){
			let { card_no,bank_name,payee_name } = await getwithdrawcard({type:Number(this.curIndex)+1});
			this.card_no = card_no||"";
			this.bank_name = bank_name||"";
			this.payee_name = payee_name||"";
		},
		onChange(idx){
			this.curIndex=idx;
			this.getBankInfo();
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
		submitBtn() {
			let payIdx = Number(this.curIndex+1);
			if(payIdx==1&&!this.card_no){
				return this.$toast('请先添加银行卡');
			} else if(payIdx==2&&!this.card_no){
				return this.$toast('请先添加USDT账户');
			} else if(this.WithdMoney <= 0){
				return this.$toast('当前不可提现');
			}
			this.showModel=true;
		},
		async withdrawBtn(){
			if(!this.card_no) return this.$toast('请添加收款信息！');
			if(this.withdraw_num > this.WithdMoney || this.withdraw_num<=0){
				return this.$toast('请输入正确的提现金额！');
			}
			let params = {
				type:Number(this.curIndex)+1,
				card_no:this.card_no,
				bank_name:this.bank_name,
				payee_name:this.payee_name,
				amount:Number(this.withdraw_num)
			}
			this.isLoading = true;
			let res = await savewithdrawapproval(params);
			this.isLoading = false;
			if(res.code) return;
			this.$toast('操作完成');
			setTimeout(() => {this.$router.go(-1)},500);
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
		bindCardBtn(){
			// this.$router.push("/personCenter");
			this.$router.push({path:'/personCenter', query: { type:Number(this.curIndex)+1 } });
		}
	},
};
</script>
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
}
.van-popup{
	width: calc(100% - 40px);
	border-radius: 8px;
	overflow: hidden;
	.dialog_content{
		width: 100%;
		display: flex;
		flex-direction: column;
		.header_title, .custom_dialog__footer{
			display: flex;
			justify-content: center;
		}
		.header_title{
			font-size: 24px;
			padding-top: 10px;
		}
		.header_tips{
			display: flex;
			font-size: 16px;
			margin: 10px 0;
			padding: 10px 20px;
			justify-content: center;
			box-sizing: border-box;
		}
		.van-cell-group{
			display: flex;
			width: 100%;
			margin-bottom: 30px;
			justify-content: center;
			box-sizing: border-box;
			.van-cell{
				width: 180px;
				border-radius: 4px;
				padding: 6px 10px;
				background-color: #f2f3f5;
			}
		}
		.custom_dialog__footer{
			display: flex;
			border-top: 1px solid #f2f3f5;
			.van-button{
				flex: 1;
				border: none;
				background: none;
				font-size: 16px;
				border-radius: 0;
			}
			.model_line{
				width: 0;
				border-left: 1px solid #f2f3f5;
			}
			.custom_dialog_confirm{
				color: #1989fa;
			}
		}
	}
}
</style>
