<template>
    <div class="earn">
        <div class="custom_head">
            <page-header style="position: fixed;top: 0;left: 0; z-index: 9;" :title="$t('title_001')" :show-icon="true" :bgcolor="false"></page-header>
            <div class="dropdown_warp">
                <div class="promote-header">
                    <div class="tab_nav" @click="pulldownTime">
                        <span v-if = "timeValue === ''">收益时间</span> 
                        <span v-else-if = "timeValue == 0">今天</span> 
                        <span v-else-if= "timeValue == 1">昨天</span> 
                        <span v-else-if= "timeValue == 2">近七天</span>
                        <van-icon class="down_img" name="arrow-down" style="transition: all 200ms linear" :style="{ transform: `rotate(${showTime ? 180 : 0}deg)`}" />
                    </div>
                    <div class="tab_nav" @click="pulldownState">
                        <span v-if = "dateState == ''">收益类型</span> 
                        <span v-else>{{ dateState }}</span> 
                        <van-icon class="down_img" name="arrow-down" style="transition: all 200ms linear" :style="{ transform: `rotate(${showState ? 180 : 0}deg)`}" />
                    </div>
                    <div class="tab_nav cash_nav" @click="pulldownState">
                        总收益：<span style="color:#F52C2C;">{{formatMoney(total_point)}}元</span> 
                    </div>
                </div>
            </div>
        </div>
        <div class="service-body">
            <div class="record_list">
                <div class="record_warp record_title">
                    <span>{{$t("mine_007")}}</span>
                    <span>{{$t("mine_001")}}</span>
                    <span>{{$t("mine_006_1")}}</span>
                </div>
                <div class="record_content">
                    <div class="buy-number" v-for="(item,index) in list" :key="index">
                        <span class="head_title">{{item.time}}</span>
                        <span class="head_title">{{item.desc}}
                        </span>
                        <span class="record_cash">{{item.point}}</span>
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
            <PrevNext style="width:100%;float:left;margin:10px 0 10px 0;" :len="list.length" :page="page" :limit="limit" :total="total" @to-prev="onPrev" @to-next="onNext"></PrevNext>
        </div>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
import { fmoney } from "@/utils/tool";
import PrevNext from "@/components/PrevNext";
import { getaccountincome } from '@/api/bill';
export default {
    components: { PageHeader,PrevNext },
    data() {
        return {
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
            total_point:0,
            profitTime:['今天','昨天','近七天（包含今天）'],
            stateValue:-1,
            timeValue:"",
            showState:false,
            showTime:false,
            datetime: "",
            dateState: "",
            sTime:"",
            eTime:"",
            currentDate: "", //初始化当前时间
            page: 1,
            limit: 20,
            total: 0,
            state:0,
            list: []
        };
    },
    created() {
        this.billDetail();
    },
    methods: {
        onPrev() {
            this.page--;
            this.billDetail();
        },
        onNext() {
            this.page++;
            this.billDetail();
        },
        billDetail() {
            getaccountincome({
                page: this.page,
                limit: this.limit,
                stime: this.sTime == "" ? 0 : this.sTime == null ? 0 : dateStamp(this.sTime),
                etime: this.eTime == "" ? 0 : this.eTime == null ? 0 : dateStamp(this.eTime),
                point_type: this.stateValue
            }).then(res => {
                this.total = res.total;
                this.list = res.list || [];
                this.total_point = res.total_point;
                for(let i = 0;i<this.list.length;i++){
                    if(String(this.list[i].point).indexOf("-") == -1){
                        this.list[i].point = "+"+(this.list[i].point/10000)    
                    }else{
                       this.list[i].point = this.list[i].point/10000  
                    }
                }
            });
        },
        pulldownState(){
            this.showTime = false;
            this.showState = !this.showState;
        },
        pulldownTime(){
            this.showState = false;
            this.showTime = !this.showTime;
        },
        // 选择收益类型
        changeType(idx,val){
            this.page = 1;
            this.stateValue = idx;
            this.dateState = val.text;
            this.pointflow();
            setTimeout(() =>{
                this.showState = false;
            },200)
        },
        // 选择收益时间
        changeTime(idx){
            this.page = 1;
            this.timeValue = idx;
            let newDate = new Date();
            let sTime = "00"+":"+"00"+":"+"00";
            let eTime = "23"+":"+"59"+":"+"59";
            if(idx == 0){
                newDate.setTime(newDate.getTime());
                let today = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
                this.datetime = today;
                this.sTime = today +" "+ sTime;
                this.eTime = today +" "+ eTime;
            }else if(idx == 1){
                newDate.setTime(newDate.getTime()-24*60*60*1000);
                let yTady = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
                this.datetime = yTady;
                this.sTime = yTady +" "+ sTime;
                this.eTime = yTady +" "+ eTime;
            }else if(idx == 2){
                newDate.setTime(newDate.getTime());
                let today = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
                newDate.setTime(newDate.getTime()-7*24*60*60*1000);
                let sevenTady = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
                this.datetime = sevenTady;
                this.sTime = sevenTady +" "+ sTime;
                this.eTime = today +" "+ eTime;
            }
            this.pointflow();
            setTimeout(() =>{
                this.showTime = false;
            },200)
        },
        // 格式化金额
        formatMoney(point) {
            return fmoney(point,2);
        },
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
    float: left;
    color: #7e7e7e;
    font-size: 0.28rem;
    display: flex;
    flex-direction: row;
    padding: 12px 30px 12px;
    background-color: #fff;
    border-bottom: 1px solid  #f2f2f2;
    // background-color: darkblue;
    display: flex;justify-content:space-around;
    .tab_nav {
        width: 196px;
        // padding: 0 24px;
        height: 68px;
        display: flex;
        flex-grow: 0 98px;
        overflow: hidden;
        margin-right: 10px;
        background-color: #FFF2F2;
        .down_img {
            margin-left: 6px;
            width: 30px;
            vertical-align: middle;
        }
        border-radius: 44px;
        align-items: center;
        justify-content: center;
    }
    .cash_nav{
        flex-grow: 1;
        background: transparent;
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
        span{
            float: left;
            height: 84px;
            line-height: 84px;
        }
        span:nth-child(1) {
            width: 46%;
        }
        span:nth-child(2){
            width: 30%;
        }
        span:nth-child(3){
            width: 24%;
        }
    }
    .record_title{
      span{
            font-weight: 550;
        }  
    }
    .record_content{
        width: 100%;
        float: left;
        overflow: hidden;
        .buy-number{
            width: 100%;
            float: left;
            padding: 10px 0;
            background-color: #fff;
            border-bottom: 1px solid  #e9e9e9;
        }
        .record_cash{
            float: right;
            color: #fe003c;
            font-size: 0.28rem;
        }
    }
}
</style>