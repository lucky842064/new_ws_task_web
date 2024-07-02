import Post from "../http/index";
// 账单明细
export const gettasknum = (param = {}) => {
    return Post("account/gettasknum", param);
}
export const getinvitenum = (param = {}) => {
    return Post("account/getinvitenum", param);
}
export const getinvitelink = (param = {}) => {
    return Post("account/getinvitelink", param);
}
