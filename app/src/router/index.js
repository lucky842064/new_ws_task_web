


import store from "../store/";
import Home from "../views/Home.vue";
import Footer from "../components/Footer";
const initPath = window.localStorage.getItem('token') && window.localStorage.getItem("prologin")? "/home" : "/login";
const Login = () => import('../views/sign/login');
const Register = () => import('../views/sign/register');
const ForgotPassword = () => import("../views/sign/ForgotPassword");
//me
const Mine = () => import("../views/Mine");
//个人中心
const personCenter = () => import('../views/mine/personaCenter')
const PutRecord = () => import('../views/mine/PutRecord')
const finshTask = () => import('../views/mine/finshTask')
const BetRecord = () => import('../views/mine/BetRecord')

const Deposit = () => import('../views/pay/deposit')
// 提现
const Withdraw = () => import('../views/pay/withdraw');
const BackBind = () => import('../views/pay/backBind')
//404
const NoFound = () => import('../views/404');
//我的头像
const MyHead = () => import('../views/home/myhead');

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
            title: "WhatsApp挂机赚钱",
            showNavBar: false,
            hasTabBar: false,
            keepAlive: true,
            requireAuth: false,
            index: 0
        },
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
        path: "/betrecord",
        name: "betrecord",
        component: BetRecord,
        meta: {
            showNavBar: false,
            title: "投注详情"
        }
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
        path: "/forget_pwd",
        name: "forget_pwd",
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
        path: "/putrecord",
        name: "putrecord",
        component: PutRecord,
        meta: {
            showNavBar: false,
            title: "提现订单"
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