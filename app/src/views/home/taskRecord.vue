<template>
	<div class="earn">
		<page-header style="position: fixed;top: 0;left: 0; z-index: 9;" :title="title" :show-icon="true"></page-header>
		<div class="screen_warp">
			<ul>
				<li class="all_state" :class="tabIndex == index ? 'active_class' : ''" v-for="(item, index) in taskType" :key="item.id" @click="simpleChange(index)">{{ item.name }}</li>
				<!-- <li class="screen_term" @click="showPopup">
                    <span class="screen_title">筛选</span>
                    <img src="../../assets/images/home/icon_shaixuan.png" alt="">
                </li> -->
			</ul>
			<div class="repair_bg_1"></div>
		</div>
		<div class="history_recors_warp">
			<div class="history_content" style="border: 1px solid #d0d0d0;border-bottom: 1px solid transparent;">
				<div class="van_cell_head">
					<ul>
						<li>任务状态</li>
						<li v-text="tabIndex === 0 ? '执行加粉时间' : '执行加粉时间'"></li>
						<li>任务收益</li>
					</ul>
				</div>
				<div class="van_cell_content">
					<span v-if="taskRecord.length > 0">
						<ul v-for="(iten, index) in taskRecord" :key="index">
							<li :style="iten.desc == '任务失败' ? 'color:#f56c6c;' : 'color:#67c23a;'">{{ iten.desc }}</li>
							<li>{{ iten.e_time }}</li>
							<li>{{ iten.point }}</li>
						</ul>
					</span>
					<span class="empty_content" v-else style="border-bottom: 1px solid #d0d0d0;">暂无任务记录</span>
				</div>
			</div>
		</div>
		<!-- 弹窗 -->
		<van-toast id="van-toast" />
		<van-popup class="task_popup" v-model="show" close-icon-position="top-left" round position="right" @close="onClose">
			<div class="task_model">
				<div class="task_head">任务状态</div>
				<div class="task_list">
					<span class="all_check" :class="allStatus == true ? 'active_class' : ''" @click="allCheng(0)">全部状态</span>
					<ul>
						<li :class="item.checked == true ? 'active_class' : ''" v-for="(item, index) in taskStatus" :key="index" @click="screenChange(item.id)">{{ item.name }}</li>
					</ul>
				</div>
			</div>
			<div class="task_model task_type_model">
				<div class="task_head">任务类型</div>
				<div class="task_list">
					<div class="all_check" :class="allType == true ? 'active_class' : ''" @click="allCheng(1)">全部类型</div>
					<ul>
						<li :class="item.checked == true ? 'active_class' : ''" v-for="(item, index) in taskType" :key="index" @click="typeChange(index)">{{ item.name }}</li>
					</ul>
				</div>
			</div>
			<van-button class="serach_btn" type="danger" @click="submitBtn">确认</van-button>
		</van-popup>
	</div>
</template>
<script>
import PageHeader from '@/components/Header';
import { mytask } from '@/api/user';
import { fmoney } from '@/utils/tool';
import moment from 'moment';
export default {
	components: { PageHeader },
	data() {
		return {
			tabIndex: 0,
			show: false,
			title: '',
			page: 1,
			limit: 99,
			typeLen: 0,
			stateLen: 0,
			allType: false,
			allStatus: false,
			taskRecord: [],
			historyArry: [
				{ task_type: 1, status: 0, point: 780 },
				{ task_type: 2, status: 1, point: 90 },
				{ task_type: 3, status: 2, point: 300 },
				{ task_type: 3, status: 3, point: 150 },
				{ task_type: 3, status: 4, point: 90 },
			],
			taskStatus: [
				{ id: -1, name: '申请中', checked: false },
				{ id: 0, name: '进行中', checked: false },
				{ id: 1, name: '已完成', checked: false },
				// {id:2,name:"已撤销",checked:false},
				{ id: 3, name: '已撤回', checked: false },
				{ id: 4, name: '审核中', checked: false },
				{ id: 5, name: '派码中', checked: false },
				// {id:6,name:"已失效",checked:false},
				// {id:7,name:"审核失败",checked:false},
				{ id: 8, name: '未开始', checked: false },
			],
			simpleStatus: [
				{ id: -1, name: '审核中', checked: false },
				{ id: 1, name: '已完成', checked: false },
				{ id: 5, name: '派码中', checked: false },
			],
			taskType: [
				{ name: '加粉任务', checked: false },
				// {name:"加粉任务",checked:false}
			],
			task_state: [-2],
			task_type: -1,
		};
	},
	created() {
		this.title = this.$route.meta.title;
		this.initTaskRecord();
	},
	methods: {
		showPopup() {
			this.show = true;
		},
		onClose() {
			this.show = false;
		},
		initTaskRecord(idx) {
			let params = {
				status: this.task_state,
				task_type: idx != undefined ? idx : this.tabIndex,
				page: this.page,
				limit: this.limit,
			};
			mytask(params).then(res => {
				if (res.list.length > 0) {
					let callHistory = res.list || [];
					for (let i = 0; i < callHistory.length; i++) {
						callHistory[i].point = fmoney(callHistory[i].point);
						if (callHistory[i].status != 1) {
							callHistory[i].point = '...';
						} else {
							callHistory[i].point = '￥' + callHistory[i].point;
						}
					}
					this.taskRecord = callHistory;
				} else {
					this.taskRecord = [];
				}
			});
		},
		// 单个筛选
		simpleChange(idx) {
			this.tabIndex = idx;
			// for(let k = 0;k < this.simpleStatus.length;k ++){
			//     if(this.simpleStatus[k].id == idx){
			//         let index = this.task_state.indexOf(Number(this.simpleStatus[k].id));
			//         if(this.simpleStatus[k].checked == true){
			//             this.simpleStatus[k].checked = false
			//             for(let j=0;j<this.taskStatus.length;j++){
			//                 if(this.taskStatus[j].id == idx){
			//                     this.taskStatus[j].checked = false;
			//                 }
			//             }
			//             this.task_state.splice(index,1);
			//         }else{
			//             this.simpleStatus[k].checked = true;
			//             this.task_state.push(Number(this.simpleStatus[k].id))
			//             for(let j=0;j<this.taskStatus.length;j++){
			//                 if(this.taskStatus[j].id == idx){
			//                     this.taskStatus[j].checked = true;
			//                 }
			//             }
			//         }
			//     }
			// }
			// if(this.task_state.indexOf(-2) > -1){
			//     this.task_state.splice(this.task_state.indexOf(-2),1);
			// }
			// if(this.task_state.length == 0){
			//     this.task_state.push(-2);
			// }
			this.initTaskRecord(idx);
		},
		// 全选
		allCheng(type) {
			let statusList, typeList;
			if (type == 0) {
				this.allStatus = !this.allStatus;
				statusList = this.taskStatus;
				for (let i = 0; i < statusList.length; i++) {
					if (this.allStatus == true) {
						statusList[i].checked = true;
						this.task_state = [];
						this.task_state.push(-2);
						for (let k = 0; k < this.simpleStatus.length; k++) {
							this.simpleStatus[k].checked = true;
						}
						this.stateLen = this.taskStatus.length;
					} else {
						statusList[i].checked = false;
						this.task_state = [];
						this.task_state.push(-2);
						for (let k = 0; k < this.simpleStatus.length; k++) {
							this.simpleStatus[k].checked = false;
						}
						this.stateLen = 0;
					}
				}
				this.taskStatus = statusList;
			} else {
				this.allType = !this.allType;
				typeList = this.taskType;
				for (let i = 0; i < typeList.length; i++) {
					if (this.allType == true) {
						typeList[i].checked = true;
						this.typeLen = this.taskType.length;
					} else {
						typeList[i].checked = false;
						this.typeLen = 0;
					}
				}
				this.taskType = typeList;
			}
		},
		// 状态单选
		screenChange(idx) {
			let lableLen = this.taskStatus.length;
			for (let i = 0; i < this.taskStatus.length; i++) {
				if (this.taskStatus[i].id == idx) {
					if (this.taskStatus[i].checked == true) {
						let index = this.task_state.indexOf(Number(this.taskStatus[i].id));
						this.taskStatus[i].checked = false;
						for (let k = 0; k < this.simpleStatus.length; k++) {
							if (this.simpleStatus[k].id == idx) {
								this.simpleStatus[k].checked = false;
							}
						}
						this.task_state.splice(index, 1);
						this.stateLen -= 1;
					} else {
						this.taskStatus[i].checked = true;
						this.task_state.push(Number(this.taskStatus[i].id));
						for (let k = 0; k < this.simpleStatus.length; k++) {
							if (this.simpleStatus[k].id == idx) {
								this.simpleStatus[k].checked = true;
							}
						}
						this.stateLen += 1;
					}
				}
			}
			if (this.stateLen == lableLen) {
				this.task_state = [];
				this.task_state.push(-2);
				this.allStatus = true;
			} else {
				this.allStatus = false;
				if (this.task_state.indexOf(-2) > -1) {
					this.task_state.splice(this.task_state.indexOf(-2), 1);
				}
				if (this.task_state.length == 0) {
					this.task_state.push(-2);
				}
			}
		},
		// 类型单选
		typeChange(idx) {
			let lableLen = this.taskType.length;
			for (let i = 0; i < this.taskType.length; i++) {
				if (i == idx) {
					if (this.taskType[i].checked == true) {
						this.taskType[i].checked = false;
						this.typeLen -= 1;
					} else {
						this.taskType[i].checked = true;
						this.typeLen += 1;
					}
				}
				if (this.taskType[i].name == '加粉任务' && this.taskType[i].checked == true && this.taskType[1].checked == false) {
					this.task_type = 0;
				} else if (this.taskType[i].name == '加粉任务' && this.taskType[i].checked == true && this.taskType[0].checked == false) {
					this.task_type = 1;
				} else if (this.taskType[0].checked == false && this.taskType[1].checked == false) {
					this.task_type = -1;
				} else if (this.taskType[0].checked == true && this.taskType[1].checked == true) {
					this.task_type = -1;
				}
			}
			if (this.typeLen == lableLen) {
				this.allType = true;
			} else {
				this.allType = false;
			}
		},
		// 格式化金额
		getEarnPoint(point) {
			return fmoney(point, 2);
		},
		// 查询
		submitBtn() {
			this.show = false;
			this.initTaskRecord();
		},
		// 任务详情
		taskDetail(val) {
			this.$router.push('/taskDetail');
		},
	},
};
</script>
<style lang="scss" scoped>
.earn {
	background: #fff;
	height: 100vh;
	overflow: auto;
	-webkit-overflow-scrolling: touch;
	// margin-bottom: 120px;
}
.screen_warp {
	width: 100%;
	height: 115px;
	margin-top: 90px;
	box-sizing: border-box;
	background-color: #fff;
	ul {
		width: 100%;
		float: left;
		padding: 19px 40px;
	}
	ul li {
		color: #000;
		float: left;
		font-size: 0.24rem;
	}
	.all_state,
	.all_type {
		width: 170px;
		padding: 8px 0;
		text-align: center;
		// line-height: 60px;
		border-radius: 35px;
		background-color: #f2f2f2;
	}
	.all_state:nth-child(even) {
		margin: 0 16px;
	}
}
.screen_warp .screen_term {
	float: right;
}
.screen_title {
	font-size: 0.28rem;
	line-height: 50px;
	float: left;
}
.screen_term {
	float: right;
	margin-top: 4px;
}
.screen_term img {
	width: 28px;
	height: 28px;
	float: left;
	margin: 7px 0 0 5px;
}
.repair_bg_1 {
	width: 100%;
	height: 20px;
	float: left;
	background: #f2f2f2;
}
.history_recors_warp {
	width: 100%;
	float: left;
	padding: 30px 40px;
	box-sizing: border-box;
}
.history_content {
	width: 100%;
	float: left;
	overflow: hidden;
	border-radius: 4px;
}
.van_cell_head {
	width: 100%;
	float: left;
	background-color: #f2f2f2;
}
.van_cell_head ul,
.van_cell_content ul {
	width: 100%;
	display: flex;
	font-size: 0.28rem;
}
.van_cell_head ul li,
.van_cell_content ul li {
	padding: 10px 0;
	text-align: center;
	flex-basis: 80px;
	border-bottom: 1px solid #d0d0d0;
}
.van_cell_head ul li:nth-child(1),
.van_cell_content ul li:nth-child(1) {
	flex: 1 2 240px;
}
.van_cell_head ul li:nth-child(2),
.van_cell_content ul li:nth-child(2) {
	flex: 1 1 240px;
	border-left: 1px solid #d0d0d0;
	border-right: 1px solid #d0d0d0;
}
.van_cell_head ul li:nth-child(3),
.van_cell_content ul li:nth-child(3) {
	flex: 1 2 240px;
}
.empty_content {
	width: 100%;
	float: left;
	padding: 20px 0;
	text-align: center;
	font-size: 0.28rem;
}

.task_model {
	width: 100%;
	float: left;
	font-size: 0.28rem;
	background-color: #fff;
	.task_head {
		font-size: 0.3rem;
	}
	.task_list {
		width: 100%;
		float: left;
		flex-direction: row;
		padding: 30px 27px 0 27px;
		ul li,
		.all_check {
			width: 175px;
			height: 60px;
			float: left;
			text-align: center;
			line-height: 60px;
			border-radius: 47px;
			margin: 0 12px 30px 0;
			background-color: #f2f2f2;
			border: 1px solid transparent;
		}
	}
}
.active_class {
	color: red !important;
	background-color: #ffd9e4 !important;
	border-color: red !important;
}
.task_type_model {
	margin-top: 20px;
	margin-bottom: 76px;
}
.serach_btn {
	font-size: 0.32rem;
	border-color: $color-theme;
	background-color: $color-theme;
}
</style>
