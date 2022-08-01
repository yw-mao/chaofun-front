<template>
  <div class="container">
      <div class="back_home" @click="goHome">
        <el-button type="primary">←返回首页</el-button>
      </div>
      <div class="nav">
        训练赛
      </div>
      <section class="game_entrance">
        <div class="grid_main">
          <div v-for="(item, index) in pagedata" @click="toMaps(item)"  :style="{'background-image': 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.6)), url('+ imgOrigin + (item.cover ?? 'biz/1659323781589_7d19c33667a54a4dabb0405ee5aec20f.jpeg') + '?x-oss-process=image/resize,h_400/format,webp)','background-size':'cover'}" class="card">
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
      pagedata: [],
      timer: 0
    }
  },
  created(){
  },
  mounted(){
    this.getButtonRank()
    document.title = "训练赛";

    let _this = this;
    let timer = setInterval(()=>{
      _this.getButtonRank()
    },5000)
  },
  methods:{
    getButtonRank(){
      api.getByPath('/api/v0/tuxun/maps/list').then(res=>{
        this.pagedata = res.data
      })
    },
    toMaps(item){
      window.open(location.origin + '/tuxun/maps_game?mapsId=' + item.id, '_blank');
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
    font-size: xx-large;
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

    .grid_main {
      display: grid;
      grid-row-gap: 1.5rem;
      grid-column-gap: 1.5rem;
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
        padding: 4rem;
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
