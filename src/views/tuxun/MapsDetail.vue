<template>
  <div class="container">
    <div class="back_home">
      <el-button type="primary"  @click="goHome" round>←返回首页</el-button>
      <el-button type="primary"  @click="share" round>分享</el-button>
    </div>
    <div v-if="name" class="nav">
      {{name}}
    </div>
    <div v-if="mapsData && mapsData.desc" class="describe">
      {{mapsData.desc}}
    </div>
    <div v-if="userInfo" class="players">
      作者: {{userInfo.userName}}
    </div>
    <div v-if="mapsData" class="players">
      玩家人次: {{mapsData.players}}
    </div>

    <div v-if="mapsData" style="margin-top: 1rem">
      <el-button style="background-color: unset; color: white" @click="toMaps(mapsData, 'noMove')" type="primary"  round>固定</el-button>
      <el-button style="background-color: unset; color: white" @click="toMaps(mapsData, 'move')" type="primary" v-if="mapsData.canMove" round>移动</el-button>
    </div>
  </div>
</template>

<script>
import {tuxunJump, tuxunOpen} from "./common";
import * as api from '@/api/api'
export default {
  name: "MapsDetail",
  data() {
    return {
      mapsId: null,
      name: null,
      mapsData: null,
      userInfo: null,
    }
  },
  mounted() {
    this.mapsId = this.$route.query.mapsId;
    this.getMapsInfo();
  },
  methods: {
    getMapsInfo() {
      api.getByPath('/api/v0/tuxun/maps/get', {mapsId: this.mapsId}).then(res=>{
        this.name = res.data.name;
        this.mapsData = res.data;
        this.getUserInfo(res.data.userId);
      })
    },
    goHome() {
      tuxunJump('/tuxun/')
    },
    getUserInfo(userId) {
      api.getByPath('/api/v0/user/info',{userId: userId}).then((res) => {
        if (res.success) {
          this.userInfo = res.data;
        }
      });
    },
    toMaps(item, type) {
      api.getByPath('/api/v0/tuxun/game/enterMap', {mapsId: item.id}).then(res => {
      })

      api.getByPath('/api/v0/tuxun/challenge/create', {'mapsId': item.id, 'type': type}).then(res => {
        if (res.success) {
          tuxunJump('/tuxun/challenge?challengeId=' + res.data);
        } else {
          if (res.errorCode === 'need_vip') {
            this.$vip({})
          }
        }
      })
    },
    share() {
      var input = document.createElement('input');
      input.setAttribute('value','邀请你来图寻做「' + this.mapsData.name + '」练习赛题库, 你能找到你在哪吗？ https://tuxun.fun/maps_detail?mapsId=' + this.mapsId);
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast("复制练习赛题库地址成功");
      return result;
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
  .describe {
    color: yellow;
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  .players {
    color: white;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
}
</style>
