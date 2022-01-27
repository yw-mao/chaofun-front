<template>

</template>

<script>
  import * as api from '@/api/api'

  export default {
    name: "OAuth",
    data() {
      return {
        'redirectUrl': '',
      }
    },
    created() {
      this.redirectUrl = this.$route.query.redirectUrl;

      if (!this.redirectUrl) {
        this.getUserToken();
      } else {
        window.location.href = 'https://chao.fun';
      }
    },
    mounted() {

    },

    methods: {
      async getUserToken() {
        const result = await api.getByPath('/api/v0/open/getUserToken', {});
        if (result.success && result.data) {
          if (this.redirect.contains('?')) {
            this.redirectUrl = this.redirectUrl + "&cfToken=" + result.data.token ;
          } else {
            this.redirectUrl = this.redirectUrl + "?cfToken=" + result.data.token;
          }
        }
        window.location.href = this.redirectUrl;
      }
    }
  }
</script>

<style scoped>

</style>