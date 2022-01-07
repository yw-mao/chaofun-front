<template>
  <div class="chao-item">
    <div class="chao-item-cover" @mouseenter="isCover=true" @mouseleave="isCover=false">
      <img
        :src="`${imgOrigin}${item.imageName}?x-oss-process=image/resize,w_236`"
      />
      <div class="chao-item-cover-mask" v-if="isCover">
        <div class="cover-mask-wrapper">
          <div class="cover-mask-bottom">
            <div class="cover-mask-bottom-wrapper">
              <el-button class="forum-button">{{item.forum.name}} {{item.tags && item.tags[0] && item.tags[0].name}}</el-button>
              <el-button icon="el-icon-s-promotion" circle></el-button>
              <el-button icon="el-icon-more" circle></el-button>
            </div>
          </div>
        </div>
      </div>
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
      isCover: false,
      dominantColor: '#fff',
    }
  },
  methods: {
    showCover() {
      
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
    position: relative;
    img {
      display: block;
    }
    .chao-item-cover-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      top: 0;
      left: 0;
      cursor: pointer;
      .cover-mask-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        .cover-mask-bottom {
          position: absolute;
          width: 100%;
          bottom: 10px;
          left: 0;
          padding: 0 10px;
          .cover-mask-bottom-wrapper {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .forum-button {
              flex: auto;
              border: none;
              background-color: rgba(255, 255, 255, 0.9);
              border-radius: 18px;
              height: 32px;
              max-width: 132px;
              color: #333;
              font-weight: 700;
              &:hover {
                background-color: #fff;
              }
            }
          }
        }
      }
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