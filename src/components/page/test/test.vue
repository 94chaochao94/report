<template>
 <div>
   <div class="vc-page">
     头部头部头部头部
     <content ref="scroller">
       <list>
         <item-cell v-for="item in items">
           <item-title>
             {{item}}
           </item-title>
         </item-cell>
       </list>
       <infinite-scroll :trigger="$refs.scroller" @load.native="loadMore" :loading="loading"></infinite-scroll>
     </content>
     尾部尾部尾部尾部尾部
   </div>
 </div>
</template>
<script>
  import Vue from 'vue';
  import VueCarbon from 'vue-carbon';
  import 'vue-carbon/dist/vue-carbon.css'; // 加载css文件
  Vue.use(VueCarbon);
  export default {
    data() {
      return {
        items: ['1', '2', '3','4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
        end: 20,
        loading: false
      }
    },
    components: {
//      badge,icon
    },
    methods: {
      loadMore () {
        console.log("come here");
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          if (this.end < 100) {
            for (let i = this.end; i < this.end + 20; i++) {
              this.items.push(String(i + 1));
            }
          }
          this.end = this.end + 20;
        }, 1000)
      },
    }
  }
</script>
<style>
</style>
