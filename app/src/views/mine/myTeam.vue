<!--  -->
<template>
  <div class="team_warp">
        <page-header title="我的团队" :show-icon="true"></page-header>
        <div class="team_content">
            <img class="user_img" src="../../assets/images/head/0.png" alt="">
            <div class="user_info">
                <div class="logon_time">注册时间：2020-09-02</div>
                <div class="invite_code">邀请码：AJSJSNK</div>
            </div>
        </div>
        <div class="income_gather">
            <div class="income_list">
                <ul>
                    <li>
                        <p class="income_type">今日佣金</p>   
                        <p class="income_cash">￥2000.00</p> 
                    </li>
                    <span class="divider_line"></span>
                    <li>
                        <p class="income_type">今日佣金</p>   
                        <p class="income_cash">￥2000.00</p> 
                    </li>
                </ul>
                <ul>
                    <li>
                        <p class="income_type">累计佣金</p>   
                        <p class="income_cash">￥2000.00</p> 
                    </li>
                    <span class="divider_line"></span>
                    <li>
                        <p class="income_type">直属下级</p>   
                        <p class="income_cash">108</p> 
                    </li>
                </ul>
                <ul>
                    <li>
                        <p class="income_type">团队人数</p>   
                        <p class="income_cash">￥2000.00</p> 
                    </li>
                    <span class="divider_line"></span>
                    <li>
                        <p class="income_type">今日活跃</p>   
                        <p class="income_cash">23</p> 
                    </li>
                </ul>
            </div>
        </div>
        <div class="team_income">
            <img src="../../assets/images/mine/icon_liebiao.png" alt="">
            <img class="income_img" src="../../assets/images/mine/icon_mingxi.png" alt="">
            <img src="../../assets/images/mine/icon_dingdan.png" alt="">
        </div>
  </div>
</template>

<script>
import PageHeader from "@/components/Header";
export default {
    components: { PageHeader },
  data () {
    return {
    }
  },

//   components: {},

//   computed: {},

//   mounted: {},

//   methods: {}
}

</script>
<style lang="scss" scoped>
    .team_warp{
        width: 100%;
        height: 100vh;
        float: left;
        background-color: #f2f2f2;
        .team_content{
            width: 100%;
            height: 258px;
            float: left;
            padding: 25px 43px;
            box-sizing: border-box;
            background: -webkit-linear-gradient(to bottom, #ff614b 0%,#fe997d 100%);
            background: linear-gradient(to bottom, #ff614b 0%,#fe997d 100%);
            .user_img{
                float: left;
                width: 120px;
                height: 120px;
                overflow: hidden;
                border-right: 50%;
            }
            .user_info{
                width: 300px;
                float: left;
                color: #fff;
                font-size: 28px;
                margin-left: 27px;
                .logon_time{
                    width: 100%;
                    float: left;
                    margin-top: 12px;
                }
                .invite_code{
                    width: 100%;
                    float: left;
                    margin-top: 22px;
                }
            }
        }
        .income_gather{
            width: 100%;
            float: left;
            padding: 0 30px;
            margin-top: -78px;
            .income_list{
                width: 100%;
                float: left;
                padding: 0 14px;
                border-radius: 16px;
                background-color: #fff;
                box-shadow: 0 8px 5px -3px #ececec; 
                ul{
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    border-bottom: 1px solid #e1e1e1;
                    li{
                        height: 164px;
                        color: #000000;
                        text-align: center;
                        flex: 1;
                        font-size: 38px;
                        .income_type{
                            line-height: initial;
                            margin-top: 20px;
                        }
                        .income_cash{
                            line-height: initial;
                            color: #ff0042; 
                            margin-top: 15px;
                        }
                    }
                    .divider_line{
                        height: 73px;
                        margin-top: 40px;
                        border-left: 1px solid #e1e1e1;
                    }
                } 
                ul:last-child{
                    border-bottom: none;
                }
                
            }
        }
        .team_income{
            width: 100%;
            float: left;
            padding: 0 30px;
            margin-top: 33px;
            img{
                width: 220px;
                height: 115px;
                float: left;
            }
            .income_img{
                margin: 0 13px;
            }
        }
    }
</style>