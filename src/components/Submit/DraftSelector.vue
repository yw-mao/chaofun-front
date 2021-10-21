<template>
  <div>
    <el-button type="text" @click="visible = true">草稿箱 <span>{{drafts.length}}</span></el-button>
    <el-dialog
      width="400"
      trigger="click"
      :visible.sync="visible"
    >
      <span slot="title">
        草稿箱 <i>{{drafts.length}}/20</i>
      </span>
      <ul>
        <li :key="item.i" v-for="item in drafts">
          <div class="draft-icon">
            <i class="el-icon-tickets"></i>
          </div>
          <div class="draft-content">
            <h2>{{item.t}}</h2>
            <div class="draft-desc">
              <time>{{moment.unix(item.d).fromNow()}}</time>
            </div>
          </div>
          <div class="draft-operation">
            <el-button icon="el-icon-delete" @click="() => removeDraft(item.i)"></el-button>
          </div>
        </li>
      </ul>
    </el-dialog>
  </div>
  
</template>
<script>
import 'moment/locale/zh-cn'
import moment from 'moment'
import { nanoid } from 'nanoid'

export default ({
  props: {
    title: String,
    value: String,
  },
  data() {
    return {
      moment: moment,
      drafts: [],
      visible: false,
    }
  },
  created() {
    this.drafts = this.getDrafts();
    console.log(this.drafts);
  },
  methods: {
    // 获取所有草稿
    getDrafts() {
      const userId = this.$store.state.user.userInfo.userId
      if (!userId) {
        return [];
      }
      const key = `draft:${userId}:article`
      const articles = JSON.parse(localStorage.getItem(key) || '[]');
      if (articles && articles.length > 0) {
        // 检查
        return articles.filter(article => article && article.i && article.t && article.c && article.d);
      }
      return [];
    },
    // 保存文章
    saveDraft(title, content, forumId = 0, formuName = '') {
      this.drafts.push({
        i: nanoid(),
        f: forumId,
        n: formuName,
        t: title,
        c: content,
        d: moment().unix(),
      })
      const userId = this.$store.state.user.userInfo.userId
      if (!userId) {
        return false;
      }
      const key = `draft:${userId}:article`
      localStorage.setItem(key, JSON.stringify(this.drafts))
      this.$toast('保存草稿成功！')
    },
    // 更新文章
    updateDraft(id, title, content, forumId = 0, formuName = '') {
      const index = this.drafts.findIndex(article => article.i === id);
      if (index === -1) {
        return false;
      }
      const userId = this.$store.state.user.userInfo.userId
      if (!userId) {
        return false;
      }
      const key = `draft:${userId}:article`
      this.drafts[index] = {
        i: id,
        f: forumId,
        n: formuName,
        t: title,
        c: content,
        d: moment().unix(),
      }
      localStorage.setItem(key, JSON.stringify(this.drafts))
    },
    // 移除草稿
    removeDraft(id) {
      const userId = this.$store.state.user.userInfo.userId
      if (!userId) {
        return false;
      }
      const key = `draft:${userId}:article`
      this.drafts = this.drafts.filter(article => article.i !== id)
      localStorage.setItem(key, JSON.stringify(this.drafts))
      this.$toast('删除成功！')
    },
  },
});
</script>

<style lang="scss" scoped>
.el-button {
  position: relative;
  color: #606266;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .5px;
  line-height: 24px;
  text-transform: uppercase;
  margin-left: 10px;
  padding: 4px;
  span {
    font-weight: 400;
    line-height: 18px;
    background: #606266;
    border-radius: 2px;
    color: #fff;
    margin-left: 4px;
    padding: 1px 3px;
  }
}
</style>
