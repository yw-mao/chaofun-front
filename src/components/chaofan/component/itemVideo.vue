<template>
 <div>  
    <div :class="['item_video',{'phone_v': ISPHONE}]">
        <div class="title">
            {{item.title}}
        </div>
        <div :id="'video'+item.postId" class="video">
            <video :class="[doHeight()]" :autoplay="true" webkit-playsinline='true' x5-video-player-type="h5"  playsinline='true' controls  :src="imgOrigin+item.video" alt=""></video>
        </div>
    </div>
 </div>
</template>

<script>
import * as api from '@/api/api'
 export default {
   name: '',
   data(){
     return {
         handle: ''
     }
   },
   props: {
       item: {
           type: Object,
           default(){
               return {}
           }
       },
       isDetail: {
         type: Boolean,
         default: false
       },
   },
   components: {

   },
   created() {
     console.log('879');
     let self = this;
     document.getElementById('container').addEventListener("scroll", self.handlerScroll);
   },
   mounted() {
    
   },
   destroyed() {
      let self = this;
      document.getElementById('container').removeEventListener('scroll', self.handlerScroll,false);
   },
   methods: {
    handlerScroll(e){
      console.log('879')
      console.log(e.target);
      console.log(e.target.offsetTop);
      var el = document.getElementById('video'+this.item.postId);
      console.log(this.item)
      if(el){
        var top = el.getBoundingClientRect().top;
        if(top<-50){
          if(!this.isDetail){
            
            this.$emit('toPause','',this.item,0)
          }
        }
      }else{
        console.log('取消滚动监听------------------')
        let self = this;
        document.getElementById('container').removeEventListener('scroll', self.handlerScroll,false);
      }
      
      console.log('距离顶部',top)
    },
    unloadHandler(e){

    },
    doHeight(){
      if(this.isDetail){
        if(this.ISPHONE){
          return 'video3';
        }else{
          return 'video2';
        }
      }else{
        return ''
      }
    },
    toUrls(item,params){
       this.postBehavior(item.postId,'jump');
       this.toUrl(params)
    },
   }
 }
</script>

<style type='text/scss' lang='scss' scoped>
.item_video{
      .title{
        padding: 0 0 10px 0;
        font-size: 16px;
        font-weight: 600;
      }
      .video{
        text-align: center;
        // width: 640px;
        max-height: 512px;
        overflow-y: hidden;
        video{
          width: 100%;
          height: 320px;
          background: #000;
          margin: 0 auto;
        }
        .video2{
            height: 440px;
        }
        .video3{
          height: 290px;
        }
      }
    }
  .phone_v{
    .video{
      video{
        height: 230px;
      }
    }
  }
</style>
