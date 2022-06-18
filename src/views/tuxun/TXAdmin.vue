<template>
  <div>
    <img v-if="image" class="im-view" :src="imgOrigin+ this.image" alt="">

    </img>


    <div class="confirm">
      <el-button v-if="confirmed && returnResult"  @click="confirm">距离 {{distance}} 千米</el-button>
      <el-button v-if="confirmed" @click="next">下一题</el-button>
      <el-button v-if="!confirmed"  @click="confirm">确定选择</el-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'
import { mapGetters } from 'vuex'
import * as api from '../../api/api'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'GZPIvvSbzgo188vmBGwPOtU2ZCHDhkry'
})
export default {
  name: "TXAmin",
  data () {
    return {
      center: {lng: 0, lat: 0},
      zoom: 3,
      lng: null,
      lat: null,
      targetLng: null,
      targetLat: null,
      map: null,
      BMap: null,
      confirmed: false,
      polylinePath: null,
      returnResult: true,
      distance: null,
      image: null,
      id: null,
    }
  },
  mounted() {
    this.next();
  },
  methods: {
    handler ({BMap, map}) {
      console.log(BMap, map)
      this.center.lng = 106.0
      this.center.lat = 38.8
      this.zoom = 5;
      this.map = map;
      this.BMap = BMap;

    },

    click(e) {
      if (!this.confirmed) {
        console.log(e);
        console.log('123');

        // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        console.log(e.Bg);
        this.lng = e.point.lng;
        this.lat = e.point.lat;
      }
    },
    confirm() {
      if (this.lng == null) {
        this.$toast('还未在地图上选择地点，请选择！');
        return;
      }
      this.zoom = 20;
      this.map.setZoom(0);
      this.$toast('确认成功！')

      this.confirmed = true;
      api.getByPath("/api/v0/tuxun/game/confirm", {id: this.id, lng: this.lng, lat: this.lat}).then(res => {
        this.confirmed = true;
        this.targetLng = res.data.lng;
        this.targetLat = res.data.lat;
        this.distance = (res.data.distanceMeter / 1000).toFixed(2);

        this.polylinePath = [
          {lng: this.lng, lat: this.lat},
          {lng: res.data.lng, lat: res.data.lat}
        ]
      });
    },

    next() {
      this.confirmed = false;
      this.returnResult = true;
      this.polylinePath = false;
      this.lng = null;
      this.lat = null;
      this.targetLat = null;
      this.targetLng = null;
      this.image = null;
      this.distance = null;
      api.getByPath("/api/v0/tuxun/game/generate", null).then(res => {
            this.image = res.data.content;
            this.id  = res.data.id;
          }
      );
    },
    mapReady(e) {
      console.log("hahah");
      console.log(e)
      this.map = e;
    }
  }
}
</script>

<style scoped>
.im-view {
  position: absolute;
  width: 60%;
  height: 100%;
  bottom: 0;
  left: 0;
}
.bm-view {
  position: absolute;
  width: 40%;
  height: 100%;
  bottom: 0;
  right: 0;
}

.confirm {
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 300px;
}
</style>