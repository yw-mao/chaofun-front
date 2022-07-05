<template>
  <div class="container">
    <div class="content">
        <div class="nav">
            <span>训练图</span>
        </div>
        <div @click="toMaps(item)" v-for="(item,index) in pagedata" :key="index" class="item">
<!--          <div class="title">{{item.rank}}.</div>-->
          <div class="left">
                <div class="info">
                    <div class="title">{{item.name}}</div>
                </div>
            </div>
        </div>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api'
export default {
  name: 'tuxunRank',
  components: {
    
  },
  data(){
      return {
          pagedata: [],
        timer: 0
      }
  },
  created(){
  },
  mounted(){
    this.getButtonRank()
    document.title = "图寻总积分";

    let _this = this;
    let timer = setInterval(()=>{
      _this.getButtonRank()
    },5000)
  },
  methods:{
    getButtonRank(){
        api.getByPath('/api/v0/tuxun/maps/list').then(res=>{
            this.pagedata = res.data
        })
    },
    toMaps(item){
      window.open(location.origin + '/tuxun?mapsId=' + item.id, '_blank');
    },
  },
}
</script>
<style scoped lang="scss">
.container{
    // height: ;
    padding-top: 0;
    height: 100vh;
}
.title{
  font-size: 16px;
  padding-right: 10px;
}
.content{
    .item{

        display: flex;
        justify-content: space-between;
        padding: 5px;
        padding-left: 20px;
        border-bottom: 1px solid #f1f1f1;
        // height: 60px;
        // box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        align-items: center;

        .left{
            flex: 1;
            display: flex;
            img{
                flex: 0 0 40px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 10px;
                vertical-align: middle;
            }
            .title{
                font-size: 16px;
            }
            .desc{
                width: 180px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #888;
                font-size: 13px;
            }
            .info{
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                
            }
        }
        .right{
            flex: 0 0 60px;
            // line-height: 40px;
            text-align: center;
            font-size: 12px;
            p{
                font-size: 14px;
            }
        }
    }
}
.nav{
    padding: 20px;
    img{
        width: 24px;
        height: 24px;
        vertical-align: middle;
        margin-right: 10px;
    }
    font-size: 18px;
}
</style>
