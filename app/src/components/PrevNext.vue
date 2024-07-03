<template>
    <div class="buy-footer">
        <span :class="isCanPrev() ? '':'footer-disabled'" @click="isCanPrev() && toPrev()">{{$t("other_001")}}</span>
        共 {{page}}/{{totalPage}} 页
        <span :class="isCanNext() ? '':'footer-disabled'"  @click="isCanNext() && toNext()">{{$t("other_002")}}</span>
    </div>
</template>

<script>
export default {
    name: "PrevNext",
    props: {
        total: {
            type: Number,
            default: 0
        },
        limit: {
            type: Number,
            default: 115
        },
        page: {
            type: Number,
            default: 1
        },
        count: {
            type: Number,
            default: 1
        },
        len: {
            type: Number,
            default: 0
        }
    },
    computed:{
        totalPage(){
          return  Math.ceil(this.total/this.limit);  
        }
    },
    methods: {
        showFooter() {
            return this.isCanPrev() || this.isCanNext();
        },
        isCanPrev() {
            return this.page > 1;
        },
        isCanNext() {
            return (this.page - 1) * this.limit + this.len < this.total;
        },
        toPrev() {
            this.$emit("to-prev");
        },
        toNext() {
            this.$emit("to-next");
        }
    },
    created() {},
    mounted() {}
};
</script>

<style scoped lang="scss">
.buy-footer {
    display: flex;
    padding: 20px 0;
    align-items: center;
    justify-content: center;
    background-color: $font-color-white;
    // background-color: seagreen;
    & > span {
        font-size: 20px;
        color: #fff;
        height: 46px;
        line-height: 46px;
        width: 146px;
        text-align: center;
        border-radius: 23px;
        background-color: $home-bind-button;
    }
    & > span:nth-child(1){
        margin-right: 16px;
    }
    & > span:nth-child(2){
        margin-left: 16px;
    }
}
.footer-disabled {
    background-color: #D2D2D2 !important;
}
</style>
