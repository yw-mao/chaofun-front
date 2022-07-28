<template>
  <div class="container" :style="{'background-image':'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.6)),url('+imgOrigin+'biz/1658727369911_f6ca22ec1e8d4761909b673e0dbd0b2f.png?x-oss-process=image/format,webp)','background-size':'cover','background-position': 'center'}">
    <img style="margin-top: 25px; margin-left: 25px; width: 5rem; height: 3rem" :src="imgOrigin + 'biz/1658657631523_45db8dd090dc49af99f2a8a4ace01122.svg'">
    </img>
    <div>
      <section class="game_entrance">
        <div class="grid_main">
          <div class="card" @click="toPage('积分赛主赛场', '/tuxun/main_game')">
            <div class="title">
              积分赛
            </div>
            <div class="describe">
              对战赢取积分/徽章/奖励
            </div>
          </div>
          <div class="card" v-if="!ISPHONE" @click="createSolo" >
            <div class="title">
              邀请Solo
            </div>
            <div class="describe">
              来一场图寻对决吧！
            </div>
          </div>
          <div class="card" @click="toPage('邀请  赛', '/tuxun/maps')">
            <div class="title">
              训练赛
            </div>
            <div class="describe">
              走遍大江南北
            </div>
          </div>
          <div class="card" @click="toForum()">
            <div class="title">
              讨论区
            </div>
            <div class="describe">
              全国最好的网络迷踪社区
            </div>
          </div>

        </div>
        <div class="thx">
          特别鸣谢：猫，南山大王cf，网络迷踪版主
        </div>
      </section>

    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'

export default {
  name: "TXNewHome",

  methods:{
    toPage(title, path) {
      try {
        window.flutter_inappwebview.callHandler('toViewPage',{url: location.origin+path,title:title,showHeader: true})
      } catch (e) {
        window.open(location.origin + path);
      }
    },
    toForum(){
      try {
        window.flutter_inappwebview.callHandler('toAppForum',{forumId: 84+''})
      } catch (e) {
        window.open(location.origin + '/f/84',"_blank");
      }
    },

    createSolo() {
      api.getByPath("/api/v0/tuxun/solo/create").then(res => {
        var id = res.data.id;
        window.open(location.origin + '/tuxun/solo_game?gameId=' + id,"_blank");
        // this.$router.push({path: '/tuxun/solo_game?gameId=' + id}).catch((e) => {})
      });
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  height: 100%;
  background-color: #F7F7F8;
  div {
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 0 2rem;
    margin: 0 auto;
    max-width: 80rem;
    section {
      padding-top: 20px;
      display: block;
    }
    .game_entrance {
      margin-top: 15%;
    }
  }
  .thx {
    font-size: 0.5rem;
    color: white;
    padding-top: 40px;
  }

  .grid_main {
    display: grid;
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;
    grid-template-columns: repeat(3, 1fr);
    .card {
      background-color: rgb(25,26,46, 0.9);
      background-position: 50%;
      background-repeat: no-repeat;
      background-size: 100%;
      box-sizing: border-box;
      box-radius: 1rem;
      flex-direction: column;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      padding: 1.5rem;
      min-height: 110px;
      .title {
        font-size: 1.5rem;
        color: white;
        font-weight: 700;
        padding-bottom: 0.2rem;
      }
      .describe {
        color: yellow;
        font-size: 1rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
      }
    }
  }
}
.thx {

}
@media only screen and (max-width: 679px) {
  .container {
    .grid_main {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>