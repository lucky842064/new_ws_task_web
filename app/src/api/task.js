import ajax from "../http";
import Post from "../http/index";
//任务剩余次数
export const remain_count = ()=>{
    return ajax.get('/task/member/task_count');
}
//获取会员任务列表
export const mytask = (params)=>{
    return Post('task/mytask',params);
}
//任务提交审核
export const submit_task = (params)=>{
    return Post('task/oktask',params)
}
// 领取任务 参数为任务计划列表的Id
export const receive_task = (params)=>{
    return Post(`task/gettask`,params)
}
// 任务列表 
export const task_collection=(params)=>{
    return Post(`task/tasklist`,params)
}
// 微信圈任务
export const reqfriendtask=(params)=>{
    return Post(`task/reqfriendtask`,params)
}
// 加入审核/取消
export const dofriendtask=(params)=>{
    return Post(`task/dofriendtask`,params)
}
// 申请加粉
export const applygrouptask=(params)=>{
    return Post(`task/applygrouptask`,params)
}
// 提交审核信息
export const reqgrouptask=(params)=>{
    return Post(`task/reqgrouptask`,params)
}
// 提交审核
export const commitgrouptask=(params)=>{
    return Post(`task/commitgrouptask`,params)
}
// 4.1_会员任务详情，接收会员任务Id
export const task_detail=(id)=>{
    return ajax.get(`/task/member/task/${id}`)
}
// 4.1_会员任务详情，接收会员任务Id
export const task_list=(params)=>{
    return Post(`task/tasklist`,params)
}
//标签列表
export const worktaglist=(params)=>{
    return Post(`task/worktaglist`,params)
}
//系统新增标签
export const createworktag=(params)=>{
    return Post(`task/createworktag`,params)
}
//自定义新增标签
export const doworktag=(params)=>{
    return Post(`task/doworktag`,params)
}
// Android
//启动加粉任务闹钟
export const setAlarmClock=(params)=>{
    return Post(`void/setAlarmClock`,params)
}
//取消加粉任务闹钟
export const cancelAlarmClock=(params)=>{
    return Post(`void/cancelAlarmClock`,params)
}

//启动加粉本地通知
export const addLocalNotification=(params)=>{
    return Post(`void/addLocalNotification`,params)
}
//取消加粉本地通知
export const cancelLocalNotification=(params)=>{
    return Post(`void/cancelLocalNotification`,params)
}
// ios
//启动一个本地通知
export const openIosClick=(params)=>{
    return Post(`void/addLocalNotification`,params)
}
//取消一个本地通知
export const cancelIosClick=(params)=>{
    return Post(`void/cancelAlarmClock`,params)
}
//下载excel
export const gettableurl=(params)=>{
    return Post(`task/gettableurl`,params)
}
//获取登录状态
export const getpadstate=(params)=>{
    return Post(`task/getpadstate`,params)
}
//获取登录二维码
export const getpadqrcode=(params)=>{
    return Post(`task/getpadqrcode`,params)
}


