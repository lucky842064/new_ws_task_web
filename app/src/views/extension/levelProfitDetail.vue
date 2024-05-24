<template>
    <div class="task_content">
        <page-header :title="title" :show-icon="true"></page-header>
        <div class="mobile_class">
            <van-cell-group>
                <van-field v-model="nextPhone" placeholder="请输入下级手机号码"  right-icon-class="font-size: 28px;" right-icon="search" :border="false" />
            </van-cell-group>
        </div>
        <div class="screen_list">
            <van-dropdown-menu>
                <van-dropdown-item v-model="value" :options="profitType" />
                <van-dropdown-item v-model="value" :options="profiState" />
            </van-dropdown-menu>
        </div>
        <div class="user_content">
            <div class="user_warp" v-for="(item,index) in accountList" :key="index" @click="pullChange(index)">
                <div class="user_list">
                    <img src="../../assets/images/head/0.png" alt="">
                    <div class="user_info">
                        <div class="account_mes">
                            <span>17691235263</span>
                        </div>
                        <div class="time_mes">
                            <span>2020-10-24 15：25：25</span>
                        </div>
                    </div>
                    <div class="right_btn">
                        <van-icon name="arrow" />
                        <div class="order_num">+20</div>
                    </div>
                </div>
            </div>
            <div></div>
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
            pullIndex:0,
            nextPhone:"",
            value:0,
            profitType:[
                { text: '请选择收益状态', value: 0 },
                { text: '昨天', value: 1 },
                { text: '近七天（含今天）', value: 2 },
            ],
            profiState:[
                { text: '请选择收益时间', value: 0 },
                { text: '昨天', value: 1 },
                { text: '近七天（含今天）', value: 2 },
            ],
            accountList:["推广","团队","返佣","FAQ"],
        };
    },
    created() {
        this.title = this.$route.meta.title;
    },
    methods: {
        pullChange(idx){
            this.pullIndex = idx;
        },
        copaySucess(){
            this.$toast(`${this.$t("home_031")}${this.$t("other_006")}`);
        },
        nextLevelBtn(){
            // this.$router.push("/levelList");
        }
    }
};
</script>
<style lang="scss" scoped>
    .task_content{
        background-color: $home-grey-title;
        .mobile_class{
            width: 100%;
            float: left;
            height: 96px;
            padding: 0 30px;
            background-color: #fff;
        }
        .van-cell-group{
            .van-cell{
                padding: 5px 16px;
                margin-top: 8px;
                border-radius: 6px;
                background-color: #f2f2f2;
                .van-field__control{
                    height: 50px !important;
                }
                .van-icon{
                    font-size: 28px;
                }
            }
        }
        .screen_list{
            width: 100%;
            float: left;
            margin-top: 14px;
            background-color: green;
            float: left;
        }
    }

    .user_content{
        width: 100%;
        float: left;
        padding: 30px;
        .user_warp{
            width: 100%;
            float: left;
            .user_list{
                width: 100%;
                height: 110px;
                border-radius: 8px;
                padding: 20px 15px 0 15px;
                box-sizing: border-box;
                margin-bottom: 20px;
                background-color: #fff;
                transition: all .5s;
                img{
                  width: 72px;  
                  height: 72px;
                  float: left;
                  margin-right: 17px;
                }
                .user_info{
                    float: left;
                    .account_mes{
                        width: 400px;
                        color: #000;
                        font-size: 24px;
                            span:nth-child(2){
                                margin-left: 40px;
                            }
                    }
                    .time_mes{
                        width: 400px;
                        color: #505050;
                        font-size: 20px;
                        margin-top: 8px;
                        span:nth-child(2){
                            margin-left: 33px;
                        }
                    }
                }
                .right_btn{
                    float: right;
                    .order_num{
                        width: 100%;
                        float: right;
                        color: #fb0337;
                        font-size: 24px;
                        margin-top: 5px;
                        text-align: center;
                    }
                }
               .van-icon{
                   float: right;
                   font-size: 18px;
                   margin-top: 2px;
                   margin-right: 18px;
               } 
            }
        }
            
    }
</style>
