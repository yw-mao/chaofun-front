<template>
  <agora v-if="token" :appid="appid" channel="test_channel" :token="token">
    <agora-audio-sender/>
    <agora-audio-receiver/>
<!--    <agora-video-sender/>-->
<!--    <agora-video-receiver/>-->
  </agora>
</template>

<script>
import Vue from "vue";

import AgoraRtcVue from "agora-rtc-vue";
import "agora-rtc-vue/lib/agora-rtc-vue.css";
import { AudioSender, AudioReceiver } from 'agora-rtc-vue';
import * as api from "../../api/api";


Vue.use(AgoraRtcVue,{
});

export default {
  name: "test.vue",
  components: {
    // 'agora-audio-sender': AudioSender,
  },
  data(){
    return {
      appid: 'ae4b1253d6804e01917909de12f751ee',
      token: null,
      channel_name: 'test_channel',
      timer: 0
    }
  },
  mounted() {
    api.getByPath('/api/v0/user/getLiveToken', {channelName: this.channel_name, role: 101}).then(res=>{
      this.token = res.data;
    })
  },
  methods: {

  },
}
</script>

<style scoped>

</style>