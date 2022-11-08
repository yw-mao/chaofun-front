<template>
  <div class="container">
    <section v-if="list" class="list_container">
      <div style="display: flex" v-for="(item, index) in list" @click="gotoGuess(item)">
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

    gotoGuess(item) {
      window.location.href = '/scratch/guess?id=' + item.id;
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
