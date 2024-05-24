import ajax from "../http";

//跑马灯数据
export const get_marquee = (params = {}) => {
	return ajax.get('/website/announcement/page', params);
};
//站内信未读
export const get_message = () => {
	return ajax.get("/website/message/unread")
};
//站内信列表
export const get_message_list = (params = {}) => {
	return ajax.get("/website/message/list", params)
};
//站内信标记已读
export const message_mark_read = () => {
	return ajax.get("/website/message/markRead")
};
//获取站内信详情
export const get_message_detail = (params = {}) => {
	return ajax.get("/website/message/detail", params)
};
//获取横幅
export const get_banner = (params = {}) => {
	return ajax.get('/website/banner/list', params);
};
export const applicable_wechat = (type) => {
	return ajax.get(`/member/wechat/${type}`);
}
//获取任务列表 （我的任务）
export const get_task_list = (params = {}) => {
	return ajax.get('/bus/task/page', params);
};
//获取任务列表 （首页-已经申请的任务列表）
export const get_apply_list = (params = {}) => {
	return ajax.get('/bus/task/get_apply', params);
};
//获取任务列表 （首页-申请中的任务列表）
export const get_applying_list = () => {
	return ajax.get('/member/wechat/get_apply_task');
}
//申请任务（旧）
export const apply_task = (wechat_id, type, label) => {
	return ajax.post('/bus/task/apply/' + wechat_id + '/' + type, {
		label: label
	});
};
//（加粉）提交审核
export const task_verify = (task_id, params) => {
	return ajax.post('/bus/task/audit-all/' + task_id, params)
};

//开始或结束任务
export const change_status = (id, status) => {
	return ajax.put('/bus/task/status?id=' + id + '&status=' + status);
};
//获取任务详情
export const task_details = (task_id) => {
	return ajax.get('/bus/task/' + task_id);
};
//子任务提交审核
export const sub_task_verify = (params = {}) => {
	return ajax.post('/bus/task/audit', params);
};
//获取推广码
export const get_promo_code = () => {
	return ajax.get("/member/get_referrer_code");
};
//根据子任务手机匹配主任务
export const get_by_phone = (phone, params) => {
	return ajax.get(`/bus/task/phone/${phone}`, params);
};

//获取网站配置信息：是否维护
export const getWebConfig = (params = {}) => {
	return ajax.get("/website/setting/info", params);
};
//获取APP下载地址
export const getDownloadUrl = (params = {}) => {
	return ajax.get("/api/index/download", params);
};
//获取APP下载地址
export const get_app_url = (params = {}) => {
	return ajax.get("/member/down_load", params);
};
