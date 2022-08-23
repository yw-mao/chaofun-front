<template>
  <div class="emojo_sender">
    <div class="button">
      <el-button type="cancel" @click="hide">
        取消发送
      </el-button>
    </div>
    <div class="grid_main">
      <div class="emoji" @click="sendEmoji(1)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1661240816771_9294c24d09a54fa7a1b7a78ed916c2d0_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(2)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1661240968662_ee71c8fec5d044ea8cf57e132fd59870_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(3)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1661241006131_d167b290ea7a41f08fde4e2e245867d9_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(4)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1661241073922_7db4f7ad01064d34a3f92dbe17aa3794_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(5)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1661241147821_fa972d38997f418ea4fa2a06e777df21_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(6)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1661241207098_3a3599b8dbb74a9e9fff6e76a9e6af4c_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(7)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1661241246316_d3e72340c9474994a3d7ef51fc7675ee_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'

export default {
  name: "EmojiSender",
  props: {
    gameId: String,
  },
  methods: {
    hide() {
      this.$emit('hide');
    },
    sendEmoji(emojiId) {
      this.hide()
      api.getByPath('/api/v0/tuxun/solo/sendEmoji', {gameId: this.gameId, emojiId: emojiId}).then(res=>{
        if (res.success) {
          this.$toast('发送成功');
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.emojo_sender {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  justify-content: center;
  align-items: center;
  align-content: center;
  justify-content: center;
  text-align: center;
  .button {
    padding-top: 2.5rem;
    padding-bottom: 2rem ;
  }
  .grid_main {
    margin: auto;
    width: 50%;
    display: grid;
    grid-row-gap: 2rem;
    grid-column-gap: 1rem;
    grid-template-columns: repeat(4, 1fr);
    .emoji {
      margin: auto;
      width: 66px;
      height: 66px;
      justify-content: center;
      align-items: center;
      align-content: center;
      justify-content: center;
      text-align: center;
      .emoji_img {
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
    }
  }
}

@media only screen and (max-width: 679px) {
  .emojo_sender {
    .grid_main {
      width: 100%;
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

</style>
