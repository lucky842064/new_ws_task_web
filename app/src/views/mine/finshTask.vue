<template>
    <div class="earn">
        <div class="custom_head">
            <page-header style="position: fixed;top: 0;left: 0; z-index: 9;" title="完成任务详情" :show-icon="true" :bgcolor="false"></page-header>
            <div class="dropdown_warp">
                <div class="promote-header">
                    <div class="tab_nav" @click="dateShow=!dateShow">
                        <span>{{currDate}}</span> 
                        <van-icon class="down_img" name="arrow-down" style="transition: all 200ms linear" :style="{ transform: `rotate(${dateShow ? 180 : 0}deg)`}" />
                    </div>
                    <div class="tab_nav search_area">
                        <van-cell-group inset>
                            <van-field v-model="mobile" center clearable placeholder="搜索账号">
                                <template #button>
                                    <van-button size="small" type="primary" @click="getTaskDetail(1)">搜索</van-button>
                                </template>
                            </van-field>
                        </van-cell-group>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="record_content">
            <div class="buy_number" v-for="(item,index) in invitlist" :key="index">
                <div class="invit_item1">
                    <p>账号：<em class="record_text">{{item.phone_no}}</em></p>
                </div>
                <div class="invit_item2">
                    <p>任务完成数量：<em class="record_cash">{{item.complete_num}}单</em></p>
                </div>
                <div class="invit_item3">
                    <van-button type="danger" :disabled="setUpdate!=1" @click="setDivideBtn(item)">设置</van-button>
                </div>
                <span class="head_title">账号：{{item.user_key}}</span>
                <div class="task_num">
                    <span>任务完成量：</span><em class="record_cash">{{item.complete_num}}单</em>
                </div>
            </div>
        </div> -->
        <div class="record_content" v-if="invitlist&&invitlist.length>0">
            <template>
                <div class="buy_number" v-for="(item,index) in invitlist" :key="index">
                    <div class="invit_item1">
                        <p>账号：<em class="record_text">{{item.account}}</em></p>
                        <p>任务类型：<em class="record_text" style="color: #07c160;">{{taskOption[item.type]}}</em></p>
                        <!-- <p>团队人数：<em class="record_text">{{item.num}}</em></p> -->
                    </div>
                    <div class="invit_item2">
                        <p>任务完成数量：<em class="record_cash">{{item.num}}单</em></p>
                        <!-- <p>抽成：<em class="record_cash">{{item.task_rate}}%</em></p> -->
                        <!-- <p>任务完成数量：<em class="record_cash">{{item.complete_num}}单</em></p> -->
                    </div>
                    <!-- <div class="invit_item3">
                        <van-button type="danger" :disabled="setUpdate!=1" @click="setDivideBtn(item)">设置</van-button>
                    </div> -->
                    <!-- <span class="head_title">账号：{{item.user_key}}</span>
                    <div class="task_num">
                        <span>任务完成量：</span><em class="record_cash">{{item.complete_num}}单</em>
                    </div> -->
                </div>
            </template>
        </div>
        <div v-else class="empty_tips">暂无数据...</div>
        <PrevNext v-if="invitlist&&invitlist.length>0" :len="invitlist.length" :page="page" :limit="limit" :total="total" @to-prev="onPrev" @to-next="onNext"></PrevNext>
        <van-overlay :show = "showState" @click="showState = false">
            <div class="screen_down" @click.stop>
                <ul>
                    <li v-for="item in profitType" :key="item.value" :class="item.value === stateValue  ? 'checkActive':''" @click="changeType(item.value,item)">{{item.text}}</li>
                </ul>
            </div>
        </van-overlay>
        <van-overlay :show = "showTime" @click="showTime = false">
            <div class="screen_down" @click.stop>
                <ul>
                    <li v-for="(item,index) in profitTime" :class="index === timeValue  ? 'checkActive':''" :key="index" @click="changeTime(index)">{{item}}</li>
                </ul>
            </div>
        </van-overlay>
        <van-calendar v-model="dateShow" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm"/>
    </div>
</template>
<script>
import { Toast } from 'vant';
import PageHeader from "@/components/Header";
import {fmoney,currentDate } from "@/utils/tool";
import PrevNext from "@/components/PrevNext";
import { gettaskrecordlist } from'@/api/task'
export default {
    components: { PageHeader,PrevNext},
    data() {
        return {
            mobile:"",
            setUpdate:"",
            setMobile:"",
            divideNum:"",
            currentPage:1,
            profitType:[
                {text:'全部类型',value:-1},
                {text:'提现扣款',value:1},
                {text:'人工调整',value:2},
                {text:'提现返还',value:3},
                {text:'注册赠送',value:4},
                {text:'加粉赏金',value:21},
                {text:'加粉赏金',value:22},
                {text:'加粉返佣',value:31}
            ],
            currDate: currentDate(),
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            profitTime:['今天','昨天','近七天（包含今天）'],
            taskOption: ["","私发","拉群"],
            stateValue:-1,
            timeValue:"",
            showState:false,
            showTime:false,
            dateShow: false,
            dataModel:false,
            datetime: "",
            dateState: "",
            sTime:"",
            eTime:"",
            currentDate: "", //初始化当前时间
            page: 1,
            limit: 20,
            total: 0,
            state:0,
            invitlist: [
                // {
                //     id:0,
                //     phone_no:"15898776543",
                //     team_num:'10',
                //     task_price:10,
                //     task_rate:1,
                //     complete_num:0,
                // }
            ]
        };
    },
    created() {
        this.getTaskDetail();
    },
    methods: {
        getTaskDetail(num) {
            this.page=num!=undefined?num:this.page;
            let isLoading = Toast.loading({message: '加载中...',forbidClick: true})
            gettaskrecordlist({
                page: this.page,
                limit: this.limit,
                account:this.mobile,
                start_time:Date.parse(this.currDate+" 00:00:00")/1000,
                end_time:Date.parse(this.currDate+" 23:59:59")/1000,
            }).then(res => {
                isLoading.clear();
                this.invitlist = res.list || [];
                this.total = res.total;
            })
        },
        setDivideBtn(row){
            this.setMobile=row.phone_no;
            this.divideNum=row.task_rate;
            this.dataModel=true;
        },
        // 格式化金额
        formatMoney(point) {
            return fmoney(point,2);
        },
        onPrev() {
            this.page--;
            this.pointflow();
        },
        onNext() {
            this.page++;
            this.pointflow();
        },
        adjustNum(num){
            if(num < 10) return '0'+num
            return num
        },
        onConfirm(date){
            this.currDate = date.getFullYear()+'-'+ this.adjustNum(date.getMonth()+1)+'-'+  this.adjustNum(date.getDate())
            this.dateShow = false;
            this.getTaskDetail();
        },
        //阻止关闭弹框
        onBeforeClose(action, done) {
            if (action === "confirm") {//点击确定按钮
                if(this.divideNum==""){
                    this.$toast('请输分成比例值');
                }
                resetagentrate({phone_no:this.setMobile,task_rate:Number(this.divideNum)}).then(res => {
                    done()
                    this.dataModel=false;
                    this.getTaskDetail();
                });
            } else {
                return done()//允许关闭
            }
        },
        heaberBtn(){
            this.divideNum=this.divideNum>10?10:this.divideNum<0?0:this.divideNum;
        }
    }
};
</script>
<style lang="scss" scoped>
.earn {
    width: 100%;
    float: left;
    overflow: hidden;
    background-color: #f2f2f2;
    -webkit-overflow-scrolling: touch;
    .dropdown_warp{
        margin-top: 90px;
    }
    .custom_head{
        width:100%;
        float: left;
        z-index: 2;
        position: relative;
    }
}
.promote-header {
    width: 100%;
    display: flex;
    color: #7e7e7e;
    font-size: 0.28rem;
    display: flex;
    padding: 12px 20px;
    justify-content: space-between;
    .tab_nav {
        width: 35%;
        height: 68px;
        display: flex;
        flex-grow: 0;
        overflow: hidden;
        margin-right: 10px;
        background-color: #fff;
        .down_img {
            margin-left: 6px;
            width: 30px;
            vertical-align: middle;
        }
        border-radius: 44px;
        align-items: center;
        justify-content: center;
    }
    .search_area{
        flex-grow: 1;
        display: flex;
        margin-left: 10px;
        align-items: center;
        .van-cell{
            display: flex;
            padding-right: 0;
            align-items: center;
            justify-content: center;
        }
        .van-field__button{
            .van-button{
                width: 58px;
                border: none;
                border-radius: 44px;
                background-color:$home-bind-button;
            }
        }
    }
}
.van-overlay{
  height: calc(100vh - 66px);
  position: absolute;
}
.screen_down{
    width: 100%;
    float: left;
    padding: 40px 45px;
    background-color: #fff;
}
.record_content{
    width: 100%;
    overflow-y: auto;
    font-size: 0.28rem;
    box-sizing: border-box;
    position: relative;
    height: calc(100% - 260px);
    .buy_number{
        width: 100%;
        display: flex;
        align-items: center;
        padding: 22px 32px;
        box-sizing: border-box;
        background-color: #fff;
        border-bottom: 1px solid  #e9e9e9;
        .invit_item1, .invit_item2{
            width: 100%;
            flex-grow: 1;
            text-align: left;
            p{
                color: #999999;
                font-size: 24px;
                .record_cash, .record_text{
                    color: #fe003c;
                    font-style: normal;
                    font-size: 0.28rem;
                }
                .record_text{
                    color: #000;
                }
            }
        }
    }
}
.buy-footer{
    width:100%;
    display: flex;
    padding: 16px 0 10px 0;
    font-size: 28px;
    align-items: center;
    justify-content: center;
}
</style>
