<template>
    <van-button
        native-type="button"
        @click="getVerifyCode"
        :disabled="disable"
        class="veryCodeBtn"
        :class="disable && 'disabled'"
    >{{getCode}}</van-button>
</template>
<script>
import { getCaptcha } from "../api/user";
export default {
    props: ["code", "phone", "type", "color"],
    data() {
        return {
            getCode: this.$t("login_016"),
            count: 60,
            disable: false,
            countDown: null,
            interval: null
        };
    },
    beforeDestroy() {
        clearInterval(this.countDown);
    },
    methods: {
        getVerifyCode() {
            if (this.disable) return;
            if (this.phone && this.code) {
                const { phone, type } = this.$props;
                const code =
                    String(this.$props.code).indexOf("+") > -1
                        ? Number(this.$props.code.replace("+", ""))
                        : Number(this.$props.code);
                const Toast = this.$toast.loading({
                    duration: 3000,
                    message: this.$t("login_017"),
                    forbidClick: true,
                    loadingType: "spinner"
                });
                getCaptcha({ code: code, mobile: phone, type: type }).then(
                    data => {
                        Toast.clear();
                        this.countdown();
                    }
                ).catch(error=>{
                    Toast.clear();
                });
                // .catch(reason => {
                //   this.$toast.fail(reason.msg)
                // });
            } else {
                this.$toast.fail(
                    `${this.$t("login_007")},${this.$t("login_005")}`
                );
            }
        },
        countdown() {
            clearInterval(this.countDown);
            this.countDown = setInterval(() => {
                this.count--;
                if (this.count < 1) {
                    this.disable = false;
                    this.getCode = this.$t("login_016");
                    clearInterval(this.countDown);
                    this.interval = null;
                } else {
                    this.disable = true;
                    this.getCode = this.$Helper.format(
                        this.$t("login_024"),
                        this.count
                    );
                }
            }, 1000);
        }
    }
};
</script>
<style lang="scss" scoped>
.veryCodeBtn {
    height: 0.7rem;
    text-align: center;
    /* line-height: 0.6rem; */
    padding: 0.1rem 0.1rem;
    width: 1.8rem;
    border-radius: 0.5rem;
    font-size: 0.24rem;
    color: #ffffff;
    background-color: $color-theme;
    float: right;
    &:disabled {
        color: #999999;
        background-color: #1073b8 !important;
    }
}
</style>
