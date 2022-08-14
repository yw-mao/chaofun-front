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
        <div  v-if="gameData && gameData.playerIds.length >= 1" class="player">
          <el-avatar :src="this.imgOrigin + gameData.players[0].icon" class="avatar"></el-avatar>
          <div class="userName">{{gameData.players[0].userName}}</div>
        </div>
        <img class="vs_img" v-if="gameData && gameData.playerIds.length === 2" :src="this.imgOrigin + 'biz/1658807128256_91c9df63c2d144359005b6f504a96a81.png'">
        </img>
        <div v-if="gameData && gameData.playerIds.length === 2" class="player">
          <el-avatar :src="this.imgOrigin + gameData.players[1].icon" class="avatar"></el-avatar>
          <div class="userName">{{gameData.players[1].userName}}</div>
        </div>
      </div>


      <div class="start_game" v-if="status === 'ready' && this.gameData.type !== 'solo_match' && this.$store.state.user.userInfo.userId === gameData.host.userId">
        <el-button class="button" type="primary" round @click="start">开始图寻对决</el-button>
      </div>

      <div v-if="!gameData.playerIds || gameData.playerIds.length !== 2" class="wait_game_start">
        等待其他玩家加入....
      </div>

      <div v-if="gameData.host && this.$store.state.user.userInfo.userId !== gameData.host.userId && gameData.type !== 'solo_match'" class="wait_game_start">
        等待房主开始游戏...
      </div>

      <div v-if="gameData.type === 'solo_match' && gameData.status == 'ready'" class="wait_game_start">
        开始倒计时 {{this.gameTimeLeft}} 秒
      </div>

      <div class="invite" v-if="status !== 'ready' && gameData.type !== 'solo_match'">
        <div class="title">
          邀请链接
        </div>
        <div class="body">
          <input class="invite_input" placeholder readonly :value="'https://chao.fan' + this.$route.fullPath" >
          </input>
          <el-button class="button" type="warning" @click="copyInviterLink">复制</el-button>
        </div>
      </div>
    </div>

    <div class="game" v-if="status === 'ongoing' || status === 'finish'">
      <div :class="[{'im-view': !ISPHONE}, {'im-view-phone': ISPHONE}]">
        <div id="viewer"  style="width: 100%; height: 100%"></div>
        <div v-if="showRoundResult" class="round_result">
          <div class="round_result_center" v-if="!gameData.player">
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

          <div class="round_result_center" v-if="gameData.player">
            <div class="round_result_block">
              <div>
                局数:  {{gameData.currentRound}} / {{gameData.roundNumber}}
              </div>
              本局得分: {{gameData.player.lastRoundResult.score}}
              <div>
                总得分:  {{gameData.player.totalScore}}
              </div>

            </div>
          </div>
        </div>
      </div>
      <div v-if="lastRound && lastRound.timerStartTime && !lastRound.endTime " :class="[{'top-info': !ISPHONE}, {'top-info-phone': ISPHONE}]">
        选择倒计时: {{timeLeft}}
      </div>

      <div id="map" :class="[{'bm-view': !ISPHONE}, {'bm-view-phone': ISPHONE && showMap}, {'bm-view-phone-hidden': ISPHONE && !showMap}]"></div>

      <div v-if="showMap && ISPHONE" style="position: absolute; left: 20px; bottom: 20px">
        <el-button @click="showMap = false">隐藏地图</el-button>
      </div>

      <div class="home">
        <el-button size="mini"  @click="toReport"> 坏题反馈 </el-button>
      </div>

      <div :class="[{'confirm': !ISPHONE}, {'confirm-phone': ISPHONE}]">
        <el-button v-if="(showMap || !ISPHONE) && !confirmed && !this.targetLat"  @click="confirm">确定选择</el-button>
        <el-button v-else-if="!showMap && ISPHONE && confirmed" @click="showMap = true">打开地图</el-button>
        <el-button v-else-if="!showMap && ISPHONE" @click="showMap = true">选择地点</el-button>
        <el-button v-if="gameData.status === 'ongoing' && gameData.player && this.targetLat" @click="next">下一题</el-button>
      </div>
      <div v-if="this.showChallengeGameEnd" class="game_result">
        <div class="player">
          <el-avatar :src="this.imgOrigin + gameData.player.user.icon" class="avatar"></el-avatar>
          <div class="userName">{{gameData.player.user.userName}}</div>
          <div class="info">
            <div>
              总分数：{{gameData.player.totalScore}}
            </div>
          </div>
          <div>
            <el-button class="home_button" type="warning" @click="goDailyChallenge">查看总排名</el-button>
          </div>
          <div>
            <el-button class="home_button"  type="primary" @click="goHome">回到首页</el-button>
          </div>
        </div>
      </div>
      <div v-if="showGameEnd && winner" class="game_result">
        <div class="player">
          <div v-if="isWin" class="winner_title">
            胜利!
          </div>
          <div v-else class="loser_title">
            失败!
          </div>

          <el-avatar :src="this.imgOrigin + yourTeam.users[0].icon" class="avatar"></el-avatar>
          <div class="userName">{{yourTeam.users[0].userName}}</div>

          <div v-if="gameData && gameData.type === 'solo_match'">
            <div class="info">
              <p v-if="yourTeam.ratingChange  && yourTeam.ratingChange > 0" class="desc">积分变化：+{{yourTeam.ratingChange}}</p>
              <p v-if="!yourTeam.ratingChange && yourTeam.finalRating" class="desc">积分无变化, 积分：{{ yourTeam.finalRating }}</p>
              <p v-if="!yourTeam.ratingChange && !yourTeam.finalRating" class="desc">积分无变化</p>
              <p v-if="yourTeam.ratingChange  && yourTeam.ratingChange < 0" class="desc">积分变化：{{yourTeam.ratingChange}}</p>
              <div>
                最新积分：{{ yourTeam.finalRating }}
              </div>
            </div>
            <el-button class="home_button"  type="primary" @click="goTuxun">继续匹配</el-button>
          </div>
          <div>
            <el-button class="home_button" type="warning" @click="goHome">回到图寻首页</el-button>
          </div>
        </div>
      </div>
      <div v-if="gameData && !gameData.player" class="game_hud">
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

    <matching v-if="this.showMatch"/>
  </div>
</template>

<script>
import * as THREE from 'three';
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
import {getByPathLongTimeout} from "../../api/api";
import Matching from "./Matching";

export default {
  name: "TXInvitor",
  components: {Matching},
  data () {
    return {
      url: `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/v0/tuxun`,
      // url: `ws://127.0.0.1:8080/ws/v0/tuxun`,
      ws: null,
      status: 'wait',
      gameId: this.gameId,
      gameData: undefined,
      lastRound: undefined,
      map: undefined,
      BMap: undefined,
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
      gameTimeLeft: 5,
      team1User: undefined,
      team2User: undefined,
      winner: undefined,
      winTeam: undefined,
      yourTeam: undefined,
      isWin: undefined,
      showMatch: false,
      challengeId: undefined,
      showChallengeGameEnd: undefined,
      notifyStatus: '',

      // gameData: {playerIds: [1, 2]}
    }
  },

  mounted() {
    this.gameId = this.$route.query.gameId;
    this.challengeId = this.$route.query.challengeId;
    this.init();
  },

  methods: {
    init() {
      if (this.gameId && this.gameId !== null && this.gameId !== '') {
        this.showMatch = false;
        this.initWS();
        this.join();
        this.countDown();
      } else if (!this.challengeId) {
        this.showMatch = true;
        this.match();
        var Notification = window.Notification || window.mozNotification || window.webkitNotification;
        if (Notification) {
          Notification.requestPermission(function (status) {
            this.notifyStatus = status;
          }.bind(this))
        }
      } else {
        this.showMatch = false;
        this.challengeInit();
      }
    },
    challengeInit() {
      api.getByPath('/api/v0/tuxun/challenge/getGameInfo', {'challengeId': this.challengeId}).then(res=>{
        if (res.data) {
          this.gameId = res.data.id;
          this.solveGameData(res.data, undefined)
          this.initWS();
          this.countDown();
        }
      })
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

      if (!this.gameData.player && (code === 'game_end' || data.status === 'finish')) {
        this.showGameEnd = true;
        if (this.gameData.teams[0].health === 0) {
          this.winner = this.gameData.teams[1].users[0];
          this.winTeam = this.gameData.teams[1];
        } else {
          this.winner = this.gameData.teams[0].users[0];
          this.winTeam = this.gameData.teams[0];
        }

        if (this.winner.userId === this.$store.state.user.userInfo.userId) {
          this.isWin = true;
        } else {
          this.isWin = false;
        }

        if (this.gameData.teams[0].users[0].userId === this.$store.state.user.userInfo.userId) {
          this.yourTeam = this.gameData.teams[0];
        } else {
          this.yourTeam = this.gameData.teams[1];
        }
      }

      if (this.gameData.player && (code === 'game_end' || data.status === 'finish')) {
        this.showChallengeGameEnd = true;
      }


      if (data.status === 'wait_join' || data.status === 'ready' || data.status === 'ongoing' || data.status === 'finish') {
        this.status = data.status;

        if (data.status === 'ongoing') {
          if (this.lastRound.contentSpeedUp) {
            this.lastRound.content = this.lastRound.contentSpeedUp;
          }
          if (this.image !== this.lastRound.content) {
            this.showMap = false;
            this.image = this.lastRound.content;
            this.contents = this.lastRound.contents;
            this.lat = null;
            this.lng = null;
            this.targetLat = undefined;
            this.targetLng = undefined;
            this.confirmed = null;
            this.polylinePath = undefined;
            this.removeChooseMarker()
            this.removeTargetMarker();
            this.removeLine();
            this.clearRanksMarker();

            this.heading = this.lastRound.heading;

            setTimeout(function () {
              if (!this.viewer) {
                var plugins = [];
                plugins.push([CompassPlugin, {
                  size: '5vh',
                  position: 'left bottom'
                }]);
                plugins.push([VirtualTourPlugin, {
                  positionMode: VirtualTourPlugin.MODE_GPS,
                  renderMode: VirtualTourPlugin.MODE_3D,
                  // preload: true,
                }]);

                this.viewer = new Viewer({
                  loadingImg: this.imgOrigin + 'biz/1659528755270_550cd22e10c84073a12e6f83840320bc.gif',
                  navbar: null,
                  container: document.querySelector('#viewer'),
                  panoData: {
                    poseHeading: this.heading, // 0 to 360
                  },
                  defaultZoomLvl: 0,
                  plugins: plugins
                });
              }
              if (this.contents  && this.contents.length > 1) {
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
              } else {
                var virtualTour = this.viewer.getPlugin(VirtualTourPlugin);
                virtualTour.setNodes([{panorama: 'https://i.chao-fan.com/' + this.image, id: this.image, position: [0,0], links: [], panoData : {poseHeading: this.heading}}])
              }

              setTimeout(function () {
                THREE.Cache.clear();
              }, 1000);
            }.bind(this), 100);

          }

          if ((code === 'round_end' ||
                  (this.lastRound && this.lastRound.endTime))
              && !this.showGameEnd ) {
            this.showRoundResult = true;
            if (!this.targetLng) {
              this.showMap = true;
              this.targetLat = this.lastRound.lat;
              this.targetLng = this.lastRound.lng;
              this.addTargetMarker();
              this.addRanksMarker();

              if (this.lng && this.BMap) {
                this.polylinePath = [
                  new BMap.Point(this.lng, this.lat),
                  new BMap.Point(this.targetLng, this.targetLat),
                ]
                this.addLine();
              }

              if (this.map && this.BMap) {
                this.map.centerAndZoom(new BMap.Point(this.targetLng, this.targetLat), 1);
              }
            }
          } else {
            this.showRoundResult = false;
          }

          if (!this.map) {
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
      input.setAttribute('value', 'https://chao.fan' + this.$route.fullPath);
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
          if (res.success) {
            this.solveGameData(res.data, undefined);
          } else {
            this.getGameInfo()
          }
        });
      });
    },

    getGameInfo() {
      this.doLoginStatus().then((res) => {
        api.getByPath("/api/v0/tuxun/solo/join", {gameId: this.gameId}).then(res => {
          console.log(res.data);
          if (res.success) {
            this.solveGameData(res.data, undefined);
          }
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
          this.timeLeft =  Math.round((this.gameData.roundTimePeriod - ((new Date().getTime()) - this.lastRound.timerStartTime)) / 1000);
          if (this.timeLeft < 0) {
            this.timeLeft = 0;
          }
        } else {
          this.timeLeft = 15;
        }

        if (this.gameData && this.gameData.timerStartTime && this.gameData.status === "ready") {
          this.gameTimeLeft = Math.round(5 - ((new Date().getTime()) - this.gameData.timerStartTime) / 1000);
          if (this.gameTimeLeft < 0) {
            this.gameTimeLeft = 0;
          }
        } else {
          this.gameTimeLeft = 5;
        }
        console.log(this.gameTimeLeft);
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

    addRanksMarker() {
      if (!this.BMap) {
        return;
      }
      this.ranksMarker = [];
      if (this.gameData) {
        this.gameData.teams.forEach( item => {
          if (item.teamUsers && item.teamUsers[0].user.userId !== this.$store.state.user.userInfo.userId) {
            if (item.teamUsers[0].guesses && item.teamUsers[0].guesses.length > 0) {
              var lastGuess = item.teamUsers[0].guesses[item.teamUsers[0].guesses.length -1];
              if (lastGuess.round === this.gameData.currentRound) {
                var point = new BMap.Point(lastGuess.lng, lastGuess.lat);
                var marker = new BMap.Marker(point);        // 创建标注
                marker.disableDragging();
                var label = new BMap.Label(item.teamUsers[0].user.userName);        // 创建标注
                label.setOffset(new BMap.Size(-15, 30));
                console.log(label.getOffset())
                marker.setLabel(label);
                this.ranksMarker.push(marker);
                this.map.addOverlay(marker);
              }
            }
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

    addTargetMarker() {
      if (!this.BMap) {
        return;
      }
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

    confirm() {
      this.confirmed = true;
      var path = "/api/v0/tuxun/solo/guess";
      if (this.gameData.type === 'daily_challenge') {
        path = "/api/v0/tuxun/challenge/guess";
      }
      api.getByPath(path, {gameId: this.gameId, lng: this.lng, lat: this.lat}).then(res => {
        // this.solveGameData(res.data, undefined);
      });
    },

    next() {
      api.getByPath("/api/v0/tuxun/challenge/next", {gameId: this.gameId}).then(res => {
        this.solveGameData(res.data, undefined);
      });
    },

    goTuxun() {
      window.location.href = '/tuxun/solo_game';
    },

    goDailyChallenge() {
      window.location.href = '/tuxun/daily_challenge';
    },

    goHome() {
      window.location.href = '/tuxun';
    },

    toReport() {
      api.getByPath('/api/v0/tuxun/game/report', {content: this.image}).then(res=>{
        this.$toast("反馈成功");
      })
    },

    match() {
      // 每3秒发送一次心跳
      this.doLoginStatus().then((res) => {
        this.continueSend = true;
        this.t = setInterval(() => {
          try {
            if (this.continueSend) {
              this.continueSend = false;
              api.getByPathLongTimeout('/api/v0/tuxun/solo/joinRandom').then(res => {
                if (res.data) {
                  var Notification = window.Notification || window.mozNotification || window.webkitNotification;
                  if (Notification) {
                    if ("granted" !== this.notifyStatus) {
                    } else {
                      var notify = new Notification("图寻通知", {
                        dir: 'auto',
                        data: '',
                        lang: 'zh-CN',
                        requireInteraction: false,
                        // tag: ,//实例化的notification的id
                        icon: 'https://i.chao-fan.com/biz/08a2d3a676f4f520cb99910496e48b4e.png?x-oss-process=image/resize,h_80/format,webp/quality,q_75',//通知的缩略图,//icon 支持ico、png、jpg、jpeg格式
                        body: "您的图寻已匹配到对手，点击开始游戏"
                      });
                      notify.onclick = function (val) {
                        //如果通知消息被点击,通知窗口将被激活
                        window.focus();
                        notify.close();
                      },
                          notify.onshow = function () {
                            setTimeout(notify.close.bind(notify), 5000);
                          }
                      notify.onerror = function () {
                        console.log("HTML5桌面消息出错！！！");
                      };
                      notify.onclose = function () {
                        console.log("HTML5桌面消息关闭！！！");
                      };
                    }
                  } else {
                    console.log("您的浏览器不支持桌面消息");
                  }
                  this.$router.push({path: '/tuxun/solo_game?gameId=' + res.data })
                  this.gameId=res.data;
                  this.init();
                  this.continueSend=false;
                  clearInterval(this.t);
                } else {
                  this.continueSend = true;
                }
              })
            }
          } catch (e) {
            this.continueSend = true;
          }
        }, 1500);
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
  .home_button {
    margin-top: 2rem;
    font-size: large;
  }
  .player {
    width: 40%;
    margin: auto;
    div{
      color: white;
    }
    .winner_title {
      color: gold;
      font-size: xxx-large;
      margin-bottom: 1rem;;
    }
    .loser_title {
      color: silver;
      font-size: xxx-large;
      margin-bottom: 1rem;;
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
      max-width: 80%;
      min-width: 35rem;
      .title {
        font-size: large;
        margin-bottom: 1rem;
      }
      input {
        width: 30rem;
        height: 3rem;
        background-color: #191A2E;
        max-width: 100%;
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
      pointer-events: none;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
    }

    .top-info-phone {
      width: 100%;
      position: absolute;
      margin: 0 auto;
      padding-top: 5rem;
      font-size: 1.2rem;
      font-weight: bold;
      color: #7654DB;
      pointer-events: none;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
    }

    .round_result {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #3D465B;
      display: block;
      align-items: center;
      text-align: center;
      justify-content: center;
      padding-top: 8rem;
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
      .info {
        padding-top: 20px;
        font-size: large;
      }
    }
    .im-view {
      position: absolute;
      width: 100%;
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
      width: 30%;
      height: 40%;
      bottom: 1.5rem;
      right: 2rem;
    }
    .bm-view-phone {
      position: absolute;
      width: 100%;
      height: 40%;
      bottom: 0;
      right: 0;
    }
    .bm-view-phone-hidden {
      position: absolute;
      width: 100%;
      height: 40%;
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

    .game_hud {
      pointer-events: none;
      display: flex;
      position: absolute;
      justify-content: space-between;
      top: 2rem ;
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
    z-index: 10000;
  }

}

@media only screen and (max-width: 679px) {
  .container {
    .prepare {
      .vs {
        width: 80%;

        .vs_img {
          width: 30px;
          height: 30px;
        }
      }

      .invite {
        width: 100%;
        min-width: 50%;
        max-width: 100%;

        .body {
          padding-left: 10px;
          padding-right: 10px;
          max-width: 100%;
        }
      }
    }

    .player {
      width: 80%;
      .avatar {
        width: 50px;
        height: 50px;
        margin: 0 auto;
      }

      .userName {
        margin-top: 1rem;
        font-size: small;
      }
    }

    .game {
      .round_result {
        display: block;
        padding-top: 5rem;
        .round_result_block {
          padding: 0.2rem;
        }
      }
      .game_hud {
        .user_title {
          font-size: medium;
        }
        .user_blod_left {
          font-size: medium;
        }
        .user_blod_right {
          font-size: medium;
        }
      }
    }
  }
}
</style>
