<template>
  <div>
    <div class="back_home" >
      <el-button type="primary" @click="goHome" round>←返回首页</el-button>
      <el-button type="warning" @click="change"  round>换一个</el-button>
      <el-button @click="shareLink" round>分享街景</el-button>
    </div>
    <div id="map" class="container" style=""></div>
  </div>
</template>

<script>
import { loadScript } from "vue-plugin-load-script";
import * as api from '../../api/api'


export default {
  name: "RandomStreetView",
  data() {
    return {
      panorama: null,
      currentPanoId: null,
      sharePanoId: null,
    }
  },
  mounted() {
    this.sharePanoId = this.$route.query.pano;
    loadScript('https://chaofun-test.oss-cn-hangzhou.aliyuncs.com/google/js-1.js?key=AIzaSyAZZWaODguEaDaHTt7IuJuQEqoJ_mQXzaQ&callback=initialize&v=weekly&channel=2').then(() => {
      this.test();
    })
  },

  methods: {
    test() {
      this.panorama = new google.maps.StreetViewPanorama(
          document.getElementById("map"), {
            fullscreenControl:false,
            panControl:false,
            addressControl: false,
            imageDateControl: true,
            motionTrackingControl:false,
            streetViewControl:true
          }
      );
      if (this.sharePanoId) {
        this.setPano(this.sharePanoId)
      } else {
        this.change()
      }
    },
    goHome() {
      window.location.href = '/tuxun';
    },
    setPano(panoId) {
      this.currentPanoId = panoId;
      this.panorama.setPano(panoId);
      this.panorama.setPov({
        heading: 270,
        pitch: 0,
      });
      this.panorama.setVisible(true);
    },
    change() {
      if (this.sharePanoId) {
        window.location.href = '/tuxun/random'
        return;
      }
      api.getByPath("/api/v0/tuxun/random", {mapsId: this.mapsId}).then(res => {
        this.setPano(res.data);
      })
    },
    shareLink() {
      var input = document.createElement('input');
      input.setAttribute('value', 'https://chao.fan/tuxun/random?pano='+ this.currentPanoId  + '&source=g');
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast("复制街景地址成功");
    },
  }
}
</script>

<style scoped>
.back_home {
  position: absolute;
  padding-top: 1rem;
  padding-left: 1rem;
  z-index: 500;
}
.container {
  position: absolute;
  width: 100%;
  height: 100%;
}

</style>
