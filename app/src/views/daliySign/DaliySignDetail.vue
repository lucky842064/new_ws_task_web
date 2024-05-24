<template>
    <div class="signDetail">
        <PageHeader :show-icon="true" title="每日奖励"></PageHeader>
        <div class="content">
            <div class="name">今日红包</div>
            <div class="num">
                <span>1.00</span><i class="suffix">元</i>
            </div>
            <div class="mark">签到奖励</div>
            <div class="btn">领取</div>
            <p class="tip">已在线4小时，可以领取奖励啦</p>
            <div class="guide">
                <h2>规则说明</h2>
                <p>每天完成超过4个小时的挂机任务，即可领取</p>
            </div>
        </div>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
export default {
    components: { PageHeader},
    data(){
        return {

        }
    }
}
</script>
<style lang="scss" scoped>
.signDetail{
    .content{
        min-height: calc(100vh - 88px);
        background: url('../../assets/images/zdq/sign@2x.png') top left no-repeat;background-size: 100% auto;
        background-color: #FF1C21;padding-top: 454px;text-align: center;
        .name{
            color: #9C6D44;font-size: 26px;margin-bottom: 8px;
        }
        .num{
            font-size: 96px;font-weight: bold;color: #FF435C;margin-right: 4px;
            .suffix{
                font-size: 29px;font-weight: bold;color: #FF435C;font-style: normal;
            }
        }
        .mark{
            width: 94px;height: 22px;background: #EEB670;border-radius: 4px;border: 1px solid #A3793D;
            color: #8C5C32;font-size: 18px;margin-bottom: 88px;font-size: 18px;color: #8C5C32;
        }
        .btn{
            width: 445px;height: 117px;background: url('../../assets/images/zdq/btn@2x.png') left top no-repeat;background-size: contain;
            color: #D34237;display: flex;align-items: center;justify-content: center;
            margin: 0 auto 9px;
        }
        .tip{
            font-size: 20px;color: #FFD283;margin: 0 auto 168px auto;
        }
        .guide{
            text-align: left;margin: 0 40px;
            >h2{
                font-size: 32px;color: #F2BC96;margin-bottom: 20px;
            }
            >p{
                font-size: 24px;color: #F2BC96;
            }
        }
    }
}
</style>