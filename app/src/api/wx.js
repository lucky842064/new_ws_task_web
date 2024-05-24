import Post from "../http/index";

// 微信托管列表
export const memberAutoaccountlist = (params = {}) => {
    return Post('member/autoaccountlist', params);
};

// 开启/取消托管
export const memberDoauto = (params = {}) => {
    return Post('member/doauto', params);
};

// 扫码登陆
export const taskGetpadqrcode = (params = {}) => {
    return Post('task/getpadqrcode', params);
};

// 扫码登陆
export const taskGetpadstatemore = (params = {}) => {
    return Post('task/getpadstatemore', params);
};


// 获取二维码
export const newloginGetqrcode = (params = {}) => {
    return Post('/newlogin/getqrcode', params);
}

// 获取微信列表
export const newloginGetwxlist = (params = {}) => {
    return Post('/newlogin/getwxlist', params);
}

// 获取扫码省份
export const newloginGetcurrentprovince = (params = {}) => {
    return Post('/newlogin/getcurrentprovince', params);
}

// 获取扫码省份
export const newloginDeletewx = (params = {}) => {
    return Post('/newlogin/deletewx', params);
}

