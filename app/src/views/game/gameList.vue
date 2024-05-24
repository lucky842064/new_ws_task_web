<template>
    <div class="gameList">
        <PageHeader :show-icon="true" title="游戏戏玩"></PageHeader>
        <ul>
            <li v-for="(item, i) in gameList" :key="i">
                <div class="left">
                    <img :src="require(`../../assets/images/zdq/igame${i+1}@2x.png`)">
                    <div>
                        <h2>{{item.name}}</h2>
                        <div class="num">{{item.player}}人在玩</div>
                    </div>
                </div>
                <div class="btn">立即玩</div>
            </li>
        </ul>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
export default {
    components: { PageHeader},
    data(){
        return {
            gameList: [
                {name: '冒险王OL', player: 100, img: '../../assets/images/zdq/igame1@2x.png'}, 
                {name: '谁是首富', player: 100, img: '../../assets/images/zdq/igame2@2x.png'},
                {name: '阴阳界', player: 100,   img: '../../assets/images/zdq/igame3@2x.png'}, 
                {name: '独步武林', player: 100, img: '../../assets/images/zdq/igame4@2x.png'},
            ],
        }
    },
    mounted(){
        console.log('mounted!')
    }
}
</script>
<style lang="scss" scoped>
.gameList{
    ul{
        padding: 32px;
        li{
            list-style: none;display: flex;align-items: center;justify-content: space-between;
            margin-bottom: 24px;
            .left{
                display: flex;align-items:center;
                img{
                    width: 124px;height: 124px;background-color: antiquewhite;
                    margin-right: 28px;
                }
                h2{
                    font-size: 32px;color: #141414;font-weight: bold;margin-bottom: 12px;
                }
                .num{
                    color: #84888F;font-size: 20px;
                }
            }
            .btn{
                width: 161px;height: 64px;background-color: #006BFF;border-radius: 32px;
                display: flex;align-items: center;justify-content: center;
                color: #FFFFFF;font-size: 32px;
            }
        }
    }
}
</style>