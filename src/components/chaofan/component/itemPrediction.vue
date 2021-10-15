<template>
 <div @click.stop="" class="display prid">  
   <!-- <div class="p_left">
     <div class="p_title">{{item.title}}</div>
   </div> -->
   <div v-if="!checkoutVote(item.options)" class="p_right">
     <div v-for="(its,ind) in item.options" :key="ind" @click.stop="chooseItem(its,ind)" class="p_li">
       {{its.optionName}}
     </div>
     <div v-if="$route.path!='/prediction'" @click.stop="toMore" class="p_li p_li_btn">
       查看更多竞猜
     </div>
   </div>
   <div v-if="checkoutVote(item.options)" class="p_right p_right_2">
     <div v-for="(its,ind) in item.options" :key="ind" class="p_li">
       
       <div class="bg" :style="{width: doBg(its,item.options)}"></div>
        <div class="b">
            <div class="c"><span>{{its.optionVote}}</span> {{its.optionName}}</div>
            <div class="icons">
              <img v-if="item.chooseOption==(ind+1)" src="../../../assets/images/icon/success.png" alt="">
            </div>
        </div>
     </div>
     <div v-if="$route.path!='/prediction'" @click.stop="toMore" class="p_li p_li_btn">
       查看更多竞猜
     </div>
     <!-- <div v-for="(its,ind) in item.options" :key="ind" class="a">
                  <div class="bg" :style="{width: doBg(its,item.options)}"></div>
                  <div class="b">
                      <div class="c"><span>{{its.optionVote}}</span> {{its.optionName}}</div>
                      <div class="icons">
                        <img v-if="item.chooseOption==(ind+1)" src="../../../assets/images/icon/success.png" alt="">
                      </div>
                  </div>
                </div> -->
   </div>
    <!-- <div class="item_article">
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
    </div> -->
    <new-dialog>
      <template v-slot:content>
        <div class="ts">
          <div @click="close" class="close el-icon-close"></div>
          <div class="tmain">
            <div class="t_title">
              <p>你选择了</p>
              <p>“ {{selectLine.optionName}} ”</p>
            </div>
            <div class="desc">你的剩余积分：{{userData.restTokens}}</div>
            <div class="counts">
              <div class="cc">
                <div @click="dealNum('1')" class="reduce el-icon-remove-outline"></div>
                <span disabled  type="text" class="nums">{{nums}}</span>
                <div @click="dealNum('2')" class="reduce el-icon-circle-plus-outline"></div>
              </div>
            </div>
          </div>
          <div class="t_bottom">
            <div @click="sure" class="sure">确定</div>
          </div>
        </div>
      </template>
    </new-dialog>
 </div>
</template>

<script>
import * as api from '@/api/api'
import newDialog from '../../../layout/components/dialog/newDialog'
 export default {
   name: '',
   data(){
     return {
         tokens: null,
         dialogVisible: false,
         nums: 10,
         userData: {},
         selectLine: {},
         ids: ''
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
     newDialog
   },
   created() {
     
   },
   mounted() {
    this.getScore()
   },
   methods: {
     toMore(){
       this.$router.push({name: 'prediction'})
     },
     sure(){
       if(this.nums>0){
         let params = {postId: this.item.postId,option: this.ids+1,tokens: this.nums};
         api.toVote(params).then(res=>{
           if(res.success){
             this.$toast('竞猜成功')
              this.$EventBus.$emit("new-dialog", false);
              setTimeout(()=>{
                api.getPostInfo({postId: this.item.postId}).then(res=>{
                      this.item = res.data;
                      this.$emit('callBack',this.index,res.data);
                      this.$EventBus.$emit('eventRefresh');
                })
              },500)
           }else{
             this.$toast(res.errorMessage)
           }
           
           
            
         })
       }
     },
     getScore(){
       let params = {
         predictionsTournamentId: this.item.predictionsTournament.id
       }
       api.checkJoin(params).then(res=>{
         if(!res.data){
           this.$alert('你确定要参加本次竞猜吗', '参加本次竞猜默认会给你本次竞猜1000积分，只作用于本次有奖竞猜活动', {
            confirmButtonText: '确定',
            callback: action => {
              if (action == 'confirm') {
                // this.toSetTokens(item, index);
                api.predictionsjoin(params).then(res=>{
                    this.getScore()
                })
              }
            }
          });
           
         }else{
           this.userData = res.data;
         }
       })
     },
     dealNum(v){
       if(v==1){
         if(this.nums-10>0){
           this.nums -= 10;
         }else{
           this.nums = 0;
         }
       }else{
        //  if(this.nums-10>0){
           this.nums += 10;
        //  }else{
          //  this.nums = 0;
        //  }
       }
     },
     chooseItem(v,vs){
       if(this.item.predictionsStatus=='live'){
         this.getScore()
          setTimeout(()=>{
            this.ids = vs;
              this.selectLine = v;
              this.$EventBus.$emit("new-dialog", true);
          })
       }
       
       
     },
     close(){
       this.$EventBus.$emit("new-dialog", false);
     },
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
       console.log(it)
      //  var num = it.optionVote;
      //  var total = 0;
      //  its.forEach(item=>{
      //    //  if(item.optionVote){
      //    total += item.optionVote*1;
      //    //  }
      //  })
       return (it.width).toFixed(2)+'%';
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
.prid{
  background: #303030;
  height: 300px;
  margin-bottom: 10px;
  border-radius: 8px;
  padding: 28px 50px;
  display: flex;
  align-items: center;
  .p_left{
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #666;
    flex: 0 0 150px;
    box-sizing: border-box;
    // display: grid;
    padding: 12px;
    border-radius: 8px;
    .p_title{
      color: #fff;
      line-height: 28px;
      font-size: 18px;
    }
  }
  .p_right{
    flex: 1;
    .p_li{
      line-height: 38px;
      border-radius: 20px;
      font-size: 16px;
      text-align: center;
      color: #fff;
      border: 1px solid #fff;
      margin-bottom: 16px;
      &:hover{
        background: rgba(102, 102, 102,0.7);
      }
    }
  }
  .p_right_2{
    .p_li{
      text-align: left;
      display: flex;
      position: relative;
      .bg{
        position: absolute;
        background: #ffbc5d;
        width: 50%;
        left: 1px;
        top: 1px;
        bottom: 1px;
        border-radius: 30px;
      }
      .b{
        position: relative;
        z-index: 1;
        // padding: 0 10px;
        display: flex;
        width: 100%;
        // padding: 4px 10px;
        // min-height: 40px;
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
      .icons{
        img{
          margin-right: 10px;
          vertical-align: middle;
        }
      }
    }
  }
}
.ts{
  width: 375px;
  height: 320px;
  background: #fff;
  position: relative;
  margin-top: -100px;
  border-radius: 8px;
  padding: 50px 30px 20px;
  box-sizing: border-box;
  .tmain{
    text-align: center;
    
    .t_title{
      font-size: 18px;
      line-height: 30px;
    }
    .desc{
      margin: 10px 0;
      color: #666;
      font-size: 15px;
    }
    .counts{
      padding: 20px 0;
    }
    .nums{
      display: inline-block;
      cursor: pointer;
      width: 80px;
      text-align: center;
      background: #f1f1f1;
      border-radius: 20px;
      line-height: 44px;
      margin: 0 10px;
      vertical-align: middle;
      text-align: center;
      -moz-user-select: none;/*火狐*/
        -webkit-user-select: none;/*webKit 浏览器*/
        -ms-user-select: none;/*IE10*/
        -khtml-user-select: none;/*低版本浏览器*/
        user-select: none;
    }
    .reduce{
      font-size: 44px;
      vertical-align: middle;
    }
  }
  .sure{
    background: linear-gradient(90deg,#ec0623 0,#ff8717);
    line-height: 44px;
    text-align: center;
    border-radius: 24px;
    margin-top: 20px;
    font-size: 16px;
    color: #fff;
  }
  .close{
    font-size: 28px;
    color: #999;
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
.p_li_btn{
  background: linear-gradient(90deg,#ec0623 0,#ff8717);
  margin-top: 30px;
  width: 210px;
  margin: 30px auto;
}
.el-dialog{
  z-index: 3000;
}
// .title{
//     padding: 0 0 10px 0;
//     font-size: 16px;
//     font-weight: 600;
// }
// .vote{
//     padding-bottom: 12px !important;
//   }
//   .vote_header{
//     display: flex;
//     div{
//       flex: 0 0 150px;
//       line-height: 34px;
//       // background: #ddd;
//       font-size: 14px;
//       color: #999;
//     }
//   }
//   .radio_item{
//     padding: 10px 0 8px !important;
//     width: 100%;
//     box-sizing: border-box;
//     display:block;width:100%;white-space: pre-wrap;word-break: break-all;
//     line-height: 22px;
//   }
//   .el-radio{
//     width: 100%;
//   }
//   .vote_bottom{
//     display: flex;
//     margin-top: 20px !important;
//     .toup,.weig{
//       flex: 0 0 100px;
//       line-height: 34px;
//       margin-right: 20px;
//       border: 1px solid #ddd;
//       text-align: center;
//       border-radius: 4px;
//     }
//     .toup{
//       background: #07c160;
//       color: #fff;
//     }
//   }
//   .has_choose{
//     .a{
//       width: 100%;
//       // line-height: 40px;
//       border: 1px solid #f1f1f1;
//       margin-bottom: 8px;
//       position: relative;
//       border-radius: 4px;
//       .bg{
//         position: absolute;
//         background: #ffbc5d;
//         width: 50%;
//         left: 0;
//         top: 0;
//         bottom: 0;
//       }
//       .b{
//         position: relative;
//         z-index: 1;
//         padding: 0 10px;
//         display: flex;
//         width: 100%;
//         padding: 4px 10px;
//         min-height: 40px;
//         .c{
//           align-items: center;
//           flex: 1;
//           display: flex;
//           align-items: center;
//           span{
//             display: inline-block;
//             width: 30px;
//             font-weight: bold;
//             text-align: center;
//           }
//         }
//         .img{
//           flex: 0 0 40px;
//           text-align: center;
//           vertical-align: middle;
//         }
//       }
//     }
//   }
//   .icons{
//     img{
//       vertical-align: middle;
//     }
//   }
</style>
