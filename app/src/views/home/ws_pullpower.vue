<template>
    <div class="home-content">
        <page-header style="position: fixed;top: 0;left: 0; z-index: 9;" title="WhatsApp邀请任务" :show-icon="true" :bgcolor="false"></page-header>
        <div class="home_content">
            <div class="task_step_detail">
                <div class="task-pro">
                    <div class="left-pro">
                        <p class="invit_num">{{ teamStemp.today_income || 0}}</p>
                        <p class="invit_text">邀请进群人数(人)</p>
                    </div>
                    <div class="right-pro">
                        <p class="invit_num">{{ teamStemp.yesterday_income || 0 }}</p>
                        <p class="invit_text">获得金额(ENC)</p>
                    </div>
                </div>
                <div class="custom_line">
                    <span class="botton_line"></span>
                </div>
                <div class="task_detail" @click="$router.push('/betrecord')">查看详情</div>
            </div>
            <div class="continer_mian">
                <div class="task_desc">
                    <div class="task_top">
                        <span>任务编号：182</span>
                        <span>任务状态：进行中</span>
                    </div>
                    <div class="task_set_text">
                        <h2>任务简介：</h2>
                        请将下列的号码的用户邀请到你的群主中，并在邀请结束后，提交你的群组链接。我们会用AI验证你的群成员是否符合要求，并按照符合要求的成员数量为你结算佣金。
                    </div>
                </div>
                <div class="ws_account_warp">
                    <div class="ws_account_time">
                        <h3 class="step_head">操作步骤：</h3>
                        <h3 class="step_desc">
                            <span>1.点击按钮加入WhatsApp群主：</span>
                            <span style="color: #ee0a24;font-size: 14px;" @click="getLink">获取链接</span>
                        </h3>
                        <van-button type="danger" :loading="isLoading" loading-text="loading..." @click="submitTask">加入群组</van-button>
                        <h3 class="step_desc">
                            <span>2.输入您刚才提交入群申请的WhatsApp账号</span>
                        </h3>
                        <van-field v-model="group_link" placeholder="请输入您的账号(在此之前请确保已申请入群)" /> 
                        <van-button type="danger" :loading="isLoading" loading-text="loading..." @click="submitTask">提交</van-button>
                    </div>
                </div>
                <div class="footer_tips">
                    <div class="time_num">剩余等待时间约<span>120</span></div>
                    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa'}" />
                    <div class="step_task_desc">完成以上操作后开启第三步操作，你将获得一份邀请入群的成员名单，并开启任务倒计时30分钟。</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import PageHeader from "@/components/Header";
import { getincome } from'@/api/home'
export default {
	name: 'ws_pullgroup',
	components: {PageHeader},
	data() {
		return {
            teamStemp:'',
            group_link:'',
            isLoading:false,
            time: 30 * 60 * 60 * 1000,
            dataList:[1,1,1,1,1,1]
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.User.userInfo,
            bannerList: state => state.User.bannerList
		})
	},
    created(){},
    activated(){
        this.initSpread();
    },
    mounted() {
	},
	methods: {
        async initSpread() {
          this.teamStemp = await getincome({});
        },
        getLink(){
            this.$toast("获取链接成功！");
        },
        copySuccess(){
            this.$toast(`${this.$t("home_031")}${this.$t("other_006")}`);
        },
        submitTask(){
            if(!this.group_link) return this.$toast("请输入群组链接"); 
            this.$toast("任务已提交，及时关注佣金收益！");
            this.isLoading=true;
            setTimeout(()=>{
                this.isLoading=false;
                this.$router.go(-1)
            },2000)
        }
	}
};
</script>
<style lang="scss" scoped>
    .home-content {
        height: 100%;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #f2f2f2;
        -webkit-overflow-scrolling: touch; 
        padding-bottom: 120px;
        .home_content{
            width: 100%;
            float: left;
            padding: 0 20px;
            margin-top: 100px;
            box-sizing: border-box;
            .task_step_detail{
                width: 100%;
                display: flex;
                padding: 20px 0;
                flex-direction: column;
                border-radius: 10px;
                box-sizing: border-box;
                background-color: $color-theme;
                .task-pro{
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    .left-pro, .right-pro{
                        flex: 1;
                        p{
                            width: 100%;
                            display: flex;
                            color: #fff;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                    .invit_num{
                        font-size: 48px;
                    }
                    .invit_text{
                        font-size: 24px;
                        font-weight: 400;
                        margin-top: 12px;
                    }
                    .left-pro{
                        border-right: 1px dashed #fff;
                    }
                }
                .custom_line{
                    margin-top: 30px;
                }
                .task_detail{
                    width: 100%;
                    color: #fff;
                    display: flex;
                    font-size: 24px;
                    margin-top: 20px;
                    justify-content: center;
                    text-decoration: underline;
                }
            }
            .continer_mian{
                width: 100%;
                padding: 20px;
                margin-top: 30px;
                border-radius: 10px;
                box-sizing: border-box;
                background-color: #fff;
            }
            .task_desc{
                display: flex;
                width: 100%;
                padding: 30px 0;
                flex-direction: column;
                box-sizing: border-box;
                .task_top{
                    width: 100%;
                    display: flex;
                    font-size: 26px;
                    font-weight: bold;
                    justify-content: space-between;
                }
                .task_set_text{
                    font-size: 24px;
                    margin-top: 20px;
                    line-height: 1.5;
                    letter-spacing: 2px;
                }
            }
            .ws_account_warp{
                display: flex;
                width: 100%;
                padding-bottom: 30px;
                flex-direction: column;
                box-sizing: border-box;
                .van-button{
                    border-radius: 35px;
                }
                .ws_account_time{
                    display: flex;
                    gap: 40px;
                    font-size: 26px;
                    flex-direction: column;
                    .step_head, .step_desc{
                        display: flex;
                        justify-content: space-between;
                    }
                    .step_desc{
                        font-size: 24px;
                    }
                    .van-cell{
                        padding: 8px 10px;
                        border-radius: 8px;
                        line-height: 1;
                        border: 1px solid #ebedf0;
                    }
                }
            }
            .footer_tips{
                display: flex;
                flex-direction: column;
                font-size: 26px;
                // align-items: center;
                .time_num{
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    span{
                        font-weight: bold;
                        color: #ee0a24;
                    }
                }
            }
        }
    }
</style>
