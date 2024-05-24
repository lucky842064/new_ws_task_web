<!--
    支持用户输入和下拉筛选框

    <InputSear :showName="true" v-model="model_name" placeholder="请输入***" :datalist="[{value:1, name:11}]" />
        showName: 否显在列表中显示 name 值, 默认:false
        v-model: 父级绑定的变量名
        placeholder: 默认提示语
        datalist: 输入时检索的列表，支持数组 [1,2,3], 或数组对象 [{value:1, name:11}]

    ** 输入时检索只匹配 value 值，不匹配 name，因为输入直接绑定父级变量
    ** 如需要检索 name 值，请参考 iview 的 select + filterable，https://www.iviewui.com/components/select#KSS
-->

<template>
    <div class="input_sear">
      
        <!-- <Input
            clearable
            type="text"
            icon="ios-arrow-down"
            :placeholder="`${placeholder}`"
            :disabled="disabled"
            :value="value"
            @on-change="UserInput"
            @on-focus="OpenQuickSel"
            @on-blur="CloseQuickSel"
        ></Input> -->
        <input type="text" id="mainput" v-model="val" :placeholder="`${placeholder}`"  :disabled="disabled"
            @focus="OpenQuickSel"
            @blur="CloseQuickSel">
        <!-- <van-cell-group >
            <van-field id="mainput"  v-model="val" :placeholder="`${placeholder}`"
            right-icon="arrow-down"
            :disabled="disabled"
            @focus="OpenQuickSel"
            @blur="CloseQuickSel"
            />
        </van-cell-group> -->
        <ul :class="{slist: true, open: sear_box.open}">
            <li v-for="(item, index) in sear_box.show_list" :key="index.value" @click="QuickSel(item.value)">
                {{item.value}}
                <span v-show="showName" style="float:right;">{{item.name}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'input_sear',
    props: ['placeholder', 'value', 'datalist', 'showName', 'disabled'],
    data(){
        return {
            val: this.value,
            sear_box: {
                open: false,
                show_list: [],
            }
        }
    },
    computed: {
        datalist_new(){
            let dlist = this.datalist
            let datalist_new = []
            if(dlist.length){
                if(dlist[0].value==null||dlist[0].value==undefined){
                    this.datalist.map(item => {
                        datalist_new.push({
                            value: item,
                            name: item
                        })
                    })
                }else{
                    datalist_new = this.datalist
                }
            }
            return datalist_new
        },
    },
    methods: {
        OpenQuickSel(){
            this.sear_box.open = true
            this.sear_box.show_list = this.datalist_new
        },

        CloseQuickSel(){
            setTimeout(() => {
                this.sear_box.open = false
            }, 150);
        },

        QuickSel(val){
            this.val = val
            this.$emit('changeCode', val)
        },

        UserInput(event){
            let str = event.target.value;
            this.sear_box.show_list = this.datalist_new.filter(v => v.value.indexOf(str)>-1)
            this.$emit('changeCode', str)
        },
    },
    created(){
        
    },
     watch:{
       "val"(newV,oldV){
            let str = newV;
            this.sear_box.show_list = this.datalist_new.filter(v => v.value.indexOf(str)>-1);
            this.$emit('changeCode', str)
        }
    },
}
</script>

<style lang="scss" scoped>
.van-cell {
    
    padding: 0 10px;
    margin-top: 0.25rem;

}
.input_sear{
    position: relative;
    height: 0.45rem;
    // clear: both;
    // height:auto!important;
    input{
        width: 80%;
        // height: 100%;
        outline: none;
        border: 0;
        padding:0 10%;
    }
    .slist{
       box-shadow: 0 0.8rem 0.5rem rgba(0, 0, 0, 0.2);
        position: absolute;
        z-index: -99999;
        width: 5rem;
        left: 0;
        top: 0.7rem;
        list-style: none;
        border-radius: 0.04rem;
        max-height:4rem;
        overflow: auto;
        transform: scaleY(0.8);
        transition-property: "*";
        transition-duration: .4s;
        will-change: top, left;
        transform-origin: center top;
        opacity: 0;
        border: 1px solid #ccc;
        cursor: pointer;
        span {
            color: #333;
        }
        li{
            box-sizing: border-box;
            background: #FFF;
            padding:0.05rem 0.15rem;
            width:100%;
            line-height: 0.5rem;
            font-size:0.2rem;
            &:hover{
                background: #f3f3f3;
            }
        }
        &.open{
            z-index: 99999;
            transform:scaleY(1);
            opacity: 1;
        }
    }
}
#mainput::-webkit-input-placeholder {
  color: #a7a7a7!important;
}
#mainput:-moz-placeholder {/* Firefox 18- */
    color: #a7a7a7!important;
}
#mainput:-moz-placeholder{/* Firefox 19+ */
  color: #a7a7a7!important;
}
#mainput:-ms-input-placeholder {
    color: #a7a7a7!important;
}
</style>
