import Post from "../http/index";
import axios from '../http/axios'
// import client from "../http/aliyun-oss";
import Helper from "../utils/helper";
//登
// const OSS = require('ali-oss');
// 账号登入
export const login = (param) => {
  return Post("login/login", param, {
    sendToken: false
  });
};

//注册
export const register = (params = {}) => {
  return Post('login/register', params, {
    sendToken: false
  });
};
//查询微信/qq号
export const mycontact = (params = {}) => {
  return Post('msg/mycontact', params);
};
//提交微信/qq号
export const addcontact = (params = {}) => {
  return Post('msg/addcontact', params);
};
//注册找回密码 --获取验证码
export const getCaptcha = (params = {}) => {
  return Post('login/send', params, {
    sendToken: false
  });
};

// 修改密码， 提现 -- 获取验证码
export const sendcode = (params = {}) => {
  return Post('member/sendcode', params);
};

export const loginDigital = (params = {}) => {
  return Post('login/digital', params);
};

//登陆 --忘记密码
export const forgetPassword = (params = {}) => {
  return Post("login/forgotpwd", params);
};
//退出
export const logout = (params = {}) => {
  return Post("member/loginout", params)
};

//VIP列表
export const viplist = (params = {}) => {
  return Post("member/viplist", params);
};

// 任务列表
export const tasklist = (params = {}) => {
	return Post("task/tasklist", params);
};
// 提交拉分任务
export const grabtask = (params = {}) => {
	return Post("task/grabtask", params);
};
// 提交加粉任务
export const getgrouptask = (params = {}) => {
	return Post("task/getgrouptask", params);
};
// 我的任务
export const mytask = (params = {}) => {
	return Post("task/mytask", params);
};
// 推广
export const spreadList = (params = {}) => {
	return Post("agent/share", params);
};

// 返佣明细
export const giveflow = (params = {}) => {
	return Post("agent/giveflow", params);
};

export const member_level = () => {
  return ajax.get(`/level/list`);
}
export const level_info = () => {
  return ajax.get(`/level/info`);
}

//检验推荐码
export const check_code = (code) => {
  return ajax.url_get("/member/checkTCode/" + code);
};
//检验手机
export const check_mobile = (mobile) => {
  return ajax.url_get("/member/checkMobile/" + mobile);
};

//登陆 --获取用户信息

export const getUserInfo = (params = {}) => {
  return Post("member/index", params);
};
//客服列表
export const msgOnline = (params = {}) => {
  return Post("msg/online", params);
};

// 我的推广信息
export const my_promotion = (params = {}) => {
  return ajax.get("/member/referrer", params);
};
// 提现记录
export const pointflow = (params) => {
  return Post("wealth/putlist", params);
};

// 充值列表
export const payrecord = (params) => {
  return Post("wealth/payrecord", params);
};
//用户信息修改
export const myaccount = (params = {}) => {
  return Post("member/myaccount", params);
};
//添加银行卡
export const addbank = (params = {}) => {
  return Post('member/addbank', params);
};
//绑定银行卡
export const upbank = (params = {}) => {
  return Post('member/upbank', params);
};
//z
// 赠送查找
export const finduser = (params = {}) => {
  return Post('wealth/finduser', params);
};
// 送vip 
export const givevip = (params = {}) => {
  return Post('wealth/givevip', params);
};
//消息列表
export const msglist = (params = {}) => {
  return Post('msg/msglist', params);
};
//读消息
export const readmsg = (params = {}) => {
  return Post('msg/readmsg', params);
};
//修改密码
export const updateinfo = (params = {}) => {
  return Post('member/updateinfo', params);
};
//我的团队
export const myteam = (params = {}) => {
  return Post('/member/myteam', params);
};
//我的下级
export const myshare = (params = {}) => {
  return Post('/member/myshare', params);
};

// 上传图片
export const uploadimage = (params = {}) => {
  return Post('/login/uploadimage', params);
};
// 上传腾讯云图片
export const uploadColImg = (params = {}) => {
  return Post('/msg/osskey', params);
};
// 上传加粉图片
export const powderImg = (params = {}) => {
  return Post('/task/uploadimage', params);
};
// 绑定微信号
export const bingWechat = (params = {}) => {
  return Post('/member/addwx', params);
};
// 查询绑定微信号列表
export const wxaccountlist = (params = {}) => {
  return Post('/member/wxaccountlist', params);
};
// 微信启用/禁用
export const dowxaccount = (params = {}) => {
  return Post('/member/dowxaccount', params);
};
// 查询有效微信
export const workaccountlist = (params = {}) => {
  return Post('/member/workaccountlist', params);
};
// 查询有效微信
export const getfantask = (params = {}) => {
  return Post('/task/getfantask', params);
};
// 提交加粉任务
export const dofriendtask = (params = {}) => {
  return Post('/task/dofriendtask', params);
};
// 申请加群
export const applygrouptask = (params = {}) => {
  return Post('/task/applygrouptask', params);
};
export const getoss = (params = {}) => {
  return Post('member/getoss', params);
};

export const update_login_pwd = (pwd, oldPwd) => {
  return ajax.url_put(`/member/loginpwd?oldPwd=${oldPwd}&pwd=${pwd}`)
};

export const wechat_list = () => {
  return ajax.get('/member/wechat/list');
};
export const del_wechat = (id) => {
  return ajax.put('/member/wechat/del/' + id);
};
export const add_wechat = (params) => {
  return ajax.post('/member/wechat/add/', params);
};
export const upload_img = (file) => {
  return ajax.post_alter('/file/upload', file)
};
export const upload_img_new = (file) => {
  return axios.post('/file/upload', file)
};
export const oss_upload = (fileName, file, res) => {
  const fileUrl = Helper.gen_name(fileName)
  //   const client = new OSS({
  //     //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  //     accessKeyId:res.Credentials.AccessKeyId,
  //     accessKeySecret:res.Credentials.AccessKeySecret,
  //     stsToken:res.Credentials.SecurityToken,
  //     region: "oss-cn-hongkong.aliyuncs.com/",
  //     bucket: "aite-hk"
  // });
  // return client.multipartUpload(fileUrl, file)
}
export const withdraw_list = (params) => {
  return ajax.get('/member/withdraw/list', params);
};
export const deposit_list = (params) => {
  return ajax.get('/member/recharge/list', params);
};
//收益明细
export const profit_list = (params) => {
  return Post('wealth/pointflow', params);
};
//下级收益明细
export const profitDetail = (params) => {
  return Post('agent/pointflow', params);
};
export const sub_withdraw_list = (params) => {
  return ajax.get('/member/team/pay/list', params);
};

export const trade_list = (params) => {
  return ajax.get(`/member/trading/list/${params.type}`, params);
};
export const sub_teams = (params) => {
  return ajax.get('/member/team/info', params);
};
export const team_list = (params) => {
  return ajax.get('/member/team/list', params);
};
export const upgrade_info = (level_id) => {
  return ajax.url_get(`/level/upgrade/${level_id}`)
}

export const post_image = (params) => {
  return Post('member/postimg', params)
}

export const msg_helplist = (param) => {
  return Post("Msg/HelpList", param);
};

export const invitelist = (param) => {
  return Post("/member/invitelist", param);
};
export const getVersion = (param) => {
  return Post(`login/getappversion`, { ostype: 2, lang: "zh" },{ sendToken: false})
}

export const BetList = (param) => {
  return Post("Ploy/BetList", param);
};

export const heart = () => {
  return Post("Msg/HeartBeat")
}