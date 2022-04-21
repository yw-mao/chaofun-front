<template>
  <div>
    <div v-if="lists != null && lists.length > 0">
      <div  v-for="(item,index) in lists" >
        <div style="border-bottom: 1px solid #f1f1f1;" v-if="item.type === 'post'" >
          <div @click="toPost(item.postInfo.postId)" style="font-size: 20px; font-weight: bold">
            帖子: {{doType(item.postInfo)}}
          </div>
          <div @click="toPost(item.postInfo.postId)" style="font-size: 16px">
            标题：{{item.postInfo.title}}
          </div>
          <div @click="toPost(item.postInfo.postId)" style="font-size: 16px">
            用户：{{item.postInfo.userInfo.userName}}
          </div>
          <div @click="toPost(item.postInfo.postId)" style="font-size: 16px">
            举报原因：{{item.reason}}
          </div>
          <div>
            <el-button @click="dealReport(item.id, 'ignore')">不处理</el-button>
            <el-button @click="dealReport(item.id, 'delete')">删除内容</el-button>
            <el-button @click="dealReport(item.id, 'malicious')">恶意举报</el-button>
          </div>
        </div>


        <div style="border-bottom: 1px solid #f1f1f1;" v-if="item.type === 'comment'" >
          <div @click="toPost(item.postInfo.postId)" style="font-size: 20px; font-weight: bold">
            评论 {{doCommentType(item.commentInfo)}}
          </div>
          <div @click="toPost(item.postInfo.postId)" style="font-size: 16px">
            内容：{{item.commentInfo.text}}
          </div>
          <div @click="toPost(item.postInfo.postId)" style="font-size: 16px">
            用户：{{item.commentInfo.userInfo.userName}}
          </div>
          <div @click="toPost(item.postInfo.postId)" style="font-size: 16px">
            举报原因：{{item.reason}}
          </div>
          <div>
            <el-button @click="dealReport(item.id, 'ignore')">不处理</el-button>
            <el-button @click="dealReport(item.id, 'delete')">删除内容</el-button>
            <el-button @click="dealReport(item.id, 'malicious')">恶意举报</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      暂无举报
    </div>
  </div>



</template>

<script>
import * as api from '@/api/api'

import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'

export default {
  name: "report",

  data() {
    return {
      lists: [],
    }
  },

  mounted(){
    this.init()
  },

  methods: {
    init() {
      api.getByPath('/api/v0/report/list', null).then(res=>{
        this.lists = res.data
      })
    },
    doCommentType(item) {
      var t = item.type;
      switch (t) {
        case "media":
          return "有图(请点击查看详情)";
          break;
        default:
          return ""
      }

    },
    doType(item) {
      var t = item.type;
      switch (t) {
        case "link":
          return "链接";
          break;
        case "gif":
          return "GIF";
          break;
        case "image":
          return "图片";
          break;
        case "inner_video":
          return "视频";
          break;
        case "article":
          return "文章";
          break;
        case "vote":
          return "投票";
          break;
        case "prediction":
          return "竞猜";
          break;
        case "forward":
          return "转发";
          break;
        default:
          return "其他";
      }
    },
    toPost(id) {
      try {
        window.flutter_inappwebview.callHandler('toAppPost', {postId: id.toString()});
      } catch (e) {
        window.open('https://chao.fun/p/' + id.toString(), "_blank");
      }
    },
    dealReport(id, action) {


      if (action === 'delete') {
        this.$confirm(`是否确定删除内容？`, "提示", {
          type: "warning",
        }).then(() => {
          api.getByPath('/api/v0/report/solve', {'id': id, 'action': action}).then(res => {
            this.init();
          })
        })
      } else if (action === 'malicious') {
        this.$confirm(`是否判定为恶意举报？`, "提示", {
          type: "warning",
        }).then(() => {
          api.getByPath('/api/v0/report/solve', {'id': id, 'action': action}).then(res => {
            this.init();
          })
        })
      } else {
        api.getByPath('/api/v0/report/solve', {'id': id, 'action': action}).then(res => {
          this.init();
        })
      }
    }
  }
}


</script>

<style scoped>

</style>

<style lang="scss">
.el-message-box{
  width: 90vw;
  max-width: 400px;
}
</style>