import request from '@/utils/request'

/*** 通用配置*/
export const getsysconfiglist = (params)=> {
  return request({url:'/sysconfig/getsysconfiglist',method:'post',data:params})
}
export const dosysconfig = (params)=> {
    return request({url:'/sysconfig/dosysconfig',method:'post',data:params})
  }