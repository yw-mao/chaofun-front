<template>
  <div>
    <img v-if="image" class="im-view" :src="'https://i.chao.fan/'+ this.image" alt="">
    </img>


    <div class="confirm">
      <el-button @click="check">加入题库</el-button>
      <el-button @click="deleteQ">删除题目</el-button>
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
      index: -1,
    }
  },
  mounted() {
    let self = this;
    document.onkeydown=function(event){
      console.log("hahah");
      var e = event || window.event || arguments.callee.caller.arguments[0];
      console.log(e);
      //
      // if(e && e.keyCode==37){//左
      //     self.last()
      // }
      if(e && e.keyCode==38){//上
        self.check()
      }
      // if(e && e.keyCode==39){//右
      //     self.next()
      // }

      if(e && e.keyCode==40){//下
          self.deleteQ()
      }
    };

    this.doLoginStatus().then((res) => {
      this.next();
    });
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
    deleteQ() {
      api.getByPath("/api/v0/tuxun/game/delete", {id: this.id}).then(res => {
        this.index = this.index -1;
        this.next();
      });
    },

    last() {
      this.index  = this.index -2 ;
      this.next();
    },

    check() {
      api.getByPath("/api/v0/tuxun/game/check", {id: this.id}).then(res => {
        this.index = this.index -1;
        this.next();
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
      this.index = this.index + 1;
      api.getByPath("/api/v0/tuxun/game/generateQueue", {index: this.index}).then(res => {
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
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  object-fit: contain;
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
}
</style>