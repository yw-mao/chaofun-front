<template>
  <div class="chao-search-wrapper">
    <el-input
      prefix-icon="el-icon-search"
      placeholder="搜索"
      class="chao-search-input"
    >
      <div class="chao-search-form" slot="append">
        <em></em>
        <el-select
          v-model="forum.id"
          filterable
          remote
          reserve-keyword
          placeholder="全站"
          class="form-select"
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
    </el-input>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb';
import {
  getForumInfo,
  searchForum,
} from '@/api/api'

export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      forum: {
        name: '',
        id:  this.$route.params.forumId,
      },
      forums: [],
      loading: false,
    }
  },
  mounted() {
    // 加载论坛板块信息
    this.getForumCategories();
  },
  methods: {
    async forumSelectOnChange(forumId) {
      await this.getForum();
      // 静态替换路由
      // history.pushState(
      //   {},
      //   null,
      //   `/f/${forumId}/submit`
      // )
    },
    async getForum() {
      if (this.forum.id) {
        const result = await getForumInfo({ forumId: this.forum.id });
        this.forum.name = result.data.name;
        this.forum.imageName = result.data.imageName;
        this.forum.followers = result.data.followers;
        this.forum.posts = result.data.posts;
        this.forum.desc = result.data.desc;
      }
    },
    async getForumCategories(keyword = '') {
      const result = await searchForum({ keyword });
      this.forums = result.data;
      // 如果没找对应板块，那么插入默认
      if (this.forum.id && !this.forums.find(forum => forum.forumId === this.forum.id)) {
        this.forums.push({
          forumId: this.forum.id,
          icon: this.forum.imageName,
          title: this.forum.name,
        });
      }
    },
    toSearch() {
    },
  }
}
</script>
<style lang="scss" scoped>
.chao-search-wrapper {
  padding: 0 8px;
}
.chao-search-input {
  border-radius: 18px;
  background-color: #efefef;

  /deep/ input {
    border: none;
    background: transparent;
    font-size: 16px;
    font-weight: normal;
    color: rgb(51, 51, 51);

    &::-webkit-input-placeholder {
      color: #767676;
      font-size: 16px;
    }
  }
  /deep/ .el-input__prefix {
    i {
      color: #767676;
      font-weight: 700;
    }
  }
  
  /deep/ .el-input-group__append {
    border: none;
    background: none;
    padding: 0;
    box-sizing: border-box;
    .chao-search-form {
      width: 125px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    em {
      // display: inline-block;
      background: rgb(216, 216, 216);
      border-radius: 1px;
      height: 26px;
      width: 2px;
    }
    .form-select {
      position: relative;
      margin: 0;
      .el-input {
        padding: 0 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        input {
          border: none;
          background: none;
          padding: 0;
          text-align: center;
        }
      }
      .el-input__suffix {
        position: static;
      }
      .el-select__caret {
        font-size: 12px;
        color: #606266;
        font-weight: 700;
        &:before {
          content: "\e6e1";
        }
      }
      .el-input.is-focus {
        .el-select__caret {
          transform: rotate(
            0deg
          );
        }
      }
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
}
</style>