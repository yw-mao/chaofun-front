<template>
<div class="container">
  <div class="back_home" @click="goHome">
    <el-button type="primary" round>←返回首页</el-button>
  </div>
  <div class="nav">
    连胜挑战
  </div>
  <div style="color: white; ">
    连续选对正确的国家，看你能坚持多少轮
  </div>

  <div class="top-button">
    <el-button @click="createNew" round>开始新挑战</el-button>
    <el-button class="top-button-continue"  type="primary" @click="$toast('尽请期待')" round>继续上次挑战</el-button>
  </div>

  <div class="rank">
    排行榜
  </div>
  <div class="rank_container" v-if="this.rank">
    <div @click="toUser(item.user)" v-for="(item,index) in this.rank" :key="index" class="item">
      <div class="left">
        <div class="number">
          {{index + 1}}.
        </div>
        <img style="object-fit: cover;" :src="imgOrigin+ item.user.icon + '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'" alt="">
        <div class="info">
          <div class="title">{{item.user.userName}}</div>
        </div>
      </div>
      <div class="right">
        <p>连胜: {{item.bestStreaks}}</p>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import * as api from '../../api/api'

export default {
  name: "TXStreak",
  data(){
    return {
      rank: null,
    }
  },  mounted() {
    this.listRank();
  },
  methods: {
    goHome() {
      window.location.href = '/tuxun';
    },
    createNew() {
      api.getByPath("/api/v0/tuxun/streak/createCountryStreak").then(res => {
        window.location.href = '/tuxun/streak_game?streakId=' + res.data.id;
      });
    },

    listRank() {
      api.getByPath("/api/v0/tuxun/streak/listRank", {type: 'country'}).then(res => {
        this.rank = res.data
      });
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
  .top-button {
    margin-top: 2rem;
    .top-button-continue {
      margin-left: 1rem;
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
      // height: 60px;
      // box-sizing: border-box;
      overflow: hidden;
      color: white;
      .left {
        flex: 1;
        display: flex;

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

      .right {
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
