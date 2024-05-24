<template>
    <div class="service_new">
        <div class="head_bg"></div>
        <div class="title">客服</div>
        <div class="consult_info">
            <img src="../assets/images/consult_icon.png">
            <div class="right">
                <p class="name">在线客服</p>
                <p class="second">有问题,找客服</p>
                <div class="btn"  @click="$Helper.toOutLink(userInfo.kefu + '&appid=30301&ostype=devtype&appname=' + wk_name + '&userid=' + userInfo.user_id + '&username=' + userInfo.user_key + '&point=' + userInfo.point + '&ip=' + myip + '&prov=' + mycityname, 1)">立即咨询</div>
            </div>
        </div>
        <div class="help_file">
			<div class="explain_title">
				<span class="divider_online"></span>
				<span class="divider_text">帮助文档</span>
			</div>
			<div class="document_list">
				<van-cell v-for="(item, index) in fileList" :key="index" :title="item.title" is-link @click="showDialog(item)" />
			</div>
		</div>
    </div>
</template>
<script>
// import PageHeader from '@/components/Header';
import { mapState } from 'vuex';
export default {
	name: 'Servic',
	// components: { PageHeader },
	data() {
		return {
			wk_name: '',
			title: '客服中心',
			fileList: [],
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.User.userInfo,
		}),
	},
	created() {
		this.wk_name = process.env.VUE_APP_NAME;
		if (sessionStorage.getItem('serviceCont') != null) {
			this.fileList = JSON.parse(sessionStorage.getItem('serviceCont'));
		} else {
			this.fileList = [];
		}
	},
	mounted() {},
	methods: {
		showDialog(val) {
			this.$popDialog({ content: val.content, type: val.m_type, title: val.title });
		},
	},
};
</script>
<style lang="scss" scoped>
.service_new{
    background-color: #F6F6F6;position: relative;
    min-height: calc(100vh - 104px);overflow-y:scroll;padding-bottom: 144px;
    
    .title{
        height: 92px;line-height: 92px;font-size: 32px;font-weight: bold;color: #FFFFFF;
        position: relative;z-index: 1;text-align: center;
    }
    .consult_info{
        padding: 40px 70px;background-color: #fff;margin: 0 26px 28px;border-radius: 20px;
        display: flex;align-items:center;justify-content:space-between;z-index: 1;position: relative;
        >img{
          width: 240px;margin-right: 95px;
        }
        .right{
            flex-grow: 1;text-align: center;
            .name{
                color: #313131;font-weight: bold;font-size: 40px;margin-bottom:16px;
            }
            .second{
                color: #A5A5A5;font-weight: bold;font-size: 28px;margin-bottom: 45px;
            }
            .btn{
                border-radius: 34px;background-color: $color-theme;width: 218px;height: 67px;
                text-align: center;line-height: 67px;font-size: 28px;color: #FFFFFF;
            }
        }
    }

}
.help_file {
	padding: 0px 26px;
	box-sizing: border-box;
	.serve_model {
		width: 100%;
		height: 293px;
		background: url('../assets/images/home/kefu_bj.jpg');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		border-radius: 4px;
		.serve_img {
			display: block;
			width: 140px;
			margin: 0 auto;
		}
		.serve_btn {
			height: 64px;
			color: #fff;
			display: block;
			margin: 0 auto;
			margin-top: 20px;
			border-color: #fed701;
			background-color: #fed701;
		}
	}
}
// 帮助文档
.help_file {
	.explain_title,
	.task_text {
		width: 100%;
		font-size: 0.35rem;
		margin: 20px 0;
		position: relative;
		.divider_online {
			margin-top: 0;
			height: 0.3rem;
			position: absolute;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
		}
		.divider_text {
			margin-left: 20px;
		}
	}
	.task_text {
		margin-top: 10px;
		line-height: 0;
		.van-cell__title {
			line-height: initial;
		}
	}
	::v-deep{
        .document_list {
            .van-cell {
                font-size: 0.3rem;
                margin-bottom: 10px;
            }
        }
    }
    .explain_title{
        margin: 0 0 12px;
    }
    .document_list{
        padding-bottom: 0px;;
    }
}
</style>