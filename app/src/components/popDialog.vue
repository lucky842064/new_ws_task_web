<!--  -->
<template>
	<div class="custom_dialog">
		<van-popup :close-on-click-overlay="false" :overlay="true" v-model="dataModel.show">
			<div class="dialog_content">
				<div class="header_title">
					{{ title }}
					<template v-if="headEdit == 1">
						<div class="edit_text" :isEdit="showEdit" @click="editbtn(imgType)">
							<span class="title_name" :class="imgType == 1 ? 'edit_class' : ''">{{ editName }}</span>
							<!-- <img v-if="imgType == 0" class="edit_img" src="@/assets/images/buy/fedit_icon.png" alt="" /> -->
							<!-- <img v-else class="edit_img" src="@/assets/images/buy/edit_icon.png" alt="" /> -->
						</div>
						<div class="dec_icon" @click="hideModel">
							<i role="button" tabindex="0" class="van-icon van-icon-cross van-popup__close-icon"></i>
						</div>
					</template>
				</div>
				<slot class="custom_dialog__message" name="content"></slot>
				<div class="custom_dialog__message" v-show="titleContent != ''">{{ titleContent }}</div>
				<div class="custom_dialog__footer">
					<van-button v-if="isCancel == true" class="custom_dialog_cancel" plain type="primary" @click="hideModel">取消</van-button>
					<van-button v-if="isConfirm == true" class="custom_dialog_confirm" plain type="primary" @click="confirmBtn">{{ confirmName }}</van-button>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '提示', //默认高度
		},
		headEdit: {
			type: String,
			default: '0', //默认高度
		},
		showEdit: {
			type: Boolean,
			default: false,
		},
		imgType: {
			type: String,
			default: '0', //默认高度
		},
		titleContent: {
			type: String,
			default: '',
		},
		isCancel: {
			type: Boolean,
			default: false,
		},
		isConfirm: {
			type: Boolean,
			default: false,
		},
		confirmName: {
			type: String,
			default: '确定',
		},
		editName: {
			type: String,
			default: '编辑',
		},
		dataModel: {
			type: Object,
			default: () => {
				return {
					show: false,
				};
			},
		},
	},
	methods: {
		showDialog() {
			this.dataModel.show = true;
		},
		// 关闭1
		hideModel() {
			this.dataModel.show = false;
			this.$emit('cancel_btn');
		},
		// 关闭2
		closeModel() {
			this.dataModel.show = false;
		},
		editbtn(val) {
			this.$emit('edit_btn', val);
		},
		confirmBtn() {
			this.$emit('confirm_btn');
		},
	},
};
</script>
<style lang="scss" scoped>
.custom_dialog {
	.van-popup--center {
		width: 6.8rem;
		// min-height: 3.20rem;
		font-size: 0.16rem;
		background-color: #fff;
		border-radius: 0.08rem;
		-webkit-transform: translate3d(-50%, -50%, 0);
		transform: translate3d(-50%, -50%, 0);
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		-webkit-transition: 0.3s;
		transition: 0.3s;
		-webkit-transition-property: opacity, -webkit-transform;
		transition-property: opacity, -webkit-transform;
		transition-property: transform, opacity;
		transition-property: transform, opacity, -webkit-transform;
		.header_title {
			line-height: 0;
			padding: 20px 0;
			font-weight: 500;
			font-size: 14px;
			text-align: center;
			position: relative;
			.edit_text {
				position: absolute;
				top: 20px;
				left: 20px;
			}
			.title_name {
				float: left;
				background-color: violet;
			}
			.edit_class {
				color: #fe6428;
			}
			.edit_img {
				width: 12px;
				height: 12px;
				float: right;
				margin-top: -6px;
				margin-left: 6px;
			}
			.dec_icon {
				width: 20px;
				height: 20px;
				position: absolute;
				top: 10px;
				right: 10px;
				.van-popup__close-icon {
					font-weight: initial;
					font-size: 18px;
					position: initial !important;
				}
			}
		}
		.custom_dialog__message {
			-webkit-box-flex: 1;
			-webkit-flex: 1;
			flex: 1;
			max-height: 60vh;
			padding: 0.24rem;
			// padding: 26px 20px;
			overflow-y: auto;
			font-size: 14px;
			line-height: 20px;
			white-space: pre-wrap;
			text-align: center;
			word-wrap: break-word;
			-webkit-overflow-scrolling: touch;
			.cuesome_lable {
				width: 100%;
				padding: 15px 0;
				.van-field__label {
					width: 4rem !important;
				}
			}
		}
		.custom_dialog__footer {
			display: -webkit-box;
			display: -webkit-flex;
			display: flex;
			overflow: hidden;
			-webkit-user-select: none;
			user-select: none;
			border-top: 1px solid #ebedf0;
			.custom_dialog_cancel,
			.custom_dialog_confirm {
				height: 48px;
				line-height: 48px;
				color: #ee0a24;
				border: none;
				font-size: 16px;
				flex: 1;
				border-radius: 0;
			}
			.custom_dialog_cancel {
				color: #323233;
				border-right: 1px solid #ebedf0;
			}
		}
	}
}
</style>
