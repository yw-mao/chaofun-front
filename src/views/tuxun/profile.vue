<template>
  <div>
    <div style="width: 100%; text-align: center; align-items: center; padding-top: 20px">
        <div @click="toUser(this.userProfile.userAO)" v-if="this.userProfile" class="left">
          <img :src="imgOrigin+this.userProfile.userAO.icon + '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'" alt="">
          <div class="info">
            <div class="title">{{this.userProfile.userAO.userName}}</div>
            <!--                    <p v-if="item.userAO.desc" class="desc">{{item.userAO.desc}}</p>-->
          </div>
        </div>
    </div>
    <div v-if="this.userProfile" style="padding-left: 20px">
      <div>
        <span>分数: </span>
        <span style="color: red">{{this.userProfile.rating}}</span>
      </div>
      <div>
        <span>排名: </span>
        <span style="color: blue">{{this.userProfile.rank}}</span>
      </div>
      <div>
        <span>最高分: </span>
        <span>{{this.userProfile.maxRating}}</span>
      </div>
      <div>
        <span>最高排名: </span>
        <span>{{this.userProfile.maxRanking}}</span>
      </div>

      <div>
        <span>游戏次数:  </span>
        <span>{{this.userProfile.gameTimes}}</span>
      </div>
    </div>
    <div style="padding-left: 20px; padding-top: 20px;">
      <div style="font-size: 20px">
        游戏活跃：
      </div>
      <calendar-heatmap :values="this.activity" :end-date="this.endDate" tooltip-unit="活动" />
    </div>
  </div>

</template>

<script>
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api'
import { CalendarHeatmap } from 'vue-calendar-heatmap'

export default {
  components: {
    CalendarHeatmap
  },
  data(){
    return {
      userId: null,
      userProfile: null,
      endDate: null,
      activity: [],
    }
  },
  created() {
    this.userId= this.$route.path.split("/")[3];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    this.endDate = yyyy + '-' + mm + '-' + dd;
    this.getUserProfile();
    this.getUserActivity();
  },
  methods: {
    getUserProfile() {
      api.getByPath('/api/v0/tuxun/getProfile', {userId: this.userId}).then(res=>{
        this.userProfile = res.data
      })
    },
    getUserActivity() {
      api.getByPath('/api/v0/tuxun/getUserDailyActivity', {userId: this.userId}).then(res=>{
        this.activity = res.data
      })
    },
    toUser(item){
      try {
        window.flutter_inappwebview.callHandler('toAppUser',{userId: item.userAO.userId+''})
      } catch (e) {
        window.open(location.origin + '/user/'+item.userAO.userId,"_blank");
      }
    },

  }
}
</script>
<style scoped lang="scss">

</style>
