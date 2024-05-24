<template>
<div class="serve_warp">
    <van-dialog class="set_Model" v-model="showModel" :showConfirmButton='false'>
        <van-icon class="close_btn" name="cross" @click="colseServe" />
        <div class="custom_dialog">
            <div class="serve_img">
                <img src="../assets/images/serveImg.png" alt="">
                <p class="serve_text">联系客服</p>
                <p class="task_tips online_time">在线时间:11:00-20:00</p>
                <p class="task_tips">您需要添加客服的Flygram号进行咨询</p>
            </div>
        </div>
        <div class="custom_main">
            <div class="custom_mess">
                <div class="main_left">
                    <img src="../assets/images/fwx_icon.png" alt="">
                    <div class="main_code">
                        <p>Flygram</p>
                        <p>85246236697</p>
                    </div>
                </div>
                <div class="main_right">
                    <van-button type="danger" v-clipboard:copy="serveNum" v-clipboard:success="copySuccess" v-clipboard:error="copyAddressError" :disabled="false">复制客服号</van-button>   
                </div>
            </div>
        </div>
        <div class="disc_main">
            <p class="disc_text">如果您还没有Flygram账号</p>
            <p class="disc_text">可复制下方下载地址进行下载</p>
            <p>www.flygram7.com</p>
            <p>
                <van-button type="danger" v-clipboard:copy="downLink" v-clipboard:success="copySuccess">复制下载地址</van-button>
            </p>
        </div>
    </van-dialog>
</div>
</template>

<script>
import { Toast,Dialog} from 'vant';
export default {
    data(){
        return{
            serveNum:"85246236697",
            downLink:"www.flygram7.com",
        }
    },
    props: {
		showModel: {
			type: Boolean,
			default: false,
		}
	},
    methods: {
        colseServe(){
            this.$emit("closeBtn",false)
        },
        copySuccess(e){
            this.$toast("复制成功");
        }
	},
}
</script>

<style lang="scss" scoped>
    .serve_warp{
        width: 100%;
        float: left;
        .custom_dialog{
            width: 100%;
            display: flex;
            .serve_img{
                width: 100%;
                display: flex;
                color: #fff;
                flex-wrap: wrap;
                padding-top: 28px;
                justify-content: center;
                background-color: #F52C2C;
                p{
                    width: 100%;
                    text-align: center;
                }
                .serve_text{
                    margin: 17px 0 18px 0;
                }
                .task_tips{
                    color: #FBAAAA;
                    font-size: 24px;
                    margin-bottom: 28px;
                }
                .online_time{
                    font-size: 20px;
                    margin-bottom: 4px;
                }
                img{
                    width: 121px;
                    height: 121px;
                    border-radius: 50%;
                }
            }
        }
        .custom_main{
            width: 100%;
            display: flex;
            padding: 40px;
            box-sizing: border-box;
            .custom_mess{
            width: 100%;
            padding-bottom: 30px;
            border-bottom: 0.5px solid #d8d8d8;
                .main_right{
                    flex-grow: 0;
                    height: 100%;
                    display: flex;
                    float: right;
                    align-items: center;
                    justify-content: right;
                    .van-button{
                        width: 92px;
                        height: 28px;
                        padding: 0;
                        border: none;
                        color: #fcc9c9;
                        font-size: 12px;
                        border-radius: 14px;
                    }
                }
                .main_left{
                    flex-grow: 1;
                    font-size: 28px;
                    img{
                        width: 80px;
                        height: 80px;
                        float: left;
                    }
                    .main_code{
                        float: left;
                        color: #000;
                        font-size: 28px;
                        margin-left: 12px;
                        padding: 6px 0;
                        p:nth-child(2){
                            color: #999999;
                            font-size: 24px;
                            margin-top: 6px;
                        }
                    }
                }
            }
        }
        .disc_main{
            width: 100%;
            display: flex;
            font-size: 28px;
            flex-wrap: wrap;
            padding-bottom:50px;
            background-color: #fff;
            p{
                width: 100%;
                color: #999999;
                text-align: center;
            }
            .disc_text{
                transform:scale(0.8);
                margin-bottom: -8px;
            }
            p:nth-child(3){
                color: #F52C2C;
                margin: 32px 0;
                font-size: 27px;
                font-weight: 500;
            }
            .van-button{
                width: 92px;
                height: 28px;
                padding: 0;
                border: none;
                font-size: 12px;
                color: #fcc9c9;
                border-radius: 14px;
            }
        }
    }
</style>
<style lang="scss">
    .van-dialog{
        width: 280px;
        border-radius: 12px !important;
    }
    .set_Model{
        [class*=van-hairline]::after{
            border-color: #D8D8D8;
        }
        box-sizing: border-box;
        .van-dialog__header{
            color: #060606;
            font-weight: 500;
            font-size: 24px;
            margin-bottom: 10px;
        }
        .close_btn{
            color: #fff;
            position: absolute;
            top: 34px;
            right: 31px;
            font-size: 38px;
        }
    }
</style>