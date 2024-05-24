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
                            <van-field v-model="mobile" center clearable placeholder="搜索下级">
                                <template #button>
                                    <van-button size="small" type="primary" @click="pointflow(1)">搜索</van-button>
                                </template>
                            </van-field>
                        </van-cell-group>
                    </div>
                </div>
            </div>
        </div>
        <div class="service-body">
            <div class="record_list">
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
                <div class="record_content">
                    <div class="buy_number" v-for="(item,index) in invitlist" :key="index">
                        <div class="invit_item1">
                            <p>账号：<em class="record_text">{{item.phone_no}}</em></p>
                            <p>团队人数：<em class="record_text">{{item.team_num}}</em></p>
                        </div>
                        <div class="invit_item2">
                            <p>任务完成数量：<em class="record_cash">{{item.complete_num}}单</em></p>
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
                </div>
            </div>
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
            <PrevNext style="width:100%;float:left;margin:10px 0 10px 0;" :len="invitlist.length" :page="page" :limit="limit" :total="total" @to-prev="onPrev" @to-next="onNext"></PrevNext>
            <!-- <van-pagination v-model="currentPage" :total-items="125" :show-page-size="3" force-ellipses style="width:100%;float:left;"  /> -->
        </div>
        <van-calendar v-model="dateShow" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm"/>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
import {teamlist,resetagentrate } from "@/api/earn";
import {fmoney,currentDate } from "@/utils/tool";
import PrevNext from "@/components/PrevNext";
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
    computed: {
        // appList() {
        //     return this.$store.state.User.appList;
        // }
    },
    created() {
        this.pointflow();
    },
    methods: {
        pointflow(num) {
            this.page=num!=undefined?num:this.page
            teamlist({
                page: this.page,
                limit: this.limit,
                phone_no:this.mobile,
                idate: Number(this.currDate.split('-').join('')),
            }).then(res => {
                this.setUpdate = res.can_update;
                this.invitlist = res.list || [];
                this.total = res.total;
            });
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
            this.pointflow();
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
                    this.pointflow();
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
    height: 100vh;
    overflow-x: hidden;
    float: left;
    overflow-y: scroll;
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
.service-body{
    width: 100%;
    float: left;
    min-height: 100vh;
    background-color: #fff;
    font-size: 0.28rem;
    box-sizing: border-box;position: relative;
    .record_list{
        width: 100%;
        float: left;
        overflow: hidden;
    }
    .record_warp{
        background-color: #e9e9e9;
    }
    .record_warp, .record_content{
        width: 100%;
        float: left;
        text-align: center;
    }
    .record_content{
        width: 100%;
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
}
</style>
