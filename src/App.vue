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

<script lang="ts">

import {Channel, webSocket, WSInsertResponse} from './mixins/web-socket'
import SMFNavigation from '@/components/smf-navigation.vue'
import {mapState} from 'vuex';
import mixins from 'vue-typed-mixins';
import Vue from 'vue';
import {AppState} from '@/store';
import {BUser} from '@/api/user';

export default mixins(webSocket, Vue).extend({
    name: 'app',
    mixins: [webSocket],
    components: {
      SMFNavigation
    },
    mounted () {
      console.log('NODE_ENV: ' + process.env.NODE_ENV);

      if (process.env.VUE_APP_SMF_NO_AUTH === 'true') {
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
        this.ws_subscribe(Channel.ConfigUser);
      },
      ws_on_data(obj: WSInsertResponse<BUser>) {

        if (obj.cmd === 'insert' && obj.channel === Channel.ConfigUser) {
            this.$store.commit('user/loaded', obj.rec.data as BUser);
        }

      }
    },
    computed: {
      ...mapState({
        userName: state => {
          return (state as AppState).user.username;
        }
      })
    }
  })
</script>

<style>
</style>
