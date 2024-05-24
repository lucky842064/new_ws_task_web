<template>
    <div class="bottom-box">
        <div class="six-tabbar">
            <div class="six-tabbar-item" v-for="(item,index) in tabBarList" :key="index" @click="goToPage(item.path)" @click.stop>
                <span :class="{active:$route.name.indexOf(item.path) > -1}">{{item.name}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
    data() {
        return {
            active: 0,
            newStatus:0,
            tabBarList: [
                {
                    name: this.$t("foot_001"),
                    active: require("../assets/images/home/home-icon-a.png"),
                    inactive: require("../assets/images/home/home-icon.png"),
                    path: "home"
                },
                {
                    name: this.$t("foot_002"),
                    active: require("../assets/images/home/buy-icon-a.png"),
                    inactive: require("../assets/images/home/buy-icon.png"),
                    path: "mine"
                }
            ]
        };
    },
    computed: mapState({
        token: state => state.User.token,
        userInfo: state => state.User.userInfo
    }),
    created() {
        this.moveNews.$on('moveState', (data)=> {
            this.newStatus = sessionStorage.getItem("newsStatus")
        })
        if(sessionStorage.getItem("newsStatus") != null){
            this.newStatus = sessionStorage.getItem("newsStatus")
        }
        // this.$store.commit("User/openInterval");
    },
    methods: {
        goToPage(path) {
            if (this.$route.name === path) {
                return;
            }
            this.$router.push(`/${path}`);
        }
    }
};
</script>
<style lang='scss'>
.bottom-box {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 103;
    box-sizing: content-box;
    width: 100%;
    height: 110px;
    box-shadow: 10px 10px 10px 10px #f2f2f2;
    -moz-box-shadow: 10px 10px 10px 10px #f2f2f2;
    .six-tabbar {
        height: 100%;
        width: 100%;
        padding: 16px;
        box-sizing: border-box;
        display: flex;
        display: -webkit-box;
        display: -webkit-flex;
        background: #ffffff;
        .six-tabbar-item {
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            width: 50%;
            position: relative;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -webkit-flex-direction: column;
            flex-direction: column;
            -webkit-box-align: center;
            -webkit-align-items: center;
            align-items: center;
            -webkit-box-pack: center;
            -webkit-justify-content: center;
            justify-content: center;
            font-size: 28px;
            color: #666666;
            line-height: 1;
            span{
                width: 100%;
                height: 100%;
                display: flex;
                border-radius: 8px;
                align-items: center;
                justify-content: center;
                background-color: #fff;
                border: 1px solid #cccccc;
                transition: all .5s;
            }
            .active {
                background-color: $home-bind-button;
                border-color: $home-bind-button;
                color: #fff;
            }
        }
        .six-tabbar-item:nth-child(1){
            margin-right: 14px;
        }
    }
}
</style>
