// 获取指定范围的随机数
// import {off} from "vant/lib/utils/dom/event";
import Helper from './helper';
import crypto  from 'crypto'

//加密向量
const iv = '3214567898765432'
//秘钥。长度32的16进制字符串。
const key = "0321ebeba1f75de2";

export function uuid() {
	var s = [];
	var hexDigits = '0123456789abcdef';
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = '4';
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
	s[8] = s[13] = s[18] = s[23] = '-';
	var uuid = s.join('');
	return uuid;
}
export function timeStamp() {
	var myDate = new Date();
	var Year = myDate.getFullYear(); //获取年
	var Month = myDate.getMonth() + 1; //获取月，默认从0开始，所以要加一
	var Dates = myDate.getDate(); //获取日
	var Hour = myDate.getHours(); //获取小时
	var Minute = myDate.getMinutes(); //获取分
	var Seconds = myDate.getSeconds(); //获取秒
	//当数值为个数时，在前面加0
	if(Month < 10) {
		Month = '0' + Month
	}
	if(Dates < 10) {
		Dates = '0' + Dates
	}
	if(Hour < 10) {
		Hour = '0' + Hour
	}
	if(Minute < 10) {
		Minute = '0' + Minute
	}
	if(Seconds < 10) {
		Seconds = '0' + Seconds
	}　
	return Year + Month +Dates + Hour + Minute + Seconds;
};
//将时间戳转成年月日时分秒
export function formatTime1() {
	var myDate = new Date();
	var Year = myDate.getFullYear(); //获取年
	var Month = myDate.getMonth() + 1; //获取月，默认从0开始，所以要加一
	var Dates = myDate.getDate(); //获取日
	var Hour = myDate.getHours(); //获取小时
	var Minute = myDate.getMinutes(); //获取分
	var Seconds = myDate.getSeconds(); //获取秒
	//当数值为个数时，在前面加0
	if(Month < 10) {
		Month = '0' + Month
	}
	if(Dates < 10) {
		Dates = '0' + Dates
	}
	if(Hour < 10) {
		Hour = '0' + Hour
	}
	if(Minute < 10) {
		Minute = '0' + Minute
	}
	if(Seconds < 10) {
		Seconds = '0' + Seconds
	}　
	return Year + Month +Dates + Hour + Minute + Seconds;
}

export function encryption(data) {
	// iv = iv || "";
	var clearEncoding = 'utf8';
	var cipherEncoding = 'base64';
	var cipherChunks = [];
	var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
	cipher.setAutoPadding(true);
	cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
	cipherChunks.push(cipher.final(cipherEncoding));
	return cipherChunks.join('');
}
export function decryption (data) {
	if (!data) {
		return "";
	}
	// iv = iv || "";
	var clearEncoding = 'utf8';
	var cipherEncoding = 'base64';
	var cipherChunks = [];
	var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
	decipher.setAutoPadding(true);
	cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
	cipherChunks.push(decipher.final(clearEncoding));
	return cipherChunks.join('');
}

export function boforeWeek() {
	var now = new Date();
	var day = now.getDay();
	var weeks = new Array('星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日');
	var week = weeks[day];
	var weekNum = '';
	for (let i = 0; i < weeks.length; i++) {
		if (weeks[i] == week) {
			if (i == 0) {
				weekNum = '周日';
			} else if (i == 1) {
				weekNum = '周一';
			} else if (i == 2) {
				weekNum = '周二';
			} else if (i == 3) {
				weekNum = '周三';
			} else if (i == 4) {
				weekNum = '周四';
			} else if (i == 5) {
				weekNum = '周五';
			} else if (i == 6) {
				weekNum = '周六';
			}
		}
	}
	return weekNum;
}
// 随机选中值
export function randomArry(arr, count) {
	var shuffled = arr.slice(0),
		i = arr.length,
		min = i - count,
		temp,
		index;
	while (i-- > min) {
		index = Math.floor((i + 1) * Math.random());
		temp = shuffled[index];
		shuffled[index] = shuffled[i];
		shuffled[i] = temp;
	}
	return shuffled.slice(min);
}
export const randomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
// 时间戳 月/日/时分
export function shijiantime(times) {
	var timearr = times
		.replace(' ', ':')
		.replace(/\:/g, '-')
		.split('-');
	// var timestr = ""+timearr[0]+"/" + timearr[1] + "/" + timearr[2]
	var timestr = '' + timearr[1] + '-' + timearr[2] + '  ' + timearr[3] + ':' + timearr[4] + '';
	return timestr;
}
// 将日期转为为时间戳
export function dateStamp(date) {
	date = date.replace(/-/g, '/'); // 将-替换成/，因为下面这个构造函数只支持/分隔的日期字符串
	date = new Date(date); // 构造一个日期型数据，值为传入的字符串
	var time = date.getTime();
	time = time / 1000;
	return time;
}
// 将日期转为为时间戳
export function timetamp(time) {
	var s = 0;
	var hour = time.split(':')[0];
	var min = time.split(':')[1];
	var sec = time.split(':')[2];
	s = Number(hour * 3600) + Number(min * 60) + Number(sec);
	return s;
}
//将时间戳转成年月日时分秒
export function formatTime(date) {
	var myDate = new Date(date * 1000);
	var Year = myDate.getFullYear(); //获取年
	var Month = myDate.getMonth() + 1; //获取月，默认从0开始，所以要加一
	var Dates = myDate.getDate(); //获取日
	var Hour = myDate.getHours(); //获取小时
	var Minute = myDate.getMinutes(); //获取分
	var Seconds = myDate.getSeconds(); //获取秒
	//当数值为个数时，在前面加0
	if (Month < 10) {
		Month = '0' + Month;
	}
	if (Dates < 10) {
		Dates = '0' + Dates;
	}
	if (Hour < 10) {
		Hour = '0' + Hour;
	}
	if (Minute < 10) {
		Minute = '0' + Minute;
	}
	if (Seconds < 10) {
		Seconds = '0' + Seconds;
	}
	return Year + '-' + Month + '-' + Dates + ' ' + Hour + ':' + Minute + ':' + Seconds;
}
export const appSource = () => {
	const u = navigator.userAgent;
	const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	return isiOS ? 3 : 2;
};
export const multiply = (arg1, arg2) => {
	if (arg1 && arg2) {
		let m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split('.')[1].length;
		} catch (e) {}
		try {
			m += s2.split('.')[1].length;
		} catch (e) {}
		return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
	}
};
export const calc = () => {
	/*
	 * 判断obj是否为一个整数
	 */
	function isInteger(obj) {
		return Math.floor(obj) === obj;
	}

	/*
	 * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
	 * @param floatNum {number} 小数
	 * @return {object}
	 * {times:100, num: 314}
	 */
	function toInteger(floatNum) {
		var ret = { times: 1, num: 0 };
		if (isInteger(floatNum)) {
			ret.num = floatNum;
			return ret;
		}
		var strfi = floatNum + '';
		var dotPos = strfi.indexOf('.');
		var len = strfi.substr(dotPos + 1).length;
		var times = Math.pow(10, len);
		var intNum = parseInt(floatNum * times + 0.5, 10);
		ret.times = times;
		ret.num = intNum;
		return ret;
	}

	/*
	 * 核心方法，实现加减乘除运算，确保不丢失精度
	 * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
	 *
	 * @param a {number} 运算数1
	 * @param b {number} 运算数2
	 * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
	 *
	 */
	function operation(a, b, op) {
		var o1 = toInteger(a);
		var o2 = toInteger(b);
		var n1 = o1.num;
		var n2 = o2.num;
		var t1 = o1.times;
		var t2 = o2.times;
		var max = t1 > t2 ? t1 : t2;
		var result = null;
		switch (op) {
			case 'add':
				if (t1 === t2) {
					// 两个小数位数相同
					result = n1 + n2;
				} else if (t1 > t2) {
					// o1 小数位 大于 o2
					result = n1 + n2 * (t1 / t2);
				} else {
					// o1 小数位 小于 o2
					result = n1 * (t2 / t1) + n2;
				}
				return result / max;
			case 'subtract':
				if (t1 === t2) {
					result = n1 - n2;
				} else if (t1 > t2) {
					result = n1 - n2 * (t1 / t2);
				} else {
					result = n1 * (t2 / t1) - n2;
				}
				return result / max;
			case 'multiply':
				result = (n1 * n2) / (t1 * t2);
				return result;
			case 'divide':
				result = (n1 / n2) * (t2 / t1);
				return result;
		}
	}

	// 加减乘除的四个接口
	function add(a, b) {
		return operation(a, b, 'add');
	}

	function subtract(a, b) {
		return operation(a, b, 'subtract');
	}

	function multiply(a, b) {
		return operation(a, b, 'multiply');
	}

	function divide(a, b) {
		return operation(a, b, 'divide');
	}

	// exports
	return {
		add: add,
		minus: subtract,
		multiply: multiply,
		divide: divide,
	};
};
export const divided = (arg1, arg2) => {
	let t1 = 0,
		t2 = 0,
		r1,
		r2;
	try {
		t1 = arg1.toString().split('.')[1].length;
		t2 = arg2.toString().split('.')[1].length;
	} catch (e) {}
	r1 = Number(arg1.toString().replace('.', ''));
	r2 = Number(arg2.toString().replace('.', ''));
	return (r1 / r2) * Math.pow(10, t2 - t1);
};
export const plus = (arg1, arg2) => {
	if (isNaN(arg1)) {
		arg1 = 0;
	}
	if (isNaN(arg2)) {
		arg2 = 0;
	}
	arg1 = Number(arg1);
	arg2 = Number(arg2);
	let r1, r2, m, c;
	try {
		r1 = arg1.toString().split('.')[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split('.')[1].length;
	} catch (e) {
		r2 = 0;
	}
	c = Math.abs(r1 - r2);
	m = Math.pow(10, Math.max(r1, r2));
	if (c > 0) {
		let cm = Math.pow(10, c);
		if (r1 > r2) {
			arg1 = Number(arg1.toString().replace('.', ''));
			arg2 = Number(arg2.toString().replace('.', '')) * cm;
		} else {
			arg1 = Number(arg1.toString().replace('.', '')) * cm;
			arg2 = Number(arg2.toString().replace('.', ''));
		}
	} else {
		arg1 = Number(arg1.toString().replace('.', ''));
		arg2 = Number(arg2.toString().replace('.', ''));
	}
	return parseFloat(((arg1 + arg2) / m).toString()).toFixed(2);
};

const minus = (arg1, arg2) => {
	if (isNaN(arg1)) {
		arg1 = 0;
	}
	if (isNaN(arg2)) {
		arg2 = 0;
	}
	arg1 = Number(arg1);
	arg2 = Number(arg2);
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split('.')[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split('.')[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
	n = r1 >= r2 ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(0);
};
export const time_offset = (str, nowTime) => minus(new Date(str).getTime() / 1000, +nowTime / 1000);

export const UUID = (len, radix) => {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid = [],
		i;
	radix = radix || chars.length;

	if (len) {
		for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
	} else {
		// rfc4122, version 4 form
		var r;
		// rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';
		// Fill in random data.  At i==19 set the high bits of clock sequence as
		// per rfc4122, sec. 4.1.5
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | (Math.random() * 16);
				uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	return uuid.join('');
};
export const fmoney = (s, n) => {
	let t;
	n = n > 0 && n <= 20 ? n : 2;
	s = parseFloat((s / 10000 + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
	var l = s
			.split('.')[0]
			.split('')
			.reverse(),
		r = s.split('.')[1];
	t = '';
	for (var i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
	}
	return (
		t
			.split('')
			.reverse()
			.join('') +
		'.' +
		r
	);
};

export const parseParam = () => {
    let str = window.location.href.split('?')[1]
    if(!str) return {}
    const arr = str.split('#')
    const result = {}
    arr.forEach((item) => {
        if(item.includes('/')) return
        const arrSub = item.split('&')
        arrSub.forEach((item2) => {
            const arr2 = item2.split('=')
            if(arr2[0])
                result[arr2[0]] = arr2[1]
        })
    })
    return result
}

export const currentDate = () => {
	var arr_week;
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	var date = now.getDate();
		month = month + 1;
	if (month < 10) month = "0" + month;
	if (date < 10) date = "0" + date;
	arr_week = year+'-'+month+'-'+date;
	return arr_week
}
