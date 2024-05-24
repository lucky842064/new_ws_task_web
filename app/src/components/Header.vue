<template>
    <div class="header-box" :class="[bgcolor?'headerBg':'', isPcH?'isPcH': '']">
        <div class="header">
            <div class="left" @click="onClickLeft" v-show="showBack">
                <van-icon name="arrow-left" size="20"></van-icon>
            </div>
            <div class="title">{{title}}</div>
            <div class="ke-fu-icon" v-if="hide" :class="showIcon && 'show'" @click="$Helper.toOutLink(userInfo.kefu+'&appid=30301&appname='+wk_name+'&userid='+userInfo.user_id+'&username='+userInfo.user_key+'&point='+userInfo.point+'&ip='+myip+'&prov='+mycityname)">
                <img src="../assets/images/buy/kefu.png" alt="ke-fu" />
            </div>
        </div>
    </div>
</template>
<script>
import WebsiteSetting from "../mixin/websiteSetting";
export default {
    mixins: [WebsiteSetting],
    props: {
        jumpType: {
            type: String,
            default: ""
        },
        showBack: {
            type: Boolean,
            default: true
        },
        title: {
            default: "",
            required: true
        },
        showBarPlace: {
            default: true
        },
        showIcon: {
            default: false
        },
        read: {
            default: false
        },
        hide: {
            default: false
        },
        bgcolor: {
            default: false
        },
        prevent: Boolean
    },
    data() {
        return {
            wk_name:'',
            isPcH: !window.navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )
        };
    },
    methods: {
        onClickLeft() {
            if (this.$props.prevent) {
                this.$emit("return");
            } else {
                if (!window.localStorage.getItem("token")) {
                    this.$toast(this.$t("login_022"));
                    sessionStorage.clear();
                    localStorage.removeItem("token");
                    setTimeout(() => {
                        this.$router.replace("/login");
                    }, 1000);
                } else if(this.$props.jumpType == "0") {
                    this.$router.push({path:'/home'});
                } else {
                    this.$router.back();
                }
            }
        },
        onClickRight() {
            this.$emit("read_all");
        }
    },
    created() {
        this.wk_name=process.env.VUE_APP_NAME
    },
    computed: {
        myip() {
            return localStorage.getItem('myip');
        },
        mycityname() {
            return localStorage.getItem('mycityname');
        },
        userInfo() {
            return this.$store.state.User.userInfo;
        }
    }
};
</script>
<style lang="scss" scoped>
.header-box {
    position: relative;
    width: 100%;
    // padding: 20px 20px;
    height: 88px;
    background-color: #ffffff;
    // background: linear-gradient(90deg, #F65251, #F35251);
    border-bottom: 1px solid #D8D8D8;
    display:flex;
    align-items: center;
    .header {
        width: 100%;
        // display: flex;
        height: 50px;
        font-size: 36px;
        color: #fff;
        position: relative;
        // justify-content: space-between;
        // align-items: center;
        .title {
            text-align: center;
            font-size: 36px;
            color: #141414;
            font-weight: bold;
            // margin-right: -0.8rem;
        }
        .left {
            position: absolute;
            top: 50%;left: 30px;
            transform: translateY(-50%);
        }
        .ke-fu-icon {
            position: absolute;
            right: 0.1rem;
            top: 0rem;
            img {
                width: 60px;
                height: 48px;
            }
        }
    }
    ::v-deep{
        .van-icon-arrow-left{
                color:#000;
        }
    }
}
.headerBg {
    background-color: $color-theme;
    .header {
        color: #ffffff;
    }
    .read_all {
        color: #ffffff;
    }
}
.isPcH{
    max-width: 1000px;
    left: 50% !important;
    transform: translateX(-50%);
}
</style>
