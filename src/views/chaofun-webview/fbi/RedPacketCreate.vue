<template>
  <div  style="align-items: center; text-align:center">
    <div v-if="!result" style="padding-top: 100px;">
      <div> 请输入 FBi 红包数值</div>
      <el-input-number v-model="fbiTotal" :step=10 :min=10>
      </el-input-number>

      <div style="padding-top: 20px" > 请输入 FBi 红包数值</div>
      <el-input-number v-model="userTotal" :step=1  :min=1>
      </el-input-number>

      <div style="padding-top: 20px" > 请输入寄语</div>
      <el-input v-model="blessing" placeholder="可选" style="padding-left: 15%; padding-right: 15%">
      </el-input>
      <el-button @click="create">
        确认
      </el-button>
    </div>
    <div v-if="result" style="padding-top: 100px;">
      {{this.password}}
      <div style="margin-top: 20px" >
        <el-button  @click="paste">
          复制口令
        </el-button>
      </div>

      <div style="margin-top: 20px" >
        <el-button @click="close">
          关闭页面
        </el-button>
      </div>

    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
import {getUserInfo} from "../../../api/api";
import { Dialog } from 'vant';
export default {
  name: "RedPacket",
  data() {
    return {
      fbiTotal: 0,
      userTotal: 0,
      blessing: '',
      creating: false,
      result: false,
      password: '',
    }
  },
  created() {
  },
  mounted() {

  },

  methods: {
    create() {
      if (this.creating) {
        this.$toast("红包创建中，请勿重复点击");
      } else {
        this.creating = true;
        Dialog.confirm({
          title: "确认创建口令红包吗",
          // message: `暂时不支持 FBi 红包退回机制`,
          messageAlign: "left",
        }).then(() => {
          api.getByPath('/api/v0/red_packet/create', {type: 'password',
            fbiTotal: this.fbiTotal, userTotal: this.userTotal, blessing: this.blessing})
              .then((res) => {
                this.creating = false;
                if (res.success) {
                  this.fbiTotal = 0;
                  this.userTotal = 0;
                  this.blessing = null;
                  if (res.data.password) {
                    this.password = res.data.password;
                    this.result = true;
                  }
                } else{
                  this.$message.error(res.errorMessage);
                }
              });
        }).catch(() => {
          this.creating = false;
          // on cancel
        });
      }
    },

    close() {
      window.opener = null;
      window.open("about:blank", "_top").close()
    },

    paste() {
      var input = document.createElement('input');
      input.setAttribute('value', this.password);
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast("复制邀请地址成功");
      return result;
    }
  }
}


</script>

<style scoped>

</style>