<template>
  <div style="padding-left: 10px; padding-right: 10px">
    <p style="font-weight: bold; font-size: 20px; color: #FF9300">
      你的 FBi:
      <span style="color: orangered">
        {{this.fbi}}
      </span>
    </p>
    <div style="padding-top: 20px">
    <p style="font-weight: bold; font-size: 20px; color: #FF9300">
      FBi 是什么:
    </p>
    <p style="font-size: 14px;">
      炒饭的货币，可以用来兑换炒饭纪念品或者是用来给帖子或者评论加奖励(敬请期待)，目前可以通过徽章或者别人的奖励(敬请期待) 获得。
    </p>
    </div>
    <div style="padding-top: 20px; font-weight: bold; font-size: 20px; color: #FF9300">
      纪念品兑换(请私聊联系@cijianzy)
    </div>
    <div style="width: 100%; ">
      <div style="width: 50%; display: inline-block">
        <img style="padding-right: 10px; padding-left: 10px; width: 100%" src="https://i.chao.fun/biz/ed0a03cabd89c638dd0451f14bb20969.png">
        <p style="text-align: center">
          炒饭马克杯
        </p>
        <p style="text-align: center">
          FBi: 3500
        </p>
      </div>
      <div style="width: 50%; display: inline-block">
        <img style="padding-right: 10px; padding-left: 10px; width: 100%" src="https://i.chao.fun/biz/e3e44a77908676ea7047c18601a0297b.png">
        <p style="text-align: center">
          炒饭 T-shirt
        </p>
        <p style="text-align: center">
          FBi: 7500
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
import {getUserInfo} from "../../../api/api";
export default {
  name: "fbi.vue",

  data() {
    return {
      'fbi': 0,
    }
  },
  created() {
    api.getUserInfo().then(
        res => {
          if (res.success) {
            this.fbi = res.data.fbi;
          } else {
            this.$toast(res.errorMessage)
          }
        }
    )
  },
  mounted() {

  },
}
</script>

<style scoped>

</style>