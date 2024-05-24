<template>
    <span :count="count">{{getRemainingTime()}}</span>
</template>

<script>
export default {
    name: "RemainingTime",
    data() {
        return {
            interval: null,
            count: 0
        };
    },
    computed: {
        userInfo() {
            return this.$store.state.User.userInfo;
        }
    },
    created() {
        this.getRemainingTime();
    },
    beforeDestroy() {
        this.offTime();
    },
    methods: {
        offTime() {
            clearInterval(this.interval);
            this.interval = null;
        },
        getRemainingTime() {
            let end = this.userInfo.exp_time * 1000;
            let start = new Date().getTime();
            if (!end || end < start) {
                this.offTime();
                return this.$t("buy_006");
            } else if (!this.interval) {
                this.interval = setInterval(() => {
                    this.count++;
                }, 1000);
            }
            let diff = Math.floor((end - start) / 1000);
            let seconds = diff % 60;
            diff = Math.floor(diff / 60);
            let minutes = diff % 60;
            diff = Math.floor(diff / 60);
            let hours = diff % 24;
            diff = Math.floor(diff / 24);
            return `${this.$t("buy_005")}(${this.$Helper
                .formatTime(this.$t("mine_039"), [
                    diff,
                    hours,
                    minutes,
                    seconds
                ])
                .replace("00天", "")})`;
        }
    }
};
</script>

<style scoped >
</style>
