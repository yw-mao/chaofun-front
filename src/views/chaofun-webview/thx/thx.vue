<template>
  <div>
  <div>感谢以下给炒饭做过贡献的饭友</div>
  <div @click="toUser(53906)">感谢 @猫 在导航栏样式、发帖，评论&工程结构上做的优化</div>
  <div @click="toUser(56018)">感谢 @阿鲤 在图片处理，水印处理上做的贡献</div>
  </div>
</template>

<script>
  export default {
    name: "thx",
    methods: {
      toUser(userId){
        try {
          window.flutter_inappwebview.callHandler('toAppUser',{userId: userId+''})
        } catch (e) {
          window.open(location.origin + '/user/'+userId,"_blank");
        }
      }
    }
  }
</script>

<style scoped>

</style>