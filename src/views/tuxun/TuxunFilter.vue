<template>
<div class="container">
  <div class="image_container" v-for="(item, index) in panos">
    <img class="image" :src="imgOrigin+item.content">
  </div>
</div>
</template>

<script>
import * as api from '../../api/api'

export default {

  name: "TuxunFilter",
  data() {
    return {
      panos: [],
    }
  },

  mounted() {
    this.create();
  },
  methods: {

    create() {
      api.getByPath('/api/v0/tuxun/challenge/create').then(res=>{
        if (res.data) {
          this.panos = res.data.rounds;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .image_container {
    width: 100%;
    .image {
      width: 100%;
      object-fit: contain;
    }
  }
}
</style>
