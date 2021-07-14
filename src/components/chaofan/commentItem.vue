<template>
 <div>
     <div v-for="(item,index) in treeData" :key="index" class="comment_item">
        <div :class="['c_left',{'c_left2':ISPHONE}]">
            <!-- <img @click.stop="doZanComment(1,item)" src="../../assets/images/icon/up.png" alt=""> -->
            <img
                v-if="item.vote != 1"
                @click.stop="doZanComment(1, item)"
                src="../../assets/images/icon/up.png"
                alt=""
            />
            <img
                v-if="item.vote == 1"
                @click.stop="doZanComment(1, item)"
                src="../../assets/images/icon/up_active.png"
                alt=""
            />
            <p></p>
            <img
                v-if="item.vote != -1"
                @click.stop="doZanComment(2, item)"
                src="../../assets/images/icon/down.png"
                alt=""
            />
            <img
                v-if="item.vote == -1"
                @click.stop="doZanComment(2, item)"
                src="../../assets/images/icon/down_active.png"
                alt=""
            />
            <!-- <img @click.stop="doZanComment(2,item)" src="../../assets/images/icon/down.png" alt=""> -->
        </div>
        <div class="c_content">
            <div class="user_info">
                <img :src="imgOrigin+item.userInfo.icon" alt="">
                <span  @click.stop="toUser(item.userInfo)" class="username">{{item.userInfo.userName}}</span>
                <span class="time">{{moment.duration(moment(item.gmtCreate) - moment()).humanize(true)}}</span>
                <div class="zan_shu" style="display:inline-block;padding-left:20px;"> <span>{{item.ups - item.downs}}个赞</span></div>
                <div v-if="ISPHONE" @click="toReplay2(item)" class="zan_shu" style="display:inline-block;padding-left:20px;">回复</div>
                <div v-else @click="toReplay(item)" class="zan_shu" style="display:inline-block;padding-left:20px;">回复</div>
                <div v-if="item.canDeleted" @refreshDelete="refreshDelete" @click="deleteComment(item)" class="to_delete">删除</div>
            </div> 
            <div class="content">
                {{item.text}}
                <span v-if="item.imageNames" class="comImgs">
                    <viewer :images="doImgs(item.imageNames)">
                        <div v-for="(i,k) in item.imageNames.split(',')" :key="k">
                            
                            <span class="aaa" :data-source="imgOrigin+i">
                                【附图】
                                <img  style="opacity:0;" :src="imgOrigin+i+'?x-oss-process=image/resize,h_60'" :data-source="imgOrigin+i" >
                                <img  class="futu" :src="imgOrigin+i+'?x-oss-process=image/resize,h_150'" :data-source="imgOrigin+i" >
                            </span>
                        </div>
                    </viewer>
                    <!-- <a v-for="(i,k) in item.imageNames.split(',')" :key="k" :href="imgOrigin+i" target="_blank">【附图】</a> -->
                </span>
                
            </div>
            <!-- <div v-if="item.type=='media'" class="comImgs">
                <img v-for="(i,k) in item.imageNames.split(',')" :key="k" :src="imgOrigin+i+''" alt="">
            </div> -->
            <!-- <div  v-if="item.type=='media'"  class="comImgs" >
                <a v-for="(i,k) in item.imageNames.split(',')" :key="k" :href="imgOrigin+i" target="_blank">[附图]</a>
            </div> -->
            <!-- {{replayItem}}{{item.id}} -->
            <div v-if="replayItem&&(replayItem.id==item.id)" class="replayInput">
                <textarea v-model="comment" :placeholder="replayItem?'我对'+replayItem.userInfo.userName+'说：':'发表你的想法'" class="t_rep" name="" id="" cols="30" rows="10"></textarea>
                <div style="overflow:hidden;padding:10px 0;">
                    <div style="float:left;">
                        <a v-if="images.length" :href="imgOrigin+images[0]" target="_blank">[附图]</a>
                    </div>
                    <div style="float:right;">
                        <el-upload
                        class="avatar-uploader"
                        action="/api/upload_image"
                        name="file"
                        :data="filedata"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        style="display:inline-block;"
                        >
                         <img style="vertical-align:middle;margin-right:10px;cursor:pointer;" src="../../assets/images/icon/choose.png" alt="">
                        
                        </el-upload>
                       
                        <span v-if="replayItem&&(replayItem.id==item.id)" @click="toSub" class="fabu">发布</span>
                    </div>
                    <!-- <div class="icons" style="padding: 4px 20px 0;float:right;">
                        <img @click="showIcons" style="width:24px;height:24px;" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=105646479,4120396531&fm=26&gp=0.jpg" alt="">
                        <div  class="emoji">
                        <span v-for="(item,index) in icons" @click="chooseEmoji(item)" :key="index">{{item}}</span>
                        </div>
                    </div> -->
                    
                </div>
            </div>
            <div v-if="item.children&&item.children.length">
                <commentitem @rep="rep" @refreshComment="refreshComment" @refreshDelete="refreshDelete" @toReplay2="toReplay2" :showRep="showR" :treeData="item.children"></commentitem>
                <!-- <div  v-for="(item,index) in item.children" :key="index" class="comment_item">
                    <div class="c_left">
                        <img @click.stop="doZanComment(1,item)" src="../../assets/images/icon/up.png" alt="">
                        <p></p>
                        <img @click.stop="doZanComment(2,item)" src="../../assets/images/icon/down.png" alt="">
                    </div>
                    <div class="c_content">
                        <div class="user_info">
                            <img :src="imgOrigin+item.userInfo.icon" alt="">
                            <span  @click.stop="toUser(item.userInfo)" class="username">{{item.userInfo.userName}}</span>
                            <span class="time">{{moment.duration(moment(item.gmtCreate) - moment()).humanize(true)}}</span>
                            <div class="zan_shu" style="display:inline-block;padding-left:20px;"> <span>{{item.ups - item.downs}}个赞</span></div>
                            <div @click="toReplay(item)" class="zan_shu" style="display:inline-block;padding-left:20px;">回复</div>
                        </div> 
                        <div class="content">
                            {{item.text}}
                        </div>
                    </div>
                </div> -->
            </div>
            
        </div>
    </div>
 </div>
</template>

<script>
import * as api from '../../api/api'
import moment from 'moment'
 export default {
   name: 'commentitem',
   data(){
     return {
         
         showIcon: false,
         moment: moment,
         replayItem: null,
         showR: false,
         comment: '',
         userinfo: this.$store.state.user.userInfo,
         canSub: true,
         icons: [
            '😀','😃','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','😍','😘','🤪','😝','👍','🤝','🙏','💪','👏','✍️','💔','👮‍♂️','☠️','👽'
        ],
         images: [],
         filedata: {},
     }
   },
   props: {
       treeData: {
           type: Array,
           default(){
               return []
           }
       },
       showRep: {
           type: Boolean,
           default: false
       }
   },
   components: {

   },
   created() {
   },
   mounted() {
     
   },
   methods: {
    doImgs(item){
        console.log('item.imageNames',item)
        var a = item.split(',');
        a.forEach(it=>{
            it = this.imgOrigin + it;
        })
        this.is = a;
    },
    handleAvatarSuccess(res, file) {
    
        console.log(this.filedata)
        console.log(res);
        if(res.success){
            this.imageUrl = URL.createObjectURL(file.raw);
            this.images.push(res.data);
        }else if(res.errorCode=='invalid_content'){
            // this.imageUrl = ''
            this.$toast(res.errorMessage)
        }
    
    },
    beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 20;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 20MB!');
          return false
        }
        this.filedata.fileName = file.name
        return true
      },
    showIcons(){
      this.showIcon = true
    },
    toReplay2(item){
        this.$emit('toReplay2',item)
    },
       toReplay(item){
        //    this.replayItem = null;
            this.$set(this,'replayItem',item)
            // this.replayItem = item;
            this.$emit('rep',item)
            this.showR = true
        },
    rep(item){
        this.replayItem = item;
    },
    refreshComment(obj){
        this.$emit('refreshComment',obj)
    },
    refreshDelete(item){
        this.$emit('refreshDelete',item)
    },
    deleteComment(item){
        api.deleteComment({commentId:item.id}).then(res=>{
            if(res.success){
                this.$toast('删除成功');
                this.refreshDelete(item);
                // this.treeData.splice(index,1);
            }
        })
    },
     toSub(){

       this.doLoginStatus().then(res=>{
         let comment = this.comment;
         if(res){
           if(!this.comment) return;
           let params = {
             parentId: this.replayItem&&this.replayItem.id?this.replayItem.id:'',
             postId: this.replayItem.postId,
             comment: this.comment,
             imageNames: this.images.join(',')
           }
           console.log(this.comment);
           api.addComments(params).then(res=>{
             if(res.success){
               this.$toast('评论成功');
               this.images = [];
               setTimeout(()=>{
                 let obj = {
                   parentId: this.replayItem?this.replayItem.id:0,
                   text: this.comment,
                   type: 'text',
                   downs: 0,
                   ups: 0,
                   userInfo: this.userinfo
                 };
                 this.$emit('refreshComment',res.data)
                 this.replayItem = null
                 this.comment = ''
                 this.canSub = true;

                 // this.comment = '';
                 // this.treeData = this.transformTree(this.lists)
               },1500)
             }
           })

         }else{
           console.log('未登录',res)
         }
       })
     },
    doZanComment(v,item){
        if(v==1){
            if(item.vote==0){
                item.vote = 1;
                item.ups += 1;
            }else if(item.vote==-1){
                item.vote = 1;
                item.ups += 2;
            }else{
                item.vote = 0;
                item.ups -= 1;
            }
            api.upvoteComment({commentId:item.id}).then(res=>{
            })
        }else{
            if(item.vote==0){
                item.vote = -1;
                item.ups -= 1;
            }else if(item.vote==1){
                item.vote = -1;
                item.ups -= 2;
            }else{
                item.vote = 0;
                item.ups += 1;
            }
            api.downvoteComment({commentId:item.id}).then(res=>{
                
            })
       }
    },
   }
 }
</script>

<style type='text/scss' lang='scss' scoped>
.comment_item{
    padding-top: 4px;
    display: flex;
    border-top: 1px solid #f1f1f1;
    border-left: 1px solid #f1f1f1;
    padding: 10px 0 0px 0px !important;
    .c_left{
        flex: 0 0 40px;
        text-align: center;
        img{
          width: 20px;
        }
        i{
            font-size: 18px;
            cursor: pointer;
        }
    }
    .c_left2{
        flex: 0 0 24px;
    }
    .c_content{
        flex: 1;
        
        .user_info{
            img{
                width: 24px;
                height: 24px;
                vertical-align: middle;
                border-radius: 50%;
                margin-right: 6px;
            }
            .username{
                color: #1890ff;
                padding-right: 20px;
                cursor: pointer;
                &:hover{
                    text-decoration: underline;
                }
            }
            .time{
                color: #999;
                font-size: 12px;
            }
            .zan_shu{
                color: #999;
                cursor: pointer;
                img{
                    width: 24px;
                    height: 24px;
                    margin-right: 4px;
                }
            }
        }
        .content{
            font-size: 16px;
            padding: 8px 0;
            line-height: 24px;
            text-align: left;
        }
    }
}
.replayInput{
    padding-bottom: 4px;
    .t_rep{
        border: 1px solid #ddd;
        width: 100%;
        box-sizing: border-box;
        height: 60px;
        resize: none;
        border-radius: 4px;
        padding: 4px 10px;
    }
}
 .fabu{
     float: right;
     color: #fff;
     background: royalblue;
     padding: 2px 10px;
     border-radius: 4px;
     font-size: 14px;
     cursor: pointer;
 }
 .to_delete{
     float: right;
     font-size: 13px;
     color: #999;
     cursor: pointer;
 }
 .icons{
  text-align: right;
  height: 60px;
  &:hover .emoji{
    display: block;
  }
}
.emoji{
  // position: absolute;
  z-index: 1;
  width: 80%;
  top: 66px;
  left: 0;
  line-height: 34px;
  padding: 10px !important;
  border: 1px solid #d1d1d1;
  background: #fff;
  display: none;
  text-align: left;
  span{
    font-size: 24px;
    padding: 2px;
    cursor: pointer;
  }
}
.comImgs{
    padding-bottom: 10px !important;
    img{
        width: 100px;
        height: 100px;
        border-radius: 4px;
        margin-right: 6px;
    }
    div{
        display: inline-block;
    }
}
.aaa{
    position: relative;
    width: 50px;
    height: 30px;
    // background: #ddd;
    color: #1890ff;
    &:hover{
        color: red;
        .futu{
            opacity: 1;
            width: 150px;
            height: auto;
            left: 60px;
            top: 0;
        }
    }
    img{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        opacity: 0;
    }
}
</style>
