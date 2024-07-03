<template>
    <div class="home_warp">
        <div class="top_model">
            <div class="user_mess">
                <div class="user_head">
                    <img src="../assets/images/head/12.png" alt="" srcset="">
                </div>
                <div class="user_info">
                    <div class="user_name">{{ userInfo.account }}</div>
                    <div class="user_code">推荐吗：{{userInfo.inviteCode}} <span class="copay_code" v-clipboard:copy="userInfo.inviteCode" v-clipboard:success="copySuccess">复制</span></div>
                </div>
            </div>
            <div class="lang_mess">
                <!-- <span>zh-CN</span>
                <img src="../assets/images/home/down_arrow_white.png" alt="" srcset=""> -->
            </div>
            <div class="cover_model">
                <div class="task_warp">
                    <div class="task_num">
                        <div class="text_1">账户余额</div>
                        <div class="text_2">
                            <img src="../assets/images/mine/Recharge.png" alt="" srcset="">
                            <span>{{user_money||0.00}}</span>
                        </div>
                    </div>
                    <div class="custom_line">
                        <span class="botton_line"></span>
                    </div>
                    <div class="task-pro">
                        <div class="left-pro">
                            <p>{{allIncome.today_income ||0}}</p>
                            <p>{{ $t("home_058") }}</p>
                        </div>
                        <div class="right-pro">
                            <p>{{allIncome.yesterday_income ||0}}</p>
                            <p>{{ $t("home_059") }}</p>
                        </div>
                        <!-- <div class="right-pro">
                            <p>999</p>
                            <p>{{ $t("home_060") }}</p>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="task_continer">
            <div class="task_main">
                <div class="task_item" v-for="(item, idx) in menuOption" :key="idx" @click="handleJump(item.path)">
                    <div class="left_text">
                        <img class="ws_icon" :src="item.icon" alt="">
                        <span>{{ item.name }}</span>
                    </div>
                    <div class="right_icon">
                        <img src="../assets/images/home/xiala_icon.png" alt="" srcset="">
                    </div>
                </div>
            </div>
        </div>
        <div class="login_out">
            <van-button type="danger" @click="logoutHandle">退出登录</van-button>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { getaccountincome,getbrokeragestatis } from '@/api/home'
export default {
    name: 'home',
    components: {},
    data() {
        return {
            code: "456666",
            user_money:0,
            allIncome:"",
            taskOption: [
                {
                    status: 1,
                },
                {
                    status: 2,
                },
                {
                    status: 3,
                }
            ]
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.User,
            bannerList: state => state.User.bannerList
        }),
        taskNameOption() {
            return ["", "WhatsApp挂机任务", "WhatsApp拉粉任务", "WhatsApp拉群任务"]
        },
        taskStatusOption() {
            return ["", "开始任务", "进行中", "已结束"]
        },
        menuOption() {
            return [
                {
                    name:this.$t("title_002"),
                    path:"/withdraw",
                    icon:require("../assets/images/mine/mine-put-record.png")
                },
                {
                    name:this.$t("title_012"),
                    path:"/betrecord",
                    icon:require("../assets/images/mine/me_icon_txjl.png")
                },
                {
                    name:this.$t("title_005"),
                    path:"/putrecord",
                    icon:require("../assets/images/mine/mine-put-record2.png")
                },
                // {
                //     name:"消息中心",
                //     path:"/sysMsg",
                //     icon:require("../assets/images/mine/mine-message-center.png")
                // },
                {
                    name:this.$t("login_003"),
                    path:"/ResetPwd",
                    icon:require("../assets/images/mine/mine-update-pwd.png")
                }
            ]
        }
    },
    created() {
        this.syncInitApi();
    },
    methods: {
        syncInitApi(){
            let fun1 = new Promise((resolve,reject)=>{
                getaccountincome().then(res =>{
                    resolve(res)
                })
            });
            let fun2 = new Promise((resolve,reject)=>{
                getbrokeragestatis().then(res =>{
                    resolve(res)
                })
            });
            Promise.all([fun1,fun2]).then( res => {
                const [{income},data2] = res;
                this.user_money = income;
                this.allIncome = data2;
            })
        },
        copySuccess() {
            this.$toast(`${this.$t("home_031")}${this.$t("other_006")}`);
        },
        handleTask(row) {
            if (row.status == 1) {
                this.$router.push("/scanOnline")
            } else if (row.status == 2) {
                this.$router.push("/pullgroupTask")
            } else if (row.status == 3) {
                this.$router.push("/pullPownTask")
            }
        },
        handleJump(path){
            this.$router.push(path);
        },
        logoutHandle() {
            this.$dialog.confirm({
                title: this.$t("other_008"),
                message: this.$t("mine_055"),
                confirmButtonColor: "rgb(255,2,65)",
                confirmButtonText: this.$t("other_005"),
                cancelButtonText: this.$t("other_004")
            }).then(() => {
                this.$store.dispatch("User/logoutUser");
                var storage = window.localStorage;
                storage["isstorename"] =  "no";
                try{
                    if(this.isAndroid){
                        JSInterface.onLoginout();
                    }else if(this.isIOS){
                        let params = {"method":"onLoginout"};
                        window.webkit.messageHandlers.jsCallNativeMethod.postMessage(params);
                    }
                }catch(e){}
                this.$router.push("/login")
            })
        }
    }
};
</script>
<style lang="scss" scoped>
.home_warp {
    height: 100%;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #f2f2f2;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 120px;
    .top_model {
        width: 100%;
        height: 340px;
        display: flex;
        padding: 0 30px;
        margin-bottom: 280px;
        position: relative;
        box-sizing: border-box;
        justify-content: space-between;
        background: #f45250;
        border-bottom-left-radius: 80px;
        border-bottom-right-radius: 80px;
        .user_mess,
        .lang_mess {
            display: flex;
            font-size: 28px;
            height: 180px;
            color: #fff;
            align-items: center;

            .user_head {
                width: 120px;
                height: 120px;
                flex-shrink: 0;
                overflow: hidden;
                border-radius: 50%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .user_info {
                margin-left: 20px;

                .user_name {
                    font-weight: bold;
                    font-size: 36px;
                }

                .user_code {
                    margin-top: 10px;

                    .copay_code {
                        padding: 8px 26px;
                        font-size: 24px;
                        background-color: #fff;
                        color: $home-order-title;
                        background: #fff;
                    }
                }
            }
        }

        .lang_mess {
            display: flex;

            img {
                height: 20px;
                margin-left: 10px;
            }
        }

        .cover_model {
            width: 100%;
            position: absolute;
            top: 190px;
            left: 0;
            padding: 0 20px;
            box-sizing: border-box;
            .task_warp {
                display: flex;
                flex-direction: column;
                padding: 30px 0 40px 0;
                border-radius: 10px;
                background-color: $font-color-white;

                .task_num {
                    width: 100%;
                    display: flex;
                    margin-bottom: 40px;
                    align-items: center;
                    flex-direction: column;

                    .text_1 {
                        font-size: 28px;
                    }

                    .text_2 {
                        display: flex;
                        font-size: 78px;
                        font-weight: bold;
                        align-items: center;
                        margin-top: 30px;

                        img {
                            height: 64px;
                            margin-right: 30px;
                        }
                    }
                }
            }
            .task-pro {
                width: 100%;
                display: flex;
                margin-top: 30px;
                flex-direction: row;
                .left-pro,
                .right-pro {
                    flex: 1;

                    p {
                        width: 100%;
                        display: flex;
                        color: #999999;
                        font-weight: bold;
                        justify-content: center;
                        align-items: center;
                    }
                }

                .left-pro p:nth-child(1), .right-pro p:nth-child(1) {
                    color: $home-eart-rate-value;
                    font-size: 42px;
                }
                .right-pro p:nth-child(1){
                    color: $home-month-value;
                }

                .left-pro p:nth-child(2),
                .right-pro p:nth-child(2) {
                    font-size: 24px;
                    margin-top: 12px;
                }
            }
        }
    }

    .task_continer {
        width: 100%;
        display: flex;
        margin-top: 20px;
        flex-direction: column;
        box-sizing: border-box;
        background-color: $font-color-white;
        .task_main {
            display: flex;
            padding: 0 20px;
            border-radius: 10px;
            box-sizing: border-box;
            flex-direction: column;
            .task_item {
                width: 100%;
                display: flex;
                font-size: 30px;
                padding: 30px 20px;
                align-items: center;
                box-sizing: border-box;
                justify-content: space-between;
                border-bottom: 1px solid #ececec;
                .left_text {
                    display: flex;
                    align-items: center;
                    .ws_icon {
                        height: 60px;
                        margin-right: 10px;
                    }
                }
                .right_icon{
                    img{
                        height: 26px;
                        transform: rotate(-90deg);
                    }
                }

                .van-button {
                    width: 100px;
                    height: max-content;
                    line-height: 1;
                    padding: 10px 0;
                    font-size: 12px;
                    border-radius: 35px;
                    box-sizing: border-box;
                }
            }
            .task_item:last-child{
                border: none;
            }
        }
    }
    .login_out{
        width: 100%;
        display: flex;
        padding: 0 20px;
        margin: 30px 0 60px 0;
        box-sizing: border-box;
        .van-button{
            width: 100%;
            border-radius: 30px;
        }
    }
}
.custom_line{
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  .botton_line{
    width: 100%;
    display: flex;
    border-bottom: 2px dashed #ececec;
  }
}
</style>
