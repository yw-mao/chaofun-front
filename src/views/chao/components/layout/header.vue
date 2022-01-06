<template>
<el-header class="chao-header" height="50">
  <div class="chao-header-wrapper">
    <a class="chao-logo">
      <img src="https://i.chao.fun/biz/08a2d3a676f4f520cb99910496e48b4e.png?x-oss-process=image/resize,h_80" alt="炒饭"> 
      <!-- <span>炒饭</span> -->
    </a>
    <el-button class="chao-home" type="primary" round>主页</el-button>
    <div class="chao-search">
      <search />
    </div>
    <div v-if="islogin" class="chao-button-container">
      <el-button class="chao-header-button" icon="el-icon-mobile" circle></el-button>
      <el-button class="chao-header-button" icon="el-icon-message-solid" circle></el-button>
      <el-button class="chao-header-avatar">
        <img :src="`${imgOrigin}${userinfo.icon}?x-oss-process=image/resize,h_80`" :alt="userinfo.userName" width="32">
      </el-button>
      <el-popover trigger="click" popper-class="droppdown">
        <div class="userinfo-box">
          <div class="userinfo-avatar">
            <img :src="`${imgOrigin}${userinfo.icon}?x-oss-process=image/resize,h_80`" :alt="userinfo.userName">
          </div>
          <div class="userinfo-info">
            <div class="userinfo-username">{{userinfo.userName}}</div>
            <div class="userinfo-upper">{{userinfo.ups}} 获赞</div>
            <div class="userinfo-fbi">{{userinfo.fbi}} FBi</div>
          </div>
        </div>
        <div class="droppdown-block">
          <div class="droppdown-title">更多选项</div>
          <ul>
            <li>
               <router-link v-if="islogin" to="/setting">设置</router-link>
            </li>
            <li>
               <a @click="logout">退出</a>
            </li>
          </ul>
        </div>
        <el-button class="chao-header-button chao-header-dropdown" slot="reference" icon="el-icon-arrow-down" circle></el-button>
      </el-popover>
    </div>
    <div v-else class="chao-button-container">
      <el-button class="chao-login" @click="showLogin()" type="primary" round>登录</el-button>
      <el-button class="chao-login chao-register" @click="showLogin('register')" round>注册</el-button>
    </div>
  </div>
  
</el-header>
</template>
<script>
import search from './search.vue';

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
  components: {
    search,
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
    logout() {
      this.$store.dispatch('user/logout');
    }
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
        &:focus,
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
        &:focus,
        &:hover {
          background-color: rgba(0, 0, 0, 0.06);
        }
      }

      .chao-header-dropdown {
        padding: 6px;
        /deep/ i {
          font-size: 12px;
          color: #767676;
          font-weight: 700;
        }
        &:focus,
        &:hover {
          /deep/ i {
            color: #111;
          }
        }
      }
    }
  }
}
.userinfo-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  .userinfo-avatar {
    margin-right: 8px;
    width: 64px;
    height: 64px;
    background: #f4f4f4;
    border-radius: 50%;

    img {
      display: block;
      color: transparent;
      mix-blend-mode: multiply;
      width: 100%;
      height: 100%;
    }
  }
  .userinfo-info {
    .userinfo-username {
      font-size: 16px;
      font-weight: 700;
    }
  }
}
.droppdown-block {
  margin-top: 16px;
  .droppdown-title {
    padding: 8px;
    font-size: 14px;
  }
  ul {
    li {
      a {
        display: block;
        padding: 8px;
        font-size: 16px;
        text-decoration: none;
        font-weight: 700;
        color: #111;
        line-height: 1;
        &:hover {
          border-radius: 6px;
          background: #efefef;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.droppdown {
  top: 32px !important;
}
</style>