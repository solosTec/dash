<template lang="html">
  <section class="smf-config-wmbus">
    <template>
      <div>
        <vue-headful
          description="SMF dashboard"
          keywords="SMF, solosTec"
          title="smf :: config WMBus"
        />
      </div>
    </template>

    <b-jumbotron
      :header="$t('header-wmbus')"
      :lead="$t('lead-wmbus', { count: this.configs.length })"
      fluid
    />

    <b-container fluid> TODO </b-container>
  </section>
</template>
<script lang="ts">
import { Channel, webSocket, WSResponse } from "@/mixins/web-socket";
import smfDataTable from "@/components/smf-data-table.vue";
import smfTableEditButtons from "@/components/smf-table-edit-buttons.vue";
import mixins from "vue-typed-mixins";
import Vue from "vue";
import { Route } from "vue-router";
import { hasPrivilegesWaitForUser } from "@/mixins/privileges";
import store from "@/store";
import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "@/store/modules/user";

export default mixins(webSocket, Vue).extend({
  name: "smfConfigWMBus",
  props: [],
  components: {
    smfDataTable,
    smfTableEditButtons
  },
  mixins: [webSocket],
  mounted() {
    this.ws_open("/smf/api/wmbus/v0.8");
  },
  data() {
    return {
      configs: [] as any[]
    };
  },
  beforeDestroy() {
    this.ws_close();
  },
  methods: {
    ws_on_open() {
      this.configs = [];
      this.ws_subscribe(Channel.ConfigWMBus);
    },
    ws_on_data(obj: WSResponse) {
      console.log(obj);
    }
  },
  beforeRouteEnter(to: Route, from: Route, next: any) {
    hasPrivilegesWaitForUser(store, MODULES.CONFIG_WMBUS, PRIVILEGES.VIEW).then(
      result => {
        next(result ? true : NO_ACCESS_ROUTE);
      }
    );
  }
});
</script>
