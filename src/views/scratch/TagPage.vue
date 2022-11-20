<template>
  <div class="container">
    <div class="back_home">
      <el-button @click="goBack" size="small" round>←返回</el-button>
    </div>
    <div style="text-align: center; width: 100%; font-size: 32px;font-weight: bold; padding-top: 1rem; padding-bottom: 2rem">
      #{{this.tagName}}
<!--      <div class="top-right">-->
<!--&lt;!&ndash;        <el-button type="primary" @click="toUserHome" round>个人首页</el-button>&ndash;&gt;-->
<!--        <el-button @click="toCreate" round>创建小测验</el-button>-->
<!--        <div></div>-->
<!--        <el-button type="primary" @click="random" round>随机小测验</el-button>-->
<!--      </div>-->
    </div>

    <section v-if="list" class="list_container">
      <el-radio-group v-model="sort" style="margin-bottom: 30px;" @change="changeSort">
      <el-radio-button label="hot">最热</el-radio-button>
        <el-radio-button label="new">最新</el-radio-button>
        <el-radio-button label="mine">我创建的</el-radio-button>
      </el-radio-group>
      <div style="display: flex; padding-bottom: 8px" v-for="(item, index) in list" @click="gotoGuess(item)">
        <img class="cover" :src="imgOrigin + item.cover + '?x-oss-process=image/resize,h_300/quality,q_75'" style="">
        </img>
        <div style="padding-left: 8px">
          <div style="font-size: 24px; font-weight: bold;">
            {{item.name}}
          </div>
          <div>
            {{item.desc}}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import * as api from '../../api/api'

export default {
  name: "TagPage",

  data() {
    return {
      totalTimes: null,
      sort: 'hot',
      tagName: null,
      list: [],
    }
  },
  mounted() {
    this.tagName = this.$route.query.tagName;
    this.getTotalGuessTimes();
  },

  methods: {
    getList() {
      api.getByPath('/api/v0/scratch/game/list', {order: this.sort, tag: this.tagName}).then(res=>{
        this.list = res.data;
      })
    },

    gotoGuess(item) {
      window.location.href = '/scratch/guess?id=' + item.id;
    },

    toCreate() {
      this.doLoginStatus().then((res) => {
        if (res) {
          window.location.href = '/scratch/create'
        }
      });
    },
    random() {
      api.getByPath('/api/v0/scratch/game/random').then(res=>{
        window.location.href = '/scratch/guess?id=' + res.data;
      })
    },

    changeSort(tab, event) {
      this.list = [];
      this.getList();
    },
    goBack() {
      this.$router.go(-1);
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  .list_container {
    max-width: 40%;
    margin: auto;
  }
  .cover {
    width: 100px; height: 100px;
    //background-color: grey;
    object-fit: cover;
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
}

@media only screen and (max-width: 679px) {
  .container {

    .list_container {
      max-width: 90%;
      margin: auto;
    }

    .container {
    }
  }
}

</style>
