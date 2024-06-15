import Post from "../http/index";
// 登录
export const login = (param) => {
    return Post("adminmember/login", param, {sendToken: false})
}
// 注册
export const register = (param) => {
    return Post("adminmember/register", param, {sendToken: false })
}
// 退出登录
export const logout = (param) => {
    return Post("adminmember/loginout", param)
}
// 获取验证码
export const getcode = (param) => {
    return Post("adminmember/code", param, {sendToken: false})
}

