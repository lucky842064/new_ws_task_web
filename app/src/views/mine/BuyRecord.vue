<template>
    <div class="earn">
        <page-header :title="$t('title_004')" :show-icon="true"></page-header>
        <div class="body service-body">
            <div>
                <div class="buy-title">
                    <span>{{$t("mine_007")}}</span>
                    <span>{{$t("buy_014")}}</span>
                    <span>{{$t("buy_015")}}</span>
                    <span>{{$t("mine_006")}}</span>
                </div>
            </div>
            <div>
                <div v-for="(item,index) in list" :key="index">
                    <span>{{item.time}}</span>
                    <span>{{item.day}}{{$t("buy_003")}}</span>
                    <span>{{(item.money).toFixed(2)}}</span>
                    <span :style="getStatusColor(item.status)">{{getStatusText(item.status)}}</span>
                </div>
            </div>
        </div>
        <PrevNext
            :len="list.length"
            :page="page"
            :limit="limit"
            :total="total"
            @to-prev="onPrev"
            @to-next="onNext"
        ></PrevNext>
    </div>
</template>
<script>
import { payrecord } from "@/api/user";
import PageHeader from "@/components/Header";
import PrevNext from "@/components/PrevNext";
export default {
    components: { PageHeader, PrevNext },
    data() {
        return {
            list: [],
            page: 1,
            limit: 19,
            gtype: -1,
            total: 0
        };
    },
    mounted() {
        // for (let i = 0; i < this.limit; i++) {
        //     this.list.push({
        //         time: "2020-08-21 08:15:54",
        //         day: 7,
        //         money: 1990,
        //         status: i % 2
        //     });
        // }
    },
    created() {
        this.payrecord();
    },
    methods: {
        onPrev() {
            this.page--;
            this.payrecord();
        },
        onNext() {
            this.page++;
            this.payrecord();
        },
        getStatusColor(status) {
            switch (status) {
                case 1:
                    return { color: "rgb(255, 144, 0)" };
                case 2:
                    return { color: "rgb(3, 176, 27)" };
                case 3:
                    return { color: "rgb(255, 0, 66)" };
                case 4:
                    return { color: "rgb(180, 180, 180)" };
                default:
                    return {};
            }
        },
        getStatusText(status) {
            switch (status) {
                case 1:
                    return this.$t("mine_069");
                case 2:
                    return this.$t("mine_050");
                case 3:
                    return this.$t("mine_056");
                case 4:
                    return this.$t("mine_057");
                default:
                    return "";
            }
        },
        payrecord() {
            payrecord({
                page: this.page,
                limit: this.limit,
                gtype: this.gtype,
                status: this.gtype
            }).then(res => {
                this.list = res.list || [];
                this.total = res.total || 0;
            });
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

    .van-tabs {
        height: 1.05rem;
    }
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
    margin-top: 20px;
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
            width: 260px;
        }
        & > span:nth-of-type(2) {
            width: 160px;
        }
        & > span:nth-of-type(3) {
            flex: 1 !important;
            flex-shrink: 1 !important;
        }
        & > span:nth-of-type(4) {
            width: 120px;
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
</style>
