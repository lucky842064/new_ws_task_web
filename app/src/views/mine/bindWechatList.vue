<template>
    <div class="task_warp">
        <page-header style="position: fixed;top: 0;left: 0; z-index: 9;" title="微信管理" :show-icon="true"></page-header>
        <div class="task_content">
            <van-pull-refresh v-model="showLoading" @refresh = "downRefresh">
                <van-loading size="24px" slot="pulling">加载中...</van-loading>
                <van-loading size="24px" slot="loosing">松开立即刷新</van-loading>
                <van-loading size="24px" slot="loading">加载中...</van-loading>
                <van-list v-model="moreLoading" :finished="hidefinished" :immediate-check="false" :offset = "10" finished-text = "没有更多了"  @load = "pullupload">
                    <van-loading size="24px" slot="loading">加载中</van-loading>
                    <div class="task_list_warp" id="list-content">
                        <div class="task-list" v-for="(item,index) in taskList" :key="index">
                            <div class="source_head">
                                <span>已加粉：{{item.work_num}} 人</span>
                                <span>任务微信：{{item.wx}}</span>
                            </div>
                            <div class="source_content">
                                <img src="../../assets/images/mine/wechat_icon.png" alt="">
                                <div class="source_title">
                                    <div class="wechat_i">微信编号:{{item.work_id}}</div>
                                    <div class="wechat_i">任务收益: <span class="money_sgin">￥<span class="money_num">{{getEarnPoint(item.work_point)}}</span></span></div>
                                    <!-- <span class="wechat_i">微信ID：{{item.work_id}}</span> -->
                                    <!-- <span class="wechat_i"><span>￥</span> 任务收益{{item.work_point}}</span> -->
                                </div>
                            </div>
                            <div class="source_btn">
                                <van-button v-if="item.status == 3" :class="item.do_status == 3 ? 'cancel_class':'start_class' ">
                                    <span v-if="item.do_status == 0">禁用</span>
                                    <span v-if="item.do_status == 1">正常</span>
                                </van-button>
                                <van-button v-else disabled class="examin_wechat">
                                    <span v-if="item.status == 1">待审核</span>
                                    <span v-else-if="item.status == 2">已拒绝</span>
                                    <span v-else-if="item.status == 4">禁用</span>
                                </van-button>
                            </div>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
            <div class="empoty_area">
                <van-button @click="addNewWechat">添加新的微信</van-button>
                <van-button @click="goTask">去做任务</van-button>
            </div>
        </div>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
import { fmoney } from "../../utils/tool";
import { wxaccountlist,dowxaccount} from "@/api/user";
export default {
    name: "buy",
    components: { PageHeader},
    data() {
        return {
            show:false,
            page:1,
            title:"提示",
            limit:10,
            typeLen:0,
            stateLen:0,
            totalPage:0,
            pageStart : 0, // 开始页数
            pageEnd : 0, // 结束页数
            pageCount: 0,
            allType:false,
            allStatus:false,
            taskList:[],
            dialogContent:"每个任务都有时限，请在规定的时间内提交任务！",
            historyArry:["01","02","03","04","02","03","02","01","01"],
            taskStatus:[
                {name:"青铜会员",checked:false},
                {name:"白银会员",checked:false},
                {name:"黄金会员",checked:false},
                {name:"钻石会员",checked:false},
                {name:"至尊会员",checked:false}
            ],
            taskType:[
                {name:"微信群",checked:false}
                // {name:"朋友圈",checked:false},
                // {name:"短信",checked:false}
            ],
            showLoading:false,
            moreLoading:false,
            hidefinished:false,
        };
    },
    mounted(){
        // let winHeight = document.documentElement.clientHeight;
        // document.getElementById('list-content').style.minHeight = (winHeight - 110) +'px'
        this.initWechatList()
    },
    methods: {
         initWechatList(done) {
            let that = this;
            let params = {
                page:this.page,
                limit:this.limit,
            }
            wxaccountlist(params).then(res => {
                this.taskList = res.list || [];
                this.pageCount = Math.ceil(res.total / this.limit) || 0; //总页数
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
            this.initWechatList()
        },
        // 上拉加载
        pullupload() {
            this.page++;
            let params = {
                page:this.page,
                limit:this.limit,
            }
            if(this.page <= this.pageCount){
                wxaccountlist(params).then(res => {
                    for(let i =0;i<res.list.length;i++){
                        this.taskList.push(res.list[i]);
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
        // 开启/关闭微信号
        confirmBtn(val){
            this.page = 1;
            let params = {
                work_id:val.work_id,
                do_status:val.do_status == 0 ? 1 : 0
            }
            dowxaccount(params).then(res => {
               this.initWechatList()
            });
        },
        // 格式化金额
        getEarnPoint(point) {
            return fmoney(point,2);
        },
        // 添加新微信
        addNewWechat(){
            this.$router.push("/bindWechat");
        },
        // 做任务
        goTask(){
            this.$router.push("/home");
        }
    },
    watch: {
        // taskList(val, newVal) {
        //     this.$nextTick(()=>{
        //         this.$refs.scroll.scroll.refresh();
        //     })
        // }
    }
};
</script>
<style lang="scss" scoped>
    .task_warp, .task_content, .task_list_warp, .task-list, .source_head, .source_img{width: 100%;float: left;}
    .task_warp{height:100vh;overflow: hidden; background-color: #f2f2f2;-webkit-overflow-scrolling: touch;box-sizing: border-box;}
    .task_content{height: 100%;overflow-x: hidden; overflow-y: auto; padding-bottom: 60px;margin-top: 90px;box-sizing: border-box;}
    .task_list_warp{width: 100%;float: left;padding: 29px 30px 0 30px;box-sizing: border-box;}
    // 任务列表
    .task-list{width: 100%;padding: 0 20px 16px 20px; margin-bottom: 20px;border-radius: 8px;background-color: #fff;}
    .source_head{width: 100%;padding: 16px 0; font-size: 0.24rem;border-bottom: 1px solid #efefef;margin-bottom: 16px;color: #8c8c8c;}
    .source_head span{width: 36%; float: left;  overflow: hidden; text-overflow:ellipsis;white-space: nowrap;}
    .source_head span:nth-child(1){width: auto; float: left;margin-right: 20px;}
    .source_head span:nth-child(2){width: 3rem;float: right;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
    // .source_head span:nth-child(3){width: 28%;}
    .source_type img{display: block; width: 100%;}
    .source_content{width: 4.8rem; float: left; font-size: 0.26rem;}
    .source_content img{float: left;width: 90px;margin-right: 30px;}
    .source_title{width: 3rem; float: left;}
    .source_title .wechat_i:nth-child(1){margin-top: 6px;}
    .source_title .wechat_i, .source_title .wechat_g{float: left;}
    .source_title .wechat_i{width: 100%;float: left;}
    .wechat_i .money_sgin, .wechat_i .money_num{color: #fe023d;font-size: 0.18rem;}
    .wechat_i .money_num{font-size: 0.28rem;font-weight: 550;}
    .source_btn{float: right; }
    .source_btn .start_class, .source_btn .cancel_class, .source_btn .examin_wechat{width: 1.46rem;float: right;color: #09b507; padding: 0;height: 0.52rem;text-align: center;line-height: 0.52rem;margin-top: 20px;background-color: transparent;border-color: transparent;}
    .source_btn .cancel_class{color: #ee0a24;}
    .source_btn .examin_wechat{color: #ff976a;}
    // 任务为空时
    .empoty_area{ width: 100%;float: left;margin-top: 50px; text-align: center;padding: 0 30px;box-sizing: border-box;margin-bottom: 90px;}
    .empoty_area .van-button{display: block;width: 100%;border-radius: 8px; background-color: #fd6728; border-color: #fd6728;margin: 0 auto; color: #fff;font-size: 0.32rem;}
    .empoty_area .van-button:nth-child(2){width: auto; background-color: transparent;border-color: transparent;text-decoration: underline;color: #fd6728;}
    // .loading-wrapper {width: 100%;height: 80px;font-size: 0.3rem;text-align: center;line-height: 80px;float: left;}
</style>
