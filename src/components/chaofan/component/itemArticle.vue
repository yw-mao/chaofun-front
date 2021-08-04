<template>
 <div>  
    <div v-if="!isDetail" class="item_article">
                  <!-- <div class="title">
                    {{item.title}}
                  </div> -->
                  <div :class="['article',{'article_phone': ISPHONE}]">
                    <p  v-for="(_item,ins) in item.article.split('\n')" :key="ins">
                      <span v-html="_item"></span>
                    </p>
                    <div class="show_more">查看全文</div>
                  </div>
                </div>
    
    <div v-if="isDetail" class="item_article">
          <!-- <div class="title">
            {{item.title}}
          </div> -->
          <div @click.stop="" class="detail_line" id="detail_line" :style="{width: ISPHONE?clientWidth-24+'px':'720px'}">
            <p  v-for="(_item,ins) in item.article.split('\n')" :key="ins">
              <span v-html="_item"></span>
            </p>
          </div>
        </div>
        <viewer style="height:0;display:none;" :images="imgsArr"> 
          <img
                v-for="(src,index) in imgsArr"
                :src="src"
                :id="'k'+index"
                :key="index"
                :data-source="src"
              >
        </viewer>
 </div>
</template>

<script>
import * as api from '@/api/api'
 export default {
   name: '',
   data(){
     return {
         imgsArr: []
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
    var el = document.getElementById('detail_line');
    if(el){
      var imgs = el.getElementsByTagName("img");
      console.log(imgs);
      let im = [];
      imgs.forEach((item,index)=>{
        item.addEventListener('click',function(e){
          
          let src = e.target.currentSrc;
          document.getElementById('k'+index).click();
          console.log(src)
        })
        im.push(item.currentSrc);
      })
      this.imgsArr = im;
      console.log(this.imgsArr)
    }
    
   },
   methods: {
    toUrls(item,params){
       this.postBehavior(item.postId,'jump');
       this.toUrl(params)
    },
   }
 }
</script>

<style type='text/scss' lang='scss' scoped>
.item_article{
    padding-bottom: 20px !important;
      .title{
        padding: 0 0 10px 0;
        font-size: 16px;
        font-weight: 600;
      }
      .article{
        padding-bottom: 10px;
        max-height: 265px;
        overflow: hidden;
        position: relative;
        .show_more{
          position: absolute;
          top: 200px;
          left: 0;
          width: 100%;
          text-align: center;
          height: 70px;
          line-height: 90px;
          z-index: 1;
          background: linear-gradient(-180deg,rgba(255,255,255,0) 0%,#fff 50%);
        }
      }
      .article_phone{
        max-height: 160px;
        .show_more{
          top: 110px;
          height: 50px;
          line-height: 60px;
        }
      }
    }
.item .item_article .article_phone{
    position: relative;
    // left: -50px;
  }
  .detail_line{
    width: 100%;
    overflow: hidden;
    word-break:break-all; /*支持IE，chrome，FF不支持*/
　　word-wrap:break-word;/*支持IE，chrome，FF*/
    font-size: 15px;
  }
  /deep/ .detail_line p{
    line-height: 1.6em;
    margin: 1.4em 0;
  }
  /deep/ .detail_line img{
    max-width: 100%;
  }
</style>
