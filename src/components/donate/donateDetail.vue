<template>
  <div style="margin: 5px 10px;text-align: center;">

    <div style="position: relative;float: right; right: 10px;top: 5px;">
      <!--      <el-button type="primary" @click="">捐赠记录</el-button>-->
      <el-button type="warning" @click="donateDialogVisible=true;">捐赠</el-button>
    </div>

    <div class="selectDisable" style="position: relative;width: 100%;height: 0;">
      <div style=" width: 0;height: 0; margin: 0 auto;">
        <img
          :src="imgOrigin + 'biz/a7a11ce394ec3bad0f25f4aead7855ec.png'"
          alt="" style="width: 40px;height: 40px;border-radius: 100%; position: relative;top:12px; left: -80px;" />
      </div>
    </div>

    <div class="selectDisable" style="height: 60px;text-align: center;width: 100%;">
      <div class="box" style="height: 60px; padding-top: 5px; width: 85px;margin: 0 auto;">
        <div class="front" style="width: 100%;">
          <div style="width: 100%;color: #e85827;font-size: 24px;">{{ remainFbi }}</div>
          <div style="width: 100%;font-size: 12px;color: #999;">剩余FBi</div>
        </div>
        <div class="back_info" style="width: 100%;">
          <div style="width: 100%;color: #ffba00;font-size: 24px;">{{ totalFbi }}</div>
          <div style="width: 100%;font-size: 12px;color: #999;">总捐赠</div>
        </div>
      </div>
    </div>


    <div class="selectDisable" style="margin: 10px 0 20px 0;">

      <el-table :data="donateFbiList" :highlight-current-row="true" :row-class-name="tableRowClassName"
                style="width: 100%;max-width: 600px;margin: 0 auto;">

        <!-- rank -->
        <el-table-column align="center" label="排名" width="100">
          <template slot-scope="item">
            <span v-if="item.row.rankImg">
             <img
               :src="item.row.rankImg"
               alt="" style="width: 40px;height: 40px;" />
            </span>
            <span v-else> {{ item.row.rank }}</span>
          </template>
        </el-table-column>


        <!-- userInfo -->
        <el-table-column align="left" header-align="left" label="用户">
          <template slot-scope="item">
            <span style="cursor: pointer;" @click="toUser(item.row.userInfo.userId)">
               <span v-if="item.row.rankImg" style="display: flex;">
                  <img
                    :src="imgOrigin + item.row.userInfo.icon+ '?x-oss-process=image/resize,h_40/format,webp/quality,q_75'"
                    alt="" style="width: 40px;height: 40px;border-radius: 100%;" />
                  <span
                    style="margin:auto 0 auto 10px;font-weight: bold;">{{ item.row.userInfo.userName }}</span>
               </span>
               <span v-else style="display: flex;">
                  <img
                    :src="imgOrigin + item.row.userInfo.icon+ '?x-oss-process=image/resize,h_24/format,webp/quality,q_75'"
                    alt="" style="width: 24px;height: 24px;border-radius: 100%;" />
                  <span
                    style="margin:auto 0 auto 10px;">{{ item.row.userInfo.userName }}</span>
               </span>
            </span>
          </template>
        </el-table-column>

        <!-- totalDonate -->
        <el-table-column align="right" header-align="right" label="FBi" prop="totalDonate"
                         width="80"></el-table-column>

        <!-- empty -->
        <div slot="empty" style="cursor: pointer;" @click="donateDialogVisible=true">点我！当榜一大哥！</div>

      </el-table>
    </div>

    <el-dialog :append-to-body="true" :visible.sync="donateDialogVisible" title="捐赠">
      <div style="text-align: center;">
        <div style="font-weight: bold;width: 100%;">金额</div>
        <div style="">
          <el-input-number v-model="fbi" :min=5 :step=5 />
        </div>
        <div style="margin-top: 20px;">
          <div style="font-weight: bold;width: 100%;">赠言</div>
          <el-input v-model="reason" autocomplete="off" style="width: 200px;"></el-input>
        </div>

        <div style="margin-top: 20px">
          <el-button type="primary" @click="donateFbi">捐赠</el-button>

          <!--  助力卷王！  -->
          <el-button @click="isShowDonateAssist=!isShowDonateAssist" style="position: absolute;right: 5px;">小助手</el-button>
        </div>

        <div v-if="isShowDonateAssist">
          <hr style="margin-top: 20px;background-color:#ccc;height:1px;border:none;">

          <div style="margin-top: 20px;text-align: center;">

            <div style="font-weight: lighter;width: 100%;">我的捐赠</div>
            <table style="margin: 5px auto 0 auto;text-align: right;">
              <tr>
                <td>已捐赠：</td>
                <td>{{ myDonate ? myDonate.totalDonate : 0 }}</td>
              </tr>
              <tr>
                <td>当前排名：</td>
                <td style="text-align: center;">{{ myDonate ? myDonate.rank : "无" }}</td>
              </tr>
            </table>

            <div style="margin-top: 20px;font-weight: lighter;width: 100%;">捐赠预估</div>
            <table style="margin: 5px auto 0 auto;text-align: right;">
              <tr>
                <td>捐赠后总额：</td>
                <td>{{ (myDonate ? myDonate.totalDonate : 0) + fbi }}</td>
              </tr>
              <tr>
                <td>捐赠后排名：</td>
                <td style="text-align: center;">{{ rankAfterDonate }}</td>
              </tr>
            </table>
          </div>
        </div>

      </div>
    </el-dialog>

  </div>
</template>

<script>

import * as api from "@/api/api";

export default {
  props: {
    forumId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      donateDialogVisible: false,
      fbi: 100,
      reason: "",

      totalFbi: 0,
      remainFbi: 0,

      donateFbiList: [],

      isShowDonateAssist: false,
      myUserId: null,
      myDonate: null,
      rankAfterDonate: 0
    };
  },
  watch: {
    fbi(newValue) {
      this.assistCalcRank(newValue);
    },
    donateDialogVisible() {
      this.fbi = 100;
      this.reason = "";
      this.assistCalcRank( this.fbi);
    }
  },
  components: {},
  created() {
    this.myUserId = this.$store.state.user.userInfo.userId;
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {

      //
      api.getDonateFbi({
        forumId: this.forumId
      }).then(res => {
        if (res && res.success && res.data) {
          this.totalFbi = res.data.totalFbi;
          this.remainFbi = res.data.remainFbi;
        }
      });

      //
      api.getDonateOrder({
        forumId: this.forumId
      }).then(res => {

        // 数据处理
        if (res && res.success && res.data) {

          let currentRank = 0;
          let currentTotalDonate = -1;
          res.data.forEach((row, index) => {

            // 排名
            if (row.totalDonate === currentTotalDonate) {
              row.rank = currentRank;
            } else {
              row.rank = index + 1;
            }
            currentTotalDonate = row.totalDonate;
            currentRank = row.rank;

            // 我的
            if (this.myUserId && row.userInfo.userId == this.myUserId) {
              this.myDonate = row;
            }

            // 图片
            if (row.rank === 1 || row.rank === 2 || row.rank === 3) {
              let image;
              if (row.rank === 1) {
                image = "biz/5bc9173a1a4dd54120e0083893d524c9.png";
              } else if (row.rank === 2) {
                image = "biz/4f7e167e5ee7594626a43fbc93020dbf.png";
              } else {
                image = "biz/32b3f8bba180e2256489ec4ecd9c1dc9.png";
              }
              if (image) {
                row.rankImg = this.imgOrigin + image + "?x-oss-process=image/resize,h_40/format,webp/quality,q_75";
              }
            }

          });

          this.donateFbiList = res.data;
        }

      });

    },

    assistCalcRank(newValue) {
      let fbiAfterDonate = (this.myDonate ? this.myDonate.totalDonate : 0) + newValue;

      let rankAfterDonateTemp = 0;
      this.donateFbiList.forEach((row, index) => {
        if (!rankAfterDonateTemp && fbiAfterDonate >= row.totalDonate) {
          rankAfterDonateTemp = row.rank;
        }
      });
      this.rankAfterDonate = rankAfterDonateTemp;
    },

    donateFbi() {

      api.donateFbi(
        {
          forumId: this.forumId,
          fbi: this.fbi,
          reason: this.reason
        }
      ).then(res => {
        this.donateDialogVisible = false;

        if (res && res.success) {
          this.$toast("捐赠成功！");
        }
        this.init();
      });

    },

    toUser(userId) {
      try {
        window.flutter_inappwebview.callHandler("toAppUser", { userId: userId + "" });
      } catch (e) {
        window.open(location.origin + "/user/" + userId, "_blank");
      }
    },

    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2) {
        return "noRankStyle2";
      }
      return "";

      // if (row.rank === 1) {
      //  return "rank1Style";
      // } else if (row.rank === 2) {
      //  return "rank2Style";
      // } else if (row.rank === 3) {
      //  return "rank3Style";
      // } else if (rowIndex % 2) {
      //  return "noRankStyle1";
      // }
      // return "noRankStyle2";
      //
      // if (rowIndex % 2) {
      //  return "noRankStyle";
      // }
      // return "";
    }

  }

};
</script>

<style scoped>

.selectDisable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.box {
  transform-style: preserve-3d;
}

.box .front {
  text-align: center;
  position: absolute;
  transform: perspective(150px) rotateY(0deg);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: all 800ms ease;
}

.box .back_info {
  text-align: center;
  position: absolute;
  transform: rotateY(150deg);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: all 800ms ease;
}

.box:hover .front {
  transform: perspective(150px) rotateY(150deg);
}

.box:hover .back_info {
  transform: perspective(150px) rotateY(0deg);
}

/deep/ .el-button {
  padding: 8px 10px;
}

/deep/ .el-dialog {
  width: 350px !important;
  max-width: 95vw !important;
  border-radius: 5px;
}

/deep/ .el-dialog__body {
  padding: 10px 10px 30px 10px;
}

/deep/ .el-table .rank1Style {
  background: #edf1fd;
}

/deep/ .el-table .rank2Style {
  background: #fff;
}

/deep/ .el-table .rank3Style {
  background: #edf1fd;
}

/deep/ .el-table .noRankStyle1 {
  background: #fff;
}

/deep/ .el-table .noRankStyle2 {
  background: #f6f6f6;
}

</style>