<template>
    <div class="home-content">
        <page-header style="position: fixed;top: 0;left: 0; z-index: 9;" title="WhatsApp挂机任务" :show-icon="true" :bgcolor="false"></page-header>
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
            <div class="task_desc">
                <div class="task_top">
                    <span>任务编号：182</span>
                    <span>任务状态：进行中</span>
                </div>
                <div class="task_set_text">
                    请将下列的号码的用户邀请到你的群主中，并在邀请结束后，提交你的群组链接。我们会用AI验证你的群成员是否符合要求，并按照符合要求的成员数量为你结算佣金。
                </div>
            </div>
            <div class="ws_account_warp">
                <div class="ws_account_time">
                    <div class="ws_account_top">
                        <span>任务倒计时</span>
                        <span class="task_time">
                            <van-count-down :time="time" />
                        </span>
                        <span class="task_video">任务教程</span>
                    </div>
                    <div class="account_list" v-for="(item,idx) in dataList" :key="idx">
                        <div class="account_item">
                            <span>+5511971289354</span>
                            <img src="../../assets/images/fuzhi.png" v-clipboard:copy="item" v-clipboard:success="copySuccess">
                        </div>
                        <div class="account_item">
                            <span>+5511971289356</span>
                            <img src="../../assets/images/fuzhi.png"  v-clipboard:copy="item" v-clipboard:success="copySuccess">
                        </div>
                    </div>
                    <div>
                        <van-field v-model="group_link" placeholder="请输入群组链接" /> 
                    </div>
                </div>
            </div>
        </div>
        <div class="footer_btn">
            <van-button type="danger" :loading="isLoading" loading-text="loading..." @click="submitTask">提交</van-button>
            <van-button plain type="danger" @click="downAddress">下载通讯录文件</van-button>
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
        },
        downAddress(){
           // 请求获取通讯录权限
            navigator.permissions.query({ name: 'contacts' }).then((permissionStatus) => {
                if (permissionStatus.state === 'granted') {
                    uni.addPhoneContact({
                        nickName: '卢律师',
                        firstName: '卢力华',
                        remark: '卢律师',
                        mobilePhoneNumber: '18092230666',
                        email:'lulihua@zlwd.com',
                        workAddressCountry:'中国大陆',
                        workAddressStreet:'陕西省西安市高新区绿地中心B座36层',
                        success: function() {
                            console.log('success');
                            uni.showToast({
                                title: '添加成功',
                                icon: 'success',
                                duration: 2000
                            })
                        },
                        fail: function() {
                            console.log('fail');
                            uni.showToast({
                                title: '添加失败',
                                icon: 'success',
                                duration: 2000
                            })
                        }
                    });
                }
            });
            // 获取通讯录权限
            // navigator.contacts.requestAuthorization((status) => {
            //     console.log(status);
            //     if (status === 'granted') {
            //         // 通讯录权限获取成功，可以进行下一步操作
            //         // ...
            //     } else {
            //         // 通讯录权限获取失败，需要给出相应的提示或处理逻辑
            //         // ...
            //     }
            // });
            // navigator.contacts.select(['name', 'phone']).then((contacts) => {
            // // 创建新联系人对象
            // let newContact = new Contact();
            
            // // 设置联系人姓名
            // newContact.name = "John Doe";
            
            // // 添加手机号码
            // newContact.phoneNumbers = [{ value: "123456789", type: "mobile" }];
            
            // // 保存联系人到通讯录
            // newContact.save().then(() => {
            //     console.log('Contact saved successfully.');
            // }).catch((error) => {
            //     console.error('Error saving contact:', error);
            // });
            // }).catch((error) => {
            // console.error('Error selecting contacts:', error);
            // });
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
            margin-bottom: 160px;
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
                .ws_account_time{
                    display: flex;
                    flex-direction: column;
                    .ws_account_top{
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        // background-color: cadetblue;
                        span{
                            display: flex;
                            flex: 1;
                            font-size: 24px;
                            font-weight: bold;
                            justify-content: center;
                        }
                        .task_time{
                            font-size: 42px;
                        }
                        .task_video{
                            width: 100%;
                            display: flex;
                            color: #ff976a;
                        }
                    }
                    .account_list{
                        display: flex;
                        font-size: 32px;
                        margin-top: 20px;
                        align-items: center;
                        justify-content: space-between;
                        .account_item{
                            display: flex;
                            align-items: center;
                            img{
                                height: 30px;
                                margin-left: 10px;
                            }
                        }
                    }
                    .van-cell{
                        padding: 8px 10px;
                        border-radius: 8px;
                        line-height: 1;
                        margin-top: 10px;
                    }
                }
            }
        }
        .footer_btn{
            width: 100%;
            display: flex;
            padding: 0 20px;
            gap: 20px;
            position: fixed;
            left: 0;
            bottom: 40px;
            box-sizing: border-box;
            flex-direction: column;
            justify-content: center;
            .van-button{
                border-radius: 35px;
            }
        }
    }
</style>
