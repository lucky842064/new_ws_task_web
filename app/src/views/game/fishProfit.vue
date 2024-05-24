<template>
    <div class="fishProfit">
        <PageHeader :show-icon="true" title="新人福利"></PageHeader>
        <div class="content">
            <div class="btn_ct">
                <span class="btn" @click="getProfit">立即领取</span>
            </div>
            <div class="tip">
                <h2>规则说明</h2>
                <p>新注册的用户，只需要当天完成一次挂机任务，即可领取5元新人红包。仅限一次</p>
            </div>
        </div>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
import { Dialog } from 'vant';
export default {
    components: { PageHeader},
    data(){
        return {
        }
    },
    mounted(){
        console.log('mounted!')
    },
    methods:{
        getProfit(){
            Dialog.alert({
                title: '提示',
                message: '红包已自动发放到您的账户，请查收！',
            }).then(() => {
            // on close
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.fishProfit{
    min-height: 100vh;
    .content{
        padding-top: 840px;background-color: $color-theme;
        background: url("../../assets/images/zdq/fish_profit@2x.png") left top no-repeat;background-size: 100% auto;
        min-height: calc(100vh - 88px);
    }
    .btn_ct{
        text-align: center;margin-bottom: 100px;
        .btn{
            width: 497px;height: 104px;background: linear-gradient(180deg, #FFEE83 0%, #FED94C 100%);
            border-radius: 52px;color: #DA4700;font-size: 40px;font-weight: bold;
            display: inline-block;line-height: 104px;
        }
    }
    .tip{
        margin: 0 40px;
        h2{
            color: #FFFFFF;font-size: 32px;font-weight: bold;margin-bottom: 20px;
        }
        p{
            font-size: 24px;color: #FFFFFF;
        }
    }
}
</style>