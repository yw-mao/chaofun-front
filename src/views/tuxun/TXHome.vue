<template>
  <div>
    <el-dialog title="发送弹幕" :visible.sync="dialogVisible" :append-to-body="true">
      <el-form :model="form"  @submit.native.prevent="send" v-on:submit.prevent="send">
        <el-form-item label="弹幕:">
          <el-input id="input" v-model="form.applyModReason" autocomplete="off"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hide()">取 消</el-button>
        <el-button type="primary" @click="send()">确 定</el-button>
      </div>
    </el-dialog>
    <div :class="[{'im-view': !ISPHONE}, {'im-view-phone': ISPHONE}]">

      <div id="viewer" v-if="this.contentType === 'panorama'" style="width: 100%; height: 100%"></div>
      <img v-if="this.image && this.contentType === 'image'" v-viewer="{inline: false}" :data-source="imgOrigin+ this.image" style=" width: 100%;height: 100%;object-fit: contain;"  :src="imgOrigin+ this.image" alt=""></img>
<!--      <video style="height: 100%" v-if="this.image && this.contentType === 'video'" controls autoplay muted :src="imgOrigin + this.image" alt="" ></video>-->
      <video style="height: 100%; max-width: 100%;"
             v-if="this.image && this.contentType === 'video'"
             webkit-playsinline="true"
             x-webkit-airplay="true"
             playsinline="true"
             x5-video-player-type="h5"
             x5-video-orientation="h5"
             x5-video-player-fullscreen="true"
             controls
             autoplay
             loop
             muted
             :src="imgOrigin+this.image"
             ref="videoPlayer"
             alt="">
      </video>
      <div v-if="status === 'rank'" style="position: absolute; width: 100%; height: 100%; background: white; opacity: 80%; overflow:auto;">
        <div style="padding-top: 40px; font-weight: bold; font-size: 20px;">排行榜:</div>
        <div v-if="this.rank" style="padding-top: 10px; font-weight: bold; font-size: 20px">你的本场次排名:{{this.rank}}</div>
        <div v-for="item in this.ranks" class="item">
          <div class="left">
            <img :src="imgOrigin+item.userAO.icon + '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'" alt="">
            <div class="info">
              <div class="title">{{item.userAO.userName}}</div>
              <p v-if="item.ratingChange  && item.ratingChange > 0" class="desc">积分变化：+{{item.ratingChange}}, 积分：{{ item.rating }}</p>
              <p v-if="!item.ratingChange && item.rating" class="desc">积分无变化, 积分：{{ item.rating }}</p>
              <p v-if="!item.ratingChange && !item.rating" class="desc">积分无变化</p>
              <p v-if="item.ratingChange  && item.ratingChange < 0" class="desc">积分变化：{{item.ratingChange}}, 积分：{{ item.rating }}</p>
            </div>
          </div>
          <div class="right">距离
            <p>{{ (item.distance / 1000.0).toFixed(2) }} 千米</p>
          </div>
        </div>
      </div>
      <vue-danmaku :danmus="danmus" use-slot  style="height:80%; width:100%; position: absolute; pointer-events: none" :speeds="120">
        <template slot="dm" slot-scope="{ index, danmu }">
          <div style="color: white; font-size: 24px;   -webkit-text-stroke: 0.5px black;">{{ danmu }}</div>
        </template>
      </vue-danmaku>
    </div>
    <baidu-map :center="center" :zoom="zoom" :scroll-wheel-zoom="true" :auto-resize="true" @ready="handler"  @click="click" :class="[{'bm-view': !ISPHONE}, {'bm-view-phone': ISPHONE}]">

      <bm-map-type
          :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP']"
          anchor="BMAP_ANCHOR_TOP_LEFT"
      ></bm-map-type>
      <bm-marker v-if="this.lng != null" :position="{lng: this.lng, lat: this.lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        <bm-label content="你选择了" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>
      </bm-marker>
      <bm-polyline v-if="this.polylinePath" :path="this.polylinePath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true"></bm-polyline>

      <bm-marker v-if="this.targetLng != null" :position="{lng: this.targetLng, lat: this.targetLat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        <bm-label content="目标地址" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>
      </bm-marker>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-view style="width: 100%; height: 100%; flex: 1"></bm-view>
    </baidu-map>

    <div :class="[{'confirm': !ISPHONE}, {'confirm-phone': ISPHONE}]">
      <el-button v-if="confirmed && distance">距离 {{ distance.toFixed(2) }} 千米</el-button>
      <el-button v-if="!confirmed && status !== 'rank'"  @click="confirm">确定选择</el-button>
      <el-button v-if="!isMaps && confirmed && !distance">等待答案</el-button>
      <el-button v-if="isMaps && confirmed && distance" @click="next" >下一题</el-button>
    </div>

    <div v-if="!this.isMaps" :class="[{'topRight': !ISPHONE}, {'topRight-phone': ISPHONE}]">
      <div :class="[{'top-info': !ISPHONE}, {'top-info-phone': ISPHONE}]">
        在线人数：{{this.onlineNums}}
      </div>
      <div v-if="timeLeft &&( this.status === 'wait' || this.status === 'wait_result')" :class="[{'top-info': !ISPHONE}, {'top-info-phone': ISPHONE}]">
        选择倒计时: {{Math.round(timeLeft)}}
      </div>
      <div v-if="timeLeft && this.status === 'rank'" :class="[{'top-info': !ISPHONE}, {'top-info-phone': ISPHONE}]">
        下一题: {{Math.round(timeLeft)}}
      </div>
    </div>
    <div class="home">
      <el-button size="mini" @click="toForum"> 社区讨论 </el-button>
      <el-button v-if="!this.isMaps" size="mini"  @click="toRank"> 积分排行 </el-button>
      <el-button v-if="!this.isMaps" size="mini"  @click="toSend"> 发送弹幕 </el-button>
      <el-button v-if="this.isMaps" size="mini"  @click="toHome"> 排位赛 </el-button>
      <el-button size="mini"  @click="toMaps"> 训练赛 </el-button>
      <el-button size="mini"  @click="toReport"> 坏题反馈 </el-button>
      <el-button v-if="this.$store.state.user.userInfo.userId === 1" size="mini"  @click="deleteTuxun"> 删除该题 </el-button>
      <el-button v-if="this.$store.state.user.userInfo.userId === 1 && this.isMaps" size="mini"  @click="removeFromMaps"> 移除该题 </el-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'
import { mapGetters } from 'vuex'
import * as api from '../../api/api'
import vueDanmaku from 'vue-danmaku'

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'GZPIvvSbzgo188vmBGwPOtU2ZCHDhkry'
})
import {Viewer} from 'photo-sphere-viewer'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import { CompassPlugin } from 'photo-sphere-viewer/dist/plugins/compass'
import 'photo-sphere-viewer/dist/plugins/compass.css'

export default {
  components: {
    vueDanmaku,
  },
  name: "TXHome",
  data () {
    return {
      danmus: [''],
      form: {
        applyModReason: '',
      },
      dialogVisible: false,
      viewer: null,
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
      contentType: null,
      heading: null,
      id: null,
      url: `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/v0/tuxun`,
      // url: `ws://47.96.98.153/ws/v0/tuxun`,
      ws: null,
      onlineNums: 1,
      status: null,
      rank: null,
      timeLeft: null,
      mapsId: null,
      isMaps: false,
      mute: false,
      ranks: []
    }
  },

  created() {
    this.mapsId = this.$route.query.mapsId;
    if (this.mapsId != null) {
      this.isMaps = true;
    }
  },
  mounted() {
    // screen.orientation.lock('landscape');
    if (!this.isMaps) {
      this.initWS();
    } else {
      this.next();
    }

    // this.contentType = 'video';
    // this.image = 'biz/dc7487cc7d3b849fa903f3e04b9a2824.mp4';

  },



  destroyed() {
    this.ws.close();
  },

  methods: {
    initPanorama() {
      try {
        this.viewer = new Viewer({
          container: document.querySelector('#viewer'),
          panorama: 'https://chaofun.oss-cn-hangzhou.aliyuncs.com/' + this.image,
          panoData: {
            // fullWidth: 6000,
            // fullHeight: 3000,
            // croppedWidth: 4000,
            // croppedHeight: 2000,
            // croppedX: 1000,
            // croppedY: 500,
            poseHeading: this.heading, // 0 to 360
            // posePitch: 0, // -90 to 90
            // poseRoll: 0, // -180 to 180
          },
          plugins: this.heading ? [
            [CompassPlugin, {
              size: '5vh',
              position: 'left bottom'
            }],
          ]: [],
        });
      } catch (e) {
        console.log(e)
      }
    },
    notShowPanorama() {
      this.viewer.hide();
    },
    initWS() {
      if (this.ws) {
        this.ws.close();
      }
      this.ws = new WebSocket(this.url);
      this.ws.onopen = this.wsOnOpen;
      this.ws.onmessage = this.wsOnMessage;
      this.ws.onclose = this.wsOnClose;
    },

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
      console.log(data);
      if (data.data.type === 'tick') {
        this.status = data.data.status;
        this.onlineNums = data.data.onlineNums;
        if (this.image !== data.data.content) {
          this.heading = data.data.heading;
          this.image = data.data.content;

          if (this.contentType !== data.data.contentType) {
            this.contentType = data.data.contentType;
          }

          if (this.viewer !== null) {
            this.viewer.destroy();
            this.viewer = null;
          }
        }

        if (this.contentType === "panorama" && this.viewer === null) {
          this.initPanorama();
        }

        this.confirmed = data.data.confirmed;
        this.timeLeft = data.data.timeLeft;

        // this.$toast(this.status)

        if (data.data.status === 'wait') {

          this.confirmed = false;
          this.polylinePath = null;
          if (this.targetLat !== null) {
            this.lat = null;
            this.lng = null;
          }
          this.targetLat = null;
          this.targetLng = null;
          this.polylinePath = null;
          this.distance = null;
          this.rank = null;
          this.ranks = null;
        }
        if (data.data.status === 'wait_result') {
          this.lat = data.data.chooseLat;
          this.lng = data.data.chooseLng;
          this.targetLat = null;
          this.targetLng = null;
          this.distance = null;
          this.rank = null;
          this.ranks = null;
        }
        if (data.data.status === 'rank') {
          this.lat = data.data.chooseLat;
          this.lng = data.data.chooseLng;
          if (this.targetLat == null) {
            this.map.centerAndZoom(new BMap.Point(data.data.lng, data.data.lat), 1);
          }
          this.targetLat = data.data.lat;
          this.targetLng = data.data.lng;
          if (data.data.chooseLat != null && this.polylinePath === null) {
            this.polylinePath = [
              {lng: data.data.lng, lat:data.data.lat},
              {lng: data.data.chooseLng, lat: data.data.chooseLat}];
          }
          this.distance = data.data.distance / 1000;
          this.rank = data.data.rank;
          this.ranks = data.data.ranks;
        }
      } else if (data.data.type === 'need_login') {
        this.doLoginStatus().then((res) => {

        });
      } else if (data.data.type === 'warning') {
        this.$toast(data.data.noteMessage);
      } else if (data.data.type === 'receive_bullet') {
        this.danmus.push(data.data.text);
      }
    },
    wsOnClose(e) {
      this.initWS();
      console.log("wsOnClose");
    },

    // 发送心跳
    sendHeartBeat() {
      this.wsSend(`{"scope": "heart_beat"}`);
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
      if (this.status === 'wait' || this.isMaps) {
        if (!this.confirmed) {
          console.log(e);
          console.log('123');

          console.log(e.Bg);
          this.lng = e.point.lng;
          this.lat = e.point.lat;
        }
      } else {
        this.$toast('暂不支持选择, 请等待结果或者下一题');
      }
    },
    confirm() {
      if (this.lng == null) {
        this.$toast('还未在地图上选择地点，请选择！');
        return;
      }
      if (!this.isMaps) {
        this.confirmed = true;
        this.wsSend("{\"scope\": \"tuxun\", \"data\": {\"type\": \"confirm\", \"lat\": " + this.lat + ", \"lng\": " + this.lng + "}}");
      } else {
        if (this.lng == null) {
          this.$toast('')
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
          this.distance = res.data.distanceMeter / 1000;
          this.polylinePath = [
            {lng: this.lng, lat: this.lat},
            {lng: res.data.lng, lat: res.data.lat}
          ]
        });
      }
    },

    wsSend(data) {
      console.log("wsSend: " + data);
      this.ws.send(data);
    },

    toForum(){
      try {
        window.flutter_inappwebview.callHandler('toAppForum',{forumId: 84+''})
      } catch (e) {
        window.open(location.origin + '/f/84',"_blank");
      }
    },
    toRank(){
      window.open(location.origin + '/tuxun/rank',"_blank");
    },

    toReport() {
      api.getByPath('/api/v0/tuxun/game/report', {content: this.image}).then(res=>{
        this.$toast("反馈成功");
      })
    },
    deleteTuxun() {
      api.getByPath('/api/v0/tuxun/game/delete', {content: this.image}).then(res=>{
        this.$toast("删除成功");
      })
    },

    removeFromMaps() {
      api.getByPath('/api/v0/tuxun/maps/remove', {tuxunId: this.id, mapsId: this.mapsId}).then(res=>{
        this.$toast("移除成功");
      })
    },
    toMaps() {
      window.open(location.origin + '/tuxun/maps',"_blank");
    },
    toHome() {
      window.open(location.origin + '/tuxun',"_blank");
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
      this.heading = null;
      if (this.viewer !== null) {
        this.viewer.destroy();
        this.viewer = null;
      }
      api.getByPath("/api/v0/tuxun/game/generate", {mapsId: this.mapsId}).then(res => {
            this.image = res.data.content;
            this.id  = res.data.id;
            this.contentType = res.data.type;
            this.heading = res.data.heading;
        var self = this;
        if (this.contentType === 'panorama') {
              setTimeout(function () {
                self.initPanorama();
              }, 500);
            }
          }
      );
    },

    send() {
      this.dialogVisible = false;
      this.wsSend("{\"scope\": \"tuxun\", \"data\": {\"type\": \"send_bullet\", \"text\": \"" + this.form.applyModReason + "\"}}");
      this.form.applyModReason = null;
      this.$toast("发送成功");
    },
    toSend() {
      this.dialogVisible = true;
      setTimeout(function () {
        document.getElementById("input").focus();
      }, 500);
    },
    hide() {
      this.dialogVisible = false;
    },
    mapReady(e) {
      console.log("hahah");
      console.log(e)
      this.map = e;
    },

  }
}
</script>

<style scoped lang="scss">
.im-view {
  position: absolute;
  width: 60%;
  height: 100%;
  bottom: 0;
  left: 0;
  text-align: center;
  overflow: hidden;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  transform-origin: center;

}
.im-view-phone {
  position: absolute;
  width: 100%;
  height: 60%;
  right: 0;
  left: 0;
  text-align: center;
  overflow: hidden;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  transform-origin: center;
}
.bm-view {
  position: absolute;
  width: 40%;
  height: 100%;
  bottom: 0;
  right: 0;
}
.bm-view-phone {
  position: absolute;
  width: 100%;
  height: 40%;
  bottom: 0;
  right: 0;
}


.confirm {
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 300px;
}

.confirm-phone {
  position: absolute;
  bottom: 20px;
  right: 20px;
  margin:auto;
}
.home {
  position: absolute;
  top: 5px;
  left: 20px;
}
.topRight {
  position: absolute;
  top: 20px;
  left: 50%;
  z-index: 100000;
}

.topRight-phone {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100000;
}

.top-info {
  font-size: 20px;
  font-weight: bold;
  color: white;
  -webkit-text-stroke: 0.8px black;
}
.top-info-phone {
  font-size: 10px;
  font-weight: bold;
  color: white;
  -webkit-text-stroke: 0.4px black;
}
.item{
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid #f1f1f1;
  // height: 60px;
  // box-sizing: border-box;
  text-align: left;
  overflow: hidden;
  .left{
    flex: 1;
    display: flex;
    img{
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
      vertical-align: middle;
    }
    .title{
      font-size: 16px;
      text-align: left;
    }
    .desc{
      width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #888;
      font-size: 13px;
    }
    .info{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
  .right{
    flex: 0 0 60px;
    // line-height: 40px;
    text-align: center;
    font-size: 12px;
    p{
      font-size: 14px;
    }
  }
}

</style>