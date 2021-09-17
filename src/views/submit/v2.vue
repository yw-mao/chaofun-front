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
      <el-form :model="post" ref="form">
        <div class="postbox">
          <el-radio-group v-model="type" @change="$refs.form.clearValidate()">
            <el-radio-button label="article">
              <i class="el-icon-tickets"></i> 文章
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
              <el-form-item
                prop="title"
                :rules="[
                  { required: true, message: '请输入标题', trigger: 'blur' },
                ]"
              >
                <el-input
                  type="text"
                  placeholder="请输入标题"
                  v-model="post.title"
                  maxlength="300"
                  show-word-limit
                />
              </el-form-item>
            </el-row>
            <el-row v-if="['article', 'vote'].includes(type)">
              <el-form-item
                prop="content"
                :rules="[
                  { required: true, message: '请输入内容', trigger: 'blur' },
                ]"
              >
                <editor v-model="post.content" />
              </el-form-item>
            </el-row>

            <el-row v-if="type === 'image'">
              <el-upload
                action="/api/upload_image"
                class="image-uploader"
                :data="filedata"
                :file-list="filelist"
                :before-upload="imageBeforeUpload"
                :on-progress="imageGettProgress"
                :on-remove="imageUploadRemove"
                :on-error="imageUploadError"
                :on-success="imageUploadSuccess"
                @click="imageUploadHandleClick"
                :show-file-list="false"
                v-bind:class="{
                  'drag-hover': isDrag && !drag,
                  'el-upload-free': filelist.length === 0,
                }"
                :drag="!drag"
                multiple
              >
                <div class="image-uploader-list" v-if="filelist.length > 0">
                  <div class="image-uploader-sort" @click="$event.stopPropagation()">
                    <draggable
                      class="image-uploader-sort-list"
                      ghost-class="ghost"
                      v-model="filelist"
                      @start="drag=true"
                      @end="drag=false"
                      :move="imageSorterMove"
                      draggable=".image-uploader-file"
                    >
                      <div v-for="file in filelist" :key="file.uid" class="image-uploader-file">
                        <span :style="{
                          backgroundImage: `url(${file.url})`
                        }">
                        </span>
                      </div>
                      <span class="image-uploader-btn" slot="default">
                        <i class="el-icon-plus"></i>
                      </span>
                    </draggable>
                  </div>
                </div>
                <div class="image-uploader-free" v-else>
                  将文件拖到此处，或 <el-button round>点击上传</el-button>
                </div>
              </el-upload>
            </el-row>
            <el-row v-if="type === 'link'">
              <el-form-item
                prop="link"
                :rules="[
                  { required: true, message: '请输入链接地址', trigger: 'blur' },
                  { type: 'url', message: '链接地址格式不正确', trigger: 'blur' },
                ]"
              >
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入链接地址"
                  v-model="post.link"
                  resize="none"
                  @input="getUrlTitle"
                >
                </el-input>
              </el-form-item>
            </el-row>
            
            <el-row class="vote-box" v-if="type === 'vote'">
              <div class="vote-control">
                <draggable
                  class="vote-sort-list"
                  ghost-class="ghost"
                  v-model="post.options"
                  @start="drag=true"
                  @end="drag=false"
                  handle=".el-icon-rank"
                >
                  <el-form-item
                    v-for="(option, index) in post.options"
                    :key="index"
                    :prop="`options.${index}.optionName`"
                  >
                    <el-input class="vote-option" :placeholder="`选项 ${index + 1}`" v-model="option.optionName">
                      <i class="el-icon-rank" slot="prepend" />
                      <el-button slot="suffix" type="text" icon="el-icon-delete-solid" v-if="index > 1" @click.prevent="removeOption(index)" />
                    </el-input>
                  </el-form-item>
                </draggable>
                <div class="option-control">
                  <el-button
                    round
                    @click="addOption"
                  >
                    新增选项
                  </el-button>
                  <el-form-item label="投票时长：">
                    <el-select v-model="post.voteDuration" placeholder="请选择">
                      <el-option
                        v-for="day in 7"
                        :key="day"
                        :label="`${day}天`"
                        :value="day"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="vote-tips">
                <p><i class="el-icon-warning-outline" /> <span>发起投票建议</span></p>
                <ol>
                  <li>投票选项简短明确</li>
                  <li>投票选项越多越准确</li>
                  <li>选择合适的投票时间（暂未开放）</li>
                  <li>创建投票后无法编辑投票</li>
                </ol>
              </div>
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
                  <span>匿 名</span>
                </el-checkbox>

                <el-popover
                  class="tag-selector"
                  popper-class="tag-selector-popover"
                  placement="top-start"
                  width="400"
                  trigger="click"
                  v-model="tagModalVisible"
                  v-if="tags.length > 0"
                  @hide="tagSelectorHide"
                >
                  <div class="tag-title">
                    <p v-if="tag">
                      <el-tag :color="tag.backgroundColor || '#ff9300'">
                        #{{ tag.name }}
                      </el-tag>
                      <span> [类型] </span>
                      {{post.title || '帖子标题'}}
                    </p>
                    <p v-else>
                      没有选择标签
                    </p>
                  </div>
                  <el-input
                    placeholder="搜索标签"
                    prefix-icon="el-icon-search"
                    v-model="tagSearch"
                  >
                  </el-input>
                  <el-radio-group v-model="tagId" @change="changeTag">
                    <div class="tag-option" v-for="item in tags.filter(tag => tag.name.indexOf(tagSearch) > -1)" v-bind:key="item.id">
                      <el-radio :label="item.id" >
                        <el-tag :color="item.backgroundColor || '#ff9300'">
                        #{{ item.name }}
                        </el-tag>
                      </el-radio>
                    </div>
                  </el-radio-group>
                  <div class="tag-buttons">
                    <el-button
                      :disabled="tag === null"
                      @click="confirmTag"
                      type="primary"
                      round
                    >选 择</el-button>
                    <el-button @click="clearTag" round>清除选择</el-button>
                  </div>

                  <el-button
                    slot="reference"
                    icon="el-icon-price-tag"
                    v-bind:class="{ 'tag-button-no-tag': !post.tagId }"
                    :style="{ backgroundColor: tag && tag.backgroundColor || '#ff9300', borderColor: tag && tag.backgroundColor || '#ff9300' }"
                  >{{post.tagId && tag && '#' + tag.name || '标 签'}} <i class="el-icon-arrow-down" v-if="post.tagId" /></el-button>
                </el-popover>

                 <el-popover
                  title="选择一个合集"
                  class="collection-selector"
                  popper-class="collection-selector-popover"
                  placement="top-start"
                  width="400"
                  trigger="click"
                  v-model="collectionModalVisible"
                  @hide="collectionSelectorHide"
                >
                  <div class="collection-search">
                    <el-input
                      placeholder="搜索合集"
                      prefix-icon="el-icon-search"
                      v-model="collectionSearch"
                    >
                    </el-input>
                    <el-radio-group v-model="collectionId" @change="changeCollection">
                      <div class="collection-option" v-for="item in collections.filter(collection => collection.name.indexOf(collectionSearch) > -1)" v-bind:key="item.id">
                        <el-radio :label="item.id" >
                          {{ item.name }}
                        </el-radio>
                      </div>
                    </el-radio-group>
                  </div>

                  <el-form class="collection-add" label-position="top">
                    <el-form-item label="新增合集">
                      <p>允许文字和Emoj表情</p>
                      <el-input v-model="newCollection.name">
                        <el-button type="primary" @click="onAddCollection" slot="append">新增</el-button>
                      </el-input>
                    </el-form-item>
                  </el-form>

                  <div class="collection-buttons">
                    <el-button
                      :disabled="collection === null"
                      @click="confirmCollection"
                      type="primary"
                      round
                    >选 择</el-button>
                    <el-button @click="clearCollection" round>清除选择</el-button>
                  </div>
  
                  <el-button
                    slot="reference"
                    icon="el-icon-collection"
                    v-bind:class="{ 'collection-button-no-collection': !post.collectionId }"
                  >{{post.collectionId && collection && collection.name || '合 集'}} <i class="el-icon-arrow-down" v-if="post.collectionId" /></el-button>
                </el-popover>
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
      </el-form>
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
  import draggable from 'vuedraggable'
  import Editor from '@/components/Editor/Tiptap.vue'
  import { getForumInfo, searchForum, getlistTag, getUrlTitle, userCollectionList, addCollection } from '@/api/api'
  import { logo } from '@/settings'

  export default {
    name: 'submitV2',
    components: {
      Editor,
      draggable,
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
          options: [
            {
              optionName: '',
            },
            {
              optionName: '',
            },
          ],
          voteDuration: 3,
          anonymity: false,
          tagId: null,
          collectionId: null,
        },
        forums: [],
        filelist: [],
        loading: false,
        drafts: 0, // 草稿箱数量
        drag: false,
        isDrag: false,
        filedata: {}, // 文件参数
        tags: [], // Tag 列表
        tag: null, // 选中Tag
        tagId: null, // 预选Tag
        tagSearch: '', // Tag 搜索
        tagModalVisible: false, // Tag Modal是否显示
        collections: [], // 用户合集
        collectionSearch: '', // 合集搜索
        collectionId: null, // 合集ID
        collection: null, // 合集当前选中
        newCollection: {
          name: null,
        }, // 新增合集
      }
    },
    mounted() {
      // 加载论坛板块信息
      this.getForum().then(() => {
        this.getForumCategories();
        this.getForumTag();
      });

      // 加载用户合集
      this.getCollection();

      // 拖拽更改Hover样式
      document.addEventListener('dragover', () => {
        if (this.type === 'image') {
          this.isDrag = true;
        }
      });
      document.addEventListener('dragleave', () => {
        if (this.type === 'image') {
          this.isDrag = false;
        }
      });
    },
    beforeDestroy() {
    },
    watch: {
      filelist: (fl) => {
        console.log(fl);
      }
    },
    methods: {
      forumSelectOnChange(forumId) {
        this.getForum();
        this.getForumTag();
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
      // === Tag ===
      // 获取论坛Tag
      async getForumTag() {
        const result = await getlistTag({ forumId: this.forum.id });
        this.tags = result.data;
      },
      // 修改Tag
      changeTag(label) {
        this.tag = this.tags.find(tag => tag.id === label);
      },
      // 清除Tag
      clearTag() {
        this.tag = null;
        this.tagId = null;
        this.post.tagId = null;
        this.tagSearch = '';
      },
      // 确认Tag
      confirmTag() {
        this.tagModalVisible = false;
        this.post.tagId = this.tagId;
        this.tagSearch = '';
      },
      // 关闭事件
      tagSelectorHide() {
        if (this.tagId && this.post.tagId !== this.tagId) {
          this.tagId = null;
          this.tag = null;
          this.tagSearch = '';
        }
      },
      // === Collection ===
      // 获取Collection
      async getCollection() {
        const result = await userCollectionList();
        this.collections = result.data;
      },
      // 修改Collection
      changeCollection(label) {
        this.collection = this.collections.find(collection => collection.id === label);
      },
      // 清除Collection
      clearCollection() {
        this.collection = null;
        this.collectionId = null;
        this.post.collectionId = null;
        this.collectionSearch = '';
          this.newCollection.name = '';
      },
      // 确认Collection
      confirmCollection() {
        this.collectionModalVisible = false;
        this.post.collectionId = this.collectionId;
        this.collectionSearch = '';
          this.newCollection.name = '';
      },
      // 关闭事件
      collectionSelectorHide() {
        if (this.collectionId && this.post.collectionId !== this.collectionId) {
          this.collectionId = null;
          this.collection = null;
          this.collectionSearch = '';
          this.newCollection.name = '';
        }
      },
      // 新增合集
      async onAddCollection() {
        const result = await addCollection(this.newCollection);
        if (result.success && result.data) {
          this.collections.push(result.data);
          this.newCollection.name = '';
          return;
        }

        // TODO: 提示新增错误
      },

      // === 图片/视频 上传组件==
      // 上传之前
      imageBeforeUpload(file) {
        this.isDrag = false; // 关闭drag效果
        this.filedata.fileName = file.name
        this.filelist.push({
          uid: file.uid,
          name: file.name,
          url: window.URL.createObjectURL(file),
        });
        return true
      },
      // 上传进度更新
      imageGettProgress(event, file, fileList) {
        console.log(file, fileList, this.filelist);
      },
      // 删除图片
      imageUploadRemove(file) {
        // 去除图片
        this.filelist = this.filelist.filter(f => f.uid === file.uid);
      },
       // 上传成功处理
      imageUploadSuccess(response, file) {
        if (response.success && response.data) {
          this.filedata = {}
          this.filelist.find(f => f.uid === file.uid).url = this.imgOrigin + response.data;
        }
      },
      // 上传失败
      imageUploadError(file) {
        // 去除图片
        this.filelist = this.filelist.filter(f => f.uid === file.uid);
      },
      // imageSorterDragStart(e) {
      //   this.isDrag = false;
      //   e.preventDefault();
      // },
      // imageSorterDragStop(e) {
      //   this.isDrag = false;
      //   e.preventDefault();
      // },
      imageSorterMove() {
        console.log(222)
        this.isDrag = false;
        return true;
      },
      imageUploadHandleClick() {
        console.lo(3);
      },
      // === 链接相关 ===
      // 通过URL获取链接标题
      async getUrlTitle() {
        if (this.post.title !== '') {
          return;
        }
        const result = await getUrlTitle({'url': this.post.link});
        if (result && result.data) {
          this.post.title = result.data;
        }
      },
      // === 投票相关 ===
      // 新增选项
      addOption() {
        this.post.options.push({
          optionName: '',
        });
      },
      // 移除选项
      removeOption(index) {
        if (index !== -1) {
          this.post.options.splice(index, 1);
        }
      },
    }
  }
</script>

<style type='text/scss' lang='scss' scoped>
.section-submit {
  max-width: 1248px;
  padding: 60px 55px;
  margin: 0 auto;
  
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
            background-color: rgba(0, 121, 211, 0.05);

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
    .el-row {
      margin: 0;
    }
    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;
      margin-bottom: 20px;
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
      margin-right: 4px;
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


    /deep/ .collection-selector {
      .el-button {
        position: relative;
        padding: 4px 16px;
        border: 1px solid;
        border-radius: 9999px;
        background: #16679f;
        border-color: #16679f;
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        min-height: 32px;
        height: auto;
        min-width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        i {
          font-size: 20px;
          font-weight: 400;
          height: 20px;
          line-height: 20px;
          margin-right: 8px;
        }
        span {
          margin: 0;
          line-height: 20px;

          i {
            font-size: 16px;
            margin-left: 6px;
          }
        }
        &.collection-button-no-collection {
          background: transparent !important;
          color: #606266 !important;
          border-color: #606266 !important;
        }
      }
    }

    /deep/ .tag-selector {
      display: flex;
      margin-right: 4px;

      .el-button {
        position: relative;
        padding: 4px 16px;
        border: 1px solid;
        border-radius: 9999px;
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        min-height: 32px;
        height: auto;
        min-width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        i {
          font-size: 20px;
          font-weight: 400;
          height: 20px;
          line-height: 20px;
          margin-right: 8px;
        }
        span {
          margin: 0;
          line-height: 20px;

          i {
            font-size: 16px;
            margin-left: 6px;
          }
        }
        &.tag-button-no-tag {
          background: transparent !important;
          color: #606266 !important;
          border-color: #606266 !important;
        }
      }
    }
    .el-divider {
      margin: 0;
    }
    .image-uploader {
      padding: 12px;
      border: 1px dashed #DCDFE6;
      border-radius: 4px;
      box-sizing: border-box;
      /deep/ .el-upload {
        display: flex;
        width: auto;
        height: auto;
        line-height: inherit;
       
        .el-upload-dragger {
          width: 100%;
          height: auto;
          border: none;
          .el-upload__text {
            line-height: 36px;
          }
        }
        .image-uploader-list {
          display: flex;
          flex-flow: row wrap;
          width: 100%;
          box-sizing: border-box;
          .image-uploader-sort {
            display: inline-flex;
            overflow-x: auto;
            width: 100%;
          }
        }
      }
      &.drag-hover {
         /deep/ .el-upload {
           border-color: #fc471e;
         }
         /deep/ .el-upload-list--picture-card {
           z-index: 0;
         }
      }
      &.el-upload-free {
        /deep/ .el-upload {
          min-height: 280px;
          display: flex;
          justify-content: center;
          flex-flow: column nowrap;
          flex-grow: 1;
          text-align: center;
          .image-uploader-free {
            font-size: 16px;
          }
        }
      }
      .image-uploader-sort-list {
        display: inline-flex;
        width: 100%;
        .image-uploader-file {
          margin: 0 12px 12px 0;
          padding: 0;
          position: relative;
          align-items: center;
          border-radius: 4px;
          border: 2px solid #5a5e66;
          box-sizing: border-box;
          display: flex;
          height: 150px;
          width: 150px;
          justify-content: center;
          span {
            background-position: 50%;
            background-size: cover;
            border-radius: 4px;
            display: block;
            width: 134px;
            height: 134px;
            margin: 6px;
            opacity: 1;
            outline: none;
          }
        }
        .ghost {
          opacity: 0.5;
        }
      }
      .image-uploader-btn {
        .el-icon-plus {
          align-items: center;
          border: 1px dashed #606266;
          border-radius: 4px;
          display: flex;
          width: 150px;
          height: 150px;
          justify-content: center;
          font-size: 40px;
          color: #606266;
          &:hover {
            color: #5a5e66;
          }
        }
      }
    }
    // 投票样式
    .vote-box {
      display: flex;
      flex-direction: row;
      border: 1px solid #DCDFE6;
      margin: -23px 0 22px;
      padding: 8px 0;
      .vote-control {
        flex-grow: 1;
        width: 100%;
        .vote-sort-list {
          /deep/ .el-form-item {
            margin-bottom: 0;
          }
        }
        .vote-option {
          display: flex;
          align-items: center;
          flex-direction: row;
          padding: 4px 0 4px 4px;
          position: relative;
          transition: opacity .2s,left .2s;

          /deep/ .el-form-item__error {
            display: none;
          }

          /deep/ .el-input-group__prepend {
            display: flex;
            fill: #5a5e66;
            height: 20px;
            width: 20px;
            font-size: 20px;
            margin-right: 4px;
            padding: 0;
            background: transparent;
            border: none;
            i {
              cursor: pointer;
            }
          }
          /deep/ .el-input__suffix {
            i {
              font-size: 20px;
              color: #606266;
            }
          }
        }
        .option-control {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          padding-right: 20px;
          flex-direction: row;
          .el-button {
            margin-left: 26px;
            align-items: center;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            position: relative;
            text-align: center;
            width: auto;
            line-height: 20px;
            padding: 4px 16px;
            border: none;
            color: #16679f;
            font-weight: bold;
          }
          /deep/ .el-form-item {
            display: flex;
            align-items: center;
            -ms-flex-direction: row;
            flex-direction: row;
            justify-content: center;
            margin: 0;
            label {
              font-weight: normal;
              line-height: 20px;
            }
            .el-form-item__content {
              line-height: 20px;
            }
            .el-select {
              position: relative;
              width: 60px;
              font-size: 12px;
              line-height: 20px;
              .el-input {
                .el-input__icon {
                  line-height: 20px;
                }
                input {
                  align-items: center;
                  display: flex;
                  flex-direction: row;
                  border: none;
                  padding: 0 30px 0 0;
                  color: #16679f;
                  height: 20px;
                  line-height: 20px;
                }
              }
            }
          }
        }
      }
      .vote-tips {
        flex-grow: 0;
        flex-shrink: 0;
        padding: 4px 0 4px 8px;
        width: 250px;
        p {
          margin-left: 5px;
          padding-bottom: 6px;
          font-size: 13px;
          display: flex;
          align-content: center;
          flex-direction: row;
          flex-grow: 0;
          i {
            font-size: 16px;
            padding: 2px;
            font-weight: 600;
          }
          span {
            line-height: 22px;
            padding-left: 4px;
          }
        }
        ol {
          padding: 0 24px;
          li {
            list-style: decimal outside;
            font-size: 11px;
            font-weight: 500;
            line-height: 15px;
            margin-bottom: 5px;
            padding-left: 6px;
          }
        }
      }
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
}

@media (max-width: 992px) {
  .section-submit {
    padding: 60px 24px;
    .el-aside {
      display: none;
    }
    .postbox-rules {
      display: flex;
    }
  }
}


.tag-selector-popover {
  .tag-title {
    display: flex;
    text-align: center;
    padding: 22px 16px 22px;
    p {
      line-height: 24px;
      font-size: 16px;
    }
    span {
      font-size: 16px;
      color: #888;
      font-weight: 400;
      &.el-tag {
        font-size: 13px;
        color: #fff;
      }
    }
  }
  .el-input {
    padding: 0 16px;
    margin-bottom: 16px;
    /deep/ .el-input__prefix {
      left: 21px;
    }
  }
  .el-radio-group {
    height: 300px;
    /deep/ .el-radio__input {
      &.is-checked .el-radio__inner {
        border-color: #16679f;
        background: #16679f;
      }
      .el-radio__inner:hover {
        border-color: #16679f;
      }
    }
  }
  .tag-option {
    cursor: pointer;
    line-height: 16px;
    padding: 4px 16px;
  }
  .el-tag {
    display: inline-block;
    vertical-align: middle;
    padding: 2px 6px;
    background: #ff9300;
    border-radius: 4px;
    font-size: 13px;
    color: #fff;
    border: none;
    height: 22px;
    line-height: 18px;
  }
  .tag-buttons {
    background: #edeff1;
    border: none;
    display: flex;
    flex-direction: row-reverse;
    padding: 16px;
    button {
      margin: 0 0 0 8px;
      &.el-button--primary {
        background: #16679f;
        border-color: #16679f;
      }
      &.is-disabled {
        background: #788898;
        border-color: #788898;
      }
    }
  }
}


</style>

<style lang="scss">
.tag-selector-popover {
  padding: 0px;
  .popper__arrow::after {
    border-top-color: #edeff1 !important;
  }
}

.collection-selector-popover {
  padding: 0;
  .el-popover__title {
    padding: 16px;
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    border-bottom: 1px solid #edeff1;
  }
  .collection-search {
    height: 250px;
    background: #f6f7f8;
    padding: 16px 0;
    .el-input {
      padding: 0 16px 16px;
      .el-input__prefix {
        height: 36px;
        left: 21px;
      }
    }
    .el-radio-group {
      .el-radio__input {
        &.is-checked .el-radio__inner {
          border-color: #16679f;
          background: #16679f;
        }
        &.is-checked + .el-radio__label {
          color: #16679f;
        }
        .el-radio__inner:hover {
          border-color: #16679f;
        }
      }
    }
    .collection-option {
      cursor: pointer;
      line-height: 16px;
      padding: 4px 16px;
      display: flex;
      flex-direction: row;
    }
  }
  
  .collection-add {
    background: #fff;
    padding: 16px;
    .el-form-item {
      margin: 0;
      .el-form-item__label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .5px;
        line-height: 12px;
        color: #606266;
        margin-bottom: 8px;
        padding: 0;
      }
      .el-form-item__content {
        line-height: 1;
        p {
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          color: #5a5e66;
          margin-bottom: 8px;
          text-align: left;
        }
        .el-input {
          border: 1px solid #edeff1;
          background-color: #f6f7f8;
          border-radius: 4px;
          color: #5a5e66;
        }
      }
      
    }
  }
  .collection-buttons {
    background: #edeff1;
    border: none;
    display: flex;
    flex-direction: row-reverse;
    padding: 16px;
    button {
      margin: 0 0 0 8px;
      &.el-button--primary {
        background: #16679f;
        border-color: #16679f;
      }
      &.is-disabled {
        background: #788898;
        border-color: #788898;
      }
    }
  }
  .popper__arrow::after {
    border-top-color: #edeff1 !important;
  }
}
</style>