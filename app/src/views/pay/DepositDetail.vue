<template>
    <div class="detail">
        <page-header
            :hide="false"
            @return="on_return"
            :prevent="true"
            :show-icon="true"
            :title="$t('buy_019')"
        ></page-header>
        <div class="notice-box">
            <div class="head-notice">
                <div class="title">{{$t('buy_019')}}</div>
                <div class="time-limit" v-html="$Helper.buyVip($t('vip_010'),count_down)"></div>
                <div class="tip">{{$t('vip_002')}}</div>
            </div>
        </div>
        <div class="order-form">
            <div class="field">
                <div class="label">{{$t('vip_009')}}</div>
                <div class="info">
                    <div class="text">{{deposit.pay_pack_name}}</div>
                    <van-button
                        class="btn"
                        v-clipboard:copy="deposit.pay_pack_name"
                        v-clipboard:success="clipboardSuccessHandler"
                        v-clipboard:error="clipboardErrorHandler"
                    >{{$t('home_031')}}</van-button>
                </div>
            </div>
            <div class="field">
                <div class="label">{{$t('vip_003')}}</div>
                <div class="info amount">
                    <div class="text">{{deposit.account}}</div>
                    <van-button
                        class="btn"
                        v-clipboard:copy="deposit.account"
                        v-clipboard:success="clipboardSuccessHandler"
                        v-clipboard:error="clipboardErrorHandler"
                    >{{$t('home_031')}}</van-button>
                </div>
            </div>
            <div class="field">
                <div class="label">{{$t('vip_004')}}</div>
                <div class="info">
                    <div class="text">{{deposit.ac_name}}</div>
                    <van-button
                        class="btn"
                        v-clipboard:copy="deposit.ac_name"
                        v-clipboard:success="clipboardSuccessHandler"
                        v-clipboard:error="clipboardErrorHandler"
                    >{{$t('home_031')}}</van-button>
                </div>
            </div>
            <div class="field">
                <div class="label">{{$t('vip_005')}}</div>
                <div class="info">
                    <div class="text attach">{{deposit.order_no}}</div>
                    <van-button
                        class="btn"
                        v-clipboard:copy="deposit.order_no"
                        v-clipboard:success="clipboardSuccessHandler"
                        v-clipboard:error="clipboardErrorHandler"
                    >{{$t('home_031')}}</van-button>
                </div>
            </div>
            <div class="field">
                <div class="label">{{$t('vip_006')}}</div>
                <div class="info">
                    <div class="text amount">
                        {{deposit.amount}}
                        <span class="MoneyUnit">{{$t('other_003')}}</span>
                    </div>
                    <van-button
                        class="btn"
                        v-clipboard:copy="deposit.amount"
                        v-clipboard:success="clipboardSuccessHandler"
                        v-clipboard:error="clipboardErrorHandler"
                    >{{$t('home_031')}}</van-button>
                </div>
            </div>
        </div>
        <div class="btn-deposit">
            <div class="btn-purchase" @click="submit_order">{{$t('buy_033')}}</div>
        </div>
        <div class="notice">{{$t('buy_028')}}。</div>
        <van-popup v-model="show" :safe-area-inset-bottom="true">
            <img width="200" height="200" :src="'data:image/png;base64,'+deposit.url" alt="img" />
        </van-popup>
    </div>
</template>
<script>
import PageHeader from "../../components/Header";
import { calc } from "../../utils/tool";
import { payvip } from "../../api/pay";
export default {
    name: "DepositDetail",
    components: { PageHeader },
    data() {
        return {
            deposit: {},
            count_down: "",
            interval: null,
            show: false
        };
    },
    created() {
        if (this.$route.query) {
            this.deposit = JSON.parse(JSON.stringify(this.$route.query));
        } else {
            this.$router.replace("/home");
        }
        let item = localStorage.getItem("lastDepositTime");
        let count = 20 * 60;
        let nowDate = new Date().getTime() / 1000;
        if (item) {
            count = Number(item) - nowDate;
        } else {
            localStorage.setItem("lastDepositTime", nowDate + count);
        }
        this.countDown(count);
    },
    beforeDestroy() {
        clearInterval(this.interval);
    },
    methods: {
        //获取随机小数
        getRandomPoint() {
            let number_one = Math.floor(Math.random() * 10);
            let number_two = Math.floor(Math.random() * 10);
            return `.${number_one}${number_two}`;
        },
        on_return() {
            this.$router.back();
        },
        submit_order() {
            const dialog = this.$dialog
                .confirm({
                    title: this.$t("other_008"),
                    message: this.$t("vip_008"),
                    confirmButtonColor: "rgb(255,2,65)",
                    confirmButtonText: this.$t("other_005"),
                    cancelButtonText: this.$t("other_004")
                })
                .then(() => {
                    let params = {
                        ...this.deposit,
                        amount: Number(this.deposit.amount),
                        vip: Number(this.deposit.vip),
                        pay_type: Number(this.deposit.pay_type),
                        name: this.deposit.pay_name || ""
                    };
                    payvip(params).then(res => {
                        this.$toast.success(this.$t("buy_031"));
                        this.$router.back();
                    }).catch(err=>{
                        this.$router.back();
                    });
                })
                .catch(() => {
                    dialog.close();
                });
        },
        minus(a, b) {
            return calc().minus(a, b);
        },
        clipboardSuccessHandler({ value, event }) {
            this.$toast(`${this.$t("home_031")}${this.$t("other_006")}`);
        },
        clipboardErrorHandler() {},
        countDown(max_time) {
            this.interval = setInterval(() => {
                if (max_time > 0) {
                    let minutes = Math.floor(max_time / 60);
                    let seconds = Math.floor(max_time % 60);
                    seconds = seconds < 10 ? `0${seconds}` : seconds;
                    this.count_down = minutes + ":" + seconds;
                } else if (max_time === 0) {
                    clearInterval(this.interval);
                    this.$router.back();
                }
                max_time--;
            }, 1000);
        }
    }
};
</script>
<style lang="scss" scoped>
#app {
    padding-bottom: 0;
}
.detail {
    height: 100vh;
    background-color: #f2f2f2;
    .notice-box {
        padding: 0 0px;
    }
    .head-notice {
        margin-top: 20px;
        background-color: #fff;
        padding: 20px;
        text-align: center;
        border-radius: 20px;
        .title {
            font-size: 36px;
            color: #000000;
            font-weight: bolder;
        }
        .time-limit {
            margin-top: 10px;
            margin-bottom: 20px;
            font-size: 30px;
            color: #999999;
            .time {
                font-size: 30px;
                color: #e31228;
                letter-spacing: 0;
                text-align: center;
                line-height: 42px;
                font-weight: bold;
            }
        }
        .tip {
            font-size: 28px;
            color: #999999;
        }
    }
    .order-form {
        margin-top: 20px;
        background-color: #fff;
        padding: 20px 30px;
        .field {
            border-bottom: 1px solid #f9f9f9;
            margin-bottom: 20px;
            .label {
                font-size: 28px;
                color: #666666;
                opacity: 0.7;
            }
            .info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-height: 80px;
                .text {
                    font-size: 40px;
                    color: #333333;
                }
                .amount {
                    font-size: 56px;
                    color: $color-theme;
                }
                .attach {
                    font-size: 48px;
                    color: $color-theme;
                }
                .btn {
                    float: right;
                    background: #efe9fe;
                    // border: 1px solid  $color-theme;
                    font-size: 28px;
                    color: $color-theme;
                    border-radius: 30px;
                    height: 60px;
                    line-height: 60px;
                    width: 150px;
                    text-align: center;
                }
            }
        }
    }
    .btn-deposit {
        margin-top: 30px;
        padding: 10px 30px;
        .btn-purchase {
            background: $color-theme;
            border-radius: 20px;
            font-weight: bold;
            height: 88px;
            line-height: 88px;
            font-size: 36px;
            color: #ffffff;
            letter-spacing: 0.61px;
            text-align: center;
        }
    }
    .notice {
        font-size: 22px;
        color: #7a7a7e;
        padding: 30px;
    }
}
</style>
