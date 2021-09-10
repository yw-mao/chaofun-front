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
                <img :src="imgOrigin+item.userInfo.icon+'?x-oss-process=image/resize,h_40'" alt="">
                <span  @click.stop="toUser(item.userInfo)" class="username">{{item.userInfo.userName}}</span>
                <span class="time">{{moment.duration(moment(item.gmtCreate) - moment()).humanize(true)}}</span>
                <div class="zan_shu" style="display:inline-block;padding-left:20px;"> <span>{{item.ups - item.downs}}个赞</span></div>
                <div v-if="ISPHONE&&(!postInfo.disableComment||postInfo.forumAdmin)" @click="toReplay2(item)" class="zan_shu" style="display:inline-block;padding-left:20px;">回复</div>
                <div v-if="!ISPHONE&&(!postInfo.disableComment||postInfo.forumAdmin)" @click="toReplay(item)" class="zan_shu" style="display:inline-block;padding-left:20px;">回复</div>
                <div v-if="item.canDeleted" @refreshDelete="refreshDelete" @click="deleteComment(item)" class="to_delete">删除</div>
            </div> 
            <div class="content">
                <p v-if="!item.atUsers" v-html="item.text"></p>
                <p v-if="item.atUsers" @click="clickComment($event)" v-html="doText(item)"></p>
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
                <div v-show="showAt" class="atuser">
                    <div v-for="(it,ins) in atUsers" :key="ins" @click="chooseAt($event,it)" class="at_item">
                        {{it.userName}}
                    </div>
                </div>
                <div v-if="replayItem" @click="cancelReplay" style="padding: 6px 0px;cursor:pointer;float:right;">取消回复</div>
                <el-input style="font-size:14px;" 
                v-on:focus="inputFocus" @keyup.native="bindInput" 
                v-on:blur="inputBlur" type="textarea" 
                v-model="comment" class="textarea" 
                :placeholder="replayItem?'我对'+replayItem.userInfo.userName+'说：':'发表你的想法'" 
                :autosize="{ minRows: 2, maxRows: 4}">
                </el-input>
                <div class="reply_button" v-loading="imagesUploading">
                    <div class="subims" v-if="images.length">
                        <a v-for="img in images" :key="img" :href="imgOrigin+img" target="_blank">[附图]</a>
                    </div>
                    <el-button style="height:36px;" type="primary" v-if="replayItem&&(replayItem.id==item.id)" @click="toSub">发布</el-button>
                    <el-upload
                    class="avatar-uploader"
                    action="/api/upload_image"
                    name="file"
                    :data="filedata"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :on-exceed="handleAvatarExceed"
                    :limit="imagesLimit"
                    multiple
                    accept="image/*"
                    style="display:inline-block;"
                    ref="replyImageUpload"
                    >
                        <img style="vertical-align:middle;margin-right:10px;cursor:pointer;" src="../../assets/images/icon/choose.png" alt="">
                    </el-upload>
                    <div class="icons">
                        <img @click="showIcons" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=105646479,4120396531&fm=26&gp=0.jpg" alt="">
                        <div  class="emoji">
                        <span v-for="(item,index) in icons" @click="chooseEmoji(item)" :key="index">{{item}}</span>
                        </div>
                    </div>
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
            imagesUploading: false,
            imagesNum: 0,
            imagesLimit: 9,

            atUsers: [],
            showAt: false,
            canSearch: true,
            curInput: '',
            ats: [],
            pointIndex: '',
            atIndex: '',
            searchkey: '',
            atUserName: []
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
            default: true
        },
        postInfo: {
            type: Object,
            default(){
                return {}
            }
        }
    },
    components: {

    },
    created() {
    },
    mounted() {
        
    },
    watch: {
        showRep: function(val) {
            if (val === false) {
                this.replayItem = null
            }
        }
    },
    methods: {
        clickComment:function (event) {
            
            if(event.target.nodeName === 'SPAN'){
            // 获取触发事件对象的属性
                let key = event.target.getAttribute('key');
                let name = event.target.getAttribute('name');
                this.toUser({userId: key});
            }
        },
        doText(item){
            if(item.atUsers&&item.atUsers.length){
                item.atUsers.forEach((it,ins)=>{
                    console.log(it.userName);
                    let b = it.userName;
                    if(item.text.includes(b)){
                        item.text = item.text.replace('@'+b, '<span key="'+ it.userId +'" class="light" style="color:rgba(24, 144, 255,0.8);font-size:14px;">@'+b+'</span>')
                    }
                })
                
            }
            return item.text;
        },
        chooseAt(e,it){
      // this.comment = this.comment+it.userName+' ';
      if(this.searchkey){
        this.comment = this.comment.replace('@'+this.searchkey,'@'+it.userName+' ')
      }else{
        this.comment = this.comment+it.userName+' ';
      }
      this.searchkey = '';
      this.showAt = false;
      this.ats.push(it.userId);
      this.atUserName.push('@'+it.userName);
      console.log('this.atUserName',this.atUserName)
      console.log(this.$(this.curInput));
      this.$(this.curInput).focus();
      // this.curInput
    },
    bindInput(e){
      console.log(e);
      // let last = e.slice(-1);
      // console.log(last);
      // document.getElementById('')
      let index = e.target.selectionStart;//光标位置
      this.pointIndex = index;
      if(this.comment.includes('@')){
        this.curInput = e.target;
        let s = this.comment.slice(0,index);
        
        let i = s.lastIndexOf('@');
        // if(index==i){return false}
        let str = this.comment.slice(i+1,index);
        let isHave = str.includes(' ');
        if(!isHave){
          this.atIndex = i;
          let params = {
            keyword: str
          }
          this.searchkey = str;
          if(this.canSearch){
            this.canSearch = false;
            api.searchUserForAt(params).then(res=>{
              if(res.success&&res.data.length){
                
                this.canSearch = true;
                this.showAt = true;
                this.atUsers = res.data;
              }else{
                this.canSearch = true;
                this.showAt = false;
                this.atUsers = res.data;
              }
            }).catch((e)=>{
              this.canSearch = true;
            })
          }
        }
        if(e.code=='Backspace'&&this.atUserName.length){
          this.atUserName.forEach((item,ins)=>{
            if(item.includes('@'+str)&&item.slice(0,-1)=='@'+str){
              this.ats.splice(ins,1);
              this.atUserName.splice(ins,1);
              console.log(this.ats,this.atUserName);
            }
          })
        }
        console.log(str)
      }
      
    },
        doImgs(item){
            var a = item.split(',');
            a.forEach(it=>{
                it = this.imgOrigin + it;
            })
            this.is = a;
        },
        handleAvatarSuccess(res, file) {
            if(res.success){
                this.imageUrl = URL.createObjectURL(file.raw);
                this.images.push(res.data);
            }else if(res.errorCode=='invalid_content'){
                // this.imageUrl = ''
                this.$toast(res.errorMessage)
            }
            this.imagesNum--
            if (!this.imagesNum) {
                this.imagesUploading = false
            }
        },
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 20MB!');
                return false
            }
            this.imagesNum++
            this.imagesUploading = true
            this.filedata.fileName = file.name
            return true
        },
        handleAvatarExceed (files, fileList) {
            this.$message.warning({
                message: `当前限制选择 ${this.imagesLimit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`,
                duration: 2500
            });
        },
        showIcons(){
        this.showIcon = true
        },
        toReplay2(item){
            this.$emit('toReplay2',item)
        },
        toReplay(item){
        //    this.replayItem = null;
            if (this.replayItem === item) return
            this.images = []
            this.$set(this,'replayItem',item)
            // this.replayItem = item;
            this.$emit('rep',item, true)
            this.showR = false
        },
        cancelReplay(){
            this.replayItem = null
            this.$emit('rep',null, false)
        },
        rep(item, bool){
            this.replayItem = item;
            this.showR = bool
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
            if(this.canSub){
                this.doLoginStatus().then(res=>{
                    let comment = this.comment;
                    if(res){
                    if(!this.comment) return;
                    let reg = new RegExp(/@[^(\s)]+/g);
                    let a = comment.match(reg);
                    console.log(a)
                    var ats = [];
                    if(a){
                        a.forEach((item,index)=>{
                            if(this.atUserName.includes(item)){
                            let i = this.atUserName.findIndex(it=>it==item);
                            ats.push(this.ats[i]);
                            }
                        });
                        console.log('atc',ats)
                        console.log(this.ats);
                        console.log(this.atUserName)
                    }
                    let params = {
                        parentId: this.replayItem&&this.replayItem.id?this.replayItem.id:'',
                        postId: this.replayItem.postId,
                        comment: this.comment,
                        imageNames: this.images.join(','),
                        ats: ats.join(',')
                    }
                    console.log(this.comment);
                    this.canSub = false;
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
                            },1500)
                        } else {
                            this.$toast(res.errorMessage);
                            this.canSub = true;
                        }
                    })

                    }else{
                        console.log('未登录',res)
                    }
                })
            }else{
                this.$toast('正在提交评论...');
                return;
            }
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
        chooseEmoji(item){
            this.comment += item;
            this.showIcon = false
        },
        toPaste(e){
            var cbd = e.clipboardData;
            var ua = window.navigator.userAgent;
            if ( !(e.clipboardData && e.clipboardData.items) ) {
                return ;
            }
            if(cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" && cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" && ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49){
                return;
            }
            // for(var i = 0; i < cbd.items.length; i++) {
            var item = cbd.items[cbd.items.length-1];
            if(item.kind == "file" && (/^image\/[a-z]*$/.test(item.type))){
                var blob = item.getAsFile();
                if (blob.size === 0) {
                return;
                }
                this.$refs.replyImageUpload[0].$children[0].uploadFiles([blob])
            }
            // }
        },
        inputFocus () {
            document.addEventListener('paste',this.toPaste);
        },
        inputBlur() {
            document.removeEventListener('paste',this.toPaste);
        }
    }
}
</script>

<style type='text/scss' lang='scss' scoped>
/deep/ .el-loading-spinner{
    top: 10%;
}

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
        // overflow: hidden;
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
            font-size: 15px;
            padding: 8px 0;
            line-height: 24px;
            text-align: left;
        }
    }
}
.replayInput{
    padding-bottom: 4px;
    position: relative;
    &::before {
        display: block;
        content: '';
        clear: both;
    }
    .textarea {
        resize: none;
        font-size: 16px;
    }
    .reply_button{
        position: relative;
        display: flex;
        flex-direction: row-reverse;
        padding: 20px 20px 0;
        .subims{
          position: absolute;
          left: 0;
          top: 20px;
          a {
            + a {
              margin-left: 6px;
            }
          }
        }
        .icons{
          padding: 4px 20px 0;
          text-align: right;
          height: 60px;
          &:hover {
            flex: 1;
          }
          &:hover .emoji{
            display: block;
          }
          & > img {
            width: 24px;
            height: 24px;
          }
          .emoji{
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
        }
    }
}
.atuser{
      position: absolute;
      top: 70px;
      left: 50px;
      background: #fff;
      border: 1px solid #ddd;
      z-index: 10;
      padding: 10px 0;
      width: 100px;
      .at_item{
        padding: 0 10px;
        line-height: 28px;
        font-size: 13px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        cursor: pointer;
        &:hover{
          color: #ff9300;
          background: #eee;
        }
      } 
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
        z-index: 10;
    }
}
</style>
