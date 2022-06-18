<template>
  <div>
    <img v-if="image" class="im-view" :src="imgOrigin+ this.image" alt="">
    </img>
    <div class="home">
      <div>
        <el-button @click="toForum"> 社区讨论 </el-button>
      </div>

      <div style="padding-top: 10px">
        <el-button @click="toRank"> 排行榜 </el-button>
      </div>
    </div>
    <baidu-map :center="center" :zoom="zoom" :scroll-wheel-zoom="true" :auto-resize="true" @ready="handler" @ @click="click" class="bm-view">
      <bm-marker v-if="this.lng != null" :position="{lng: this.lng, lat: this.lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        <bm-label content="你选择了" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>
      </bm-marker>
      <bm-polyline v-if="this.polylinePath" :path="this.polylinePath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" @lineupdate="updatePolylinePath"></bm-polyline>

      <bm-marker v-if="this.targetLng != null" :position="{lng: this.targetLng, lat: this.targetLat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        <bm-label content="目标地址" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>
      </bm-marker>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-view style="width: 100%; height: 100%; flex: 1"></bm-view>
    </baidu-map>

    <div class="confirm">
      <el-button v-if="confirmed && returnResult">距离 {{distance}} 千米</el-button>
      <el-button v-if="confirmed" @click="next">下一题</el-button>
      <el-button v-if="!confirmed"  @click="confirm">确定选择</el-button>
    </div>

    <div class="topRight">
      <div>
        在线人数：{{this.onlineNums}}
      </div>
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
  name: "TXHome",
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
      url: `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/v0/tuxun`,
      // url: `ws://127.0.0.1:8080/ws/v0/tuxun`,
      ws: null,
      onlineNums: 1,
    }
  },
  mounted() {
    // this.resizeScreen();
    if (this.ws) {
      this.ws.close();
    }
    this.ws = new WebSocket(this.url);
    this.ws.onopen = this.wsOnOpen;
    this.ws.onmessage = this.wsOnMessage;
    // this.ws.onerror = this.wsOnError;
    // this.ws.onclose = this.wsOnClose;

    this.next();
  },


  methods: {

    wsOnOpen(e) {
      console.log("wsOnOpen");
      // console.log(e);

      // 每3秒发送一次心跳
      setInterval(() => {
        this.sendHeartBeat();
      }, 3000);
    },

    //
    wsOnMessage(e) {
      console.log("wsOnMessage");
      // console.log(e);
      const data = JSON.parse(e.data);
      // console.log(data);

      this.onlineNums = data.data.onlineNums;
    },
      // 发送心跳
    sendHeartBeat() {
      this.wsSend(`{"scope": "heart_beat"}`);
    },
    resizeScreen() {

    },
    handler ({BMap, map}) {
      console.log(BMap, map)
      this.center.lng = 106.0
      this.center.lat = 38.8
      this.zoom = 1;
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

    toForum(){
      try {
        window.flutter_inappwebview.callHandler('toAppForum',{forumId: 84+''})
      } catch (e) {
        window.open(location.origin + '/f/84',"_blank");
      }
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
    },
    toRank() {
      this.$toast('敬请期待');
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
  width: 250px;
}
.home {
  position: absolute;
  top: 20px;
  left: 20px;
}

.topRight {
  position: absolute;
  top: 20px;
  left: 50%;
}
</style>