<template>
	<div class="apply_content">
		<page-header style="position: fixed;top: 0;left: 0; z-index: 9;" :title="headTitle" :show-icon="true"></page-header>
		<!-- <div class="mobile_class">
            <van-cell-group>
                <van-field v-model = "wechatNun"  label="用户名" placeholder="请输入微信号"  right-icon-class="font-size: 28px;" :border="false" />
            </van-cell-group>
        </div> -->
		<div class="task_content">
			<div class="task_title">手机号：{{ taskMess.phone_no }}</div>
			<div class="wechat_num">
				微信号：
				<input type="text" v-model="taskMess.wechatNum" center clearable maxlength="30" placeholder="请输入微信号" />
			</div>
			<!-- <div class="wechat_num">微信昵称：{{ taskMess.nickName }}</div> -->
			<div class="task_title">任务ID：{{ taskMess.task_id }}</div>
			<!-- <div class="task_title" @click="showLable">
				<span class="left_title">分组标签：{{ checklable }}</span>
				<van-button class="speeedy_change" type="info">选择标签</van-button>
			</div> -->
		</div>
		<!-- <div class="upload">
			<div class="uploaup_file">
				<van-uploader v-show="!locahImg" :accept="'image/*'" max-count="1" :after-read="uploadFile" />
				<div class="head_img" v-if="locahImg">
					<img :src="userImg" ref="wechatImg" />
					<div class="van-uploader__preview-delete" @click="detailImg"><i class="van-icon van-icon-cross van-uploader__preview-delete-icon"></i></div>
				</div>
				<div class="progress_class" v-show="progress">
					<van-circle v-model="progress" :rate="progress1" :color="gradientColor" :text="text" />
				</div>
			</div>
			<div>{{ $t('u_friend') }}</div>
		</div> -->
		<div class="upload">
			<div class="uploaup_file">
				<van-uploader v-show="!locahImg1" :accept="'image/*'" max-count="1" :after-read="uploadFile1" />
				<div class="head_img" v-if="locahImg1">
					<img :src="userImg1" ref="wechatImg1" />
					<div class="van-uploader__preview-delete" @click="detailImg1"><i class="van-icon van-icon-cross van-uploader__preview-delete-icon"></i></div>
				</div>
				<div class="progress_class" v-show="progress1">
					<van-circle v-model="progress1" :rate="progress1" :color="gradientColor" :text="text" />
				</div>
			</div>
			<div>{{ $t('u_msg') }}</div>
		</div>
		<!-- <div class="upload">
			<div class="uploaup_file">
				<van-uploader v-show="!locahImg2" :accept="'video/*'" id="uploadFiles" max-count="1" :after-read="uploadFile2" />
				<div class="head_img" v-if="locahImg2">
					<img :src="userImg2" ref="wechatImg2" v-if="userImg2 && userImg2 != '上传成功'" />
					<span v-if="userImg2 == '上传成功'">上传成功</span>
					<div class="van-uploader__preview-delete" @click="detailImg2"><i class="van-icon van-icon-cross van-uploader__preview-delete-icon"></i></div>
				</div>
				<div class="progress_class" v-show="progress2">
					<van-circle v-model="progress2" :rate="progress2" :color="gradientColor" :text="text" />
				</div>
				<div class="img_tips"></div>
			</div>
			<div>提交审核视频</div>
		</div> -->
		<div class="submit_btn">
			<van-button type="primary" @click="submitBtn" @click.stop>提交审核</van-button>
			<!-- <div class="explain_title">
                <span class="divider_online"></span>
                <span>注意项</span>
            </div> -->
			<div class="task_text">
				<van-cell :border="false" title="1、当前查不到微信或异常状态下无法添加好友时，请上报异常状态，以免影响你任务的完成" />
				<van-cell :border="false" title="2、上报虚假的异常信息，将会被处罚，严重时会采取封号措施" />
			</div>
		</div>
		<popDialog :dataModel="dataModel" ref="showAuditModel" headEdit="1" :imgType="imgType" :showEdit="true" title="标签管理" titleContent="" :isCancel="false" :isConfirm="true" confirmName="确定" @cancel_btn="closeDialong" @confirm_btn="confirm_btn" @edit_btn="editLable">
			<template v-slot:content>
				<div class="custom_dialog__message">
					<div class="cuesome_lable">
						<van-cell-group>
							<van-field v-model="lableName" @keyup="lableBlur" :disabled="true" center clearable maxLength="10" width="100" label="标签名称" placeholder="生成新标签" :border="false" use-button-slot>
								<van-button class="system_btn" slot="button" size="small" type="primary" @click="creatLable">系统生成</van-button>
							</van-field>
						</van-cell-group>
					</div>
					<div class="lable_list">
						<ul>
							<li v-for="(item, index) in lableList" :class="checklable == item.tag_name ? 'lable_class' : ''" :key="index" @click="changeLable(item)">
								<span class="lable_name">{{ item.tag_name }}({{ item.fan_num }})</span>
								<img class="del_img" v-if="imgType == 1 && item.tag_name != 'A000' && item.del != 1" src="@/assets/images/buy/den_icon.png" alt="" @click="delLable(item)" />
							</li>
						</ul>
					</div>
				</div>
			</template>
		</popDialog>
	</div>
</template>
<script>
import COS from 'cos-js-sdk-v5';
import { uuid } from '@/utils/tool';
import PageHeader from '@/components/Header';
import { uploadColImg, dofriendtask } from '@/api/user';
import { worktaglist, doworktag, createworktag } from '@/api/task';
import popDialog from '@/components/popDialog';
export default {
	name: 'buy',
	components: { PageHeader, popDialog },
	data() {
		return {
			timeInterval: null,
			headTitle: '',
			imgType: '0',
			progress: 0,
			progress1: 0,
			progress2: 0,
			image: 'image',
			lableName: '',
			checklable: '',
			userImg: '',
			userImg1: '',
			userImg2: '',
			taskMess: {},
			fileList: [],
			fileList1: [],
			lableList: [],
			friendList: [],
			friendListNum: -1,
			locahImg: '',
			locahImg1: '',
			locahImg2: '',
			wechatNun: '',
			maxChildLen: 0,
			maxLableLen: 0,
			doTypeNum: 0,
			dataModel: { show: false },
			text: '',
			gradientColor: {
				'0%': '#3fecff',
				'100%': '#6149f6',
			},
		};
	},
	created() {
		this.headTitle = this.$route.meta.title;
		if (this.$route.query.taskMess) {
			try {
				this.taskMess = JSON.parse(this.$route.query.taskMess);
			} catch (error) {
				this.taskMess = {};
			}
		}
		this.friendList = JSON.parse(sessionStorage.getItem('friendList'));
		this.friendListNum = JSON.parse(sessionStorage.getItem('reloadFriendList'));
		this.doTypeNum = JSON.parse(sessionStorage.getItem('doTypeNum'));
	},
	beforeDestroy() {
		this.clearInterval();
	},
	methods: {
		// 标签列表
		initLable() {
			let params = {
				work_id: Number(this.taskMess.wechat_id),
			};
			worktaglist(params).then(res => {
				this.maxChildLen = res.tag_max_fan;
				this.maxLableLen = res.tag_max_num;
				this.lableList = res.tag_list || [];
			});
		},
		lableBlur() {
			if (this.lableName) {
				this.checklable = '';
			}
		},
		// 创建标签
		showLable() {
			this.initLable();
			this.dataModel.show = true;
		},
		// 删除标签
		delLable(val) {
			this.publiclable(val.tag_name, 1);
		},
		// 选择标签
		changeLable(val) {
			this.lableName = '';
			this.imgType = '0';
			if (val.add == 1) {
				this.$toast('该标签粉数量已满');
			} else {
				this.checklable = val.tag_name;
			}
		},
		// 系统生成标签
		creatLable() {
			let LableLen = 0;
			for (let i = 0; i < this.lableList.length; i++) {
				if (this.lableList[i].fan_num < this.maxChildLen) {
					LableLen = i + 1;
				}
			}
			// let LableLen = this.lableList.filter(item => item.tag_max_fan < this.maxChildLen && item.length < this.maxLableLen).length;
			if (LableLen > 0) {
				this.$toast('还有未使用标签，暂不能生成新标签！');
			} else if (this.lableList.length >= this.maxLableLen) {
				this.$toast('标签已上限，暂不能生成新标签！');
			} else if (LableLen === 0) {
				this.checklable = '';
				createworktag({ work_id: Number(this.taskMess.wechat_id) }).then(res => {
					this.checklable = res.add_tag_name;
					this.lableName = res.add_tag_name;
					this.lableList = res.tag_list;
				});
			}
		},
		publiclable(lableName, type) {
			let params = {
				work_id: Number(this.taskMess.wechat_id),
				tag_name: lableName,
				do_type: type,
			};
			doworktag(params).then(res => {
				if (type == 1) {
					this.initLable();
					this.$toast('删除成功');
				} else {
					this.$toast('新增成功');
					this.checklable = this.lableName;
					this.dataModel.show = false;
				}
			});
		},
		editLable(type) {
			if (type == 0) {
				this.checklable = '';
				this.imgType = '1';
			} else {
				this.imgType = '0';
			}
		},
		// 关闭弹窗
		confirm_btn() {
			if (this.lableName == 'A000') {
				this.$toast('该标签已存在');
			} else if (this.lableName != '') {
				if (this.lableList.length < this.maxLableLen) {
					this.publiclable(this.lableName, 0);
				} else {
					this.dataModel.show = false;
				}
			} else if (this.checklable != '') {
				this.dataModel.show = false;
			} else {
				this.lableName = '';
				this.checklable = '';
				this.$toast('请选择标签');
			}
		},
		realUpload(file, dataUrl) {
			uploadColImg({}).then(res => {
				let ceratUid = uuid();
				let cos = new COS({
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
				cos.uploadFile(
					{
						Bucket: res.bucket,
						Region: res.region,
						Key: '/fcPowderImg/' + ceratUid + file.file.name,
						StorageClass: 'STANDARD',
						Body: file.file,
						SliceSize: 1024 * 1024 * 5,
						onProgress: progressData => {
							/* 非必须 */
							this.progress2 = parseInt(progressData.percent * 100);
							this.$forceUpdate();
						},
						onFileFinish: function(err, data, options) {
							console.log(options.Key + '上传' + (err ? '失败' : '完成'));
						},
					},
					(err, data) => {
						this.progress2 = 0;
						if (err) {
							return this.$toast('上传失败');
						}
						if (data && data.Location) {
							this.locahImg2 = res.img_url + 'fcPowderImg/' + ceratUid + file.file.name;
							this.userImg2 = dataUrl || '上传成功';
						} else {
							this.$toast('上传失败');
						}
					}
				);
			});
		},
		clearInterval() {
			if (this.timeInterval) {
				clearInterval(this.timeInterval);
				this.timeInterval = null;
			}
		},
		uploadFile2(file) {
			var _this = this;
			var video = document.createElement('video');
			video.setAttribute('crossOrigin', 'anonymous');
			video.setAttribute('preload', 'auto');
			video.setAttribute('muted', true);
			video.setAttribute('x5-video-player-type', 'h5');
			video.setAttribute('x5-video-player-fullscreen', 'true');
			video.setAttribute('x5-video-orientation', 'portraint');
			video.setAttribute('src', URL.createObjectURL(file.file));
			let dataUrl = '';
			var isLong = false;
			this.clearInterval();
			var out = false;
			this.timeInterval = setTimeout(() => {
				out = true;
				_this.realUpload(file, dataUrl);
			}, 1500);
			try {
				video.onloadedmetadata = function() {
					isLong = video.duration > 30;
					if (!isLong) {
						video.play(); //当视频j据加载完毕时，我们需要先播放视频，从而实现视频截图，解决视频图片空白的问题；
						setTimeout(() => {
							//设置定时器，播放500ms后,停止播放，然后用canvas生成图片；
							video.pause();
							let canvas = document.createElement('canvas');
							canvas.width = 200;
							canvas.height = (200 * video.videoHeight) / video.videoWidth;
							let ctx = canvas.getContext('2d');
							ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
							dataUrl = canvas.toDataURL('image/jpeg'); // 在ios端会出现，跳出视频播放的界面，我的解决办法如下
							video.remove(); //删除创建的视频标签
							_this.clearInterval();
							if (!out) {
								_this.realUpload(file, dataUrl);
							}
						}, 200);
					} else {
						_this.clearInterval();
						_this.$toast('请上传30秒以内视频');
					}
				};
			} catch (error) {
				_this.clearInterval();
				_this.$toast('上传失败请重试');
			}
		},
		uploadFile1(file) {
			uploadColImg({}).then(res => {
				let ceratUid = uuid();
				let cos = new COS({
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
				cos.uploadFile(
					{
						Bucket: res.bucket,
						Region: res.region,
						Key: '/fcPowderImg/' + ceratUid + file.file.name,
						StorageClass: 'STANDARD',
						Body: file.file,
						SliceSize: 1024 * 1024 * 5,
						onProgress: progressData => {
							/* 非必须 */
							this.progres1 = parseInt(progressData.percent * 100);
						},
						onFileFinish: function(err, data, options) {
							console.log(options.Key + '上传' + (err ? '失败' : '完成'));
						},
					},
					(err, data) => {
						this.progress1 = 0;
						if (err) {
							return this.$toast('上传失败');
						}
						if (data && data.Location) {
							this.locahImg1 = res.img_url + 'fcPowderImg/' + ceratUid + file.file.name;
							this.userImg1 = file.content;
						} else {
							this.$toast('上传失败');
						}
					}
				);
			});
		},
		// 上传图片
		uploadFile(file) {
			uploadColImg({}).then(res => {
				let ceratUid = uuid();
				let cos = new COS({
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
				cos.uploadFile(
					{
						Bucket: res.bucket,
						Region: res.region,
						Key: '/fcPowderImg/' + ceratUid + file.file.name,
						StorageClass: 'STANDARD',
						Body: file.file,
						SliceSize: 1024 * 1024 * 5,
						onProgress: progressData => {
							this.progres = parseInt(progressData.percent * 100);
						},
						onFileFinish: function(err, data, options) {
							console.log(options.Key + '上传' + (err ? '失败' : '完成'));
						},
					},
					(err, data) => {
						this.progress = 0;
						if (err) {
							return this.$toast('上传失败');
						}
						if (data && data.Location) {
							this.locahImg = res.img_url + 'fcPowderImg/' + ceratUid + file.file.name;
							this.userImg = file.content;
							this.$forceUpdate();
						} else {
							this.$toast('上传失败');
						}
					}
				);
			});
		},
		// 上传图片
		// uploadFile(file){
		//     const maxSize = 1024 * 1024 *4;
		//     const imgtype = file.file.name.toLowerCase().split('.').pop();
		//     console.log(imgtype)
		//     if(file.file.size > maxSize){
		//         this.$toast("上传图片不能大于3兆");
		//         return;
		//     }else if(imgtype != "png" && imgtype != "jpeg" && imgtype != "jpg"){
		//         this.$toast("请选择：jpg|png|jpeg格式图片");
		//         return;
		//     }
		//     this.showProgress = true;
		//     let progres = setInterval(()=>{
		//         this.progress = this.progress +1;
		//         this.text = this.progress + '%';
		//         this.imgProgres(progres);
		//     },100)
		//     let param = new FormData();
		//     param.append('file', file.file);
		//     uploadimage(param).then(res => {
		//         this.progress = 100;
		//         this.imgProgres(progres);
		//         this.userImg = res.url;
		//         let imgObj = {};imgObj.url = res.url;
		//         this.fileList.push(imgObj);
		//     });
		// },
		imgProgres(progres) {
			this.progress = 0;
			this.showProgress = false;
			window.clearInterval(progres);
		},
		// 删除图片
		detailImg() {
			this.locahImg = '';
			this.fileList = [];
		},
		detailImg1() {
			this.locahImg1 = '';
			this.fileList1 = [];
		},
		detailImg2() {
			this.locahImg2 = '';
			this.fileList2 = [];
		},
		// 提交审核
		submitBtn() {
			if (!this.taskMess.wechatNum) {
				this.$toast('请输入微信号');
				return;
			}
			// if (this.checklable == '') {
			// 	this.$toast('分组标签不能为空');
			// 	return;
			// }
			// if (this.locahImg == '') {
			// 	this.$toast('好友截图不能为空');
			// 	return;
			// }
			if (this.locahImg1 == '') {
				this.$toast('聊天截图不能为空');
			}
			if (false && this.locahImg2 == '') {
				this.$dialog.confirm({
					title: '温馨提示',
					message: '上传视频可以大幅提高审核成功率, 是否现在提交视频?',
					cancelButtonText: '提交任务',
					confirmButtonText: '提交视频',
					beforeClose: (action, done) => {
						done();
						if (action == 'confirm') {
							var a = document.getElementById('uploadFiles');
							a.click();
						} else {
							let params = {
								tag_name: this.checklable,
								phone_no: this.taskMess.phone_no,
								url: this.locahImg,
								url2: this.locahImg1,
								url3: this.locahImg2,
								task_order: this.taskMess.task_id,
								status: 2,
								wx_str: this.taskMess.wechatNum,
							};
							this.friendList[this.friendListNum].status = this.doTypeNum == 1 ? 2 : 3;
							this.friendList[this.friendListNum].tag_name = this.checklable;
							dofriendtask(params).then(res => {
								sessionStorage.setItem('friendList', JSON.stringify(this.friendList));
								this.checklable = this.lableName = '';
								this.$toast('申请已提交');
								setTimeout(() => {
									this.$router.back();
								}, 200);
							});
						}
					},
				});
				return;
			}
			let params = {
				tag_name: this.checklable,
				phone_no: this.taskMess.phone_no,
				// url: this.locahImg,
				url2: this.locahImg1,
				// url3: this.locahImg2,
				task_order: this.taskMess.task_id,
				status: 2,
				wx_str: this.taskMess.wechatNum,
			};
			this.friendList[this.friendListNum].status = this.doTypeNum == 1 ? 2 : 3;
			this.friendList[this.friendListNum].tag_name = this.checklable;
			dofriendtask(params).then(res => {
				sessionStorage.setItem('friendList', JSON.stringify(this.friendList));
				this.checklable = this.lableName = '';
				this.$toast('申请已提交');
				setTimeout(() => {
					this.$router.back();
				}, 200);
			});
		},
		// 关闭弹窗
		closeDialong() {
			this.imgType = '0';
			this.dataModel.show = false;
		},
	},
};
</script>
<style lang="scss">
.cuesome_lable {
	.van-field--disabled .van-field__label,
	.van-field__control:disabled {
		color: #323233 !important;
		// -webkit-text-fill-color: #323233;
	}
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
.apply_content {
	width: 100%;
	height: 100vh;
	float: left;
	overflow-y: scroll;
	// background-color: #f2f2f2;
	background-color: #fff;
	.task_content {
		width: 100%;
		float: left;
		padding: 0 30px;
		box-sizing: border-box;
		margin-top: 110px;
		.left_title {
			float: left;
		}
		.left_title:nth-child(1) {
			width: 4rem;
		}
		.task_title,
		.wechat_num {
			float: left;
			width: 100%;
			height: 80px;
			line-height: 80px;
			font-size: 32px;
			margin-bottom: 20px;
			border-bottom: 1px solid #f2f2f2;
			.speeedy_change {
				color: #fff;
				float: right;
				height: 0;
				padding: 37px 25px;
				border-color: #fd6526;
				background-color: #fd6526;
			}
		}
		.wechat_num {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			display: flex;
			align-items: center;
			::v-deep input {
				flex: 1;
				border: none;
				outline: none;
				box-shadow: none;
			}
		}
	}
}
.uploaup_file {
	float: left;
	max-height: 230px;
	background-color: #fff;
	padding: 0 20px;
	position: relative;
	box-sizing: border-box;
	.van-uploader {
		width: 110px;
		float: left;
	}
	.head_img {
		width: 204px;
		height: 220px;
		float: left;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		img {
			display: block;
			max-width: 204px;
			max-height: 220px;
		}
	}
	.progress_class {
		width: 1.9rem;
		height: 2.1rem;
		box-sizing: border-box;
		background-color: #f2f2f2;
		position: absolute;
		top: 0;
		left: 0.22rem;
		.van-circle {
			width: 80px !important;
			display: table;
			margin: 0 auto;
			margin-top: 5px;
		}
	}
	.img_tips {
		width: 60%;
		float: left;
		font-size: 0.28rem;
		.explain_title {
			margin-bottom: 20px;
		}
		.van-cell {
			font-size: 0.24rem;
			padding: 0;
			line-height: 18px;
			// background-color: #f2f2f2;
		}
	}
}
.submit_btn {
	width: 100%;
	float: left;
	padding: 0 30px;
	margin-top: 30px;
	box-sizing: border-box;
	.van-button {
		width: 100%;
		font-size: 0.32rem;
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
	.task_text {
		font-size: 0.28rem;
		margin-top: 30px;
		line-height: 0;
		.van-cell__title {
			line-height: initial;
		}
		.van-cell {
			margin-bottom: 12px;
			padding: 0;
			background-color: transparent;
		}
	}
}
// 标签弹窗
.lable_list {
	width: 100%;
	padding: 0 30px;
	margin: 20px 0 20px 0;
	box-sizing: border-box;
	ul {
		margin-right: -30px;
		li {
			width: 186px;
			display: inline-block;
			// height: 0;
			overflow: hidden;
			text-align: center;
			padding: 15px 20px;
			font-size: 0.24rem;
			background-color: #e8e8e8;
			margin-right: 30px;
			margin-bottom: 20px;
			border-radius: 35px;
			.lable_name {
				width: 100%;
				float: left;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				text-align: center;
			}
			.del_img {
				// position: absolute;
				// top: 24px;
				// right: 18px;
				width: 18px;
				height: 19px;
				float: right;
				margin-left: 10px;
				margin-top: -23px;
			}
		}
		.lable_class {
			background-color: #fee0be;
		}
	}
	.system_btn {
		border-color: #ff6422;
		background-color: #ff6422;
	}
}
.upload {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	width: 33%;
	& > div:nth-child(2) {
		margin-top: 0.08rem;
		text-align: center;
		display: inline-block;
		font-size: 0.26rem;
	}
}
</style>
