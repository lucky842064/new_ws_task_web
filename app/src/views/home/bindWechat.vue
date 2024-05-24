<template>
	<div class="task_content">
		<page-header style="position: fixed;top: 0;left: 0; z-index: 9;" :title="title" :show-icon="true"></page-header>
		<div class="empoty_collaps"></div>
		<div class="mobile_class">
			<van-cell-group>
				<van-field label="绑定微信号" :formatter="formatter" v-model="wechatNun" placeholder="请输入微信号" :border="false" />
			</van-cell-group>
			<!-- <span class="wechat_text">绑定微信号</span>
            <van-field :formatter="formatter" v-model = "wechatNun" placeholder="请输入微信号" /> -->
		</div>
		<div class="uploaup_file">
			<div class="img_tips">上传截图</div>
			<van-uploader v-show="!locahImg" :accept="'image/*'" max-count="1" :file-list="fileList" :after-read="uploadFile" @delete="detailImg" />
			<div class="head_img" v-show="locahImg">
				<img :src="userImg" ref="wechatImg" @click="previewImage" />
				<div class="van-uploader__preview-delete" @click="detailImg"><i class="van-icon van-icon-cross van-uploader__preview-delete-icon"></i></div>
			</div>
			<div class="progress_class" v-if="showProgress">
				<van-circle v-model="progress" :rate="0" :color="gradientColor" :text="text" />
			</div>
		</div>
		<div class="submit_btn">
			<van-button :disabled="hideSubmit" type="primary" @click="submitBtn">添加微信</van-button>
			<div class="explain_title">
				<span>会员等级</span>
			</div>
			<div class="task_text">
				<van-cell :border="false" title="1、微信截图界面：点击”我的“—>点击”头像“一个人信息截图" />
				<van-cell :border="false" title="2、配置绑定的微信号与截图中的微信号要一致" />
				<van-cell :border="false" title="3、如果绑定多个微信，请在【账户】—>【微信账户】管理中添加" />
			</div>
		</div>
		<van-overlay :show="previewImg" @click="previewImg = false">
			<div class="screen_down">
				<img class="preview_img" :src="userImg" alt="" />
			</div>
		</van-overlay>
	</div>
</template>
<script>
import COS from 'cos-js-sdk-v5';
import { uuid } from '@/utils/tool';
import PageHeader from '@/components/Header';
import { uploadColImg, uploadimage, bingWechat } from '@/api/user';
import { cloudPath } from '@/http/index';
export default {
	name: 'buy',
	components: { PageHeader },
	data() {
		return {
			image: 'image',
			circle: 30,
			userImg: '',
			progress: 0,
			locahImg: '',
			fileList: [],
			wechatNun: '',
			text: '',
			imgUrl: '',
			hideSubmit: false,
			previewImg: false,
			showProgress: false,
			gradientColor: {
				'0%': '#3fecff',
				'100%': '#6149f6',
			},
		};
	},
	created() {
		this.title = this.$route.meta.title;
	},
	methods: {
		formatter(value) {
			return value.replace(/[\u4e00-\u9fa5]/g, '');
		},
		//上传腾讯云
		uploadFile(file) {
			this.userImg = file.content;
			uploadColImg({}).then(res => {
				let ceratUid = uuid();
				this.locahImg = res.img_url + 'fcWechatImg/' + ceratUid;
				const cos = new COS({
					getAuthorization: (options, callback) => {
						callback({
							StartTime: res.start_time,
							ExpiredTime: res.expired_time,
							TmpSecretId: res.tmp_secret_id,
							TmpSecretKey: res.tmp_secret_key,
							XCosSecurityToken: res.session_token,
						});
					},
				});
				cos.putObject(
					{
						Bucket: res.bucket,
						Region: res.region,
						Key: '/fcWechatImg/' + ceratUid,
						StorageClass: 'STANDARD',
						Body: file.file,
						onProgress: beforePro => {},
					},
					(err, res) => {
						console.log(res);
					}
				);
			});
		},

		imgProgres(progres) {
			if (this.progress == 100) {
				this.progress = 0;
				this.showProgress = false;
				window.clearInterval(progres);
			}
		},
		// 删除图片
		detailImg(file) {
			this.locahImg = '';
			this.fileList = [];
		},
		// 预览图片
		previewImage() {
			this.previewImg = true;
		},
		// 添加微信
		submitBtn() {
			let flag = true;
			const verify = [
				{ name: '个人信息截图', value: this.userImg },
				{ name: '微信号', value: this.wechatNun },
			];
			verify.forEach(item => {
				if (!item.value) {
					// this.$forceUpdate();
					// this.$router.go(0);
					this.$toast(this.$t(`${item.name}不能为空`));
					// this.reload();
					flag = false;
					// return
				}
			});
			if (flag) {
				this.hideSubmit = true;
				let param = {
					url: this.locahImg,
					Wx: this.wechatNun,
				};
				bingWechat(param).then(res => {
					this.$toast('添加完成');
					setTimeout(() => {
						this.hideSubmit = false;
						this.$router.go(-1);
					}, 500);
					// setTimeout(()=>{
					//     this.$router.push("/home");
					// },500)
				});
			}
		},
	},
};
</script>
<style>
.mobile_class .van-field__label {
	width: 85px;
	padding: 5px 0;
	color: #2c3e50;
	margin-right: 0;
}
.mobile_class .van-cell__value {
	background-color: #f2f2f2;
	padding: 5px 12px;
	border-radius: 5px;
}
</style>
<style lang="scss" scoped>
.van-overlay {
	height: 100%;
	position: absolute;
	top: 0;
	background-color: rgba(0, 0, 0, 0.9);
}
.screen_down {
	width: 100%;
	height: 100vh;
	float: left;
	position: relative;
	.preview_img {
		display: block;
		width: 100%;
		position: absolute;
		top: 8%;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}
}
.task_content {
	width: 100%;
	height: 100vh;
	float: left;
	overflow-y: scroll;
	background-color: #fff;
	.empoty_collaps {
		margin-top: 90px;
	}
	.mobile_class {
		width: 100%;
		float: left;
		padding: 20px 30px;
		.van-hairline--top-bottom::after,
		.van-hairline-unset--top-bottom::after {
			border-width: 0;
		}
		.van-cell {
			float: left;
			padding: 10px 0;
			border-radius: 4px;
			// border: 1px solid #f2f2f2;
			// background-color: #fff;
		}
	}
	.screen_list {
		width: 100%;
		float: left;
		margin-top: 14px;
		float: left;
	}
}
.uploaup_file {
	width: 100%;
	float: left;
	padding: 0 30px;
	box-sizing: border-box;
	position: relative;
	.img_tips {
		float: left;
		width: 170px;
		text-align: left;
		font-size: 0.28rem;
		margin: 12px 0;
	}
	.van-uploader {
		float: left;
	}
	.head_img {
		width: 255px;
		height: 255px;
		float: left;
		position: relative;
		margin: 0 20px 20px 0;
		img {
			display: block;
			width: 100%;
			height: 100%;
		}
	}
	.progress_class {
		width: 256px;
		height: 257px;
		box-sizing: border-box;
		background-color: #f2f2f2;
		position: absolute;
		top: 0;
		left: 200px;
		.van-circle {
			width: 80px !important;
			display: table;
			margin: 0 auto;
			margin-top: 5px;
		}
	}
}
.submit_btn {
	width: 100%;
	float: left;
	padding: 0 30px;
	margin-top: 70px;
	box-sizing: border-box;
	.van-button {
		width: 100%;
		font-size: 0.28rem;
		border-radius: 4px;
		border-color: #fd6526;
		background-color: #fd6526;
	}
	.explain_title,
	.task_text {
		width: 100%;
		float: left;
		font-size: 0.3rem;
		margin-top: 20px;
	}
	.explain_title {
		span {
			font-size: 0.28rem;
			font-weight: 550;
		}
	}
	.task_text {
		margin-top: 10px;
		line-height: 0;
		.van-cell {
			padding: 0;
			font-size: 0.28rem;
			margin-bottom: 5px;
			line-height: initial;
			background-color: transparent;
		}
	}
}
</style>
