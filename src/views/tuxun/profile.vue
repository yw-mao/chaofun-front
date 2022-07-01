<template>
  <div>
    <div style="width: 100%; text-align: center; align-items: center; padding-top: 20px">
        <div @click="toUser" v-if="this.userProfile" class="left">
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
    </div>
  </div>

</template>

<script>
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api'
export default {
  components: {

  },
  data(){
    return {
      userId: null,
      userProfile: null,
    }
  },
  created() {
    this.userId= this.$route.path.split("/")[3];
    this.getUserProfile();
  },
  methods: {
    getUserProfile() {
      api.getByPath('/api/v0/tuxun/getProfile', {userId: this.userId}).then(res=>{
        this.userProfile = res.data
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
