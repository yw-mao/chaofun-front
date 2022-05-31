<template>
  <div>
    <div  v-for="(item, index) in list">
      <div v-if="item.action=='delete_post'" class="zan">
        <div class="item">
          <span v-if="item.user" @click.stop="toUser(item.user)" class="username user_name">【{{item.user.userName}}】</span>
          <span>删除了</span>
          <span v-if="item.targetUser" @click.stop="toUser(item.targetUser)" class="username user_name">【{{item.targetUser.userName}}】</span>
          <span>的帖子</span>
          <span @click="toDetail(item.post)" class="tiezi_title">【{{item.post.title.length>15?item.post.title.slice(0,15)+'...':item.post.title}}】</span>
        </div>
      </div>

      <div v-if="item.action=='delete_comment'" class="zan">
        <div class="item">
          <span v-if="item.user" @click.stop="toUser(item.user)" class="username user_name">【{{item.user.userName}}】</span>
          <span>删除了</span>
          <span v-if="item.targetUser" @click.stop="toUser(item.targetUser)" class="username user_name">【{{item.targetUser.userName}}】</span>
          <span>在的帖子</span>
          <span @click="toDetail(item.comment.post)" class="tiezi_title">【{{item.comment.post.title.length>15?item.comment.post.title.slice(0,15)+'...':item.comment.post.title}}】</span>
          <span>下的评论</span>
          <span @click="toDetail(item.comment.post)" class="tiezi_title">【{{item.comment.text.length>15?item.comment.text.length.slice(0,15)+'...':item.comment.text.length}}】</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import * as api from '@/api/api'

export default {
  name: "ForumLog",
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      list: [],
    }
  },

  created() {
    if (this.forumId0) {
      this.forumId = this.forumId0;
    } else {
      this.forumId = this.$route.query.forumId;
    }
    this.forumLogList();
  },

  methods: {
    forumLogList() {
      api.getByPath('/api/v0/forum/listLogs', { 'forumId': this.forumId, 'pageSize': 100 }).then((res) => {
        console.log('123');
        this.list = res;
      })
    },
  }
}
</script>

<style scoped>

</style>