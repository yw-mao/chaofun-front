<template>
  <div class="container">
    <div class="back_home" @click="goHome">
      <el-button type="primary" round>←返回首页</el-button>
    </div>
    <div class="nav">
      日常淘汰赛
    </div>
    <div class="desc">
      每天8点-23点，每整点一场, 暂时不算积分。
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
    <div class="rank">
      场次结果
    </div>
    <div class="rank_container" v-if="this.rank">
      <div @click="toUser(item.user)" v-for="(item,index) in this.rank" :key="index" class="item">
        <div class="left">
          <p>{{item.time}}</p>
        </div>
        <div class="right">
          <img style="object-fit: cover;" :src="imgOrigin+ item.user.icon + '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'" alt="">
          <div class="info">
            <div class="title">{{item.user.userName}}</div>
          </div>
        </div>
      </div>
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
      rank: null,
    }
  },

  mounted() {
    this.get();
    this.listResult();
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
        if (timeLeft < 20) {
          if (timeLeft % 5 == 0) {
            this.get();
          }
        }
        this.timeLeftStr = Math.floor(timeLeft / 60 / 60 ) + ' 小时 ' + Math.floor(timeLeft / 60 % 60).toString().padStart(2, '0') + ' 分 ' + (timeLeft % 60).toString().padStart(2, '0') + ' 秒';
      }.bind(this), 1000)
    },

    get() {
      api.getByPath("/api/v0/tuxun/br/get").then(res => {
        this.gameId = res.data.gameId;
        this.nextStartTime = res.data.nextStartTime;
      });
    },
    toGame() {
      window.location.href = '/tuxun/guoqing_game?guoqingId=' + this.gameId;
    },
    listResult() {
      api.getByPath("/api/v0/tuxun/br/listResult").then(res => {
        this.rank = res.data;
      });
    },
    toUser(item) {
      window.open(location.origin + "/tuxun/user/" + item.userId, "_blank");
    },
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
  .rank {
    padding-top: 4rem;
    font-size: large;
    color: darkgray;
  }

  .rank_container {
    padding-top: 2rem;
    padding-bottom: 5rem;
    margin: auto;
    width: 40%;

    .item {
      display: flex;
      justify-content: space-between;
      padding: 5px;
      border-bottom: 1px solid #f1f1f1;

      overflow: hidden;
      color: white;
      .right {
        flex: 1;
        display: flex;
        justify-content: flex-end;

        .number {
          //position: absolute;
          text-align: end;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          font-size: 16px;
          margin-right: 8px;
        }
        img {
          flex: 0 0 40px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          vertical-align: middle;
        }

        .title {
          font-size: 16px;
          color: white;
        }

        .desc {
          width: 180px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #888;
          font-size: 13px;
        }

        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          color: white;
        }
      }

      .left {
        display: flex;
        flex: 0 0 60px;
        // line-height: 40px;
        text-align: center;
        font-size: 12px;
        flex-direction: column;
        justify-content: space-around;

        p {
          font-size: 14px;
        }
      }
    }
  }

}

@media only screen and (max-width: 679px) {
  .container {
    .rank_container {
      width: 90%;
    }
  }
}
</style>
