<template>
<el-header class="chao-header" height="50">
  <div class="chao-header-wrapper">
    <a class="chao-logo">
      <img src="https://i.chao.fun/biz/08a2d3a676f4f520cb99910496e48b4e.png?x-oss-process=image/resize,h_80" alt="炒饭"> 
      <!-- <span>炒饭</span> -->
    </a>
    <el-button class="chao-home" type="primary" round>主页</el-button>
    <div class="chao-search"></div>
    <div v-if="islogin" class="chao-button-container">
      <el-button class="chao-header-button" icon="el-icon-mobile" circle></el-button>
      <el-button class="chao-header-button" icon="el-icon-message-solid" circle></el-button>
      <el-button class="chao-header-avatar">
        <img :src="`${imgOrigin}${userinfo.icon}?x-oss-process=image/resize,h_80`" :alt="userinfo.userName" width="32">
      </el-button>
    </div>
    <div v-else class="chao-button-container">
      <el-button class="chao-login" @click="showLogin()" type="primary" round>登录</el-button>
      <el-button class="chao-login chao-register" @click="showLogin('register')" round>注册</el-button>
    </div>
  </div>
  
</el-header>
</template>
<script>
export default {
  props:{
    userinfo:{
      type: Object,
      default(){
        return {}
      }
    },
    islogin:{
      type: Boolean,
      default: false
    }
  },
  methods: {
    showLogin(logStatus = 'login') {
      this.$login({
        logStatus,
        callBack: () => {
          this.$store.dispatch('user/getInfo');
        },
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.chao-header {
  display: flex;
  flex-direction: row;
  z-index: 1;
  height: 50px;
  width: 100%;
  position: fixed;
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 8px 8px -8px; transition: box-shadow 300ms ease-in-out 0s;
  padding: 0;

  .chao-header-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 4px 16px;
    .chao-logo {
      display: flex;
      height: 100%;
      padding: 0 12px;
      img {
        height: 100%;
      }
      span {
        padding: 0 6px;
        font-size: 22px;
        font-weight: 700;
        line-height: 42px;
        color: #333;
      }
    }
    .chao-home {
      background: #214E9F;
      border: none;
      /deep/ span {
        font-weight: 700;
        font-size: 16px;
      }
    }
    .chao-search {
      flex: 1 1 auto;
    }
    .chao-button-container {
      display: flex;
      flex-direction: row;
      align-items: center;

      .chao-login {
        background: #214E9F;
        border: none;
        /deep/ span {
          font-weight: 700;
          font-size: 16px;
        }
      }
      .chao-register {
        background: #efefef;
        /deep/ span {
          color: #111;
        }
      }
      .chao-header-button {
        border: none;
        margin: 0;
        /deep/ i {
          font-size: 20px;
          color: #767676;
        }
        &:hover {
          background-color: rgba(0, 0, 0, 0.06);
        }
      }

      .chao-header-avatar {
        border: none;
        margin: 0;
        padding: 4px;
        box-sizing: border-box;
        background-color: none;
        border-radius: 50%;
        /deep/ span {
          display: block;
          background: #f4f4f4;
          border-radius: 50%;

          img {
            display: block;
            color: transparent;
            mix-blend-mode: multiply;
          }
        }
        &:hover {
          background-color: rgba(0, 0, 0, 0.06);
        }
      }
    }
  }

}
</style>