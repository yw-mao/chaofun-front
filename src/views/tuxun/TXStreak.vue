<template>
<div class="container">
  <div class="back_home" @click="goHome">
    <el-button type="primary" round>←返回首页</el-button>
  </div>
  <div class="nav">
    连胜挑战
  </div>
  <div style="color: white; ">
    连续选对正确的国家，看你能坚持多少轮（国家判断还有小Bug，尽快修复）
  </div>

  <div class="top-button">
    <el-button @click="createNew" round>开始新挑战</el-button>
    <el-button class="top-button-continue"  type="primary" @click="$toast('尽请期待')" round>继续上次挑战</el-button>
  </div>

  <div class="rank">
    排行榜(实现中)
  </div>
  <div style="color: white;">
    (我知道你很急，但是你先别急)
  </div>

</div>
</template>

<script>
import * as api from '../../api/api'

export default {
  name: "TXStreak",
  methods: {
    goHome() {
      window.location.href = '/tuxun';
    },
    createNew() {
      api.getByPath("/api/v0/tuxun/streak/createCountryStreak").then(res => {
        window.location.href = '/tuxun/streak_game?streakId=' + res.data.id;
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
}




</style>
