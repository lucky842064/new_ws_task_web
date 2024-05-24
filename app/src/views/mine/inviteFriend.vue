<!--  -->
<template>
  <div class="team_warp">
        <page-header title="邀请好友" :show-icon="true"></page-header>
        <div class="income_gather">
            <img src="../../assets/images/mine/benner_cn.jpg" alt="">
        </div>
        <div class="team_content">
            <div class="user_info">
                <div class="logon_time">
                    <span class="left_title">邀请码</span>
                    <span class="left_time">AJSJSNK</span>
                    <van-button class="copay_text"
                        v-clipboard:copy="17691235263"
                        v-clipboard:success="copayFinsh">
                        {{ $t("home_031") }}
                    </van-button>
                </div>
                <div class="logon_time invite_code">
                    <span class="left_title">邀请链接</span>
                    <span class="left_time">http://www.baidu.com</span>
                    <van-button class="copay_text"
                        v-clipboard:copy="17691235263"
                        v-clipboard:success="copayFinsh">
                        {{ $t("home_031") }}
                    </van-button>
                </div>
            </div>
        </div>
        <div class="team_income">
            <div class="copay_desc">邀请二维码</div>
            <img class="income_img" src="../../assets/images/mine/icon_mingxi.png" alt="">
            <van-button type="default">保存二维码</van-button>
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

  methods: {
      copayFinsh() {
        this.$toast("复制成功");
    },
  }
}

</script>
<style lang="scss" scoped>
    .team_warp{
        width: 100%;
        height: 100vh;
        overflow-y: scroll;
        float: left;
        padding-bottom: 120px;
        background-color: #f2f2f2;
        .team_content{
            width: 100%;
            float: left;
            padding: 0 30px;
            margin-top: 20px;
            box-sizing: border-box;
            background-color: #fff;
            .user_info{
                width: 100%;
                line-height: 110px;
                float: left;
                color: #666666;
                font-size: 28px;
                .logon_time{
                    width: 100%;
                    height: 110px;
                    float: left;
                    border-bottom: 1px solid #e1e1e1;
                    span{
                        float: left;
                    }
                    .left_title{
                        width: 160px;
                    }
                    .left_time{
                        width: 360px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                    .copay_text {
                        width: 1.23rem;
                        height: 0.5rem;
                        float: right;
                        line-height: 0.44rem;
                        padding: 0;
                        color: #ffffff;
                        font-weight: 500;
                        color: $font-color-pale;
                        margin: 0 0.2rem;
                        border-radius: 0.47rem;
                        margin-top: 32px;
                        border: none;
                        background: -webkit-linear-gradient(to right, #4b4338  0%,#100f0b 100%);
                        background: linear-gradient(to right, #4b4338 0%,#100f0b 100%);
                    }
                }
                .invite_code{
                    width: 100%;
                    height: 110px;
                    float: left;
                }
            }
        }
        .income_gather{
            width: 100%;
            height: 324px;
            float: left;
            padding: 0 30px;
            margin-top: 23px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .team_income{
            width: 100%;
            float: left;
            .income_img{
                display: table;
                width: 340px;
                height: 340px;
                margin: 0 auto;
            }
            .copay_desc{
                width: 100%;
                height: 100px;
                font-size: 32px;
                float: left; 
                line-height: 100px;
                text-align: center;
            }
            .van-button{
                width: 3.4rem;
                display: table;
                margin: 0 auto;
                color: #ffffff;
                border-radius: 8px;
                margin-top: 20px;
                background-color: #262626;
            }
        }
    }
</style>