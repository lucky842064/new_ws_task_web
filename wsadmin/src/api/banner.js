import request from '@/utils/request'

/*** 轮播管理*/
export const getcarousellist = (params)=> {
  return request({url:'/carousel/getcarousellist',method:'post',data:params})
}
export const docarousel = (params)=> {
    return request({url:'/carousel/docarousel',method:'post',data:params})
}
