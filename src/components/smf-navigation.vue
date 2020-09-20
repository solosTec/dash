<template lang="html">
  <section class="smf-navigation">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="https://solostec.ch">
        <img
          :src="logo"
          width="30"
          height="30"
          class="d-inline-block align-top"
          alt=""
        />
        {{ brand }}
      </b-navbar-brand>

      <b-navbar-toggle target="nav_collapse" />

      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link to="/"
              ><a class="nav-link" href="index.html"
                >{{ $t("nav-home") }} <span class="sr-only">(current)</span></a
              ></router-link
            >
          </li>

          <b-nav-item-dropdown :text="$t('nav-config')">
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.CONFIG_DEVICES, PRIVILEGES.VIEW)"
              to="/config/device"
              >{{ $t("nav-devices") }}</b-dropdown-item
            >
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.CONFIG_GATEWAY, PRIVILEGES.VIEW)"
              to="/config/gateway"
              >{{ $t("nav-gateways") }}</b-dropdown-item
            >
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.CONFIG_METERS, PRIVILEGES.VIEW)"
              to="/config/meter"
              >{{ $t("nav-meter") }}</b-dropdown-item
            >
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.CONFIG_IEC, PRIVILEGES.VIEW)"
              to="/config/iec"
              >{{ $t("nav-iec") }}</b-dropdown-item
            >
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.CONFIG_LORA, PRIVILEGES.VIEW)"
              to="/config/lora"
              >{{ $t("nav-LoRa") }}</b-dropdown-item
            >
            <div class="dropdown-divider"></div>
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.CONFOG_UPLOAD, PRIVILEGES.VIEW)"
              to="/config/upload"
              >{{ $t("nav-upload") }}</b-dropdown-item
            >
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.CONFIG_DOWNLOAD, PRIVILEGES.VIEW)"
              to="/config/download"
              >{{ $t("nav-download") }}</b-dropdown-item
            >
            <div class="dropdown-divider"></div>
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.CONFIG_SYSTEM, PRIVILEGES.VIEW)"
              to="/config/system"
              >{{ $t("nav-system") }}</b-dropdown-item
            >
            <!--b-dropdown-item :disabled="!hasPrivs(MODULES.CONFIG_USER, PRIVILEGES.VIEW)" to="/config/user">{{ $t('nav-user') }}</b-dropdown-item-->
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.CONFIG_WEB, PRIVILEGES.VIEW)"
              to="/config/web"
              >Web</b-dropdown-item
            >
          </b-nav-item-dropdown>

          <b-nav-item-dropdown :text="$t('nav-collectors')">
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.MONITOR_LORA, PRIVILEGES.VIEW)"
              to="/collector/lora"
              >{{ $t("nav-lora-uplink") }}</b-dropdown-item
            >
            <!--<b-dropdown-item :disabled="!hasPrivs(MODULES.CONFIG_IEC, PRIVILEGES.VIEW)" to="/config/mbusWired">{{ $t('nav-mbus') }}</b-dropdown-item>-->
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.CONFIG_IEC, PRIVILEGES.VIEW)"
              to="/collector/mbusRadio"
              >{{ $t("nav-wmbus") }}</b-dropdown-item
            >
          </b-nav-item-dropdown>

          <b-nav-item-dropdown :text="$t('nav-status')">
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.STATUS_SESSION, PRIVILEGES.VIEW)"
              to="/status/sessions"
              >{{ $t("nav-sessions") }}</b-dropdown-item
            >
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.STATUS_TARGET, PRIVILEGES.VIEW)"
              to="/status/targets"
              >{{ $t("nav-targets") }}</b-dropdown-item
            >
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.STATUS_CONNECTION, PRIVILEGES.VIEW)"
              to="/status/connections"
              >{{ $t("nav-connections") }}</b-dropdown-item
            >
          </b-nav-item-dropdown>

          <b-nav-item-dropdown :text="$t('nav-monitoring')">
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.MONITOR_SYSTEM, PRIVILEGES.VIEW)"
              to="/monitor/system"
              >{{ $t("nav-system") }}</b-dropdown-item
            >
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.MONITOR_MESSAGES, PRIVILEGES.VIEW)"
              to="/monitor/messages"
              >{{ $t("nav-messages") }}</b-dropdown-item
            >
            <!--<b-dropdown-item :disabled="!hasPrivs(MODULES.MONITOR_TSDB, PRIVILEGES.VIEW)" to="/monitor/tsdb">{{ $t('nav-tsdb') }}</b-dropdown-item>-->
          </b-nav-item-dropdown>

          <b-nav-item-dropdown :text="$t('nav-tasks')">
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.TASK_CSV, PRIVILEGES.VIEW)"
              to="/task/csv"
              >CSV</b-dropdown-item
            >
            <!--                    <b-dropdown-item :disabled="!hasPrivs(MODULES.TASK_TSDB, PRIVILEGES.VIEW)" to="/task/tsdb">{{ $t('nav-tsdb') }}</b-dropdown-item>-->
            <b-dropdown-item
              :disabled="!hasPrivs(MODULES.TASK_PLAUSIBILITY, PRIVILEGES.VIEW)"
              to="/task/plausibility"
              >{{ $t("nav-plausibility") }}</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </ul>

        <span class="navbar-text">
          {{ user.username }}
        </span>

        <!-- set language -->
        <b-nav-item-dropdown :text="$t('language')" class="navbar-nav" right>
          <b-dropdown-item
            v-for="(name, code, idx) in avail"
            :key="idx"
            @click.stop="$i18n.locale = `${code}`"
            >{{ name }}</b-dropdown-item
          >
        </b-nav-item-dropdown>

        <span class="navbar-text">{{ connection_state }}</span>
        <span>&nbsp;</span>
        <span id="ws-activity-symbol" style="height: 40px"
          ><svg height="40" width="20">
            <circle
              cx="10"
              cy="20"
              r="10"
              stroke="red"
              stroke-width="0"
              :fill="get_color()"
            /></svg
        ></span>
      </div>
    </b-navbar>
  </section>
</template>

<script lang="ts">
import { AVAILABLE_LANGUAGES } from "@/constants/languages";
import { mapState } from "vuex";
import { privileges } from "@/mixins/privileges";
import { MODULES, PRIVILEGES } from "@/store/modules/user";
import Vue from "vue";
import { AppState } from "@/store";

export default Vue.extend({
  name: "smf-navigation",
  mixins: [privileges],
  props: {
    brand: String,
    logo: String
  },
  mounted() {
    //this.$store.commit('websocket/eventState', 'mounted');
  },
  computed: mapState({
    connection_state: state => (state as AppState).websocket.state,
    user: state => (state as AppState).user
  }),
  data() {
    return {
      avail: AVAILABLE_LANGUAGES,
      MODULES: MODULES,
      PRIVILEGES: PRIVILEGES
    };
  },
  methods: {
    get_color() {
      if (this.connection_state === "online") return "green";
      if (this.connection_state === "connection lost") return "yellow";
      return "grey";
    }
  }
});
</script>

<style scoped lang="css"></style>
