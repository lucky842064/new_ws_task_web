<template>
    <div class="user-info">
        <page-header :title="$t('title_008')" :noBg="false"></page-header>
        <div class="content-block">
            <div class="group-box">
                <van-cell-group>
                    <van-field
                        v-if="type"
                        :label="$t('mine_008')"
                        class="cell-block"
                        required
                        :value="userInfo.user_key"
                        :disabled="true"
                    ></van-field>
                    <van-field
                        :label="$t('mine_009')"
                        type="digit"
                        required
                        class="cell-block"
                        :maxlength="19"
                        v-model="userInfo.bank_no"
                    ></van-field>
                    <van-field
                        :label="$t('mine_010')"
                        class="cell-block"
                        required
                        v-model="userInfo.bank_user_name"
                    ></van-field>
                    <van-field
                        :label="$t('mine_011')"
                        class="cell-block"
                        required
                        v-model="userInfo.bank_name"
                    ></van-field>
                    <van-field
                        :label="$t('mine_012')"
                        class="cell-block"
                        :clickable="true"
                        v-model="userInfo.bank_zhi"
                    ></van-field>
                </van-cell-group>
                <!-- <van-field
                    :label="$t('buy_025')"
                    class="cell-block"
                    :clickable="true"
                    v-model="code"
                    v-if="type"
                >
                    <template #button>
                        <TimeCount
                            class="countTime"
                            :phone="userInfo.phone"
                            :code="userInfo.code"
                            :type="2"
                        />
                    </template>
                </van-field>-->
                <div class="submit-button" @click="submitForm">{{$t('earn_023')}}</div>
            </div>
            <!-- <p class="withdrawlTip" v-html="$Helper.updateToService($t('mine_004'),$t('mine_040'))"></p> -->
        </div>

        <!-- <van-popup
            v-model="popupShow"
            position="bottom"
            round
            :style="{ height: '50%' }"
            :safe-area-inset-bottom="true"
        >
            <van-picker
                :show-toolbar="true"
                :columns="columns"
                @cancel="onClickLeft"
                @confirm="onConfirm"
            />
        </van-popup>-->
        <!-- <van-popup
            v-model="citySelect"
            round
            position="bottom"
            :style="{ height: '40%' }"
            :safe-area-inset-bottom="true"
        >
            <van-area
                :area-list="areaList"
                :columns-num="3"
                v-on:confirm="confirm_select"
                v-on:cancel="cancel_select"
            ></van-area>
        </van-popup>-->
    </div>
</template>

<script>
import { myaccount, addbank, upbank } from "../../api/user";
// import TimeCount from "../../components/TimeCout";
// import { area_list } from "../../utils/area";
import PageHeader from "../../components/Header";
export default {
    name: "backbind",
    components: { PageHeader },
    data() {
        return {
            code: "",
            userInfo: {},
            popupShow: false,
            // citySelect: false,
            // areaList: area_list,
            // columns: [
            //     "中国农业银行",
            //     "广东发展银行",
            //     "渤海银行",
            //     "浙江稠州商业银行",
            //     "深圳发展银行",
            //     "交通银行",
            //     "北京银行",
            //     "中国银行",
            //     "中国建设银行",
            //     "中国民生银行",
            //     "中国工商银行",
            //     "中国邮政储蓄银行",
            //     "上海浦东发展银行",
            //     "中国光大银行",
            //     "招商银行",
            //     "中信银行",
            //     "平安银行",
            //     "兴业银行",
            //     "华夏银行",
            //     "东亚银行",
            //     "上海银行",
            //     "宁波银行",
            //     "南京银行"
            // ],
            type: 0
        };
    },

    created() {
        this.type = this.$route.query;
        this.myaccount();
    },
    methods: {
        myaccount() {
            myaccount().then(res => {
                this.userInfo = res;
            });
        },
        show_banks() {
            this.popupShow = true;
        },
        // show_city_select() {
        //     this.citySelect = true;
        // },
        onClickLeft() {
            this.popupShow = false;
        },
        onConfirm(value) {
            this.userInfo.bank_name = value;
            this.popupShow = false;
        },
        submitForm() {
            if (!this.userInfo.bank_no) {
                return this.$toast(this.$t("mine_034"));
            } else if (!this.userInfo.bank_user_name) {
                return this.$toast(this.$t("mine_036"));
            } else if (!this.userInfo.bank_name) {
                return this.$toast(this.$t("mine_035"));
            }
            if (this.$route.query) {
                let param = {
                    bank_no: this.userInfo.bank_no,
                    bank_user_name: this.userInfo.bank_user_name,
                    bank_name: this.userInfo.bank_name,
                    uid: localStorage.getItem("uid") || "",
                    bank_zhi: this.userInfo.bank_zhi || ""
                };
                upbank(param).then(() => {
                    this.$toast(this.$t("other_006"));
                    this.$router.back();
                });
            } else {
                let param = {
                    bank_no: this.userInfo.bank_no,
                    bank_user_name: this.userInfo.bank_user_name,
                    bank_name: this.userInfo.bank_name,
                    bank_zhi: this.userInfo.bank_zhi || ""
                };
                addbank(param).then(() => {
                    this.$toast(this.$t("other_006"));
                    this.$router.back();
                });
            }
        }
        // confirm_select(item) {
        //     let address = "";
        //     item.map(item => {
        //         address += item.name + " ";
        //     });
        //     this.userInfo.bank_zhi = address;
        //     this.citySelect = false;
        // },
        // cancel_select() {
        //     this.citySelect = false;
        // }
    }
};
</script>
<style lang="scss" scoped>
.user-info {
    background: #f2f2f2;
    box-sizing: border-box;
    height: 100vh;
    .withdrawlTip {
        font-size: 24px;
        padding: 0 0.3rem;
        font-weight: 400;
        color: #666666;
        line-height: 0.8rem;
        text-align: center;
        font-weight: 500;
        color: $home-risk-value;
    }

    .cell-block {
        line-height: 80px;
        padding: 10px 20px;
        border-bottom: 1px solid #ccc;
        color: rgb(102, 102, 102);
    }

    .content-block {
        margin-top: 20px;
    }
    .group-box {
        background-color: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        padding: 10px 20px;
    }
    .submit-button {
        width: 680px;
        height: 88px;
        margin: 35px auto;
        line-height: 88px;
        text-align: center;
        background: $color-theme;
        font-size: 36px;
        color: #ffffff;
        border-radius: 20px;
    }
}
::v-deep {
    .van-picker__confirm {
        color: $color-theme;
        font-weight: bold;
    }
}
.van-field__control input {
    text-align: right;
    font-size: 30px;
    font-weight: 500;
    color: #999999;
}
::v-deep {
    .van-field__control:disabled {
        color: #999999;
        font-weight: 500;
    }
}
::v-deep .van-field__label {
    width: 8.1em !important;
    color: #646566 !important;
}

::v-deep {
    .van-cell--required::before {
        left: 2px !important;
    }
}
</style>
