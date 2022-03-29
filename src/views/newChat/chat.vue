<template>
  <div style="background: #FFF;">

    <div
        style="position: absolute;width: 800px;height: 600px;left: 50%;top: 50%;margin-left: -400px;margin-top:-300px; box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3); border-radius:5px;">

      <!--  left  -->
      <div class="scrollbar_0"
           style="position: absolute;width: 250px;height: 600px;background: #EFEFEF;padding-top: 10px;overflow: auto;scroll-behavior: smooth;">
        <div v-for="channel in chatHistoryMap.values()" :key="channel.id"
             :style="{ background: channel.id === currentChannelId ? '#C6C6C6' : '' }" class="channelItem"
             style="width: 240px;height: 60px;margin: 5px;border-radius:4px;"
             @click="switchChannel(channel.id)">
          <img :src="imgOrigin+channel.avatar + '?x-oss-process=image/resize,w_40,h_40/format,webp/quality,q_75'"
               alt="" style="position: absolute;width: 40px;height: 40px;border-radius: 100%;margin:10px 5px;"/>
          <div style="position:absolute;width: 195px;height: 60px;left: 50px;">
            <span style="position: absolute;left:10px;top:10px;font-size: 16px;font-weight: bold;cursor:default;">{{
                channel.name
              }}</span>
            <span style="position: absolute;right:10px;top:10px;font-size: 12px;color: #999;cursor:default;">{{
                calcMessageTime(channel.lastMessageTime)
              }}</span>
            <span style="position: absolute;left:10px;top:35px;font-size: 14px; color: #777;cursor:default;">{{
                calcLastMessageContent(channel.type, channel.lastMessageType, channel.lastMessageContent, channel.lastMessageSender)
              }}</span>
          </div>
        </div>

        <!--  无可用channel时  -->
        <div v-if="chatHistoryMap.size===0"
             style="width: 240px;height: 60px;margin: 10px;border-radius:4px;text-align: center;color: #999;">
          暂无聊天，请先加入
        </div>
      </div>

      <!--  right  -->
      <div style="position: absolute;width: 550px;height: 600px;left: 250px;">

        <!--  top 聊天对象 -->
        <div
            style="width: 550px;height: 50px;background: #F5F5F5;border-width: 0 0 1px 0;border-style: solid;border-color: #e0e0e0;padding-top: 5px;">
          <div style="margin-left: 190px;height: 40px;width: 40px;float:left;">
            <img v-if="chatHistoryMap.get(currentChannelId)"
                 :src="imgOrigin+chatHistoryMap.get(currentChannelId).avatar + '?x-oss-process=image/resize,w_40,h_40/format,webp/quality,q_75'"
                 alt="" style="width: 40px;height: 40px;border-radius: 100%;"/>
          </div>
          <div style="font-size: 20px;font-weight: bold;float:left;margin-left: 5px;margin-top: 5px;">
            <span v-if="chatHistoryMap.get(currentChannelId)">{{ chatHistoryMap.get(currentChannelId).name }}</span>
          </div>
        </div>

        <!--  middle  聊天记录 -->
        <div ref="chatMessageDiv"
             class="scrollbar_4"
             style="position: absolute;width: 550px;height: 400px;top:50px;background: #f6f6f6;overflow: auto;scroll-behavior: smooth;padding: 0 10px 30px 10px;">
          <div v-if="chatHistoryMap.get(currentChannelId)">
            <div v-for="(chatMessage,index) in chatHistoryMap.get(currentChannelId).chatMessagesArr" :key="index"
                 style="margin: 20px 0;min-height: 62px;">

              <!--  他人  -->
              <div v-if="$store.state.user.userInfo.userId !== chatMessage.sender.userId">
                <!--  头像、昵称、时间  -->
                <div style="width: 530px;height:28px;">
                  <img
                      :src="imgOrigin+chatMessage.sender.icon + '?x-oss-process=image/resize,w_24,h_24/format,webp/quality,q_75'"
                      alt="" style="width: 24px;height: 24px;border-radius: 100%;"/>
                  <span v-if="'group'===chatHistoryMap.get(currentChannelId).type"
                        style="color: #999;margin-left: 5px;margin-right:5px;bottom: 6px;position: relative;">{{
                      chatMessage.sender.userName
                    }}</span>
                  <span style="color: #aaa;margin-left: 5px;margin-right:5px;bottom: 6px;position: relative;">{{
                      calcMessageTime(chatMessage.time)
                    }}</span>
                </div>
                <!--  图片/文字  -->
                <div
                    style="background: #e5e5e5;border-radius: 5px; padding: 7px 10px;display:inline-block;width:auto;height:auto;">
                  <viewer v-if="'image'===chatMessage.type" :images="[imgOrigin+chatMessage.content]">
                    <img :data-source="imgOrigin +chatMessage.content"
                         :src="imgOrigin+chatMessage.content+ '?x-oss-process=image/resize,h_150/format,webp/quality,q_75'"
                         alt=""
                         style="max-width:410px;"/>
                  </viewer>
                  <pre v-else style="max-width: 410px;white-space: pre-wrap;word-wrap: break-word;font-size: 14px;">{{
                      chatMessage.content
                    }}</pre>
                </div>
              </div>

              <!--  自己  -->
              <div v-else style="text-align: right;">

                <!--  头像、昵称、时间  -->
                <div style="width: 530px;height:28px;">
                   <span style="color: #aaa;margin-left: 5px;margin-right:5px;bottom: 6px;position: relative;">{{
                       calcMessageTime(chatMessage.time)
                     }}</span>
                  <img
                      :src="imgOrigin+chatMessage.sender.icon + '?x-oss-process=image/resize,w_24,h_24/format,webp/quality,q_75'"
                      alt="" style="width: 24px;height: 24px;border-radius: 100%;"/>
                </div>
                <!--  图片/文字  -->
                <div
                    style="background: #12b7f5;border-radius: 5px; padding: 7px 10px;display:inline-block;width:auto;height:auto;">
                  <viewer v-if="'image'===chatMessage.type" :images="[imgOrigin+chatMessage.content]">
                    <img :data-source="imgOrigin +chatMessage.content"
                         :src="imgOrigin+chatMessage.content+ '?x-oss-process=image/resize,h_150/format,webp/quality,q_75'"
                         alt=""
                         style="max-width:410px;"/>
                  </viewer>
                  <pre v-else
                       style="max-width: 410px;white-space: pre-wrap;word-wrap: break-word;font-size: 14px;color: #fff;text-align: left;">{{
                      chatMessage.content
                    }}</pre>
                </div>

              </div>


            </div>
          </div>
        </div>

        <!--  bottom  -->
        <div style="position: absolute;width: 550px;height: 150px;top:450px;background: #fff;">
          <!--  发送图片  -->
          <div
              style="position: absolute;width: 550px;height: 23px;padding-left: 10px;margin-top:5px; background: #fff;">
            <el-upload
                ref="imageUpload"
                :before-upload="beforeImageUpload"
                :data="fileData"
                :disabled="imagesUploading"
                :limit="imagesLimit"
                :on-exceed="handleImageUploadExceed"
                :on-success="handleImageUploadSuccess"
                :show-file-list="false"
                accept="image/*"
                action="/api/upload_image"
                multiple
                name="file"
            >
              <i class="el-icon-picture-outline" style="font-size: 20px;background: #fff;color: #000;"
                 title="可直接粘贴图片（Ctrl+V）并发送"/>
            </el-upload>
          </div>
          <!--  文字输入框  -->
          <div v-loading="imagesUploading" style="position: absolute;width: 550px;height: 120px; top:24px;">
            <el-input ref="textInputMark" v-model="inputText" placeholder="请输入内容" resize="none"
                      rows="4" style="height: 120px;width: 100%;border: 0;" type="textarea"></el-input>
          </div>
          <!--  发送按钮  -->
          <div style="position: absolute;width: 65px;height: 35px;bottom: 0;right: 0;" title="Shift+Enter：换行
            Enter：发送">
            <el-button @click.stop="onClickSendButton">发送</el-button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script lang="js">
import {getJoinedChatList} from "@/api/api";
import {Message} from "element-ui";

export default {
  name: "chat",
  data() {
    return {
      chatHistoryMap: new Map(),
      currentChannelId: 0,
      inputText: "",

      url: `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/v0/all`,
      ws: null,

      fileData: {},
      imagesNum: 0,
      imagesLimit: 9,
      imagesUploading: false,
      // images: [],
    }
  },
  created() {

    document.title = "炒饭 - 聊天";

    Date.prototype.format = function (fmt) {
      const o = {
        "M+": this.getMonth() + 1,                 //月
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (const k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    }

    // 判断登录状态
    if (!this.$store.state.user.islogin) {
      this.handleNeedLogin();
      return;
    }

    //
    getJoinedChatList().then(({data, success}) => {

      if (success) {
        if (data) {
          for (let i = 0; i < data.length; ++i) {
            let item = data[i];
            // 聊天记录
            item.chatMessagesArr = [];
            // 头像有为空的情形，做特殊处理
            if (!item.avatar) {
              item.avatar = "biz/08a2d3a676f4f520cb99910496e48b4e.png";
            }
            this.chatHistoryMap.set(item.id, item);
          }

          // channel
          if (this.$route.query && this.$route.query.id && this.$route.query.id.toString() && this.chatHistoryMap.has(parseInt(this.$route.query.id.toString()))) {
            this.currentChannelId = parseInt(this.$route.query.id.toString());
          } else if (data) {
            this.currentChannelId = data[0].id;
          }

          // title
          this.modifyDocumentTitle();

        }

        //
        this.wsInit();

      } else {
        this.showMessageError();
      }

    }).catch(() => {
      this.showMessageError();
    });

  },
  mounted() {
    // 添加监听事件
    addEventListener('keydown', this.keyDown);
    addEventListener('paste', this.toPaste);


    // 输入框获取焦点
    this.$refs.textInputMark.focus();
  },
  destroyed() {
    // 移除监听事件
    removeEventListener('keydown', this.keyDown);
    removeEventListener('paste', this.toPaste);
  },
  methods: {

    // 上传图片处理
    handleImageUploadSuccess(res, file) {
      if (res.success) {
        this.imageUrl = URL.createObjectURL(file.raw);
        // this.images.push(res.data);

        // 发送图片
        this.onSendImage(res.data);

      } else if (res.errorCode == 'invalid_content') {
        // this.imageUrl = ''
        this.$toast(res.errorMessage)
      }
      this.imagesNum--
      if (!this.imagesNum) {
        this.imagesUploading = false
        this.$refs.imageUpload.clearFiles()
      }
    },
    beforeImageUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!');
        return false
      }
      this.imagesNum++
      this.imagesUploading = true
      this.fileData.fileName = file.name
      return true
    },
    handleImageUploadExceed(files, fileList) {
      this.$message.warning({
        message: `当前限制选择 ${this.imagesLimit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`,
        duration: 2500
      });
    },

    // 粘贴图片
    toPaste(e) {
      const cbd = e.clipboardData;
      const ua = window.navigator.userAgent;
      // console.log(this.$refs.imageUpload)
      if (!(e.clipboardData && e.clipboardData.items)) {
        return;
      }
      if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" && cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" && ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
        return;
      }
      const item = cbd.items[cbd.items.length - 1];
      if (item.kind == "file" && (/^image\/[a-z]*$/.test(item.type))) {
        const blob = item.getAsFile();
        if (blob.size === 0) {
          return;
        }
        this.$refs.imageUpload.$children[0].uploadFiles([blob])
      }
    },

    // 键盘监听事件
    keyDown(e) {
      // 回车：输入框无焦点时获取焦点，有焦点时发送信息
      if (e.keyCode === 13) {
        if (e.shiftKey || e.ctrlKey || e.altKey) {
          return;
        }
        if (this.$refs.textInputMark) {
          if (this.$refs.textInputMark.focused) {
            // 有焦点
            this.onClickSendButton();
            e.preventDefault();
          } else {
            //无焦点
            this.$refs.textInputMark.focus();
            e.preventDefault();
          }
        }
      }
    },

    // 滚动到底部
    chatMessageDivScrollToEnd() {
      // TODO 滚动效果不好，有bug，偶尔能复现
      setTimeout(() => {
        this.$refs.chatMessageDiv.scrollTop = 9999999;
      }, 300);
    },

    // 发送图片
    onSendImage(imageUrl) {
      if (!this.currentChannelId || this.currentChannelId === 0) {
        Message.info("暂无聊天，请先加入");
        return;
      }

      // 直接发送图片，暂不加确认
      this.sendImage(this.currentChannelId, imageUrl);

    },

    // 点击发送按钮
    onClickSendButton() {

      if (!this.currentChannelId || this.currentChannelId === 0) {
        Message.info("暂无聊天，请先加入");
        return;
      }

      let text = this.inputText.trim();
      if (!text) {
        return;
      }
      this.sendText(this.currentChannelId, text);
      this.inputText = "";
    },

    // 处理最新消息内容
    calcLastMessageContent(type, lastMessageType, lastMessageContent, lastMessageSender) {
      if (!lastMessageContent) {
        lastMessageContent = "";
      }

      let returnStr = "";
      if ("group" === type && lastMessageSender) {
        returnStr = lastMessageSender.userName + ":";
      }

      if ("image" === lastMessageType) {
        returnStr += "[图片]";
      } else if ("text" === lastMessageType) {
        returnStr += lastMessageContent.replaceAll(" ", "").replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n\n", "\n").replaceAll("\n", " ").trim();
      } else {
        returnStr += "";
      }

      if (returnStr.length > 11) {
        returnStr = returnStr.substring(0, 11) + "...";
      }
      return returnStr;
    },

    // 处理最新消息时间
    calcMessageTime(lastMessageTime) {
      if (!lastMessageTime) {
        return "";
      }

      const date = new Date(lastMessageTime);
      const dateNow = new Date();

      if (date.getMonth() === dateNow.getMonth() && date.getDay() === dateNow.getDay()) {
        return date.format("hh:mm");
      } else {
        return date.format("MM-dd hh:mm");
      }

    },

    // 切换
    switchChannel(id) {
      this.currentChannelId = id;

      // 滚动到最新消息
      this.chatMessageDivScrollToEnd();

      //
      this.modifyDocumentTitle();
    },

    modifyDocumentTitle() {
      setTimeout(() => {
        document.title = "炒饭 - 聊天 - " + this.chatHistoryMap.get(this.currentChannelId).name;
      }, 1);
    },

    // 弹出错误提示
    showMessageError() {
      Message.error("未知错误！");
    },


    // 发送心跳
    sendHeartBeat() {
      this.wsSend(`{"scope": "heart_beat"}`);
    },

    // 发送文字
    sendText(channelId, text) {
      this.wsSend("{\"scope\": \"chat\", \"data\": {\"type\": \"text\", \"channelId\": " + channelId + ", \"content\": \"" + text + "\"}}")
    },

    // 发送图片
    sendImage(channelId, imageUrl) {
      this.wsSend("{\"scope\": \"chat\", \"data\": {\"type\": \"image\", \"channelId\": " + channelId + ", \"content\": \"" + imageUrl + "\"}}")
    },

    // 发送：加载聊天记录
    sendLoadChatHistory(channelId) {
      this.wsSend("{\"scope\": \"chat\", \"data\": {\"type\": \"load\", \"channelId\":" + channelId + "}}")
    },

    // 发送权限验证信息
    // 需权限验证直接跳转登录页面，应该不需要该方法
    //     sendAuth() {
    // TODO
    // let cookie = null;
    // wsSend("{\"scope\": \"auth\", \"data\": \"" + cookie + "\"}")
    // },

    // 发送数据
    wsSend(data) {
      console.log("wsSend: " + data);
      this.ws.send(data);
    },

    // 接收数据
    handleReceiveMessage: function (data) {
      if ("chat" !== data.scope) {
        return;
      }

      const dataType = data.data.type.toString();
      if ("load_result" === dataType) {
        const {channelId, chatMessages} = data.data.data;
        this.handleLoadResult(channelId, chatMessages);
      } else if ("message" === dataType) {
        this.handleNewMessage(data.data.data);
      } else if ("need_login" === dataType) {
        this.handleNeedLogin();
      } else {
        this.showMessageError();
      }

    },

    // 需登录
    handleNeedLogin() {
      this.$login({
        callBack: () => {
          this.$store.dispatch('user/getInfo')
        }
      });
    },


    // 处理接收的新消息
    handleNewMessage(chatMessage) {
      let channelData = this.chatHistoryMap.get(chatMessage.channelId);
      if (!channelData) {
        this.showMessageError();
        return;
      }

      // 将新消息添加到聊天记录列表
      channelData.chatMessagesArr.push(chatMessage);

      // 更新lastMessage
      channelData.lastMessageContent = chatMessage.content;
      channelData.lastMessageTime = chatMessage.time;
      channelData.lastMessageType = chatMessage.type;
      channelData.lastMessageSender = chatMessage.sender;

      // 强制渲染
      this.$forceUpdate();

      // 滚动到最新消息
      if (this.currentChannelId === chatMessage.channelId) {
        this.chatMessageDivScrollToEnd();
      }
    },

    // 处理接受的历史聊天记录
    handleLoadResult(channelId, chatMessages) {
      let channelData = this.chatHistoryMap.get(channelId);
      channelData.chatMessagesArr.push(...chatMessages.reverse());

      // 强制渲染
      this.$forceUpdate();

      // 滚动到最新消息
      this.chatMessageDivScrollToEnd();
    },


    //
    wsOnMessage(e) {
      console.log("wsOnMessage");
      // console.log(e);
      const data = JSON.parse(e.data);
      // console.log(data);
      this.handleReceiveMessage(data);
    },

    wsOnOpen(e) {
      console.log("wsOnOpen");
      // console.log(e);

      // 每60秒发送一次心跳
      setInterval(() => {
        this.sendHeartBeat();
      }, 60000);

      // 加载聊天记录
      for (const channelId of this.chatHistoryMap.keys()) {
        this.sendLoadChatHistory(channelId);
      }

    },

    wsOnError(e) {
      console.log("wsOnError");
      // console.log(e);

      // TODO
      // wsInit();
    },

    wsOnClose(e) {
      console.log("wsOnClose");
      // console.log(e);

      // TODO
      // wsInit();
    },

    // 初始化
    wsInit() {
      console.log("wsInit");

      if (this.ws) {
        this.ws.close();
      }
      this.ws = new WebSocket(this.url);
      this.ws.onopen = this.wsOnOpen;
      this.ws.onmessage = this.wsOnMessage;
      this.ws.onerror = this.wsOnError;
      this.ws.onclose = this.wsOnClose;
    },

  }
}
</script>

<style lang="scss" scoped>

.scrollbar_0 {
  &::-webkit-scrollbar {
    width: 0;
  }

  &::-webkit-scrollbar-thumb {
    width: 0;
  }
}

.scrollbar_4 {
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    width: 4px;
    background: #999;
  }
}

/deep/ .el-textarea__inner {
  border: none;
  font-size: 16px;
  padding-left: 10px;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    width: 4px;
    background: #999;
  }
}

/deep/ .el-button {
  border: none;
  background: #eee;
  height: 30px;
  padding: 10px 15px;
  margin: 0;

  span {
    position: relative;
    top: -2px;
  }
}


.channelItem {
  &:hover {
    background: #e1e1e1;
  }
}

</style>