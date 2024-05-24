<template>
    <div class="detailDetail" @click="showDropDown=false">
        <page-header
            :title="$t('title_006')"
            @read_all="read_all"
            :noBg="false"
            :show-icon="false"
            :prevent="true"
            @return="onReturn"
        ></page-header>
        <div class="tab_bar">
            <van-tabs :active="curIndex" @change="changeTab">
                <van-tab :title="item.title" v-for="(item,index) in noticArry" :key="index"></van-tab>
            </van-tabs>
        </div>
        <div class="msg-main">
            <van-list v-model="loading" :finished="true" :finished-text="$t('mine_038')">
                <div class="item-box">
                    <div v-for="(item,index) in list" :key="index" class="item-wrap"  @click="jumpDetail(item,tab_active)">
                        <div class="left">
                            <img src="../../assets/images/mine/mine-msg-icon.jpg" alt />
                            <span class="redIcon" v-if="item.status===0"></span>
                        </div>
                        <div class="right">
                            <div class="adver_content">
                                <h4 class="adver_title" :title="item.title">{{item.title}}</h4>
                            </div>
                            <div class="adver_content">
                                <span class="adver_time">{{item.time}}</span>
                            </div>
                            <!-- <div v-if="item.tip_msg_type == 1" class="adver_descr">{{item.text}}</div> -->
                            <template v-if="curIndex == 0">
                                <img v-if="item.tip_msg_type == 1 && item.url !=''" class="adver_img" :src="item.url" alt=" ">
                                <div v-else class="adver_descr">{{item.text}}</div>
                            </template>
                            <template v-else-if="curIndex == 1">
                                <div class="adver_descr">{{item.text}}</div>
                            </template>
                        </div>
                    </div>
                </div>
            </van-list>
        </div>
    </div>
</template>
<script>
import { msglist, readmsg } from "../../api/user";
import PageHeader from "../../components/Header";
export default {
    components: { PageHeader },
    data() {
        return {
            curIndex:0,
            noticArry:[
                {
                    type:0,
                    title:"系统公告(0)"
                },
                {
                    type:1,
                    title:"站内信(0)"
                }
            ],
            list: [],
            noticeList: [],
            tab_active: 0,
            loading: false,
            finished: false,
            num1: 0,
            num2: 0
        };
    },
    created() {
        if(sessionStorage.getItem("messType") != undefined && sessionStorage.getItem("messType") != null){
            this.curIndex = Number(sessionStorage.getItem("messType"));
        }
        this.getList();
    },
    methods: {
        // 信息类型切换
        changeTab(idx){
            this.curIndex = idx;
            sessionStorage.setItem("messType",idx);
            this.list = [];
            this.getList();
        },
        onReturn() {
            this.$router.push("mine");
        },
        tab_switch(tab) {
            this.tab_active = tab;
            this.onLoad();
        },
        jumpDetail(item) {
            item.type = this.curIndex == 0 ? 1:0;
            let params = { type: item.type, id: item.id, ptype: 0 };
            if (item.status == 1) {
                return this.roterMsg(item);
            } else {
                readmsg(params).then(res => {
                    this.roterMsg(item);
                });
            }
        },
        roterMsg(item) {
            this.moveNews.$emit("moveState", "指令");
            this.$router.push({
                name: "NoticeDetail",
                params: {
                    data: item,
                    name: this.tab_active == 0 ? this.$t("buy_021") : this.$t("buy_021")
                }
            });
        },
        read_all() {
            let params = {
                type: this.tab_active,
                id: "",
                ptype: 1
            };
            readmsg(params).then(res => {
                this.$toast(this.$t("other_006"));
                this.getList();
            }).catch(e => {
                this.$toast(this.$t("other_007"));
            });
        },
        onLoad() {
            this.finished = false;
            this.loading = true;
            this.getList();
        },
        getList() {
            this.loading = true;
            msglist({ type: this.tab_active }).then(res => {
                if(res.num1 != 0 || res.num2 != 0){
                    sessionStorage.setItem("newsStatus","1");
                }else{
                    sessionStorage.setItem("newsStatus","0");
                }
                this.noticArry[0].title = " 系统公告"+'('+res.num2+')';
                this.noticArry[1].title = " 站内信"+'('+res.num1+')';
                this.loading = false;
                if(this.curIndex == 0){
                    this.list = res.tip
                }else if(this.curIndex == 1){
                    this.list = res.msg
                }
                this.finished = true;
                // list.sort((a, b) => {
                //     return a.time > b.time ? -1 : 1;
                // });
            })
            .catch(err => {
                this.loading = false;
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.detailDetail {
    padding: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #f2f2f2;
    -webkit-overflow-scrolling: touch;
    .msg-main {
        flex: 1;
        overflow: auto;
        // margin: 20px 0;
    }
    .item-box {
        padding: 20px 0px;
        .item-wrap {
            padding: 37px 23px;
            background-color: #ffffff;
            // border-radius: 20px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            box-shadow: 0.06rem 0.06rem 0.1rem #e0e0e0;
            .left {
                flex-basis: 18%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                img {
                    width: 93px;
                    border-radius: 50%;
                }
                .redIcon {
                    width: 20px;
                    height: 20px;
                    float: left;
                    background: red;
                    border-radius: 50%;
                    font-size: 0;
                    position: absolute;
                    top: 10px;
                    right: 5px;
                }
            }
            .right {
                width: 80%;
                flex-basis: 80%;
                .adver_content {
                    width: 100%;
                    float: left;
                    font-size: 0.28rem;
                    .adver_title{
                        float: left;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .adver_time{
                        font-size: 24px;color: #8c8c8c;
                    }
                }
                .adver_descr{
                    width: 100%;
                    float: left;
                    margin-top: 6px;
                    color: #8c8c8c;
                    font-size: 0.28rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .adver_img{
                    width: 42px;
                    height: 42px;
                    float: left;
                }
            }
        }
    }
    ::v-deep {
        .van-tag {
            position: absolute;
            top: 2px;
            padding: 0;
            border-radius: 100%;
            text-align: center;
            display: block;
            right: 1.04rem;
            width: 18px;
            line-height: 18px;
            height: 18px;
        }
        .van-tab--active{
            color: #fe8c00 ;
        }
        .van-tabs__line {
            width: 0.8rem !important;
            background-color: #fe8c00 ;
        }
    }
}
</style>
