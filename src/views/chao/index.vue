<template>
  <el-container ref="containers">
   <Header :islogin="islogin" :userinfo="userinfo" />
    <el-main class="chao-main">
      <div class="chao-grid" v-masonry transition-duration="0.3s" item-selector=".item" :origin-top="true" :horizontal-order="false">
        <div v-masonry-tile class="item" v-for="item in lists" :key="item.postId">
          <!-- block item markup -->
          <item :item="item" v-if="item.type === 'image'" />
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { mapState } from 'vuex'
import Header from './components/layout/header.vue';
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
    Header,
  },
  mounted() {
    window.addEventListener('scroll',  this.handleScroll);
    this.getPosts();
  },
  computed: {
    ...mapState({
      logStatus: state => state.user.logStatus,
      userinfo: state => state.user.userInfo,
      islogin: state => state.user.islogin,
    }),
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

<style lang="scss" scoped>
.chao-main {
  margin-top: 60px;
  .chao-grid {
    margin: 0 auto;
  }
}
@media (min-width: 0px) and (max-width: 755px) {
  .chao-grid {
    width: 504px;
  }
}
@media (min-width: 1008px) and (max-width: 1259px) {
  .chao-grid {
    width: 1008px;
  }
}
@media (min-width: 1260px) and (max-width: 1511px) {
  .chao-grid {
    width: 1260px;
  }
}
@media (min-width: 1512px) and (max-width: 1763px) {
  .chao-grid {
    width: 1512px;
  }
}
@media (min-width: 1764px) and (max-width: 2015px) {
  .chao-grid {
    width: 1764px;
  }
}
@media (min-width: 2016px) and (max-width: 2267px) {
  .chao-grid {
    width: 2016px;
  }
}
@media (min-width: 2268px) and (max-width: 2519px) {
  .chao-grid {
    width: 2268px;
  }
}
@media (min-width: 2520px) and (max-width: 2771px) {
  .chao-grid {
    width: 2520px;
  }
}
</style>
<style lang="scss">
/* Handle */
::-webkit-scrollbar-thumb {
  background: #606060; 
}
::-webkit-scrollbar-thumb:vertical:hover {
  background-color: #909090;
}
</style>