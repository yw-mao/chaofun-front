<template>
  <div>
    <div v-for="(item, index) in lists" :key="index" style="margin-bottom: 20px;padding-bottom:15px;
    border: #e0e0e0 solid 3px;border-radius: 10px; background: #f1f1f1">
      <ListItem :lists="[item.post]" :is-show-to-top-button="false"></ListItem>
      <commentItem :treeData="[item]" style="margin-right: 10px;"></commentItem>
    </div>
  </div>
</template>

<script>
import ListItem from '@/components/chaofan/ListItem.vue'
import commentItem from "_c/chaofan/commentItem";

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
  components: {ListItem, commentItem,},
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
</style>
