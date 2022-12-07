<template>

</template>

<script>
import * as api from '@/api/api'
export default {
  name: "pay",
  mounted() {
    this.orderId =  this.$route.query.orderNo;
    this.code=  this.$route.query.code;
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

        //     WeixinJSBridge.invoke('getBrandWCPayRequest', {
        //   "timeStamp": "1670392448",
        //       "package": "prepay_id=wx07135408470162b81ec5eb7cc4611f0000",
        //       "paySign": "kUuMYXzbjcbPk4qUuAQirIynaayo7x5Vsw9v8IxstNhtEQ15sYDDOeTX4ylXTa+BGsjqgYG1jXX4pZfOThFSW/Rzaa5bwxiC6iUNnr+cdlVSmhyaujsueVfB/k6qlDcZc2Fej7lKF1qOjlJhfJ7UTijmrN/7W4OeQzDBRLskuhFgFuo0dqPPf85o6bNDEXZQ3fvprIR+I8FglqWfFhqtR6lx8rkoYmARiemzcTVQqUZRUkrCt53wjuPes6YEXR+4v4aLc+RGIEr/Nw8xKz5+do2MayUuTccJ5fBdOfG5sXdjG6ClZJVTsBaQkfcr6nfAupwibmOn3DVSDCAXwoaXZg==",
        //       "appId": "wx59fc2a25d80a5812",
        //       "signType": "RSA",
        //       "nonceStr": "66fb353c98f445848e01e7ce5f1b39d0"
        // },
        //         function (res) {
        //           if (res.err_msg == "get_brand_wcpay_request:ok") {
        //
        //           }
        //     });
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
