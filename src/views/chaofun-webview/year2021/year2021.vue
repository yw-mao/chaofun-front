<template>
  <div style="padding-left: 10px; padding-right: 10px">

<!--头像-->
    <div v-if="userInfo">
<!--      <div class="year_2021_title" style="font-weight: bold; font-size: 24px; color: #FF9300;">一切的开始-->
<!--      </div>-->
<!--      <div style="height: 50px;">-->
<!--        <img  style="display: inline-block; height: 100%" :src="imgOrigin + this.userInfo.icon" />-->
<!--        <div style="display: inline-block; height: 100%; width: 100px; vertical-align: top;">-->
<!--        <div style="display: table-cell; height: 50px; vertical-align: middle;">-->
<!--          {{userInfo.userName}}-->
<!--        </div>-->
<!--        </div>-->
<!--      </div>-->
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        在炒饭
      </div>
      <div>你注册于 {{moment(year2021.register_time).format('YYYY年MM月DD日 HH:mm:ss')}}</div>
      <div>成为 {{year2021.total_users}} 名饭友中的一员</div>
      <div>炒饭已经陪伴了你 {{parseInt((moment() - year2021.register_time) / 1000 / 60 / 60 / 24)}} 天</div>
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        你的 Fun 2021
      </div>
      <div>2021年，你使用了炒饭 {{year2021.minutes}} 分钟 </div>
      <div>2021年，你发布了 {{year2021.posts}} 篇帖子</div>
      <div>2021年，你浏览了 {{year2021.total_upvotes}} 篇帖子</div>
      <div>2021年，你评论了 {{year2021.most_like_forum_comments}} 次</div>
      <div>2021年，你点赞了 {{year2021.total_ups}} 次</div>
      <div>2021年，你收藏了 {{year2021.total_saves}} 篇帖子</div>
      <div>新的一年，希望炒饭能让你找到更多乐趣，发现更大的世界.</div>
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        你收获的
      </div>
      <div>2021年，你收获了 {{year2021.total_ups}} 个赞, 全站排名第 {{year2021.total_ups_rank}}</div>
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        你最喜欢的版块
      </div>
      <div style="height: 30px;">
        <img  style="display: inline-block; height: 100%" :src="imgOrigin + this.year2021.most_like_forum.imageName" />
        <div style="display: inline-block; height: 100%; width: 100px; vertical-align: top;">
          <div style="display: table-cell; height: 30px; vertical-align: middle; padding-left: 10px">
            {{year2021.most_like_forum.name}}
          </div>
        </div>
      </div>
      <div>在这里, 你发布了 {{year2021.most_like_forum_posts ? year2021.most_like_forum_posts : 0}} 篇帖子, 浏览了 {{year2021.most_like_forum_shows}} 篇帖子，点赞了 {{year2021.most_like_forum_upvotes}} 次，发出了 {{year2021.most_like_forum_comments}} 条评论，收藏了 {{year2021.most_like_forum_saves}} 篇帖子 </div>
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        你最赞赏的用户
      </div>
      <div style="height: 30px;">
        <img  style="display: inline-block; height: 100%" :src="imgOrigin + this.year2021.most_like_user.icon" />
        <div style="display: inline-block; height: 100%; width: 100px; vertical-align: top;">
          <div style="display: table-cell; height: 30px; vertical-align: middle; padding-left: 10px">
            {{year2021.most_like_user.userName}}
          </div>
        </div>
      </div>
      <div>你看了TA发布的 {{year2021.most_like_user_shows}} 篇帖子，点赞了TA {{year2021.most_like_user_upvotes}} 次，评论了TA {{year2021.most_like_user_comments}} 次，收藏了TA {{year2021.most_like_user_saves}} 篇帖子 </div>
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        谁最关注你
      </div>
      <div style="height: 30px;">
        <img  style="display: inline-block; height: 100%" :src="imgOrigin + this.year2021.most_be_like_user.icon" />
        <div style="display: inline-block; height: 100%; width: 100px; vertical-align: top;">
          <div style="display: table-cell; height: 30px; vertical-align: middle; padding-left: 10px">
            {{year2021.most_be_like_user.userName}}
          </div>
        </div>
      </div>
      <div>TA看了你发布的 {{year2021.most_be_like_user_shows}} 篇帖子, 点赞了你 {{year2021.most_be_like_user_upvotes}} 次，评论了你 {{year2021.most_be_like_user_comments}} 次，收藏了你 {{year2021.most_be_like_user_saves ?  year2021.most_be_like_user_saves : 0}} 篇帖子 </div>
      <div class="year_2021_title" style=" font-weight: bold; font-size: 24px; color: #FF9300">
        你获得的年度徽章
      </div>

    </div>
    <div v-else>
      请先登录
    </div>



  </div>

</template>

<script>
import * as api from '@/api/api'
import moment from 'moment'
export default {
  name: "Year2021.vue",

  data() {
    return {
      userInfo: {},
      year2021: {},
      moment: moment,
    }
  },
  created() {
    api.getUserInfo().then(
        res => {
          if (res.success && res.data) {
            this.userInfo = res.data;
          } else {
            this.$toast('请先登录');
          }
        }
    );
    api.getByPath('/api/v0/getYear2021', null).then(res => {
      if (res.success) {
        this.year2021 = res.data;
      } else {
      }
    })
  },
  mounted() {

  },

  methods: {

  }
}
</script>

<style scoped>

  .year_2021_title {
  }

</style>