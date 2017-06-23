<template>
    <div class="orderContent">
      <div v-if="loading" style="text-align: center;padding-top: 30%">
        <img style="width: 50%" src="../../../../static/images/loading.gif"/>
        <p class="word">正在努力加载...</p>
      </div>
      <!--相关法条解析-->
      <div v-show="navName == 'laws'" @touchstart="moveStart()" @touchmove="move(1)">
       <ul>
         <li v-for="item in contentList" style="margin-bottom:3%">
           <div class="name">
             <div class="laws_dot"></div>
             <p class="laws_title">{{item.title}}</p>
             <span class="laws_tag" v-show="item.tag && item.tag != ''">{{item.tag}}</span>
             <p class="laws_content">{{item.content}}</p>
           </div>
         </li>
       </ul>
      </div>
      <!--司法观点推荐-->
      <div v-show="navName == 'points'" @touchstart="moveStart()" @touchmove="move(2)">
        <ul>
          <li v-for="(item, index) in contentList" style="margin-bottom:3%">
            <div class="name">
              <div class="points_dot"></div>
              <p class="laws_title">{{item.title}}</p>
              <div  v-if="item.show == false">
                <p class="points_content">{{item.content}}</p>
              </div>
              <div v-else>
                <p class="points_content" style="height:190px;overflow: hidden">{{item.content}}</p>
                <div class="case_more"><img @click="showMore(index)" src="../../../../static/images/case_more.png"/></div>
                <div class="case_part" style="display:none"><img @click="showPart(index)" src="../../../../static/images/case_part.png"/></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!--相关案例推荐-->
      <div v-show="navName == 'cases'" @touchstart="moveStart()" @touchmove="move(3)">
        <ul>
          <li v-for="(item, index) in contentList" style="margin-bottom:3%">
            <div class="name">
              <p class="cases_title">{{item.title}}</p>
              <div  v-if="item.show == false">
                <p class="cases_content">{{item.content}}</p>
              </div>
              <div v-else>
                <p class="cases_content" style="height:190px;overflow: hidden">{{item.content}}</p>
                <div class="cases_more"><img @click="caseMore(index)" src="../../../../static/images/case_more.png"/></div>
                <div class="cases_part" style="display:none"><img @click="casePart(index)" src="../../../../static/images/case_part.png"/></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!--诉讼风险评估-->
      <div v-show="navName == 'claims'" @touchstart="moveStart()" @touchmove="move(4)">
          <div class="claim">
            <p class="claim_title">您当前的诉讼请求支持率</p>
            <ul style="padding-bottom: 3%">
              <li v-for="item in contentList" style="margin-top: 3%">
                <p class="claim_tag">{{item.tag}}</p>
                <div>
                  <div class="per">
                    <img class="support" src="../../../../static/images/support.png"/>
                    <div class="claim_per">支持{{item.support}}%</div>
                  </div>
                  <p class="m-parent">
                    <span class="u-child" :style="{ width: item.support + '%' }"></span>
                  </p>
                  <div class="per">
                    <img class="reject" src="../../../../static/images/reject.png"/>
                    <div class="claim_per">驳回{{item.reject}}%</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="claim">
            <p class="claim_title">常见证据</p>
            <p class="sub_title">根据您的案件情形，建议您准备一下证据（仅供参考）</p>
            <ul style="padding-bottom: 3%">
              <li v-for="item in evidencesList" style="margin-top: 3%">
                <div class="evidence_tag">
                  <div class="evidence_dot"></div>
                  <div style="display: inline-block;">{{item.tag}}</div>
                </div>
              </li>
              <li style="clear: both"></li>
            </ul>
          </div>
          <div class="claim">
            <p class="claim_title">驳回诉讼请求原因分析</p>
            <ul style="padding-bottom: 3%">
              <li v-for="item in rejectList" style="margin-top: 3%">
                <p class="reject_tag">{{item.tag}}</p>
                <p class="reject-parent">
                  <span class="reject-child" :style="{ width: item.count/1000 + '%' }"></span>
                </p>
                <p class="reject_count">{{item.count}}</p>
              </li>
            </ul>
          </div>
      </div>
      <!--法律要点分析-->
      <div v-show="navName == 'law_tags'" @touchstart="moveStart()" @touchmove="move(0)">
        <ul style="padding-bottom: 3%">
          <li v-for="item in contentList">
            <div class="name">
              <p class="reject_tag">{{item.tag}}</p>
              <p class="reject-parent">
                <span class="reject-child" :style="{ width: item.count/10000 + '%' }"></span>
              </p>
              <p class="reject_count">{{item.count}}</p>
            </div>
          </li>
        </ul>
      </div>
      <!--诉讼流程指引-->
      <div v-show="navName == 'law_flow'" @touchstart="moveStart()" @touchmove="move(5)">
        <p class="flow-parent">
          <span class="flow-child" id="child" @click="disSuit()">非诉讼流程</span>
          <span class="flow-child2" id="child2" @click="suit()">诉讼流程</span>
        </p>
        <ul v-show="isSuit==false">
          <li style="margin-bottom:3%">
            <div class="name" style="padding-bottom: 3%">
              <p class="flow_nav">非诉讼流程</p>
              <div class="flow_dot"></div>
              <p class="flow_title">[人民调解]</p>
              <p class="flow_sub">当事人自愿在人民调解委员会的调解下达成协议的活动。</p>
              <p class="flow_content">当事人可以向人民调解委员会申请调解，人民调解员在当事人平等协商的基础上提出解决方案，帮助当事人自愿达成调解协议。</p>
              <p class="flow_content">调解协议书在各方当事人签名、盖章或者按指印，人民调解员签名并加盖人民调解委员会印章之日起生效。</p>
            </div>
          </li>
          <li style="margin-bottom:3%">
            <div class="name" style="padding-bottom: 3%">
              <div class="flow_dot"></div>
              <p class="flow_title">[支付令]</p>
              <p class="flow_sub">法院经债权人申请，发出的督促债务人偿还债务的法律文书。</p>
              <p class="flow_content">当事人申请支付令必须符合法律规定的条件，并且要交纳申请费用。</p>
              <p class="flow_content">法院审查后认为符合条件的，向对方当事人发出支付令；申请不成立的，裁定驳回。</p>
              <p class="flow_content">对方当事人自收到支付令之日起十五天内既不提出异议，又不履行的，申请人可以向法院申请执行。</p>
              <p class="flow_content">如果当事人提出的书面异议经法院审查成立的，支付令失效，转入诉讼程序，但是申请人不同意提起诉讼的除外。</p>
            </div>
          </li>
          <li style="margin-bottom:3%">
            <div class="name" style="padding-bottom: 3%">
              <div class="flow_dot"></div>
              <p class="flow_title">[仲裁]</p>
              <p class="flow_sub">当事人自愿达成协议，要求仲裁委员会对争议进行裁决的活动。</p>
              <p class="flow_content">当事人申请仲裁必须符合法律规定的条件，申请前必须先达成仲裁协议。</p>
              <p class="flow_content">仲裁庭在作出仲裁前，可以先进行调解，调解不成的应当及时作出裁决。仲裁裁决生效后，当事人可以向法院申请执行。</p>
              <p class="flow_content">婚姻、收养、监护、抚养、继承等特定身份关系的纠纷不能仲裁。劳动争议要先仲裁后才能去法院起诉。</p>
            </div>
          </li>
        </ul>
        <ul v-show="isSuit==true">
          <li style="margin-bottom:3%">
            <div class="name" style="padding-bottom: 3%">
              <p class="flow_nav">诉讼流程</p>
              <div class="flow_dot"></div>
              <p class="flow_title">[起诉]</p>
              <p class="flow_sub">当事人就民事纠纷向法院提起诉讼，请求法院依照法定程序进行审判的行为。</p>
              <p class="flow_content">当事人起诉必须要符合法律规定的起诉条件，携带相关的起诉材料，按照规定交纳诉讼费。</p>
              <p class="flow_content">必要的情况下，在起诉之前也可以向法院申请保全。</p>
            </div>
          </li>
          <li style="margin-bottom:3%">
            <div class="name" style="padding-bottom: 3%">
              <div class="flow_dot"></div>
              <p class="flow_title">[受理]</p>
              <p class="flow_sub">人民法院对当事人的起诉进行审查，对于符合法律规定的起诉条件的，决定予以立案审理的行为。</p>
              <p class="flow_content">法院需要对当事人的起诉条件进行审查，符合要求的，予以立案；不符合起诉条件的，裁定不予受理。</p>
              <p class="flow_content">当事人认为法院没有管辖权的，可以提起管辖权异议，法院审查认为异议成立的，裁定把案件移送给有管辖权的法院；异议不成立的，裁定驳回。</p>
            </div>
          </li>
          <li style="margin-bottom:3%">
            <div class="name" style="padding-bottom: 3%">
              <div class="flow_dot"></div>
              <p class="flow_title">[一审程序]</p>
              <p class="flow_sub">人民法院根据当事人的起诉依法对该案进行第一次审理所应当适用的程序。</p>
              <p class="flow_content">法院可以根据案件情况，在开庭前组织当事人进行调解，调解成功的，制作调解书；调解不成功的，法院会通知当事人参加庭审。当事人需要携带相关材料，在规定的时间到指定的地点参加开庭。在庭审过程中，当事人可以申请审判人员回避。法院经过开庭调查审理后，要在规定的期限内作出裁判，并告知当事人有上诉的权利。</p>
            </div>
          </li>
          <li style="margin-bottom:3%">
            <div class="name" style="padding-bottom: 3%">
              <div class="flow_dot"></div>
              <p class="flow_title">[二审程序]</p>
              <p class="flow_sub">当事人不服一审法院作出的裁判，在法定期限内向上一级人民法院提起上诉而引起的诉讼程序。</p>
              <p class="flow_content">当事人对民事一审裁判不服的，可以在判决书送达之日起十五天内提起上诉，并将上诉状提交给一审法院。一审法院收到上诉状后，应当通知对方当事人在规定时间内提交答辩状。</p>
              <p class="flow_content">二审法院经过审理，依法作出相应的处理。</p>
            </div>
          </li>
          <li style="margin-bottom:3%">
            <div class="name" style="padding-bottom: 3%">
              <div class="flow_dot"></div>
              <p class="flow_title">[再审程序]</p>
              <p class="flow_sub">法院、检察院发现已经生效的判决书、裁定书在事实认定或者法律适用上存在错误，依职权提起并由法院重新审判的诉讼程序。</p>
              <p class="flow_content">符合再审申请条件的，当事人在规定的时间内可以申请再审，并提交再审申请书等相关材料。法院经过审查，认为符合再审规定的，裁定再审；认为不符合规定的，裁定驳回申请。</p>
            </div>
          </li>
          <li style="margin-bottom:3%">
            <div class="name" style="padding-bottom: 3%">
              <div class="flow_dot"></div>
              <p class="flow_title">[强制执行]</p>
              <p class="flow_sub">法院依照法定程序，强制义务人履行法律文书所规定的义务的行为。</p>
              <p class="flow_content">民事判决书、裁定书生效后，当事人可以在规定的期限内向第一审法院或者与其同级的被执行的财产所在地法院申请强制执行。如果当事人、利害关系人认为执行违反法律规定的，可以提出书面异议。</p>
            </div>
          </li>
        </ul>
      </div>
      <!--相关文书模板-->
      <div v-show="navName == 'doc_temp'" @touchstart="moveStart()" @touchmove="move(6)">
        <ul>
          <li v-for="(item, index) in contentList" style="margin-bottom:3%">
            <div class="name" style="padding-bottom: 4%;padding-top: 4%">
              <a class="downTemp" @click="down(index,item.url)">
                <div class="points_dot"></div>
                <p class="temp_title">{{item.name}}</p>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
              contentList: [],
              evidencesList: [],
              rejectList: [],
              navName: '',
              isSuit: false,
              startX: '',
              startY: '',
              moveEndX: '',
              moveEndY: '',
              X: '',
              Y: '',
              more: [],
              part: false,
              dataList: {},
              loading: false
            }
        } ,
        created(){
          this.$root.$on('navName',(data)=>{
            this.navName = data;
          });
          this.$root.$on('contentList',(data)=>{
            this.contentList = data;
            console.log(9999, this.contentList);
          });
          this.$root.$on('evidencesList',(data)=>{
            this.evidencesList = data;
          });
          this.$root.$on('rejectList',(data)=>{
            this.rejectList = data;
          });
          this.$root.$on('dataList',(data)=>{
            this.dataList = data;
//            console.log(9999, this.dataList);
          });
          this.$root.$on('loading',(data)=>{
            this.loading = data;
//            console.log(888, this.loading);
          });
        },
        mounted() {

        },
        methods:{
          down(index, url) {
            var propUrl = 'http://xh.law.push.aegis-info.com' + url;
            document.getElementsByClassName('downTemp')[index].href = propUrl;
          },
          moveStart() {
            this.startX = event.touches[0].pageX;
            this.startY = event.touches[0].pageY;
          },
          move(index) {
            this.moveEndX = event.changedTouches[0].pageX;
            this.moveEndY = event.changedTouches[0].pageY;
            this.X = this.moveEndX - this.startX;
            this.Y = this.moveEndY - this.startY;
            this.$root.$emit('X', this.X);
            this.$root.$emit('Y', this.Y);
            this.$root.$emit('index', index);
          },
          showMore(index) {
            document.getElementsByClassName('points_content')[index].style.height = 'auto';
            document.getElementsByClassName('case_more')[index].style.display = 'none';
            document.getElementsByClassName('case_part')[index].style.display = 'block';
          },
          showPart(index) {
            document.getElementsByClassName('points_content')[index].style.height = '190px';
            document.getElementsByClassName('case_more')[index].style.display = 'block';
            document.getElementsByClassName('case_part')[index].style.display = 'none';
          },
          caseMore(index) {
            document.getElementsByClassName('cases_content')[index].style.height = 'auto';
            document.getElementsByClassName('cases_more')[index].style.display = 'none';
            document.getElementsByClassName('cases_part')[index].style.display = 'block';
          },
          casePart(index) {
            document.getElementsByClassName('cases_content')[index].style.height = '190px';
            document.getElementsByClassName('cases_more')[index].style.display = 'block';
            document.getElementsByClassName('cases_part')[index].style.display = 'none';
          },
          disSuit() {
            this.isSuit = false;
            var child2 = document.getElementById('child2');
            var child = document.getElementById('child');
            child.style.backgroundColor = "#0799fd";
            child.style.color = "white";
            child2.style.backgroundColor = "white";
            child2.style.color = "#0799fd";
          },
          suit() {
            this.isSuit = true;
            var child2 = document.getElementById('child2');
            var child = document.getElementById('child');
            child2.style.backgroundColor = "#0799fd";
            child2.style.color = "white";
            child.style.backgroundColor = "white";
            child.style.color = "#0799fd";
          }
        }
    }
</script>
<style lang="scss" scoped>
  @import '../../../style/page/order.scss';
  .word {
    font-size: 16px;
  }
</style>
