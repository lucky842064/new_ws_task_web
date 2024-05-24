<template>
    <div class="title">
        <page-header title="消息详情"></page-header>
        <div class="detail">
            <div class="d_header">
                <div class="tit">{{cnt.title}}</div>
                <!-- <div class="date">{{cnt.time}}</div> -->
            </div>
            <div class="d_header">
                <!-- <div class="tit">{{cnt.title}}</div> -->
                <div class="date">{{cnt.time}}</div>
            </div>
            <div class="cnt" v-if="cnt.type == 0">
                <div v-html="cnt.text" class="innerTxt" v-if="cnt.type == 0"></div>
            </div>
            <div class="cnt" v-if="cnt.type == 1">
                <div v-if="cnt.url == ''" v-html="cnt.text" class="innerTxt"></div>
                <img v-else :src="cnt.url" alt="">
            </div>
        </div>
    </div>
</template>
<script>
import PageHeader from "../../components/Header";
export default {
    components: { PageHeader },
    data() {
        return {
            title: "",
            cnt: {
                title: "", //客服和公告的标题
                content: "",
                createDate: "",
                subject: "" //系统消息的标题
            }
        };
    },
    created() {
        // this.title = this.$route.params.name;
        this.cnt = this.$route.params.data;
    },
    methods: {}
};
</script>
<style lang="scss" scoped>
.title{
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.detail {
    flex: 1;
    overflow: hidden;
    padding: 20px 46px;
    border-top: 1px solid #e6e6e6;
    display: flex;
    flex-direction: column;
    .d_header {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: space-between;
        .tit {
            font-size: 32px;
            font-weight: 700;
            color: rgba(51, 51, 51, 1);
            line-height: 1.8;
            flex-basis: 60%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .date {
            flex-basis: 40%;
            font-weight: 400;
            font-size: 26px;
            color: #999999;
            display: flex;
        }
    }

    .cnt {
        font-weight: 400;
        font-size: 28px;
        color: #000000;
        line-height: 1.6;
        padding-bottom: 30px;
        flex: 1;
        overflow: auto;text-align:justify;
        .innerTxt {
            margin-top: 20px;
            padding-bottom: 30px;
            word-wrap: break-word;
        }
        img{
            display: table;
            width: 6.2rem;
            height: 7rem;
            margin: 0 auto;
            margin-top: 20px;
        }
    }
}
</style>
