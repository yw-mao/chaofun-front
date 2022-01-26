<template>
  <div>
    <div v-if="showDetail" style="align-items: center; text-align:center">
      <div v-if="redPacket" style="padding-top: 100px;">
        {{redPacket.sendUser.userName}} 发出的 FBi 红包
      </div>
      <p v-if="this.redPacket.isOpened">
        你获得 <span style="font-weight: bold; font-size: 20px; color: #C3A16C;">{{this.redPacket.got}} </span> FBi
      </p>
      <p v-else-if="redPacket.isEnd">
        红包已经结束
      </p>
      <p>
        总额 {{redPacket.fbiTotal}} FBi, 领取 {{redPacket.userGot}} / {{redPacket.userTotal}}
      </p>
    </div>
    <div v-else-if="redPacket" style="align-items: center; text-align:center">
      <div style="padding-top: 100px;">
        {{redPacket.sendUser.userName}} 发出的 FBi 红包
      </div>
      <div style="padding-top: 10px; font-size: 20px; font-weight: bold">
        {{redPacket.blessing}}
      </div>
      <el-button style="margin-top: 10px" @click="openRedPacket">打开红包</el-button>
    </div>
    <div v-else style="align-items: center; text-align:center">
      <div style="padding-top: 100px; font-size: 20px;">
        输入口令领取红包
      </div>
      <el-input v-model="input" style="margin-top: 10px; padding-left: 20%; padding-right: 20%"></el-input>
      <el-button style="margin-top: 10px" @click="inputEnter">确定</el-button>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
import {getUserInfo} from "../../../api/api";
export default {
  name: "RedPacket",
  data() {
    return {
      input: '',
      showDetail: false,
      redPacket: null,
      fbi: 0,
    }
  },
  created() {
    this.password= this.$route.query.password;
    if (this.password) {
      this.getRedPacket()
    }
  },
  mounted() {

  },

  methods: {
    getRedPacket() {
      api.getByPath('/api/v0/red_packet/get', {'password': this.password, 'type': 'password'}).then( (res) => {
        if (res.success && res.data !== null) {
          this.redPacket = res.data;
          if (this.redPacket.isOpened || this.redPacket.isEnd) {
            this.showDetail = true;
          }
        } else {
          this.redPacket = null
          if (res.errorMessage) {
            this.$toast(res.errorMessage);
          } else {
            this.$toast('没有这个红包');
          }
        }
      });
    },

    openRedPacket() {
      api.getByPath('/api/v0/red_packet/open', {'password': this.password, 'type': 'password'}).then( (res) => {
        if (res.success && res.data != null) {
          this.redPacket = res.data;
          if (this.redPacket.isOpened || this.redPacket.isEnd) {
            this.showDetail = true;
          }
        } else {
          this.redPacket = null
          if (res.errorMessage) {
            this.$toast(res.errorMessage);
          } else {
            this.$toast('没有这个红包');
          }
        }
      }).bind(this);
    },

    inputEnter() {
      this.password = this.input;
      this.getRedPacket();
    },

    history() {
      window.open('https://chao.fun/webview/fbi/history',"_blank");
    }
  }
}


</script>

<style scoped>

</style>