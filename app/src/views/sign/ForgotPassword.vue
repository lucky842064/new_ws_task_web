<template>
    <div class="forgot">
        <div class="left_ct" @click="$router.go(-1)">
			<img src="../../assets/images/sign/left.png" />
        </div>
        <div class="forget_continer">
            <div class="forget_title">
                找回密码
            </div>
            <div class="input_item">
                <label class="left_icon">
                    <img src="../../assets/images/sign/zhanghao.png" />
                </label>
                <input v-model="username" :placeholder="$t('login_004')" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" />
            </div>
            <div class="input_item verfy_item">
                <div class="input_code">
                    <label class="left_icon">
                        <img src="../../assets/images/sign/secret.png" />
                    </label>
                    <input v-model="safe_code" :placeholder="$t('login_012')" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" />
                </div>
                <div class="code_img" @click="getVerfyBtn" v-html="code" />
            </div>
            <!-- <div class="uilist_div verfy_code">
                <div class="input_code">
                    <img src="../../assets/images/sign/secret.png" />
                    <input style="flex-grow:1;" v-model="safe_code" autocomplete="off" :placeholder="$t('login_012')" oninput="value=value.replace(/[^\w_]/g,'')" />
                </div>
                <div class="code_img" @click="getVerfyBtn" v-html="code" />
            </div> -->
            <div class="input_item">
                <label class="left_icon">
                    <img src="../../assets/images/sign/lock.png" />
                </label>
                <input v-model="pwd" :placeholder="$t('login_008')" :type="regEye?'password':'text'" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" />
                <i :class="[regEye ? 'icon_biyan': 'icon_zhenyan']" @click="regEye = !regEye"></i>
            </div>
            <div class="input_item">
                <label class="left_icon">
                    <img src="../../assets/images/sign/lock.png" />
                </label>
                <input v-model="sur_pwd" :placeholder="$t('login_010')" :type="regEye?'password':'text'" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" />
                <i :class="[regEye ? 'icon_biyan': 'icon_zhenyan']" @click="regEye = !regEye"></i>
            </div>
            <div class="login_btn">
				<van-button type="danger" :loading="isLoading" @click="handleRegister" loading-text="提交中...">{{$t('other_005') }}</van-button>
			</div>
        </div>
    </div>
</template>
<script>
import { getcode,changepwd } from '@/api/login';
export default {
    name: "ForgotPassword",
    components: {  },
    data() {
        return {
            regEye:false,
            isLoading:false,
            username:"",
            pwd: "",
            code: "",
            sur_pwd: "",
            safe_code: ""
        }
    },
    created() {
        this.timestamp = String(new Date().getTime());
        this.getVerfyBtn();
    },
    methods: {
        async getVerfyBtn(){
            const { code } = await getcode({ uuid: this.timestamp });
			this.code = code;
        },
        //注册
		handleRegister() {
			const zh_reg = new RegExp(/^[^\u4e00-\u9fa5]+$/);
			const regex = new RegExp(/^[0-9A-Za-z]{6,20}$/);
			if (!this.username) {
				return this.$toast(this.$t('login_004'));
			} else if(!zh_reg.test(this.username)){
				return this.$toast(this.$t('login_030'));
			}
            if (!this.safe_code) {
				return this.$toast(this.$t('login_012'));
			}
			if (!this.pwd || !regex.test(this.pwd)) {
				return this.$toast(this.$t('login_009'));
			}
			if (this.sur_pwd !== this.pwd) {
				return this.$toast(this.$t('login_020'));
			}
			let params = {
				account: this.username,
				pwd: this.pwd,
				uuid: this.timestamp,
				code: this.safe_code,
				finvite_Code: this.user_code
			};
			this.isLoading =true;
            changepwd(params).then(res=>{
                this.isLoading = false;
                if (res.code) return;
                this.$toast(this.$t('login_018'));
                setTimeout(()=>{this.$router.replace('/login')},1000)
            })
		}
    }
};
</script>
<style lang="scss" scoped>
.forgot {
    height: 100vh;
    .left_ct{
        height: 88px;
        display: flex;
        align-items: center;
        padding: 0 30px;
        box-sizing: border-box;
        img{
            width: 18px;
        }
    }
    .forget_continer {
        width: 100%;
        padding: 0 48px;
	    box-sizing: border-box;
        input {
            background: transparent !important;
            border: transparent;
            outline: none;
            font-size: 28px;
            color: #626262;
            padding-left: 25px;
            flex-grow: 1;
        }
        .forget_title{
            width: 100%;
            font-size: 38px;
            line-height: 1.5;
            margin-top: 10%;
            margin-bottom: 10%;
        }
        .input_item{
            display: flex;
            height: 88px;
            position: relative;
            border-radius: 12px;
            padding: 0 22px;
            box-sizing: border-box;
            background-color: #F6F6F6;
            margin-bottom: 32px;
            justify-content: center;
            .left_icon {
                display: flex;
                width: 23px;
                height: auto;
                align-items: center;
            }
            .icon_biyan,
            .icon_zhenyan {
                width: 40px;
                height: 20px;
                position: absolute;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                background: url("../../assets/images/sign/icon_biyan.png") no-repeat;
                background-size: 100% 100% !important;
            }
            .icon_zhenyan {
                background: url("../../assets/images/sign/icon_zhenyan.png") no-repeat;
            }
        }
        .verfy_item{
            width: 100%;
            display: flex;
            padding: 0;
            align-items: center;
            background: transparent;
            justify-content: space-between;
            .input_code{
                display: flex;
                flex-grow: 1;
                height: 100%;
                border-radius: 12px;
                padding-left: 22px;
                box-sizing: border-box;
                background-color: #F6F6F6;
            }
            .code_img {
                width: 180px;
                height: 100%;
                display: flex;
                flex-shrink: 0;
                padding: 0 10px;
                align-items: center;
                margin-left: 20px;
                border-radius: 8px;
                letter-spacing: 6px;
                box-sizing: border-box;
                justify-content: center;
                background-color: #F6F6F6;
            }
        }
        .login_btn {
            width: 100%;
            display: flex;
            margin-top: 20px;
            flex-direction: column;
            .van-button {
                width: 100%;
                border: none;
                font-size: 18px;
                border-radius: 6px;
                margin-bottom: 20px;
            }
        }
    }
}
</style>
