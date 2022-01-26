<template>

</template>

<script>
    import * as api from '@/api/api'
    import {getUserInfo} from "../../../api/api";
    export default {
        name: "RedPacket",
        data() {
            return {
                'redPacket': {},
                'fbi': 0,
            }
        },
        created() {
            this.getRedPacket();
        },
        mounted() {

        },

        methods: {
            getRedPacket() {

            },

            history() {
                window.open('https://chao.fun/webview/fbi/history',"_blank");
            }
        }
    }


</script>

<style scoped>

</style>