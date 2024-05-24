<template>
    <div class="earn">
        <page-header style="position: fixed;top: 0;left: 0; z-index: 9;" :title="title" :show-icon="true"></page-header>
        <div class="history_recors_warp">
            <div class="history_content">
                <van-cell-group class="tab_head" :border = false>
                    <van-cell class="tab_class tab_round" title="序号" />
                    <van-cell class="tab_class" title="手机号" />
                </van-cell-group>
                <div class="history_recors">
                    <template v-if="taskRecord.length > 0">
                        <van-cell-group class="tab_content" :border = false v-for="(iten,index) in taskRecord" :key="index" @click="taskDetail(iten)">
                            <van-cell class="tab_class" :title="index+1" />
                            <van-cell :title="17691235245" />
                        </van-cell-group>
                    </template>
                    <template v-else>
                        <van-cell-group class="tab_content empty_content" :border = false >
                             <van-cell title="暂无详情记录" style="color:#ff0042" />
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
                        <li :class="item.checked == true ? 'active_class':''" v-for=" (item,index) in taskStatus" :key="index" @click="screenChange(index)">{{item.name}}</li>
                    </ul>
                </div>
            </div>
            <div class="task_model task_type_model">
                <div class="task_head">任务类型</div>
                <div class="task_list">
                    <div class="all_check" :class="allType == true ? 'active_class':''" @click="allCheng(1)">任务状态</div>
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
                {name:"进行中",checked:false},
                {name:"等待审核",checked:false},
                {name:"已完成",checked:false},
                {name:"已取消",checked:false},
                {name:"审核失败",checked:false}
            ],
            taskType:[
                {name:"微信群",checked:false}
                // {name:"朋友圈",checked:false},
                // {name:"短信",checked:false}
            ]
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
                status:[-2],
                task_type:0,
                page:this.page,
                limit:this.limit,
            }
            mytask(params).then(res => {
                if(res.list.length > 0){
                    let callHistory = res.list || [];
                    for(let i = 0;i<callHistory.length;i++){
                        callHistory[i].point = fmoney(callHistory[i].point);
                        if(callHistory[i].status != 2){
                            callHistory[i].point = "...";
                        }else{
                           callHistory[i].point = "￥"+callHistory[i].point;
                        }
                    }
                    this.taskRecord = callHistory;
                }else{
                   this.taskRecord = this.historyArry
                }
            })
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
                        this.stateLen = this.taskStatus.length;
                    }else{
                        statusList[i].checked = false;
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
        // 单选
        screenChange(idx){
            let lableLen = this.taskStatus.length;
            for(let i=0;i<this.taskStatus.length;i++){
                if(i == idx){
                    if(this.taskStatus[i].checked == true){
                        this.taskStatus[i].checked = false;
                        this.stateLen -= 1;
                    }else{
                        this.taskStatus[i].checked = true;
                        this.stateLen += 1;
                    }
                }
            }
            if(this.stateLen == lableLen){
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
         // 格式化金额
        getEarnPoint(point) {
            return fmoney(point,2);
        },
        // 查询
        submitBtn(){
            this.show = false;
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
        font-size: 0.32rem;
    }
    .all_state, .all_type{
       width: 170px;
       height: 50px;
       text-align: center;
       line-height: 50px;
       border-radius: 47px;
       background-color: #f2f2f2; 
    }
    .all_type{
        margin-left: 20px;
    }
    .screen_term{
        float: right;
        .screen_title{
            line-height: 50px;
            float: left;
        }
        img{
            width: 28px;
            height: 28px;
            float: left;
            margin: 10px 0 0 5px;  
        }
    }
}
.repair_bg_1{
    width:100%;
    height:20px;
    float:left;
    background:#f2f2f2;
}
.history_recors_warp{
    width: 750px;
    float: left;
    padding: 30px 40px;
    margin-top: 90px;
}
.history_content, .history_recors{
    .van-cell-group{
        display: flex;
        flex-direction: row;
        .van-cell{
            height: 40px;
            line-height: 40px;
            padding: 0;
            flex: 1;
            text-align: center;
            border-left: 1px solid #d1d1d1;
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
        border-bottom: 1px solid #d1d1d1;
        .van-cell{
            height: 40px;
            line-height: 40px;
            background-color:#f2f2f2;
            font-size: 0.26rem;
        } 
    }
    .tab_content{
        border-bottom: 1px solid #d1d1d1;
        .van-cell{
            border-top: none;
        } 
    }
    .tab_content:last-child{
        border-bottom: none;
    }
    .empty_content{
        .van-cell{
            color: #262626 !important;
            text-align: center;
            font-size: 0.26rem;
            border: none;
        }
    }
}
.history_content{
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #d1d1d1;
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
}

</style>
