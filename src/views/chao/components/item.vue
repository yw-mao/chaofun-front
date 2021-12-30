<template>
  <div class="chao-item">
    <div class="chao-item-cover">
      <img
        :src="`${imgOrigin}${item.imageName}?x-oss-process=image/resize,w_236`"
      />
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
  }
}
</style>