<template>
    <div class="earn">
        <page-header :title="getTitle()" :show-icon="true"></page-header>
        <van-tabs v-model="activeTab">
            <van-tab :title="$t('mine_044')"></van-tab>
            <van-tab :title="$t('mine_058')"></van-tab>
        </van-tabs>
        <div v-show="activeTab == 0">
            <div class="promote-header" v-show="activeTab == 0">
                <drop-down
                    :list="statusList"
                    keys="value"
                    values="text"
                    height="0.6rem"
                    backgroundColor="#fff"
                    iconColor="#333"
                    color="rgb(4, 151, 255)"
                    width="2.6rem"
                    listBorderColor="rgb(4, 151, 255)"
                    mainBorder="1px solid rgb(225,225,225)"
                    borderRadius="4px"
                    ref="earnAppRef"
                    @on-change="changeStatus"
                    style="margin-right:0.15rem;"
                ></drop-down>
                <div>
                    <span
                        >{{ $t("mine_045") }}: {{ actCount }} /
                        {{ allCount }}</span
                    >
                </div>
            </div>
            <div class="body service-body">
                <div>
                    <div class="buy-title">
                        <span>{{ $t("mine_043") }}</span>
                        <span>{{ $t("mine_042") }}</span>
                        <span>{{ $t("mine_046") }}</span>
                    </div>
                </div>
                <div>
                    <div v-for="(item, index) in list0" :key="index">
                        <span>{{ item.register_time }}</span>
                        <span>{{ item.user_account }}</span>
                        <span :class="item.status == 1 ? 'ok' : 'oking'">{{
                            item.status == 1 ? $t("mine_048") : $t("mine_049")
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="activeTab == 1">
            <div class="promote-header">
                <div
                    @click="showDatePicker = !showDatePicker"
                    class="date-time-promote"
                >
                    <span>{{ datetime }}</span>
                    <img
                        src="../../assets/images/mine/arrow.png"
                        style="transition: all 200ms linear"
                        :style="{
                            transform: `rotate(${showDatePicker ? 180 : 0}deg)`
                        }"
                    />
                </div>
                <div>
                    <span>{{ $t("mine_061") }}: {{ total_point }}</span>
                </div>
            </div>
            <div class="body service-body">
                <div>
                    <div class="buy-title">
                        <span>{{ $t("mine_060") }}</span>
                        <span>{{ $t("mine_042") }}</span>
                        <span>{{ $t("mine_059") }}</span>
                    </div>
                </div>
                <div>
                    <div v-for="(item, index) in list1" :key="index">
                        <span>{{ item.time }}</span>
                        <span>{{ item.f_user }}</span>
                        <span>{{ item.point }}</span>
                    </div>
                </div>
            </div>
        </div>
        <PrevNext
            :page="page0"
            :limit="limit"
            :total="total0"
            :len="list0.length"
            v-if="activeTab == 0"
            @to-prev="onPrev()"
            @to-next="toNext()"
        ></PrevNext>
        <PrevNext
            :page="page1"
            :limit="limit"
            :total="total1"
            :len="list1.length"
            v-else
            @to-prev="onPrev()"
            @to-next="toNext()"
        ></PrevNext>
        <van-popup
            v-model="showDatePicker"
            position="bottom"
            :safe-area-inset-bottom="true"
        >
            <van-datetime-picker
                v-model="currentDate"
                :confirm-button-text="$t('other_005')"
                :cancel-button-text="$t('other_004')"
                @confirm="onchangDate1()"
                @cancel="closeDatePicker()"
                :title="$t('mine_047')"
                type="date"
            />
        </van-popup>
    </div>
</template>
<script>
import { invitelist, profit_list } from "@/api/user";
import PageHeader from "@/components/Header";
import PrevNext from "@/components/PrevNext";
export default {
    components: { PageHeader, PrevNext },
    data() {
        return {
            activeTab: 0,
            datetime: "",
            currentDate: "", //初始化当前时间
            showDatePicker: false, //判断popup弹出层是否显示，false不显示
            list0: [],
            list1: [],
            page0: 1,
            page1: 1,
            limit: 18,
            statusCheck: -1,
            allCount: 0,
            actCount: 0,
            total_point: 0,
            statusList: [
                { text: this.$t("mine_062"), value: -1 },
                { text: this.$t("mine_063"), value: 1 },
                { text: this.$t("mine_064"), value: 0 }
            ],
            total0: 0,
            total1: 0
        };
    },
    created() {
        this.invitelist();
    },
    mounted() {
        this.currentDate = new Date(); //给当前时间赋值
        this.datetime = this.$Helper
            .format_date(this.currentDate)
            .split(" ")[0]; //给单元格显示当前时间的变量赋值
    },
    watch: {
        statusCheck() {
            this.page0 = 1;
            this.invitelist();
        },
        activeTab() {
            if (this.activeTab == 0) {
                if (this.list0.length == 0) {
                    this.invitelist();
                }
            } else if (this.activeTab == 1) {
                if (this.list1.length == 0) {
                    this.profit_list();
                }
            }
        }
    },
    methods: {
        changeStatus(item) {
            if (this.statusCheck != item.value) {
                this.statusCheck = item.value;
            }
        },
        profit_list() {
            let stime = new Date(`${this.datetime} 00:00:00`).getTime() / 1000;
            let etime = new Date(`${this.datetime} 23:59:59`).getTime() / 1000;
            profit_list({
                page: this.page1,
                limit: this.limit,
                stime,
                etime,
                type: -1
            }).then(res => {
                this.list1 = res.list || [];
                this.total1 = res.total || 0;
                this.total_point = res.total_point || 0;
            });
        },
        onPrev() {
            if (this.activeTab == 0) {
                this.page0--;
                this.invitelist();
            } else {
                this.page1--;
                this.profit_list();
            }
        },
        onNext() {
            if (this.activeTab == 0) {
                this.page0++;
                this.invitelist();
            } else {
                this.page1++;
                this.profit_list();
            }
        },
        invitelist() {
            invitelist({
                page: this.page0,
                limit: this.limit,
                status: this.statusCheck
            }).then(res => {
                this.list0 = res.list || [];
                this.total0 = res.total || 0;
                this.allCount = res.all_count || 0;
                this.actCount = res.act_count || 0;
            });
        },
        closeDatePicker() {
            this.showDatePicker = false;
        },
        onchangDate1() {
            //currentDate值就是选择的时间，把改变后的值赋值给单元格变量显示
            let newDate = this.$Helper
                .format_date(this.currentDate)
                .split(" ")[0];
            if (this.datetime != newDate) {
                this.datetime = newDate;
                this.page1 = 1;
                this.list1 = [];
                this.profit_list();
            }
            this.closeDatePicker();
        },
        getTitle() {
            return this.activeTab == 0
                ? this.$t("mine_044")
                : this.$t("mine_058");
        }
    }
};
</script>
<style lang="scss" scoped>
.earn {
    background-color: #f2f2f2;
    height: 100vh;
    flex-direction: column;
    display: flex;
    overflow-y: hidden;
    .body {
        flex: 1;
        position: relative;
        overflow-y: auto;
    }
}

.ok {
    color: rgb(3, 176, 27);
}

.oking {
    color: rgb(255, 144, 0);
}

.service-body {
    overflow: hidden !important;
    display: flex;
    flex-direction: column;
    padding: 15px 30px;
    background-color: #fff;
    & > div:last-of-type {
        flex: 1;
        overflow: auto;
    }
    & > div > div {
        display: flex;
        height: 50px;
        line-height: 50px;
        color: rgb(26, 26, 26);
        // font-weight: 600;
        font-size: 12px;
        border-bottom: 1px solid rgb(225, 225, 225);
        & > span {
            flex-shrink: 0;
            text-align: center;
        }
        & > span:first-of-type {
            width: 280px;
        }
        & > span:nth-of-type(2) {
            flex-shrink: 0;
            min-width: 2rem;
        }
        & > span:nth-of-type(3) {
            flex: 1;
        }
    }
    .buy-title {
        flex-shrink: 0;
        background-color: rgb(233, 233, 233);
        font-size: 28px !important;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        overflow: hidden;
        border-bottom: none !important;
    }
}
.promote-header {
    display: flex;
    align-items: center;
    background-color: #fff;
    height: 70px;
    padding: 0 30px;
    margin-top: 10px;
    margin-bottom: 4px;
    font-weight: 600;
    & > div {
        font-size: 24px;
        display: flex;
        align-items: center;
        img {
            margin-left: 10px;
            width: 20px;
            vertical-align: middle;
        }
    }
    & > div:first-of-type {
        flex-shrink: 0;
        margin-right: 40px;
    }
    & > div:nth-of-type(2) {
        flex: 1;
        & > span:first-of-type {
            margin-right: 20px;
        }
    }
}
.date-time-promote {
    flex-shrink: 0;
    margin-right: 50px;
    height: 0.6rem;
    box-sizing: content-box;
    padding: 0 16px;
    font-size: 20px;
    width: 1.7rem;
    display: flex;
    justify-content: space-between;
    color: rgb(4, 151, 255);
}
::v-deep .van-dropdown-menu__bar {
    box-shadow: none;
    height: 0.7rem !important;
}
::v-deep .van-popup.van-popup--bottom.van-popup--safe-area-inset-bottom {
    height: auto !important;
}
</style>
