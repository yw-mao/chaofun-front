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
        {name: '震惊！小伙竟分不清泰语与柬埔寨语，这究竟是道德的沦丧还是人性的扭曲', cover: 'biz/1666282434580_3803702ca639468683179e66082e1549_1.png', url: 'https://www.bilibili.com/video/BV1D8411e7Gz'},
        {name: '10月18日图寻每日挑战 露脸初解说，勉强2万分', cover: 'biz/1666105306246_113c97b1527645be98d69ba0f8140e47_0.png', url: 'https://www.bilibili.com/video/BV1Nm4y1P7Sz'},
        {name: '大数据，你干嘛～啊哈～哎呦～你好烦～ （10月19日图寻每日挑战）', cover: 'biz/1666282381420_fb2fb2f03ebe4489bfa5b5cf64743fa8_1.png', url: 'https://www.bilibili.com/video/BV1ud4y127cH'},
        {name: '10月18日图寻每日挑战 露脸初解说，勉强2万分', cover: 'biz/1666105306246_113c97b1527645be98d69ba0f8140e47_0.png', url: 'https://www.bilibili.com/video/BV1Nm4y1P7Sz'},
        {name: '哼，运气游戏！（10月18日图寻每日挑战）', cover: 'biz/1666105386447_5ce6961ac26c4673b53df36bd8b972c4_0.png', url: 'https://www.bilibili.com/video/BV1g14y1j7J1'},
        {name: '一个正直的小伙不认识邪教很合理吧（10月17日图寻每日挑战）', cover: 'biz/1666036967147_b9cb9c4a47fe418aa25127d0671bf9b4_1.png', url: 'https://www.bilibili.com/video/BV1xt4y1F7PY'},
        {name: '炒饭图寻每日挑战10/16', cover: 'biz/1666037132615_62682012bee744a792692f55b26c25c5_0.png', url: 'https://www.bilibili.com/video/BV11m4y1c7df'},
        {name: '非著名小丑来了（10月16日图寻每日挑战）', cover: 'biz/1666036673496_04e8f0d6fdce4842b9a88d21f1e5702d_0.png', url: 'https://www.bilibili.com/video/BV1pd4y117Lc'},
        {name: '图寻 每日挑战 | 15分钟内找出五个地点 2分钟速答20000分', cover: 'biz/1665856527702_704ac3a286da44289caf4ec194317f1a_0.webp', url: 'https://www.bilibili.com/video/BV1u84y1z7Tq'},
        {name: '原形毕露？回光返照？图寻国家streak挑战！', cover: 'biz/1665856408307_c8fbf37ca1be439cb530d1d6c1cf3510_0.webp', url: 'https://www.bilibili.com/video/BV1ie411L7W9'},
        {name: '不认识上海是我的错吗？！（10月15日图寻每日挑战）', cover: 'biz/1665856318382_c9018e95887047dba224a96281902d71_0.webp', url: 'https://www.bilibili.com/video/BV1XD4y1k7eH'},
        {name: '小伙首次挑战图寻，直呼好爽！（10月14日挑战）', cover: 'biz/1665770090636_e23d05e6e25848e0a99c5a26bc5eaed4_0.webp', url: 'https://www.bilibili.com/video/BV1M8411s7ug'},
        {name: '10月12日图寻每日挑战3分钟速答2万分', cover: 'biz/1665579980139_302b8010aa6e4a69a530b014981b7bfc_0.webp', url: 'https://www.bilibili.com/video/BV1A14y1E71P'},
        {name: '每日五题地理挑战游戏2022年10月10号【炒饭图寻】', cover: 'biz/1665574383610_dcd05466fdcb49b18de214a9c976ef42_0.webp', url: 'https://www.bilibili.com/video/BV1FR4y1R7jB'},
        {name: '炒饭图寻  随机传送到世界上的某地，如何选出大概位置？', cover: 'biz/1665574863776_f56f0bfff84a45d7ba2b1e47bdc9f681_0.webp', url: 'https://www.bilibili.com/video/BV1ee4y1i7em'},
        {name: '当你做了一道地球人都会的题后， 一定会有一道地球人都不会的题等着你', cover: 'biz/1665575510613_fcb281887a3c4b1c970e7b654ae48f0f_0.webp', url: 'https://www.bilibili.com/video/BV1He411j79D'}
      ],
      recommendPagedata: [
        {name:'随机将你扔在世界任何一个地方，你知道自己在哪里吗？——探索世界',cover: 'biz/1666200760653_621b3846c53a45008601ad6c2decbfb2_0.png', url: 'https://www.bilibili.com/video/BV1284y1z786' },
        {name:'非官方解说图寻第三届个人锦标赛（恭喜HM）Pt. 1',cover: 'biz/1666036564211_7cfdf16e1f68425787bcd57f8bfd2732_0.png', url: 'https://bilibili.com/video/BV1Qe4y1j7R1' },
        {name:'图寻第三届个人锦标赛录播',cover: 'biz/1666036472357_1ecdc1dd6d24498bae0d11affb1acb58_0.png', url: 'https://www.bilibili.com/video/BV1AW4y1n7wf' },
        {name:'图寻第二届个人锦标赛录播',cover: 'biz/1665575107534_a7506b339de4404b89ad4ed17258b69c_0.webp', url: 'https://www.bilibili.com/video/BV19e4y1871Q' },
        {name:'图寻第一届个人锦标赛录播1',cover: 'biz/1665575321286_9f85c32bccd2401191aed9e468129888_0.webp', url: 'https://www.bilibili.com/video/BV1Ma41137zr' },
      ],
      coursePagedata: [
        {name:'图寻总笔记1.0',cover: 'biz/1665574727065_92d546eddc4a427d9eb503077a34fd06_0.webp', url: 'https://www.bilibili.com/video/BV1Xg411a78m' },
        {name:'这个视频将会双倍你的Geoguessr/图寻能力 历史地理人文知识问答Jetpunk',cover: 'biz/1665856643354_58dc7397ce96424fb1ac053b07cb8737_0.webp', url: 'https://www.bilibili.com/video/BV1VD4y1C7Mr' },
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
