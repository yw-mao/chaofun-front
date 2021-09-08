<template>
  <div id="chatBox" class="container">
      <div :class="['chat_box',{'chat_box_phone': ISPHONE}]">
        <div class="title">
        <div class="forum_name">
            <img :src="imgOrigin + forumInfo.imageName" alt="" />
            <span>{{ forumInfo.name }}</span>
            <span style="font-size: 12px; color: #999"
            >（在线：{{ onlineCount }}人）</span
            >
        </div>
        <!-- <div class="close">
            <img title="打开新窗口" :src="imgOrigin+'biz/b956a8bb34c931b0ba43386588e48c37.png'" alt="">
            <i @click="closeWS" class="el-icon-close"></i>
        </div> -->
        </div>

        <div id="chat_con" class="chat_con">
        <div v-for="(item, index) in msgList" :key="index">
            <div v-if="index==0" class="time">
              <span>{{moment(item.time).format('MM-DD HH:mm:ss')}}</span>
            </div>
            <div v-if="index>0" class="time">
              <span v-if="(item.time-msgList[index-1].time)>300000">{{moment(item.time).format('MM-DD HH:mm:ss')}}</span>
            </div>
            <div
            v-if="
                item.sender &&
                item.sender.userId != $store.state.user.userInfo.userId
            "
            class="others"
            >
            <div class="ava">
                <img :src="imgOrigin + (item.sender.icon?item.sender.icon+'?x-oss-process=image/resize,h_80':'biz/f7cce56159ee5705a66f1cf8c03c4bea.png?x-oss-process=image/resize,h_80')" alt="" />
            </div>
            <div class="ads">
                <div class="contents">
                <div class="nickname">
                    {{ item.sender ? item.sender.userName : "炒饭用户—_1" }}
                </div>
                <div
                    v-if="item.type == 'text'"
                    class="msg"
                    v-html="item.content"
                ></div>
                <div v-if="item.type == 'image'" class="msg_img">
                    <!-- <img class="item_image" :src="imgOrigin+item.content+'?x-oss-process=image/resize,h_300'" alt=""> -->
                    <viewer :images="[imgOrigin + item.content]">
                    <img
                        class="item_image"
                        :data-source="imgOrigin + item.content"
                        :src="
                        imgOrigin +
                        item.content +
                        '?x-oss-process=image/resize,h_300'
                        "
                        alt=""
                    />
                    <!-- <div v-for="(item2,index2) in item.images" :key="index2" :class="doImgClass(item.images)" :style="doMoreImgStyle(item,item2)" :alt="item.title" :title="item.title">
                        <img  style="opacity:0;width:100%;height:100%;" :data-source="imgOrigin+item2"   :key="item2" :alt="item.title" :title="item.title">
                    </div> -->
                    </viewer>
                </div>
                </div>
            </div>
            </div>
            <div v-if="item.sender &&
                item.sender.userId == $store.state.user.userInfo.userId" class="userSelf">
            <div class="ads">
                <div class="contents">
                <div class="nickname">
                
                    {{ item.sender ? item.sender.userName : "炒饭用户—_1" }} 
                </div>
                <div
                    v-if="item.type == 'text'"
                    class="msg"
                    v-html="item.content"
                ></div>
                <div v-if="item.type == 'image'" class="msg_img">
                    <viewer :images="[imgOrigin + item.content]">
                    <img
                        class="item_image"
                        :data-source="imgOrigin + item.content"
                        :src="
                        imgOrigin +
                        item.content +
                        '?x-oss-process=image/resize,h_300'
                        "
                        alt=""
                    />
                    <!-- <div v-for="(item2,index2) in item.images" :key="index2" :class="doImgClass(item.images)" :style="doMoreImgStyle(item,item2)" :alt="item.title" :title="item.title">
                        <img  style="opacity:0;width:100%;height:100%;" :data-source="imgOrigin+item2"   :key="item2" :alt="item.title" :title="item.title">
                    </div> -->
                    </viewer>
                </div>
                </div>
            </div>
            <div v-if="item.sender" class="ava">
                <img :src="imgOrigin + (item.sender.icon?item.sender.icon+'?x-oss-process=image/resize,h_80':'biz/f7cce56159ee5705a66f1cf8c03c4bea.png?x-oss-process=image/resize,h_80')" alt="" />
            </div>
            </div>
        </div>
        <div
            id="msg_end"
            style="height: 0px; margin-bottom: 50px; overflow: hidden"
        ></div>
        </div>
        <div v-if="prevImg" class="tietu">
        <div class="tietu_con">
            <div class="cls">
            <i @click="closeImage" class="el-icon-close"></i>
            </div>
            <div class="tie_tu_img">
            <img :src="prevImg" alt="" />
            </div>
            <div class="flex">
            <span>发送图片至版聊</span>
            <div @click="sendImage" class="send">发送</div>
            </div>
        </div>
        </div>
        <div @click="scrollToBottom" v-if="showTips" class="tips">
        你有新消息 <span v-if="unread">({{ unread }})</span>
        </div>
        <div class="bottom_send">
        <!-- <form action="" onsubmit="return false;"> -->
          <input
              ref="inputs"
              autofocus
              @keydown="clientClickButton"
              @focus="inputFocus"
              v-model="content"
              type="send"
              placeholder="发言~"
          />
        <!-- </form> -->
        <el-upload
            v-if="!isApp"
            class="avatar-uploader"
            action="/api/upload_image"
            name="file"
            :data="filedata"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :limit="1"
            multiple
            accept="image/*"
            style="display: inline-block"
            ref="replyImageUpload"
        >
            <img
            style="vertical-align: middle; margin-right: 0px; cursor: pointer"
            src="../../assets/images/icon/choose.png"
            alt=""
            />
        </el-upload>
        <img
          v-if="isApp"
            @click="chooseImage"
          style="vertical-align: middle; margin-right: 0px; cursor: pointer"
          src="../../assets/images/icon/choose.png"
          alt=""
          />
        <div @click="send" class="send">发送</div>
        </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/api/api";
import ThemePicker from "@/components/ThemePicker";
import 'moment/locale/zh-cn'
import moment from "moment";
export default {
  components: { ThemePicker },
  data() {
    return {
      isApp: false,
      moment: moment,
      connectCount: 0,
      onlineCount: 0,
      filedata: {},
      realImageUrl: "",
      imgSendType: "upload",
      prevblob: "",
      prevImg: "",
      showTips: false,
      unread: 0,
      content: "",
      msgList: [
        // {
        //   type: 'text',
        //   content: ''
        // }
      ],
      forumInfo: {},
      websock: null, //建立的连接
      lockReconnect: false, //是否真正建立连接
      timeout: 20 * 1000, //30秒一次心跳
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: null, //断开 重连倒计时
    };
  },
  computed: {},
  created() {
    this.getForumInfo();
    if(this.$route.query.source=='app'){
      this.isApp = true;
    }
  },
  destroyed() {
    if (this.websock) {
      console.log("关闭原连接");
      clearTimeout(this.timeoutObj);
      clearTimeout(this.serverTimeoutObj);
      this.websock.close();
      this.websock = null;
    }
  },
  mounted() {
    console.log(navigator.userAgent);
    console.log(this.$route.path);
    if (this.$route.params.id) {
      this.initWebSocket();
    }
    let self = this;
    if(document.getElementById('chatBox')){
      document.getElementById('chatBox').addEventListener('keyup',(e)=>{
        console.log(111222,e);
        if(e.code.toLowerCase()=='enter'&&self.prevImg){
          self.sendImage();
        }
      })
    }
    try{
      let self = this;
      window.setUploadImage = function (message) {
        self.imgSendType = "upload";
        self.realImageUrl = message;
        self.prevImg = self.imgOrigin + message;
        // self.sendImage();
      }
    }catch{

    }
  },
  methods: {
    chooseImage(){
      if(this.ISPHONE){
        this.uploadImage();
      }
      // uploadImage
    },
    getForumInfo() {
        if(this.$route.params.id){
            api.getForumInfo({ forumId: this.$route.params.id }).then((res) => {
                if (res.success) {
                    this.forumInfo = res.data;
                
                } else {
                    this.$router.push("/404");
                }
            });
        }
      
    },
    clientClickButton(event) {
      console.log(event.code);
      if (event.keyCode == 13) {
        this.send();
      }
    },
    scrollToBottom() {
      this.unread = 0;
      this.showTips = false;
      document.getElementById("msg_end").scrollIntoView();
    },
    // WebSocket
    //建立连接
    initWebSocket() {
      //初始化weosocket
      //const wsuri = "ws://sms.填写您的地址.com/websocket/" + this.charId; //ws地址
      const wsuri = "wss://chao.fun/ws/v0/forumChat/" + this.$route.params.id;
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
      this.connectCount += 1;
      
      that.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(function () {
        //新连接
        console.log('新的连接');
        this.websock.close();
        that.initWebSocket();
        that.lockReconnect = false;
      }, 5000);
      console.log('第'+this.connectCount+'次重连');
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
        console.log("查看readyState", self.websock.readyState, self.websock);
        if (self.websock.readyState == 1) {
           //0        CONNECTING        连接尚未建立
          //1        OPEN            WebSocket的链接已经建立
          //2      CLOSING            连接正在关闭
          //3        CLOSED            连接已经关闭或不可用
          //如果连接正常
          let params = {
            type: "heartbeat",
            content: "",
          };
          self.websock.send(JSON.stringify(params));
          console.log("发送心跳消息");
          self.start();
        } else {
          //否则重连
          self.reconnect();
        }
        self.serverTimeoutObj = setTimeout(function () {
          //超时关闭
          // self.websock.close();
        }, self.timeout);
      }, self.timeout);
    },
    //连接成功事件
    websocketonopen() {
      //提示成功
      console.log("创建连接成功");
      //开启心跳
      this.start();
      let params = {
        type: "load",
        content: "",
      };
      this.websocketsend(JSON.stringify(params));
      
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
      
      //提示关闭
      console.log("连接已关闭", 3);
      // this.reconnect();
      //重连
      let curArr = e.target.url.split('/');
      let id = curArr[curArr.length-1];
      this.reconnect();
      if(e.code!=1000&&e.type!='close'){
        //&&JSON.parse(localStorage.getItem("wsForum")).id==id
        
        // this.reset()
      }else{
        console.log('链接真正关闭')
      }
      // //重连
      // if(e.code!=1000&&e.type!='close'){
      //   this.reconnect();
      // }else{
      //   console.log('链接真正关闭')
      // }
      
    },
    //接收服务器推送的信息
    websocketonmessage(event) {
      //打印收到服务器的内容
      //数据接收
      let that = this;
      const redata = JSON.parse(event.data);
      let data = JSON.parse(event.data);
      if (data.data !== undefined && data.data !== null && data.data.type != "heartbeat" && data.data.content) {
        that.msgList.push(data.data);
        let chat_con = document.getElementById("chat_con");
        if (
          chat_con.scrollHeight - chat_con.scrollTop > 200 &&
          chat_con.scrollHeight - chat_con.scrollTop < 1500
        ) {
          //===this.clientHeight
          console.log("到达底部");
          that.unread = 0;
          that.showTips = false;
          setTimeout(()=>{
            document.getElementById("msg_end").scrollIntoView();
          },10)
        } else {
          that.unread += 1;
          that.showTips = true;
          // setTimeout(()=>{
          // },2000)
          // that.TipintoView();
        }
      }
      if (data.type == "load_result" && data.data && data.data.length) {
        this.msgList = data.data;
        setTimeout(() => {
          document.getElementById("msg_end").scrollIntoView();
        }, 500);
      }
      if (redata.type == "user_count") {
        this.onlineCount = redata.data;
      }

      if (redata.type == "need_login") {
        this.$toast("请先登录");
        this.$login({
          callBack: () => {
            // this.$store.dispatch("user/getInfo");
          },
        });
      }

        //收到服务器信息，心跳重置
      // this.reset();
    },
    //向服务器发送信息
    websocketsend(msg) {
      //数据发送
      console.log(this.websock)
      if(this.websock.readyState==3){
        this.initWebSocket();
        return;
      }
      
      this.websock.send(msg);
      this.content = "";
      this.unread = 0;
      this.showTips = false;
      setTimeout(()=>{
        document.getElementById("msg_end").scrollIntoView();
      },10)
    },
    inputFocus() {
      document.addEventListener("paste", this.toPaste);
    },
    inputBlur() {
      document.removeEventListener("paste", this.toPaste);
    },
    toPaste(e) {
      var cbd = e.clipboardData;
      var ua = window.navigator.userAgent;
      if (!(e.clipboardData && e.clipboardData.items)) {
        return;
      }
      if (
        cbd.items &&
        cbd.items.length === 2 &&
        cbd.items[0].kind === "string" &&
        cbd.items[1].kind === "file" &&
        cbd.types &&
        cbd.types.length === 2 &&
        cbd.types[0] === "text/plain" &&
        cbd.types[1] === "Files" &&
        ua.match(/Macintosh/i) &&
        Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49
      ) {
        return;
      }
      var item = cbd.items[cbd.items.length - 1];
      if (item.kind == "file" && /^image\/[a-z]*$/.test(item.type)) {
        var blob = item.getAsFile();
        if (blob.size === 0) {
          return;
        }
        console.log(blob);
        this.imgSendType = "paste";
        this.prevImg = URL.createObjectURL(blob);
        console.log(URL.createObjectURL(blob));
        this.prevblob = blob;
      }
    },
    uploadImage(){

      window.flutter_inappwebview.callHandler('uploadImage').then(function(result) {

      });

    },
    closeImage() {
      this.prevImg = "";
      this.prevblob = "";
      this.realImageUrl = "";
      this.$refs.replyImageUpload.clearFiles();
    },
    sendImage() {
      if(!this.isApp){
        if (this.imgSendType == "upload") {
          let params = {
            type: "image",
            content: this.realImageUrl,
          };
          this.websocketsend(JSON.stringify(params));
          this.prevImg = "";
          this.prevblob = "";
          this.realImageUrl = "";
          this.$refs.replyImageUpload.clearFiles();
        } else {
          // this.imgSendType = 'upload';
          this.$refs.replyImageUpload.$children[0].uploadFiles([this.prevblob]);
        }
      }else{
        let params = {
            type: "image",
            content: this.realImageUrl,
        };
        this.websocketsend(JSON.stringify(params));
        this.prevImg = "";
        this.prevblob = "";
        this.realImageUrl = "";
      }
      
    },
    handleAvatarSuccess(res, file) {
      if (res.success) {
        // this.imageUrl = URL.createObjectURL(file.raw);
        // this.images.push(res.data);
        console.log(res.data);
        this.realImageUrl = res.data;
        // this.imgSendType = 'upload';
        this.prevImg = URL.createObjectURL(file.raw);
        this.prevblob = file.raw;
        if (this.imgSendType == "paste") {
          this.imgSendType = "upload";
          this.sendImage();
        } else {
          // let params = {
          //   type: 'image',
          //   content: this.realImageUrl
          // }
          // this.websocketsend(JSON.stringify(params));
        }
      } else if (res.errorCode == "invalid_content") {
        // this.imageUrl = ''
        this.$toast(res.errorMessage);
      }
    },
    beforeAvatarUpload(file) {
      console.log(file);
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 20MB!");
        return false;
      }
      this.filedata.fileName = file.name;
      return true;
    },
    send() {
      console.log(1);
      this.$refs.inputs.focus()
      if (this.content) {
        let params = {
          type: "text",
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
    ccc() {},
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
            ws.send(
              ps ? JSON.stringify(ps) : '{"type":"text","content":"你好"}'
            );
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
@import "./chatpage.scss";
</style>