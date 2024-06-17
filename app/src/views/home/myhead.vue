<template>
    <div class="my_head">
        <page-header :title="$t('home_039')"></page-header>
        <div class="image_list">
            <div class="image_box" v-for="(item,index) in userHeadList" :key="index" @click="updateCheckImage(index)">
                <van-image fit="contain" :src="item" />
            </div>
        </div>
        <van-dialog
            v-model="show"
            title
            show-cancel-button
            class="image_dialog"
            @confirm="ok"
            @cancel="cancel"
            :cancel-button-text="$t('other_004')"
            :confirm-button-text="$t('other_005')"
            close-on-click-overlay
            close-on-popstate
        >
            <img :src="userHeadList[checkIndex]" class="check_image" />
            <div class="check_tip">{{$t("mine_068")}}</div>
        </van-dialog>
    </div>
</template>
<script>
import PageHeader from "../../components/Header";
export default {
    components: { PageHeader },
    data() {
        return {
            checkIndex: 0,
            checkSrc: "",
            show: false,
            selectedItem: {}, //弹窗公告原生
            unread: 0
        };
    },
    computed: {
        userHeadList() {
            return this.$store.state.User.userHeadList;
        }
    },
    created() {},
    methods: {
        updateCheckImage(index) {
            this.checkIndex = index;
            this.show = true;
        },
        ok() {
            let toast;
            let Toast = setTimeout(() => {
                toast = this.$toast.loading({ duration: 3000 });
            }, 1000);
            updateinfo({type: 3,head: `${this.checkIndex}`}).then(res => {
                if (Toast) {
                    clearTimeout(Toast);
                    Toast = null;
                }
                if (toast) {
                    toast.clear();
                }
                this.$store.dispatch("User/getUserInfo");
                this.$router.back();
            });
        },
        cancel() {
            this.show = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.my_head {
    height: 100%;
    background-color: #f2f2f2;
    .image_list {
        margin-top: 20px;
        background-color: #fff;
        padding-bottom: 20px;
        .image_box {
            width: 25%;
            height: auto;
            display: inline-block;
            padding-top: 40px;
            padding-right: 40px;
            padding-left: 40px;
        }
    }
    .image_dialog {
        padding-top: 50px;
        text-align: center;
        .check_image {
            width: 30%;
            text-align: center;
        }
        .check_tip {
            color: #999;
            font-size: 20px;
            padding-top: 50px;
            padding-bottom: 20px;
        }
    }
}
</style>
