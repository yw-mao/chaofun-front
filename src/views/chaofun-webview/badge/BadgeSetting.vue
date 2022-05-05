<template>
  <div>
    <div v-for="(item,index) in lists" :key="index" class="item">
      <div style="max-width: 80vw;" @click="toDetail(item)">
        {{ item.badge.name }}
      </div>
      <div style="display: flex; justify-content: space-between;width: 90px;">
        <el-switch @change="switchBadgeShow($event, item)" v-model="item.show" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'

export default {
  name: "badgeDetail.vue",
  data() {
    return {
      'lists': [],
      'badgeId': null,
      'badgeInfo': {}
    }
  },
  props: {
    badgeInfo0: {
      type: Object,
      default() {
        return null;
      }
    }
  },

  created() {
    if (this.badgeInfo0) {
      this.badgeInfo = this.badgeInfo0;
    } else {
      this.badgeId = this.$route.query.badgeId;
      this.getBadgeInfo();
    }
  },

  mounted() {

  },

  methods: {
    toDetail(item) {
      window.open('/webview/badge?badgeId=' + item.badge.id, '_blank')
    },
    switchBadgeShow(event, item) {
      api.getByPath('/api/v0/badge/setShow', {badgeId: item.badge.id, show: event}).then( res =>
          this.getBadgeInfo()
      );
    },
    getBadgeInfo() {
      api.getByPath('/api/v0/badge/list?settingPage=true', ).then(
          res => {
            if (res.success) {
              this.lists = res.data;
            } else {
              this.$toast(res.errorMessage)
            }
          }
      );
    }
  }
}
</script>

<style scoped>

.item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f1f1f1;
  overflow: hidden;
}
</style>