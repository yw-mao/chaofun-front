<template>
  <el-container ref="containers">
    <el-header>Header</el-header>
    <el-main>
      <div v-masonry transition-duration="0.3s" item-selector=".item" :origin-top="true" :horizontal-order="false">
        <div v-masonry-tile class="item" v-for="item in lists" :key="item.postId">
          <!-- block item markup -->
          <item :item="item" v-if="item.type === 'image'" />
        </div>
    </div>
    </el-main>
  </el-container>
</template>
<script>
import item from './components/item.vue';
import * as api from '@/api/api';

export default {
  name: 'Chao',
  data() {
    return {
      lists: [],
      forumId: '',
      cateId: '',
      param: {
        pageSize: 30,
        order: 'new',
        onlyNew: false,
        forumId: 84,
        marker: null,
      },
      ifcanget: false,
      loadMore: true,
    }
  },
  components: {
    item,
  },
  mounted() {
    window.addEventListener('scroll',  this.handleScroll);
    this.getPosts();
  },
  methods: {
    async getPosts() {
      this.ifcanget = false;

      const { data: { marker, posts } } = await api.getPosts(this.param);
      if (marker && posts && posts.length != 0) {
        this.ifcanget = true;
      }

      if (marker) {
        this.param.marker = marker;
      }
      if (posts.length === 0) {
        this.loadMore = false;
      }
      this.lists.push(...posts);
    },

    handleScroll() {
      const scrollHeight = window.scrollY;
      const maxHeight = window.document.body.scrollHeight - window.document.documentElement.clientHeight;
      
      if (scrollHeight >= maxHeight - 80 && this.loadMore && this.ifcanget) {
        this.getPosts()
      }
    }
  },
 
}
</script>