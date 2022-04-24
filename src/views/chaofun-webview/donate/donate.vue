<template>
  <div>
    <div  style="align-items: center; text-align:center;padding-top: 100px">

      <div v-if="fbiResult.totalFbi">
        版块 FBi 总剩余: <span>{{fbiResult.totalFbi}}</span>
      </div>
      <div v-if="fbiResult.remainFbi">
        版块 FBi 总捐赠: <span>{{fbiResult.remainFbi}}</span>
      </div>
      <div> 请输入捐献 FBi 数值</div>
      <el-input-number v-model="fbiTotal" :step=5 :min=5>
      </el-input-number>
      <div style="margin-top: 10px">
        <el-button @click="donate">
          确认
        </el-button>
      </div>
      <div>
        捐献排名：敬请期待
      </div>
    </div>

  </div>
</template>

<script>
import * as api from '@/api/api'
import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'


export default {
  name: "donate",

  data() {
    return {
      fbiResult: {},
      lists: [],
      forumId: null,
      fbiTotal: 5,
    }
  },
  mounted(){
    this.forumId = this.$route.query.forumId;
    this.init()
  },

  methods: {
    init() {
      this.getDonateFbi();
    },

    getDonateFbi() {
      api.getByPath('/api/v0/donate/getFbi', {forumId: this.forumId}).then(res => {
        this.fbiResult = res.data;
      })
    },

    donate() {
      this.$confirm(`是否确定给版块捐赠？`, "提示", {
        type: "warning",
      }).then(() => {
        api.getByPath('/api/v0/donate/donateFbi', {forumId: this.forumId, fbi: this.fbiTotal}).then(res => {
          this.fbiTotal = 5;
          this.init();
        })
      });
    }
  }
}

</script>

<style scoped>

</style>