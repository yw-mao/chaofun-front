<template>
  <div>
    <div v-for="(item,index) in manageForumsList" :key="index"
         class="item" @click="toForum(item.id)">

      <span style="margin: auto 0;">
        <img :src="imgOrigin + item.imageName+ '?x-oss-process=image/resize,h_40/format,webp/quality,q_75'" alt=""
             style="width: 40px;height: 40px;border-radius: 100%;" />
      </span>

      <span style="margin: auto 5px;">
        <div style="font-size: 16px;"> {{ item.name }} </div>
        <div style="font-size: 12px;color: #999;">帖子数量： {{ item.posts }}</div>
      </span>

    </div>
  </div>
</template>

<script>

import { listManageForums } from "@/api/api";

export default {
  name: "listManageForums",
  data() {
    return {
      manageForumsList: []
    };
  },
  mounted() {
    listManageForums().then(res => {
      if (res.success) {
        this.manageForumsList = res.data;
      }
    });
  },
  methods: {
    toForum(forumId) {
      window.open("/f/" + forumId, "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  padding: 5px 10px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:hover {
    background: #f9f9f9;
  }
}
</style>