<template>
	<van-popup v-model="show" position="left" safe-area-inset-bottom class="calendar" @closed="handleCalendarClosed" @opened="handleCalendarOpened">
		<van-calendar ref="calendar" :poppable="false" allow-same-day color="#101a52" type="range" @confirm="onCalendarConfirm" @select="onCalendarSelect" :default-date="null" :minDate="minDate" :maxDate="maxDate">
			<div slot="title" class="calendar-header">
				<icon class="icon" name="fanhui_m" @click="handleBack"></icon>
				<div class="title">日期选择</div>
				<span class="clear" v-show="startDate" @click.stop="handleClearDate">清除</span>
			</div>
			<div slot="footer" class="calendar-footer dis-flex flex-y-center">
				<div class="flex-box f-14 text">
					<p>开始时间：{{ start }}</p>
					<p>结束时间：{{ end }}</p>
				</div>
				<van-button color="#101a52" :disabled="isDisabled" @click="onCalendarConfirm">确定</van-button>
			</div>
		</van-calendar>
		<van-popup v-model="showPicker" round position="bottom" @opened="handlePopupOpen">
			<van-picker ref="picker" show-toolbar :columns="columns" @cancel="showPicker = false" @change="onPickerChange" swipe-duration="500" visible-item-count="5">
				<div class="picker-title">{{ pickerText }}</div>
			</van-picker>
		</van-popup>
	</van-popup>
</template>
<script>
import { Popup, Picker, Calendar, Button } from 'vant';
import moment from 'moment';
const columns = [
	{ values: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'], defaultIndex: 0 },
	{ values: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'], defaultIndex: 0 },
	{ values: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'], defaultIndex: 0 },
];
function initData() {
	return { pickerText: '开始时间', show: false, isDisabled: true, showPicker: false, startDate: '', endDate: '', startTime: '', endTime: '' };
}
export default {
	name: 'Calender',
	components: { VanPopup: Popup, VanPicker: Picker, VanCalendar: Calendar, VanButton: Button },
	data() {
		return {
			minDate: moment()
				.subtract(90, 'day')
				.toDate(),
			maxDate: new Date(),
			columns,
			...initData(),
		};
	},
	watch: {
		startDate() {
			this.isDisabled = true;
		},
		endTime(val) {
			if (!val) {
				return;
			}
			if (moment(this.end).isBefore(moment(this.start))) {
				this.startTime = this.endTime;
			}
			this.isDisabled = false;
		},
	},
	computed: {
		start() {
			return this.startDate + ' ' + this.startTime;
		},
		end() {
			return this.endDate + ' ' + this.endTime;
		},
	},
	methods: {
		handleClearDate() {
			this.$refs.calendar.reset();
			Object.assign(this.$data, { pickerText: '开始时间', isDisabled: true, startDate: '', endDate: '', startTime: '', endTime: '' });
		},
		handleCalendarOpened() {
			const calendarBody = document.getElementsByClassName('van-calendar__body')[0];
			calendarBody.scrollTo({ top: calendarBody.scrollHeight, behavior: 'smooth' });
		},
		showCalender() {
			this.show = true;
		},
		handleCalendarClosed() {
			this.$refs.calendar.reset();
			Object.assign(this.$data, initData());
		},
		handleBack() {
			this.show = false;
		},
		handlePopupOpen() {
			if (this.pickerText === '开始时间') {
				this.$refs.picker.setIndexes([8, 0, 0]);
			}
			const value = this.$refs.picker.getValues();
			const str = value.join(':');
			if (this.pickerText === '开始时间') {
				this.startTime = str;
				return;
			}
			this.endTime = str;
		},
		onPickerChange(el, value) {
			const str = value.join(':');
			if (this.pickerText === '开始时间') {
				this.startTime = str;
				return;
			}
			this.endTime = str;
		},
		onCalendarConfirm() {
			this.$emit('confirm', { startTime: this.start, endTime: this.end });
			this.show = false;
		},
		onCalendarSelect(val) {
			if (val[1]) {
				this.endDate = moment(val[1]).format('YYYY-MM-DD');
				this.pickerText = '结束时间';
			} else {
				if (this.end) {
					this.endDate = '';
					this.endTime = '';
				}
				this.startDate = moment(val[0]).format('YYYY-MM-DD');
				this.pickerText = '开始时间';
			}
			this.showPicker = true;
		},
	},
};
</script>
<style scoped lang="scss">
.calendar {
	width: 100%;
	height: 100%;
	.calendar-header {
		position: relative;
		.icon {
			position: absolute;
			left: 8px;
			top: 50%;
			width: 24px;
			height: 24px;
			line-height: 24px;
			padding: 0 6px;
			transform: translateY(-50%);
		}
		.title {
			text-align: center;
		}
		.clear {
			position: absolute;
			right: 8px;
			top: 50%;
			height: 24px;
			line-height: 24px;
			padding: 0 6px;
			transform: translateY(-50%);
		}
	}
	.calendar-footer {
		padding: 6px 0;
		.text {
			line-height: 20px;
		}
	}
	::v-deep .van-picker__toolbar {
		justify-content: center;
		font-weight: 500;
	}
}
</style>
