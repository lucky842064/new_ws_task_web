<template>
    <div class="otherUrl">
        <page-header title="详细内容"></page-header>
        <iframe :src="otherUrl" v-if="otherUrl" frameborder="0"></iframe>
        <div v-else>暂无信息</div>
    </div>
</template>

<script>
import PageHeader from "@/components/Header"
export default {
    name: "otherUrl",
    components: {
        PageHeader
    },
    data() {
        return {
            otherUrl:''
        };
    },
    created(){
        this.otherUrl = JSON.parse(JSON.stringify(this.$route.query.url))||""
    }
}

</script>
<style  lang="scss" scoped>
.otherUrl {
    height: 100vh;
    iframe{
        width: 100%;
        height: 100%;
    } 
}
</style>
