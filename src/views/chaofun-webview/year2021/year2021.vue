<template>
  <div>

<!--头像-->
    <div v-if="userInfo">
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px;">一切的开始
      </div>
      <div style="height: 50px;">
        <img  style="display: inline-block; height: 100%" :src="imgOrigin + this.userInfo.icon" />
        <div style="display: inline-block; height: 100%; width: 100px; vertical-align: top;">
        <div style="display: table-cell; height: 50px; vertical-align: middle;">
          {{userInfo.userName}}
        </div>
        </div>
      </div>
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        我在炒饭
      </div>
      <div>
        炒饭陪伴了我{{}}多少天
      </div>
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        我的 Fun 2021
      </div>
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        我收获的
      </div>
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        我最喜欢的版块
      </div>
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        我最赞赏的用户
      </div>
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        谁最关注我
      </div>
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        年度徽章
      </div>

    </div>
    <div v-else>
      请先登录
    </div>



  </div>

</template>

<script>
import * as api from '@/api/api'
export default {
  name: "Year2021.vue",

  data() {
    return {
      userInfo: {},
    }
  },
  created() {
    api.getUserInfo().then(
        res => {
          if (res.success && res.data) {
            this.userInfo = res.data;
          } else {
            this.$toast('请先登录');
          }
        }
    )
    api.getByPath('')
  },
  mounted() {

  },

  methods: {

  }
}
</script>

<style scoped>

  .year_2021_title {
  }

</style>