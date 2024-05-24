<template>
    <div class="task_examine" :class="taskType == 1 ? 'task_examine_active':''">
        <page-header style="position: fixed;top: 0;left: 0; z-index: 9;" :hide="true" :title="title" :show-icon="true"></page-header>
        <div class="powder_content" :class="taskType == 1 ? 'task_content':''">
            <div v-if="taskType != 1" class="task_status">
                <span>任务状态 : 进行中</span>
                <span style="margin-left:12px;">登陆状态 : <span :style="{color: onlineStatus==0?'#999':'#07c160'}">{{onlineStatus==0?'离线':'在线'}}</span></span>
            </div>
            <div class="task_title" :class="taskType == 1 ? 'powder_title':''">
                <span class="left_title"><img src="../../assets/images/buy/wexin_icon.png" alt=""><span>微信编号:{{wechat_id}}</span></span>
                <span class="left_title right_title" v-if = "taskType == 1 "><span class="wechat_code">任务微信:{{wechatNum}}</span></span>
                <span class="left_title right_title" v-else><span class="wechat_code">微信号:{{wechatNum}}</span></span>
            </div>
        </div>
        <div class="tab_class" v-if="taskType == 1">
            <div class="promote-header">
                <div class="tab_nav" @click="pulldownState">
                    <span v-if = "lableName === ''">请选择标签类型</span> 
                    <span v-else>{{ lableName }}</span> 
                    <van-icon class="down_img" name="arrow-down" style="transition: all 200ms linear" :style="{ transform: `rotate(${showState ? 180 : 0}deg)`}" />
                </div>
                <div accordion class="down_list" v-show="showState">
                    <ul>
                        <li :class="item.tag_name == lableName ? 'active':''" v-for="(item,index) in lableList" :key="index" @click="changeLable(item)">{{item.tag_name}}({{item.fan_num}})</li>
                    </ul>
                </div>
            </div>
            <!-- <van-button class="speeedy_change" @click="randmBtn">快捷勾选</van-button> -->
            <span class="tips_text" v-if="minLen != maxLen">勾选{{minLen}}-{{maxLen}}个已加粉资源可申请加粉</span>
            <span class="tips_text" v-else>勾选{{minLen}}个已加粉资源可申请加粉</span>
            <van-checkbox class="clock_text" checked-color="#fd6526" v-model="isClock" shape="square" @change="clockChange">启用闹钟</van-checkbox>
        </div>
        <!-- <div class="task_text" style="padding-top:0; color:#ff013d;" v-else>至少需要完成{{minNum}}个资源验粉</div> -->
        <div class="task_text" style="padding-top:0;" v-else>
            <!-- <van-button type="info" @touchstart="gotouchstart" @touchmove="gotouchmove" @touchend="gotouchend" @click="down_btn(0)">vcf下载</van-button> -->
            <van-button type="info" @click="gotouchstart" v-clipboard:copy="vcf_url">{{$t('buy_089')}}</van-button>
            <van-button type="info" class="csv_down" @click="gotouchstart" v-clipboard:copy="csv_url">{{$t('buy_090')}}</van-button>
            <!-- <van-button class="copay_text"
                v-clipboard:copy="userInfo.user_code"
                v-clipboard:success="clipboardSuccessHandler">
                {{$t('earn_041')}}
            </van-button> -->
            <div class="change_country">
                <!-- <van-popover v-model="showPopover" trigger="click" :actions="actions" @select="selectCode" >
                    <template #reference>
                        <van-button icon="arrow-down" icon-position="right" type="primary">{{country_code || $t('buy_091')}}</van-button>
                    </template>
                </van-popover> -->
                <van-button type="info" @click="showProvince = true" >{{country_code}}</van-button>
            </div>
            <van-button :disabled="country_code=='选择省份'" type="primary" class="csv_down scan_code" @click="sign_btn">{{$t('buy_096')}}</van-button>
            <!-- <download-excel class = "down_vsf_btn" :fields = "csvFields" :data = "csvData" worksheet = "My Worksheet" type = "csv" :name="'任务'+task_id+'.xls'">
                
            </download-excel> -->
        </div>

        <div class="history_recors_warp">
            <div class="history_content" v-if="taskType == 0">
                <ul class="history_recors_title">
                    <li>序号</li>
                    <li v-if="taskType == 1">手机号码</li>
                    <li v-else>手机号码(点击复制)</li>
                    <li>申请状态</li>
                </ul>
                <div class="history_recors">
                    <ul class="history_list" v-for="(iten,index) in taskList" :key="index">
                        <li>{{index+1}}</li>
                        <li>
                            <span class="wechat_color"  :style="copyIphone == iten.phone_no ? 'color:#f56c6c;':''">{{iten.phone_no}}</span>
                            <van-button class="copay_phone" v-clipboard:copy="iten.phone_no" v-clipboard:success="copayContent" @click="copyBtn(iten.phone_no)">
                                <img class="copay_icon"  src="../../assets/images/buy/icon_fuzi.png" alt="">
                            </van-button>
                        </li>
                        <li>
                            <template v-if="iten.status == 0">
                                <van-button style="background:#629ffc;border-color:#629ffc;" class="join_group" @click="joinTaskBtn(iten,0,index)">提交</van-button>
                                <van-button style="background:#fe8c00;border-color:#fe8c00;" class="join_group" @click="joinTaskBtn(iten,1,index)">上报异常</van-button>
                            </template>
                            <template v-if="iten.status == 1">
                                <span class="give_task">异常资源</span>
                                <!-- <van-button class="give_task">异常资源</van-button> -->
                            </template>
                            <template v-if="iten.status == 2">
                                <span class="examine_task">审核中</span>
                                <span class="success_table">标签: {{iten.tag_name}}</span>
                            </template>
                            <template v-if="iten.status == 3 ">
                                <span class="success_task">已完成</span>
                                <span class="success_table">标签: {{iten.tag_name}}</span>
                            </template>
                            <template v-if="iten.status == 4 ">
                                <span class="error_task">审核失败</span>
                            </template>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="group_warp" v-else>
                <div class="" v-for="(lable,key) in taskList" :key="key">
                    <div class="group_head">
                        <ul>
                            <li>
                                <img  @click="allChange(lable,key)" :src="require(`../../assets/images/buy/check${lable.checked == false && lable.checkLen == '' ? 0 : lable.check == false && lable.checkLen > 0  ? 1:2}.png`)" class="check_image" />
                                <span class="check_name">分组标签:{{lable.tag_name}}</span>
                            </li>
                            <li>已选:<span style="color:#fd6526;"> {{lable.checkLen || 0}}</span>/{{lable.phone_num}}</li>
                            <!-- <li @click="allChange(lable,key)"> 
                                <span class="check_name">快速勾选</span>
                            </li> -->
                            <li @click="downChange(lable)" @click.stop>
                                <van-icon class="down_img" name="arrow-down" style="transition: all 200ms linear" :style="{ transform: `rotate(${lable.check ? 180 : 0}deg)`}" />
                            </li>
                        </ul>
                    </div>
                    <template v-if="lable.check" @click.stop>
                        <div class="group_list" v-for="(item,index) in lable.tag_data" :key="index" @click="joinGroupbtn(item,index,key)" @click.stop>
                            <!-- <span class="solt_icon">{{index+1}}</span> -->
                            <ul class="group_content">
                                <li>任务ID：{{item.task_id}}</li>
                                <li>验粉时间：{{item.task_time}}</li>
                                <li>资源手机号：{{item.phone_no}}</li>
                            </ul>
                            <span :class="item.check == true ? 'check_active' :''"></span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <van-action-sheet v-model="isCancel" style="border-radius: 0;" :actions="anomoalList" cancel-text="取消" @select = "selectChange" />
        <div class="footer_submit" v-if="taskType == 1">
            <van-button class="order_submit_btn" @click="submitBtn">提交审核</van-button>
        </div>
        <!-- 选择标签类型底部 -->
        <div style="transition: all 200ms linear" class = "tab_cover" v-show = "showState" @click="hideLable"></div>
        <popDialog ref="showAuditModel" :title="title" titleContent="" :isCancel="false" :isConfirm="true" @confirm_btn="confirm_btn">
			<template v-slot:content>
                <div v-show="isQrText" class="qr_tips">{{$t('buy_0109')}}</div>
                <div class="qr_tips">已选择 {{country_code}},请确保所选地区和手机微信所在省份地区一致</div>
                <div class="qr_img">
                    <vue-qr :text="qr_url" colorDark="#000" colorLight="#fff" :logoScale="0.2" :size="300"></vue-qr>
                </div>
			</template>
		</popDialog>
        <van-popup
        v-model="showProvince"
        position="bottom"
        :style="{ height: '300px' }"
        >
            <van-picker
                title="选择省份"
                show-toolbar
                :columns="actions"
                @confirm="onConfirm"
                @cancel="showProvince = false"
                />
        </van-popup>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
import { getgrouptask} from "@/api/user";
import { reqfriendtask,dofriendtask,applygrouptask,worktaglist,setAlarmClock,cancelAlarmClock,openIosClick,cancelIosClick,gettableurl,getpadstate,getpadqrcode } from "@/api/task";
import { timetamp} from "@/utils/tool";
import Global from "../../core/Global";
import {Toast} from 'vant'
import vueQr from 'vue-qr';

export default {
    name: "buy",
    components: { PageHeader},
    data() {
        return {
            copyIphone:"",
            dateState:"",
            tableName:"",
            showState:false,
            isCancel:false,
            isClock:true,
            lableName:"",
            friendListNum:-1,
            checkedCities:[],
            groupIndex:"",
            anomoalList:[
                {name:'加粉拒绝',value:0},
                {name:'查无微信号',value:1},
                {name:'其他原因',value:2}
            ],
            lableList:[],
            showMask:false,
            mobile:"",
            task_id:"",
            taskType:"",
            taskID:"",
            wechat_id:"",
            groupWechat_id:"",
            wechatNum:"",
            sourceName:"",
            minNum:0,
            page:1,
            limit:999,
            minLen:0,
            maxLen:0,
            taskList:[],
            mobileLen:[],
            mobileStr:"",
            curMobile:"",
            tipsHead:"提交异常",
            dialogContent:"",
            clockHour:0,
            clockMinute:0,
            sClockHour:0,
            eClockMinute:0,

            showPopover:false,
            actions: [
                { text: '北京'},{ text: '天津'},{ text: '上海'},{ text: '重庆'},{ text: '河北'},{ text: '山西'},{ text: '辽宁'},{ text: '吉林'},{ text: '黑龙江'},{ text: '江苏'},{ text: '浙江'},{ text: '安徽'},{ text: '福建'},{ text: '江西'},{ text: '山东'},{ text: '河南'},{ text: '湖北'},{ text: '湖南'},{ text: '广东'},{ text: '海南'},{ text: '四川'},{ text: '贵州'},{ text: '云南'},{ text: '陕西'},{ text: '甘肃'},{ text: '青海'},{ text: '台湾'},{ text: '内蒙古'},{ text: '广西'},{ text: '西藏'},{ text: '宁夏'},{ text: '新疆'},{ text: '香港'},{ text: '澳门'},{ text: '马来西亚'},{ text: '泰国'}
            ],
            country_code: '选择省份',
            vcf_url:"",
            csv_url:"",
            onlineStatus: '',
            qr_url:"",
            selectProvince: '',
            showProvince: false,
        };
    },
    created() {
        if(this.$route.query.taskType != 1){
            this.title = "申请加粉任务";
            this.task_id = this.$route.query.task_id;
            this.wechatNum = this.$route.query.wechatNum;
            this.initWechatTask();
        }else{
            this.title = "申请加粉任务";
            this.task_id = this.$route.query.task_id;
            this.taskType = this.$route.query.taskType;
            this.wechat_id = this.$route.query.wechat_id;
            this.wechatNum = this.$route.query.wechatNum;
            this.initLable();
            this.initGroupTask();
            if(sessionStorage.getItem("clockState") != null){
                this.isClock = sessionStorage.getItem("clockState") == "true" ? true:false;
            }
        }
        if(sessionStorage.getItem("copyIphone") != null){
            this.copyIphone = sessionStorage.getItem("copyIphone")
        }
        this.friendStatis()
        this.setIntervalId = window.setInterval(() => {
            this.friendStatis()
        }, 10*1000)
    },
    beforeDestroy(){
        window.clearInterval(this.setIntervalId)
    },
    methods: {
        onConfirm(item){
            this.country_code = item.text
            this.showProvince = false
        },
        syncInitApi(){
            // let params = {task_order:Number(this.task_id),table_type:idx==1?'csv':'vcf'}
            // gettableurl(params).then(res => {
            //     this.vcf_url = res.download_url;
            // });
            let groupipList= new Promise((resolve,reject)=>{
                gettableurl({task_order:Number(this.task_id),table_type:'vcf'}).then(res =>{
                    resolve(res.download_url)
                })
            });
            let allselfApilist= new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    gettableurl({task_order:Number(this.task_id),table_type:'csv'}).then(res =>{
                        resolve(res.download_url)
                    })
                },500)
            });
            Promise.all([groupipList,allselfApilist]).then( res => {
                this.vcf_url = res[0];
                this.csv_url = res[1];
            })
        },
        // 下载
        down_btn(idx){
            let params = {task_order:Number(this.task_id),table_type:idx==1?'csv':'vcf'}
            gettableurl(params).then(res => {
                this.vcf_url = res.download_url;
                // this.$Helper.toOutLink(url)
            });
        },
        friendStatis(){
            getpadstate({wx:this.wechatNum}).then(res => {
                this.onlineStatus = res.ret
            })
        },
        confirm_btn(){
            this.friendStatis();
            this.$refs.showAuditModel.closeModel()
        },
        //获取登录二维码
        async sign_btn(){
            await this.friendStatis();
            if(this.onlineStatus == 0){
                let loadToast = Toast.loading({message:"加载中...",orbidClick: true,duration: 80000,})
                getpadqrcode({wx:this.wechatNum,ip_region:this.country_code}).then(res => {
                    loadToast.clear();
                    this.title = "扫码登录"
                    this.isQrText=res.message!=""?true:false;
                    this.$refs.showAuditModel.showDialog();
                    this.qr_url = res.qr_code_url;
                });
            }else{
                this.$toast(`${this.$t("buy_060")}`);
            }
        },
        selectCode(ele){
			this.country_code = ele.text;
		},
        gotouchstart(){
            this.$toast(`${this.$t("buy_061")}`);
        },
        // 初始化任务列表
        initWechatTask(){
            let params = {
                task_order:Number(this.task_id),
                page:this.page,
                limit:this.limit
            }
            if(sessionStorage.getItem("friendList")==null||sessionStorage.getItem("reloadFriendList")== null||sessionStorage.getItem("reloadFriendList")== -1){
                reqfriendtask(params).then(res => {
                    this.taskList = res.list || [];
                    this.minNum = res.min_num || 0;
                    this.wechat_id = res.work_id;
                    this.taskID = res.task_order;
                    // this.wechatNum = res.wx;
                    sessionStorage.setItem("friendList",JSON.stringify(this.taskList))
                    sessionStorage.setItem("doTypeNum",JSON.stringify(res.do_type))
                    sessionStorage.setItem("taskOrderNum",res.task_order)
                    sessionStorage.setItem("wechatidNum",res.work_id)
                });
            }else{
                this.taskList=JSON.parse(sessionStorage.getItem("friendList"))
                this.taskID=JSON.parse(sessionStorage.getItem("taskOrderNum"))
                this.wechat_id=JSON.parse(sessionStorage.getItem("wechatidNum"))
            }
        },
        // 初始化加粉列表
        initGroupTask(){
            let seaLable = this.lableName.split("(").shift();
            let params = {
                work_id:Number(this.task_id),
                tag_name:seaLable == "全部" ? '':seaLable,
            }
            getgrouptask(params).then(res => {
                this.minLen = res.res_min;
                this.maxLen = res.res_max;
                this.clockHour = res.hour;
                this.clockMinute = res.minute;
                this.sClockHour = res.start_time;
                this.eClockMinute = res.end_time;
                let groupList = res.list || [];
                for(let i = 0;i<groupList.length;i++){
                    groupList[i].check = false;
                    groupList[i].checkLen = 0;
                    groupList[i].checked = false;
                    for(let k = 0;k<groupList[i].tag_data.length;k++){
                        groupList[i].tag_data[k].check = false;
                    }
                }
                this.taskList = groupList;
            });
        },
        copayContent({ value, event }) {
            this.$toast(`${this.$t("home_031")}${this.$t("other_006")}`);
        },
        copyBtn(val){
            this.copyIphone = val;
            sessionStorage.setItem("copyIphone",this.copyIphone)
            // console.log(val);
        },
        // 启用闹钟
        clockChange(val){
            sessionStorage.setItem("clockState",val)
        },
        // 标签列表
        initLable(){
            let params = {
                work_id:Number(this.wechat_id)
            }
            worktaglist(params).then(res => {
                let tablenNum = 0;
                let tabList = res.tag_list || [];
                for(let i = 0;i<tabList.length;i++){
                    tablenNum += tabList[i].fan_num
                }
                let allTable = {tag_name:"全部",fan_num: tablenNum, del: 1}
                tabList.unshift(allTable);
                this.lableList= tabList;
            });
        },
        hideLable(){
            this.showState = false;
        },
        // 选择标签
        changeLable(val){
            this.lableName = val.tag_name+"("+val.fan_num+")";
            this.showState = false;
            for(let i = 0;i<this.taskList.length;i++){
                for(let k=0;k<this.taskList[i].tag_data.length;k++){
                    this.mobileLen = [];
                    this.taskList[i].tag_data[k].check = false;
                }
            }
            this.initGroupTask();
        },
        // 加入审核
        joinTaskBtn(val,idx,indexNum){
            if(idx == 0){
                let taskMess = val;
                taskMess.wechatNum = val.wx;
                taskMess.task_id = this.taskID;
                taskMess.nickName = val.nickName;
                taskMess.wechat_id = this.wechat_id;
                sessionStorage.setItem("reloadFriendList",indexNum)
                this.$router.push({path:'/taskApply',query:{taskMess:JSON.stringify(taskMess)}});
            }else if(idx == 1){
                this.friendListNum=indexNum
                this.mobileStr = val.phone_no
                this.isCancel = true;
            }
        },
        pulldownState(){
            // this.showTime = false;
            this.showState = !this.showState;
        },
        changeType(val){
            this.dateState = val.text;
            setTimeout(() =>{
                this.showState = false;
            },200)
        },
        // 选择异常类型
        selectChange(val){
            let params = {
                status:1,
                phone_no:this.mobileStr,
                task_order:Number(this.task_id),
            }
            dofriendtask(params).then(res => {
                // this.initWechatTask();
                this.taskList[this.friendListNum].status=1
                sessionStorage.setItem("friendList",JSON.stringify(this.taskList))
                this.dateState ="";
                this.isCancel = false;
            });
        },
         // 申请加粉
        submitBtn(){
            if(this.mobileLen.length < this.minLen){
                this.$toast("至少勾选 "+this.minLen+" 个哦~");
                return false;
            }
            if(this.isClock == true){
                if(this.$Helper.isAndroid()||this.$Helper.judgeClient()=='Android'){
                    if(this.clockHour > 0 || this.clockMinute > 0){
                        Global.NativeEvent.setAlarmClock("加粉任务提醒",this.clockHour,this.clockMinute);
                    }
                }else if(this.$Helper.isIos()||this.$Helper.judgeClient()=='ios'){
                    if(this.sClockHour > 0 || this.eClockMinute > 0){
                        Global.NativeEvent.addCalendarNotification("加粉任务提醒","加粉任务",this.sClockHour,this.eClockMinute,0,null);
                    }
                }
                // this.$toast(clickTips);
            }
            let params = {
                work_id:Number(this.wechat_id),
                phone_nos:this.mobileLen
            }
            applygrouptask(params).then(res => {
                this.$toast("任务已提交");
                setTimeout(()=>{
                    this.$router.push("/Buy"); 
                },1000)
            });
        },
        submitGroupBtn(){
           this.$router.push({path:'/taskApply',query:{task_id:this.task_id}}); 
        },
        // 随机添加群审核
        randmBtn(){
            if(this.lableName !=""){
                for(let i = 0;i < this.maxLen;i++){
                    this.taskList[i].check = true;
                    this.mobileLen.push(this.taskList[i].phone_no);
                }
            }else{
              this.$toast("请先选择标签");  
            }
        },
        // randmBtn(){
        //     let items = ['2','3','6'];
        //     let num = items[Math.floor(Math.random()*items.length)];
        //     let checkList = randomArry(this.taskList,num);
        //     for(let i = 0;i<this.taskList.length;i++){
        //         this.taskList[i].check = 0;
        //         for(let k = 0;k<checkList.length;k++){
        //             if(this.taskList[i].phone_no == checkList[k].phone_no){
        //                 this.taskList[i].check = 1
        //             }
        //         }
        //     }
        // },
        // 展开组列表
        downChange(val){
            for(let i = 0;i<this.taskList.length;i++){
                if(this.taskList[i].tag_name == val.tag_name){
                    if(this.taskList[i].check == true){
                        this.taskList[i].check = false;
                    }else{
                       this.taskList[i].check = true;
                    }
                }
            }
        },
        // 全选
        allChange(val,idx){
            for(let i=0;i<this.taskList.length;i++){
                if(i == idx){
                    if(this.taskList[i].checked == true){
                        this.taskList[i].checkLen = 0;
                        this.taskList[i].check = false;
                        this.taskList[i].checked = false;
                        for(let k=0;k<this.taskList[i].tag_data.length;k++){
                            let index = this.mobileLen.indexOf(this.taskList[i].tag_data[k].phone_no);
                            this.taskList[i].tag_data[k].check = false;
                            this.mobileLen.splice(index,1)
                        }
                    }else{
                        if(this.mobileLen.length < this.maxLen){
                            this.taskList[i].check = true;
                            this.taskList[i].checked = true
                            for(let k=0;k<this.taskList[i].tag_data.length;k++){
                                if(i == idx){
                                    if(this.mobileLen.indexOf(this.taskList[i].tag_data[k].phone_no) == -1){
                                        if(this.maxLen > this.mobileLen.length){
                                            this.taskList[i].checkLen = k+1;
                                            this.taskList[i].tag_data[k].check = true;
                                            this.mobileLen.push(this.taskList[i].tag_data[k].phone_no)
                                        }
                                    }
                                }else{
                                    this.taskList[i].tag_data[k].check = false;
                                }
                            }
                        }else{
                            this.$toast("审核任务已达到上限!"); 
                        }
                    }
                }
            }
        },
        // 添加群审核
        joinGroupbtn(val,idx,key){
            for(let i = 0;i<this.taskList.length;i++){
                for(let k=0;k<this.taskList[i].tag_data.length;k++){
                    if(key == i && k == idx){
                        if(this.taskList[i].tag_data[k].check == true){
                            let index = this.mobileLen.indexOf(this.taskList[i].tag_data[k].phone_no);
                            this.taskList[i].checkLen -= 1;
                            this.taskList[i].tag_data[k].check = false;
                            this.mobileLen.splice(index,1)
                            if(this.taskList[i].checkLen == 0){
                                this.taskList[i].checked = false
                            }
                        }else{
                            if(this.mobileLen.length == this.maxLen){
                                this.$toast("审核任务已达到上限!");
                            }else{
                                this.taskList[i].checkLen +=1;
                                this.taskList[i].tag_data[k].check = true;
                                this.mobileLen.push(this.taskList[i].tag_data[k].phone_no)
                            }
                        }
                    }
                }
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.task_examine, .tab_cover{
    width: 100%;
    min-height: 100vh;
    float: left;
    background-color: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 20px;
    .qr_tips{
        color: #f56c6c;
        text-align: center;
        font-size: 14px;
    }
    .qr_img{
        width: 100%;
        padding: 0 30px;
        box-sizing: border-box;
    }
        .powder_content, .task_content{
            width: 100%;
            height: 179px;
            padding: 0 30px;
            margin-top: 90px;
            box-sizing: border-box;
            background-color: darkorange;
            // margin-top: 90px;
            background: url(../../assets/images/buy/powder_bg.png);
            background-size: 100% 100%;
            background-repeat:no-repeat;
            border-bottom: 1px solid #f2f2f2;
            .task_status{
                width: 100%;
                float: left;
                font-weight: 550;
                padding: 45px 0;
                color: #fff;
                text-align: center;
                font-size: 0.32rem;
            }
            .left_title{
                float: left;
                img{
                    width: 34px;
                    float: left;
                    margin-right: 18px;
                    margin-top: 12px;
                }
            }
            .right_title{
                img{
                    width: 30px;
                    margin-top: 10px;
                }
                .wechat_code{
                    width: 2.8rem;
                    float: left;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    margin-left: 42px;
                }
            }
            .powder_title, .task_title{
                width: 100%;
                float: left;
                // margin-top: 120px;
                padding: 30px 36px;
                box-sizing: border-box;
                font-size: 32px;
                margin-bottom: 20px;
                border-radius: 10px;
                background-color: #fff;
                box-shadow: 0 8px 5px -3px #ececec; 
            }
            .powder_title{
                margin-top: 50px;
            }
            .task_time{
                float: left;
                font-size: 0.28rem;
                margin-top: 4px;
                // padding-top: -2px;
            }
        }
        .task_content{
            height: 107px;
            background: url(../../assets/images/buy/group_bg.png);
            background-size: 100% 100%;
            background-repeat:no-repeat;
        }
        .task_text, .tab_class{
            width: 100%;
            float: left;
            font-size: 0.26rem;
            padding: 25px 30px 20px 40px;
            box-sizing: border-box;
            .tips_text{
                height: 51px;
                float: left;
                color: #f90101;
                line-height: 51px;
                margin: 10px 0 0 20px;
            }
            .clock_text{
                float: right;
                margin: 15px 20px 0 0;
            }
            .join_group{
                width: 2.3rem;
                float: right;
                font-size: 0.24rem !important;
                border-radius: 8px;
            }
        }
        .task_text{
            .van-button{
                padding: 5px 8px;
                height: initial;
            }
            .csv_down{
                margin-left: 20px;
            }
            .change_country{
                display: inline-block;
                margin-left: 20px;
                .van-popover__wrapper{
                    // width: 90px;
                    height: 100%;
                    margin-left: 0;
                    .van-button--normal{
                        width: 92px;
                        padding: 5px 8px;
                        height: 100%;
                        // background: transparent;
                        // border-color: transparent;
                        .van-button__text{
                            // color: #000;
                            width: 100%;
                            margin-left: 0;
                        }
                    }
                    .van-button::before{
                        background: transparent;
                        border-color: transparent;
                    }
                }
            }
            .scan_code{
                float: right;
            }
        }
        .tab_class{
            position: relative;
            z-index: 3;
            padding: 0 30px 20px 30px;
            .promote-header {
                width: 100%;
                float: left;
                color: #7e7e7e;
                font-size: 0.28rem;
                display: flex;
                flex-direction: row;
                padding: 0 30px;
                position: relative;
                z-index: 3;
                background-color: #fff;
                // background-color: darkblue;
                .tab_nav {
                    flex: 1;
                    padding: 20px 0;
                    text-align: center;
                    span{
                        float: left;
                    }
                    .down_img {
                        float: right;
                        width: 30px;
                        vertical-align: middle;
                        margin-top: 6px;
                    }
                }
                .down_list{
                    width: 100%;
                    max-height: 360px;
                    overflow-y: auto;
                    float: left;
                    padding: 0 30px;
                    box-sizing: border-box;
                    position: absolute;
                    top: 82px;
                    left: 0;
                    z-index: 1;
                    background-color: #fff;
                    box-shadow: 0 8px 6px -3px #ececec;  
                    ul li{
                        padding: 15px 0;
                        box-sizing: border-box;
                        border-bottom: 1px solid #e1e1e1e1;
                    }
                    ul li:last-child{
                        border-bottom: 0px solid transparent;
                    }
                    .active{
                        color: red;
                    }
                }
            }
        }
        .source_title{
            width: 100%;
            font-size: 28px;
            font-weight: 550;
            margin: 27px 0 12px 0;
            padding-left: 32px;
        }
        .history_recors_warp{
            width: 690px;
            display: table;
            margin: 0 auto;
            margin-bottom: 160px;
        }
        .history_content, .group_warp{
            width: 100%;
            float: left;
            border: 1px solid #d1d1d1;
            border-bottom: 1px solid transparent;
            .history_recors_title, .history_list{
                li{
                    height: 50px;
                    float: left;
                    line-height: 50px;
                    text-align: center;
                    font-size: 0.24rem;
                    border-bottom: 1px solid #d1d1d1;
                    border-left: 1px solid #d1d1d1;
                    .wechat_color{
                        float: left;
                        // color:#08a01a;
                        margin-left: 34px;
                    }
                    .short_color{
                        color:#85aeee;
                    }
                    .friend_color{
                        color:#793aeb;
                    }
                    .copay_phone{
                        width: auto;
                        border: none;
                        float: left;
                        margin: 18px 0 0 16px;
                        margin-left: 16px;
                        margin-top: 18px;
                    }
                    .copay_icon{
                        display: table;
                        width: 18px;
                        height: 18px;
                    }
                }
                li:nth-child(1){
                    width: 10%;
                    border-left: 1px solid transparent;
                }
                li:nth-child(2){
                    width: 38%;
                }
                li:nth-child(3){
                    width: 52%;
                }
            }
            .history_list{
                li{
                    height: 80px;
                    line-height: 80px;
                }
            }
        }
        .group_warp{
            border: 0px solid transparent;
            .group_head{
                width: 100%;
                float: left;
                font-size: 0.24rem;
                padding: 12px 20px 3px 20px;
                border-radius: 10px; 
                margin-bottom: 10px;
                background-color: #fff;
                ul{
                    li{
                        line-height: 0;
                        padding: 17px 0;
                        width: 45%;
                        float: left;
                        .check_image{
                            width: 38px;
                            height: 38px;
                            float: left;
                        }
                        .check_name{
                            width: 240px;
                            float: left;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            padding: 18px 0 18px 12px;
                        }
                    }
                    li:nth-child(2){
                        width: 35%;
                        line-height: 0;
                        padding: 34px 0 34px 45px;
                    }
                    li:last-child{
                        width: 20%;
                        float: right;
                        padding: 24px 12px 24px 0;
                        .van-icon{
                            float: right;
                        }
                    }
                }
                // ul li:nth-child(2){
                //     margin-left: 35px;
                // }
                // ul li:last-child{
                //     float: right;
                // }
            }
            .group_list{
                position: relative;
                width: 100%;
                float: left;
                border-radius: 8px;
                font-size: 0.28rem;
                margin-bottom: 20px;
                padding: 15px 0;
                background-color: #ffffff;
                .solt_icon{
                    width: 56px;
                    height: 60px;
                    line-height: 62px;
                    color: #630403;
                    background-image: url("../../assets/images/buy/plain_icon.png");
                    background-size: 100% 100%;
                    position: absolute;
                    top: 9px;
                    left: -6px;
                    text-align: center;
                }
                .check_active{
                    width: 66px;
                    height: 59px;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    background-image: url("../../assets/images/buy/plain_active.png");
                    background-size: 100% 100%;
                }
                .group_content{
                    float: left;
                    margin-top: 6px;
                    margin-left: 20px;
                    li{
                        margin-bottom: 5px;
                    }
                }
            }
        }
    .join_group, .give_task, .examine_task, .success_task, .error_task, .speeedy_change{
            width: 180px;
            height: 0;
            font-size: 0.24rem;
            background-color: transparent;
            border-color: transparent;
        }
        .join_group{
            width: 150px;
        }
        .give_task{
            width: 100%;
            color: #000000;
        }
        .examine_task{
            color: #f30000;
            width: auto;
            float: left;
            height: 80px;
            margin-left: 60px;
            line-height: 80px;
        }
        .success_task{
            width: auto;
            float: left;
            height: 80px;
            margin-left: 60px;
            line-height: 80px;
            color: #0cae1d;
            // background-color: violet;
        }
        .success_table{
            width: 180px;
            padding-left: 10px;
            text-align: left;
            float: left;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            // background-color: violet;
        }
        .join_group:nth-child(2){
            margin-left: 12px;
        }
        .speeedy_change{
            color: #fff;
            float: right;
            padding: 37px 0;
            background-color:#629ffc;
            border-color:#629ffc;
        }
}
.tab_cover{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    background-color: rgba(0,0,0,.1);
}
.task_examine_active{
    background-color: #f2f2f2;
}
.dropdown_warp{
    display: block;
    width: 100%;
    position: relative;
    margin-bottom: 0.4rem;
}
.order_submit_btn {
    display: table;
    margin: 0 auto;
    color: #7e7e7e;
    font-size: 0.32rem;
    background-color: #fff;
    // background-color: darkblue;
    .singular_tips{
        width: auto;
        float: left;
        color: #000;
        padding: 18px 0;
        margin-right: 20px;
    }
}
.checkActive{
    color: #ff5a7a;
}
.footer_submit{
    width: 100%;
    height: 140px;
    padding: 0 30px;
    box-sizing: border-box;
    float: left;
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #f2f2f2;
}
.order_submit_btn{
    width: 100%;
    height: 88px;
    color:#ffffff;
    font-size: 0.32rem;
    border-radius: 8px;
    border-color: #fd6526;
    background-color: #fd6526;
}
</style>
<style>
    .clock_text .van-checkbox__icon{
        height: auto;
    }
    .clock_text .van-checkbox__icon .van-icon{
        width: 0.38rem;
        height: 0.38rem;
        border-radius: 1px;
        line-height: 0.38rem;
        border-color: #a3a3a3;
    }
    
</style>
