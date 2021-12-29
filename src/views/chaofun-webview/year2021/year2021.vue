<template>
  <div>

<!--头像-->
    <div v-if="userInfo">
      <div class="year_2021_title;" style=" font-weight: bold; font-size: 24px; color: #FF9300">一切的开始
      </div>
      <div style="height: 50px;">
        <img  style="display: inline-block; height: 100%" :src="imgOrigin + this.userInfo.icon" />
        <div style="display: inline-block; height: 100%; width: 100px; vertical-align: top;">
        <div style="display: table-cell; height: 50px; vertical-align: middle; background: red;">
          123
        </div>
        </div>
      </div>
      <div class="year_2021_title;" style=" font-weight: bold; font-size: 24px; color: #FF9300">一切的开始
      </div>
    </div>
    <div v-else>

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
            this.userInfo = res.data
          } else {
          }
        }
    )
  },
  mounted() {

    // api.getUserInfo().then(
    //     res => {
    //       if (res.success && res.data) {
    //         this.userInfo = res.data
    //         print(res.data)
    //       } else {
    //         this.$toast(res.errorMessage)
    //       }
    //     }
    // )
  },

  methods: {

  }
}
</script>

<style scoped>

  .year_2021_title {
  }

</style>