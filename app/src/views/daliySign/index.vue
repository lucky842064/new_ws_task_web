<template>
    <div class="daily_sign">
        <PageHeader :show-icon="true" title="每日签到"></PageHeader>
        <div class="content">
            <div class="package_ct">
                <div class="title">
                    <img src="../../assets/images/zdq/title@2x.png">
                </div>
                <div class="packages">
                    <div v-for="(item, i) in packageList" :key="i" class="item">
                        <i :class="{yes: item, no: !item}"></i>
                        <p>{{i + 1}}天</p>
                    </div>
                </div>
            </div>
            <div class="btn" >
                领取今日奖励
            </div>
            <div class="guide">
                <h2>规则说明</h2>
                <p>
                    连续7天都完成任务，每天领取现金以后，7天后再得红包
                </p>
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
            packageList: [1, 1, 1, 0, 0, 0, 0]
        }
    }
}
</script>
<style lang="scss" scoped>
.daily_sign{
    min-height: 100vh;    overflow-y: auto;padding-bottom: 136px;background-color: #FF1C21;
    position: relative;
    .content{
        min-height: calc(100vh - 88px);
        background: url("../../assets/images/zdq/daily_sign@2x.png") left top no-repeat;background-size: 100% auto;
        background-color: #FF1C21;padding-top: 653px;
        .package_ct{
            margin: 0 30px 36px 30px;background: #FFFFFF;border-radius: 24px;
            padding-top: 32px;padding-bottom: 64px;
            .title{
                text-align: center;margin-bottom: 45px;
                img{width: 500px;}
            }
            .packages{
                display: flex;margin: 0 24px;justify-content: space-between;
                .item{
                    i{
                        display: inline-block;width: 64px;height: 77px;
                    }
                    .yes{
                        background: url("../../assets/images/zdq/received1@2x.png") no-repeat;background-size: contain;
                    }
                    .no{
                        background: url("../../assets/images/zdq/received2@2x.png") no-repeat;background-size: contain;
                    }
                    p{
                        font-size: 24px;color: #333333;font-weight: bold;text-align: center;margin-top: 10px;
                    }
                }
            }
        }
        .btn{
                margin: 0 30px 76px 30px;height: 104px;border-radius: 52px;
                background: linear-gradient(180deg, #FFEE83 0%, #FED94C 100%);color: #FF1C21;font-size: 40px;
                font-weight: bold;color: #FF1C21;text-align: center;line-height: 104px;
            }
            .guide{
                margin: 0 40px;
                h2{
                    font-size: 32px;color: #FFFFFF;font-weight: bold;margin-bottom: 16px;
                }
                p{
                    font-size: 24px;color: #FFFFFF;
                }
            }
    }
}
</style>