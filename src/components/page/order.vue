<template>
    <div style="background-color: #eaeeed">
        <div class="title">{{title}}</div>
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
          this.$root.$emit('head-title',this.title)
        }
    }
</script>
<style>
  .title {
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    font-size: 1.4rem;
    font-weight: 100;
    text-align: center;
    background: #246AC2;
    color: #FFF;
    position: relative;
  }
</style>
