<template>

</template>

<script>
import * as api from '@/api/api'
export default {
  name: "pay",
  mounted() {
    this.orderId =  this.$route.query.orderNo;
    this.code=  this.$route.query.orderNo;
    this.callPay();
  },
  methods: {
    callPay() {
      function onBridgeReady() {
        api.getByPath('/api/v0/tuxun/vip/jsApiPay', {code: this.code, orderId: this.orderId}).then(res=>{
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
      }
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
      } else {
        onBridgeReady();
      }
    }
  }
}
</script>

<style scoped>

</style>
