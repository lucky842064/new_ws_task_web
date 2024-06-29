import request from '@/utils/request'

/*** 用户管理*/
export const getappuserlist = (params)=> {
  return request({url:'/adminmember/getappuserlist',method:'post',data:params})
}
export const gettaskrecordlist = (params)=> {
  return request({url:'/record/gettaskrecordlist',method:'post',data:params})
}
export const getbillrecordlist = (params)=> {
  return request({url:'/record/getbillrecordlist',method:'post',data:params})
}