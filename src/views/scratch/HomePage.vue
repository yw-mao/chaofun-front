<template>
  <div class="container">


    <div style="text-align: center; width: 100%; font-size: 32px;font-weight: bold; padding-top: 1rem; padding-bottom: 2rem"> 炒饭小测验
      <div v-if="totalTimes" style="font-size: 16px">总测验次数: {{totalTimes}}</div>
      <div class="top-right">
<!--        <el-button type="primary" @click="toUserHome" round>个人首页</el-button>-->
        <el-button type="primary" @click="toCreate" round>创建小测验</el-button>
      </div>
    </div>
    <section v-if="list" class="list_container">
      <div style="display: flex; padding-bottom: 8px" v-for="(item, index) in list" @click="gotoGuess(item)">
        <img class="cover" :src="imgOrigin + item.cover" style="">
        </img>
        <div>
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
  name: "HomePage",

  data() {
    return {
      totalTimes: null,
      list: [],
    }
  },
  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      api.getByPath('/api/v0/scratch/game/list', ).then(res=>{
        this.list = res.data;
      })
    },

    getTotalGuessTimes() {
      api.getByPath('/api/v0/scratch/game/getTotalStartTimes' ).then(res=>{
        this.totalTimes = res.data;
      })
    },

    gotoGuess(item) {
      window.location.href = '/scratch/guess?id=' + item.id;
    },

    toCreate() {
      window.location.href = '/scratch/create'
    }

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
    max-width: 100px; max-height: 100px
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
