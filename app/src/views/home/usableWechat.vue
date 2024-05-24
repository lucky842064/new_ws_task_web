<template>
    <div class="task_warp">
        <page-header style="position: fixed;top: 0;left: 0; z-index: 9;" :title="taskType == 0 ? '选择加粉微信':'选择加粉微信'" :show-icon="true"></page-header>
        <div class="task_content" v-if="taskList.length > 0">
            <van-pull-refresh v-model="showLoading" @refresh = "downRefresh">
                <van-loading size="24px" slot="pulling">加载中...</van-loading>
                <van-loading size="24px" slot="loosing">松开即可更新</van-loading>
                <van-loading size="24px" slot="loading">更新中...</van-loading>
                <van-list v-model="moreLoading" :finished="hidefinished" :immediate-check="false" :offset = "10" finished-text = "没有更多了" @load = "pullupload">
                    <div class="task_list_warp">
                        <div class="task-list" v-for="(item,index) in taskList" :key="index" @click="checkWechat(item)">
                            <div class="wechat_img">
                                <img v-if="taskType == 0" src = "../../assets/images/buy/addgroup.png" alt="">
                                <img v-else-if="taskType == 1" src = "../../assets/images/buy/addowder.png" alt="">
                            </div>
                            <div class="source_content">
                                <div class="source_title">
                                    <span class="wechat_g wechat_code">微信编号：{{item.work_id}}</span>
                                    <span class="wechat_i">微信状态：
                                        <span style="color:#438aff;" v-if="item.do_status == 1">可接任务</span>
                                        <span style="color:#fe6424;" v-else-if="item.do_status == 2">任务进行中</span>
                                        <span style="color:#ee0a24;" v-else-if="item.do_status == 3">不可接取</span>
                                        <span style="color:#438aff;" v-else>{{item.msg}}</span>
                                    </span>
                                </div>
                                <div class="source_title">
                                    <span class="wechat_g wechat_code">已验粉数：{{item.fan_num}}</span>
                                    <span class="wechat_i">剩余任务数量：{{item.task_num}}</span>
                                </div>
                                <div class="source_title">
                                    <span class="wechat_g wechat_num">微信号：{{item.wx}}</span>
                                </div>
                            </div>
                            <span :class="item.check == true ? 'check_active' :''"></span>
                        </div>
                        <div class="loading-wrapper" v-show="loadMore">{{pullupMsg}}</div>
                        <div style="width:100% height:120px;float:left;"></div>
                    </div>
                </van-list>
            </van-pull-refresh>
            <div class="footer_arrea">
                <van-button type="primary" @click="confirmBtn" :disabled = "isLoading">确定</van-button>
                <div class="explain_title">
                    <span>规则说明</span>
                </div>
                <div class="task_text" v-if="taskType == 0">
                    <van-cell :border="false">1、一个微信号可同时执行{{sync_max_num}}个任务</van-cell>
                    <van-cell :border="false">2、微信每天最多可接{{maxNun}}个任务</van-cell>
                </div>
                <div class="task_text" v-else>
                    <van-cell :border="false">1、加粉最少拉{{maxNun}}-{{maxNun}}人以上</van-cell>
                </div>
            </div>
        </div>
        <div class="empoty_area" v-else>
            <van-icon name="balance-list-o" />
            <span class="task_title">暂无微信</span>
        </div>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
import { fmoney } from "../../utils/tool";
import { workaccountlist,getfantask,getgrouptask} from "@/api/user";
export default {
    name: "buy",
    components: { PageHeader},
    data() {
        return {
            checkValue:"",
            show:false,
            showCard:false,
            isLoading:false,
            page:1,
            title:"提示",
            limit:20,
            typeLen:0,
            stateLen:0,
            totalPage:0,
            pageStart : 0, // 开始页数
            pageEnd : 0, // 结束页数
            pageCount: 0,
            maxNun:0,
            sync_max_num:0,
            allType:false,
            allStatus:false,
            taskList:[],
            dialogContent:"每个任务都有时限，请在规定的时间内提交任务！",
            wechatNum:"",
            taskType:"",
            work_id:"",
            pullupMsg:"",
            showLoading:false,
            moreLoading:false,
            hidefinished:false
        };
    },
    mounted(){
        this.taskType = this.$route.query.taskType;
        this.initWechatList()
    },
    methods: {
        initWechatList() {
            let params = {
                task_type:Number(this.taskType),
                page:this.page,
                limit:this.limit
            }
            workaccountlist(params).then(res => {
                let wechatList = res.list || [];
                this.pageCount = Math.ceil(res.total/this.limit);
                for(let i = 0;i<wechatList.length;i++){
                    wechatList[i].check = false;
                }
                this.taskList = wechatList;
                this.maxNun = res.max_fan_num;
                this.sync_max_num = res.sync_max_num;
                setTimeout(()=>{
                    this.moreLoading = false;
                    this.showLoading = false;
                    this.hidefinished = false;
                },500)
            });
        },
        // 下拉刷新
        downRefresh(){
            this.page = 1;
            this.initWechatList()
        },
        // 上拉加载
        pullupload() {
            this.page++;
            let params = {
                task_type:Number(this.taskType),
                page:this.page,
                limit:this.limit
            }
            if(this.page <= this.pageCount){
                workaccountlist(params).then(res => {
                    for(let i =0;i<res.list.length;i++){
                        this.taskList.push(res.list[i]);
                    }
                    setTimeout(()=>{
                        this.moreLoading = false;
                    },500)
                });
            }else{
                this.hidefinished = true;
            }
        },
        // initWechatList() {
        //     let that = this;
        //     let params = {
        //         task_type:Number(this.taskType),
        //         page:this.page,
        //         limit:this.limit,
        //     }
        //     workaccountlist(params).then(res => {
        //         this.showCard = true;
        //         let wechatList = res.list || [];
        //         for(let i = 0;i<wechatList.length;i++){
        //             wechatList[i].check = false;
        //         }
        //         this.taskList = wechatList;
        //         this.maxNun = res.max_fan_num;
        //         this.sync_max_num = res.sync_max_num;
        //         this.pageCount = Math.ceil(res.total/this.limit);
        //     });
        // },
        // 提交
        confirmBtn(){
            if(this.checkValue == ""){
                this.$toast("请勾选要做任务的微信号");
                return;
            }
            if(this.taskType == 0){
                this.isLoading = true;
                let params = {
                    work_id:this.checkValue
                }
                getfantask(params).then(res => {
                    this.$toast("每个任务都有时限，请在规定的时间内提交任务");
                    setTimeout(()=>{
                        this.isLoading = false;
                        this.$router.push("/buy");
                    },2000)
                });
                // for(let i = 0;i<wxArry.length;i++){
                //     this.isLoading = true;
                //     setTimeout(()=>{
                //         let params = {
                //             work_id:wxArry[i]
                //         }
                //         getfantask(params).then(res => {
                //              console.log(res);
                //             // this.$toast("每个任务都有时限，请在规定的时间内提交任务");
                //             // setTimeout(()=>{
                //             //     this.isLoading = false;
                //             //     this.$router.push("/buy");
                //             // },2000)
                //         });
                //     },500)
                // }
                setTimeout(()=>{
                    this.isLoading = false;
                },2000)
            }else if(this.taskType == 1){
                 setTimeout(()=>{
                    this.$router.push({path:'/friendMoments',query:{taskType:1,wechat_id:this.checkValue,wechatNum:this.wechatNum,task_id:this.work_id}});
                },500)
            }
        },
        // 选择微信号
        checkWechat(val){
            for(let i = 0;i<this.taskList.length;i++){
                if(this.taskList[i].work_id == val.work_id && this.taskList[i].do_status == 1){
                    this.taskList[i].check = true
                    this.work_id = val.work_id;
                    this.checkValue = val.do_status == 1 ? val.work_id : "";
                    this.wechatNum = val.do_status == 1 ? val.wx : "";
                }else if(val.do_status == 1){
                    this.taskList[i].check = false
                }
            }
            if(val.do_status == 3){
                this.$toast(val.msg);
            }
        },
        // 格式化金额
        getEarnPoint(point) {
            return fmoney(point,2);
        }
    },
    watch: {
        // taskList(val, newVal) {
        //     this.$nextTick(()=>{
        //         this.$refs.scroll.scroll.refresh();
        //     })
        // }
    }
};
</script>
<style lang="scss" scoped>
    .task_warp, .task_content, .task_list_warp, .task-list, .source_img{width: 100%;float: left;box-sizing: border-box;}
    .task_warp{height:100vh; background-color: #f2f2f2;}
    .task_content{width: 100%;float: left;overflow: hidden; height: calc(100vh - 200px);overflow-y: auto;-webkit-overflow-scrolling: touch;position: absolute;top: 90px;left: 0;background-color: #f2f2f2; padding-bottom: 240px;}
    .task_list_warp{padding: 29px 30px 0 30px;}
    // 任务列表
    .task-list{width: 100%;padding: 16px 10px 6px 20px;margin-bottom: 20px;border-radius: 8px;background-color: #fff;position: relative;}
    .check_active{width: 66px;height: 59px;position: absolute;right: 0;bottom: 0;background-image: url("../../assets/images/buy/plain_active.png");background-size: 100% 100%;}
    .wechat_img{width: 120px;float: left;position: relative;}
    .wechat_img .wechat_id{width: 120px; float: left; font-size: 0.24rem;position: absolute;top: 58px;left:0;text-align: center;}
    .source_type img{display: block; width: 100%;}
    .source_content{width: 520px; float: left; font-size: 0.26rem;margin-left: 12px;}
    .source_title{float: left;}
    .source_title:nth-child(2){margin: 4px 0;}
    .source_title .wechat_i, .source_title .wechat_g, .source_title .wechat_num{float: left;}
    .source_title .wechat_num{width: 4rem;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
    .source_title .wechat_i{width: 3rem;margin-left: 15px;}
    .wechat_code{width: 2rem;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
    .check_wechat{float: right;color: #fff;position: absolute;top: 55px;right: 20px;}
    .check_wechat .van-radio__icon--checked .van-icon{border-color: #438aff !important;border-color: #438aff !important;}
    // 任务为空时
    .empoty_area{width: 100%; float: left; padding-top: 50%; text-align: center;}
    .empoty_area .van-icon{font-size: 82px; color: red;}
    .empoty_area .task_title, .empoty_area .task_descr{width: 100%;float: left;font-size: 28px;}
    .empoty_area .task_descr{width: 100%;float: left;font-size: 24px;margin-top: 20px;margin-bottom: 15px;}
    .pulldown-tip {top: 120px;height: 60px;text-align: center;line-height: 60px;margin-top: 30px;}
    .loading-wrapper {width: 100%;height: 80px;font-size: 0.3rem;text-align: center;line-height: 80px;float: left;}

    // 提示内容
    
    .footer_arrea{width: 100%;height: 320px;position: fixed;left: 0;bottom: 0;float: left;padding: 0 30px;box-sizing: border-box;padding-bottom: 60px;background-color: #f2f2f2;}
    .footer_arrea .van-button{width: 100%;font-size: 0.32rem;border-radius: 5px;background-color: #fd6526;border-color: #fd6526;}
    .footer_arrea .explain_title, .footer_arrea .task_text{width: 100%;float: left;font-size: 0.3rem;margin-top: 20px;padding-left: 20px;}
    .footer_arrea .task_text{font-size: 0.28rem;margin-top: 10px;line-height: 0;}
    .footer_arrea .van-cell__title{line-height: initial;}
    .footer_arrea .van-cell{margin-bottom: 3px;background-color: transparent;padding: 0;}
</style>
