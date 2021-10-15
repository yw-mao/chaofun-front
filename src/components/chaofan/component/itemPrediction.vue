<template>
 <div>  
    <div  class="item_article">
        <div  @click.stop="" :class="['vote']">
            <div class="vote_header">
              <div>竞猜：{{item.optionVoteCount}}人</div>
            </div>
            <div v-if="!checkoutVote(item.options)">
                <el-radio-group style="width:100%;" v-model="item.chooseOption">
                    <el-radio v-for="(its,ind) in item.options" :key="ind" class="radio_item" :label="(ind+1)">{{its.optionName}}</el-radio>
                </el-radio-group>
            </div>
            <div v-if="checkoutVote(item.options)" class="has_choose">
                <div v-for="(its,ind) in item.options" :key="ind" class="a">
                  <div class="bg" :style="{width: doBg(its,item.options)}"></div>
                  <div class="b">
                      <div class="c"><span>{{its.optionVote}}</span> {{its.optionName}}</div>
                      <div class="icons">
                        <img v-if="item.chooseOption==(ind+1)" src="../../../assets/images/icon/success.png" alt="">
                      </div>
                  </div>
                </div>
            </div>
            <div v-if="!checkoutVote(item.options) && item.predictionStatus === 'live'" class="vote_bottom">
              <div @click="toPredict(item,index)" class="toup">竞猜</div>
            </div>
            <div v-if="item.predictionStatus === 'pause'" class="vote_bottom">
              <el-button>竞猜正在等待结果</el-button>
            </div>
            <div v-if="item.predictionStatus === 'end'" class="vote_bottom">
              <el-button>竞猜已出结果</el-button>
            </div>
            <el-button @click="toPredictionsTournament(item.predictionsTournament.id)" style="width: 100%;margin-top: 10px">{{item.predictionsTournament.name}}</el-button>
        </div>
    </div>
 </div>
</template>

<script>
import * as api from '@/api/api'
 export default {
   name: '',
   data(){
     return {
         tokens: null
     }
   },
   props: {
       item: {
           type: Object,
           default(){
               return {}
           }
       },
       index: {
           type: Number,
           default: 0
       }
   },
   components: {

   },
   created() {
   },
   mounted() {
    
   },
   methods: {
     checkoutVote(list){
       var a = false;
       list.forEach(item=>{
         if(item.optionVote){
           a = true;
         }
       })
       return a;
     },
     doBg(it,its){
       var num = it.optionVote;
       var total = 0;
       its.forEach(item=>{
         //  if(item.optionVote){
         total += item.optionVote*1;
         //  }
       })
       return (num*100/total).toFixed(2)+'%';
     },
     toPredictionsTournament(id) {
       this.$toast('还未支持跳转')
     },

     toPredict(item, index) {
       this.doLoginStatus().then(r=> {
         if (r) {
            this.checkJoin(item, index)
         }
       })
     },

     joinConfirm(item, index) {
       this.$alert('默认会给你本次竞猜活动「1000」积分，只作用于本次有奖竞猜活动(一个活动有多个竞猜)，本次竞猜活动积分不能兑换任何实物,只用于排名。你确定要参加本次竞猜活动?', '参加本次竞猜活动？', {
         confirmButtonText: '确定',
         callback: action => {
           if (action == 'confirm') {
             api.joinPredictionsTournament({predictionsTournamentId: item.predictionsTournament.id}).then(res => {
               this.checkJoin(item, index);
             })
           }
         }
       });
     },

     checkJoin(item, index) {
       api.checkJoinTournament({predictionsTournamentId: item.predictionsTournament.id}).then(res=> {
         console.log("get checkJoinTournament")
         console.log(res)
          // 如果参加了，直接设置竞猜金额
          if (res.data !== null) {
            this.toSetTokens(item, index, res.data);
          } else {
            this.joinConfirm(item, index);
          }
       });
     },

     toSetTokens(item, index, data) {
       this.$prompt('请输入下注积分, 本次活动剩余积分: ' + data.restTokens , '下注', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         inputPlaceholder: '请输入',
         inputPattern: /[0-9]/,
         inputErrorMessage: '必须是数字'
       }).then(({ value }) => {
         this.toToup(item, index, value)
       }).catch(() => {
         this.$message({
           type: 'info',
           message: '取消输入'
         });
       });
     },

     toToup(item,index, value){
       // 这里的 Tokens 就是竞猜积分
       api.toVote({postId: item.postId, option: item.chooseOption, tokens: value}).then(res=>{
         api.getPostInfo({postId: item.postId}).then(res=>{
           this.item = res.data;
           this.$emit('callBack',index,res.data);
           this.$EventBus.$emit('eventRefresh');
           // this.lists.splice(index,1,res.data)
         })
       })
     },
   }
 }
</script>

<style type='text/scss' lang='scss' scoped>
.title{
    padding: 0 0 10px 0;
    font-size: 16px;
    font-weight: 600;
}
.vote{
    padding-bottom: 12px !important;
  }
  .vote_header{
    display: flex;
    div{
      flex: 0 0 150px;
      line-height: 34px;
      // background: #ddd;
      font-size: 14px;
      color: #999;
    }
  }
  .radio_item{
    padding: 10px 0 8px !important;
    width: 100%;
    box-sizing: border-box;
    display:block;width:100%;white-space: pre-wrap;word-break: break-all;
    line-height: 22px;
    // background: #f1f1f1;
    // border-bottom: 1px solid #f1f1f1;
  }
  .el-radio{
    width: 100%;
  }
  .vote_bottom{
    display: flex;
    margin-top: 20px !important;
    .toup,.weig{
      flex: 0 0 100px;
      line-height: 34px;
      margin-right: 20px;
      border: 1px solid #ddd;
      text-align: center;
      border-radius: 4px;
    }
    .toup{
      background: #07c160;
      color: #fff;
    }
  }
  .has_choose{
    .a{
      width: 100%;
      // line-height: 40px;
      border: 1px solid #f1f1f1;
      margin-bottom: 8px;
      position: relative;
      border-radius: 4px;
      .bg{
        position: absolute;
        background: #ffbc5d;
        width: 50%;
        left: 0;
        top: 0;
        bottom: 0;
      }
      .b{
        position: relative;
        z-index: 1;
        padding: 0 10px;
        display: flex;
        width: 100%;
        padding: 4px 10px;
        min-height: 40px;
        .c{
          align-items: center;
          flex: 1;
          display: flex;
          align-items: center;
          span{
            display: inline-block;
            width: 30px;
            font-weight: bold;
            text-align: center;
          }
        }
        .img{
          flex: 0 0 40px;
          text-align: center;
          vertical-align: middle;
        }
      }
    }
  }
  .icons{
    img{
      vertical-align: middle;
    }
  }
</style>
