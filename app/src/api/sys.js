import ajax from "../http/";

// 网站信息
export const ConfigInfo = (params = {}) => {
  return ajax.get("/website/setting");
};
export const websiteConfig = (params = {}) => {
  return ajax.get("/website/config");
};
// 客服
export const serviceList = (keyword = "") => {
  let t = keyword ? `/website/news/2/list?keyWord=${keyword}` : `/website/news/2/list`;
  return ajax.get(t);
};
//公告详情
export const serviceDetail = (id = "") => {
  return ajax.get(`/website/announcement/read/${id}`);
};
//公告列表
export const noticeList = (params) => {
  return ajax.get("/website/announcement/page",params);
};
//系统消息列表
export const sysMsgList = (params) => {
  return ajax.get("/website/message/list",params);
};
//系统消息详情
export const sysMsgDetail= (id) => {
  return ajax.get(`/website/message/detail?messageId=${id}`);
};
//系统消息已读
export const sysRead= () => {
  return ajax.get(`/website/message/markRead`);
}
//全部删除
export const sysDelte= () => {
  return ajax.get(`/website/message/delete`);
}


