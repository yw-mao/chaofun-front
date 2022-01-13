<template>
  <div>
    <div style="text-align: center; width: 100%">FBi 历史</div>
    <div style="text-align: center; width: 100%">近200条记录</div>
    <div>/时间/行为/获得/剩余</div>
    <div v-if="history != null && history.length != 0"  v-for="(item, index) in history">
      <span>{{moment(item.date).format('MM-DD HH:mm')}}</span>
      <span>   {{getReason(item.reason)}}</span>
      <span>  {{item.value}}  </span>
      <span>  {{item.rest}}</span>
    </div>
  </div>
</template>

<script>

  import moment from "moment";

  import * as api from '@/api/api'
  export default {
    name: "FBiHistory",
    data() {
      return {
        history: [],
        moment: moment,
      }
    },

    mounted() {
      api.getByPath('/api/v0/fbi/history', null).then( (res) => {
        // log(res);
        if (res.success) {
          this.history = res.data
        } else {
          this.$toast(res.errorMessage)
        }
      })
    },


    methods: {
      getReason(reason) {
        if (reason === 'comment') {
          return '评论'
        }
        if (reason === 'admin') {
          return '管理员操作'
        }
        if (reason === 'sub_comment') {
          return '子评论'
        }
        if (reason === 'be_comment') {
          return '被评论'
        }
        if (reason === 'secret') {
          return '秘密花园'
        }


        return '';

      }
    }

  }
</script>

<style scoped>

</style>