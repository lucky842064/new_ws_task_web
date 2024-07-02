<template>
    <div class="bottom-box" :class="{isPcBottom: isPc}">
		<div class="six-tabbar">
			<div class="six-tabbar-item"  v-for="(item, index) in tabBarList" :key="index" @click="goToPage(item.path)" @click.stop>
				<div class="item_bg">
					<img class="icon-cl"  :class="{'animate__animated animate__rotateIn': $route.name.indexOf(item.path) > -1 && item.path != 'strategy', 'animate__animated animate__bounceIn': $route.name.indexOf(item.path) > -1 && item.path == 'strategy'}" :src="$route.name.indexOf(item.path) > -1 ? item.active : item.inactive" alt="icons" />
				</div>
				<div class="sizefont" >
					<span :class="{ active: $route.name.indexOf(item.path) > -1 }">{{ item.name }}</span>
				</div>
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
                    name: this.$t("foot_003"),
                    active: require("../assets/images/home/mine-icon-a.png"),
                    inactive: require("../assets/images/home/mine-icon.png"),
                    path: "spread"
                },
				{
                    name: this.$t("foot_005"),
                    active: require("../assets/images/home/server_icon.jpg"),
                    inactive: require("../assets/images/home/home-icon.png"),
                    path: "service"
                },
                {
                    name: this.$t("foot_004"),
                    active: require("../assets/images/home/mine-icon-a.png"),
                    inactive: require("../assets/images/home/mine-icon.png"),
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
	height: 98px;
	box-shadow: 10px 10px 10px 10px #f2f2f2;
	-moz-box-shadow: 10px 10px 10px 10px #f2f2f2;
	border-top: 1px solid #E6E6E6;
	.six-tabbar, .un-login {
		height: 100%;
		width: 100%;
		display: flex;
		display: -webkit-box;
		display: -webkit-flex;
		background: #ffffff;
		.six-tabbar-item {
			display: -webkit-box;
			display: -webkit-flex;
			display: flex;
            flex: 1;
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
			font-size: 42px;
			color: #666666;
			line-height: 1;
			.active {
				color: #1989fa;
				font-weight: bold;
			}
			.unread_news {
				width: 12px;
				height: 12px;
				position: absolute;
				top: 12px;
				right: 55px;
				background-color: red;
				border-radius: 50%;
				box-sizing: border-box;
			}
		}
	}
	.un-login {
		height: 88px;
		background: rgba(0, 0, 0, 0.8);

		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		.login-text {
			font-size: 32;
			color: #ffffff;
			margin-right: 3%;
		}
		& > div > .login-btn {
			display: block;
			text-align: center;
			color: #fff;
			height: 58px;
			line-height: 60px;
			width: 160px;
			font-size: 28px;
			background-color: #7a98f9;
			border: 1px solid;
			border-radius: 29px;
		}
	}
	.icon-cl {
		height: 40px;
		&.vip {
			display: block;
			width: 108px;
			height: 91px;
			// border-radius: 38px;
			// -moz-box-shadow: 0 14px 22px rgba(245, 168, 35, 0.4);
			// -webkit-box-shadow: 0 14px 22px rgba(245, 166, 35, 0.4);
			// box-shadow: 0 14px 22px rgba(245, 166, 35, 0.4);
		}
	}
	.isTuijian{
		position: relative;
		z-index: 1005;
		.icon-cl {
			width: 78px;
			height: 78px;
			// top: -88px;
			z-index: 1;
		}
		.item_bg{
			display: flex;
			width: 78px;
			height: 78px;
			// position: absolute;
			// top: 0px;
			// border-radius: 50%;
			// left:50%;
			// transform: translateX(-50%);
			// border: 1px solid #E6E6E6;background-color: #fff;
			// align-items: center;
			// justify-content: center;
			// z-index: 1005;
		}
		.mask{
			background: #fff;width: 128px;height: 54px;
			position: absolute;bottom: 0;left: 50%;transform: translateX(-50%);
		}
		.sizefont{
			position: relative;top: 20px;
		}
	}
	.sizefont {
		margin-top: 2px;
		font-size: 28px;
	}
}
.recommend{
	z-index: 1;
	font-size: 92px;
}

.animate__animated.animate__flip2 {
    -webkit-backface-visibility: visible;
    backface-visibility: visible;
    -webkit-animation-name: flip2;
    animation-name: flip2;
}
@keyframes flip2 {
	0% {
		-webkit-transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg);
		transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg);
		-webkit-animation-timing-function: ease-out;
		animation-timing-function: ease-out;
	}
	40% {
		-webkit-transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 1.1) rotate3d(0, 1, 0, -190deg);
		transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 1.1) rotate3d(0, 1, 0, -190deg);
		-webkit-animation-timing-function: ease-out;
		animation-timing-function: ease-out;
	}
	50% {
		-webkit-transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 1.1) rotate3d(0, 1, 0, -170deg);
		transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 1.1) rotate3d(0, 1, 0, -170deg);
		-webkit-animation-timing-function: ease-in;
		animation-timing-function: ease-in;
	}
	80% {
		-webkit-transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
		transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
		-webkit-animation-timing-function: ease-in;
		animation-timing-function: ease-in;
	}
	100% {
		-webkit-transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
		transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
		-webkit-animation-timing-function: ease-in;
		animation-timing-function: ease-in;
	}
}
.isPcBottom{
	max-width: 1000px;
	margin: 0 auto;
	left: 50%;
	transform: translateX(-50%);
}
</style>