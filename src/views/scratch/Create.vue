<template>
  <div class="container">
    <div class="back_home">
      <el-button @click="goHome" round>←返回小测验首页</el-button>
      <el-button v-if="modify" @click="deleteGame" round>删除测验</el-button>
    </div>
    <div style="text-align: center; width: 100%; font-size: 24px;font-weight: bold; padding-top: 3rem; padding-bottom: 2rem">
      <div v-if="!modify">创建测验</div>
      <div v-else>修改测验</div>
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
        限时（秒）：
      </div>
      <el-input-number :min=5 v-model="countdown"></el-input-number>
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
      answers: '',
      modify: false,
      countdown: 120,
      id: null
    }
  },
  mounted() {
    this.id =  this.$route.query.id;
    if (this.id && this.id !== '') {
      this.modify = true;
      this.getGuess();
    }
  },
  methods: {
    getGuess() {
      api.getByPath('/api/v0/scratch/game/get', {'id': this.id}).then(res=>{
        this.name = res.data.name;
        this.desc = res.data.desc;
        this.coundown = res.data.countdown;
        this.answers = res.data.data.answers.join("\n");
      })
    },
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

      api.postByPath('/api/v0/scratch/game/create', {id: this.id, countdown: this.countdown, name: this.name, desc: this.desc, cover: 'biz/1667921710402_beb8f2eaccb1482d87deb7816fd3baef_0.jpeg', data: JSON.stringify({"answers": this.answers.split("\n")})}).then((res) => {
        window.location.href = '/scratch/guess?id=' + res.data.id;
      })
    },
    goHome() {
      window.location.href = '/scratch/home';
    },
    deleteGame() {
      this.$confirm(`是否确定删除该小测验？`, "提示", {
        type: "warning",
        // position: center,
      }).then(() => {
        api.getByPath('/api/v0/scratch/game/delete', {'id': this.id}).then(res=>{
          if (res.success) {
            window.location.href = '/scratch/home';
          }
        })
      })

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
