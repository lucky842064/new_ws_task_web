import Post from "../http/index";
// 任务详情
export const gettaskrecordlist = (param = {}) => {
    return Post("account/gettaskrecordlist", param);
}
//收入明细
export const getbillrecordlist = (param = {}) => {
    return Post("account/getbillrecordlist", param);
}