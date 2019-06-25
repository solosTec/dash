<template lang="html">

  <section class="smf-home">

    <template>
        <div>
            <vue-headful
                title="smf :: home"
                description="SMF dashboard"
                keywords="SMF, solosTec"
            />
        </div>
    </template>

    <b-jumbotron fluid :header="$t('header-dashboard')" :lead="$t('lead-dashboard')" />

    <b-container fluid>
        <b-card-group deck>

            <b-card title="Configure Devices" class="shadow">
               <b-card-text>Managing the device pool.</b-card-text>
               <b-button to="/config/device" href="#" variant="primary">Devices</b-button>
               <div slot="footer"><small class="text-muted">{{deviceCount}} device(s) configured</small></div>
            </b-card>

            <b-card title="Configure Gateways" class="shadow">
               <b-card-text>Special support for gateways.</b-card-text>
               <b-button to="/config/gateway" href="#" variant="primary">Gateways</b-button>
               <div slot="footer"><small class="text-muted">{{gatewayCount}} gateway(s) available</small></div>
            </b-card>

            <!-- <b-card title="Configure Meter" img-src="electric-meter.svg" img-height="100px"> -->
            <b-card title="Configure Meter" class="shadow">
               <b-card-text>Meter overview</b-card-text>
               <b-button to="/config/meter" href="#" variant="primary">Meter</b-button>
               <div slot="footer"><small class="text-muted">{{meterCount}} meter(s) configured</small></div>
            </b-card>

        </b-card-group>

        <br />

        <b-card-group deck>

            <b-card title="Show Sessions" class="shadow">
               <b-card-text>Show a list of all devices online now and their data throughput in realtime.</b-card-text>
               <b-button to="/status/sessions" href="status.session.html" variant="primary">Sessions</b-button>
               <div slot="footer"><small class="text-muted">{{sessionCount}} session(s) online</small></div>
            </b-card>

            <b-card title="Registered Targets" class="shadow">
               <b-card-text>All registered targets and their data throughput in realtime.</b-card-text>
               <b-button to="/status/targets" href="status.targets.html" variant="primary">Targets</b-button>
               <div slot="footer"><small class="text-muted">{{targetCount}} target(s) registered</small></div>
            </b-card>

            <b-card title="Connections" class="shadow">
               <b-card-text>See connections and manage leased lines.</b-card-text>
               <b-button to="/status/connections" href="status.connections.html" variant="primary">Connections</b-button>
               <div slot="footer"><small class="text-muted">{{connectionCount}} running connection(s)</small></div>
            </b-card>

        </b-card-group>

    </b-container>
  </section>

</template>

<script lang="js">

  // import vueHeadful from 'vue-headful'
  import {webSocket} from '../../services/web-socket.js'

  export default  {
    name: 'smfHome',
    props: [],
    mixins: [webSocket],

    mounted() {
      this.ws_open("/smf/api/system/v0.7");
    },

    beforeDestroy() {
      this.ws_close();
    },

    data() {
      return {
        deviceCount: 0,
        gatewayCount: 0,
        meterCount: 0,
        sessionCount: 0,
        targetCount: 0,
        connectionCount: 0
      }
    },

    methods: {
     ws_on_open() {
        this.ws_subscribe("table.device.count");
        this.ws_subscribe("table.gateway.count");
        this.ws_subscribe("table.meter.count");
        this.ws_subscribe("table.session.count");
        this.ws_subscribe("table.target.count");
        this.ws_subscribe("table.connection.count");
      },
      ws_on_data(obj) {
        if (obj.cmd != null) {
          if (obj.cmd == 'update') {
            if (obj.channel != null) {
              if (obj.channel == 'table.device.count') {
                this.deviceCount = obj.value;
              }
              else if (obj.channel == 'table.gateway.count') {
                this.gatewayCount = obj.value;
              }
              else if (obj.channel == 'table.meter.count') {
                this.meterCount = obj.value;
              }
              else if (obj.channel == 'table.session.count') {
                this.sessionCount = obj.value;
              }
              else if (obj.channel == 'table.target.count') {
                this.targetCount = obj.value;
              }
              else if (obj.channel == 'table.connection.count') {
                this.connectionCount = obj.value;
              }
            }
          }
        }
      }
    },

    computed: {
    }
}
</script>

<style scoped lang="css">
</style>
