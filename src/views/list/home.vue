<template>
  <div id="container"
       class="dashboard-container container infinite-list"
       ref="container"
       :style="{ height: scrollHeight + 'px' }">
    <div>
      <div style="padding-top: 50px;height:230px; display: block; background-color: white;">
        <div style="height: 80px; background-color: #3BA8FF"></div>
        <div class="_3JDs8KEQIXSMn1bTF2ZqJ_" >
          <div class="QscnL9OySMkHhGudEvEya">
            <img v-if="forumInfo.imageName" :src="imgOrigin+forumInfo.imageName + '?x-oss-process=image/resize,h_70'" class="Mh_Wl6YioFfBc9O1SQ4Jp">
            <div class="_3I4Wpl_rl6oTm02aWPZayD ">
              <div class="_3TG57N4WQtubLLo8SbAXVF">
                <h1 class="_2yYPPW47QxD4lFQTKpfpLQ">{{forumInfo.name}}</h1>
                <h2 class="_33aRtz9JtW0dIrBNKFAl0y">{{forumInfo.desc}}</h2>
              </div>
<!--              <div class="_1Q_zPN5YtTLQVG72WhRuf3">-->
<!--                <button role="button" tabindex="0" class="_1LHxa-yaHJwrPK8kuyv_Y4 _2iuoyPiKHN3kfOoeIQalDT _2tU8R9NTqhvBrhoNAXWWcP HNozj_dKjQZ59ZsfEegz8 ">-->
<!--                  <span>-->
<!--                    <span class="_31L3r0EWsU0weoMZvEJcUA">Joined</span>-->
<!--                    <span class="_11Zy7Yp4S1ZArNqhUQ0jZW">Leave</span>-->
<!--                  </span>-->
<!--                </button>-->
<!--              </div>-->
<!--              <div class="_1cAYKT6f3GM-_aZei&#45;&#45;pxM">-->
<!--                <button type="button" class="_3lH4vtstXYL3BXfT_hrmNu" data-testid="subredditNotificationButton">-->
<!--                  <i class="qIoApQle9dXP6HkO35IOx icon icon-notification_fill"></i></button>-->
<!--              </div>-->
            </div>
          </div>
        </div>

<!--        <div class="_1gVVmSnHZpkUgVShsn7-ua _15Pk_bZ2XZNa9zBvnxq6HX" style="position:static;background:inherit">-->
<!--          <div class="_1_TJAX-8zAT3vVN1Iz7cys" style="max-width:1200px">-->
<!--            <div>-->
<!--              <a class="_1O30sSXmfkKMRZqSaESf0S _1YpJV_aDQqujwuofx9-eAX uGdFXCHH-nwVp4gU3UaTw" href="/r/anime/">-->
<!--                Posts-->
<!--              </a>-->
<!--              <a class="_1O30sSXmfkKMRZqSaESf0S   jU3ijmuG8CyRDQhPOHdw4" href="/r/anime/predictions/">-->
<!--                Predictions-->
<!--              </a>-->
<!--              <a class="_1O30sSXmfkKMRZqSaESf0S  uGdFXCHH-nwVp4gU3UaTw" href="https://www.reddit.com/r/anime/wiki/rules" rel="noopener nofollow ugc" target="_blank">-->
<!--                Rules-->
<!--              </a>-->
<!--              <div class="hcJJEc0gVBKH5pWCFgdET">-->
<!--                <div class="_2wtKbmW1aPrT3MyHoaupQh  uGdFXCHH-nwVp4gU3UaTw">-->
<!--                  <span>-->
<!--                    Megathreads-->
<!--                  </span>-->
<!--                  <svg class="XHbKeEqnW58ib9mTN6jnS u_kypUXmB-k1A5TcC8MI9 _3u_CcXw7slod9vNJKIlYvx" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">-->
<!--                    <path d="M14.17,9.35,10,13.53,5.83,9.35a.5.5,0,0,1,.35-.85h7.64a.5.5,0,0,1,.35.85"></path>-->
<!--                  </svg>-->
<!--                </div>-->
<!--                <div class="_1T423RClx-mTPxfuiCw4UN " aria-hidden="true" role="list">-->
<!--                  <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://redd.it/qaavyj" role="listitem" target="_blank" rel="noopener nofollow ugc">Merch Mondays</a>-->
<!--                  <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://redd.it/qazc14" role="listitem" target="_blank" rel="noopener nofollow ugc">Recommendation Tues</a>-->
<!--                  <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://redd.it/q7nwyv" role="listitem" target="_blank" rel="noopener nofollow ugc">Thursday Anime Disc</a>-->
<!--                  <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://redd.it/q8c182" role="listitem" target="_blank" rel="noopener nofollow ugc">Casual Disc Fridays</a>-->
<!--                  <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://redd.it/q90mkm" role="listitem" target="_blank" rel="noopener nofollow ugc">Misc Anime Questions</a>-->
<!--                  <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://redd.it/q9noqt" role="listitem" target="_blank" rel="noopener nofollow ugc">Weekly Roundup</a>-->
<!--                  <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://redd.it/q06gp1" role="listitem" target="_blank" rel="noopener nofollow ugc">Monthly Meta Thread</a>-->
<!--                </div></div><div class="hcJJEc0gVBKH5pWCFgdET"><div class="_2wtKbmW1aPrT3MyHoaupQh  uGdFXCHH-nwVp4gU3UaTw">-->
<!--              <span>Wiki &amp; Watch Orders</span>-->
<!--              <svg class="XHbKeEqnW58ib9mTN6jnS u_kypUXmB-k1A5TcC8MI9 _3u_CcXw7slod9vNJKIlYvx" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">-->
<!--                <path d="M14.17,9.35,10,13.53,5.83,9.35a.5.5,0,0,1,.35-.85h7.64a.5.5,0,0,1,.35.85"></path>-->
<!--              </svg>-->
<!--            </div>-->
<!--              <div class="_1T423RClx-mTPxfuiCw4UN " aria-hidden="true" role="list"><a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://www.reddit.com/r/anime/wiki/watch_order" role="listitem" target="_blank" rel="noopener nofollow ugc">Anime Watch Orders</a>-->
<!--                <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://reddit.com/r/anime/wiki" role="listitem" target="_blank" rel="noopener nofollow ugc">Index</a>-->
<!--                <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://reddit.com/r/anime/w/faaq" role="listitem" target="_blank" rel="noopener nofollow ugc">FAAQ</a>-->
<!--                <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://www.reddit.com/r/anime/wiki/mods" role="listitem" target="_blank" rel="noopener nofollow ugc">Mods</a>-->
<!--                <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://www.reddit.com/r/anime/wiki/amas" role="listitem" target="_blank" rel="noopener nofollow ugc">AMAs</a>-->
<!--                <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://www.reddit.com/r/anime/wiki/events" role="listitem" target="_blank" rel="noopener nofollow ugc">Events</a>-->
<!--                <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://www.reddit.com/r/anime/wiki/rewatches" role="listitem" target="_blank" rel="noopener nofollow ugc">Rewatches</a>-->
<!--                <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://www.reddit.com/r/anime/wiki/recommendations" role="listitem" target="_blank" rel="noopener nofollow ugc">Recommendations</a>-->
<!--                <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://www.reddit.com/r/anime/wiki/related_subreddits" role="listitem" target="_blank" rel="noopener nofollow ugc">Related Subreddits</a>-->
<!--                <a class="_1p4TpHzWWRAkGYYw9_jU-B  " href="https://www.reddit.com/r/anime/wiki/related_sites" role="listitem" target="_blank" rel="noopener nofollow ugc">Related Websites</a>-->
<!--              </div>-->
<!--            </div>-->
<!--              <a class="_1O30sSXmfkKMRZqSaESf0S  uGdFXCHH-nwVp4gU3UaTw" href="https://old.reddit.com/r/anime/comments/id248i/a_quickstart_guide_to_ranime/" rel="noopener nofollow ugc" target="_blank">A Guide to /r/Anime</a>-->
<!--              <a class="_1O30sSXmfkKMRZqSaESf0S  uGdFXCHH-nwVp4gU3UaTw" href="https://old.reddit.com/r/anime/" rel="noopener nofollow ugc" target="_blank">Old Reddit</a>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <div class="main_content">
        <div v-if="!ISPHONE" class="main_left">
          <div
              v-if="tagList.length"
              class="fixed_tag"
          >
            <div
                @click="checkTag({ id: '' })"
                :class="['tag_item', { tag_item_active: !params.tagId }]"
            >
              全部
            </div>
            <div
                @click="checkTag(item)"
                v-for="(item, index) in tagList"
                :key="index"
                :class="['tag_item', { tag_item_active: item.id == params.tagId }]"
            >
              # {{ item.name }} <span v-if="tagCountList.length">{{doTagCount(item)}}</span>
            </div>
          </div>
        </div>
        <div class="main_center">
          <div class="navs" :style="{ left: ISPHONE ? '0' : '0px' }">
            <div style="width: 100%">
              <selectList
                  @updateList="updateList"
                  :params="params"
              ></selectList>
            </div>
          </div>
          <div class="grid-content" :style="{ left: ISPHONE ? '0' : '0px' }">
            <keep-alive>
              <ListItem
                  v-if="$store.state.user.listMode == 'normal'"
                  :marker="params.marker"
                  :keys="params.key"
                  :isindex="false"
                  :lists="lists"
              ></ListItem>
              <SimListItem
                  v-else
                  :marker="params.marker"
                  :keys="params.key"
                  :isindex="true"
                  :lists="lists"
              ></SimListItem>

            </keep-alive>

            <load-text :ifcanget="ifcanget" :loadAll="loadAll"></load-text>
          </div>
        </div>
        <div v-if="!ISPHONE" class="main_right">
          <div
              v-if="!ISPHONE && clientWidth > 865"
              class="fixed_r"
          >
            <div
                v-if="!ISPHONE"
                style="min-width: 300px; padding-top: 0px"
                class="grid-content bg-purple content-right"
            >
              <RightCom
                  :forumInfo="forumInfo"
                  @getForumInfo="getForumInfo"
                  :islogin="islogin"
              ></RightCom>
            </div>
          </div>
        </div>

      </div>

    </div>
    <fixedBottom></fixedBottom>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import * as api from "../../api/api";

  import ListItem from "../../components/chaofan/ListItem.vue";
  import SimListItem from "../../components/chaofan/SimListItem.vue";
  import RightCom from "@/components/chaofan/RightCom";
  import loadText from "@/components/chaofan/loadText";
  import fixedBottom from "@/components/chaofan/fixedBottom";

  import selectList from "@/components/chaofan/common/selectList";

  export default {
    name: "Dashboard",
    // components: { adminDashboard, editorDashboard },
    data() {
      return {
        hasGetData: false,
        pinList: [],
        currentRole: "adminDashboard",
        count: 5,
        lists: [],
        forumId: "",
        params: {
          forumId: "",
          pageSize: 40,
          order:
            localStorage.getItem("chao.fun.timeline.order") == null
              ? "hot"
              : localStorage.getItem("chao.fun.timeline.order"),
          range:
            localStorage.getItem("chao.fun.timeline.range") == null
              ? "1day"
              : localStorage.getItem("chao.fun.timeline.range"),
        },

        isPhone: false,
        forumInfo: {},
        ifcanget: true,
        loadAll: false,
        options: [
          {
            label: "最新",
            value: "new",
            choose: true,
          },
          {
            label: "最热",
            value: "hot",
            choose: false,
          },
          {
            label: "热评",
            value: "comment",
            choose: false,
          },
          {
            label: "最赞",
            value: "ups",
            choose: false,
          },
        ],
        ranges: [
          {
            label: "现在",
            value: "1hour",
          },
          {
            label: "一天",
            value: "1day",
          },
          {
            label: "一周",
            value: "1week",
          },
          {
            label: "一个月",
            value: "1month",
          },
          {
            label: "一年",
            value: "1year",
          },
          {
            label: "全部",
            value: "all",
          },
        ],
        tagList: [],
        tagCountList: [],
      };
    },
    components: {
      ListItem,
      RightCom,
      loadText,
      fixedBottom,
      selectList,
      SimListItem,
    },
    watch: {
      // 'params.forumId'(v){
      //   this.params.pageNum = 1;
      //   this.lists = []
      // }
    },
    computed: {
      ...mapGetters(["roles", "islogin"]),
    },
    activated(){
      console.log('666',this.$route.query)
      if(this.$route.query.time){
        this.toPosition();
      }
      this.getForumInfo();
      if(localStorage.getItem('simple')){
        let data = JSON.parse(localStorage.getItem('simple'));

        this.lists.forEach((its,index)=>{
          if(data.postId==its.postId){
            this.lists.splice(index,1,data)
          }
        })
        localStorage.removeItem('simple')
      }
    },
    mounted() {
      console.log(777)
      if (document.body.clientWidth < 700) {
        this.isPhone = true;
      }
      if (this.$route.query.game) {
        localStorage.setItem("gamemodule", true);
      }

      let self = this;
      this.$refs.container.addEventListener("scroll", function () {
        let scrollTop = self.$refs.container.scrollTop;
        let conTop = self.$refs.container.scrollTop;
        // 变量windowHeight是可视区的高度
        let conHeight = self.$refs.container.clientHeight;
        // 变量scrollHeight是滚动条的总高度
        let scrollHeight = self.$refs.container.scrollHeight - 4;
         console.log("距顶部" + scrollTop + "可视区高度" + conHeight + "滚动条总高度" + scrollHeight);
        // console.log(conTop,conHeight,scrollHeight)
        if (
          conTop + conHeight >= scrollHeight
        ) {
          console.log("到底了");
          if (self.ifcanget) {
            // self.load()
            self.getLists();
          }
        }
      });
      // document.querySelector('meta[name="keywords"]').setAttribute("content", '111')
      // document.querySelector('meta[name="description"]').setAttribute("content", '222')
      this.$EventBus.$on("unPin", (index) => {
        //需要执行的代码
        this.lists.splice(index, 1);
      });
      this.$EventBus.$on("refreshItemTag", (params) => {
        //需要执行的代码
        console.log(params);
        if (params.way) {
          //refreshItemTag
          this[params.way]();
        } else {
          if (params.type) {
            // this.lists[params.index].tags.push(params.tag);
            this.lists[params.index].tags.splice(0, 1, params.tag);
          } else {
            // this.lists[params.index].tags.splice(
            //   this.lists[params.index].tags.findIndex((i) => i.id == params.tag.id),
            //   1
            // );
            this.lists[params.index].tags.splice(0, 1);
          }
        }
      });
      this.$EventBus.$on("resetItem", (params) => {
        //需要执行的代码
        this.lists.splice(params.index,1,params.item)
      });
    },

    created() {
      console.log(555)
      let id = this.$route.path.split("/")[2];
      if (!isNaN(id)) {
        this.params.forumId = id;
        // if(!localStorage.getItem('storedata')){
        //   this.getLists()
        // }
      }
      // if(this.$route.params.forumId == 17){
      //   this.params.pageSize = 7
      // }
      this.params.forumId = this.$route.params.forumId;


      this.load();
    },
    methods: {
      doTagCount(item){
        let count;
        try{
          count = this.tagCountList[this.tagCountList.findIndex(it=>it.tag_id==item.id)].count;
        }catch{
          count = 0;
        }

        if(count){
          return '('+count+')';
        }else{
          return '';
        }

      },
      listTagPostCount(){
        api.listTagPostCount({forumId: this.params.forumId}).then(res=>{
          this.tagCountList = res.data;
        })
      },
      saveTagId() {
        if (this.params.tagId) {
          localStorage.setItem("tagInfo", JSON.stringify(this.params));
        }
      },
      listPins() {
        api.listPins({ forumId: this.params.forumId }).then((res) => {
          res.data.forEach((item) => {
            item.isPin = true;
          });
          this.pinList = res.data;
          this.lists.unshift(...res.data);
        });
      },
      chooseNav(index, item) {
        this.options.forEach((i) => {
          i.choose = false;
        });
        item.choose = true;
        this.options.splice(index, 1, item);
        localStorage.setItem("chao.fun.timeline.order", item.value);
        localStorage.setItem("chao.fun.timeline.range", this.params.range);
        delete this.params.marker;
        delete this.params.key;
        // delete this.params.tagId;
        this.params.order = item.value;
        this.lists = [];
        this.getLists("first");
      },
      updateList(params) {
        this.params = params;
        // delete this.params.tagId;
        this.lists = [];
        this.getLists("first");
      },
      changes() {
        localStorage.setItem("chao.fun.timeline.order", this.params.order);
        localStorage.setItem("chao.fun.timeline.range", this.params.range);
        delete this.params.marker;
        delete this.params.key;
        // delete this.params.tagId;
        this.lists = [];
        this.getLists("first");
      },
      getForumInfo() {

        api.getForumInfo({ forumId: this.params.forumId }).then((res) => {
          if (res.success) {
            this.forumInfo = res.data;
            document.title = "【" + res.data.name + "】- " + document.title;
            this.$store.dispatch("var/SET_formName", this.forumInfo.name);
            if (res.data.desc) {
              document
                .querySelector('meta[name="description"]')
                .setAttribute("content", res.data.desc);
            }
          } else {
            this.$router.push("/404");
          }
        });
      },
      checkTag(item) {
        this.params.tagId = item.id;
        delete this.params.marker;
        delete this.params.key;
        this.lists = [];
        this.getLists("first");
      },
      getForumTag() {
        api.getlistTag({ forumId: this.params.forumId }).then((res) => {
          this.listTagPostCount();
          this.tagList = res.data;
        });
      },
      getLists(v) {
        let params = this.params;
        this.ifcanget = false;
        if (v == "first") {
          if (!this.tagList.length) {
            //获取置顶帖子

            //获取标签列表
            this.getForumTag();
          }
          if(params.order=='hot'&&!params.tagId){
            this.listPins();
          }
        }
        api.getPosts(params).then((res) => {
          if (res.data.marker && res.data.posts.length != 0) {
            this.ifcanget = true;
          }
          if (res.data.marker) {
            params.marker = res.data.marker;
          } else {
            if (res.data.posts.length === 0) {
              this.loadAll = true;
            }
          }
          if (res.data.posts.length === 0) {
            this.loadAll = true;
          }
          if (params.order == "hot") {
            params.key = res.data.key;
          } else {
            delete params.key;
          }
          this.lists.push(...res.data.posts);
        });
      },
      load() {
        if (
          localStorage.getItem("storedata") &&
          localStorage.getItem("spage") == this.$route.path
        ) {
          var sdata = JSON.parse(localStorage.getItem("storedata"));
          this.lists = sdata.list;
          this.params.marker = sdata.marker;
          this.params.key = sdata.key;
          let tagInfo = JSON.parse(localStorage.getItem("tagInfo"));
          if (tagInfo && tagInfo.forumId == sdata.forumId) {
            this.params.tagId = tagInfo.tagId;
            localStorage.removeItem("tagInfo");
          }
          this.getForumTag();
        } else {
          if (this.ifcanget) {
            // this.params.pageNum += 1;
            // this.params.marker = '';
            this.getLists("first");
          }
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .fixed_r{
    position: sticky;
    top: 50px;
  }
  .content-right{
    top: 0px;
  }
  .rright{
    // max-height: ;
  }

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }
  .navs {
    justify-content: space-between;
    width: 640px;
    max-width: 100%;
    margin: 0 auto;
    position: relative;
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
    overflow: auto;
    width: 640px;
    max-width: 100%;
    margin: 0 auto;
    position: relative;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .asa {
    margin-bottom: 20px;
    // display: flex;
  }
  .fixed_tag {
    position: sticky;
    width: 120px;
    // height: 700px;
    top: 50px;
    bottom: 0;
    z-index: 10;
    overflow-y: auto;
    // background: #fff;
    box-sizing: border-box;
    padding: 4px;
    // background: red;
    // left: 220px;
  }
  .tag_item {
    border: 1px solid transparent;
    line-height: 36px;
    // text-align: center;
    margin: 10px 0;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    padding-left: 5px;
    span{
      font-size: 13px;
    }
    &:hover {
      border: 1px solid #f1f1f1;
      background: #f1f1f1;
    }
  }
  .tag_item_active {
    background: rgba(255, 147, 0, 0.3);
    &:hover {
      background: rgba(255, 147, 0, 0.3);
      border: 1px solid rgba(255, 147, 0, 0.3);
    }
  }
  ._3JDs8KEQIXSMn1bTF2ZqJ_ {
    background-color: var(--newRedditTheme-body);
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-flex-pack: justify;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 984px;
    padding: 0 16px 0 24px;
  }

  .QscnL9OySMkHhGudEvEya {
    -ms-flex-align: start;
    align-items: flex-start;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 12px;
    margin-top: -14px;
  }
  ._2OMsln4_sqrfHjufgGCeio, .Mh_Wl6YioFfBc9O1SQ4Jp {
    border-radius: 100%;
    border: 4px solid #fff;
    display: inline-block;
    height: 72px;
    width: 72px;
    background-color: #fff;
    background-size: cover;
  }
  ._3TG57N4WQtubLLo8SbAXVF, ._3I4Wpl_rl6oTm02aWPZayD {
    box-sizing: border-box;
  }
  ._3I4Wpl_rl6oTm02aWPZayD {
    -ms-flex-align: start;
    align-items: flex-start;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -ms-flex: 1;
    flex: 1;
    padding-left: 16px;
    margin-top: 24px;
    position: relative;
    width: calc(100% - 80px);

  }
  ._2yYPPW47QxD4lFQTKpfpLQ {
    color: var(--newRedditTheme-bodyText);
    -ms-flex: 1;
    flex: 1;
    font-size: 28px;
    font-weight: 700;
    line-height: 32px;
    overflow: hidden;
    padding: 0 2px 4px 0;
    text-overflow: ellipsis;
    width: 100%;
  }
  ._33aRtz9JtW0dIrBNKFAl0y {
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    color: var(--newRedditTheme-metaText);
  }

  ._1Q_zPN5YtTLQVG72WhRuf3 {
    width: 96px;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  ._1cAYKT6f3GM-_aZei--pxM {
    margin-left: 8px;
  }
  div._15Pk_bZ2XZNa9zBvnxq6HX {
    background: var(--newRedditTheme-body);
    position: static;
    margin-left: -16px;
    margin-top: -4px;
  }
  ._1gVVmSnHZpkUgVShsn7-ua {
    margin: 0 auto;
    bottom: 0;
    left: 0;
    right: 0;
  }
  ._1_TJAX-8zAT3vVN1Iz7cys {
    -ms-flex-align: center;
    align-items: center;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-pack: justify;
    justify-content: space-between;
    margin: 0 auto;
    min-width: 260px;
  }
  ._1LHxa-yaHJwrPK8kuyv_Y4 ._31L3r0EWsU0weoMZvEJcUA, ._1LHxa-yaHJwrPK8kuyv_Y4:hover ._11Zy7Yp4S1ZArNqhUQ0jZW {
    display: block;
  }
  ._1LHxa-yaHJwrPK8kuyv_Y4 ._31L3r0EWsU0weoMZvEJcUA, ._1LHxa-yaHJwrPK8kuyv_Y4:hover ._11Zy7Yp4S1ZArNqhUQ0jZW {
    display: block;
  }
  ._2tU8R9NTqhvBrhoNAXWWcP {
    position: relative;
    border: 1px solid var(--newCommunityTheme-button);
    color: var(--newCommunityTheme-button);
    fill: var(--newCommunityTheme-button);
  }
  div._15Pk_bZ2XZNa9zBvnxq6HX {
    background: var(--newRedditTheme-body);
    position: static;
    margin-left: -16px;
    margin-top: -4px;
  }
  ._1gVVmSnHZpkUgVShsn7-ua {
    margin: 0 auto;
    bottom: 0;
    left: 0;
    right: 0;
  }
  ._1_TJAX-8zAT3vVN1Iz7cys {
    -ms-flex-align: center;
    align-items: center;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-pack: justify;
    justify-content: space-between;
    margin: 0 auto;
    min-width: 260px;
  }
  ._1_TJAX-8zAT3vVN1Iz7cys {
    padding: 0 16px;
  }

</style>
