<template>
    <div class="deposit">
        <page-header :title="$t('buy_013')" :hide="true" :show-icon="true"></page-header>
        <div class="skeleton">
            <div class="member-integral">
                <div>
                    <span>{{$t('buy_008')}}:</span>
                    <span>{{userInfo.point || 0}}</span>
                </div>
                <div>{{$Helper.format($t("buy_010"),[100, config.ex_rate])}}</div>
                <div @click="updateCheck()" v-if="pay_type === 0">
                    <span>{{$t("buy_009")}}</span>
                    <img :src="checkImage[checked]" />
                </div>
                <div v-else></div>
            </div>
            <div class="buy-list-item">
                <div>
                    <!-- <div class="day-count">
                        {{desposiItem.day}}
                        <span>{{$t("buy_003").replace("days","D")}}</span>
                    </div>-->
                    <!-- <img src="../../assets/images/buy/buy_day_count.png" alt /> -->
                </div>
                <div>
                    <div>
                        <span>{{$t("buy_014")}}:</span>
                        <span>{{desposiItem.day}}{{$t("buy_003")}}</span>
                    </div>
                    <div>
                        <span>{{$t("buy_015")}}:</span>
                        <span>
                            <span>{{getNeedMoney()}} {{$t("other_003")}}</span>
                            <del>{{desposiItem.total_point / 100}} {{$t("other_003")}}</del>
                        </span>
                    </div>
                </div>
            </div>
            <div class="bg"></div>

            <div class="selectBg">
                <div class="selection">
                    <div class="line" @click="show = true">
                        <div class="text">{{$t('buy_013')}}</div>
                        <div class="purpose" v-if="!pay_value">{{$t('buy_017')}}</div>
                        <div class="chosen-box" v-else>
                            <div class="bank"></div>
                            <div class="text">{{pay_value}}</div>
                        </div>
                        <div>
                            <van-icon name="arrow" size="20"></van-icon>
                        </div>
                    </div>
                </div>
                <template v-if="pay_type !== null">
                    <div class="selection">
                        <div class="line" @click="show_channel = true">
                            <div class="text">{{$t('buy_016')}}</div>
                            <div class="purpose" v-if="!channel_value">{{$t('buy_018')}}</div>
                            <div class="selected" v-else>{{channel_value}}</div>
                            <div>
                                <van-icon name="arrow" size="20"></van-icon>
                            </div>
                        </div>
                    </div>
                    <template v-if="pay_type === 0">
                        <div class="selection row-flexed" v-if="is_bank_transfer">
                            <div
                                class="input-label"
                                :class="language=='zh'?'input-label':'input-label1'"
                            >{{$t('mine_010')}}</div>
                            <van-field
                                @input="name_input"
                                class="cell-field"
                                :placeholder="$t('mine_033')"
                                v-model="pay_name"
                            ></van-field>
                        </div>
                    </template>
                </template>
                <div class="btn-box">
                    <div
                        class="btn-next"
                        :class="is_btn_active && 'active'"
                        @click="place_order"
                    >{{$t('other_002')}}</div>
                </div>
            </div>
            <div class="bg"></div>
            <div class="tip-box">
                <div class="tip-title">{{$t('other_008')}}</div>
                <div class="row-box">
                    <div class="value-second">{{$t('vip_002')}}</div>
                </div>
            </div>
            <van-popup
                round
                class="popup"
                v-model="show"
                :close-on-click-overlay="false"
                position="bottom"
                :safe-area-inset-bottom="true"
            >
                <div class="titles">
                    <div class="left" @click="show=false">{{$t('other_004')}}</div>
                    <div class="middle">{{$t('buy_013')}}</div>
                    <div class="right" @click="selected">{{$t('other_005')}}</div>
                </div>
                <div class="pay-method">
                    <div
                        class="item"
                        v-for="(item,index) in pay_methods"
                        :key="index"
                        @click="pay_select(item)"
                    >
                        <div class="bank"></div>
                        <div
                            class="text"
                            :class="pay_active === item.pay_type && 'active'"
                        >{{item.name}}</div>
                    </div>
                </div>
            </van-popup>
            <van-popup
                v-model="show_channel"
                position="bottom"
                round
                :safe-area-inset-bottom="true"
            >
                <van-picker
                    :show-toolbar="true"
                    :title="$t('buy_016')"
                    :columns="columns"
                    @cancel="onClickLeft"
                    @confirm="onConfirm"
                />
            </van-popup>
        </div>
    </div>
</template>
<script>
import PageHeader from "../../components/Header";
// import { deposit_pay, get_pay_type } from "../../api/pay";
export default {
    name: "deposit",
    components: { PageHeader },
    computed: {
        userInfo() {
            return this.$store.state.User.userInfo;
        },
        config() {
            return this.$store.state.User.config;
        }
    },
    data() {
        return {
            checkImage: [
                // require("../../assets/images/buy/check_no.png"),
                // require("../../assets/images/buy/check.png")
            ],
            checked: 0,
            show: false,
            is_bank_transfer: false,
            is_btn_active: false,
            pay_active: null,
            pay_methods: {},
            channel_value: "",
            methods_text: "",
            pay_name: "",
            pay_value: "",
            temp_value: "",
            amount: 0,
            channels: [],
            columns: [],
            bankList: [],
            deviceType: [],
            card_id: "",
            level_info: [],
            show_channel: false,
            pay_type: null,
            pay_pack: "",
            order_no: "",
            ac_name: "",
            name: "",
            pay_pack_name: "",
            language: Cookies.get("language") || "en",
            desposiItem: {}
        };
    },
    mounted() {
        localStorage.removeItem("lastDepositTime");
        if (this.$route.query.day !== undefined) {
            let data = JSON.parse(JSON.stringify(this.$route.query));
            for (let i in data) {
                data[i] = Number(data[i]);
            }
            this.desposiItem = data;
            this.init_data();
        } else {
            this.$router.push("home");
        }
    },

    methods: {
        getNeedMoney() {
            if (this.pay_type !== 0) {
                return this.$Helper.format_point(
                    (this.desposiItem.total_point * this.desposiItem.rate) /
                        10000
                );
            }
            let max = Number(
                this.$Helper.format_point(
                    (this.desposiItem.total_point * this.desposiItem.rate) /
                        10000
                )
            );
            return this.checked
                ? Math.max(
                      max -
                          ((this.userInfo.point * this.config.ex_rate) / 100 ||
                              0),
                      0
                  )
                : this.$Helper.format_point(max);
        },
        updateCheck() {
            this.checked = this.checked == 1 ? 0 : 1;
        },
        init_data() {
            get_pay_type({
                type: 0,
                point: this.desposiItem.point
            }).then(resp => {
                let data = resp.list || [];
                if (data.length > 0) {
                    data.map(item => {
                        item["name"] =
                            item.pay_type == 0
                                ? this.$t("buy_002")
                                : this.$t("buy_001");
                    });
                    this.pay_methods = data;
                    // this.updatePayParams(data[0])
                }
            });
        },
        updatePayParams(item) {
            const { name, on_or_off, pay_type, pay_id } = item;
            this.pay_active = pay_type;
            this.pay_type = pay_type;
            this.pay_value = name;
            this.bankList =
                this.pay_methods.find(el => el.pay_type == pay_type).data || [];
            this.bankList.map((element, i) => {
                this.columns.push(element.pay_pack_name);
            });
            if (on_or_off === "ThirdParty") {
                this.is_btn_active = true;
                this.is_bank_transfer = false;
            } else {
                this.is_bank_transfer = true;
            }
        },
        name_input() {
            if (this.pay_name && this.pay_value) {
                this.is_btn_active = true;
            }
        },
        place_order() {
            if (!this.pay_value) {
                this.$toast(this.$t("buy_017"));
                // this.$toast('请选择支付类型')
                return false;
            }
            if (!this.channel_value) {
                this.$toast(this.$t("buy_018"));
                // this.$toast('请选择支付类型')
                return false;
            }
            if (!this.pay_name && this.pay_type === 0) {
                this.$toast(this.$t("mine_036"));
                // this.$toast('请选择支付类型')
                return false;
            }
            deposit_pay({}).then(data => {
                if (data) {
                    let obj = {
                        vip: this.desposiItem.item_id,
                        pay_type: this.pay_type,
                        order_no: data.order_no,
                        name: this.name,
                        pay_id: this.pay_id,
                        pay_pack: this.pay_pack,
                        ac_name: this.ac_name,
                        account: this.account,
                        amount: this.getNeedMoney(),
                        pay_pack_name: this.pay_pack_name,
                        pay_name: this.pay_name,
                        use_point: Number(this.pay_type === 0 && this.checked)
                    };
                    this.$router.push({
                        name: "DepositDetail",
                        query: obj
                    });
                }
            });
            // if (this.temp_value.on_or_off === 'ThirdParty') {
            //     const submit_params = {
            //         deviceType:this.deviceType,
            //         depositClassifyCode:this.pay_value,
            //         memberLevelId: this.level_info[1],
            //         cardId:this.card_id,
            //         amount:this.amount
            //     }
            //     deposit_pay(submit_params).then(data=>{
            //            if (data) {
            //                const {par} = data;
            //                location.href = par;
            //            }
            //        }).catch(reason=>{
            //         this.$toast(reason.msg)
            //     })
            // } else {
            //     if (!this.pay_name) {
            //         this.$toast(this.$t('mine_033'))
            //         return false;
            //     }
            //     const bank_submit = {
            //         deviceType:this.deviceType,
            //         cardId:this.card_id,
            //         amount:this.amount,
            //         name:this.pay_name,
            //         memberLevelId:this.level_info[1],
            //     }
            //     bank_deposit(bank_submit)
            //        .then(data=>{
            //            data['bankName'] = this.pay_name;
            //            data['pay_method'] = this.pay_value;
            //            this.$router.push({
            //                name:'DepositDetail',
            //                params:{data:data}
            //            })
            //        }).catch(error=>{
            //         this.$toast(error.msg)
            //     })
            // }
        },
        selected() {
            if (!this.temp_value) {
                this.$toast(this.$t("buy_017"));
                return false;
            }
            this.columns = [];
            this.updatePayParams(this.temp_value);
            this.show = false;
            this.channel_value = "";
        },
        pay_select(item) {
            this.pay_active = item.pay_type;
            this.temp_value = item;
            this.$set(this.temp_value, "on_or_off");
        },
        onClickLeft() {
            this.show_channel = false;
        },
        onConfirm(str) {
            this.channel_value = str;
            let obj = this.bankList.filter(
                item => item.pay_pack_name == str
            )[0];
            this.ac_name = obj.ac_name;
            this.pay_pack = obj.pay_pack;
            this.account = obj.account;
            this.name = obj.name;
            this.pay_id = obj.pay_id;
            this.pay_pack_name = obj.pay_pack_name;
            this.show_channel = false;
        },
        translate(code) {
            if (code.indexOf("ALi") > -1) {
                return "alipay";
            } else if (code.indexOf("WeChart") > -1) {
                return "wechat";
            } else if (code.indexOf("BankCard") > -1) {
                return "bank";
            }
        }
    }
};
</script>
<style lang="scss">
.deposit {
    height: 100vh;
    background-color: #ffffff;
    .member-integral {
        display: flex;
        align-items: center;
        padding: 30px 0 20px 0;
        margin: 0 40px;
        border-bottom: 1px solid rgb(225, 225, 225);
        font-size: 20px;
        margin-top: 10px;
        margin-bottom: 20px;
        & > div:first-of-type {
            font-size: 24px;
            font-weight: 600;
            margin-right: 10px;
            & > span:first-of-type {
                color: rgb(44, 44, 44);
                margin-right: 12px;
            }
            & > span:last-of-type {
                color: rgb(4, 151, 255);
            }
        }
        & > div:nth-of-type(2) {
            flex: 1;
            font-size: 20px;
            color: rgb(160, 160, 160);
            margin-right: 30px;
            text-align: center;
        }
        & > div:last-of-type {
            display: flex;
            align-items: center;
            & > span {
                margin-right: 10px;
            }
            & > img {
                width: 39px;
            }
        }
    }
    .buy-list-item {
        display: flex;
        margin: 0 30px;
        background-color: #fff;
        margin-bottom: 20px;
        height: 160px;
        padding: 0 10px;
        border-radius: 12px;
        align-items: center;
        & > div:first-of-type {
            background-color: rgb(119, 179, 213);
            width: 134px;
            height: 134px;
            border-radius: 67px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            img {
                width: 90px;
            }
            .day-count {
                width: 67%;
                padding-right: 35px;
                text-align: right;
                font-size: 34px;
                color: rgb(236, 105, 65);
                position: absolute;
                top: 60px;
                left: 24px;
                span {
                    position: absolute;
                    font-size: 17px;
                    top: -4px;
                    right: 0.5em;
                }
            }
        }
        & > div:nth-of-type(2) {
            margin-left: 50px;
            font-size: 24px;
            & > div:first-of-type {
                & > span:first-of-type {
                    font-size: 24px;
                    color: rgb(26, 26, 26);
                    font-weight: 600;
                    margin-right: 15px;
                }
                & > span:last-of-type {
                    font-weight: 600;
                    color: rgb(24, 118, 254);
                }
            }
            & > div:last-of-type {
                display: flex;
                align-items: center;
                margin-top: 20px;
                & > span:first-of-type {
                    font-size: 24px;
                    color: rgb(26, 26, 26);
                    font-weight: 600;
                    margin-right: 10px;
                }
                & > span:last-of-type {
                    & > span {
                        margin-right: 15px;
                        font-weight: 600;
                        color: rgb(24, 118, 254);
                    }
                    & > del {
                        color: rgb(130, 130, 130);
                    }
                }
            }
        }
    }
    .skeleton {
        border-top: 1px solid rgb(225, 225, 225);
        // padding: 20px 30px;
        .desc {
            // height: 150px;
            // border-radius: 20px;
            padding: 40px 30px;
            background-color: #ffffff;
            overflow: hidden;
            .d_left {
                width: 80px;
                height: 80px;
                border-radius: 24px;
                float: left;
                margin-right: 0.2rem;
                &.bronze {
                    // background-image: url("../../assets/images/vip/bronze.png");
                    height: 100px;
                    width: 100px;
                }
                &.silver {
                    // background-image: url("../../assets/images/vip/silver.png");
                    height: 100px;
                    width: 100px;
                }
                &.golden {
                    // background-image: url("../../assets/images/vip/golden.png");
                    height: 100px;
                    width: 100px;
                }
                &.diamond {
                    // background-image: url("../../assets/images/vip/diamond.png");
                    height: 100px;
                    width: 100px;
                }
                &.tertinggi {
                    // background-image: url("../../assets/images/vip/tertinggi.png");
                    height: 100px;
                    width: 100px;
                }
                background-size: 100% 100%;
            }
            .d_right {
                float: left;
                .line {
                    line-height: 30px;
                    // margin-bottom: 16px;
                    .text {
                        font-size: 32px;
                        color: #666666;
                    }
                    .purpose {
                        font-size: 28px;
                        color: #000000;
                        &.red {
                            font-size: 40px;
                            color: $color-theme;
                            font-weight: 500;
                        }
                    }
                }
            }
        }
        .selectBg {
            background-color: #ffffff;
            padding: 0.3rem 0;
            margin-top: 20px;
            .selection {
                margin-top: 20px;
                height: 96px;
                padding: 0 30px;
                .line {
                    height: 96px;
                    justify-content: space-between;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #e6e6e6;
                    .text {
                        font-size: 34px;
                        color: #666666;
                        flex-basis: 25%;
                    }
                    .purpose {
                        font-size: 30px;
                        color: #999999;
                        position: absolute;
                        margin-left: 2.1rem;
                    }
                    .selected {
                        font-size: 30px;
                        color: #000000;
                        font-weight: 500;
                        height: 96px;
                        line-height: 96px;
                        position: absolute;
                        margin-left: 2.1rem;
                    }
                    .chosen-box {
                        flex-basis: 60%;
                        height: 96px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        .text {
                            margin-left: 10px;
                            font-size: 30px;
                            color: #000000;
                            font-weight: 500;
                            height: 96px;
                            line-height: 96px;
                            flex-basis: 100%;
                        }
                    }
                }
                ._under {
                    line-height: 0.5rem;
                }
            }
        }
        .bg {
            background-color: #f2f2f2;
            height: 0.3rem;
        }
        .row-flexed {
            display: flex;
            .input-label {
                font-size: 34px;
                color: rgb(102, 102, 102);
                flex-basis: 35%;
                height: 96px;
                line-height: 96px;
            }
            .input-label1 {
                line-height: 43px;
            }
            .cell-field {
                height: 96px;
                line-height: 60px;
                font-size: 30px;
            }
        }
        .btn-box {
            // margin-top: 60px;
            margin: 0.3rem;
            .btn-next {
                background-color: $color-Nobtnbg;
                border-radius: 20px;
                height: 88px;
                line-height: 88px;
                color: #ffffff;
                font-size: 36px;
                text-align: center;
                &.active {
                    background-color: $color-theme;
                }
            }
        }
    }
    .tip-box {
        font-size: 28px;
        color: #666666;
        padding: 0 0.3rem;
        // background: #FFFFFF;
        .tip-title {
            font-weight: bold;
            font-size: 30px;
            color: rgb(26, 26, 26);
            margin: 20px 0 20px;
        }
        .row-box {
            display: flex;
            margin-top: 0.2rem;
        }
    }
    .popup {
        .titles {
            position: relative;
            display: flex;
            padding: 20px 34px;
            font-size: 30px;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(229, 229, 229, 0.7);
            .left {
                color: #999999;
            }
            .middle {
                font-size: 34px;
                color: #000000;
                font-weight: bolder;
            }
            .right {
                font-size: 30px;
                color: $color-theme;
                font-weight: bolder;
            }
        }
        .pay-method {
            overflow-y: auto;
            padding: 30px;
            .item {
                height: 96px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .text {
                    height: 96px;
                    display: flex;
                    align-items: center;
                    flex-basis: 88%;
                    font-size: 36px;
                    color: #000000;
                    border-bottom: 1px solid rgba(229, 229, 229, 0.6);
                    position: relative;
                    &.active::after {
                        content: "";
                        position: absolute;
                        right: 20px;
                        width: 38px;
                        height: 40px;
                        // background-image: url("../../assets/images/vip/check.png");
                        background-size: 100% 100%;
                    }
                }
            }
        }
    }
}
// .bank {
//     background-image: url("../../assets/images/vip/bank-transfer.png");
//     height: 50px;
//     width: 50px;
//     background-size: 100% 100%;
// }
// .wechat {
//     background-image: url("../../assets/images/vip/WeChat.png");
//     height: 50px;
//     width: 50px;
//     background-size: 100% 100%;
// }
// .cloud {
//     background-image: url("../../assets/images/vip/cloud.png");
//     height: 50px;
//     width: 50px;
//     background-size: 100% 100%;
// }
// .alipay {
//     background-image: url("../../assets/images/vip/alipay.png");
//     height: 50px;
//     width: 50px;
//     background-size: 100% 100%;
// }
.van-picker__toolbar {
    .van-picker__confirm {
        color: $color-theme;
        font-weight: bold;
    }
}
.van-field__control:disabled {
    color: #000000;
    font-weight: 500;
}
</style>
