<template>
  <div>
    <div v-for="(item, index) in lists" :key="index" :class="['item', 'infinite-list-item', { 'phone-item': ISPHONE }]" @click.stop="toDetail(item)">
      {{ item.text }}
    </div>
  </div>
</template>

<script>
import VueClipboard from "vue-clipboard2";
import Vue from "vue";
Vue.use(VueClipboard);

export default {
  name: "ListComment",
  data() {
    return {};
  },
  props: {
    lists: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {},
  created() {

  },
  mounted() {

  },
  destroyed() {

  },
  methods: {},
};
</script>

<style lang='scss' scoped type='text/scss'>
.scroll_to_top_phone {
  position: fixed;
  width: 40px;
  height: 40px;
  right: 10px;
  bottom: 65px;
  cursor: pointer;
  z-index: 1;

  img {
    width: 100%;
  }
}

.title {
  padding: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  position: relative;
}

.pin_title {
  padding: 0 0 0px 0;
  font-size: 16px;
  font-weight: 600;
  position: relative;
}

.coverss {
  width: 100%;
  height: 300px;
}

.video {
  position: relative;
}

.btn_play {
  position: absolute;
  width: 40px;
  height: 40px;
  left: 20px;
  bottom: 20px;
}

.scroll_to_top {
  position: fixed;
  width: 40px;
  height: 40px;
  right: 80px;
  bottom: 120px;
  cursor: pointer;
  z-index: 1;

  img {
    width: 100%;
  }
}

.module_name b {
  // padding-bottom: 2px;
}

.module_name b:hover {
  border-bottom: 1px solid #666;
}

.inner_prev {
  height: 320px;
  line-height: 310px;
  position: relative;
  text-align: center;
  background: #000;

  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    vertical-align: middle;
  }

  .inner_play {
    position: absolute;
    left: 20px;
    bottom: 20px;
    z-index: 8;
    width: 60px;
    height: 60px;
  }
}

.inner_prev_phone {
  height: 230px;
  line-height: 230px;
}

.inner_videoc {
  min-height: 330px;
}

@media screen and (max-width: 700px) {
  .inner_videoc {
    min-height: auto;
  }
}

/deep/ .item {
  &:hover {
    .icon2 {
      display: none;
    }

    .zhiding {
      display: block;
    }
  }
}

.tags {
  margin-bottom: 10px;
  display: inline-block;

  span {
    display: inline-block;
    vertical-align: middle;
    padding: 2px 6px;
    background: #ff9300;
    border-radius: 4px;
    font-size: 13px;
    color: #fff;
  }
}
</style>
