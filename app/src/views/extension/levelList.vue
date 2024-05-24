<template>
    <div class="task_content">
        <page-header :title="title" :show-icon="true"></page-header>
        <div class="mobile_class">
            <van-cell-group>
                <van-field v-model="nextPhone" placeholder="请输入下级手机号码"  right-icon-class="font-size: 28px;" right-icon="search" :border="false" />
            </van-cell-group>
        </div>
        <div class="dropdown_warp">
            <div class="promote-header">
                <div class="tab_nav" @click="pulldownState">
                    <span v-if = "dateState == ''">请选择提现状态</span> 
                    <span v-else>{{ dateState }}</span> 
                    <van-icon class="down_img" name="arrow-down" style="transition: all 200ms linear" :style="{ transform: `rotate(${showState ? 180 : 0}deg)`}" />
                </div>
                <div class="tab_nav" @click="pulldownTime">
                    <span v-if = "timeValue === ''">请选择收益时间</span> 
                    <span v-else-if = "timeValue == 0">今天</span> 
                    <span v-else-if= "timeValue == 1">昨天</span> 
                    <span v-else-if= "timeValue == 2">近七天</span>
                    <van-icon class="down_img" name="arrow-down" style="transition: all 200ms linear" :style="{ transform: `rotate(${showTime ? 180 : 0}deg)`}" />
                </div>
            </div>
        </div>
        <!-- <div class="screen_list">
            <van-dropdown-menu>
                <van-dropdown-item v-model="value" :options="profitType" />
                <van-dropdown-item v-model="value" :options="profiState" />
            </van-dropdown-menu>
        </div> -->
        <div class="user_content">
            <div class="user_warp" v-for="(item,index) in accountList" :key="index" @click="pullChange(index)">
                <div class="user_list">
                    <img v-if="item== '推广'" src="../../assets/images/earn/icon_shangjin.png" alt="">
                    <img v-else src="../../assets/images/earn/icon_yongjin.png" alt="">
                    <div class="user_info">
                        <div class="account_mes">
                            <span style="float:left;">17691235263(604ODD)</span>
                            <div class="order_num">￥20</div>
                        </div>
                        <div class="time_mes">
                            <span>2020-10-24 15:25:25</span>
                            <van-icon name="arrow" />
                        </div>
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
        </div>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
export default {
    name: "buy",
    components: { PageHeader},
    data() {
        return {
            stateValue:-1,
            timeValue:"",
            nextPhone:"",
            showState:false,
            showTime:false,
            datetime: "",
            dateState: "",
            sTime:"",
            eTime:"",
            profitType:[
                {text:'全部',value:-1},
                {text:'申请中',value:1},
                {text:'驳回',value:2},
                {text:'已到账',value:3}
            ],
            profitTime:['今天','昨天','近七天（包含今天）'],
            accountList:["推广","团队","返佣","FAQ"],
        };
    },
    created() {
        this.title = this.$route.meta.title;
    },
    methods: {
        copaySucess(){
            this.$toast(`${this.$t("home_031")}${this.$t("other_006")}`);
        },
        nextLevelBtn(){
            // this.$router.push("/levelList");
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
            this.stateValue = idx;
            this.dateState = val.text;
            // this.pointflow();
            setTimeout(() =>{
                this.showState = false;
            },200)
        },
        // 选择收益时间
        changeTime(idx){
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
            // this.pointflow();
            setTimeout(() =>{
                this.showTime = false;
            },200)
        }
    }
};
</script>
<style lang="scss" scoped>
    .task_content{
        width: 100%;
        height: 100vh;
        float: left;
        background-color: #f2f2f2;
        background-color: $home-grey-title;
        .mobile_class{
            width: 100%;
            float: left;
            height: 116px;
            padding: 0 30px;
            position: relative;
            z-index: 101;
            background-color: #fff;
        }
        .van-cell-group{
            .van-cell{
                padding: 9px 13px 5px 13px;
                margin-top: 8px;
                border-radius: 5px;
                background-color: #f2f2f2;
            }
        }
        .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
            border-width:0;
        }
        .screen_list{
            width: 100%;
            float: left;
            margin-top: 14px;
            background-color: green;
            float: left;
        }
    }
    .promote-header {
        width: 100%;
        height: 88px;
        float: left;
        color: #7e7e7e;
        font-size: 0.28rem;
        display: flex;
        flex-direction: row;
        line-height: 88px;
        padding: 0 30px;
        background-color: #fff;
        border-top: 1px solid  #e1e1e1;
        border-bottom: 1px solid  #e1e1e1;
        // background-color: darkblue;
        .tab_nav {
            flex: 1;
            text-align: center;
            .down_img {
                margin-left: 26px;
                width: 30px;
                vertical-align: middle;
            }
        }
        .tab_nav:nth-child(1){
            border-right: 1px solid #e1e1e1;
        }
    }
    .van-overlay{
        height: calc(100vh - 66px);
        position: absolute;
    }
    .screen_down{
        width: 100%;
        float: left;
        padding: 30px 35px;
        background-color: #fff;
    }

    .user_content{
        width: 100%;
        float: left;
        padding: 30px;
        position: relative;
        .user_warp{
            width: 100%;
            float: left;
            .user_list{
                width: 100%;
                float: left;
                border-radius: 8px;
                padding: 20px 0 20px 15px;
                box-sizing: border-box;
                margin-bottom: 20px;
                background-color: #fff;
                transition: all .5s;
                img{
                  width: 100px;  
                  height: 105px;
                  float: left;
                  margin-right: 17px;
                }
                .user_info{
                    width: 80%;
                    float: left;
                    .account_mes, .time_mes{
                        width: 100%;
                        color: #000;
                        float: left;
                        font-size: 0.28rem;
                        margin-top: 13px;
                        // span{
                        //     margin-left: 20px;
                        // }
                        .order_num{
                            float: right;
                            font-weight: 550;
                            color: #fe8c00;
                            font-size: 28px;
                            margin-top: -5px;
                            text-align: center;
                        }
                    }
                    .time_mes{
                        color: #8c8c8c;
                        margin-top: 13px;    
                        .van-icon{
                            float: right;
                            font-size: 12px;
                            // margin-top: -2px;
                        } 
                    }

                }
                .right_btn{
                    float: right;
                }
            }
        }
            
    }
</style>
