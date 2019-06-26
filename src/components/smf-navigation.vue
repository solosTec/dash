<template lang="html">

  <section class="smf-navigation">
     <b-navbar toggleable="lg" type="dark" variant="dark">

        <b-navbar-brand href="https://solostec.ch">
            <img :src=logo width="30" height="30" class="d-inline-block align-top" alt="">
            {{brand}}
        </b-navbar-brand>

        <b-navbar-toggle target="nav_collapse" />

        <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav mr-auto">

                <li class="nav-item active">
                    <router-link to="/"><a class="nav-link" href="index.html">{{ $t('nav-home') }} <span class="sr-only">(current)</span></a></router-link>
                </li>

                <b-nav-item-dropdown :text="$t('nav-config')">
                    <b-dropdown-item to="/config/system">{{ $t('nav-system') }}</b-dropdown-item>
                    <div class="dropdown-divider"></div>
                    <b-dropdown-item to="/config/device">{{ $t('nav-devices') }}</b-dropdown-item>
                    <b-dropdown-item to="/config/gateway">{{ $t('nav-gateways') }}</b-dropdown-item>
                    <b-dropdown-item to="/config/meter">{{ $t('nav-meter') }}</b-dropdown-item>
                    <b-dropdown-item to="/config/lora">{{ $t('nav-LoRa') }}</b-dropdown-item>
                    <div class="dropdown-divider"></div>
                    <b-dropdown-item to="/config/upload">{{ $t('nav-upload') }}</b-dropdown-item>
                    <b-dropdown-item to="/config/download">{{ $t('nav-download') }}</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item-dropdown :text="$t('nav-status')">
                    <b-dropdown-item to="/status/sessions">{{ $t('nav-sessions') }}</b-dropdown-item>
                    <b-dropdown-item to="/status/targets">{{ $t('nav-targets') }}</b-dropdown-item>
                    <b-dropdown-item to="/status/connections">{{ $t('nav-connections') }}</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item-dropdown :text="$t('nav-monitoring')">
                    <b-dropdown-item to="/monitor/system">{{ $t('nav-system') }}</b-dropdown-item>
                    <b-dropdown-item to="/monitor/messages">{{ $t('nav-messages') }}</b-dropdown-item>
                    <b-dropdown-item to="/monitor/tsdb">{{ $t('nav-tsdb') }}</b-dropdown-item>
                    <b-dropdown-item to="/monitor/lora">{{ $t('nav-lora-uplink') }}</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item-dropdown :text="$t('nav-tasks')">
                    <b-dropdown-item to="/task/csv">CSV</b-dropdown-item>
                    <b-dropdown-item to="/task/tsdb">{{ $t('nav-tsdb') }}</b-dropdown-item>
                    <b-dropdown-item to="/task/plausibility">{{ $t('nav-plausibility') }}</b-dropdown-item>
                </b-nav-item-dropdown>


            </ul>

            <!-- set language -->
            <b-nav-item-dropdown :text="$t('language')" class="navbar-nav" right>
                <b-dropdown-item v-for="(name, code, idx) in avail" :key="idx" @click.stop="$i18n.locale = `${code}`">{{ name }}</b-dropdown-item>
            </b-nav-item-dropdown>


            <span class="navbar-text">{{connection_state}}</span>
            <span>&nbsp;</span>
            <span id="ws-activity-symbol" style="height: 40px"><svg height="40" width="20"><circle cx="10" cy="20" r="10" stroke="red" stroke-width="0" :fill="get_color()" /></svg></span>

        </div>

     </b-navbar>
  </section>

</template>

<script lang="js">

  import { EventBus } from '../../services/event-bus.js'
  import { AVAILABLE_LANGUAGES } from '@/constants/languages'

  export default  {
    name: 'smf-navigation',
    props: {
        brand: String,
        logo: String
    },
    created() {
      EventBus.$on('ws-state', state => {
        // console.log(`websocket is ${state}`)
        this.connection_state = state;
      });
    },
    mounted() {
        this.connection_state = "mounted";
    },
    data() {
      return {
        connection_state: "unknown",
        avail: AVAILABLE_LANGUAGES
      }
    },
    methods: {
        get_color() {
            if (this.connection_state == "online")   return "green";
            if (this.connection_state == "connection lost")   return "yellow";
            return "grey";
        }
    },
    computed: {
    }
}
</script>

<style scoped lang="css">
</style>
