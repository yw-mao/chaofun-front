<template>
  <div class="container">
    <div class="back_home" @click="goHome">
      <el-button round>←返回小测验首页</el-button>
    </div>
    <div style="text-align: center; width: 100%; font-size: 24px;font-weight: bold; padding-top: 3rem; padding-bottom: 2rem">
      创建测验
      <div  style="font-size: 12px;font-weight: normal">创建后如有改动暂时可以联系站长修改</div>
    </div>
    <div class="input-container">
      <div>
        标题:
      </div>
      <el-input v-model="name"></el-input>
      <div>
        描述:
      </div>
      <el-input v-model="desc"></el-input>
      <div>
        答案(一行一个): {{answers.split("\n").length }} 个
      </div>

      <el-input v-model="answers" type="textarea"
                :autosize="{ minRows: 10, maxRows: 10}"
      ></el-input>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>

  </div>
</template>

<script>
import * as api from '../../api/api'

export default {
  name: "Create",
  data() {
    return {
      name: '',
      desc: '',
      answers: ''
    }
  },
  mounted() {

  },
  methods: {
    submit() {
      if (this.name === '') {
        this.$toast('测验名称不能为空');
        return;
      }

      if (this.desc === '') {
        this.$toast('测验描述不能为空')
        return;
      }

      if (this.answers === '') {
        this.$toast('测验的答案不能为空')
        return;
      }

      api.postByPath('/api/v0/scratch/game/create', {name: this.name, desc: this.desc, cover: 'biz/1667921710402_beb8f2eaccb1482d87deb7816fd3baef_0.jpeg', data: JSON.stringify({"answers": this.answers.split("\n")})}).then((res) => {
        window.location.href = '/scratch/guess?id=' + res.data.id;
      })
    },
    goHome() {
      window.location.href = '/scratch/home';
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
  .input-container {
    width: 40%;
    margin: auto;
  }
}

@media only screen and (max-width: 679px) {
  .container {
    .input-container {
      width: 90%;
    }
  }
}
</style>
