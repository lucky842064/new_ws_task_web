<template>
    <div v-html="getRemainingTime()" :count="count"></div>
</template>

<script>
export default {
    name: "RemainingTime",
    props: {
        status: {
            type: Object,
            default: () => {
                return {
                    status: true
                };
            }
        }
    },
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
            this.status.status = false;
            clearInterval(this.interval);
            this.interval = null;
        },
        getRemainingTime() {
            let end = this.userInfo.exp_time * 1000;
            let start = new Date().getTime();
            if (!end || end < start) {
                this.offTime();
                return "";
            } else if (!this.interval) {
                this.status.status = true;
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
            return `${this.$Helper.remaining(
                diff,
                hours,
                minutes,
                seconds,
                this.$t("buy_003")
            )}`;
        }
    }
};
</script>

<style scoped >
</style>
