<template>
  <div class="container">

    <div class="back_home" @click="goHome">
      <el-button type="primary">←返回首页</el-button>
    </div>
    <div class="main_content">
      <div class="top">
        <div class="time">
          {{this.getDate()}}
        </div>
        <el-button v-if="this.gameData && this.gameData.status === 'ready'" type="primary" size="large" @click="begin">开始每日挑战</el-button>
        <el-button v-if="this.gameData && this.gameData.status === 'ongoing'" type="warning" size="large" @click="begin">继续每日挑战</el-button>
        <div class="score" v-if="this.gameData && this.gameData.status === 'finish'">今日得分: {{this.gameData.player.totalScore}}</div>
        <div class="rank">
          排名实现中...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'

export default {
  name: "DailyChallenge",

  data() {
    return {
      gameData: undefined,

    }
  },

  mounted() {
    api.getByPath('/api/v0/tuxun/challenge/getGameInfo', {'day': '1'}).then(res=>{
      console.log(res.data)
      if (res.data) {
        this.gameData = res.data;
      }
    })
  },

  methods: {
    goHome() {
      window.location.href = '/tuxun';
    },
    begin() {
      this.doLoginStatus().then(res => {
        if (res) {
          api.getByPath('/api/v0/tuxun/challenge/start', {'gameId': this.gameData.id}).then(res=>{
              window.location.href = '/tuxun/challenge?challengeId=' + this.gameData.challengeId;
          })
        }
      });
      // window.location.href =
    },
    getDate() {  //当前时间格式化处理
      var str = '';
      var date = new Date();
      str += date.getFullYear() + "年 "; //获取年份
      str += date.getMonth() + 1  + "月 "; //获取月份
      str += date.getDate() + "日"; //获取日
      return str;
    },
  }

}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  background-color: #090723;

  .main_content {
    height: 100%;
    width: 100%;
    justify-content: center;
    text-align: center;

    .top {
      padding-top: 5rem;
      .score {
        font-size: xx-large;
        color: white;
      }
      .time {
        font-size: xx-large;
        color: gold;
        padding-bottom: 2rem;
      }
    }

    .rank {
      padding-top: 2rem;
      font-size: xx-large;
      color: grey;
    }

  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
}
</style>
