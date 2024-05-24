// 文本裁剪
exports.formatString = ([value,len]) => {
	if (!value) return ''
	value = value.toString()
	return value.length > len ? value.slice(0,len)+'...' : value
};

// 千分位格式化
exports.fnumFormat = (num, fix = 2) => {
	if(!isNaN(num) && num !== null){
		return (Math.round(num * 100) / 100).toFixed(fix).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	} else {
		return '-';
	}
};

// 时间戳转yyyy-MM-dd HH:mm:ss
exports.getTime = (dateStr,isChat) => {
	var date = new Date(dateStr);
	var YY = date.getFullYear() + '-';
	var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
	var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	if (isChat) {
		return YY + MM + DD +" "+hh + mm;
	} else {
		return YY + MM + DD +" "+hh + mm + ss;
	}
};
// 时间戳转yyyy-MM-dd
exports.getDate = (date) => {
	let YY = date.getFullYear() + '-';
	let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
	return YY + MM + DD;
}
