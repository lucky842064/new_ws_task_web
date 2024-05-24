<template>
    <div class="task_warp">
    <!-- <div class="task_warp" v-if="showCard"> -->
        <div class="head_class">
            <page-header :title="$t('foot_002')" :show-icon="true" :hide="false" :showBack="false"></page-header>
            <!-- <div class="task_history" @click="historyBtn">任务记录</div> -->
            <div class="screen_warp">
                <ul class="screen_warp_ul">
                    <!-- <li class="all_state" :class="taskIndex === index ? 'active_class':''" v-for="(item,index) in simpleStatus" :key="item.id" @click="simpleChange(item.id)">{{item.name}}</li> -->
                    <li>警告：微信状态为离线时,不可执行添加目标和发送话术的操作，否则审核失败导致的收益减少自行承担!</li>
                    <li class="screen_term" @click="historyBtn">
                        <van-button class="screen_title" size="small" type="info">任务记录</van-button>
                        <!-- <img src="../assets/images/home/icon_shaixuan.png" alt=""> -->
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="task_content" v-if="taskList.length > 0">
            <van-pull-refresh v-model="showLoading" @refresh = "downRefresh">
                <van-loading size="24px" slot="pulling">加载中...</van-loading>
                <van-loading size="24px" slot="loosing">松开即可更新</van-loading>
                <van-loading size="24px" slot="loading">更新中...</van-loading>
                <van-list v-model="moreLoading" :finished="hidefinished" :immediate-check="false" :offset = "100" finished-text = "没有更多了"  @load = "pullupload">
                    <div class="task_list_warp">
                        <div class="task-list" v-for="(item,index) in taskList" :key="index">
                            <div class="source_head">
                                <img class="source_img" v-if="item.task_type == 0"  src="../assets/images/buy/group_icon.png" alt="">
                                <img class="source_img" v-else-if="item.task_type == 1" src="../assets/images/buy/power_icon.png" alt="">
                                <span class="task_num" v-if="item.task_type == 0"> 加粉时间: {{item.e_time}}</span>
                                <span class="task_num" v-else-if="item.task_type == 1 && item.status == -1"> 任务时间: 未分配</span>
                                <span class="task_num" v-else-if="item.task_type == 1"> 加粉时间: {{item.e_time}}</span>
                                <span class="task_num" style="float:right;">任务ID: {{item.task_order}}</span>
                            </div>
                            <div class="source_content" v-if="item.point > 0">
                                <div class="source_title">微信编号: {{item.work_id}}</div>
                                <div class="source_reward task_money">任务奖励: <span class="money_sgin">￥<span class="money_num">{{getEarnPoint(item.point)}}</span></span> /人</div>
                                <div class="source_reward wechat_num">执行任务微信: {{item.wx}}</div>
                            </div>
                            <div class="source_content" v-else>
                                <div class="source_title" style="margin-top:6px;">微信编号: {{item.work_id}}</div>
                                <div class="source_reward wechat_num">执行任务微信: {{item.wx}}</div>
                            </div>
                            <van-button class="carry_btn" v-if="item.task_type == 0 && item.status == 0" type="danger" @click="placeOrder(item)"><span v-text="item.task_type == 0? '加粉任务':'加粉任务'"></span></van-button>
                            <van-button class="carry_btn" v-else-if="item.task_type == 1 && item.status == -1" type="info" style="background-color: #4389fb;border-color: #4389fb;" disabled>申请成功</van-button>
                            <van-button class="carry_btn" v-else-if="item.task_type == 1 && item.status == 0" type="danger" @click="placeOrder(item)"><span v-text="item.task_type == 0? '加粉任务':'加粉任务'"></span></van-button>
                            <van-button class="carry_btn" v-else-if="item.task_type == 1 && item.status == 5" disabled type="info" style="background-color: #b1b1b1;border-color: #b1b1b1;">派码中</van-button>
                            <van-button class="carry_btn" v-else-if="item.status == 1" type="danger" disabled>已完成</van-button>
                            <van-button class="carry_btn" v-else-if="item.status == 8" type="danger" disabled style="background-color: #b1b1b1;border-color: #b1b1b1;"><span v-text="item.task_type == 0? '加粉任务':'加粉任务'"></span></van-button>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
        <div class="empoty_area" v-else>
            <van-icon name="balance-list-o" />
            <span class="task_title">没有任务啦,赶快去领取新任务~</span>
        </div>
        <!-- 弹窗 -->
        <van-toast id="van-toast" />
        <van-popup class="task_popup" v-model="show" close-icon-position="top-left" round position="right" @close="onClose">
            <div class="task_model">
                <div class="task_head">高级筛选</div>
                <div class="task_list">
                    <span class="all_check" :class="allStatus == true ? 'active_class':''" @click="allCheng(0)">全部状态</span>
                    <ul>
                        <li :class="item.checked == true ? 'active_class':''" v-for=" (item,index) in taskStatus" :key="index" @click="screenChange(index)">{{item.name}}</li>
                    </ul>
                </div>
            </div>
            <!-- <div class="task_model task_type_model">
                <div class="task_head">任务类型</div>
                <div class="task_list">
                    <div class="all_check" :class="allType == true ? 'active_class':''" @click="allCheng(1)">全部类型</div>
                    <ul>
                        <li :class="item.checked == true ? 'active_class':''" v-for=" (item,index) in taskType" :key="index" @click="typeChange(index)">{{item.name}}</li>
                    </ul>
                </div>
            </div> -->
            <van-button class="serach_btn" type="danger" @click="submitBtn">确认</van-button>
        </van-popup>
        <popDialog ref="isDialog" :title = "title" :titleContent = "dialogContent" :isCancel = true :isConfirm = true @confirm_btn = "confirm_btn"></popDialog>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
import { fmoney } from "../utils/tool";
import { mytask,tasklist,grabtask } from "@/api/user";
import popDialog from "@/components/popDialog";
// import BScroll from 'better-scroll'
export default {
    name: "buy",
    components: { PageHeader,popDialog},
    data() {
        return {
            show:false,
            page:1,
            title:"提示",
            limit:20,
            typeLen:0,
            stateLen:0,
            taskIndex:0,
            totalPage:0,
            pageStart : 0, // 开始页数
            pageEnd : 0, // 结束页数
            pageCount: 0,
            showCard:false,
            allType:false,
            allStatus:false,
            taskList:[],
            dialogContent:"每个任务都有时限，请在规定的时间内提交任务！",
            simpleStatus:[
                {id:0,name:"加粉任务",checked:false},
                // {id:1,name:"加粉任务",checked:false}
            ],
            taskStatus:[
                {name:"加粉任务",checked:false},
                // {name:"加粉任务",checked:false}
            ],
            pulldownTip:{
                text: '下拉刷新',
                rotate: 'icon-rotate'
            },
            pullupMsg:"",
            showLoading:false,
            moreLoading:false,
            hidefinished:false,
            taskType:-1,
            screenLen:0,
        };
    },
    mounted(){
        this.initTaskList()
    },
    methods: {
        initTaskList() {
            let params = {
                status:[],
                task_type:this.taskIndex,
                page:this.page,
                limit:this.limit
            }
            mytask(params).then(res => {
                this.taskList = res.list || []
                this.pageCount = Math.ceil(res.total / this.limit) || 0; //总页数
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
            this.initTaskList()
        },
        // 上拉加载
        pullupload() {
            this.page++;
            let params = {
                status:[],
                task_type:this.taskIndex,
                page:this.page,
                limit:this.limit
            }
            if(this.page <= this.pageCount){
                mytask(params).then(res => {
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
        showPopup() {
            this.show = true
        },
        onClose() {
            this.show = false
        },
        // 格式化金额
        getEarnPoint(point) {
            return fmoney(point,2);
        },
         // 抢单
        placeOrder(val){
            // this.task_id = val.task_id;
            // this.$refs.isDialog.showDialog()
            if(val.task_type == 0){
                sessionStorage.setItem("reloadFriendList",-1)
                this.$router.push({path:'/friendMoments',query:{task_id:val.task_order,wechatNum:val.wx}});
            }else if(val.task_type == 1){
                this.$router.push({path:'/submitExamine',query:{task_id:val.task_order}});
            }
        },
        
        // 提交订单
        confirm_btn(done){
            let that = this;
            grabtask({task_id:this.task_id}).then(res => {
                that.$refs.isDialog.dialogModel = false
                setTimeout(()=>{
                    that.$toast("抢单成功，请在首页中操作！");
                },500)
            });
        },
        // 单个筛选
        simpleChange(idx){
            if(this.taskIndex === idx){
                this.taskIndex = -1
            }else{
                this.taskIndex = idx;
            }
            // this.taskIndex === idx ? "":idx;
            // for(let k = 0;k < this.simpleStatus.length;k ++){
            //     if(this.simpleStatus[k].id == idx){
            //         if(this.simpleStatus[k].checked == true){
            //             this.simpleStatus[k].checked = false
            //             this.taskStatus[idx].checked = false
            //         }else{
            //             this.simpleStatus[k].checked = true
            //             this.taskStatus[idx].checked = true
            //         }
            //     }
            //     if(this.simpleStatus[0].checked == false && this.simpleStatus[1].checked == true){
            //         this.taskType = 1
            //     }else if(this.simpleStatus[1].checked == false && this.simpleStatus[0].checked == true){
            //         this.taskType = 0
            //     }else if(this.simpleStatus[0].checked == false && this.simpleStatus[1].checked == false){
            //         this.taskType = -1
            //     }else if(this.simpleStatus[0].checked == true && this.simpleStatus[1].checked == true){
            //         this.taskType = -1
            //     }
            // }
            this.initTaskList();
        },
        // 全选
        allCheng(type){
            let statusList,typeList;
            this.allStatus = !this.allStatus;
            statusList = this.taskStatus;
            for(let i=0;i<statusList.length;i++){
                if(this.allStatus == true){
                    this.taskType = -1;
                    statusList[i].checked = true;
                    this.simpleStatus[i].checked = true;
                    this.stateLen = this.taskStatus.length;
                }else{
                    statusList[i].checked = false;
                    this.simpleStatus[i].checked = false;
                    this.stateLen = 0;
                    this.taskType = -1;
                }
            }
            this.taskStatus = statusList;
        },
        // 单选
        screenChange(idx){
            let lableLen = this.taskStatus.length;
            for(let i=0;i<this.taskStatus.length;i++){
                if(i == idx){
                    if(this.taskStatus[i].checked == true){
                        this.taskStatus[i].checked = false;
                        for(let k=0;k<this.simpleStatus.length;k++){
                            if(this.simpleStatus[k].id == idx){
                                this.simpleStatus[k].checked = false;
                            }
                        }
                    }else{
                        this.taskStatus[i].checked = true;
                        for(let k=0;k<this.simpleStatus.length;k++){
                            if(this.simpleStatus[k].id == idx){
                                this.simpleStatus[k].checked = true;
                            }
                        }
                    }
                }
                if(this.simpleStatus[i].name == "加粉任务" && this.simpleStatus[i].checked == true && this.simpleStatus[1].checked == false){
                    this.taskType = 0;
                }else if(this.simpleStatus[i].name == "加粉任务" && this.simpleStatus[i].checked == true && this.simpleStatus[0].checked == false){
                    this.taskType = 1;
                }else if(this.simpleStatus[0].checked == false && this.simpleStatus[1].checked == false){
                    this.taskType = -1;
                }else if(this.simpleStatus[0].checked == true && this.simpleStatus[1].checked == true){
                    this.taskType = -1;
                }
            }
            if(this.taskType == lableLen){
                this.allStatus = true;
            }else{
                this.allStatus = false;
            }
        },
        // 类型单选
        typeChange(idx){
            let lableLen = this.taskType.length;
            for(let i=0;i<this.taskType.length;i++){
                if(i == idx){
                    if(this.taskType[i].checked == true){
                        this.taskType[i].checked = false;
                        this.typeLen -= 1;
                    }else{
                        this.taskType[i].checked = true;
                        this.typeLen += 1;
                    }
                }
            }
            if(this.typeLen == lableLen){
                this.allType = true;
            }else{
                this.allType = false;
            }
        },
        submitBtn(){
            this.initTaskList();
            this.show = false;
        },
        historyBtn(){
            this.$router.push("/taskRecord");
        }
    },
    watch: {
        // taskList(val, newVal) {
        //     this.$nextTick(()=>{
        //         this.$refs.childScroll.scroll.refresh();
        //     })
        // }
    }
};
</script>
<style lang="scss" scoped>
    .task_warp, .task_content, .active_class, .screen_warp, .task_list_warp, .task-list, .screen_term .source_head{width: 100%; ;float: left;box-sizing: border-box;}
    .screen_warp_ul{
        display: flex;align-items: center;justify-content: space-between;
        >li:nth-child(1){color:#fe023d;width: 75%;}
    }
    .task_warp{width: 100%;float: left;background-color: #f2f2f2;}
    .head_class{width: 100%;height: 200px;position: fixed; top: 0;left: 0; z-index: 999; }
    .task_history{width: auto;position: absolute;top: 0;right: 30px;font-size: 28px;text-align: center;padding: 30px 0;}
    .task_content{width: 100%;height: calc(100vh - 200px);overflow: hidden;font-size: 0.28rem;overflow-y: auto;-webkit-overflow-scrolling: touch; position: absolute;top: 200px;left: 0;background-color: #f2f2f2;padding-bottom: 100px;}
    .task_list_warp{width: 100%; ;float: left;padding: 30px 20px 0 20px;box-sizing: border-box;}
    .screen_warp{position: relative; z-index: 101;padding: 20px 40px;background-color: #fff;}
    .screen_warp ul li {color: #000;float: left;font-size: 24px;}
    .all_state, .all_type{width: 170px;padding: 8px 0; text-align: center;border-radius: 35px;background-color: #f2f2f2;}
    .all_state:nth-child(even){margin: 0 16px;}
    .all_type{margin-left: 20px;}
    .screen_warp .screen_term{ float: right; margin-top: 2px;}
    .screen_title{font-size: 28px;line-height: 50px;float: left;}
    .screen_term img{width: 28px;height: 28px;float: left;margin: 10px 0 0 5px;}

    // 任务列表
    .task-list{width: 100%;float: left; margin-bottom: 20px;border-radius: 10px;background-color: #fff;position: relative;padding: 0 20px 20px 20px ;box-sizing: border-box;}
    .task_num{float: left; margin-left: 12px;color: #8c8c8c;font-size: 24px;margin-top: 12.5px;}
    .source_img{width: 35px;height: 35px; float: left;margin-top: 13px;}
    .source_head{width: 100%;height: 60px;font-size: 26px;border-bottom: 1px solid #efefef;margin-bottom: 14px; padding-right: 20px;}
    .grade_img{width: 148px;height: 46px;float: right;}
    .source_type{width: 120px;float: left;}
    .source_type img{display: block; width: 100%;}
    .source_content{float: left;font-size: 0.26rem;}
    .source_content .wechat_num{float: left; width: 3.8rem;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
    .source_title .task_award{font-size: 0.16rem;color: #fe023d;}
    .task_money{margin: 6px 0;}
    .task_money .money_sgin, .task_money .money_num{color: #fe023d;font-size: 0.18rem;}
    .task_money .money_num{font-size: 0.28rem;font-weight: 550;}
    .carry_btn{width: 160px; height: 0px;float: right;font-size: 24px;border-radius: 35px; padding: 30px 0;text-align: center;position: absolute;top: 105px;right: 20px;background-color: $color-theme;border-color: $color-theme;}
    .source_desc{width: 100%;float: left; font-size: 0.26rem;border-radius: 8px;padding: 9px 20px;background-color: #f2f2f2;margin-top: 14px;}

    // 任务为空时
    .empoty_area{ width: 100%;min-height: 100vh; float: left; margin-top: 50%; text-align: center;}
    .empoty_area .van-icon{font-size: 82px; color: red;}
    .empoty_area .task_title, .empoty_area .task_descr{width: 100%;float: left;font-size: 28px;}
    .empoty_area .task_descr{width: 100%;float: left;font-size: 24px;margin-top: 20px;margin-bottom: 15px;}

    //筛选弹窗
    .task_model{width: 100%;float: left;font-size: 0.28rem;background-color: #fff;margin-bottom: 76px;}
    .task_head{font-size: 0.3rem;}
    .task_list{width: 100%;float: left;flex-direction: row;padding: 45px 27px;}
    .task_list ul li, .all_check{width: 175px;padding: 8px 0; float: left;font-size: 24px;text-align: center;border-radius: 47px;margin-right: 12px;background-color: #f2f2f2;border: 1px solid transparent;}
    .active_class {color: red !important;background-color: #ffd9e4 !important;border-color: red !important;}
    .task_type_model{margin-top: 20px;margin-bottom: 76px;}
    .serach_btn{ font-size: 0.32rem;border-color: $color-theme;background-color: $color-theme;}
    .pulldown-tip {top: 120px;height: 60px;text-align: center;line-height: 60px;margin-top: 30px;}
    .loading-wrapper {width: 100%;height: 80px;font-size: 0.3rem;text-align: center;line-height: 80px;float: left;}
</style>
