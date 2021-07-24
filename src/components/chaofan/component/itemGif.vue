<template>
 <div>  
    <div class="item_video">
        <!-- <div @click="toDetail" class="title">
            {{item.title}}
        </div> -->
        <div class="video">
            <video :class="[isDetail?'video2':'']" webkit-playsinline='true' playsinline='true' autoplay controls loop  :src="imgOrigin+item.imageName" alt=""></video>
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
   },
   mounted() {
    
   },
   methods: {
    toUrls(item,params){
       this.postBehavior(item.postId,'jump');
       this.toUrl(params)
    },
    toDetail(){
      if(!this.isDetail){
        this.$emit('toDetail',this.item)
      }
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
      height: 300px;
      background: #000;
      margin: 0 auto;
    }
    .video2{
        height: 512px;
    }
  }
}

@media screen and (max-width: 700px) {
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
          height: 300px;
          background: #000;
          margin: 0 auto;
        }
        .video2{
            height: 290px;
        }
      }
    }
}
</style>
