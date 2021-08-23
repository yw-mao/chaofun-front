<template>
  <el-container class="section-submit">
    <el-main>
      <el-container class="section-submit-header">
        <el-col>发帖</el-col>
        <el-button type="text">草稿箱 <span>{{drafts}}</span></el-button>
      </el-container>

      <el-container>
        <div class="section-submit-form">
        <img class="sicon" :src="imgOrigin+forum.imageName" alt="" v-if="forum.imageName" />
        <i class="el-icon-search" v-else />
          <el-select
            v-model="forum.id"
            filterable
            remote
            reserve-keyword
            placeholder="请选择板块"
            popper-class="section-submit-form-select"
            :popper-append-to-body="false"
            :remote-method="getForumCategories"
            :loading="loading"
            @change="forumSelectOnChange"
          >
            <el-option
              v-for="item in forums"
              :key="item.link"
              :label="item.title"
              :value="item.forumId"
            >
              <img class="sicon" :src="imgOrigin+item.icon" alt="" />
              <span>{{item.title}}</span>
            </el-option>
          </el-select>
        </div>
      </el-container>
      <div class="postbox">
        <el-radio-group v-model="type">
          <el-radio-button label="article">
            <i class="el-icon-tickets"></i> 帖子
          </el-radio-button>
          <el-radio-button label="image">
            <i class="el-icon-picture-outline"></i> 图片/视频
          </el-radio-button>
          <el-radio-button label="link">
            <i class="el-icon-link"></i> 链接
          </el-radio-button>
          <el-radio-button label="vote">
            <i class="el-icon-receiving"></i> 投票
          </el-radio-button>
        </el-radio-group>

        <div class="postbox-fields">
          <el-row>
            <el-input
              type="text"
              placeholder="请输入标题"
              v-model="post.title"
              maxlength="300"
              show-word-limit
            />
          </el-row>
          <el-row>
            <editor v-model="post.content" />
          </el-row>
          <el-row>
            <div class="checkbox-group">
              <el-checkbox
                v-model="post.anonymity"
                :true-label="1"
                :false-label="0"
                border
                size="medium"
              >
                <i :class="[post.anonymity ? 'el-icon-check' : 'el-icon-plus']" />
                <span>匿名</span>
              </el-checkbox>
            </div>
          </el-row>
          <el-divider></el-divider>
        </div>
        <div class="postbox-buttons">
          <el-button type="primary" round>发 布</el-button>
          <el-button round>保存草稿箱</el-button>
        </div>
        <div class="postbox-rules">
          <p><i class="el-icon-warning-outline" /> 严禁发布色情、暴恐、赌博及其他违反网络安全法的内容，或涉嫌隐私或未经授权的私人图片及信息，如违规发布，请自行删除或管理员强制删除。 </p>
        </div>
      </div>
    </el-main>
    <el-aside width="320px">
      <el-card class="aside-forum" shadow="never">
        <div class="forum-header">
          <img :src="imgOrigin+forum.imageName" :alt="forum.name" v-if="forum.imageName">
          <router-link :to="`/f/${forum.id}`">{{forum.name}}</router-link>
        </div>
        <div class="forum-desc">
          {{forum.desc}}
        </div>
        <div class="forum-statics">
          <div class="statics-box">
            <em>{{forum.followers}}</em>
            <span>粉丝</span>
          </div>
          <div class="statics-box">
            <em>{{forum.posts}}</em>
            <span>帖子</span>
          </div>
        </div>
      </el-card>
      <el-card class="aside-rule" shadow="never">
        <p>
          <img :src="logo" alt="" />
          <span>炒饭发帖规则</span>
        </p>
        <ol>
          <li>严禁发布色情、暴恐、赌博及其他违反网络安全法的内容</li>
          <li>严禁发布涉嫌隐私或未经授权的私人图片及信息</li>
          <li>如违规发布，请自行删除或管理员强制删除</li>
        </ol>
      </el-card>
      <el-card class="aside-help" shadow="never">
        <el-row :gutter="12">
          <el-col :span="12" class="help-item">
            <router-link to="/help/forumIntro">帮助文档</router-link>
          </el-col>
          <el-col :span="12" class="help-item">
            <router-link to="/forumRank">24小时板块排名</router-link>
            <router-link to="/userRank">24小时用户排名</router-link>
          </el-col>
        </el-row>
      </el-card>
    </el-aside>
  </el-container>

</template>

<script>
  import Vue from 'vue';
  import Editor from '@/components/Editor/Tiptap.vue'
  import { getForumInfo, searchForum } from '@/api/api'
  import { logo } from '@/settings'

  export default {
    name: 'submitV2',
    components: {
      Editor,
    },
    data() {
      return {
        logo,
        type: 'article',
        forum: {
          name: '',
          id:  this.$route.params.forumId,
        },
        post: {
          forumId:  this.$route.params.forumId,
          title: '',
          link: '',
          content: '',
          anonymity: false,
        },
        forums: [],
        loading: false,
        drafts: 0, // 草稿箱数量
      }
    },
    mounted() {
      this.getForum().then(() => this.getForumCategories());
    },
    beforeDestroy() {
    },
    methods: {
      forumSelectOnChange(forumId) {
        this.getForum();
        this.$router.push({params: { forumId }});
      },
      async getForum() {
        if (this.forum.id) {
          const result = await getForumInfo({ forumId: this.forum.id });
          this.forum.name = result.data.name;
          this.forum.imageName = result.data.imageName;
          this.forum.followers = result.data.followers;
          this.forum.posts = result.data.posts;
          this.forum.desc = result.data.desc;
          this.post.forumId = this.forum.id;
        }
      },
      async getForumCategories(keyword = '') {
        const result = await searchForum({ keyword });
        this.forums = result.data;
        // 如果没找对应板块，那么插入默认
        if (!this.forums.find(forum => forum.forumId === this.forum.id)) {
          console.log( this.forum.id);
          this.forums.push({
            forumId: this.forum.id,
            icon: this.forum.imageName,
            title: this.forum.name,
          });
        }
      },
    }
  }
</script>

<style type='text/scss' lang='scss' scoped>
.section-submit {
  padding: 60px 20px;
  
  .section-submit-header {
    border-bottom: 1px solid #DCDFE6;
    margin-bottom: 10px;
    .el-col {
      padding: 0;
      font-size: 18px;
      font-weight: 500;
      line-height: 22px;
    }
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
  }
  .section-submit-form {
    position: relative;
    display: flex;
    box-sizing: border-box;
    min-width: 300px;
    width: auto;
    height: 40px;
    border-radius: 4px;
    transition: box-shadow .2s ease;
    box-shadow: 0 0 0 0 #fff;
    border: 1px solid #edeff1;
    background-color: #fff;
    align-items: center;
    padding: 0 8px;
    margin-bottom: 8px;
    i, img {
      margin: 0;
      height: 22px;
      width: 22px;
      font-size: 22px;
      line-height: 22px;
      border-radius: 9999px;
    }
    .el-select {
      width: 100%;
      /deep/ .el-select__caret {
        font-size: 22px;
        color: #606266;
        &:before {
          content: "\e6e1";
        }
      }
      /deep/ .el-input.is-focus {
        .el-select__caret {
          transform: rotate(
            0deg
          );
        }
      }
    }
    /deep/ .el-input__inner {
      border: none;
    }
  }
  .postbox {
    width: 100%;
    background: #FFF;
    overflow: hidden;
    border-radius: 10px;
    // padding-bottom: 20px;

    .el-radio-group {
      width: 100%;
      display: flex;
      label {
        flex: 1;
        /deep/ .el-radio-button__inner {
          display: flex;
          flex: 1;
          width: 100%;
          box-sizing: border-box;
          padding: 15px 24px;
          outline: none;
          position: relative;
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          line-height: 20px;
          border: none;
          background: transparent;
          border: 1px solid #DCDFE6;
          border-width: 0 1px 1px 0;
          align-items: center;
          justify-content: center;
          box-shadow: none;
          color: #606266;
          line-height: 20px;
          i {
            font-size: 20px;
            font-weight: 400;
            height: 20px;
            line-height: 20px;
            margin-right: 8px;
          }
        }

        &:hover {
          background-color: rgba(0, 121, 211, 0.05);
          /deep/ .el-radio-button__inner {
            color: #606266;
          }
        }

        &:last-child {
          /deep/ .el-radio-button__inner {
            border-width: 0 0 1px 0;
          }
        }

        &.is-active {
          /deep/ .el-radio-button__inner {
            color: #16679f;

            &::after {
              content: " ";
              box-sizing: border-box;
              background-color: #16679f;
              position: absolute;
              left: 0;
              right: 0;
              bottom: -1px;
              height: 2px;
            }
          }
        }
      }
     
    }
  }
  .postbox-fields {
    margin: 16px;
    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;
    }
    /deep/ .el-checkbox {
      position: relative;
      padding: 4px 16px;
      border: 1px solid;
      border-radius: 9999px;
      color: #606266;
      font-size: 14px;
      min-height: 32px;
      height: auto;
      min-width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      .el-checkbox__inner {
        display: none;
      }
      .el-checkbox__label {
        padding-left: 0;
        display: flex;

        i {
          font-size: 20px;
          font-weight: 400;
          height: 20px;
          line-height: 20px;
          margin-right: 8px;
        }
      }

      &.is-checked {
        background: #16679f;
        border-color: #16679f;
        .el-checkbox__label {
          color: #fff;
        }
      }
    }
    .el-divider {
      margin: 0;
    }
  }
  .postbox-buttons {
    display: flex;
    margin: 0 16px 16px;
    flex-direction: row-reverse;
    text-transform: uppercase;
    .el-button {
      margin-left: 8px;
      &.el-button--primary {
        background-color: #16679f;
        border-color: #16679f;
      }
    }
  }

  .postbox-rules {
    display: none;
    background-color: #edeff1;
    padding: 8px 16px 21px;
    i {
      font-size: 18px;
      color: #fc471e;
    }
  }

  /deep/ .section-submit-form-select {
    .el-select-dropdown__item {
      display: flex;
      align-items: center;
      img {
        display: flex;
        border-radius: 9999px;
        width: 24px;
        height: 24px;
        overflow: hidden;
      }
      
      span {
        display: flex;
        padding-left: 8px;
      }

      &.selected {
        background-color: #F5F7FA;
      }
      
    }
  }
  .el-aside {
    background: none;
    padding: 0;
    .el-card {
      margin-top: 15px;
    }
    .aside-forum {
      /deep/ .el-card__body {
        padding: 12px 12px;
      }
      .forum-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        img {
          display: block;
          border-radius: 9999px;
          box-sizing: border-box;
          height: 52px;
          width: 52px;
          font-size: 52px;
          line-height: 52px;
          margin-right: 8px;
        }
        a {
          color: #5a5e66;
          font-size: 20px;
        }
      }
      .forum-desc {
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 21px;
        font-weight: 400;
        color: #606266;
      }
      .forum-statics {
        display: flex;
        margin-bottom: 8px;
        .statics-box {
          flex: auto;
          border-right: 1px solid  #DCDFE6;
          padding: 8px 0 8px 12px;
          em {
            display: block;
            font-size: 16px;
            font-weight: 500;
            font-style: normal;
            line-height: 20px;
            color: #5a5e66;
          }
          span {
            display: block;
            font-size: 12px;
            font-weight: 500;
            font-style: normal;
            line-height: 16px;
            color: #5a5e66;
          }
          &:last-child {
            border: none;
          }
        }
      }
    }
    .aside-rule {
      /deep/ .el-card__body {
        padding: 12px 12px;
        p {
          display: flex;
          justify-items: center;
          padding-bottom: 5px;
          border-bottom: 1px solid #DCDFE6;
          img {
            width: 40px;
            height: 40px;
            margin-right: 8px;
          }
          span {
            font-size: 16px;
            line-height: 40px;
          }
        }
        ol {
          font-size: 12px;
          line-height: 18px;
          list-style: decimal;
          list-style-position: inside;

          li {
            border-bottom: 1px solid #DCDFE6;
            padding: 10px 6px;
            list-style: decimal;
            list-style-position: inside;
          }
        }
      }
    }
    .aside-help {
      /deep/ .el-card__body {
        padding: 12px 12px;
        .help-item {
          padding: 0 4px;
          a {
            display: block;
            color: #606266;
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
          }
        }
      }
    }
  }

  @media (max-width: 600px) {
    .section-submit-form {
      min-width: 0;
      width: 100%;
      margin-right: 0;
    }
  }

  @media (max-width: 960px) {
    .el-aside {
      display: none;
    }
    .postbox-rules {
      display: flex;
    }
  }
  
}
</style>