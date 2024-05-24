<template>
    <div class="branchDetail">
        <PageHeader :show-icon="true" title="下属管理"></PageHeader>
        <div class="select_ct">
            <div class="select" @click="dateShow = !dateShow"><span class="date">{{currDate}}</span><i class="angle_down"></i></div>
            <span class="btn" @click="search">搜素</span>
        </div>
        <div class="content">
            <div class="item" v-for="(item, i) in itemList" :key="i">
                <div class="left">
                    <span>账号：</span><em>{{item.user_key}}</em>
                </div>
                <div class="right">
                    <span>任务完成量：</span><em>{{item.complete_num}}单</em>
                </div>
            </div>
        </div>
        <div class="nodata" v-if="finished">没有更多了~</div>
        <van-calendar v-model="dateShow" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm" />
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
import { teamlist } from '@/api/earn.js'
export default {
    components: { PageHeader},
    data(){
        return {
            itemList: [],
            param:{
                page: 1,
                limit: 20,
            },
            loading: false,
            finished: false,
            currDate: '2020-02-02',
            minDate: new Date(1981, 1, 1),
            maxDate: new Date(2030, 1, 31),
            dateShow: true,
        }
    },
    created(){
        const date = new Date()
        this.currDate = date.getFullYear()+'-'+ this.adjustNum(date.getMonth()+1)+'-'+  this.adjustNum(date.getDate())
        this.getData()
    },
    beforeMount(){
        this.dateShow = false
    },
    mounted(){
        this.$nextTick(() => {
            window.addEventListener('scroll', this.loadMore)
            // document.querySelector('.branchDetail').addEventListener('scroll', this.loadMore)
        })
    },
    beforeDestroy(){
        window.removeEventListener('scroll', this.loadMore)
    },
    methods:{
        onConfirm(date){
            this.currDate = date.getFullYear()+'-'+ this.adjustNum(date.getMonth()+1)+'-'+  this.adjustNum(date.getDate())
            this.dateShow = false;
        },
        adjustNum(num){
            if(num < 10) return '0'+num
            return num
        },
        search(){
            this.param.page = 1;
            this.itemList = []
            this.loading = false
            this.finished = false
            this.getData()
        },
        loadMore(){
            const scrollH = document.documentElement.scrollHeight
            const scrollTop = document.documentElement.scrollTop
            const clientH = document.documentElement.clientHeight
            if(scrollTop + clientH + 5 > scrollH){
                this.getData()
            }
        },
        getData(){
            if(this.loading) return
            if(this.finished) return
            this.loading = true
            teamlist({
                ...this.param,
                idate: Number(this.currDate.split('-').join(''))
            }).then(res => {
                console.log('branchDetail', res)
                this.loading = false
                this.itemList.push.apply(this.itemList, res.list || [])
                if(this.itemList.length >= res.total){
                    this.finished = true
                }else {
                    this.param.page++;
                }
            }).catch(() => {
                this.loading = false
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.branchDetail{
    .ct{
        overflow-y: scroll;
    }
    .content{
        // height: calc(100vh - 88px);overflow: scroll;
        .item{
            display: flex;align-items: center;height: 104px;border-bottom: 1px solid #eee;
            >div{
                display: flex;align-items: center;
            }
            span{
                color: #999999;font-size: 24px;
            }
            .left{
                margin-left: 32px;
                em{
                    color: #141414;font-size: 24px;font-style: normal;
                }
            }
            .right{
                margin-left: 145px;
                em{
                    color: #FF5500;font-size: 24px;font-style: normal;
                }
            }
        }
        
    }
    .nodata{
            display: flex;align-items: center;height: 104px;justify-content: center;color: #999999;font-size: 24px;
        }
    .select_ct{
        padding:10px 30px;display:flex;
        .select{
            display: flex;width: 220px;background-color: #f2f2f2;align-items:center;justify-content:center;
            height: 60px;border-radius: 30px;
            >i{margin-left: 10px;}
            .date{
                color: #333;font-size: 24px;
            }
            .angle_down{
                display: inline-block;border-top: 10px solid #999;
                border-left: 10px solid transparent;border-right: 10px solid transparent;
            }
            .angle_up{
                display: inline-block;border-bottom: 10px solid #999;
                border-left: 10px solid transparent;border-right: 10px solid transparent;
            }
        }
        .btn{
            display: inline-block;background-color: $color-theme;width: 120px;height: 60px;border-radius: 30px;
            text-align: center;line-height: 60px;color:#fff;font-size: 24px;margin-left: 14px;
        }
    }
    ::v-deep{
        .van-button--danger{
            background-color: $color-theme;
            border: 1px solid $color-theme;
        }
        .van-calendar__selected-day{
            background-color: $color-theme;
        }
    }
}
</style>
<style>
html, body, #app{
    height: auto !important;
    overflow: auto !important;
}
</style>