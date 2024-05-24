<template>
    <div class="task_content">
        <div class="head_class">
            <page-header :title="title" :show-icon="true"></page-header>
            <div class="mobile_class">
                <van-cell-group>
                    <van-field v-model="nextPhone" placeholder="请输入下级手机号码"  right-icon-class="font-size: 28px;" right-icon="search" :border="false" />
                </van-cell-group>
                <span class="search_btn" @click="searchBtn"></span>
            </div>
            <div class="dropdown_warp">
                <div class="promote-header">
                    <div class="tab_nav" @click="pulldownState">
                        <span v-if = "dateState == ''">请选择收益状态</span> 
                        <span v-else>{{ dateState }}</span> 
                        <van-icon class="down_img" name="arrow-down" style="transition: all 200ms linear" :style="{ transform: `rotate(${showState ? 180 : 0}deg)`}" />
                    </div>
                    <div class="tab_nav" @click="pulldownTime">
                        <span v-if = "timeValue === ''">请选择收益时间</span> 
                        <span v-else-if = "timeValue ==0">今天</span> 
                        <span v-else-if = "timeValue ==1">昨天</span> 
                        <span v-else-if = "timeValue ==2">近七天</span>
                        <van-icon class="down_img" name="arrow-down" style="transition: all 200ms linear" :style="{ transform: `rotate(${showTime ? 180 : 0}deg)`}" />
                    </div>
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
            <van-pull-refresh v-model="showLoading" @refresh = "downRefresh">
                <van-loading size="24px" slot="pulling">加载中...</van-loading>
                <van-loading size="24px" slot="loosing">松开即可更新</van-loading>
                <van-loading size="24px" slot="loading">更新中...</van-loading>
                <van-list v-model="moreLoading" :finished="hidefinished" :immediate-check="false" :offset = "100" finished-text = "没有更多了"  @load = "pullupload">
                    <van-loading size="24px" slot="loading">加载中</van-loading>
                        <div class="user_warp">
                            <div class="user_list" v-for="(item,index) in profitList" :key="index" @click="pullChange(index)">
                                <img v-if="item.point_type== 31" src="../../assets/images/earn/icon_yongjin.png" alt="">
                                <img v-else src="../../assets/images/earn/icon_shangjin.png" alt="">
                                <div class="user_info">
                                    <div class="account_mes">
                                        <span style="float:left;">{{item.phone_no}}({{item.user_id}})</span>
                                        <div class="order_num">￥{{getEarnPoint(item.point,2)}}</div>
                                    </div>
                                    <div class="time_mes">
                                        <span>{{item.time}}</span>
                                        <van-icon name="arrow" />
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="cumulative_list" v-if="index ==  pullIndex">
                                <ul class="cumulative_list_ul" v-for="item in accountList" :key="item">
                                    <li>累计佣金</li>
                                    <li>0元</li>
                                </ul>
                                <div class="submit_btn">
                                    <van-button type="default" v-clipboard:copy="17691235263"
                                        v-clipboard:success="copaySucess">复制帐号</van-button>
                                    <van-button type="primary" @click="nextLevelBtn">查看下级</van-button>
                                </div>
                            </div> -->
                        </div>
                    </van-list>
                    </van-pull-refresh>
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
import { dateStamp,fmoney } from "@/utils/tool";
import { profitDetail } from "@/api/user";
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
            page: 1,
            limit: 20,
            total: 0,
            profitType:[
                {text:'全部',value:-1},
                {text:'加粉赏金',value:22},
                {text:'加粉赏金',value:21},
                // {text:'人工调整',value:2},
                {text:'加粉返佣',value:31}
                // {text:'朋友圈任务',value:3}
            ],
            profitTime:['今天','昨天','近七天（包含今天）'],
            accountList:["推广","团队","返佣","FAQ"],
            profitList:[],
            showLoading:false,
            moreLoading:false,
            hidefinished:false,
        };
    },
    created() {
        this.title = this.$route.meta.title;
        this.porfitList();
    },
    methods: {
        porfitList(){
            let params = {
                phone_no:this.nextPhone,
                point_type:this.stateValue,
                stime: this.sTime == "" ? 0 : this.sTime == null ? 0 : dateStamp(this.sTime),
                etime: this.eTime == "" ? 0 : this.eTime == null ? 0 : dateStamp(this.eTime),
                page:this.page,
                limit:this.limit,
            }
            profitDetail(params).then(res => {
                this.profitList = res.list || [];
                this.pageCount = Math.ceil(res.total / this.limit) || 0; //总页数
                 console.log(this.pageCount);
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
            this.porfitList()
        },
        // 上拉加载
        pullupload() {
            this.page++;
            let params = {
                phone_no:this.nextPhone,
                point_type:this.stateValue,
                stime: this.sTime == "" ? 0 : this.sTime == null ? 0 : dateStamp(this.sTime),
                etime: this.eTime == "" ? 0 : this.eTime == null ? 0 : dateStamp(this.eTime),
                page:this.page,
                limit:this.limit,
            }
            if(this.page <= this.pageCount){
                profitDetail(params).then(res => {
                    for(let i =0;i<res.list.length;i++){
                        this.profitList.push(res.list[i]);
                    }
                    setTimeout(()=>{
                        this.moreLoading = false;
                    },1000)
                    
                });
            }else{
                setTimeout(()=>{
                    this.hidefinished = true;
                },500)
            }
        },
        // 格式化金额
        getEarnPoint(point) {
            return fmoney(point,2);
        },
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
            this.page = 1;
            this.stateValue = idx;
            this.dateState = val.text;
            this.porfitList();
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
            this.porfitList();
            setTimeout(() =>{
                this.showTime = false;
            },200)
        },
        // 搜索
        searchBtn(){
            this.profitList = [];
            this.page = 1;
            this.porfitList();
        },
        // 下级
        pullChange(){
            this.$toast("敬请期待");
        }
    }
};
</script>
<style>
    .mobile_class .van-cell__value{
        background-color: #f2f2f2;
        padding: 5px 12px;
        border-radius: 5px;
    }
</style>
<style lang="scss" scoped>
    .task_content{
        // width: 100%;
        // height: 100vh;
        // float: left;
        // overflow-y: scroll;
        // background-color: #f2f2f2;
        background-color: $home-grey-title;
        position: relative;
        .head_class{
            width: 100%;
            height: 286px;
            background-color: blue;
            position: fixed;
            top: 0;left: 0;
            z-index: 999;
            max-width: 1000px;
            left:50%;
            transform: translateX(-50%);
        }
        .mobile_class{
            width: 100%;
            float: left;
            height: 106px;
            // margin-top: 90px;
            position: relative;
            background-color: #fff;
            .search_btn{
                width: 65px;
                height: 65px;
                float: left;
                position: absolute;
                top: 20px;
                right: 45px;
            }
        }
        // .van-cell-group{
        //     .van-cell{
        //         padding: 5px 16px;
        //         margin-top: 10px;
        //         border-radius: 6px;
        //         background-color: #f2f2f2;
        //         .van-field__control{
        //             height: 50px !important;
        //         }
        //         .van-icon{
        //             font-size: 28px;
        //         }
        //     }
        // }
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
        height: calc(100vh - 290px);
        padding: 30px;
        overflow-y: auto;
        background-color: $home-grey-title;
        position: absolute;
        top: 286px;
        left: 0;
        -webkit-overflow-scrolling: touch; 
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
                            color: #fe003c;
                            font-size: 0.3rem;
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
