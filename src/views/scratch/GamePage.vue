<template>
  <div class="container">
    <div class="back_home">
      <el-button @click="goHome" size="small" round>←返回小测验首页</el-button>
      <el-button @click="share" size="small"  round>分享</el-button>
      <el-button @click="random" size="small"  round>随机下一个</el-button>
      <el-button size="small"  v-if="guessInfo &&  this.$store.state.user && this.$store.state.user.userInfo  && this.$store.state.user.userInfo.userId === this.guessInfo.userId" @click="modify" round>修改</el-button>
    </div>
    <div v-if="guessInfo" style="padding-top: 3rem; margin: auto; text-align: center; font-size: 32px">
      {{this.guessInfo.name}}
    </div>
    <div v-if="guessInfo" style="margin: auto; text-align: center; font-size: 16px">
      {{this.guessInfo.desc}}
    </div>
    <div v-if="guessInfo && guessInfo.user" style="margin: auto; text-align: center; font-size: 16px">
      作者: {{guessInfo.user.userName}}
    </div>
    <div v-if="guessInfo" style="margin: auto; text-align: center; font-size: 16px">
      测验次数: {{guessInfo.start}}
    </div>

    <div class="input_container" style="">
      <div v-if="start || this.giveUp"  style="font-size: 36px; color: #52B323; padding-right: 20px; display: block; height: 100%; text-align: center; align-items: center">
        {{timeLeftStr}}
      </div>

      <div v-if="start" class="input" style="height: 100%">
        <div v-if="guessInfo">
          猜对：{{this.right}} / {{this.guessInfo.data.answers.length}}
        </div>
        <el-input ref="input" autofocus @input="match" v-model="inputResult">
        </el-input>
      </div>
    </div>
    <div v-if="!showResult">

      <div v-if="!start && guessInfo && !giveUp" style="margin: auto; text-align: center; padding-top: 1rem">
        <el-button type="primary" style="margin: auto; text-align: center;" @click="startGuess">开始</el-button>
      </div>
      <div v-if="start && guessInfo" style="margin: auto; text-align: center; padding-top: 1rem">
        <el-button type="warning" style="margin: auto; text-align: center;" @click="giveUpGuess">放弃</el-button>
      </div>
    </div>
    <div v-else class="result">
      恭喜你，已经全部答对
    </div>
    <div v-if="!start && guessInfo && giveUp" style="margin: auto; text-align: center; padding-top: 1rem">
      <el-button type="primary" style="margin: auto; text-align: center; margin-bottom: 10px" @click="startGuess" round>再来一次</el-button>
    </div>

    <section style="width: 100%">
      <div class="table">
        <table v-if="guessInfo" style="width: 100%">
          <tr style="width: 100px;">
            <th>答案</th>
          </tr>
          <tr v-for="(item, index) in guessInfo.data.answers" style="border: 1px solid black;">
            <td style="width: 100%; border: 1px solid black;">
              <div v-if="matched.has(item)" style="text-align: center; color: green">
                {{item}}
              </div>
              <div v-if="!matched.has(item) && giveUp" style="text-align: center; color: red">
                {{item}}
              </div>
              <div v-if="!matched.has(item) && !giveUp" style="text-align: center">
                {{'-'}}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
import * as api from '../../api/api'
export default {
  name: "GamePage",
  data() {
    return {
      showResult: false,
      inputResult: '',
      guessInfo: null,
      matched: new Set(),
      id: null,
      right: 0,
      start: false,
      giveUp: false,
      countdownTimer: null,
      timeLeftStr: '00:00',
      timeLeft: null,
    }
  },
  mounted() {
    document.title = '炒饭小测验 - 一起来做小测验吧'
    this.id =  this.$route.query.id;
    this.getGuessInfo();
  },
  methods: {
    modify() {
      window.location.href = '/scratch/modify?id=' + this.id
    },
    giveUpGuess() {
      this.giveUp = true;
      this.start = false;
    },
    startGuess() {
      this.giveUp = false;
      this.start = true;
      this.showResult = false;
      this.right = 0;
      this.matched = new Set();
      this.timeLeft = this.guessInfo.countdown;
      this.inputResult = '';
      this.timeLeftStr = Math.floor(this.timeLeft / 60).toString().padStart(2, '0') + ':' + (this.timeLeft % 60).toString().padStart(2, '0');
      clearInterval(this.countdownTimer);
      api.getByPath('/api/v0/scratch/game/start', {'id': this.id}).then(res=>{
      })

      if (this.guessInfo.countdown) {
         this.countdownTimer =  setInterval(() => {
          this.timeLeft = this.timeLeft - 1;
          this.timeLeftStr = Math.floor(this.timeLeft / 60).toString().padStart(2, '0') + ':' + (this.timeLeft % 60).toString().padStart(2, '0');
          if (this.giveUp || this.timeLeft <= 0 || this.showResult) {
            this.giveUpGuess();
            clearInterval(this.countdownTimer);
          }
         }, 1000);
      }

      setTimeout(() => {
        this.$refs.input.focus();
      }, 200);

    },
    getGuessInfo() {
      api.getByPath('/api/v0/scratch/game/get', {'id': this.id}).then(res=>{
        this.guessInfo = res.data;
      })
    },
    goHome() {
      window.location.href = '/scratch/home'
    },
    match(e) {
      var matchValue = null;
      this.guessInfo.data.answers.forEach(v => {
        if (this.palindrome(v) === this.palindrome(e) && !this.matched.has(v)) {
          this.right = this.right + 1;
          this.inputResult = '';
          matchValue = v;
          if (this.right === this.guessInfo.data.answers.length) {
            this.showResult = true;
          }
        }
      });
      if (matchValue || (!matchValue && !e)) {
        this.matched.add(matchValue);
      }
    },
    share() {
      var input = document.createElement('input');
      input.setAttribute('value','邀请你来做「' + this.guessInfo.name + '」小测验 https://chao.fan/scratch/guess?id=' + this.id);
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast("复制测验地址成功");
      return result;
    },
    palindrome(str) {
      return str.replace(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/g, '');
    },
    random() {
      api.getByPath('/api/v0/scratch/game/random').then(res=>{
        window.location.href = '/scratch/guess?id=' + res.data;
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  .input_container {
    display: flex;
    position: relative;
    margin: auto;
    width: 30%;
    .input {
      width: 50%;
      //padding-top: 1rem;
      //max-width: 40%;
      //margin: auto;
    }
  }
  .table {
    margin-top: 2rem;
    width: 30%;
    margin-left: auto;
    margin-right: auto;
  }
  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
  .result {
    width: 100%;
    text-align: center;
    padding-top: 1rem;
  }
}

table, th, td {
  border-collapse:collapse;
  border: 1px solid black;
}

@media only screen and (max-width: 679px) {
  .container {
    .input_container {
      width: 80%;
      .input {
        width: 50%;
        //padding-top: 1rem;
        //max-width: 40%;
        //margin: auto;
      }
    }

    .table {
      width: 80%;
    }
  }
}
</style>
