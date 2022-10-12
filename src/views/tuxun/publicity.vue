<template>
  <div class="container">
      <div class="back_home" @click="goHome">
        <el-button type="primary" round>←返回首页</el-button>
      </div>
      <div class="nav">
        直播/视频/教程
      </div>
    <section class="game_entrance">
      <div class="first_session_head" v-if="recommendPagedata && recommendPagedata.length >= 1">推荐</div>
      <div class="line" v-if="recommendPagedata && recommendPagedata.length >= 1"></div>
      <div class="grid_main" v-if="recommendPagedata && recommendPagedata.length >= 1">
        <div v-for="(item, index) in recommendPagedata" @click="toLink(item.url)"  :style="{'background-image': 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.6)), url('+ imgOrigin + (item.cover ?? 'biz/1659323781589_7d19c33667a54a4dabb0405ee5aec20f.jpeg') + '?x-oss-process=image/resize,h_400)','background-size':'cover'}" class="card">
          <div class="title">
            {{item.name}}
          </div>
          <div class="describe">
            {{item.desc}}
          </div>
        </div>
      </div>
    </section>
      <section class="game_entrance">
        <div class="first_session_head" v-if="recentPagedata && recentPagedata.length >= 1">最新</div>
        <div class="line" v-if="recentPagedata && recentPagedata.length >= 1"></div>
        <div class="grid_main" v-if="recentPagedata && recentPagedata.length >= 1">
          <div v-for="(item, index) in recentPagedata" @click="toLink(item.url)"  :style="{'background-image': 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.6)), url('+ imgOrigin + (item.cover ?? 'biz/1659323781589_7d19c33667a54a4dabb0405ee5aec20f.jpeg') + '?x-oss-process=image/resize,h_400)','background-size':'cover'}" class="card">
            <div class="title">
              {{item.name}}
            </div>
            <div class="describe">
              {{item.desc}}
            </div>
          </div>
        </div>
      </section>
    <section class="game_entrance">
      <div class="first_session_head" v-if="coursePagedata && coursePagedata.length >= 1">教程</div>
      <div class="line" v-if="coursePagedata && coursePagedata.length >= 1"></div>
      <div class="grid_main" v-if="coursePagedata && coursePagedata.length >= 1">
        <div v-for="(item, index) in coursePagedata" @click="toLink(item.url)"  :style="{'background-image': 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.6)), url('+ imgOrigin + (item.cover ?? 'biz/1659323781589_7d19c33667a54a4dabb0405ee5aec20f.jpeg') + '?x-oss-process=image/resize,h_400)','background-size':'cover'}" class="card">
          <div class="title">
            {{item.name}}
          </div>
          <div class="describe">
            {{item.desc}}
          </div>
        </div>
      </div>
    </section>
    </div>
</template>

<script>
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api'
export default {
  name: 'tuxunRank',
  components: {

  },
  data(){
    return {
      recentPagedata: [
        {name: '每日五题地理挑战游戏2022年10月10号【炒饭图寻】', cover: 'biz/1665574383610_dcd05466fdcb49b18de214a9c976ef42_0.webp', url: 'https://www.bilibili.com/video/BV1FR4y1R7jB'},
        {name: '炒饭图寻  随机传送到世界上的某地，如何选出大概位置？', cover: 'biz/1665574863776_f56f0bfff84a45d7ba2b1e47bdc9f681_0.webp', url: 'https://www.bilibili.com/video/BV1ee4y1i7em'},
        {name: '当你做了一道地球人都会的题后， 一定会有一道地球人都不会的题等着你', cover: 'biz/1665575510613_fcb281887a3c4b1c970e7b654ae48f0f_0.webp', url: 'https://www.bilibili.com/video/BV1He411j79D'}
      ],
      recommendPagedata: [
        {name:'图寻第二届个人锦标赛录播',cover: 'biz/1665575107534_a7506b339de4404b89ad4ed17258b69c_0.webp', url: 'https://www.bilibili.com/video/BV19e4y1871Q' },
        {name:'图寻第一届个人锦标赛录播1',cover: 'biz/1665575321286_9f85c32bccd2401191aed9e468129888_0.webp', url: 'https://www.bilibili.com/video/BV1Ma41137zr' },
      ],
      coursePagedata: [
        {name:'图寻总笔记1.0',cover: 'biz/1665574727065_92d546eddc4a427d9eb503077a34fd06_0.webp', url: 'https://www.bilibili.com/video/BV1Xg411a78m' },
        {name:'美国加拿大独门秘笈（不完全教程） Geoguessr图寻游戏教学',cover: 'biz/1665573905878_ab983dfaa6b14416be4085e1bd63c99c_0.webp', url: 'https://www.bilibili.com/video/BV1sR4y1R7J1' },
      ],
      timer: 0
    }
  },
  created(){
  },
  mounted(){

    document.title = "图寻-外宣";

    let _this = this;
  },
  methods:{
    toLink(url) {
      window.open(url, '_blank');
    },
    goHome() {
      window.location.href = '/tuxun';
    },
  },
}
</script>
<style scoped lang="scss">
.container{
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
  section {
    padding-top: 3rem;
    display: block;
  }

  .game_entrance {
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 0 2rem;
    margin: 0 auto;
    max-width: 80rem;
    margin-top: 3rem;
    margin-bottom: 5rem;

    .line {
      width: 100%;
      height: 2px;
      background-color: white;
      margin-bottom: 2rem;
      margin-top: 1rem;
    }
    .first_session_head {
      font-size: 24px;
      color: whitesmoke;
      font-weight: bolder;
    }
    .session_head {
      font-size: 24px;
      color: whitesmoke;
      padding-top: 2rem;
      font-weight: bolder;
    }
    .grid_main {
      display: grid;
      grid-row-gap: 1.5rem;
      grid-column-gap: 1.5rem;
      grid-template-columns: repeat(3, 1fr);

      .card {
        border-radius: 1rem;
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
        padding: 4rem;
        min-height: 110px;
        .title {
          font-size: 20px;
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
        .players {
          color: white;
          font-size: 1px;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
      }
    }
  }
}


@media only screen and (max-width: 679px) {
  .container {
    .game_entrance {
      .grid_main {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  }
}
</style>
