<template>
<div class="container">
  <div id="map" class="maps"></div>
</div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-bing-layer/leaflet-bing-layer"
// import "https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise";
export default {
  name: "TuxunNewMap",
  mounted() {
    var map = L.map('map').setView([51.505, -0.09], 3)
    L.tileLayer.bing({bingMapsKey: 'AljSFl1ezKYkuatAoeYdOxBPuuZqzRoYgEULlAh_ZuQDHac6gCWJUVDSF2g99WKv', imagerySet: 'RoadOnDemand', culture: 'zh-CN', style: 'vb' }).addTo(map)
    var marker = L.marker([1, 1], {icon: new L.Icon.Default()}).bindTooltip("目标位置",
        {
          permanent: true,
          direction: 'auto'
        }).addTo(map);
  },
  methods: {

  }
}

</script>

<style lang="scss" scoped>

.container {
  position: absolute;
  width: 100%;
  height: 100%;
  .maps {
    position: absolute;
    width: 100%;
    height: 100%;
    //width: 50%;
    //height: 50%;
  }
}
</style>
