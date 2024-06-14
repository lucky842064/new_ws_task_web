


import store from "../store/";
import Home from "../views/Home.vue";
import Footer from "../components/Footer";
const initPath = window.localStorage.getItem('token') && window.localStorage.getItem("prologin")? "/home" : "/login";
const Login = () => import('../views/sign/login');
const Register = () => import('../views/sign/register');
const ForgotPassword = () => import("../views/sign/ForgotPassword");
//me
const Mine = () => import("../views/Mine");
const Buy = () => import('../views/Buy');
const Earn = () => import('../views/Earn');
const Servic = () => import('../views/Servic');
//个人中心
const personCenter = () => import('../views/mine/personaCenter')
const BetRecord = () => import('../views/mine/BetRecord')
const PutRecord = () => import('../views/mine/PutRecord')
const BuyRecord = () => import('../views/mine/BuyRecord')
const Promote = () => import('../views/mine/Promote')
const MyTeam = () => import('../views/mine/myTeam')
const wechatList = () => import('../views/mine/bindWechatList')
const wechatManagerList = () => import('../views/mine/wechatManagerList')
const wechatListTemp = () => import('../views/mine/wechatList')

const videoPlay = () => import('../views/mine/videoPlay')
const invitFriend = () => import('../views/mine/invitFriend')
const finshTask = () => import('../views/mine/finshTask')

const NoticeList = () => import('../views/notice/noticeList');

const NoticeDetail = () => import('../views/notice/noticeDetail');

const Deposit = () => import('../views/pay/deposit')
// home
// 任务记录
const taskRecord = () => import('../views/home/taskRecord')
// 新增任务绑定微信帐号
const bindWechat = () => import('../views/home/bindWechat')
// 任务记录详情
const taskDetail = () => import('../views/home/taskDetail')
// 科技任务微信号
const usableWechat = () => import('../views/home/usableWechat')
// 任务订单
const submitExamine = () => import('../views/buy/submitExamine')
const remainingtime = () => import('../views/buy/remainingtime')
const taskApply = () => import('../views/buy/taskApply')
// 用户列表
const userList = () => import('../views/extension/userList')
// 下级体现明细
const withdrawDeDetail = () => import('../views/extension/withdrawDeDetail')
// 下级列表
const levelList = () => import('../views/extension/levelList')
// 下级收益明细
const profitDetail = () => import('../views/extension/profitDetail')
const friendMoments = () => import('../views/buy/friendMoments')
// 提现
const Withdraw = () => import('../views/pay/withdraw');
const BackBind = () => import('../views/pay/backBind')
//系统消息
const SysMsg = () => import('../views/mine/SysMsg');
const ResetPwd = () => import("../views/mine/ResetPwd");
//404
const NoFound = () => import('../views/404');
const DepositDetail = () => import("../views/pay/DepositDetail");
//我的头像
const MyHead = () => import('../views/home/myhead');
//ios打开其他页面的URL
const otherUrl = () => import('../views/other/otherUrl');
//ios打开其他页面的URL
const kefu = () => import('../views/other/kefu.vue');
const gameList = () => import('../views/game/gameList.vue');
const fishProfit = () => import('../views/game/fishProfit.vue');
const downApp = () => import('../views/game/downApp.vue');
const daliySign = () => import('../views/daliySign/index.vue');
const daliySignDetail = () => import('../views/daliySign/DaliySignDetail.vue');
const branchDetail = () => import('../views/home/branchDetail.vue');

Vue.use(VueRouter);

const routes = [{
        path: "/",
        redirect: initPath
    },
    {
        path: '/home',
        name: "home",
        components: {
            default: Home,
            tabBar: Footer
        },
        meta: {
            title: "微信挂机赚钱",
            showNavBar: false,
            hasTabBar: false,
            keepAlive: true,
            requireAuth: false,
            index: 0
        },
    },
    {
        path: "/taskRecord",
        name: "taskRecord",
        components: {
            default: taskRecord,
        },
        meta: {
            title: "任务记录",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/bindWechat",
        name: "bindWechat",
        components: {
            default: bindWechat,
        },
        meta: {
            title: "新增任务绑定微信帐号",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/usableWechat",
        name: "usableWechat",
        components: {
            default: usableWechat,
        },
        meta: {
            title: "微信号列表",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/taskDetail",
        name: "taskDetail",
        components: {
            default: taskDetail,
        },
        meta: {
            title: "任务详情",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/buy",
        name: "buy",
        components: {
            default: Buy,
            tabBar: Footer,
        },
        meta: {
            requireAuth: true,
            showNavBar: false,
            hasTabBar: true,
            keepAlive: true,
            index: 0.1,
        },
    },
    {
        path: "/remainingtime",
        name: "remainingtime",
        components: {
            default: remainingtime,
        },
        meta: {
            title: "微信群任务",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/submitExamine",
        name: "submitExamine",
        components: {
            default: submitExamine,
        },
        meta: {
            title: "提交加群审核",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/taskApply",
        name: "taskApply",
        components: {
            default: taskApply,
        },
        meta: {
            title: "提交验粉审核",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/friendMoments",
        name: "friendMoments",
        components: {
            default: friendMoments,
        },
        meta: {
            title: "微信群任务",
            requireAuth: true,
            index: 1
        }
    },
    
    {
        path: "/history",
        name: "history",
        components: {
            default: History,
            tabBar: Footer
        },
        meta: {
            requireAuth: true,
            showNavBar: false,
            hasTabBar: true,
            index: 2
        },
    },
    {
        path: "/notice_list",
        name: "NoticeList",
        component: NoticeList,
        meta: {
            showNavBar: false,
            hasTabBar: false,
            title: "全部公告",
            requireAuth: true,
            index: 2,
        },
    },
    {
        path: "/notice_detail",
        name: "NoticeDetail",
        component: NoticeDetail,
        meta: {
            showNavBar: false,
            hasTabBar: false,
            title: "内容详情",
            requireAuth: true,
            index: 2.5,
        },
    },
    {
        path: "/earn",
        name: "earn",
        components: {
            default: Earn,
            tabBar: Footer
        },
        meta: {
            title: "推广",
            keepAlive: true,
            showNavBar: false,
            index: 0.28,
            keepAlive: true,
        },
    },
    {
        path: "/servic",
        name: "servic",
        components: {
            default: Servic,
            tabBar: Footer
        },
        meta: {
            title: "客服",
            keepAlive: true,
            showNavBar: false,
            index: 0.28,
            keepAlive: true,
        },
    },
    {
        path: "/userList",
        name: "userList",
        components: {
            default: userList,
        },
        meta: {
            title: "用户列表",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/levelList",
        name: "levelList",
        components: {
            default: levelList,
        },
        meta: {
            title: "下级收益明细",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/withdrawDeDetail",
        name: "withdrawDeDetail",
        components: {
            default: withdrawDeDetail,
        },
        meta: {
            title: "下级提现明细",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/profitDetail",
        name: "profitDetail",
        components: {
            default: profitDetail,
        },
        meta: {
            title: "下级收益明细",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/mine",
        name: "mine",
        components: {
            default: Mine,
            tabBar: Footer
        },
        meta: {
            requireAuth: true,
            showNavBar: false,
            hasTabBar: false,
            keepAlive: true,
            index: 0.3,
        },
    },
    {
        path: "/wechatList",
        name: "wechatList",
        component: wechatList,
        meta: {
            hasTabBar: false,
            title: "微信管理",
            requireAuth: true,
            index: 1
        },
    },
    {
        path: "/wechatManagerList",
        name: "wechatManagerList",
        component: wechatManagerList,
        meta: {
            hasTabBar: false,
            title: "微信托管列表", // wechatListTemp
            requireAuth: true,
            index: 1
        },
    },
    {
        path: "/wechatListTemp",
        name: "wechatListTemp",
        components: {
            default: wechatListTemp,
            tabBar: Footer
        },
        meta: {
            hasTabBar: false,
            title: "微信列表", // wechatListTemp
            requireAuth: true,
            index: 1
        },
    },
    {
        path: "/personCenter",
        name: "personCenter",
        component: personCenter,
        meta: {
            hasTabBar: false,
            title: "个人中心",
            requireAuth: true,
            index: 1
        },
    },
    {
        path: "/videoPlay",
        name: "videoPlay",
        component: videoPlay,
        meta: {
            hasTabBar: false,
            title: "视频播放",
            requireAuth: true,
            index: 1
        },
    },
    {
        path: "/deposit-detail",
        name: "DepositDetail",
        component: DepositDetail,
        meta: {
            requireAuth: false,
            showNavBar: false,
            hasTabBar: false
        },
    },
    {
        path: "/sysmsg",
        name: "sysmsg",
        component: SysMsg,
        meta: {
            hasTabBar: false,
            title: "系统消息",
            requireAuth: true,
            index: 2
        },
    },
    {
        path: "/deposit",
        name: "deposit",
        components: {
            default: Deposit,
        },
        meta: {
            requireAuth: true,
            index: 2
        },
    },
    {
        path: "/withdraw",
        name: "withdraw",
        components: {
            default: Withdraw,
        },
        meta: {
            title: "资金提现",
            requireAuth: true,
            index: 2
        },
    },
    {
        path: "/invitFriend",
        name: "invitFriend",
        components: {
            default: invitFriend,
        },
        meta: {
            title: "资金提现",
            requireAuth: true,
            index: 2
        },
    },
    {
        path: "/finshTask",
        name: "finshTask",
        components: {
            default: finshTask,
        },
        meta: {
            title: "完成任务详情",
            requireAuth: true,
            index: 2
        },
    },
    {
        path: "/MyTeam",
        name: "MyTeam",
        components: {
            default: MyTeam,
        },
        meta: {
            title: "我的团队",
            requireAuth: true,
            index: 1
        },
    },
  
    {
        path: "/backbind",
        name: "backbind",
        components: {
            default: BackBind,
        },
        meta: {
            requireAuth: true,
            index: 4
        },
    },
    {
        path: "/resetPwd",
        name: "ResetPwd",
        component: ResetPwd,
        meta: {
            requireAuth: true,
            showNavBar: false,
            hasTabBar: false,
            index: 2
        },
    },
    {
        path: "/login",
        name: "login",
        component: Login,
        meta: {
            showNavBar: false,
            hasTabBar: false,
            index: 0
        },
    },
    {
        path: "/register",
        name: "register",
        component: Register,
        meta: {
            showNavBar: false,
            hasTabBar: false,
        }
    },
    {
        path: "/forgot-password",
        name: "ForgotPassword",
        component: ForgotPassword,
        meta: {
            title: '',
            requireAuth: false,
            showNavBar: false,
            hasTabBar: false,
            index: 1
        },
    },
    {
        path: "/myhead",
        name: "myhead",
        component: MyHead,
        meta: {
            showNavBar: false,
            title: "我的头像"
        }
    },
    {
        path: "/betrecord",
        name: "betrecord",
        component: BetRecord,
        meta: {
            showNavBar: false,
            title: "投注详情"
        }
    },
    {
        path: "/buyrecord",
        name: "buyrecord",
        component: BuyRecord,
        meta: {
            showNavBar: false,
            title: "充值订单"
        }
    },
    {
        path: "/putrecord",
        name: "putrecord",
        component: PutRecord,
        meta: {
            showNavBar: false,
            title: "提现订单"
        }
    },
    {
        path: "/promote",
        name: "promote",
        component: Promote,
        meta: {
            showNavBar: false,
            title: "推广用户"
        }
    },
    {
        path: "/otherUrl",
        name: "otherUrl",
        components: {
            default: otherUrl,
        },
        meta: {
            showNavBar: false,
            title: "详细内容",
        }
    },
    {
        path: "/kefu",
        name: "kefu",
        components: {
            default: kefu,
        },
        meta: {
            showNavBar: false,
            title: "客服中心",
        }
    },

    {
        path: "/gameList",
        name: "gameList",
        components: {
            default: gameList,
        },
        meta: {
            showNavBar: false,
            title: "游戏试玩",
        }
    },
    {
        path: "/fishProfit",
        name: "fishProfit",
        components: {
            default: fishProfit,
        },
        meta: {
            showNavBar: false,
            title: "新手福利",
        }
    },
    {
        path: "/downApp",
        name: "downApp",
        components: {
            default: downApp,
        },
        meta: {
            showNavBar: false,
            title: "手游列表",
        }
    },
    {
        path: "/daliySign",
        name: "daliySign",
        components: {
            default: daliySign,
        },
        meta: {
            showNavBar: false,
            title: "每日签到",
        }
    },
    {
        path: "/daliySignDetail",
        name: "daliySignDetail",
        components: {
            default: daliySignDetail,
        },
        meta: {
            showNavBar: false,
            title: "每日签到",
        }
    },
    {
        path: "/branchDetail",
        name: "branchDetail",
        components: {
            default: branchDetail,
        },
        meta: {
            showNavBar: false,
            title: "下级管理",
        }
    },
   
    {
        path: "*",
        name: "404",
        component: NoFound,
        meta: {
            title: "404",
            showNavBar: false,
        },
    },
];

const router = new VueRouter({
    mode: "hash",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0);
    if (to.name === 'sign') {
        store.commit('Global/clearKeepAlive', '')
    }
    if (to.meta.keepAlive) {
        store.commit('Global/keepAlive', to.name)
    }
    let token = localStorage.getItem('token');
    if (to.meta.requireAuth) {
        if (token) {
            next();
        } else {
            next({
                path: "/login",
            });
        }
    }
    next();
});
router.onError(err =>{
    const pattern =  /Loading chunk chunk\-([a-z0-9])+ failed/g;//匹配资源丢失的文件
    const isChunkLoadFailed = err.message.match(pattern);
    const targetPath  = router.history.pending.fullPath;
    if(isChunkLoadFailed){
        location.reload();
        // router.replace(targetPath)//会陷入死循环
    }
})
export default router;