<template>
	<div id="app" :class="[hasTabBar ? 'set-padding-top' : '', isPc?'isPc': '']">
		<div v-show="showNavBar" class="van_nav_pd"></div>
		<!-- <keep-alive :include="list"> -->
		<keep-alive :include="keepAliveNames">
			<router-view ></router-view>
		</keep-alive>
		<!-- </keep-alive> -->
		<router-view name="tabBar"></router-view>
		<float-ball v-if="assistiveTouch"></float-ball>
		<!-- <float-ball v-if="assistiveTouch"></float-ball> -->
	</div>
</template>
<script>
import FloatBall from './components/FloatBall';
import preLoad from './core/PreLoadProxy';
export default {
	components: {
		FloatBall,
	},
	provide: function(){
		return {
			isPc: !window.navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )
		}
	},
	data() {
		return {
			title: '',
			showNavBar: false,
			hasTabBar: true,
			transitionName: '',
			keepAliveNames: ['home'],
			assistiveTouch: sessionStorage.getItem('plus_ready') && sessionStorage.getItem('plus_ready') === '1',
			isPc: !window.navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )
		}
	},
	beforeCreate() {},
	created() {
		let preLoadTemp = new preLoad();
		preLoadTemp.setup();
		let _this = this;
		const { title, showNavBar, hasTabBar } = this.$route.meta;
		this.title = title || '';
		this.hasTabBar = !!hasTabBar;
		this.showNavBar = !!showNavBar;
	},
};
</script>
<style lang="scss">
html,
body,
#app {
	height: 100%;
	width: 100%;
	overflow: hidden;
	.van-overlay, .van-popup{
		z-index: 99 !important;
	}
}

img {
	max-width: 100%;
}

.set-padding-top {
	padding-bottom: 120px;
}

#app {
	font-family: 'Microsoft YaHei';
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}
#app{
	max-width: 750px;
	margin: 0 auto;
	overflow: hidden;
}
//全局唐朝
.g-notice-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;

	&.single {
		.tit {
			font-size: 36px;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			line-height: 50px;
			text-align: center;
			padding: 60px 0 20px !important;
		}
	}

	.wrapperInner {
		width: 670px;
		padding: 10px 65px;
		background: #ffffff;
		border-radius: 16px;
		position: relative;

		.close {
			width: 88px;
			height: 88px;
			position: absolute;
			left: 50%;
			margin-left: -44px;
			bottom: -160px;
		}

		.tit {
			font-size: 36px;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			text-align: center;
			padding: 20px 0 45px;
		}

		.desc-tit {
			font-size: 30px;
			text-align: center;
			color: rgba(102, 102, 102, 1);
			line-height: 150px;
			font-weight: bold;
		}

		.desc {
			height: 250px;
			overflow-y: auto;
			font-size: 30px;
			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			line-height: 1.4;
		}

		.btm {
			display: flex;
			align-items: center;
			margin-top: 61px;
			padding-bottom: 35px;
		}

		.btn {
			width: 250px;
			height: 88px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 44px;
			font-size: 36px;
		}

		.btn-border {
			border: 1px solid rgba(153, 153, 153, 1);
			color: #333333;
		}

		.btn-primary {
			border: 1px solid #0e63ff;
			background: #0e63ff;
			color: #fff;
			margin-left: 30px;
		}
	}
}
.van-icon-location-acc {
	&:after {
		content: '';
		width: 0.36rem;
		height: 0.382rem;
		background-image: url('./assets/images/sign/uname.png');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center center;
		display: block;
	}
}
.van-icon-location-pwd {
	&:after {
		content: '';
		width: 0.36rem;
		height: 0.4rem;
		background-image: url('./assets/images/sign/password.png');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center center;
		display: block;
	}
}
.van-icon-location-promo {
	&:after {
		content: '';
		width: 0.36rem;
		height: 0.4rem;
		background-image: url('./assets/images/sign/promo_code.png');
		background-repeat: no-repeat;
		background-size: contain;
		display: block;
	}
}
.van-icon-location-valid {
	&:after {
		content: '';
		width: 0.36rem;
		height: 0.4rem;
		background-image: url('./assets/images/sign/valid_code.png');
		background-repeat: no-repeat;
		background-size: contain;
		display: block;
	}
}

.van-empty__description {
	margin-top: 0 !important;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
	will-change: transform;
	transition: all 0.3s;
	position: absolute;
	width: 100%;
	left: 0;
}
.slide-right-enter {
	transform: translateX(-100%);
}
.slide-right-leave-active {
	transform: translateX(100%);
}
.slide-left-enter {
	transform: translateX(100%);
}
.slide-left-leave-active {
	transform: translateX(-100%);
}
.MoneyUnit {
	font-size: 20px;
	color: $color-theme;
}
.bind-title-select {
	.van-dropdown-menu__bar {
		border-radius: 8px !important;
		background-color: rgb(248, 197, 143) !important;
		height: 0.8rem;
	}
	.van-dropdown-menu__item {
		border-radius: 8px !important;
		height: 0.8rem;
	}
	.van-dropdown-menu__title {
		color: $font-color-white;
	}
	.van-dropdown-menu__title::after {
		position: absolute;
		top: 50%;
		right: 0;
		margin-top: -0.1rem;
		border: 0.06rem solid;
		background-image: url('./assets/images/home/down_arrow_white.png');
		border-color: transparent transparent #fff #fff;
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
		opacity: 1;
	}
}
.disable-select {
	// margin: 0 50px 0 30px;
	font-size: 24px;
	color: $home-disabled-text;
	display: flex;
	justify-content: space-around;
	align-items: center;
	.van-dropdown-menu {
		width: 2.5rem;
	}
	.van-dropdown-menu__bar {
		width: 2.5rem;
		border-radius: 4px !important;
		height: 0.7rem;
	}
	.van-dropdown-menu__item {
		background-color: $home-disabled-back;
		border-radius: 4px !important;
		height: 0.7rem;
	}
	.van-dropdown-menu__title::after {
		position: absolute;
		top: 50%;
		right: -0.04rem;
		margin-top: -0.1rem;
		border: 0.06rem solid;
		background-image: url('./assets/images/home/down_arrow_white.png');
		border-color: transparent transparent rgba(102, 102, 102, 1) rgba(102, 102, 102, 1);
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
		opacity: 1;
	}
}
.van-dialog__message {
	padding: 0.24rem;
}
#home-risk {
	width: 6.89rem;
	.van-dialog__header {
		height: 1rem;
	}
}
.dialog-close {
	position: absolute;
	right: 20px;
	top: 20px;
	width: 50px;
}
.van-dialog {
	width: 6.8rem;
}

.isPc{
	max-width: 1000px;
	margin: auto;
	::-webkit-scrollbar {
		display: none; /* Chrome Safari */
	}
	-ms-overflow-style: none; /* IE 10+ */
	scrollbar-width: none; /* Firefox */

	.van-popup, .van-overlay{
		max-width: 10rem;
		left: 50%;
		transform: translateX(-50%);
	}
	.van-popup--center{
		top: 50%;
		left: 50%;
		-webkit-transform: translate3d(-50%,-50%,0);
		transform: translate3d(-50%,-50%,0);
	}
}

</style>
