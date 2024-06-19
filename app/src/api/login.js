import Post from "../http/index";
// 登录
export const login = (param) => {
    return Post("adminmember/login", param, {sendToken: false})
}
// 注册
export const register = (param) => {
    return Post("adminmember/register", param, {sendToken: false })
}
// 修改密码
export const changepwd = (param) => {
    return Post("adminmember/changepwd", param, {sendToken: false })
}
// 退出登录
export const logout = (param) => {
    return Post("adminmember/loginout", param)
}
// 获取验证码
export const getcode = (param) => {
    return Post("adminmember/code", param, {sendToken: false})
}
// 轮播
export const getcarousellist = (param) => {
    return Post("adminmember/getcarousellist", param)
}

