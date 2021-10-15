<template>
  <div id="container"
      class="dashboard-container container infinite-list"
      ref="container"
      :style="{ height: scrollHeight + 'px' }">
      <div>
        <div style="height: 50px"></div>
        <div class="main_content">
          <div v-if="!ISPHONE" class="main_left">
          </div>
          <div class="main_center">
            <div
              class="grid-content"
              style="
                overflow: auto;
                width: 640px;
                max-width: 100%;
                margin: 0 auto;
              "
            >
              <div class="top_info">
                <div class="t_left">
                    <div class="s_title">锦标赛预测</div>
                    <div class="b_title">2021年英雄联盟 世界锦标赛预测</div>
                </div>
                <div class="t_right">

                </div>
              </div>
              <ListItem
                
                :marker="params.marker"
                :keys="params.key"
                :isindex="false"
                :lists="lists"
              ></ListItem>
            </div>
          </div>
          <div v-if="!ISPHONE" class="main_right"></div>
        </div>
      </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as api from "../../api/api";

import ListItem from "../../components/chaofan/ListItem.vue";
import attentionItem from "../../components/chaofan/attentionItem.vue";
import RightCom from "@/components/chaofan/RightCom";
import loadText from "@/components/chaofan/loadText";

export default {
  name: "user",
  data() {
    return {
      currentRole: "adminDashboard",
      count: 5,
      lists: [],
      forumId: "",
      params: {
        marker: "",
        pageSize: 40,
        // order: localStorage.getItem('chao.fun.timeline.order') == null ? 'hot': localStorage.getItem('chao.fun.timeline.order')
      },
      options: [
        {
          label: "最热",
          value: "hot",
        },
        {
          label: "最新",
          value: "new",
        },
      ],
      isPhone: false,
      forumInfo: null,
      ifcanget: true,
      whichOne: "pub",
      loadAll: false,
      userInfo: {},
      usersData: [],
    };
  },
  components: {
    ListItem,
    loadText,
    attentionItem,
  },
  watch: {
    "$route.params"(v) {
      console.log(v);
      console.log(2);
    },
  },
  computed: {
    ...mapGetters(["roles", "islogin"]),
  },
  activated(){
    
  },
  beforeRouteEnter(to, from, next) {
    if (from.path.includes("/p/")) {
    } else {
      localStorage.setItem("whichOne", "pub");
    }
    next();
  },
  mounted() {
    
  },
  created() {
    this.getList();
  },
  methods: {
    getList(){
        let params = {
            predictionsTournamentId: '1'
        }
        api.predictionsTournament(params).then(res=>{
            if (res.data.marker && res.data.length != 0) {
                this.ifcanget = true;
            }
            if (res.data.marker) {
                params.marker = res.data.marker;
            } else {
                if (res.data.length === 0) {
                    this.loadAll = true;
                }
            }
            if (res.data.length === 0) {
                this.loadAll = true;
            }
            if (params.order == "hot") {
                params.key = res.data.key;
            } else {
                delete params.key;
            }
            this.lists.push(...res.data);
        })
    }
  },
};
</script>
<style lang="scss" scoped>
.top_info{
    height: 180px;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 10px;
    display: flex;
    // align-items: center;
    color: #fff;
    justify-content: space-between;
    background: url('https://i.chao.fun/biz/0dd39345f731e512a2308a9cf20b8926.png');
    .t_left{
        flex: 0 0 250px;
        .s_title{
            font-size: 16px;
        }
        .b_title{
            font-size: 30px;
            line-height: 36px;
            margin-top: 10px;
        }
    }
}
</style>
