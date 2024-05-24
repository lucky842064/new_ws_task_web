<template>
    <div class="detailDetail">
        <div v-for="(item) in list" :key="item.id">
            <div class="item-wrap">
                <div class="item" @click="jumpDetail(item)">
                    <div class="tit txtEll">{{item.title}}</div>
                    <div class="date">{{item.createDate}}</div>
                </div>
                <div class="content van-ellipsis">{{filter(item.content,1000)}}</div>
            </div>
            <div class="van-hairline--bottom"></div>
        </div>
    </div>
</template>
<script>
import { noticeList } from "@/api/sys.js";
export default {
    data() {
        return {
            list: []
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            let param = { page: 0, limit: 10 };
            noticeList(param)
                .then(res => {
                    this.list = res.list;
                })
                .catch(e => {
                    this.$toast("请求失败");
                });
        },
        jumpDetail(item) {
            this.$router.push({
                name: "NoticeDetail",
                query: {
                    id: item.id,
                    type: "notice"
                }
            });
        },
        filter(text, len = 0) {
            var reg = /<[^<>]+>/g; //1、全局匹配g肯定忘记写,2、<>标签中不能包含标签实现过滤HTML标签
            text = text.replace(reg, ""); //替换HTML标签
            text = text.replace(/&nbsp;/gi, ""); //替换HTML空格

            if (len && len > 0) {
                let t = "";
                if (text.length > len) {
                    t = "...";
                }
                text = text.substr(0, len) + t;
            }
            return text;
        }
    }
};
</script>
<style lang="scss" scoped>
.detailDetail {
    padding: 0 24px;
    .item-wrap {
        padding: 20px 0;
    }
    .item {
        position: relative;
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:after {
            content: "";
            display: block;
            height: 1px;
            background-color: rgba(238, 238, 238, 1);
        }
        .tit {
            font-size: 32px;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
            width: 60%;
        }
        .date {
            font-size: 24px;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
        }
    }
    .content {
        font-size: 30px;
        color: #999999;
        line-height: 1.4;
    }
}
</style>
