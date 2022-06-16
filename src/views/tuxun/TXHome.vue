<template>
<div>
  <baidu-map :center="center" :zoom="zoom" @ready="handler" @click="click" class="bm-view" @focus>
    <bm-marker v-if="this.lng != null" :position="{lng: this.lng, lat: this.lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
      <bm-label content="你选择了" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>
    </bm-marker>
    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
  </baidu-map>
</div>
</template>

<script>
import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'GZPIvvSbzgo188vmBGwPOtU2ZCHDhkry'
})
export default {
  name: "TXHome",
  data () {
    return {
      center: {lng: 0, lat: 0},
      zoom: 3,
      lng: null,
      lat: null,
    }
  },
  methods: {
    handler ({BMap, map}) {
      console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 15
    },

    click(e) {
      console.log(e)
      console.log(e.Bg);
      this.lng = e.Bg.lng;
      this.lat = e.Bg.lat;
    },
  }
}
</script>

<style scoped>
.bm-view {
  width: 100%;
  height: 600px;
}
</style>