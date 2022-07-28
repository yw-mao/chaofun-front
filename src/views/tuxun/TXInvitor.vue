<template>
  <div class="container">
    <div class="" v-if="status==='wait'">

    </div>

    <div class="" v-if="status==='need_join'">

    </div>

    <div class="prepare" v-if="status==='wait_join' || status === 'ready'">
      <div class="goback">

      </div>

      <div class="header">
        图寻1v1决斗
      </div>



      <div class="vs">
        <div class="player">
          <el-avatar :src="this.imgOrigin + gameData.host.icon" class="avatar"></el-avatar>
          <div class="userName">{{gameData.host.userName}}</div>
        </div>
        <img class="vs_img" v-if="gameData && gameData.playerIds.length === 2" :src="this.imgOrigin + 'biz/1658807128256_91c9df63c2d144359005b6f504a96a81.png'">
        </img>
        <div v-if="gameData && gameData.playerIds.length === 2" class="player">
          <el-avatar :src="this.imgOrigin + gameData.players[1].icon" class="avatar"></el-avatar>
          <div class="userName">{{gameData.players[1].userName}}</div>
        </div>
      </div>


      <div class="start_game" v-if="status === 'ready' && this.$store.state.user.userInfo.userId === gameData.host.userId">
        <el-button class="button" type="primary" round @click="start">开始图寻</el-button>
      </div>

      <div v-if="gameData.playerIds.length !== 2" class="wait_game_start">
        等待其他玩家加入....
      </div>

      <div v-if="this.$store.state.user.userInfo.userId !== gameData.host.userId" class="wait_game_start">
        等待房主开始游戏...
      </div>

      <div class="invite" v-if="status !== 'ready'">
        <div class="title">
          邀请链接
        </div>
        <div class="body">
          <input placeholder readonly :value="'https://chao.fan' + this.$route.fullPath" >
          </input>
          <el-button class="button" type="warning" @click="copyInviterLink">复制</el-button>
        </div>
      </div>
    </div>

    <div class="game" v-if="status === 'ongoing' || status === 'finish'">
      <div :class="[{'im-view': !ISPHONE}, {'im-view-phone': ISPHONE}]">
        <div id="viewer"  style="width: 100%; height: 100%"></div>
        <div v-if="showRoundResult" class="round_result">
          <div class="round_result_center">
            <div class="round_result_block">
              {{gameData.teams[0].users[0].userName}} 本局得分: {{gameData.teams[0].lastRoundResult.score}}
              <div>
                血量变化：{{gameData.teams[0].lastRoundResult.healthAfter - gameData.teams[0].lastRoundResult.healthBefore}}
              </div>
            </div>
            <div class="round_result_block">
              {{gameData.teams[1].users[0].userName}} 本局得分: {{gameData.teams[1].lastRoundResult.score}}
              <div>
                血量变化：{{gameData.teams[1].lastRoundResult.healthAfter - gameData.teams[1].lastRoundResult.healthBefore}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="lastRound && lastRound.timerStartTime && !lastRound.endTime " :class="[{'top-info': !ISPHONE}, {'top-info-phone': ISPHONE}]">
        选择倒计时: {{timeLeft}}
      </div>
      <div v-if="showGameEnd && winner" class="game_result">
        <div class="player">
          <div class="winner_title">
            赢家
          </div>
          <el-avatar :src="this.imgOrigin + winner.icon" class="avatar"></el-avatar>
          <div class="userName">{{winner.userName}}</div>
        </div>
      </div>
      <div id="map" :class="[{'bm-view': !ISPHONE}, {'bm-view-phone': ISPHONE && showMap}, {'bm-view-phone-hidden': ISPHONE && !showMap}]"></div>

      <div :class="[{'confirm': !ISPHONE}, {'confirm-phone': ISPHONE}]">
        <el-button v-if="(showMap || !ISPHONE) && !confirmed && status !== 'rank'"  @click="confirm">确定选择</el-button>
        <el-button v-else-if="!showMap && ISPHONE && confirmed" @click="showMap = true">打开地图</el-button>
        <el-button v-else-if="!showMap && ISPHONE" @click="showMap = true">选择地点</el-button>
      </div>

      <div v-if="gameData" class="game_hud">
        <div class="hub_left">
          <div class="user_title">
            {{gameData.teams[0].users[0].userName}}
          </div>
          <div class="user_blod_left">
            血量：{{gameData.teams[0].health}}
          </div>
        </div>

        <div class="hub_right">
          <div class="user_title">
            {{gameData.teams[1].users[0].userName}}
          </div>
          <div class="user_blod_right">
            血量：{{gameData.teams[1].health}}
          </div>
        </div>

      </div>
    </div>

    <div class="not_support_phone" v-if="ISPHONE">
      移动端马上支持，尽请期待
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
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
  name: "TXInvitor",
  data () {
    return {
      url: `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/v0/tuxun`,
      // url: `ws://127.0.0.1:8080/ws/v0/tuxun`,
      ws: null,
      status: 'wait',
      gameId: this.gameId,
      gameData: undefined,
      lastRound: undefined,
      map: null,
      BMap: null,
      viewer: undefined,
      image: undefined,
      confirmed: false,
      chooseMarker: null,
      showMap: false,
      currentRound: null,
      lastTouchTime: 0,
      showRoundResult:  false,
      showGameEnd: false,
      timeLeft: 15,
      team1User: undefined,
      team2User: undefined,
      winner: undefined,
      // gameData: {playerIds: [1, 2]}
    }
  },

  mounted() {
    this.gameId = this.$route.query.gameId;

    if (!this.ISPHONE) {
      this.initWS();
      this.join();
      this.countDown();
    }
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

    wsOnOpen(e) {
      console.log("wsOnOpen");
      // console.log(e);

      this.wsSend("{\"scope\": \"tuxun\", \"data\": {\"type\": \"subscribe_solo\", \"text\": \"" + this.gameId+ "\"}}");
      // 每3秒发送一次心跳
      setInterval(() => {
        this.wsSend(`{"scope": "heart_beat"}`);
      }, 15000);
    },

    wsOnMessage(e) {
      const data = JSON.parse(e.data);
      this.solveGameData(data.data.game, data.data.code);
    },

    solveGameData(data, code) {
      this.gameData = data;

      if (this.gameData.rounds && this.gameData.rounds.length > 0) {
        this.lastRound = this.gameData.rounds[this.gameData.rounds.length-1];
      }

      if (code === 'game_end' || data.status === 'finish') {
        this.showGameEnd = true;
        if (this.gameData.teams[0].health === 0) {
          this.winner = this.gameData.teams[1].users[0];
        } else {
          this.winner = this.gameData.teams[0].users[0];
        }
      }

      if ((code === 'round_end' ||
              (this.lastRound && this.lastRound.endTime))
          && !this.showGameEnd ) {
        this.showRoundResult = true;

        if (!this.targetLng) {
          this.targetLat = this.lastRound.lat;
          this.targetLng = this.lastRound.lng;
          this.polylinePath = [
            new BMap.Point(this.lng, this.lat),
            new BMap.Point(this.targetLng, this.targetLat),
          ]
          this.addTargetMarker();
          this.addLine();
          if (this.lat) {
            this.map.centerAndZoom(new BMap.Point(this.targetLng, this.targetLat), 1);
          }
        }
      } else {
        this.showRoundResult = false;
      }

      if (data.status === 'wait_join' || data.status === 'ready' || data.status === 'ongoing' || data.status === 'finish') {
        this.status = data.status;

        if (data.status === 'ongoing') {
          console.log('123')
          if (this.image !== this.gameData.rounds[this.gameData.rounds.length-1].content) {
            this.image = this.gameData.rounds[this.gameData.rounds.length-1].content;
            this.lat = null;
            this.lng = null;
            this.targetLat = undefined;
            this.targetLng = undefined;
            this.confirmed = null;
            this.removeChooseMarker()
            this.removeTargetMarker();
            this.removeLine();

            if (this.viewer) {
              this.viewer.destroy();
              this.viewer = undefined;
            }

            setTimeout(function () {
              var plugins = [];
              if (this.lastRound.heading) {
                plugins.push([CompassPlugin, {
                  size: '5vh',
                  position: 'left bottom'
                }]);
              }

              this.viewer = new Viewer({
                navbar: null,
                container: document.querySelector('#viewer'),
                panorama: 'https://i.chao-fan.com/' + this.lastRound.content,
                // panoData: {
                //   poseHeading: this.heading, // 0 to 360
                // },
                defaultZoomLvl: 0,
              });
            }.bind(this), 200);

          }

          if (this.map === null) {
            setTimeout(function () {

              BMapLoader.load({
                key: 'aibVGReAhMEtxu4Bj2aHixWprh28AhrT',
                version: '3.0'
              }).then((Bmap) => {
                var map = new BMap.Map("map", {});          // 创建地图实例
                map.centerAndZoom(new BMap.Point(106.0, 38.8), 1);
                map.enableScrollWheelZoom();
                map.disableContinuousZoom();
                var self = this;
                map.addEventListener("click", function (e) {
                  self.click(e);
                });
                map.addEventListener("touchend", function (e) {
                  self.touchEnd(e);
                });
                map.addEventListener("touchstart", function (e) {
                  self.touchStart(e);
                });
                // map.setMapStyleV2({
                //   styleId: '0eb3aa47a2aac583e238cabe88a001f3'
                // });

                var opts = {anchor: BMAP_ANCHOR_TOP_RIGHT};
                map.addControl(new BMap.NavigationControl(opts));
                map.addControl(new BMap.MapTypeControl({
                  anchor: BMAP_ANCHOR_TOP_LEFT,
                  mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP]
                }));
                this.map = map;
                this.BMap = Bmap;
              });

            }.bind(this), 200);
          }

        }
      }
    },

    wsSend(data) {
      console.log("wsSend: " + data);
      this.ws.send(data);
    },

    wsOnClose(e) {
      setTimeout(function () {
        this.initWS();
      }.bind(this), 1000);
      console.log("wsOnClose");
    },

    copyInviterLink() {
      var input = document.createElement('input');
      input.setAttribute('value', location.host + this.$route.fullPath);
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast("复制邀请地址成功");
      return result;
    },

    get() {
      this.doLoginStatus().then((res) => {

      });
    },
    join() {
      console.log('123');
      this.doLoginStatus().then((res) => {
        api.getByPath("/api/v0/tuxun/solo/join", {gameId: this.gameId}).then(res => {
          console.log(res.data);
          this.solveGameData(res.data, undefined);
        });
      });
    },

    start() {
      api.getByPath("/api/v0/tuxun/solo/start", {gameId: this.gameId}).then(res => {
        this.solveGameData(res.data, undefined);
      });
    },

    click(e) {
      if (!this.confirmed) {
        this.lng = e.point.lng;
        this.lat = e.point.lat;
        this.addChooseMarker();
      }
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

    countDown() {
        setInterval(() => {
          if (this.lastRound && this.lastRound.timerStartTime && !this.lastRound.endTime) {
            this.timeLeft =  Math.round(15 - ((new Date().getTime()) - this.lastRound.timerStartTime) / 1000);
          } else {
            this.timeLeft = 15;
          }
        }, 1000);
    },

    removeLine() {
      if (this.targetLine) {
        this.map.removeOverlay(this.targetLine);
      }
      this.targetLine = undefined;
    },

    removeTargetMarker() {
      if (this.targetMarker) {
        this.map.removeOverlay(this.targetMarker);
      }
      this.targetMarker = undefined;
    },

    addTargetMarker() {
      var point = new BMap.Point(this.targetLng,this.targetLat);
      var marker = new BMap.Marker(point);        // 创建标注
      marker.disableDragging();
      var label = new BMap.Label('目标位置');        // 创建标注
      label.setOffset(new BMap.Size(-15, 30));
      console.log(label.getOffset())
      marker.setLabel(label);
      if (this.targetMarker) {
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

    confirm() {
      this.confirmed = true;
      api.getByPath("/api/v0/tuxun/solo/guess", {gameId: this.gameId, lng: this.lng, lat: this.lat}).then(res => {
        // this.solveGameData(res.data, undefined);
      });
    },

  }

}
</script>

<style lang="scss" scoped>
.container {

  position: absolute;
  width: 100%;
  min-height: 100%;
  text-align: center;
  background-color: #090723;
  .player {
    width: 40%;
    margin: auto;
    div{
      color: white;
    }
    .winner_title {
      font-size: xxx-large;
    }
    .avatar {
      width: 150px;
      height: 150px;
      margin: 0 auto;
    }

    .userName {
      margin-top: 1rem;
      font-size: x-large;
    }
  }
  .prepare {
    padding-bottom: 10rem;
    div {
      color: white;
    }

    .header {
      padding-top: 5rem;
      color: white;
      font-size: xx-large;
    }

    .vs {
      padding-top: 3rem;
      display: block;
      width: 40%;
      justify-content: center;
      margin: auto;
      display: flex;
      .vs_img {
        width: 100px;
        height: 100px;
        margin: auto;
      }

    }

    .start_game {
      padding-top: 3rem;
      .button {
        height: 3rem;
        width: 10rem;
        font-size: large;
      }
    }

    .wait_game_start {
      padding-top: 3rem;
      font-size: x-large;
    }

    .invite {
      margin: 5rem auto 0;
      max-width: 42rem;
      min-width: 35rem;
      .title {
        font-size: large;
        margin-bottom: 1rem;
      }
      input {
        width: 30rem;
        height: 3rem;
        background-color: #191A2E;
      }
      .button {
        font-size: large;
        margin-left: 1rem;
      }
    }
  }
  .game {
    position: absolute;
    width: 100%;
    height: 100%;

    .top-info {
      width: 100%;
      position: absolute;
      margin: 0 auto;
      padding-top: 1.5rem;
      font-size: 1.2rem;
      font-weight: bold;
      color: #7654DB;
    }

    .top-info-phone {
      width: 100%;
      position: absolute;
      margin: 0 auto;
      padding-top: 1.5rem;
      font-size: 1.2rem;
      font-weight: bold;
      color: #7654DB;
    }
    .round_result {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #3D465B;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
      .round_result_center {
        div {
          color: white;
          font-size: x-large;
        }
        margin: auto;
        text-align: center;
        .round_result_block {
          padding: 1rem;
          background: #171829;

          margin-bottom: 1rem;
        }
      }
    }
    .game_result {
      position: absolute;
      height: 100%;
      width: 100%;
      background: #090723;
      display: flex;
      justify-content: center;
    }
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

    .game_hud {
      display: flex;
      position: absolute;
      justify-content: space-between;
      top: 1rem ;
      //height: 2.5rem;
      width: 100%;
      //background-color: blue;
      z-index: 1000;
      touch-action: pan-x pan-y;
      align-items: center;

      padding-left: 20px;
      padding-right: 20px;
      .user_title {
        text-align: left;
        font-size: x-large;
        font-weight: bolder;
        color: white;
        -webkit-text-stroke: 1px black;
      }
      .user_blod_left {
        text-align: left;
        font-size: x-large;
        font-weight: bolder;
        color: white;
        -webkit-text-stroke: 1px black;
      }
      .user_blod_right {
        text-align: left;
        font-size: x-large;
        font-weight: bolder;
        color: white;
        -webkit-text-stroke: 1px black;
      }
      .hub_left {

      }
      .hub_right {

      }
    }
  }

  .not_support_phone {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #090723;;
    font-size: xxx-large;
    color: white;
  }
}
</style>