<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <div class="container">
        <div class="title">设置板块 ICON</div>
        <div>
            <!-- <el-upload
            class="avatar-uploader"
            action="/api/upload_image"
            name="file"
            :data="filedata"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="forumInfo.imageName" :src="imgOrigin + forumInfo.imageName" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload> -->
            <img v-if="forumInfo.imageName" @click="uploadImage" :src="imgOrigin + forumInfo.imageName" class="avatar">
        </div>
      <div class="title">设置板块描述</div>
      <div style="max-width:600px;margin-top:10px;">
          <el-input type="textarea" maxlength="56" v-model="desc" style="resize:none;height:64px !important;overflow:hidden;margin-bottom:20px;" placeholder="请设置板块介绍"></el-input>
        </div>
      <div class="title">累计版主激励: {{modInfo.money}} 元 </div>
      <div class="tips" style="margin-top:0;line-height:24px;margin-bottom: 10px" slot="tip">(按照每日板块活跃度分配，每日3点过5分更新，请加微信: wwwchaofun 提取, 多版主板块请协商提取)</div>
      <div class="tips">24小时帖子数: {{modInfo.past24HPosts}} </div>
      <div class="tips">24小时帖子获赞数(不包括楼主自己的赞): {{modInfo.past24HVotes}} </div>
      <div class="tips">24小时全站板块综合排名: {{modInfo.rank}} </div>

      <div class="fixed_bottom">
          <div @click="toSave" class="btns">保存</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as api from '@/api/api'

import ListItem from '@/components/chaofan/ListItem.vue'
import RightCom from '@/components/chaofan/RightCom'
import loadText from '@/components/chaofan/loadText'

export default {
  name: 'user',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      params: {
        forumId: '',
      },
      forumId: '',
      imageUrl: '',
      filedata: {},
      desc: '',
      forumInfo: '',
      modInfo: ''
    }
  },
  components: {
    ListItem,loadText
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'roles',
      'islogin'
    ])
  },
  mounted(){
     try{
          let self = this;
        window.setUploadImage = function (message) {
          self.$toast('ICON更新成功，点击保存生效');
          self.forumInfo.imageName = message;
        }
      }catch{

      }
    if(document.body.clientWidth<700){
      this.isPhone = true
    }
    this.toPosition()
  },
  created() {


    this.forumId = this.$route.query.forumId;
    this.getForumInfo();
    
  },

  methods:{
    toSave(){
        this.toSign();
    },
    uploadImage(){

      window.flutter_inappwebview.callHandler('uploadImage').then(function(result) {

      });

    },
    getForumInfo() {

      api.getForumInfo({forumId: this.forumId}).then(res => {
        this.forumInfo = res.data;
        this.desc = this.forumInfo.desc;
      })

      api.getModInfo({forumId: this.forumId}).then(res => {
        this.modInfo = res.data;
      })
    },

    toSign(){
      api.setForumDesc({forumId: this.forumId, desc: this.desc}).then(res=>{
        api.setForumIcon({forumId: this.forumId, imageName: this.forumInfo.imageName}).then(res=>{
            this.$toast('保存成功');
        })
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 178px;
    text-align: center;
    
  }
  .avatar {
    margin-bottom: 30px;
    width: 100px;
    height: 100px;
    display: block;
    border-radius: 50%;
  }
  /deep/ .el-upload{
      border: 1px dashed #999;
      border-radius: 10px;
  }
  .container{
      padding: 20px;
      padding-bottom: 100px;
      background: #fff;
      .title{
          font-size: 16px;
          margin-bottom: 8px;
          margin-top: 14px;
      }
      .tips{
          font-size: 14px;
          color: #666;
          margin-bottom: 2px;
      }
  }
  .fixed_bottom{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 4px 10px 10px;
      .btns{
          width: 80%;
          margin: 0 auto;
          line-height: 44px;
          background: #FF9300;
          color: #fff;
          border-radius: 30px;
          text-align: center;
          font-size: 16px;
      }
  }
</style>
