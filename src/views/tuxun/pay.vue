<template>
  <div>
    123
  </div>
</template>

<script>
import * as api from '@/api/api'
export default {
  name: "pay",
  data() {
    return {
      code: null,
      orderId: null
    }
  },
  mounted() {
    this.orderId =  this.$route.query.orderNo;
    this.code=  this.$route.query.code;
    this.callPay();
  },
  methods: {
    onBridgeReady() {
      // this.$toast(123);
      api.getByPath('/api/v0/tuxun/vip/jsApiPay', {code: this.code, orderId: this.orderId}).then(res=>{
        console.log("res")
        console.log(res.data);
        if (res.success) {
          WeixinJSBridge.invoke('getBrandWCPayRequest', JSON.parse(res.data),
              function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  // 使用以上方式判断前端返回,微信团队郑重提示：
                  //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                }
              });
        }
      })
    },
    callPay() {
      // this.onBridgeReady();

      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
        }
        console.log("undefined")
      } else {
        // this.$toast('ready')
        this.onBridgeReady();
      }
    }
  }
}
</script>

<style scoped>

</style>
