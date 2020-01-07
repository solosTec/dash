<template>
  <div id="app">
    <div v-if="userName">
      <SMFNavigation brand="solos::Tec" logo="/logo.svg" />
      <router-view/>
    </div>
    <div v-else>
      loading user...
    </div>
  </div>
</template>

<script>

  import {webSocket} from './mixins/web-socket.js'
  import SMFNavigation from '@/components/smf-navigation.vue'
  import {mapState} from 'vuex';

  export default {
    name: 'app',
    mixins: [webSocket],
    components: {
      SMFNavigation
    },
    mounted () {
      console.log('NODE_ENV: ' + process.env.NODE_ENV);

      if (process.env.VUE_APP_SMF_NO_AUTH) {
        this.$store.commit('user/loaded', {name: 'Admin', privs:[]});
        return;
      }

      this.ws_open("/smf/api/device/v0.8");
    },
    beforeDestroy() {
      this.ws_close();
    },
    methods: {
      ws_on_open() {
        this.ws_subscribe("config.user");
      },
      ws_on_data(obj) {
        if (obj.cmd === 'insert') {
          this.$store.commit('user/loaded', obj.rec.data);
        }
      }
    },
    computed: {
      ...mapState({
        userName: state => {
          return state.user.username;
        }
      })
    }
  }
</script>

<style>
</style>
