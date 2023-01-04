<template>
  <div class="container">
    <el-dialog title="提交街景" :visible.sync="submitPanoramaShow" :append-to-body="true">
      <el-form :model="form">
        <el-form-item label="街景链接:一行一条，目前只支持百度街景">
          <el-input type="textarea" :autosize="{ minRows: 4}"
                    v-model="panoramaSubmitForm.links" autocomplete="off"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideSubmitPanorama()">取 消</el-button>
        <el-button type="primary" @click="submitPano()">确 定</el-button>
      </div>
    </el-dialog>

    <div class="back_home" >
      <el-button type="primary" @click="goHome" round>←返回首页</el-button>
      <el-button type="primary" @click="publish" round>发布</el-button>
    </div>

    <div v-if="name" class="nav">
      {{this.name}}
    </div>
    <div style="color: white">发布题库需要题库中有5个状态为已发布或者待发布状态的街景</div>
    <el-button @click="addPano" type="primary">增加街景</el-button>
    <div class="list_container">
      <div style="margin-top: 1rem; font-size: 20px; color: white">
        街景列表
      </div>
      <div v-for="(item, index) in panos" style="display: flex;justify-content: space-between">
        <div style="display: flex; color: white">
          <div>{{item.panoId}}</div>
          <div v-if="item.status === 'crawling'" class="status">准备中</div>
          <div v-if="item.status === 'publish'" class="status">已发布</div>
          <div v-if="item.status === 'crawler_success'" class="status">待发布</div>
          <div v-if="item.status === 'crawler_fail'" class="status">准备失败</div>
        </div>
<!--        <div style="color: white">删除</div>-->
      </div>
    </div>
  </div>
</template>

<script>
import {tuxunJump, tuxunOpen} from "./common";
import * as api from '@/api/api'

export default {
  name: "MapsCreate",
  data() {
    return {
      name: '',
      panos: [],
      mapsId: null,
      submitPanoramaShow: false,
      form: {
        applyModReason: '',
      },
      panoramaSubmitForm: {
        links: '',
      },
    }
  },
  mounted() {
    this.mapsId = this.$route.query.mapsId;
    this.getMapsName();
    this.getPanos();

    setInterval(() => {
      this.getPanos();
    }, 2000 );
  },
  methods: {
    goHome() {
      tuxunJump('/tuxun/');
    },
    getMapsName() {
      api.getByPath('/api/v0/tuxun/maps/get', {mapsId: this.mapsId}).then(res=>{
        this.name = res.data.name;
      })
    },
    getPanos() {
      api.getByPath('/api/v0/tuxun/maps/listPano', {mapsId: this.mapsId}).then(res=>{
        this.panos = res.data;
      })
    },
    publish() {
      api.getByPath('/api/v0/tuxun/maps/publish', {mapsId: this.mapsId}).then(res=>{
        if (res.success) {
          tuxunJump('/tuxun/my_maps');
        }
      })
    },
    addPano() {
      this.submitPanoramaShow = true;
    },
    hideSubmitPanorama() {
      this.submitPanoramaShow = false;
    },
    submitPano() {
      api.postByPath('/api/v0/tuxun/maps/userAddPanorama',
          {links: this.panoramaSubmitForm.links, mapsId: this.mapsId}).then(res=>{
        this.panoramaSubmitForm.links = '';
        this.$toast('提交成功, 谢谢你！');
        this.submitPanoramaShow = false;
        this.getPanos();
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  position: absolute;
  width: 100%;
  min-height: 120%;
  text-align: center;
  background-color: #090723;

  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
  .list_container {
    width: 60%;
    margin: 0 auto;

  }
  .status {
    padding-left: 10px;
  }
}

@media only screen and (max-width: 679px) {
  .container {
    .list_container {
      max-width: 90%;
      margin: auto;
    }
  }
}
</style>
