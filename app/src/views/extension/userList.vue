<template>
    <div class="userList">
        <div class="head_class">
            <page-header :title="title" :show-icon="true"></page-header>
            <div class="mobile_class">
                <van-cell-group>
                    <van-field v-model="nextPhone" placeholder="请输入下级手机号码"  right-icon-class="font-size: 28px;" right-icon="search" :border="false" />
                </van-cell-group>
                <span class="search_btn" @click="searchBtn"></span>
            </div>
        </div>
        <div class="user_content" v-if="userData.length > 0">
            <van-pull-refresh v-model="showLoading" @refresh = "downRefresh">
                <van-loading size="24px" slot="pulling">加载中...</van-loading>
                <van-loading size="24px" slot="loosing">松开即可更新</van-loading>
                <van-loading size="24px" slot="loading">更新中...</van-loading>
                <van-list v-model="moreLoading" :finished="hidefinished" :immediate-check="false" :offset = "10" finished-text = "没有更多了"  @load = "pullupload">
                    <van-loading size="24px" slot="loading">加载中</van-loading>
                    <div class="user_list_warp">
                        <div class="user_warp" v-for="(item,index) in userData" :key="index">
                            <div class="user_list">
                                <img class="user_img" src="../../assets/images/head/0.png" alt="">
                                <div class="user_info">
                                    <div class="account_mes">帐号：{{item.user_key}}</div>
                                    <div class="time_mes">
                                        <span>团队人数：{{item.under_count}}人</span>
                                        <span>邀请码：{{item.user_code}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
        <div v-else class="empty_content">暂无数据</div>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
import { teamlist } from "@/api/earn";
export default {
    name: "buy",
    components: { PageHeader},
    data() {
        return {
            title:"下级用户列表",
            nextPhone:"",
            pullIndex:-1,
            scroll:false,
            user_code:-1,
            pageCount:0,
            page:1,
            limit:20,
            userData:[],
            accountList:["01","02","03","04"],
            showLoading:false,
            moreLoading:false,
            hidefinished:false,
        };
    },
    created() {
        // this.title = this.$route.meta.title;
        this.userList();
    },
    methods: {
        userList(done) {
            let params = {
                phone_no:this.nextPhone,
                // user_code:"",
                page:this.page,
                limit:this.limit,
            }
            teamlist(params).then(res => {
                let backUser = res.list || []
                this.pageCount = Math.ceil(res.total / this.limit) || 0; //总页数
                for(let i =0;i<backUser.length;i++){
                    backUser[i].check = false;
                }
                this.userData = backUser;
                setTimeout(()=>{
                    this.moreLoading = false;
                    this.showLoading = false;
                    this.hidefinished = false;
                },500)
            });
        },
        // 下拉刷新
        downRefresh(){
            this.page = 1;
            this.userList()
        },
        // 上拉加载
        pullupload() {
            this.page++;
            let params = {
                phone_no:this.nextPhone,
                // user_code:"",
                page:this.page,
                limit:this.limit,
            }
            if(this.page <= this.pageCount){
                teamlist(params).then(res => {
                    for(let i =0;i<res.list.length;i++){
                        this.userData.push(res.list[i]);
                    }
                    setTimeout(()=>{
                        this.moreLoading = false;
                    },500)
                });
            }else{
                setTimeout(()=>{
                    this.hidefinished = true;
                },500)
            }
        },
        pullChange(val){
            for(let i =0;i<this.userData.length;i++){
                if(this.userData[i].user_key == val.user_key){
                    if(val.check == true){
                        this.userData[i].check = false;
                    }else {
                        this.userData[i].check = true;
                    }
                }else{
                    this.userData[i].check = false;
                }
            }
        },
        copaySucess(){
            this.$toast(`${this.$t("home_031")}${this.$t("other_006")}`);
        },
        nextLevelBtn(){
            this.$router.push("/levelList");
        },
        // 搜索
        searchBtn(){
            console.log("222");
            this.userData = [];
            this.page = 1;
            this.userList();
        }
    }
};
</script>
<style>
    .mobile_class .van-cell__value{
        background-color: #f2f2f2;
        padding: 5px 12px;
        border-radius: 5px;
    }
</style>
<style lang="scss" scoped>
    .userList{max-width: 1000px;position: relative;}
    // .task_content {width: 100%;float: left;position: relative;}
    .head_class{width: 100%;height: 200px;position: relative; top: 0;left: 0; z-index: 999; }
    .mobile_class{width: 100%;background-color: #fff;}
    .search_btn{width: 65px; height: 65px; float: left; position: absolute; top: 110px; right: 45px;}
    .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{ border-width:0; }

    // 内容列表
    .user_content{width: 100%;height: calc(100vh - 200px);overflow: hidden;font-size: 0.28rem;overflow-y: auto;-webkit-overflow-scrolling: touch; position: absolute;top: 220px;left: 0;background-color: #f2f2f2;}
    .user_list_warp{ width: 100%;float: left; padding: 0 30px; margin-top: 30px; box-sizing: border-box; }
    .user_warp, .user_list{width: 100%; float: left;box-sizing: border-box;}
    .user_list{border-radius: 10px; padding: 20px 20px;margin-bottom: 20px;background-color: #fff;}
    .user_img{width: 120px;height: 120px;float: left; border-radius: 50%;}
    .user_info{width: 80%;float: left;padding-left: 20px;box-sizing: border-box;}
    .account_mes{width: 100%;float: left;margin-top: 10px;}
    .time_mes{width: 100%;float: left;margin-top: 20px;}
    .time_mes span:nth-child(2){margin-left: 30px;}
    .empty_content{ width: 100%;float: left;padding: 20px 0;margin-top: 200px; text-align: center;font-size: 0.28rem; }
</style>
