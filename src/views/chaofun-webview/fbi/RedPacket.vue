<template>
  <div>
    <div style="position: fixed; top: 0; right: 0; text-align: right">
      <div>
        <el-button @click="create"> 创建口令红包 </el-button>
      </div>
      <div>
        <el-button @click="history" style="right: 0"> 红包历史 </el-button>
      </div>
    </div>
    <div v-if="showDetail" style="align-items: center; text-align:center">
      <div v-if="redPacket" style="padding-top: 100px;">
        {{redPacket.sendUser.userName}} 发出的 FBi 红包
      </div>
      <div style="padding-top: 10px; font-size: 20px; font-weight: bold">
        {{redPacket.blessing}}
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

      <div>
        <div style="background:#b64340; width: 300px; min-width: 300px; max-width: 300px;height: 400px; min-height: 400px;max-height: 400px;
border-radius: 10px; margin: 100px auto 0px auto;">
          <div style="background: #be4645; width: 300px;height: 150px;   border-radius: 10px; position: relative;"/>
          <div style="background: #be4645; border-radius: 300px;width: 300px;height: 300px;  position: relative;top:-150px;"/>
          <div style="background: #e6cea0; border-radius: 300px;width: 60px;height: 60px;  position: relative;top:-175px; left: 120px; font-size: 42px; cursor: pointer;"
               @click.stop="openRedPacket">開
          </div>
          <div style="font-size: 14px;color: #fce5b9;cursor: pointer;position: relative;top:-140px; " @click.stop="showDetail=true">查看领取详情 ></div>
        </div>
      </div>

      <div style="position: relative;top: -400px;">
        <div style="border-radius: 60px; width: 60px;height: 60px; margin: 20px auto 10px auto; background: #fff; ">
          <img :src="imgOrigin +redPacket.sendUser.icon +'?x-oss-process=image/resize,h_60'" alt=""/>
        </div>
        <div style="font-size: 20px;color: #fce5b9;cursor: pointer; " @click.stop="toUser(redPacket.sendUser.userId)">{{ redPacket.sendUser.userName }}</div>
        <div style="font-size: 30px;color: #fff; margin-top: 50px;"> {{ redPacket.blessing }}</div>
      </div>

<!--      <div style="padding-top: 100px;">-->
<!--        {{redPacket.sendUser.userName}} 发出的 FBi 红包-->
<!--      </div>-->
<!--      <div style="padding-top: 10px; font-size: 20px; font-weight: bold">-->
<!--        {{redPacket.blessing}}-->
<!--      </div>-->
<!--      <el-button style="margin-top: 10px" @click="openRedPacket">打开红包</el-button>-->
    </div>
    <div v-else style="align-items: center; text-align:center">
      <div style="padding-top: 100px; font-size: 20px;">
        输入口令领取 FBi 红包
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

    toUser(userId) {
      if (userId) {
        try {
          window.flutter_inappwebview.callHandler('toAppUser', {userId: userId + ''})
        } catch (e) {
          window.open(location.origin + '/user/' + userId, "_blank");
        }
      }
    },

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
      this.$toast("暂不支持");
    },

    create() {
      window.open('/webview/fbi/redPacket/create', '_blank');
    }
  }
}


</script>

<style scoped>

</style>