<template>
    <div class="orderTop">
        <swiper :options="swiperOption">
            <swiper-slide v-for="(nav,index) in titleList" :key="nav.id" :class="{'active':index==clickIndex}" @click.native="activeClick(index, nav)">
                {{nav.name}}
                <p></p>
            </swiper-slide>
        </swiper>
    </div>
</template>
<script>
    import { swiper, swiperSlide, swiperPlugins } from 'vue-awesome-swiper'

    export default {
      data(){
        return{
          clickIndex: 0,
          titleList: [{
            id: 0,
            name: '相关法条解析'
          }, {
            id: 1,
            name: '司法观点推荐'
          }, {
            id: 2,
            name: '相关案例推荐'
          }, {
            id: 3,
            name: '诉讼风险评估'
          }, {
            id: 4,
            name: '法律要点分析'
          }, {
            id: 5,
            name: '诉讼流程指引'
          }, {
            id: 6,
            name: '相关文书模板'
          }],
          orderList:'',
          slideActiveIndex:'',
          swiperOption: {
            slidesPerView: 'auto',
            simulateTouch: true
          },
          index: '',
          X: '',
          Y: '',
          qid: '',
          initData: {}
        }
      } ,
      components: {
        swiper,
        swiperSlide
      },
      created(){
        this.$root.$on('X',(data)=> {
          this.X = data;
        });
        this.$root.$on('Y',(data)=> {
          this.Y = data;
        });
        this.$root.$on('index',(data)=>{
          this.index = data;
          var index = '';
          if(Math.abs(this.X) > Math.abs(this.Y) && this.X > 0 && this.index > 0 && this.index <= 6) {
            index = this.index - 1;
          } else if(Math.abs(this.X) > Math.abs(this.Y) && this.X < 0 && this.index < 6 && this.index >= 0) {
            index = this.index + 1;
          } else {
            return;
          }
          var propObj = {};
          this.titleList.forEach(item => {
            if(item.id == index) {
              propObj = Object.assign({}, item);
            }
          });
          this.activeClick(index, propObj);
        });
      },
      mounted() {
        this.getQueryString();
        this.axios.post('https://xcx.wechat.aegis-info.com/api/android/law_push/test?axios=1',{"json":JSON.stringify({"qid":this.qid})}).then((response)=>{
          let data = response.data;
          this.initData = data.data;
          if(JSON.stringify(data.data) == "{}") {
            this.$root.$emit('loading',true);
            setTimeout(function(){
              var that = this;
              that.axios.post('https://xcx.wechat.aegis-info.com/api/android/law_push/test?axios=1',{"json":JSON.stringify({"qid":this.qid})}).then((res)=>{
                this.initData = res.data.data;
                this.$root.$emit('loading',false);
              }).then((res)=>{
                location.reload();
                this.$root.$emit('loading',false);
              })
            }.bind(this),10000);
          }
          this.$root.$emit('dataList',this.initData);
          //首次加载页面
          this.clickIndex = 0;
          this.$root.$emit('contentList',data.data.laws);
          this.$root.$emit('navName','laws');
        }).catch((err)=>{
          console.log(err);
        });
      },
      methods: {
        getQueryString() {
          var test = window.location.href.split('qid=');
          this.qid = test[1];
          console.log("qid: " + this.qid);
        },

        activeClick(index, item){
          this.clickIndex = index;
          let propName = "";
          if(item.id == 4) {
            propName = "law_tags";
          } else if(item.id == 0) {
            propName = "laws";
          } else if(item.id == 1) {
            propName = "points";
          } else if(item.id == 2) {
            propName = "cases";
          } else if(item.id == 3) {
            propName = "claims";
          } else if(item.id == 5) {
            propName = "law_flow";
          } else if(item.id == 6) {
            this.axios.post('http://192.168.11.88:7050/api/android/law_push/document_template').then((res) => {
//              console.log(111, res.data.data);
              propName = "doc_temp";
              this.swiperOption.onTap = (e)=>{
                this.clickIndex = e.clickedIndex;
                this.$root.$emit('navName',propName);
                this.$root.$emit('contentList',res.data.data);
                this.$root.$emit('slideActive',this.slideActiveIndex[this.clickIndex]);
                this.$root.$emit('topIndex',this.clickIndex);
              }
              this.$root.$emit('navName',propName);
              this.$root.$emit('contentList',res.data.data);
              this.$root.$emit('slideActive',this.slideActiveIndex[this.clickIndex]);
              this.$root.$emit('topIndex',this.clickIndex);
            })
          }
          let propContent = '';
          for(var key in this.initData) {
            this.initData.points.forEach(item => {
              if(item.content && item.content.length > 210) {
                item.show = true;
              }else {
                item.show = false;
              }
            });
            this.initData.cases.forEach(item => {
              if(item.content && item.content.length > 210) {
                item.show = true;
              }else {
                item.show = false;
              }
            })
          }
          //激活当前swiper点击 active
          this.swiperOption.onTap = (e)=>{
            this.clickIndex = e.clickedIndex;
            //contentList列表值
            this.$root.$emit('contentList',this.initData[propName]);
            this.$root.$emit('evidencesList',this.initData.evidences);
            this.$root.$emit('rejectList',this.initData.reject_cause);
            //topNav值
            this.$root.$emit('navName',propName);
            //设置改点击的nav对应的slide的状态
            this.$root.$emit('slideActive',this.slideActiveIndex[this.clickIndex]);
            this.$root.$emit('topIndex',this.clickIndex);
          }
          this.$root.$emit('contentList',this.initData[propName]);
          this.$root.$emit('evidencesList',this.initData.evidences);
          this.$root.$emit('rejectList',this.initData.reject_cause);
          this.$root.$emit('navName',propName);
          this.$root.$emit('slideActive',this.slideActiveIndex[this.clickIndex]);
          this.$root.$emit('topIndex',this.clickIndex);
        }
      }
    }
</script>
<style lang="scss" scoped>
  @import '../../../style/page/order.scss';
  .more_icon {
    z-index: 1;
    position: fixed;
    right: 0px;
    width: 10%;
    height: auto;
    background-color: #6da2e4;
    top: 7%;
    padding-top: 2%;
  }
</style>
