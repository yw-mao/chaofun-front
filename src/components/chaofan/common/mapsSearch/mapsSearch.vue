<template>
  <div  v-if="show" class="cover">
    <div class="ycovers" >
      <section style="width: 60%; display: block;overflow:scroll; overscroll-behavior: contain; height: 100%">
        <div v-for="(item, index) in this.pagedata" >
          <div style="height: 50px; color: white">
            {{item.name}}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
export default {
  name: "mapsSearch",
  data() {
    return {
      show: false,
      pagedata: null
    }
  },
  mounted() {
    this.getHotMaps();
  },
  methods: {
    getHotMaps(){
      api.getByPath('/api/v0/tuxun/maps/list').then(res=>{
        this.pagedata = res.data
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.ycovers {
  position: fixed;
  z-index: 2012;
  top: 0;
  left: 0;
  right: 0;
  //bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-around;

  .ycontainer {
    background: #fff;
    width: 400px;
    max-width: 90%;
    // height: 350px;
    box-sizing: border-box;
    padding: 30px;
    border-radius: 10px;
    position: relative;
    min-height: 330px;
  }
}
</style>
