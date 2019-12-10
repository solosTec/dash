<template>
  <div id="app">
    <div v-if="user">
      <SMFNavigation brand="solos::Tec" logo="/logo.svg" />
      <router-view/>
    </div>
  </div>
</template>

<script>

  import {webSocket} from '../services/web-socket.js'
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
      this.ws_open("/smf/api/device/v0.7");
    },
    methods: {
      ws_on_open() {
        this.ws_subscribe("config.user");
      },
      ws_on_data(obj) {
        console.log(obj)

        if (obj.cmd === 'load' && obj.show === false) {
          this.$store.commit('user/loaded', {username: 'bla'});
        }
      }
    },
    computed: {
      ...mapState({
        user: state => {
          return state.user.username;
        }
      })
    }
  }
</script>

<style>
</style>
