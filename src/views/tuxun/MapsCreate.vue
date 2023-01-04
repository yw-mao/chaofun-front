<template>
  <div class="container">
    <div class="back_home" @click="goHome">
      <el-button type="primary" round>←返回首页</el-button>
    </div>
    <div class="nav">
      自建题库
    </div>

    <el-input v-model="name" id="input" placeholder="题库名字" style="margin-top: 2rem; max-width: 60%;" round></el-input>
    <div></div>
    <el-button @click="addMap" type="primary">创建</el-button>
  </div>
</template>

<script>
import {tuxunJump, tuxunOpen} from "./common";
import * as api from '@/api/api'
import {postByPath} from "../../api/api";
export default {
  name: "MapsCreate",
  data() {
    return {
      name: '',
    }
  },
  methods: {
    goHome() {
      tuxunJump('/tuxun/')
    },
    addMap() {
      api.getByPath('/api/v0/tuxun/maps/add', {name: this.name}).then(res => {
        if (res.success) {
          tuxunJump('/tuxun/maps_modify?mapsId=' + res.data.id);
        } else if (res.errorCode === 'need_vip') {
          this.$vip();
        }
      })
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

  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }



}
</style>
