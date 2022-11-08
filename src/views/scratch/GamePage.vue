<template>
  <div class="container">
    <div class="back_home">
      <el-button @click="goHome" round>←返回小测验首页</el-button>
      <el-button @click="share" round>分享</el-button>
    </div>
    <div v-if="guessInfo" style="padding-top: 3rem; margin: auto; text-align: center; font-size: 32px">
      {{this.guessInfo.name}}
    </div>
    <div v-if="guessInfo" style="margin: auto; text-align: center; font-size: 16px">
      {{this.guessInfo.desc}}
    </div>
    <div v-if="!showResult">
      <div v-if="!start && guessInfo" style="margin: auto; text-align: center; padding-top: 1rem">
        <el-button type="primary" style="margin: auto; text-align: center;" @click="startGuess">开始</el-button>
      </div>
      <div v-if="start" class="input">
        <div v-if="guessInfo">
          猜对：{{this.right}} / {{this.guessInfo.data.answers.length}}
        </div>
        <el-input @input="match" v-model="inputResult">
        </el-input>
      </div>
    </div>
    <div v-else class="result">
      恭喜你，已经全部答对
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
              <div v-else style="text-align: center">
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
    }
  },
  mounted() {
    document.title = '炒饭小测验 - 一起来做小测验吧'
    this.id =  this.$route.query.id;
    this.getGuessInfo();
  },
  methods: {
    startGuess() {
      this.start = true;
      api.getByPath('/api/v0/scratch/game/start', {'id': this.id}).then(res=>{
      })
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
      this.guessInfo.data.answers.forEach(v => {
        if (v === e && !this.matched.has(v)) {
          this.right = this.right + 1;
          this.inputResult = '';
          this.matched.add(v);
          if (this.right === this.guessInfo.data.answers.length) {
            this.showResult = true;
          }
        }
      });
    },
    share() {
      var input = document.createElement('input');
      input.setAttribute('value', 'https://chao.fan/scratch/guess?id=' + this.id);
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast("复制测验地址成功");
      return result;
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  .input {
    padding-top: 1rem;
    max-width: 40%;
    margin: auto;
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
    //.input {
    //  max-width: 80%;
    //}

    .table {
      width: 80%;
    }
  }
}
</style>
