<template>
    <div class="otherUrl">
        <iframe :src="url" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {
    name: "kefu",
    data() {
        return {
            url:''
        };
    },
    created(){
        this.url = JSON.parse(JSON.stringify(this.$route.query.url))||""
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
