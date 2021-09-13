<template>
  <div>
    <h1>
      <div>
        <div v-if="item.isPin" style="display: inline-block">
          <img
            class="icon icon2"
            :src="
              imgOrigin +
              'biz/daa54c993451a77d3e723405afbcd15c.png?x-oss-process=image/resize,h_80'
            "
            alt=""
          />
          <span class="zhiding">版主置顶</span>
        </div>

        <img
          v-if="isindex"
          class="icon"
          :src="
            imgOrigin +
            item.forum.imageName +
            '?x-oss-process=image/resize,h_80'
          "
          alt=""
        />
        <span @click.stop="" v-if="isindex" class="module_name">
          <b @click.stop="toForum(item)"> {{ item.forum.name }} </b>
          <div class="hovercon">
            <div>
              <img
                style=""
                class="imgs"
                :src="
                  imgOrigin +
                  item.forum.imageName +
                  '?x-oss-process=image/resize,h_80'
                "
                alt=""
              />
              <i style="font-style: normal; font-size: 16px">{{
                item.forum.name
              }}</i>
            </div>
            <div class="shu">
              <div style="display: flex; justify-content: space-around">
                <div>{{ item.forum.followers }}</div>
                <div>{{ item.forum.posts }}</div>
              </div>
              <div style="display: flex; justify-content: space-around">
                <div>粉丝</div>
                <div>贴子</div>
              </div>
            </div>
            <div style="text-align: center">
              <el-button
                @click.stop="
                  toUrls(item, { url: '/f/' + item.forumId, routeType: 1 })
                "
                type="success"
                size="mini"
                >进入板块</el-button
              >
            </div>
          </div>
        </span>
        来自
        <span class="username username_toHover">
          <b @click.stop="toUser(item.userInfo)">{{
            item.userInfo ? item.userInfo.userName : "测试账号"
          }}</b>
          <div
            v-if="item.userInfo"
            :class="['hovercon', { hovercon2: !item.userInfo.desc }]"
          >
            <div style="display: flex">
              <img
                @click.stop="toUser(item.userInfo)"
                style="width: 40px; height: 40px"
                class="imgs"
                :src="
                  imgOrigin +
                  item.userInfo.icon +
                  '?x-oss-process=image/resize,h_80'
                "
                alt=""
              />
              <div>
                <i
                  @click.stop="toUser(item.userInfo)"
                  style="font-style: normal; font-size: 16px"
                  >{{ item.userInfo.userName }}</i
                >
                <p style="font-size: 12px; color: #999">
                  获赞：{{ item.userInfo.ups }}
                </p>
              </div>
            </div>
            <div v-if="item.userInfo.desc" class="shu">
              <div>{{ item.userInfo.desc }}</div>
            </div>
            <div v-if="!item.userInfo.desc" style="height: 15px"></div>
            <div style="text-align: center">
              <el-button
                @click.stop="
                  toAttention(
                    item.userInfo.focused,
                    item.userInfo.userId,
                    item.userInfo
                  )
                "
                :type="item.userInfo.focused ? 'info' : 'success'"
                size="mini"
              >
                {{ item.userInfo.focused ? "取消关注" : "关注" }}
              </el-button>
            </div>
          </div>
        </span>
        <span
          >大约
          {{
            moment.duration(moment(item.gmtCreate) - moment()).humanize(true)
          }}</span
        >
      </div>
      <!-- <div v-if="isMy&&datas.type=='pub'" @click.stop="deletePost(item,index)" class="delete">删除</div> -->
      <div @click.stop="" class="delete" v-if="item.canDeleted">
        <!-- @click.stop="deletePost(item,index)" -->
        <!-- <i class="el-icon-delete"></i> 删除 -->
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <!-- 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> -->
            <i class="el-icon-more" style="font-size: 24px"></i>
          </span>
          <el-dropdown-menu style="width:150px;" slot="dropdown">
            <el-dropdown-item command="添加标签">
              <div @click.stop="toadd" class="addTag">添加标签 ></div>
            </el-dropdown-item>
            <div v-if="showTag" class="showTags">
              <div v-if="tagList.length">
                <!-- <div
                  @click="clickTagAdd(it)"
                  class="k"
                  v-for="(it, ins) in tagList"
                  :key="ins"
                >
                  <el-dropdown-item command="">
                    <div class="addTag">{{ it.name }}</div>
                  </el-dropdown-item>
                </div> -->
                <el-checkbox-group @change="aaa" v-model="tags">
                  <div class="k" v-for="(it, ins) in tagList" :key="ins">
                    <el-checkbox
                      @change="changeBox($event, it)"
                      :label="it.id"
                      :value="it.name"
                      >{{ it.name }}</el-checkbox
                    >
                  </div>
                </el-checkbox-group>
              </div>
              <div v-else>暂无标签</div>
            </div>
            <el-dropdown-item v-if="item.canChangeTitle" command="加入合集">
              <div @click.stop="toCollect" class="addTag">加入合集 ></div>
            </el-dropdown-item>
            <div v-if="showCollect" class="showTags">
              <div v-if="collectList.length">
                <div class="k" v-for="(it, ins) in collectList" @click="postCollect(it)" :key="ins">
                    {{ it.name }}
                </div>
                <!-- <el-radio-group @change="aaa" v-model="tags">
                  <div class="k" v-for="(it, ins) in collectList" :key="ins">
                    <el-radio
                      @change="changeBox($event, it)"
                      :label="it.id"
                      :value="it.name"
                      >{{ it.name }}</el-radio
                    >
                  </div>
                </el-radio-group>
                <div class="k add_collect" >新增合集</div> -->
              </div>
              <div v-else class="add_collect" >新增合集</div>
            </div>
            <el-dropdown-item
              v-if="item.forum.admin && !item.isPin"
              command="置顶"
              >置顶</el-dropdown-item
            >

            <el-dropdown-item
              v-if="item.forum.admin && item.isPin"
              command="取消置顶"
              >取消置顶</el-dropdown-item
            >
            <el-dropdown-item v-if="item.forumAdmin&&item.disableComment" command="开启评论">开启评论</el-dropdown-item>
            <el-dropdown-item v-if="item.forumAdmin&&!item.disableComment" command="关闭评论">关闭评论</el-dropdown-item>
            <el-dropdown-item command="删除">删除帖子</el-dropdown-item>
            <el-dropdown-item command="关闭">关闭</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </h1>
    <dialogs :visible="dialogVisible">
      <template slot="content">
        <h1>this is slot2</h1>
      </template>
    </dialogs>
  </div>
</template>

<script>
import * as api from "@/api/api";
import { Dialog } from "vant";
import "vant/lib/dialog/style";
import "moment/locale/zh-cn";
import moment from "moment";

import dialogs from "../common/dialogs.vue";
export default {
  name: "",
  data() {
    return {
      dialogVisible: false,
      hasGetCollect: false,
      showCollect: false,
      collectList: [],
      checkList: [],
      moment: moment,
      showTag: false,
      tagList: [],
      hasGetTag: false,
      tags: [],
    };
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    isindex: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  components: {
    dialogs
  },
  created() {
    if (this.item.tags.length) {
      this.item.tags.forEach((item) => {
        this.tags.push(item.id);
      });
    }
  },
  mounted() {},
  methods: {
    postCollect(it){
      let params  = {
        postId: this.item.postId,
        collectionId: it.id
      }
      api.addPostCollection(params).then(res=>{
        if(res.success){
          this.$toast('加入合集成功');
        }
      })
    },
    addCollection(){
      api.addCollection({name: '测试合集_2'}).then(res=>{
        this.userCollectionList()
      })
    },
    toAddCol(){
      // this.dialogVisible = true;
      this.addCollection();
    },
    aaa(e) {
      console.log(e);
    },
    doStatus(it) {
      let checked = false;
      this.tagList.forEach((item) => {
        if (item.id == it.id) {
          checked = true;
        }
      });
      return checked;
    },
    changeBox(e, it) {
      console.log(e);
      console.log(it);
      this.tags = [];
      if (e) {
        this.tags.push(it.id);
        this.clickTagAdd(it);
      } else {
        api
          .removeTag({
            postId: this.item.postId,
            tagId: it.id,
          })
          .then((res) => {});
      }
      this.$EventBus.$emit("refreshItemTag", {
        index: this.index,
        tag: it,
        type: e,
      });
    },
    clickTagAdd(it) {
      let params = {
        postId: this.item.postId,
        tagId: it.id,
      };
      api.addTag(params).then((res) => {
        if (res.success) {
          this.$toast("添加标签成功");
        }
      });
    },
    toadd() {
      if (this.hasGetTag) {
        this.showTag = !this.showTag;
      } else {
        this.getForumTag();
      }
    },
    toCollect(){
      if (this.hasGetCollect) {
        this.showCollect = !this.showCollect;
      } else {
        this.userCollectionList();
      }
    },
    userCollectionList(){
      api.userCollectionList().then(res=>{
        this.collectList = res.data;
        this.hasGetCollect = true;
        this.showCollect = !this.showCollect;
      })
    },
    getForumTag() {
      api.getlistTag({ forumId: this.item.forum.id }).then((res) => {
        this.tagList = res.data;
        this.hasGetTag = true;
        this.showTag = !this.showTag;
      });
    },
    handleCommand(command) {
      // this.$message('click on item ' + command);
      if (command == "置顶") {
        api.forumpin({ postId: this.item.postId }).then((res) => {
          if (res.success) {
            this.$toast("帖子置顶成功，刷新可查看");
          }
        });
      } else if (command == "取消置顶") {
        api.forumunpin({ postId: this.item.postId }).then((res) => {
          if (res.success) {
            this.$toast("帖子已取消置顶");
            this.$EventBus.$emit("unPin", this.index);
            // this.$emit('deletePost',this.index)
          } else {
            this.$toast(res.message);
          }
        });
      } else if (command == "删除") {
        this.deletePost(this.item, this.index);
      } else if(command == "关闭评论") {
        this.disableComment('close');
        
      }else if(command == "开启评论") {
        this.disableComment('open');
        
      }
    },
    disableComment(v){
      if(v=='close'){
        api.disableComment({postId: this.item.postId}).then(res=>{
          this.item.disableComment = true;
          this.$toast('该帖已关闭评论')
          if(res.success){
            this.$EventBus.$emit("resetItem", {index: this.index,item: this.item});
          }
        })
      }else{
        api.enableComment({postId: this.item.postId}).then(res=>{
          this.$toast('该帖已开启评论')
          this.item.disableComment = false;
          if(res.success){
            this.$EventBus.$emit("resetItem", {index: this.index,item: this.item});
          }
        })
      }
      
    },
    toForum(item) {
      localStorage.removeItem("storedata");
      localStorage.removeItem("spage");
      this.toUrls(item, { url: "/f/" + item.forumId, routeType: 1 });
    },
    deletePost(item, index) {
      if (this.ISPHONE) {
        Dialog.confirm({
          title: "删除确认",
          message: `是否确定删除帖子 【${item.title}】？`,
          messageAlign: "left",
        })
          .then(() => {
            api.deletePost({ postId: item.postId }).then((res) => {
              if (res.success) {
                this.$message.success("已删除");
                // this.lists.splice(index,1)
                this.$emit("deletePost", index);
              }
            });
          })
          .catch(() => {
            // on cancel
          });
      } else {
        this.$confirm(`是否确定删除帖子 【${item.title}】？`, "提示", {
          type: "warning",
          // center: true,
          position: "top",
        }).then(() => {
          api.deletePost({ postId: item.postId }).then((res) => {
            if (res.success) {
              this.$message.success("已删除");
              // this.lists.splice(index,1)
              this.$emit("deletePost", index);
            }
          });
        });
      }
    },
    toUrls(item, params) {
      this.postBehavior(item.postId, "jump");
      this.toUrl(params);
    },
    postBehavior(postId, action) {
      api.postBehavior({ postId, action }).then((res) => {});
    },
    toAttention(bool, id, item) {
      if (bool) {
        api.toUnfocus({ focusId: id }).then((res) => {
          if (res.success) {
            // item.focused = !bool;
          }
        });
      } else {
        api.toFocus({ focusId: id }).then((res) => {
          if (res.success) {
            // item.focused = !bool;
          }
        });
      }
      this.$emit("doFocued", bool, id);
    },
  },
};
</script>

<style type='text/scss' lang='scss' scoped>
h1 {
  font-size: 13px;
  color: #666;
  line-height: 20px;
  // min-height: 50px;
  font-weight: normal;
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  position: relative;
  .delete {
    font-size: 12px;
    float: right;
    position: absolute;
    right: 0;
    top: 0;
    color: #999;
    &:hover {
      color: $linkcolor;
    }
  }
  span {
    padding: 0 4px;
  }
  .module_name {
    // color: $linkcolor;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    padding: 6px 0;
    font-size: 13px;
    &:hover .hovercon {
      display: block;
    }
  }
  .username_toHover {
    font-weight: bold;
    cursor: pointer;
    position: relative;
    padding: 6px 0;
    font-size: 13px;
    &:hover .hovercon {
      display: block;
      .shu {
        text-align: left;
        color: #999;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        height: 54px;
        overflow: hidden;
        margin-bottom: 4px;
      }
    }
    .hovercon2 {
      height: 110px;
      .shu {
        margin-top: 20px;
        height: 20px;
      }
    }
  }
  .hovercon {
    font-weight: normal;
    position: absolute;
    z-index: 10;
    border: 1px solid #f1f1f1;
    width: 210px;
    height: 150px;
    padding: 12px !important;
    left: 0;
    top: 24px;
    background: #fff;
    display: none;
    box-shadow: 0 0 4px #f1f1f1;
    border-radius: 4px;
    .shu {
      color: #666;
      font-size: 12px;
      text-align: center;
      padding: 10px 0;
      div {
        flex: 1;
      }
    }
    i {
      font-style: normal;
    }
    span {
      color: #666;
    }
    .imgs {
      width: 30px;
      height: 30px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }

  .icon {
    width: 20px;
    height: 20px;
    vertical-align: top;
  }
}
.zhiding {
  background: #ff9300;
  color: #fff;
  font-size: 12px;
  padding: 0px 4px;
  border-radius: 4px;
  display: none;
}
.addTag {
  color: #606266;
  -moz-user-select: none; /*火狐*/

  -webkit-user-select: none; /*webkit浏览器*/

  -ms-user-select: none; /*IE10*/

  -khtml-user-select: none; /*早期浏览器*/

  user-select: none;
}
.showTags {
  padding: 10px 10px;
  background: #f1f1f1;
  line-height: 30px;
  text-align: left;
  -moz-user-select: none; /*火狐*/

  -webkit-user-select: none; /*webkit浏览器*/

  -ms-user-select: none; /*IE10*/

  -khtml-user-select: none; /*早期浏览器*/

  user-select: none;
  .k {
    padding-left: 8px;
    width: 100%;
    box-sizing: border-box;
    &:hover {
      background: #fff;
      cursor: pointer;
    }
  }
}
.el-radio-group{
  width: 100%;
}
.showCol{
  padding: 20px 10px;
  font-size: 13px;
  .k {
    &:hover {
      background: #fff;
      cursor: pointer;
      color: #ff9300;
    }
  }
}
.k{
  line-height: 40px;
}
.el-radio:last-child{
  vertical-align: middle;
}
.add_collect{
  font-size: 12px;
  border: 1px solid #666;
  color: #666;
  border-radius: 4px;
}
</style>
