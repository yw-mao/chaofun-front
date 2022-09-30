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
    <div v-if="">
      <div>
        下一场倒计时
      </div>
      <div >
        {{this.timeLeftStr}}
      </div>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
export default {
  name: "TuxunGuoQing",

  data() {
    return {
      timeLeftStr: null,

      loading: false,
      options: []
    }
  },

  mounted() {
  },

  methods: {
    goHome() {
      window.location.href = '/tuxun';
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
}

</style>
