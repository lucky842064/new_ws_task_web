<template>
    <div class="noticebar">
        <MarqueeTest :content="getListText()" :isScroll = "isScroll" :speed= speed :from="from"></MarqueeTest>
    </div>
</template>
<script>
import MarqueeTest from "../../components/Marquee";
export default {
    props: {
        from: {
            type: Boolean,
            default: false
        },
        isScroll: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: () => []
        }
    },
    components: { MarqueeTest },
    data() {
        return {
            speed:20,
            noticeCont: [],
            defaultNotice:[
                {text:"1.当众正式公布（如公告、布告或命令）"},
            ]
        };
    },
    created() {
       
    },
    
    methods: {
       
        getListText() {
            this.noticeCont=this.list
            let str = this.noticeCont.reduce((res, cur) => {
                res += cur.text + " ";
                return res;
            }, "");
            return str;
        },
       
    }
};
</script>
<style lang="scss" scoped>
.noticebar{
    margin: 0 24px 33px 24px;
    background-color: #F5F6FD;border-radius: 10px;
}
</style>
