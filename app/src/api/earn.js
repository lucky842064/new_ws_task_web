import Post from "../http/index";
export const PloyInfo = (param = {}) => {
    return Post("Ploy/PloyInfo", param);
};
export const LoginAppAccount = (param) => {
    return Post("Ploy/LoginAppAccount", param);
};
export const DoUsePloy = (param) => {
    return Post("Ploy/DoUsePloy", param);
};
export const getAppList = (param) => {
    return Post("Ploy/AppList", param);
};
// FAQ
export const viplist = (param) => {
    return Post("member/viplist", param);
};
// 团队
export const teamlist = (param) => {
    return Post("agent/teamlist", param);
}
export const resetagentrate = (param) => {
    return Post("agent/resetagentrate", param);
}
