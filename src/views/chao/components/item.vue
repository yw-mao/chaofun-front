<template>
  <div class="chao-item">
    <div class="chao-item-cover">
      <img
        :src="`${imgOrigin}${item.imageName}?x-oss-process=image/resize,w_236`"
      />
    </div>
    <div class="author">
      <router-link to="/setting">
        <span>
          <img :src="`${imgOrigin}${item.userInfo.icon}?x-oss-process=image/resize,h_80`" alt="">
        </span>
        <div class="username">
          {{item.userInfo.userName}}
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
import 'lazysizes';

export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      dominantColor: '#fff',
    }
  },
}
</script>

<style lang="scss" scoped>
.chao-item {
  padding: 0 8px 16px;
  .chao-item-cover {
    line-height: 1;
    border-radius: 16px;
    overflow: hidden;
    img {
      display: block;
    }
  }
  .author {
    padding: 8px 6px 0;
    a {
      display: flex;
      flex-direction: row;
      line-height: 32px;
      color: #111;
      margin: 0 -3px;

      span {
        display: block;
        margin: 0 3px;
        background: #f4f4f4;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        overflow: hidden;
        line-height: 32px;
        img {
          display: block;
          color: transparent;
          mix-blend-mode: multiply;
          width: 100%;
         height: 100%;
        }
      }
      .username {
        margin: 0 3px;
        flex: 1 1 auto;
      }
    }
  }
}
</style>