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

    <b-jumbotron
      fluid
      :header="$t('header-dashboard')"
      :lead="$t('lead-dashboard')"
    />

    <b-container fluid>
      <b-card-group deck>
        <b-card :title="$t('config-home-01')" class="shadow">
          <b-card-text>{{ $t("config-home-01a") }}</b-card-text>
          <b-button to="/config/device" href="#" variant="primary">{{
            $t("nav-devices")
          }}</b-button>
          <div slot="footer">
            <small class="text-muted">{{
              $t("lead-device", { count: deviceCount })
            }}</small>
          </div>
        </b-card>

        <b-card :title="$t('config-home-02')" class="shadow">
          <b-card-text>{{ $t("config-home-02a") }}</b-card-text>
          <b-button to="/config/gateway" href="#" variant="primary">{{
            $t("nav-gateways")
          }}</b-button>
          <div slot="footer">
            <small class="text-muted">{{
              $t("lead-gateway", { count: gatewayCount })
            }}</small>
          </div>
        </b-card>

        <b-card :title="$t('config-home-03')" class="shadow">
          <b-card-text>{{ $t("config-home-03a") }}</b-card-text>
          <b-button to="/config/meter" href="#" variant="primary">{{
            $t("nav-meter")
          }}</b-button>
          <div slot="footer">
            <small class="text-muted">{{
              $t("lead-meter", { count: meterCount })
            }}</small>
          </div>
        </b-card>
      </b-card-group>

      <br />

      <b-card-group deck>
        <b-card :title="$t('config-home-04')" class="shadow">
          <b-card-text>{{ $t("config-home-04a") }}</b-card-text>
          <b-button
            to="/status/sessions"
            href="status.session.html"
            variant="primary"
            >{{ $t("nav-sessions") }}</b-button
          >
          <div slot="footer">
            <small class="text-muted">{{
              $t("lead-status-session", { count: sessionCount })
            }}</small>
          </div>
        </b-card>

        <b-card :title="$t('config-home-05')" class="shadow">
          <b-card-text>{{ $t("config-home-05a") }}</b-card-text>
          <b-button
            to="/status/targets"
            href="status.targets.html"
            variant="primary"
            >{{ $t("nav-targets") }}</b-button
          >
          <div slot="footer">
            <small class="text-muted">{{
              $t("lead-status-targets", { count: targetCount })
            }}</small>
          </div>
        </b-card>

        <b-card :title="$t('config-home-06')" class="shadow">
          <b-card-text>{{ $t("config-home-06a") }}</b-card-text>
          <b-button
            to="/status/connections"
            href="status.connections.html"
            variant="primary"
            >{{ $t("nav-connections") }}</b-button
          >
          <div slot="footer">
            <small class="text-muted">{{
              $t("lead-status-connections", { count: connectionCount })
            }}</small>
          </div>
        </b-card>
      </b-card-group>
    </b-container>
  </section>
</template>

<script lang="ts">
import { webSocket } from "@/mixins/web-socket";
import mixins from "vue-typed-mixins";
import Vue from "vue";

export default mixins(webSocket, Vue).extend({
  name: "smfHome",
  props: [],
  mixins: [webSocket],

  mounted() {
    this.ws_open("/smf/api/system/v0.8");
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
    };
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
    ws_on_data(obj: any) {
      if (obj.cmd != null) {
        if (obj.cmd == "update") {
          if (obj.channel != null) {
            if (obj.channel == "table.device.count") {
              this.deviceCount = obj.value;
            } else if (obj.channel == "table.gateway.count") {
              this.gatewayCount = obj.value;
            } else if (obj.channel == "table.meter.count") {
              this.meterCount = obj.value;
            } else if (obj.channel == "table.session.count") {
              this.sessionCount = obj.value;
            } else if (obj.channel == "table.target.count") {
              this.targetCount = obj.value;
            } else if (obj.channel == "table.connection.count") {
              this.connectionCount = obj.value;
            }
          }
        }
      }
    }
  },

  computed: {}
});
</script>

<style scoped lang="css"></style>
