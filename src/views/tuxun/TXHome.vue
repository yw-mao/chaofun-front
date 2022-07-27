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

    <div id="container" :class="[{'im-view': !ISPHONE}, {'im-view-phone': ISPHONE}]">
      <div v-show="this.contentType === 'panorama' && this.baiduPano && this.baiduPano !== null"  id="panorama" style="width: 100%; height: 100%;"></div>
      <div v-if="this.contentType === 'panorama' && !(this.baiduPano && this.baiduPano !== null) " id="viewer"  style="width: 100%; height: 100%"></div>
      <img v-if="this.image && this.contentType === 'image'" v-viewer="{inline: false}" :data-source="imgOrigin+ this.image" style=" width: 100%;height: 100%;object-fit: contain;"  :src="imgOrigin+ this.image" alt=""></img>
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

    <div id="map" :class="[{'bm-view': !ISPHONE}, {'bm-view-phone': ISPHONE && showMap}, {'bm-view-phone-hidden': ISPHONE && !showMap}]"></div>

    <div  :class="[{'confirm': !ISPHONE}, {'confirm-phone': ISPHONE}]">
      <el-button v-if="confirmed && distance" @click="clickDistance">距离 {{ distance.toFixed(2)}} 千米</el-button>
      <el-button v-if="(showMap || !ISPHONE) && !confirmed && status !== 'rank'"  @click="confirm">确定选择</el-button>
      <el-button v-else-if="!isMaps && confirmed && !distance" @click="centerChoose">等待答案</el-button>
      <el-button v-else-if="!showMap && ISPHONE && confirmed" @click="showMap = true">打开地图</el-button>
      <el-button v-else-if="!showMap && ISPHONE" @click="showMap = true">选择地点</el-button>
      <el-button v-if="isMaps && confirmed && distance" @click="next">下一题</el-button>
    </div>


    <div v-if="showMap && ISPHONE" style="position: absolute; left: 20px; bottom: 20px">
      <el-button @click="showMap = false">隐藏地图</el-button>
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
      <el-button size="mini" @click="toHome"> 图寻首页 </el-button>
      <el-button v-if="!this.isMaps" size="mini"  @click="toRank"> 积分排行 </el-button>
      <el-button v-if="!this.isMaps" size="mini"  @click="toSend"> 发送弹幕 </el-button>
      <el-button size="mini"  @click="toReport"> 坏题反馈 </el-button>
      <el-button v-if="ISPHONE" @click="reloadPage" size="mini">刷新页面</el-button>
      <el-button v-if="this.$store.state.user.userInfo.userId === 1" size="mini"  @click="deleteTuxun"> 删除该题 </el-button>
      <el-button v-if="this.$store.state.user.userInfo.userId === 1 && this.isMaps" size="mini"  @click="removeFromMaps"> 移除该题 </el-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// import BaiduMap from 'vue-baidu-map'
import { mapGetters } from 'vuex'
import * as api from '../../api/api'
import vueDanmaku from 'vue-danmaku'

// Vue.use(BaiduMap, {
//   // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
//   ak: 'aibVGReAhMEtxu4Bj2aHixWprh28AhrT'
// })
import {Viewer} from 'photo-sphere-viewer'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import { CompassPlugin} from 'photo-sphere-viewer/dist/plugins/compass'
import { MarkersPlugin} from 'photo-sphere-viewer/dist/plugins/markers'
import { VirtualTourPlugin } from 'photo-sphere-viewer/dist/plugins/virtual-tour'
import 'photo-sphere-viewer/dist/plugins/compass.css'
import 'photo-sphere-viewer/dist/plugins/virtual-tour.css'
import 'photo-sphere-viewer/dist/plugins/markers.css'
import BMapLoader from "../../utils/bmap-jsapi-loader";

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
      contents: null,
      contentType: null,
      heading: null,
      id: null,
      showMap: false,
      url: `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/v0/tuxun`,
      // url: `ws://127.0.0.1:8080/ws/v0/tuxun`,
      ws: null,
      onlineNums: 1,
      status: null,
      rank: null,
      timeLeft: null,
      mapsId: null,
      isMaps: false,
      mute: false,
      autoRotate: null,
      lastTouchTime: null,
      chooseMarker: null,
      targetMarker: null,
      targetLine: null,
      panorama: null,
      baiduPano: null,
      ranksMarker: null,
      ranks: [],
    }
  },

  created() {
    this.mapsId = this.$route.query.mapsId;
    this.autoRotate = this.$route.query.autoRotate;
    if (this.mapsId != null) {
      this.isMaps = true;
    }
  },
  mounted() {
    if (!this.isMaps) {
      this.initWS();
    } else {
      this.next();
    }

    BMapLoader.load({
      key: 'aibVGReAhMEtxu4Bj2aHixWprh28AhrT' ,
      version: '3.0'
    }).then((Bmap) => {
      var map = new BMap.Map("map", {});          // 创建地图实例
      map.centerAndZoom(new BMap.Point(106.0, 38.8), 1);
      map.enableScrollWheelZoom();
      map.disableContinuousZoom();
      var self = this;
      map.addEventListener("click", function(e){
        self.click(e);
      });
      map.addEventListener("touchend", function(e){
        self.touchEnd(e);
      });
      map.addEventListener("touchstart", function(e){
        self.touchStart(e);
      });

      var opts = {anchor: BMAP_ANCHOR_TOP_RIGHT};
      map.addControl(new BMap.NavigationControl(opts));
      map.addControl(new BMap.MapTypeControl({anchor: BMAP_ANCHOR_TOP_LEFT, mapTypes: [BMAP_NORMAL_MAP ,BMAP_SATELLITE_MAP]}));
      this.map = map;
      this.BMap = Bmap;
    });
  },

  destroyed() {
    this.ws.close();
  },

  methods: {
    initWS() {
      if (this.ws) {
        this.ws.close();
      }
      this.ws = new WebSocket(this.url);
      this.ws.onopen = this.wsOnOpen;
      this.ws.onmessage = this.wsOnMessage;
      this.ws.onclose = this.wsOnClose;
    },

    initPanorama() {
      try {


        var plugins = [];
        if (this.heading) {
          plugins.push([CompassPlugin, {
            size: '5vh',
            position: 'left bottom'
          }]);
        }

        if (this.contents && this.contents != null) {
          plugins.push([VirtualTourPlugin, {
            positionMode: VirtualTourPlugin.MODE_GPS,
            renderMode  : VirtualTourPlugin.MODE_3D,
            // preload: true,
          }]);
        }


        this.viewer = new Viewer({
          navbar: null,
          container: document.querySelector('#viewer'),
          panorama: 'https://i.chao-fan.com/' + this.image,
          panoData: {
            poseHeading: this.heading, // 0 to 360
          },
          defaultZoomLvl: 0,
          autorotateDelay: this.autoRotate !== 'true' ? null : 100,
          // autorotateIdle: 2000,
          plugins: plugins,
        });



        if (this.contents && this.contents != null && this.contents.length > 1) {
          var nodes = [];
          console.log(this.contents)
          for (var i in this.contents) {
            console.log(content);
            const content = this.contents[i];
            var k = {};
            if (content.contentSpeedUp && content.contentSpeedUp !== null) {
              k.panorama = 'https://i.chao-fan.com/' + content.contentSpeedUp;
            } else {
              k.panorama = 'https://i.chao-fan.com/' + content.content;
            }
            // k.panorama =  k.panorama + '?x-oss-process=image/resize,h_1664'
            k.links = [];
            for (var j in content.links) {
              k.links.push({nodeId:  content.links[j]});
            }
            k.name = '全景图_' + i;
            k.id = content.id;
            k.position = [content.lng, content.lat];
            k.panoData = {poseHeading: content.heading};
            nodes.push(k);
          }

          console.log(nodes);
          var virtualTour = this.viewer.getPlugin(VirtualTourPlugin);
          virtualTour.setNodes(nodes, nodes[0].id);
        }
      } catch (e) {
        console.log(e)
      }
    },
    notShowPanorama() {
      this.viewer.hide();
    },


    initBaiduPanorama() {
      console.log("initBaiduPanorama_1");
      if (!this.panorama || this.panorama === null) {
        var panorama = new BMap.Panorama('panorama',  {navigationControl: true, linksControl:true}); //默认为显示导航控件
        this.panorama = panorama;
        console.log("initBaiduPanorama_2");
      }
      console.log("initBaiduPanorama_3");
      this.panorama.setId(this.baiduPano);
      setTimeout(function () {
        console.log("initBaiduPanorama_4");
        try {
          var element = document.getElementById('panorama');
          element.childNodes.item(3).style.display = 'none'
        } catch (e) {

        }
      }, 200);
    },

    wsOnOpen(e) {
      console.log("wsOnOpen");
      // console.log(e);

      this.wsSend("{\"scope\": \"tuxun\", \"data\": {\"type\": \"enter_main_game\"}}");

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
        // 避免下面的判断失误
        if (data.data.contentSpeedUp && data.data.contentSpeedUp !== null) {
          data.data.content = data.data.contentSpeedUp
        }
        if (this.image !== data.data.content && data.data.content && data.data.content !== null) {
          this.showMap = false;
          this.heading = data.data.heading;
          this.image = data.data.content;

          // this.baiduPano = data.data.baiduPano;
          // this.contents = data.data.contents;

          if (this.contentType !== data.data.contentType) {
            this.contentType = data.data.contentType;
          }

          if (this.viewer !== null) {
            this.viewer.destroy();
            this.viewer = null;
          }

          if (this.contentType === "panorama") {
            if (this.baiduPano && this.baiduPano !== null) {
              var self = this;
              setTimeout(function () {
                self.initBaiduPanorama();
              }, 200);
            }
          }
        }

        if (this.contentType === "panorama") {
          if (this.viewer == null && !(this.baiduPano && this.baiduPano !== null)) {
            this.initPanorama();
          }
        }

        this.confirmed = data.data.confirmed;
        this.timeLeft = data.data.timeLeft;

        // this.$toast(this.status)

        if (data.data.status === 'wait') {
          this.confirmed = false;
          if (this.targetLat !== null) {
            this.lat = null;
            this.lng = null;
            this.removeChooseMarker();
          }
          this.targetLat = null;
          this.targetLng = null;
          this.removeTargetMarker();
          this.polylinePath = null;
          this.removeLine();
          this.distance = null;
          this.rank = null;
          this.ranks = null;
          this.clearRanksMarker();
        }
        if (data.data.status === 'wait_result') {
          this.lat = data.data.chooseLat;
          this.lng = data.data.chooseLng;
          this.addChooseMarker();
          this.targetLat = null;
          this.targetLng = null;
          this.removeTargetMarker();
          this.distance = null;
          this.rank = null;
          this.ranks = null;
          this.clearRanksMarker();
        }
        if (data.data.status === 'rank') {
          this.rank = data.data.rank;
          this.ranks = data.data.ranks;
          if (!this.targetLat || this.targetLat === null) {
            this.lat = data.data.chooseLat;
            this.lng = data.data.chooseLng;
            this.addChooseMarker();
            this.targetLat = data.data.lat;
            this.targetLng = data.data.lng;
            this.addTargetMarker()
            this.distance = data.data.distance / 1000;

            this.showMap = true;

            if (data.data.chooseLat != null && this.polylinePath === null) {
              this.polylinePath = [
                new BMap.Point(this.lng, this.lat),
                new BMap.Point(this.targetLng, this.targetLat),
              ]
              this.addLine();

            }

            if (this.targetLat && this.targetLat !== null) {
              this.map.centerAndZoom(new BMap.Point(data.data.lng, data.data.lat), 1);
            }
            // 增加其他人
            if (this.ranksMarker && this.ranksMarker.length == 0 && this.ranks != null) {
              this.addRanksMarker();
            }
          }
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

    clickDistance() {
      if (this.showMap === false) {
        this.showMap = true
      }
    },

    centerChoose() {
      if (this.showMap === false) {
        this.showMap = true
      }
      this.map.centerAndZoom(new BMap.Point(this.lng, this.lat), 5);
    },

    reloadPage() {
      this.$router.go(this.$router.currentRoute);
    },

    // 发送心跳
    sendHeartBeat() {
      this.wsSend(`{"scope": "heart_beat"}`);
    },

    touchStart(e) {
      this.lastTouchTime = new Date().getTime();
    },

    touchEnd(e) {
      console.log('touchEnd');
      var period = new Date().getTime() - this.lastTouchTime;
      console.log(period);
      if (period < 150) {
        this.click(e);
      }
      this.lastTouchTime = 0;
    },

    removeChooseMarker() {
      if (this.chooseMarker !== null) {
        this.map.removeOverlay(this.chooseMarker);
      }
      this.chooseMarker = null;
    },

    addChooseMarker() {
      var point = new BMap.Point(this.lng,this.lat);
      var marker = new BMap.Marker(point);        // 创建标注
      marker.disableDragging();
      var label = new BMap.Label('你选择了');        // 创建标注
      label.setOffset(new BMap.Size(-15, 30));
      console.log(label.getOffset())
      marker.setLabel(label);
      if (this.chooseMarker !== null) {
        this.map.removeOverlay(this.chooseMarker);
      }
      this.chooseMarker = marker;
      this.map.addOverlay(marker);
    },

    addLine() {
      if (this.targetLine && this.targetLine !== null) {
        this.map.removeOverlay(this.targetLine);
      }
      var line =  new BMap.Polyline(this.polylinePath);
      this.targetLine = line;
      this.map.addOverlay(line);
    },


    removeLine() {
      if (this.targetLine !== null) {
        this.map.removeOverlay(this.targetLine);
      }
      this.targetLine = null;
    },

    removeTargetMarker() {
      if (this.targetMarker !== null) {
        this.map.removeOverlay(this.targetMarker);
      }
      this.targetMarker = null;
    },

    addTargetMarker() {
      var point = new BMap.Point(this.targetLng,this.targetLat);
      var marker = new BMap.Marker(point);        // 创建标注
      marker.disableDragging();
      var label = new BMap.Label('目标位置');        // 创建标注
      label.setOffset(new BMap.Size(-15, 30));
      console.log(label.getOffset())
      marker.setLabel(label);
      if (this.targetMarker !== null) {
        this.map.removeOverlay(this.targetMarker);
      }
      this.targetMarker = marker;
      this.map.addOverlay(marker);
    },

    addRanksMarker() {
      this.ranksMarker = [];
      if (this.ranks) {
        this.ranks.forEach( item => {
          if (item.userAO.userId !== this.$store.state.user.userInfo.userId) {
            var point = new BMap.Point(item.latLng.lng, item.latLng.lat);
            var marker = new BMap.Marker(point);        // 创建标注
            marker.disableDragging();
            var label = new BMap.Label(item.userAO.userName);        // 创建标注
            label.setOffset(new BMap.Size(-15, 30));
            console.log(label.getOffset())
            marker.setLabel(label);
            this.ranksMarker.push(marker);
            this.map.addOverlay(marker);
          }
        });
      }
    },

    clearRanksMarker() {
      if (this.ranksMarker) {
        this.ranksMarker.forEach(item => {
          this.map.removeOverlay(item);
        });
      }
      this.ranksMarker = [];
    },

    click(e) {
      if (this.status === 'wait' || this.isMaps) {
        if (!this.confirmed) {
          this.lng = e.point.lng;
          this.lat = e.point.lat;
          this.addChooseMarker();
        }
      } else {
        this.$toast('暂不支持选择, 请等待结果或者下一题');
      }
    },

    confirm() {
      if (this.lng === null) {
        this.$toast('还未在地图上选择地点，请选择！');
        return;
      }
      if (!this.isMaps) {
        this.confirmed = true;
        this.wsSend("{\"scope\": \"tuxun\", \"data\": {\"type\": \"confirm\", \"lat\": " + this.lat + ", \"lng\": " + this.lng + "}}");
      } else {
        if (this.lng === null) {
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
          this.addTargetMarker();
          this.map.centerAndZoom(new BMap.Point(this.targetLng, this.targetLat), 1);
          this.distance = res.data.distanceMeter / 1000;
          this.polylinePath = [
            new BMap.Point(this.lng, this.lat),
            new BMap.Point(this.targetLng, this.targetLat),
          ]
          this.addLine();
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
      this.$router.push({path: '/tuxun'});
    },
    next() {
      this.showMap = false;
      this.confirmed = false;
      this.returnResult = true;
      this.polylinePath = null;
      this.lng = null;
      this.lat = null;
      this.targetLat = null;
      this.targetLng = null;
      this.image = null;
      this.distance = null;
      this.heading = null;
      this.contents = null;
      if (this.viewer !== null) {
        this.viewer.destroy();
        this.viewer = null;
      }


      this.removeChooseMarker();
      this.removeTargetMarker();
      this.removeLine();
      api.getByPath("/api/v0/tuxun/game/generate", {mapsId: this.mapsId}).then(res => {
        this.image = res.data.content;
        this.id  = res.data.id;
        this.contentType = res.data.type;
        this.heading = res.data.heading;
        // this.baiduPano = res.data.baiduPano;
        // this.contents = res.data.contents;

        if (res.data.contentSpeedUp && res.data.contentSpeedUp !== null) {
          this.image = res.data.contentSpeedUp;
        }

        console.log('test_123');
        var self = this;
        if (this.contentType === 'panorama') {
          setTimeout(function () {
            if (self.baiduPano && self.baiduPano !== null) {
              self.initBaiduPanorama();
            } else {
              self.initPanorama();
            }
          }, 500);
        }
      });
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
  height: 100%;
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
  height: 60%;
  bottom: 0;
  right: 0;
}
.bm-view-phone-hidden {
  position: absolute;
  width: 100%;
  height: 60%;
  bottom: 0;
  right: 0;
  visibility: hidden;
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