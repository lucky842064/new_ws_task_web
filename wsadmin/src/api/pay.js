import request from '@/utils/request'

/*** 财务管理*/
export const getwithdrawapprovallist = (params)=> {
  return request({url:'/withdraw/getwithdrawapprovallist',method:'post',data:params})
}
export const dowithdrawapproval = (params)=> {
  return request({url:'/withdraw/dowithdrawapproval',method:'post',data:params})
}
export const getwithdrawreviselist = (params)=> {
  return request({url:'/withdraw/getwithdrawreviselist',method:'post',data:params})
}
export const dowithdrawrevise = (params)=> {
  return request({url:'/withdraw/dowithdrawrevise',method:'post',data:params})
}