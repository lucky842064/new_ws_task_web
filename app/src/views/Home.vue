<template>
    <div class="home_warp" @click="isIndex=false">
        <div class="top_model">
            <div class="user_mess">
                <div class="user_head">
                    <img src="../assets/images/head/12.png" alt="" srcset="">
                </div>
                <div class="user_info">
                    <div class="user_name">{{ userInfo.account }}</div>
                    <div class="user_code">推荐吗：{{userInfo.inviteCode}} <span class="copay_text" v-clipboard:copy="userInfo.inviteCode" v-clipboard:success="copySuccess">复制</span></div>
                </div>
            </div>
            <div class="l_value" @click="showChangeBtn" @click.stop>
                <span>{{ langOptions[langIdx] }}</span>
                <img class="down_icon" src="../assets/images/home/down_arrow_white.png" alt="" srcset="">
                <div class="down_list" :class="isIndex?'active_open':'active_close'">
                    <p v-for="(item,idx) in langOptions" :key="idx" :style="langIdx==idx?'color:#07c160;':''" @click="onChangeType(idx)">{{item}}</p>
                </div>
            </div>
            <div class="cover_model">
                <div class="task-pro">
                    <div class="left-pro">
                        <p style="color:#f2943d;">{{user_money||0.00}}</p>
                        <p>{{ $t("home_056") }}</p>
                    </div>
                    <div class="custom_set_line">
                        <span></span>
                    </div>
                    <div class="right-pro">
                        <p style="color:#e8555b;">{{ teamStemp.yesterday_income || 0.00 }}</p>
                        <p>{{ $t("home_057") }}</p>
                    </div>
                    <div class="custom_set_line">
                        <span></span>
                    </div>
                    <div class="right-pro">
                        <p style="color:#677fdf;">{{ teamStemp.yesterday_income || 0.00 }}</p>
                        <p>{{ $t("home_061") }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="home_content">
            <div class="notice_text">
                <van-notice-bar speed='20' :left-icon="require('../assets/images/home/earn-icon-a.png')" scrollable text="中午12点到晚上6点执行任务，期间挂机享受收益，请保持在线！" />
            </div>
            <van-swipe class="my_swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(item,idx) in bannerList" :key="idx">
                    <template v-if="item.link">
                        <a style="display: flex;" :href="item.link" target="_blank">
                            <img :src="item.file_url" alt="">
                        </a>
                    </template>
                    <template v-else>
                        <img :src="item.file_url" alt="">
                    </template>
                </van-swipe-item>
            </van-swipe>
        </div>
        <div class="task_continer">
            <div class="task_main">
                <div class="model_line">
                    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px', marginTop:'10px '}">请选择任务类型</van-divider>
                </div>
                <div class="task_item" v-for="(item,idx) in taskOption" :key="idx" @click="handleTask(item)">
                    <div class="left_text">
                        <img class="ws_icon" src="../assets/images/home/ws_icon.png" alt="">
                        <span>{{ taskNameOption[item.status] }}</span>
                    </div>
                    <van-button :type="item.status==1?'danger':item.status==2?'primary':'warning'">{{ taskStatusOption[item.status] }}</van-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { getaccountincome,gettodayincome } from'@/api/home'
export default {
	name: 'home',
	components: {},
	data() {
		return {
            code:"456666",
            langIdx:0,
            isIndex:false,
            user_money:0,
            teamStemp:"",
            taskOption:[
                {
                    status:1,
                },
                {
                    status:2,
                },
                {
                    status:3,
                }
            ],
            langOptions: ['en-US','zh_CN']
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.User,
            bannerList: state => state.User.bannerList,
		}),
        taskNameOption(){
            return ["","WhatsApp挂机任务","WhatsApp拉粉任务","WhatsApp拉群任务"]
        },
        taskStatusOption(){
            return ["","开始任务","进行中","已结束"]
        }
	},
    activated(){
        this.syncInitApi();
        this.isIndex=false;
        this.$store.dispatch('User/plantCarousel');
    },
	methods: {
        syncInitApi(){
            let fun1 = new Promise((resolve,reject)=>{
                getaccountincome().then(res =>{
                    resolve(res)
                })
            });
            let fun2 = new Promise((resolve,reject)=>{
                gettodayincome().then(res =>{
                    resolve(res)
                })
            });
            Promise.all([fun1,fun2]).then( res => {
                const [{income},data2] = res;
                this.user_money = income;
                this.teamStemp = data2;
            })
        },
        copySuccess(){
            this.$toast(`${this.$t("home_031")}${this.$t("other_006")}`);
        },
        showChangeBtn(){
			this.isIndex=!this.isIndex;
		},
        onChangeType(idx){
			this.langIdx=idx;
			let lang =idx==0?'en':'po';
			// this.$i18n.locale=lang;
			// localStorage.setItem("language",lang);
		},
        handleTask(row){
            if(row.status == 1){
                this.$router.push("/scanOnline")
            }else if(row.status == 2){
                this.$router.push("/pullgroupTask")
            }else if(row.status == 3){
                this.$router.push("/pullPownTask")
            }
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
        .top_model{
            width: 100%;
            height: 340px;
            display: flex;
            padding: 0 30px;
            margin-bottom: 60px;
            position: relative;
            box-sizing: border-box;
            justify-content: space-between;
            background: #f45250;
            .user_mess, .l_value{
                display: flex;
                font-size: 28px;
                height: 180px;
                color: #fff;
                align-items: center;
                .user_head{
                    width: 120px;
                    height: 120px;
                    flex-shrink: 0;
                    overflow: hidden;
                    border-radius: 50%;
                    border: 1px solid #fff;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .user_info{
                    margin-left: 20px;
                    .user_name{
                        font-weight: bold;
                        font-size: 36px;
                    }
                    .user_code{
                        margin-top: 10px;
                        .copay_text{
                            padding: 8px 26px;
                            font-size: 24px;
                            margin-left:10px;
                            border-radius:30px;
                            background-color: #fff;
                            color: $home-order-title;
                            background: #fff;
                        }
                    }
                }
            }
            .lang_mess{
                display: flex;
                img{
                    height: 20px;
                    margin-left: 10px;
                }
            }
            .l_value{
                display: flex;
                position: relative;
                align-items: center;
                span{
                    width: 100%;
                    flex-grow: 1;
                    color: #fff;
                    font-size: 32px;
                    border-radius: 8px;
                }
                .down_icon{
                    display: flex;
                    width: 20px;
                    width: 36px;
                    margin-left: 20px;
                }
                .down_list{
                    width: 160px;
                    max-height: 230px;
                    position: absolute;
                    left: 0;
                    top: 140px;
                    z-index: 1;
                    color: $font-color-black;
                    font-size: 28px;
                    padding: 16px 20px;
                    border-radius: 8px;
                    box-sizing: border-box;
                    background-color: #fff;
                    p{
                        padding: 10px 0;
                        border-bottom: 1px solid #ebedf0;
                    }
                    p:last-child{
                        border: none;
                    }
                }
                .down_list:before {
                    content: "";
                    display: block;
                    position: absolute;
                    width:0;
                    height: 0;
                    border: 16px solid transparent;
                    border-bottom-color: #fff;
                    left: 40px;
                    top: -32px;
                }
                .active_open{
                    display: block;
                    transition: all .2s;
                    animation: slide-down .2s ease-in;
                    transition: .2s ease-in;
                    transform-origin: 50% 0;
                    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
                }
                .active_close{
                    display: none;
                    transition: all .5s;
                    animation: select-close .5s ease-in;
                    transition: .3s ease-in;
                    transform-origin: 50% 0;
                }
                @keyframes slide-down{
                    0%{transform: scale(1,.5)}
                    100%{transform: scale(1,1)}
                }
            }
            .cover_model{
                width: 100%;
                position: absolute;
                left: 0;
                bottom: -40px;
                padding: 0 20px;
                box-sizing: border-box;
                .task-pro{
                    width: 100%;
                    display: flex;
                    padding: 30px 0 40px 0;
                    border-radius: 10px;
                    flex-direction: row;
                    background-color: $font-color-white;
                    .left-pro, .right-pro{
                        flex: 1;
                        p{
                            width: 100%;
                            display: flex;
                            color: #999999;
                            font-weight: bold;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                    .left-pro p:nth-child(1), .right-pro p:nth-child(1){
                        font-size: 46px;
                    }
                    .left-pro p:nth-child(2), .right-pro p:nth-child(2){
                        font-size: 24px;
                        margin-top: 12px;
                    }
                }
            }
        }
        .home_content{
            width: 100%;
            display: flex;
            padding: 0 20px;
            flex-direction: column;
            box-sizing: border-box;
            .my_swipe{
                width: 100%;
                height: 320px;
                border-radius: 10px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .notice_text{
                font-size: 24px;
                font-weight: 500;
                margin-bottom: 20px;
                align-items: center;
                .van-notice-bar{
                    padding: 0 10px;
                    font-size: 15px;
                    border-radius: 10px;
                    background-color: #fff;
                }
                img{
                    width: 30px;
                    height: 30px;
                }
                span{
                    color: $home-bind-button;
                }
            }
        }
        .task_continer{
            width: 100%;
            padding: 0 20px;
            display: flex;
            margin-top: 20px;
            flex-direction: column;
            box-sizing: border-box;
            .task_main{
                display: flex;
                font-size: 28px;
                padding: 30px 20px;
                border-radius: 10px;
                box-sizing: border-box;
                flex-direction: column;
                background-color: $font-color-white;
                .model_line{
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .task_item{
                    width: 100%;
                    display: flex;
                    padding: 16px 20px;
                    margin-bottom: 20px;
                    align-items: center;
                    box-sizing: border-box;
                    border-radius: 10px;
                    justify-content: space-between;
                    background-color: #f4f4f5;
                    .left_text{
                        display: flex;
                        align-items: center;
                        .ws_icon{
                            height: 80px;
                            margin-right: 10px;
                        }
                    }
                    .van-button{
                        width: 100px;
                        height: max-content;
                        line-height: 1;
                        padding: 10px 0;
                        font-size: 12px;
                        border-radius: 35px;
                        box-sizing: border-box;
                    }
                }
            }
        }
    }
    .custom_set_line{
        display: flex;
        padding: 20px 0;
        box-sizing: border-box;
        span{
            display: flex;
            border-left: 2px solid #ececec;
        }
    }

</style>
