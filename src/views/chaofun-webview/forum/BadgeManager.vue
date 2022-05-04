<template>
  <div >
    <div v-if="this.displayAdd" class="ycovers ">
      <div class="ycontainer">
        <div style="">
          <div style="margin:10px 0px;display: flex; align-items: center">
            <div style="align-content: center">徽章名称：</div>
          </div>
          <div style="margin:10px 0px;display: flex; align-items: center">
            <input style="width: 100%" v-model="name"  placeholder=""/>
          </div>

          <div class="title">设置徽章ICON</div>
          <div>
            <img v-if="imageName" @click="uploadImage" :src="imgOrigin + imageName" class="avatar">
            <el-button v-if="!imageName" @click="uploadImage">上传</el-button>
          </div>

          <div style="margin:10px 0px; align-items: center">
            <div style="align-content: center">徽章描述：</div>
          </div>

          <textarea class="text" v-model="desc" style="background: #f9f9f9;width: 260px;" placeholder="请输入徽章描述/获得条件"/>

          <div style="margin:10px 0px; align-items: center">
            <div style="align-content: center">FBi 奖励：</div>
          </div>
          <div style="">
            <el-input-number v-model="fbi" :min=5 :step=5 />
          </div>

          <div style="margin:20px 0px;display: flex;">
            <el-button @click="toAdd" type="success">确认</el-button>
            <el-button @click="cancelAdd" type="success">取消</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div @click="add" class="btns">添加徽章</div>
    </div>
    <div v-for="(item,index) in lists" :key="index" class="item">
      <div>
        <div > 徽章名字：{{item.name}} </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
import {forumRemoveRule} from "../../../api/api";

export default {
  name: "tag",
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      imageName: '',
      displayAdd: false,
      params: {},
      forumId: '',
      lists:[],
      name: '',
      desc: '',
      checkWord: '',
      responseText: '',
      containType: 'equal',
      orderNumber: 0,
      fbi: 5,
      modInfo: {
        money: 0.0,
        past24HPosts: 0,
        past24HVotes: 0,
        rank: 0
      }
    }
  },
  props: {
    forumId0: {
      type: String,
      default() {
        return null;
      }
    }
  },
  mounted() {
    try{
      let self = this;
      window.setUploadImage = function (message) {
        self.$toast('ICON 上传成功');
        self.imageName = message;
      }
    }catch{

    }
  },
  created() {
    if (this.forumId0) {
      this.forumId = this.forumId0;
    } else {
      this.forumId = this.$route.query.forumId;
    }
    this.getForumBadges();
  },

  methods: {
    toAdd() {
      api.getByPath('/api/v0/badge/create', {forumId: this.forumId, name: this.name, desc: this.desc, icon: this.imageName, integral: this.fbi}).then((res) => {
        if (res.success) {
          this.$toast('添加成功')
          this.displayAdd = false;
          this.getForumBadges();
        } else {
          this.$toast(res.errorMessage)
        }
      })
    },
    cancelAdd() {
      this.displayAdd = false;
    },
    add() {
      this.displayAdd = true;
    },
    toModify() {
      this.$toast('暂不支持');
    },

    uploadImage(){
      window.flutter_inappwebview.callHandler('uploadImage').then(function(result) {
      });
    },
    getForumBadges() {
      api.getByPath('/api/v0/badge/listForumBadges', { forumId: this.forumId }).then((res) => {
        this.lists = res.data;
        // this.load()
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.ycovers {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-around;

  .ycontainer {
    background: #fff;
    width: 400px;
    max-width: 90%;
    // height: 350px;
    box-sizing: border-box;
    padding: 30px;
    border-radius: 10px;
    position: relative;
    min-height: 200px;
  }
}
.item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f1f1f1;
  overflow: hidden;
}
.bottom{
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
input{
  height: 44px;
  outline: none;
  border: 1px solid #ededed;
  background: #f9f9f9;
  font-size: 15px;
  padding-left: 10px;
  border-radius: 8px;
}
</style>
<style lang="scss">
.el-message-box{
  width: 90vw;
  max-width: 400px;
}
.avatar {
  margin-bottom: 30px;
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 50%;
}
</style>