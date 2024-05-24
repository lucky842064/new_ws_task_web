<template>
    <div class="earn">
        <page-header style="position: fixed;top: 0;left: 0; z-index: 9;" :title="title" :show-icon="true"></page-header>
        <div class="screen_warp">
            <ul>
                <li class="all_state" :class="item.checked == true ? 'active_class':''" v-for="item in taskType" :key="item.id" @click="simpleChange(item.id)">{{item.name}}</li>
                <!-- <li class="screen_term" @click="showPopup">
                    <span class="screen_title">筛选</span>
                    <img src="../../assets/images/home/icon_shaixuan.png" alt="">
                </li> -->
            </ul>
         <div class="repair_bg_1"></div>
        </div>
        <div class="history_recors_warp">
            <div class="history_content">
                <van-cell-group class="tab_head" :border = false>
                    <van-cell class="tab_class tab_round" title="序号" />
                    <!-- <van-cell class="tab_class" title="任务类型" /> -->
                    <van-cell class="tab_class" title="任务时间" />
                    <van-cell class="last_round" title="任务收益" />
                </van-cell-group>
                <div class="history_recors">
                    <template v-if="taskRecord.length > 0">
                        <van-cell-group class="tab_content history_list" :border = false v-for="(iten,index) in taskRecord" :key="index">
                            <van-cell class="tab_class" :title="index+1" />
                            <!-- <van-cell v-if="iten.task_type == 0" class="tab_class" title="加粉任务" />
                            <van-cell v-if="iten.task_type == 1" class="tab_class" title="加粉任务" /> -->
                            <van-cell class="tab_class" title="2021-03-05 15:10" />
                            <!-- <van-cell v-if="iten.status == -1" class="tab_class" style="color:#ff9604" title="申请中" />
                            <van-cell v-else-if="iten.status == 0" class="tab_class" style="color:#ff9604" title="进行中" />
                            <van-cell v-else-if="iten.status == 1" class="tab_class" title="已完成" style="color:#0aa01b" />
                            <van-cell v-else-if="iten.status == 3" class="tab_class" title="已撤回" style="color:#000000 " />
                            <van-cell v-else-if="iten.status == 4" class="tab_class" title="审核中" style="color:#fe0040" />
                            <van-cell v-else-if="iten.status == 5" class="tab_class" title="派码中" style="color:#2872eb" />
                            <van-cell v-else-if="iten.status == 8" class="tab_class" title="未开始" style="color:#000000" /> -->
                            <van-cell :title="iten.point" style="color:#ff0042" />
                        </van-cell-group>
                    </template>
                    <template v-else>
                        <van-cell-group class="tab_content empty_content" :border = false >
                            <van-cell title="暂无任务记录" style="color:#ff0042" />
                        </van-cell-group>
                    </template>
                </div>
            </div>
        </div>
        <!-- 弹窗 -->
        <van-toast id="van-toast" />
        <van-popup class="task_popup" v-model="show" close-icon-position="top-left" round position="right" @close="onClose">
            <div class="task_model">
                <div class="task_head">任务状态</div>
                <div class="task_list">
                    <span class="all_check" :class="allStatus == true ? 'active_class':''" @click="allCheng(0)">全部状态</span>
                    <ul>
                        <li :class="item.checked == true ? 'active_class':''" v-for=" (item,index) in taskStatus" :key="index" @click="screenChange(item.id)">{{item.name}}</li>
                    </ul>
                </div>
            </div>
            <div class="task_model task_type_model">
                <div class="task_head">任务类型</div>
                <div class="task_list">
                    <div class="all_check" :class="allType == true ? 'active_class':''" @click="allCheng(1)">全部类型</div>
                    <ul>
                        <li :class="item.checked == true ? 'active_class':''" v-for=" (item,index) in taskType" :key="index" @click="typeChange(index)">{{item.name}}</li>
                    </ul>
                </div>
            </div>
            <van-button class="serach_btn" type="danger" @click="submitBtn">确认</van-button>
        </van-popup>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
import { mytask } from "@/api/user";
import { fmoney } from "@/utils/tool";
import moment from "moment";
export default {
    components: { PageHeader },
    data() {
        return {
            show:false,
            title:"",
            page:1,
            limit:99,
            typeLen:0,
            stateLen:0,
            allType:false,
            allStatus:false,
            taskRecord:[],
            historyArry:[
                {task_type:1,status:0,point:780},
                {task_type:2,status:1,point:90},
                {task_type:3,status:2,point:300},
                {task_type:3,status:3,point:150},
                {task_type:3,status:4,point:90},
            ],
            taskStatus:[
                {id:-1,name:"申请中",checked:false},
                {id:0,name:"进行中",checked:false},
                {id:1,name:"已完成",checked:false},
                // {id:2,name:"已撤销",checked:false},
                {id:3,name:"已撤回",checked:false},
                {id:4,name:"审核中",checked:false},
                {id:5,name:"派码中",checked:false},
                // {id:6,name:"已失效",checked:false},
                // {id:7,name:"审核失败",checked:false},
                {id:8,name:"未开始",checked:false}
            ],
            simpleStatus:[
                {id:-1,name:"审核中",checked:false},
                {id:1,name:"已完成",checked:false},
                {id:5,name:"派码中",checked:false}
            ],
            taskType:[
                {name:"加粉任务",checked:false},
                // {name:"加粉任务",checked:false}
            ],
            task_state:[-2],
            task_type:-1
        };
    },
    created() {
        this.title = this.$route.meta.title;
        this.initTaskRecord();
    },
    methods: {
        showPopup() {
            this.show = true
        },
        onClose() {
            this.show = false
        },
        initTaskRecord(){
            let params = {
                status:this.task_state,
                task_type:this.task_type,
                page:this.page,
                limit:this.limit,
            }
            mytask(params).then(res => {
                if(res.list.length > 0){
                    let callHistory = res.list || [];
                    for(let i = 0;i<callHistory.length;i++){
                        callHistory[i].point = fmoney(callHistory[i].point);
                        if(callHistory[i].status != 1){
                            callHistory[i].point = "...";
                        }else{
                           callHistory[i].point = "￥"+callHistory[i].point;
                        }
                    }
                    this.taskRecord = callHistory;
                }else{
                   this.taskRecord = []
                }
            })
        },
        // 单个筛选
        simpleChange(idx){
            for(let k = 0;k < this.simpleStatus.length;k ++){
                if(this.simpleStatus[k].id == idx){
                    let index = this.task_state.indexOf(Number(this.simpleStatus[k].id));
                    if(this.simpleStatus[k].checked == true){
                        this.simpleStatus[k].checked = false
                        for(let j=0;j<this.taskStatus.length;j++){
                            if(this.taskStatus[j].id == idx){
                                this.taskStatus[j].checked = false;
                            }
                        }
                        this.task_state.splice(index,1);
                    }else{
                        this.simpleStatus[k].checked = true;
                        this.task_state.push(Number(this.simpleStatus[k].id))
                        for(let j=0;j<this.taskStatus.length;j++){
                            if(this.taskStatus[j].id == idx){
                                this.taskStatus[j].checked = true;
                            }
                        }
                    }
                }
            }
            if(this.task_state.indexOf(-2) > -1){
                this.task_state.splice(this.task_state.indexOf(-2),1);
            }
            if(this.task_state.length == 0){
                this.task_state.push(-2);
            }
            this.initTaskRecord();
        },
        // 全选
        allCheng(type){
            let statusList,typeList;
            if(type == 0){
                this.allStatus = !this.allStatus;
                statusList = this.taskStatus;
                for(let i=0;i<statusList.length;i++){
                    if(this.allStatus == true){
                        statusList[i].checked = true;
                        this.task_state = [];
                        this.task_state.push(-2);
                        for(let k=0;k<this.simpleStatus.length;k++){
                            this.simpleStatus[k].checked = true;
                        }
                        this.stateLen = this.taskStatus.length;
                    }else{
                        statusList[i].checked = false;
                        this.task_state = [];
                        this.task_state.push(-2);
                        for(let k=0;k<this.simpleStatus.length;k++){
                            this.simpleStatus[k].checked = false;
                        }
                        this.stateLen = 0;
                    }
                }
                this.taskStatus = statusList;
            }else{
                this.allType = !this.allType;
                typeList = this.taskType;
                for(let i=0;i<typeList.length;i++){
                    if(this.allType == true){
                        typeList[i].checked = true;
                        this.typeLen = this.taskType.length;
                    }else{
                        typeList[i].checked = false;
                        this.typeLen = 0;
                    }
                }
                this.taskType = typeList;
            }
        },
        // 状态单选
        screenChange(idx){
            let lableLen = this.taskStatus.length;
            for(let i=0;i<this.taskStatus.length;i++){
                if(this.taskStatus[i].id == idx){
                    if(this.taskStatus[i].checked == true){
                        let index = this.task_state.indexOf(Number(this.taskStatus[i].id));
                        this.taskStatus[i].checked = false;
                        for(let k=0;k<this.simpleStatus.length;k++){
                            if(this.simpleStatus[k].id == idx){
                                this.simpleStatus[k].checked = false;
                            }
                        }
                        this.task_state.splice(index,1);
                        this.stateLen -= 1;
                    }else{
                        this.taskStatus[i].checked = true;
                        this.task_state.push(Number(this.taskStatus[i].id));
                        for(let k=0;k<this.simpleStatus.length;k++){
                            if(this.simpleStatus[k].id == idx){
                                this.simpleStatus[k].checked = true;
                            }
                        }
                        this.stateLen += 1;
                    }
                }
            }
            if(this.stateLen == lableLen){
                this.task_state = [];
                this.task_state.push(-2);
                this.allStatus = true;
            }else{
                this.allStatus = false;
                if(this.task_state.indexOf(-2) > -1){
                    this.task_state.splice(this.task_state.indexOf(-2),1);
                }
                if(this.task_state.length == 0){
                    this.task_state.push(-2);
                }
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
                if(this.taskType[i].name == "加粉任务" && this.taskType[i].checked == true && this.taskType[1].checked == false){
                    this.task_type = 0;
                }else if(this.taskType[i].name == "加粉任务" && this.taskType[i].checked == true && this.taskType[0].checked == false){
                    this.task_type = 1;
                }else if(this.taskType[0].checked == false && this.taskType[1].checked == false){
                    this.task_type = -1;
                }else if(this.taskType[0].checked == true && this.taskType[1].checked == true){
                    this.task_type = -1;
                }
            }
            if(this.typeLen == lableLen){
                this.allType = true;
            }else{
                this.allType = false;
            }
        },
         // 格式化金额
        getEarnPoint(point) {
            return fmoney(point,2);
        },
        // 查询
        submitBtn(){
            this.show = false;
            this.initTaskRecord()
        },
        // 任务详情
        taskDetail(val){
            this.$router.push("/taskDetail");
        }
    },
};
</script>
<style lang="scss" scoped>
.earn {
    background: #fff;
    height: 100vh;
    overflow: auto;
    -webkit-overflow-scrolling: touch;  
    // margin-bottom: 120px;
}
.screen_warp{
    width: 100%; 
    height: 115px;
    margin-top: 90px;
    box-sizing: border-box;
    background-color: #fff; 
    ul {
        width: 100%; 
        float: left;
        padding: 19px 40px;
    }
    ul li {
        color: #000;
        float: left;
        font-size: 0.24rem;
    }
    .all_state, .all_type{
        width: 170px;
        padding: 8px 0;
        text-align: center;
        // line-height: 60px;
        border-radius: 35px;
        background-color: #f2f2f2;
    }
    .all_state:nth-child(even){margin: 0 16px;}
}
.screen_warp .screen_term{
    float: right;
}
.screen_title{
    font-size: 0.28rem;
    line-height: 50px;
    float: left;
}
.screen_term{
   float: right;
   margin-top: 4px;
}
.screen_term img{
    width: 28px;
    height: 28px;
    float: left;
    margin: 7px 0 0 5px;
}
.repair_bg_1{
    width:100%;
    height:20px;
    float:left;
    background:#f2f2f2;
}
.history_recors_warp{
    width: 100%;
    float: left;
    padding: 30px 40px;
    box-sizing: border-box;
}
.history_content, .history_recors{
    .van-cell-group{
        display: flex;
        flex-direction: row;
        .van-cell{
            padding: 0;
            flex: 1;
            text-align: center;
            border-width: 0px;
            // border-left: 0.001rem solid #d1d1d1;
        } 
        .van-cell::after{
            right: initial;
            left: initial;
        }
        .van-cell:nth-child(1){
            border-left: none;
        }
        .tab_class{
            border-right: none;
        }
    }
    .tab_head{
        .van-cell{
            padding: 4px 0;
            background-color:#f2f2f2;
            font-size: 0.24rem;
            border-top: 0.1px solid #d0d0d0;
            border-left: 1px solid #e1e1e1;
            border-bottom: 1px solid #e1e1e1;   
        } 
    }
    .tab_head .van-cell:nth-child(1){
        border-left: 0.1px solid #d0d0d0;
    }
    .tab_head .van-cell:last-child{
        border-right: 0.1px solid #d0d0d0;
    }
    .empty_content{
        .van-cell{
            color: #262626 !important;
            text-align: center;
            font-size: 0.24rem;
            border: none;
        }
    }
}
.history_recors{
    width: 100%;
    float: left;
    overflow: hidden;
    .tab_content{
        width: 100%;
        float: left;
        // margin-bottom: 1px;
        // border-bottom: 1px solid #e1e1e1;
    }
    .tab_content .van-cell{
        font-size: 0.24rem;
        border-left: 1px solid #e1e1e1;
        border-bottom: 1px solid #e1e1e1;
        padding: 6px 0;
    } 
    .tab_content .van-cell:nth-child(1){
        border-left: 0.1px solid #d0d0d0;
    }
    .tab_content .van-cell:last-child{
        border-right: 0.1px solid #d0d0d0;
    }
    .history_list{
        width: 100%;
        float: left;
    }
}
.history_content{
    width: 100%;
    float: left;
    // overflow: hidden;
    // box-shadow: 0 0 0px 1px #e1e1e1;
    // border-radius: 10px;
}
.task_model{
    width: 100%;
    float: left;
    font-size: 0.28rem;
    background-color: #fff;
    .task_head{
        font-size: 0.3rem;
    }
    .task_list{
        width: 100%;
        float: left;
        flex-direction: row;
        padding: 30px 27px 0 27px;
        ul li, .all_check{
            width: 175px;
            height: 60px;
            float: left;
            text-align: center;
            line-height: 60px;
            border-radius: 47px;
            margin: 0 12px 30px 0;
            background-color: #f2f2f2;
            border: 1px solid transparent;
        }
    }
}
.active_class {
    color: red !important;
    background-color: #ffd9e4 !important;
    border-color: red !important;
}
.task_type_model{
    margin-top: 20px;
    margin-bottom: 76px;
}
.serach_btn{
    font-size: 0.32rem;
    border-color: $color-theme;
    background-color: $color-theme;
}

</style>
