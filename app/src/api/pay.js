import ajax from "../http";
import Post from "../http/index";
export const get_pay_type = (params = {}) => {
    return Post('wealth/downpaylist', params);
};
export const get_channel = (params) => {
    return ajax.get('/fund/cashin/cashinlist', params)
};
export const bank_deposit = (params = {}) => {
    return ajax.get('/fund/cashin/companycardtradepar', params)
};
export const deposit_pay = (params = {}) => {
    return Post('wealth/payorder', params)
};
export const wealthinfo = (params = {}) => {
    return Post('wealth/wealthinfo', params)
}
export const putpoint = (params = {}) => {
    return Post('wealth/putpoint', params)
};
export const payvip = (params = {}) => {
    return Post('wealth/payvip', params)
};
export const pay_item_list = param => {
    return Post("member/payitemlist", param);
};

// 新接口

// 获取提现信息
export const getwithdrawcard = param => {
    return Post("account/getwithdrawcard", param);
};
// 发起提现
export const savewithdrawapproval = param => {
    return Post("account/savewithdrawapproval", param);
}
// 修改提现信息
export const dowithdrawcard = (params = {}) => {
    return Post('account/dowithdrawcard', params);
};