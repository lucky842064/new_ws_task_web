import Post from "../http/index";
// 查询收益
export const getincome = (param = {}) => {
    return Post("account/getincome", param);
}
// 获取ws列表
export const getaccountlist = (param = {}) => {
    return Post("account/getaccountlist", param);
}
// 获取二维码
export const getqrcode = (param = {}) => {
    return Post("account/getqrcode", param);
}
// 删除账号
export const delaccount = (param = {}) => {
    return Post("account/delaccount", param);
}