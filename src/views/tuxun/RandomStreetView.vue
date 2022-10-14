<template>
  <div>
    <div class="back_home" >
      <el-button type="primary" @click="goHome" round>←返回首页</el-button>
      <el-button type="warning" @click="change"  round>换一个</el-button>
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
    }
  },
  mounted() {
    let recaptchaScript = document.createElement('script')
    loadScript('https://chaofun-test.oss-cn-hangzhou.aliyuncs.com/google/js-1.js??key=AIzaSyAZZWaODguEaDaHTt7IuJuQEqoJ_mQXzaQ&callback=initialize&v=weekly&channel=2').then(() => {
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
      this.change()
    },
    goHome() {
      window.location.href = '/tuxun';
    },
    change() {
      api.getByPath("/api/v0/tuxun/random", {mapsId: this.mapsId}).then(res => {
        this.panorama.setPano(res.data);
        this.panorama.setPov({
          heading: 270,
          pitch: 0,
        });
        this.panorama.setVisible(true);
      })
    }
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
