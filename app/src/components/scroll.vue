<!--  -->
<template>
   <div class="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
export default {
    name:"scroll",
    data () {
        return {
        }
    },
    props:{
        handelStartScroll:{
            type:Function,
            default:function(){}
        },
        handelScroll:{
            type:Function,
            default:function(){}
        },
        handelTouchEnd:{
            type:Function,
            default:function(){}
        }
    },
  mounted(){
    this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: 1,
        click:true
    })
    this.scroll.on('scrollStart',(pos)=>{
        this.handelStartScroll(pos)
    }) 
    this.scroll.on('scroll',(pos)=>{
        this.handelScroll(pos)
    })  
    this.scroll.on('touchEnd',(pos)=>{
        this.handelTouchEnd(pos)
    })
  }
}

</script>
<style scoped>
    .wrapper{
        height: 100vh;
    }
</style>