<template>
    <div style="background-color: #eaeeed">
        <order-top></order-top>
        <order-content></order-content>
    </div>
</template>
<script>
    import orderTop from './order/orderTop'
    import orderContent from './order/orderContent'
    export default{
        data(){
            return{
              title:'咨询报告'
            }
        },
        components: {
          orderTop,orderContent
        },
        mounted () {
//          this.$root.$emit('head-title',this.title)
        }
    }
</script>
<style>
</style>
