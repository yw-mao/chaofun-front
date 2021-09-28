<template>
  <div>
    <div v-for="(item,lists) in lists" :key="index" class="item">
    <div>item.name</div>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/api'

  export default {
    name: "tag",
    // components: { adminDashboard, editorDashboard },
    data() {
      return {
        params: {},
        forumId: '',
        lists:[],
        modInfo: {
          money: 0.0,
          past24HPosts: 0,
          past24HVotes: 0,
          rank: 0
        }
      }
    },

    created() {
      this.forumId = this.$route.query.forumId;
      api.getlistTag({ forumId: this.forumId }).then((res) => {
        this.lists = res.data;
        this.load()
      })
    }
  }

</script>

<style scoped>

</style>