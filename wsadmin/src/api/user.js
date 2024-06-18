import request from '@/utils/request'

/*** 用户管理*/
export const getappuserlist = (params)=> {
  return request({url:'/adminmember/getappuserlist',method:'post',data:params})
}