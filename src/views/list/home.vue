<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <div class="container infinite-list" ref="container" :style="{height: scrollHeight+'px'}">
      <el-row :gutter="20">
        <el-col :span="isPhone?24:doWidth()" :offset="doOffSet()">
          <div class="navs" style="display:flex;justify-content:space-between; width: 100%;">
            <div v-if="!ISPHONE" style="width:100%;">
              <!-- <el-select v-model="params.order" placeholder="请选择" @change="changes"
                         style="padding: 10px 0;">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select> -->
              <selectList @updateList="updateList" :params="params"></selectList>
            </div>
            <div v-if="isiOS || isAndroid">
              <div style="position:relative; float: left;">
                <select v-model="params.order"
                        style="-webkit-appearance: none;height:20px;padding:6px 20px;padding-right:30px;box-sizing:content-box;margin:10px 0;border-color:#999;background:#fff;"
                        placeholder="请选择12" @change="changes" name="" id="">
                  <option v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">{{item.label}}
                  </option>
                </select>
                <i class="el-icon-arrow-right" style="position:absolute;right:8px;top:20px;"></i>
              </div>
              <div v-if="params.order ==='ups'" style="position:relative; float: left;">
                <select v-model="params.range"
                        style="-webkit-appearance: none;height:20px;padding:6px 20px;padding-right:30px;box-sizing:content-box;margin-top:10px;border-color:#ccc;background:#fff;"
                        placeholder="请选择" @change="changes" name="" id="">
                  <option v-for="item in ranges"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">{{item.label}}
                  </option>
                </select>
                <i class="el-icon-arrow-right" style="position:absolute;right:8px;top:20px;"></i>
              </div>
            </div>
          </div>
          <div class="grid-content" style="overflow:auto; width: 640px; max-width: 100%">
            <ListItem :marker="params.marker" :keys="params.key" :isindex="false" :lists="lists"></ListItem>
            <load-text :ifcanget="ifcanget" :loadAll="loadAll"></load-text>
          </div>
        </el-col>
        <el-col v-if="!ISPHONE&&clientWidth>865" :span="4" :offset="0">
          <div v-if="!isPhone" style="min-width:270px;padding-top: 60px;" class="grid-content bg-purple content-right">
            <RightCom :forumInfo="forumInfo" @getForumInfo="getForumInfo" :islogin="islogin"></RightCom>
          </div>
        </el-col>
      </el-row>
    </div>
    <fixedBottom></fixedBottom>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import * as api from '../../api/api'

  import ListItem from '../../components/chaofan/ListItem.vue'
  import RightCom from '@/components/chaofan/RightCom'
  import loadText from '@/components/chaofan/loadText'
  import fixedBottom from '@/components/chaofan/fixedBottom'

  import selectList from '@/components/chaofan/common/selectList'

  export default {
    name: 'Dashboard',
    // components: { adminDashboard, editorDashboard },
    data() {
      return {
        currentRole: 'adminDashboard',
        count: 5,
        lists: [],
        forumId: '',
        params: {
          forumId: '',
          pageSize: 40,
          order: localStorage.getItem('chao.fun.timeline.order') == null ? 'hot' : localStorage.getItem('chao.fun.timeline.order'),
          range: localStorage.getItem('chao.fun.timeline.range') == null ? '1day' : localStorage.getItem('chao.fun.timeline.range')
        },
        
        isPhone: false,
        forumInfo: null,
        ifcanget: true,
        loadAll: false
      }
    },
    components: {
      ListItem, RightCom, loadText, fixedBottom,selectList
    },
    watch: {
      // 'params.forumId'(v){
      //   this.params.pageNum = 1;
      //   this.lists = []
      // }
    },
    computed: {
      ...mapGetters([
        'roles',
        'islogin'
      ])
    },
    mounted() {
      if (document.body.clientWidth < 700) {
        this.isPhone = true
      }
      if (this.$route.query.game) {
        localStorage.setItem('gamemodule', true);
      }
      this.toPosition();
      let self = this;
      this.$refs.container.addEventListener("scroll", function () {
        let scrollTop = self.$refs.container.scrollTop;
        let conTop = self.$refs.container.scrollTop
        // 变量windowHeight是可视区的高度
        let conHeight = self.$refs.container.clientHeight;
        // 变量scrollHeight是滚动条的总高度
        let scrollHeight = self.$refs.container.scrollHeight - 4;
        //  console.log("距顶部" + scrollTop + "可视区高度" + windowHeight + "滚动条总高度" + scrollHeight);
        // console.log(conTop,conHeight,scrollHeight)
        if (conTop + conHeight > scrollHeight || conTop + conHeight == scrollHeight) {
          console.log('到底了')
          if (self.ifcanget) {
            // self.load()
            self.getLists()
          }
        }
      });
      // document.querySelector('meta[name="keywords"]').setAttribute("content", '111')
      document.querySelector('meta[name="description"]').setAttribute("content", '222')
    },
    created() {
      let id = this.$route.path.split('/')[2];
      if (!isNaN(id)) {
        this.params.forumId = id
        // if(!localStorage.getItem('storedata')){
        //   this.getLists()
        // }

      }
      // if(this.$route.params.forumId == 17){
      //   this.params.pageSize = 7
      // }
      this.params.forumId = this.$route.params.forumId
      this.getForumInfo();
      this.load()
    },
    methods: {
      chooseNav(index,item){
        this.options.forEach(i=>{
          i.choose = false;
        })
        item.choose = true;
        this.options.splice(index,1,item);
        localStorage.setItem('chao.fun.timeline.order', item.value);
        localStorage.setItem('chao.fun.timeline.range', this.params.range);
        delete this.params.marker;
        delete this.params.key;
        this.params.order = item.value;
        this.lists = []
        this.getLists();
      },
      updateList(params){
        this.params = params;
        this.lists = [];
        this.getLists();
      },
      changes() {
        localStorage.setItem('chao.fun.timeline.order', this.params.order);
        localStorage.setItem('chao.fun.timeline.range', this.params.range);
        delete this.params.marker;
        delete this.params.key;
        this.lists = []
        this.getLists();
      },
      getForumInfo() {
        api.getForumInfo({forumId: this.params.forumId}).then(res => {
          if(res.success) {
            this.forumInfo = res.data
            this.$store.dispatch('var/SET_formName', res.data.name);
            document.title = '【' + res.data.name + '】- ' + document.title

            if (res.data.desc) {
              document.querySelector('meta[name="description"]').setAttribute('content', res.data.desc);
            }

          } else {
            this.$router.push('/404')

          }
        })
      },
      getLists() {
        let params = this.params;
        this.ifcanget = false
        api.getPosts(params).then(res => {
          if (res.data.marker && (res.data.posts.length == this.params.pageSize)) {
            this.ifcanget = true
          }
          if (res.data.marker) {
            params.marker = res.data.marker;
          } else {
            if (res.data.posts.length < this.params.pageSize) {
              this.loadAll = true
            }
          }
          if (res.data.posts.length < this.params.pageSize) {
            this.loadAll = true
          }
          if (params.order == 'hot') {
            params.key = res.data.key
          } else {
            delete params.key
          }
          this.lists.push(...res.data.posts)
        })
      },
      load() {
        if (localStorage.getItem('storedata')) {
          this.lists = JSON.parse(localStorage.getItem('storedata')).list;
          this.params.marker = JSON.parse(localStorage.getItem('storedata')).marker;
          this.params.key = JSON.parse(localStorage.getItem('storedata')).key;
        } else {
          if (this.ifcanget) {
            // this.params.pageNum += 1;
            // this.params.marker = '';
            this.getLists()
          }

        }

      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    // background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }


  .asa {

    margin-bottom: 20px;
    // display: flex;
  }


</style>
