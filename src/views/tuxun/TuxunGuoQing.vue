<template>
  <div class="container">
    <div class="back_home" @click="goHome">
      <el-button type="primary" round>←返回首页</el-button>
    </div>
    <div class="nav">
      国庆淘汰赛
    </div>
    <div class="desc">
      10月1日-10月7日，每天8点-23点，每整点一场. 按照最终存活场次排序，前10名获得积分奖励 1000，900依次递减的积分奖励
    </div>
    <div v-if="nextStartTime" class="next-round">
      <div v-if="!this.gameId"  class="next-round-info">
        下一场倒计时
      </div>
      <div v-if="!this.gameId" class="next-round-count">
        {{this.timeLeftStr}}
      </div>

      <el-button type="primary" v-if="this.gameId" @click="toGame" round>
        进入游戏
      </el-button>
      <div>
      </div>
    </div>
    <div>
    </div>
  </div>
</template>

<script>

import * as api from '../../api/api'

export default {
  name: "TuxunGuoQing",

  data() {
    return {
      timeLeftStr: null,
      nextStartTime: null,
      gameId: null,
    }
  },

  mounted() {
    this.get();
    this.countDown();
  },

  methods: {
    goHome() {
      window.location.href = '/tuxun';
    },

    countDown() {
      this.time = setInterval(function () {
        if (!this.nextStartTime) {
          return;
        }
        var timeLeft = parseInt((this.nextStartTime - (new Date().getTime())) / 1000);
        if (timeLeft < 60) {
          if (timeLeft % 5 == 0) {
            this.get();
          }
        }
        this.timeLeftStr = Math.floor(timeLeft / 60 / 60 ) + ' 小时 ' + Math.floor(timeLeft / 60 % 60).toString().padStart(2, '0') + ' 分 ' + (timeLeft % 60).toString().padStart(2, '0') + ' 秒';
      }.bind(this), 1000)
    },

    get() {
      this.nextStartTime = null;
      api.getByPath("/api/v0/tuxun/br/get").then(res => {
        // this.gameId = res.data.gameId;
        this.nextStartTime = res.data.nextStartTime;
      });
    },
    toGame() {
      window.location.href = '/tuxun/guoqing_game?guoqingId=' + this.gameId;
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  position: absolute;
  width: 100%;
  min-height: 120%;
  text-align: center;
  background-color: #090723;
  justify-content: center;
  align-items: center;
  align-content: center;

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
  .nav {
    color: white;
    font-size: xxx-large;
    font-weight: bold;
    padding-top: 3rem;
  }
  .desc {
    margin: auto;
    padding-top: 1rem;
    width: 80%;
    color: gray;
    align-items: center;
    align-content: center;
    justify-content: center;
    text-align: center;
  }
  .next-round {
    padding-top: 1rem;
    .next-round-info {
      color: white;
      font-size: 20px;
    }

    .next-round-count {
      color: yellow;
      font-size: 24px;
    }
  }
}

</style>
