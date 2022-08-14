<template>
  <div class="matching" >
    <div class="content">
      正在匹配对手中，请稍候...
      <div class="matching_home_button">
        <el-button class="home_button" type="warning" @click="goHome">结束匹配</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Matching",
  methods: {
    goHome() {
      window.location.href = '/tuxun';
    },
  }
}
</script>

<style lang="scss" scoped>
.matching {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  justify-content: center;
  .content {
    color: white;
    font-size: xx-large;
  }
  .matching_home_button {
    width: 100%;
  }
}
</style>
