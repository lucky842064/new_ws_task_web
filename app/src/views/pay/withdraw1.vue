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
							{{ formatMoney(userInfo.point) || 0 }}
						</div>
						<div class="btn-withdraw">
							<van-button type="danger" @click="submitFn">{{ $t('mine_015') }}</van-button>
						</div>
					</div>
				</div>
				<div class="share_box">
					<div class="share_link">
						<span class="account_name" v-text="curIndex==0?'支付宝账号：':curIndex==1?'银行账号：':'USDT地址：'"></span>
						<span class="account_text" style="color:#999999;" v-text="curIndex==0?userInfo.ali_no||'请添加支付宝账号':curIndex==1?userInfo.bank_no||'请添加银行账号':userInfo.usdt_trc||'请添加USDT地址'"></span>
						<!-- <span style="color:#999999;" v-text="curIndex==0?userInfo.bank_no||'请添加银行账号':curIndex==1?userInfo.ali_no||'请添加支付宝账号':userInfo.usdt_trc||'请添加USDT地址'"></span> -->
					</div>
					<div class="share_btn" @click="bindCardBtn">
						<van-button type="danger" @click="bindCardBtn">{{curIndex==0&&userInfo.ali_no!=''?'修改':curIndex==1&&userInfo.bank_no!=''?'修改':curIndex==2&&userInfo.usdt_trc!=''?'修改':'添加'}}</van-button>
					</div>
				</div>
			</div>
		</div>
		<!-- <div class="emport_area"></div> -->
		<div class="tip">
			<div class="bank_account pay_type" style="opacity: 0;" v-if="userInfo.put_type != ''">
				<van-radio-group v-model="radio">
					<van-cell-group>
						<van-cell v-show="item != 1" v-for="item in userInfo.put_type" :key="item" :title="item==4?'银行卡':item==5?'支付宝':item==6?'TNG Wallet':item==7?'泰国银行卡':item==8?'USDT':item==9?'马来银行卡':''" clickable data-name="1" :border="false" @click="changeType(item)">
							<van-radio slot="right-icon" :name="item" />
						</van-cell>
					</van-cell-group>
				</van-radio-group>
			</div>
			<!-- <div class="bank_account">
				<van-cell-group>
					<van-field v-if="radio == '4'" :border="false" :readonly="true" v-model="userInfo.bank_no" label="银行卡" placeholder="银行卡" />
					<van-field v-else-if="radio == '5'" :border="false" :readonly="true" v-model="userInfo.ali_no" label="支付宝" placeholder="支付宝号" />
					<van-field v-else-if="radio == '6'" :border="false" :readonly="true" v-model="userInfo.tng_wallet_no" label="TNGWallet" placeholder="TNG Wallet" />
					<van-field v-else-if="radio == '7'" :border="false" :readonly="true" v-model="userInfo.th_bank_no" label="泰国银行卡" placeholder="泰国银行卡" />
					<van-field v-else-if="radio == '8'" :border="false" :readonly="true" v-model="userInfo.usdt_trc" 
						label="USDT" placeholder="USDT" />
					<van-field v-else-if="radio == '9'" :border="false" :readonly="true" v-model="userInfo.my_bank_no" 
						label="马来银行卡" placeholder="马来银行卡" />
				</van-cell-group>
				<van-button class="revise_account" icon="arrow" type="primary" @click="goSet">{{ !withdraw_active ? '填写' : '修改' }}</van-button>
			</div> -->
			<div class="userinfo-point">账户余额：{{ formatMoney(userInfo.point || 0) }} 元</div>
			<div class="cash_adverice">
				<div class="title-tip">{{ $t('mine_016') }}</div>
				<div>
					<van-tag type="warning" />
					{{ getTipMessage() }}
				</div>
				<!-- <div>
					<van-tag type="warning" />
					最低提现金额为{{userInfo.min_point_ali || ''}}元`
				</div> -->
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
				<!-- <div v-if="userInfo.put_desc != ''" class="trends_content">
					<van-tag type="warning" />
					{{ userInfo.put_desc }}
				</div> -->
			</div>
		</div>
		<popDialog ref="showAuditModel" :title="title" titleContent="" :isCancel="true" :isConfirm="true" @confirm_btn="confirm_btn">
			<template v-slot:content>
				<template v-if="curIndex == 0">
					<div class="custom_dialog__message" v-if="userInfo.point / 10000 > userInfo.min_point_ali">
						你本次申请提现{{ userInfo.point / 10000 }}元, 每次提现收取
						<span v-if="userInfo.fee_type_ali == 0">{{ userInfo.fee_ali }}元</span>
						<span v-else-if="userInfo.fee_type_ali == 1">{{ userInfo.fee_ali }}%</span>
						的手续费
					</div>
					<div class="custom_dialog__message" v-else>
						你当前余额不够，最低提现{{ userInfo.usdt_min }}
					</div>
				</template>
				<template v-if="curIndex == 1">
					<div class="custom_dialog__message" v-if="userInfo.point / 10000 > userInfo.max_point_ali">
						你本次最多可提现{{ userInfo.max_point_ali }}元, 每次提现收取
						<span v-if="userInfo.fee_type_ali == 0">{{ userInfo.fee_ali }}元</span>
						<span v-else-if="userInfo.fee_type_ali == 1">{{ userInfo.fee_ali }}%</span>
						的手续费
					</div>
					<div class="custom_dialog__message" v-else>
						你本次申请提现{{ formatMoney(getPutPoint()) }}, 每次提现收取
						<span v-if="userInfo.fee_type_ali == 0">{{ userInfo.fee_ali }}元</span>
						<span v-else-if="userInfo.fee_type_ali == 1">{{ userInfo.fee_ali }}%</span>
						的手续费
					</div>
				</template>
				<template v-if="curIndex == 2">
					<div class="custom_dialog__message">
						你本次可提现{{ userInfo.point/10000}}元
					</div>
				</template>
			</template>
		</popDialog>
	</div>
</template>
<script>
import { mapState } from "vuex";
import popDialog from '@/components/popDialog';
import { boforeWeek, fmoney } from '@/utils/tool';
import { wealthinfo, putpoint } from '@/api/pay';
import PageHeader from '@/components/Header';
import { setTimeout } from 'timers';
export default {
	components: { PageHeader, popDialog },
	data() {
		return {
			curIndex:"0",
			title: '温馨提示',
			personList:["提现到支付宝","提现到银行卡","USDT账户确认"],
			dialogContent: '你本次提现5000元',
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
	computed: {
        // ...mapState({
        //     userInfo: state => state.User.userInfo
        // })
    },
	created() {
		// this.$store.dispatch('User/getUserInfo');
		// this.loading = true;
		this.getWealInfo();
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
				// console.log(this.userInfo);
				// console.log(this.userInfo);
				// if(this.userInfo.put_type !=""){
				// 	this.userInfo.put_type = this.userInfo.put_type.split(",")
				// }
				// let backWeek = res.day_list;
				// this.putValue = res.point;
				// if (res.day_list != undefined) {
				// 	for (let i = 0; i < backWeek.length; i++) {
				// 		if (backWeek[i] == '1') {
				// 			this.weekArry += '周一' + '、';
				// 		} else if (backWeek[i] == '2') {
				// 			this.weekArry += '周二' + '、';
				// 		} else if (backWeek[i] == '3') {
				// 			this.weekArry += '周三' + '、';
				// 		} else if (backWeek[i] == '4') {
				// 			this.weekArry += '周四' + '、';
				// 		} else if (backWeek[i] == '5') {
				// 			this.weekArry += '周五' + '、';
				// 		} else if (backWeek[i] == '6') {
				// 			this.weekArry += '周六' + '、';
				// 		} else if (backWeek[i] == '7') {
				// 			this.weekArry += '周日' + '、';
				// 		}
				// 	}
				// }
				// if (this.radio == '4') {
				// 	this.withdraw_active = this.userInfo.bank_no;
				// } else if (this.radio == '5') {
				// 	this.withdraw_active = this.userInfo.ali_no;
				// } else if (this.radio == '6') {
				// 	this.withdraw_active = this.userInfo.tng_wallet_no;
				// } else if (this.radio == '7') {
				// 	this.withdraw_active = this.userInfo.th_bank_no;
				// } else if (this.radio == '8') {
				// 	this.withdraw_active = this.userInfo.usdt_trc;
				// } else if (this.radio == '9') {
				// 	this.withdraw_active = this.userInfo.my_bank_no;
				// }
				// this.weekArry = this.weekArry.substring(0, this.weekArry.length - 1);
				// this.insufficientBalance = res.min_point > res.point;
				// let usebank = this.userInfo.put_type;
				// for (let l = 0; l < usebank.length; l++) {
				// 	if(usebank[l] == 4 && this.userInfo.bank_no !=""){
				// 		this.radio = '4';
				// 		return;
				// 	}else if(usebank[l] == 5 && this.userInfo.ali_no !=""){
				// 		this.radio = '5';
				// 		return;
				// 	}else if(usebank[l] == 6 && this.userInfo.tng_wallet_no !=""){
				// 		this.radio = '6';
				// 		return;
				// 	}else if(usebank[l] == 7 && this.userInfo.th_bank_no !=""){
				// 		this.radio = '7';
				// 		return;
				// 	}else if(usebank[l] == 8 && this.userInfo.usdt_trc !=""){
				// 		this.radio = '8';
				// 		return;
				// 	} else if(usebank[l] == 9 && this.userInfo.my_bank_no !=""){
				// 		this.radio = '9';
				// 		return;
				// 	}
				// }
				}).finally(e => {
					this.loading = false;
				});
		},
		toFocus() {
			this.$refs.pointField.focus();
		},
		submitFn() {
			if (this.userInfo.put_type == "") {
				this.$toast('当前不可提现');
				return;
			}
			// if (this.radio == '4') {
			// 	this.withdraw_active = this.userInfo.bank_no;
			// } else if (this.radio == '5') {
			// 	this.withdraw_active = !!this.userInfo.ali_no;
			// } else if (this.radio == '6') {
			// 	this.withdraw_active = this.userInfo.tng_wallet_no;
			// } else if (this.radio == '7') {
			// 	this.withdraw_active = this.userInfo.th_bank_no;
			// } else if (this.radio == '8') {
			// 	this.withdraw_active = this.userInfo.usdt_trc;
			// } else if (this.radio == '9') {
			// 	this.withdraw_active = this.userInfo.my_bank_no;
			// }
			if( this.curIndex==0&&this.userInfo.ali_no==''){
				this.$toast('请先绑定支付宝');
			}else if(this.curIndex==1&&this.userInfo.bank_no==''){
				this.$toast('请先绑定银行卡');
			} else if(this.curIndex==2&&this.userInfo.usdt_trc==''){
				this.$toast('请先绑定USDT地址');
			} else {
				let point = this.getPutPoint();
				if (point == 0) {
					let message = this.getTipMessage();
					return this.$dialog.alert({
						title: this.$t('other_008'),
						message,
						confirmButtonText: this.$t('other_005'),
						showCancelButton: false,
						confirmButtonColor: '#4b5bc2',
					});
				}
				this.$refs.showAuditModel.showDialog();
			}
			// else if(){
			// 	this.$refs.showAuditModel.showDialog();
			// }
			// if (this.withdraw_active) {
			// 	if (this.insufficientBalance) {
			// 		this.balance_tip = true;
			// 	} else {
			// 		let point = this.getPutPoint();
			// 		if (point == 0) {
			// 			let message = this.getTipMessage();
			// 			return this.$dialog.alert({
			// 				title: this.$t('other_008'),
			// 				message,
			// 				confirmButtonText: this.$t('other_005'),
			// 				showCancelButton: false,
			// 				confirmButtonColor: '#4b5bc2',
			// 			});
			// 		}
			// 		this.$refs.showAuditModel.showDialog();
			// 	}
			// } else {
			// 	let tips = this.curIndex===0&&this.userInfobank_no=='' ? '请先绑定银行卡' : this.curIndex==1&&this.userInfoali_no==''?'请先绑定银行卡': ''
			// 	this.$toast(tips);
			// }
		},
		getTipMessage() {
			return this.userInfo.hundred&&this.curIndex ==0?`支付宝提现金额必须是 ${this.userInfo.hundred} 的整数倍,最低提现金额为${this.userInfo.min_point_ali || ''}元` : `最低提现金额为${(this.curIndex===1?this.userInfo.min_point:this.userInfo.usdt_min) || ''}元`;
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
			putpoint({ point: parseInt(cashOut / 10000), put_type:this.curIndex==0?'5':this.curIndex==1?'4':'8'}).then(res => {
			// putpoint({ point: 100, put_type:this.curIndex==0?'5':this.curIndex==1?'4':'8'}).then(res => {
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
		// confirmSubmitFn: debounce(function() {
		//     const Toast = this.$toast.loading({
		//         duration: 3000,
		//         forbidClick: true,
		//         loadingType: "spinner"
		//     });
		// }),
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
			// this.collectText = idx == 4 ? '中国收款账号' :idx == 5 ? '中国支付宝号':idx == 6 ? '马来/TngWallet':idx == 7 ? '泰国银行卡': '';
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
<style>
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
		height: 485px;
		float: left;
		box-sizing: border-box;
		position: relative;
		z-index: 3;
		box-sizing: border-box;
		// background-image: url('../../assets/images/home/shouye_01.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		.draw_main{
			width: 100%;
			padding: 30px 24px;
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
			margin-bottom: 20px;
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
					width: 328px;
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
	.emport_area {
		width: 100%;
		height: 80px;
		float: left;
	}
	.tip {
		font-size: 28px;
		color: #666666;
		line-height: 54px;
		padding: 20px 30px;
		margin-top: 70px;
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
}
</style>
