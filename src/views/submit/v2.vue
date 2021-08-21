<template>
  <div class="section-submit">
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
          <editor v-model="content" />
        </el-row>
      </div>
      
    </div>
    
  </div>

</template>

<script>
  import Vue from 'vue';
  import Editor from '@/components/Editor/Tiptap.vue'

  export default {
    name: 'submitV2',
    components: {
      Editor,
    },
    data() {
      return {
        type: 'article',
        post: {
          forumId: '',
          title: '',
          link: '',
          content: '',
        },
      }
    },
    mounted() {
    },
    beforeDestroy() {
    },
  }
</script>

<style type='text/scss' lang='scss' scoped>
.section-submit {
  padding: 60px 20px;
  .postbox {
    width: 100%;
    background: #FFF;
    border-radius: 10px;
    padding-bottom: 20px;

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
          i {
            font-size: 20px;
            font-weight: 400;
            height: 20px;
            line-height: 20px;
            margin-right: 8px;
          }
        }

        &:last-child {
          /deep/ .el-radio-button__inner {
            border-width: 0 0 1px 0;
          }
        }

        &.is-active {
          /deep/ .el-radio-button__inner {
            color: #4078c0;

            &::after {
              content: " ";
              box-sizing: border-box;
              background-color: #4078c0;
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
  }
}
</style>