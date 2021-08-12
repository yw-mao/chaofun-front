<template>
  <div class="chat_box">
    <div class="title">
      <div class="forum_name">
        <img :src="imgOrigin + forumInfo.imageName" alt="" />
        <span>{{ forumInfo.name }}</span>
      </div>
      <div class="close">
        <!-- <i class="el-icon-minus"></i> -->
        <i @click="closeWS" class="el-icon-close"></i>
      </div>
    </div>

    <div id="chat_con" class="chat_con">
      <div v-for="(item, index) in msgList" :key="index">
        <div
          v-if="
            item.sender &&
            item.sender.userId != $store.state.user.userInfo.userId
          "
          class="others"
        >
          <div class="ava">
            <img :src="imgOrigin + item.sender.icon" alt="" />
          </div>
          <div class="ads">
            <div class="contents">
              <div class="nickname">
                {{ item.sender ? item.sender.userName : "炒饭用户—_1" }}
              </div>
              <div class="msg" v-html="item.content">
                <!-- {{ item.content }} -->
              </div>
            </div>
          </div>
        </div>
        <div v-else class="userSelf">
          <div class="ads">
            <div class="contents">
              <div class="nickname">
                {{ item.sender ? item.sender.userName : "炒饭用户—_1" }}
              </div>
              <div class="msg" v-html="item.content">
                <!-- {{ item.content }} -->
              </div>
            </div>
          </div>
          <div v-if="item.sender" class="ava">
            <img :src="imgOrigin + item.sender.icon" alt="" />
          </div>
        </div>
      </div>
      <div
        id="msg_end"
        style="height: 0px; margin-bottom: 80px; overflow: hidden"
      ></div>
    </div>
    <div @click="scrollToBottom" v-if="showTips" class="tips">你有新消息 <span v-if="unread">({{unread}})</span> </div>
    <div class="bottom_send">
      <input
        autofocus
        @keydown="clientClickButton"
        v-model="content"
        type="text"
        placeholder="发言~"
      />
      <div @click="send" class="send">发送</div>
    </div>
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";

export default {
  components: { ThemePicker },
  data() {
    return {
      showTips: false,
      unread: 0,
      content: "",
      msgList: [],
      forumInfo: {},
      websock: null, //建立的连接
      lockReconnect: false, //是否真正建立连接
      timeout: 30 * 1000, //30秒一次心跳
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: null, //断开 重连倒计时
    };
  },
  computed: {},
  created() {
    if (localStorage.getItem("wsForum")) {
      this.forumInfo = JSON.parse(localStorage.getItem("wsForum"));
    }
  },
  destroyed(){
    if (this.websock) {
      console.log('关闭原连接')
      clearTimeout(this.timeoutObj);
      clearTimeout(this.serverTimeoutObj);
      this.websock.close();
      this.websock = null;
    }
  },
  // watch:{
  //   '$store.state.user.showChatBox'(){
  //     if (this.websock) {
  //       console.log('关闭原连接')
  //       clearTimeout(this.timeoutObj);
  //       clearTimeout(this.serverTimeoutObj);
  //       this.websock.close();
  //     }
  //   }
  // },
  mounted() {
    //   if(!this.$store.state.user.wss){
    //   this.$store.dispatch('user/SET_wss',this.getWss);
    //   }
    if (localStorage.getItem("wsForum")) {
      this.initWebSocket();
    }
  },
  methods: {
    clientClickButton(event) {
      console.log(event.code);
      if (event.keyCode == 13) {
        this.send();
      }
    },
    scrollToBottom(){
      this.showTips = false;
      document.getElementById("msg_end").scrollIntoView();
    },
    // WebSocket
    //建立连接
    initWebSocket() {
      //初始化weosocket
      //const wsuri = "ws://sms.填写您的地址.com/websocket/" + this.charId; //ws地址
      
      const wsuri = "wss://chao.fun/ws/v0/forumChat/" + this.forumInfo.id;
      //建立连接
      this.websock = new WebSocket(wsuri);
      //连接成功
      this.websock.onopen = this.websocketonopen;
      //连接错误
      this.websock.onerror = this.websocketonerror;
      //接收信息
      this.websock.onmessage = this.websocketonmessage;
      //连接关闭
      this.websock.onclose = this.websocketclose;
    },
    //重新连接
    reconnect() {
      var that = this;
      if (that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(function () {
        //新连接
        that.initWebSocket();
        that.lockReconnect = false;
      }, 5000);
    },
    //重置心跳
    reset() {
      var that = this;
      //清除时间
      clearTimeout(that.timeoutObj);
      clearTimeout(that.serverTimeoutObj);
      //重启心跳
      that.start();
    },
    //开启心跳
    start() {
      var self = this;
      self.timeoutObj && clearTimeout(self.timeoutObj);
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
      self.timeoutObj = setTimeout(function () {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.websock.readyState == 1) {
          //如果连接正常
          let params = {
            type: 'heartbeat',
            content: '',
          }
          self.websock.send(JSON.stringify(params));
          console.log("发送消息");
        } else {
          //否则重连
          self.reconnect();
        }
        self.serverTimeoutObj = setTimeout(function () {
          //超时关闭
          self.websock.close();
        }, self.timeout);
      }, self.timeout);
    },
    //连接成功事件
    websocketonopen() {
      //提示成功
      console.log("连接成功", 3);
      //开启心跳
      this.start();
    },
    //连接失败事件
    websocketonerror(e) {
      //错误
      console.log("WebSocket连接发生错误");
      //错误提示
      console.log("Websocket error, Check you internet!");
      //重连
      this.reconnect();
    },
    //连接关闭事件
    websocketclose(e) {
      //关闭
      console.log(e)
      console.log('closeType',e.type);
      console.log('wasClean',e.wasClean);
      console.log('code',e.code);
      
      //提示关闭
      console.log("连接已关闭", 3);

      //重连
      if(e.code!=1000&&e.type!='close'){
        this.reconnect();
      }else{
        console.log('链接真正关闭')
      }
      
    },
    //接收服务器推送的信息
    websocketonmessage(event) {
      //打印收到服务器的内容
      //数据接收
      let that = this;
      const redata = JSON.parse(event.data);
      console.log(redata, "数据接收");

      let data = JSON.parse(event.data);
      if (data.data.type!='heartbeat'&&data.data.content) {
        that.msgList.push(data.data);
        
        let chat_con = document.getElementById('chat_con');
        console.log(chat_con.scrollHeight,chat_con.scrollTop);
        if(chat_con.scrollHeight-chat_con.scrollTop>200&&chat_con.scrollHeight-chat_con.scrollTop<1500){//===this.clientHeight
            console.log("到达底部");
            document.getElementById("msg_end").scrollIntoView();
        }else{
          that.unread += 1;
          that.showTips = true;
          // setTimeout(()=>{

          // },2000)
          // that.TipintoView();
        }
        
      }
      
      //收到服务器信息，心跳重置
      this.reset();
    },
    //向服务器发送信息
    websocketsend(msg) {
      //数据发送
      this.content = "";
      this.websock.send(msg);
      document.getElementById("msg_end").scrollIntoView();
    },
    send() {
      console.log(1)
      if (this.content) {
        let params = {
          type: 'text',
          content: this.content,
        };
        this.websocketsend(JSON.stringify(params));
      }

      // try{
      //     this.$store.state.user.wss.send(JSON.stringify(params));
      //     this.content = ''
      // }catch(e){
      //     this.content = ''
      //     this.getWss(params);
      // }
    },
    closeWS() {
      this.$store.dispatch("user/SET_showChatBox", false);
    },
    ccc(){},
    getWss(ps) {
      let self = this;
      var ws = new WebSocket("wss://chao.fun/ws/v0/forumChat/1");
      var heartCheck = {
        timeout: 1000, //60ms
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function () {
          clearTimeout(this.timeoutObj);
          clearTimeout(this.serverTimeoutObj);
          this.start();
        },
        start: function () {
          var self = this;
          this.timeoutObj = setTimeout(function () {
            // ws.send("HeartBeat");
            ws.send(ps ? JSON.stringify(ps) : '{"type":"text","content":"你好"}');
            self.serverTimeoutObj = setTimeout(function () {
              ws.close(); //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout);
          }, this.timeout);
        },
      };

      ws.onopen = function () {
        heartCheck.start();
      };
      ws.onmessage = function (event) {
        // heartCheck.reset();
        let data = JSON.parse(event.data);
        self.msgList.push(data.data);
      };
      ws.onclose = function () {
        // reconnect();
        heartCheck.reset();
      };
      ws.onerror = function () {
        // reconnect();
        heartCheck.reset();
      };
      ws.onopen = function () {
        ws.send(ps ? JSON.stringify(ps) : '{"type":"text","content":"你好"}');
      };
      ws.onmessage = function (event) {
        let data = JSON.parse(event.data);
        self.msgList.push(data.data);
      };
      ws.onreconnect = function () {
        console.log("reconnecting...");
      };
      // ws.onerror = function(event) {
      //     // let data = JSON.parse(event.data);
      //     // self.msgList.push(data.data);
      //     console.log(event);
      //     self.$store.dispatch('user/SET_wss',this.getWss);
      // };
      return ws;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./chat.scss";
</style>
