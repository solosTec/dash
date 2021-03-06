﻿<template lang="html">
  <section class="smf-config-system">
    <template>
      <div>
        <vue-headful
          title="smf :: config web-interface"
          description="SMF dashboard"
          keywords="SMF, solosTec"
        />
      </div>
    </template>

    <b-jumbotron
      fluid
      header="Configure the Web-Interface"
      :lead="'data path: ' + ws_url"
    />

    <b-container fluid>
      <b-card-group deck>
        <b-card title="SSL/TSL available" class="shadow">
          <b-form-checkbox switch v-model="cfg.ssl">
            Enable SSL/TLS encryption (HTTPs)
          </b-form-checkbox>
          <div slot="footer">
            <small class="text-muted"
              >default = <b>{{ cfg.def.ssl }}</b></small
            >
          </div>
        </b-card>

        <b-card title="HTTPS Rewrite" class="shadow">
          <b-form-checkbox
            switch
            v-model="cfg.https_rewrite"
            :disabled="!cfg.ssl"
          >
            Redirect to HTTPS (if available)
          </b-form-checkbox>
          <div slot="footer">
            <small class="text-muted"
              >default = <b>{{ cfg.def.https_rewrite }}</b></small
            >
          </div>
        </b-card>
      </b-card-group>

      <br />

      <b-card-group deck>
        <b-card title="Session Timeout (HTTP)" class="shadow">
          <b-input-group prepend="sec." class="mt-3">
            <b-form-input
              v-model.number="cfg.http_sessionTimeout"
              type="number"
              min="10"
              max="10000"
              step="10"
              placeholder="<Session Timeout>"
            />
            <b-input-group-append>
              <b-button
                variant="secondary"
                @click="cfg.http_sessionTimeout = cfg.def.http_sessionTimeout"
                >Default</b-button
              >
              <b-button variant="success" @click="changeHTTPSessionTimeout"
                >Commit</b-button
              >
            </b-input-group-append>
          </b-input-group>

          <!-- Maximum number of messages to be displayed. -->
          <div slot="footer">
            <small class="text-muted"
              >default = <b>{{ cfg.def.http_sessionTimeout }} seconds</b></small
            >
          </div>
        </b-card>

        <b-card title="Maximum Upload Size (HTTP)" class="shadow">
          <b-input-group
            :prepend="ws_format_bytes(cfg.http_maxUploadSize)"
            class="mt-3"
          >
            <b-form-input
              v-model.number="cfg.http_maxUploadSize"
              type="number"
              min="1024"
              max="10485760"
              step="1024"
              placeholder="<max. Upload Size>"
            />
            <b-input-group-append>
              <b-button
                variant="secondary"
                @click="cfg.http_maxUploadSize = cfg.def.http_maxUploadSize"
                >Default</b-button
              >
              <b-button variant="success" @click="changeHTTPMaxUploadSize"
                >Commit</b-button
              >
            </b-input-group-append>
          </b-input-group>

          <!-- Maximum number of events to be displayed. -->
          <div slot="footer">
            <small class="text-muted"
              >default =
              <b>{{ ws_format_bytes(cfg.def.http_maxUploadSize) }}</b></small
            >
          </div>
        </b-card>
      </b-card-group>

      <br />

      <b-card-group deck>
        <b-card title="Session Timeout (HTTPS)" class="shadow">
          <b-input-group prepend="sec." class="mt-3">
            <b-form-input
              v-model.number="cfg.https_sessionTimeout"
              type="number"
              min="10"
              max="10000"
              step="10"
              placeholder="<Session Timeout>"
              :disabled="!cfg.ssl"
            />
            <b-input-group-append>
              <b-button
                variant="secondary"
                @click="cfg.https_sessionTimeout = cfg.def.https_sessionTimeout"
                >Default</b-button
              >
              <b-button
                variant="success"
                @click="changeHTTPsSessionTimeout"
                :disabled="!cfg.ssl"
                >Commit</b-button
              >
            </b-input-group-append>
          </b-input-group>

          <!-- Maximum number of messages to be displayed. -->
          <div slot="footer">
            <small class="text-muted"
              >default =
              <b>{{ cfg.def.https_sessionTimeout }} seconds</b></small
            >
          </div>
        </b-card>

        <b-card title="Maximum Upload Size (HTTPS)" class="shadow">
          <b-input-group
            :prepend="ws_format_bytes(cfg.https_maxUploadSize)"
            class="mt-3"
          >
            <b-form-input
              v-model.number="cfg.https_maxUploadSize"
              type="number"
              min="1024"
              max="10485760"
              step="1024"
              placeholder="<max. Upload Size>"
              :disabled="!cfg.ssl"
            />
            <b-input-group-append>
              <b-button
                variant="secondary"
                @click="cfg.https_maxUploadSize = cfg.def.https_maxUploadSize"
                >Default</b-button
              >
              <b-button
                variant="success"
                @click="changeHTTPsMaxUploadSize"
                :disabled="!cfg.ssl"
                >Commit</b-button
              >
            </b-input-group-append>
          </b-input-group>

          <!-- Maximum number of events to be displayed. -->
          <div slot="footer">
            <small class="text-muted"
              >default =
              <b>{{ ws_format_bytes(cfg.def.https_maxUploadSize) }}</b></small
            >
          </div>
        </b-card>
      </b-card-group>

      <br />

      <b-row>
        <b-col md="6"> </b-col>
        <b-col md="6"> </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <b-table
            ref="webTable"
            bordered
            striped
            small
            hover
            show-empty
            stacked="md"
            selectable
            select-mode="range"
            selectedVariant="info"
            @row-selected="rowSelected"
            :fields="table.fields"
            :items="table.data"
            :busy="table.isBusy"
            primary-key="pk"
            :sort-by.sync="table.sortBy"
            :sort-desc.sync="table.sortDesc"
            :sort-direction="table.sortDirection"
            :current-page="table.currentPage"
            :per-page="table.perPage"
            :filter="table.filter"
            class="shadow"
          >
            <!-- A virtual column -->
            <template v-slot:cell(index)="data">{{ data.index + 1 }}</template>
            <!-- loading slot -->
            <div slot="table-busy" class="text-center text-danger">
              <strong>Loading... {{ table.busyLevel }}%</strong>
            </div>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { webSocket } from "@/mixins/web-socket";
import { hasPrivilegesWaitForUser } from "@/mixins/privileges";
import store from "../store";
import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "@/store/modules/user";
import mixins from "vue-typed-mixins";
import Vue from "vue";

export default mixins(webSocket, Vue).extend({
  name: "smfConfigWeb",
  props: [],
  mixins: [webSocket],

  mounted() {
    this.ws_open("/smf/api/web/v0.8");
  },

  beforeDestroy() {
    this.ws_close();
  },

  data() {
    return {
      cfg: {
        ssl: false,
        https_rewrite: false,
        http_sessionTimeout: 30,
        http_maxUploadSize: 10 * 1024 * 1024,
        https_sessionTimeout: 30,
        https_maxUploadSize: 10 * 1024 * 1024,
        def: {
          ssl: false,
          https_rewrite: true,
          http_sessionTimeout: 30,
          http_maxUploadSize: 10 * 1024 * 1024,
          https_sessionTimeout: 30,
          https_maxUploadSize: 10 * 1024 * 1024
        }
      },
      table: {
        isBusy: true,
        busyLevel: 0,
        currentPage: 1,
        perPage: 15,
        fields: [
          {
            key: "index",
            class: "text-right small text-muted"
          },
          {
            key: "ep",
            label: "Address",
            sortable: true
          },
          {
            key: "type",
            label: "Type",
            sortable: true
          },
          {
            key: "start",
            label: "Start",
            formatter: (value: any) => {
              return value.toLocaleString();
            },
            sortable: true
          },
          {
            key: "user",
            label: "User",
            sortable: true
          },
          {
            key: "authorized",
            label: "Authorized",
            sortable: true
          },
          {
            key: "status",
            label: "Status",
            sortable: false
          }
        ],
        data: [] as any[],
        selected: [] as any[],
        sortBy: "name",
        sortDesc: false,
        sortDirection: "desc",
        filter: null
      },
      ssl: false,
      selected: [] as any[]
    };
  },

  methods: {
    ws_on_open() {
      this.ws_subscribe("config.web");
      this.table.data = [];
      this.ws_subscribe("web.sessions");
    },
    ws_on_data(obj: any) {
      console.log(obj);
      if (obj.cmd != null && obj.channel != null) {
        console.log(
          this.$options.name +
            " websocket received " +
            obj.cmd +
            " / " +
            obj.channel
        );
        if (obj.channel == "config.web") {
          if (obj.cmd == "insert") {
            if (obj.rec.key.name == "https-available") {
              this.cfg.ssl =
                obj.rec.data.value == null ? false : obj.rec.data.value;
            } else if (obj.rec.key.name == "https-rewrite") {
              this.cfg.https_rewrite = obj.rec.data.value;
            } else if (obj.rec.key.name == "http-session-timeout") {
              this.cfg.http_sessionTimeout = obj.rec.data.value;
            } else if (obj.rec.key.name == "https-session-timeout") {
              this.cfg.https_sessionTimeout =
                obj.rec.data.value == null ? 0 : obj.rec.data.value;
            } else if (obj.rec.key.name == "http-max-upload-size") {
              this.cfg.http_maxUploadSize = obj.rec.data.value;
            } else if (obj.rec.key.name == "https-max-upload-size") {
              this.cfg.https_maxUploadSize =
                obj.rec.data.value == null ? 0 : obj.rec.data.value;
            } else {
              console.log(
                this.$options.name +
                  " unhandled key " +
                  obj.cmd +
                  " / " +
                  obj.channel +
                  " / " +
                  obj.rec.key.name
              );
            }
          } else if (obj.cmd == "modify") {
            console.log("modify " + obj.key[0] + ": " + obj.value);
            if (obj.key[0] == "https-available") {
              this.cfg.ssl = obj.value;
            } else if (obj.key[0] == "https-rewrite") {
              this.cfg.https_rewrite = obj.value;
            } else if (obj.key[0] == "http-session-timeout") {
              this.cfg.http_sessionTimeout = obj.value;
            } else if (obj.key[0] == "http-max-upload-size") {
              this.cfg.http_maxUploadSize = obj.value;
            } else if (obj.key[0] == "https-session-timeout") {
              this.cfg.https_sessionTimeout = obj.value;
            } else if (obj.key[0] == "https-max-upload-size") {
              this.cfg.https_maxUploadSize = obj.value;
            }
          }
          // eslint-disable-next-line no-empty
          else if (obj.cmd == "load") {
          }
        }
        if (obj.channel == "web.sessions") {
          if (obj.cmd == "insert") {
            const start = new Date(obj.rec.data.start.substring(0, 19));
            const rec = {
              pk: obj.rec.key.tag,
              ep: obj.rec.data.ep,
              type: obj.rec.data.type,
              start: start,
              authorized: obj.rec.data.authorized,
              user: obj.rec.data.user,
              status: obj.rec.data.status
            };
            console.log(
              "insert web session" + obj.rec.key.tag + ": " + obj.rec.data.ep
            );
            this.table.data.push(rec);
          } else if (obj.cmd == "modify") {
            console.log("modify web session " + obj.tag);
            this.table.data.find(function(rec) {
              if (rec.pk == obj.key[0]) {
                console.log("modify record " + rec.ep);
                if (obj.type != null) {
                  rec.type = obj.type;
                } else if (obj.authorized != null) {
                  rec.authorized = obj.authorized;
                } else if (obj.status != null) {
                  rec.status = obj.status;
                }
              }
            });
          } else if (obj.cmd == "delete") {
            console.log("delete web session " + obj.key[0]);
            const idx = this.table.data.findIndex(rec => rec.pk === obj.key[0]);
            // eslint-disable-next-line
                            console.log('delete index ' + idx + ' - ' + obj.key[0]);
            this.table.data.splice(idx, 1);
          } else if (obj.cmd == "load") {
            if (obj.show != null) {
              // eslint-disable-next-line
                                console.log('load state ' + obj.show);
              this.table.isBusy = obj.show;
            } else if (obj.level != 0) {
              this.table.busyLevel = obj.level;
            }
          }
        }
      }
    },
    changeHTTPSessionTimeout() {
      console.log("changeSessionTimeout " + this.cfg.http_sessionTimeout);
      this.ws_submit_record("modify", "config.web", {
        key: { name: "http-session-timeout" },
        data: { value: this.cfg.http_sessionTimeout }
      });
    },
    changeHTTPMaxUploadSize() {
      console.log("changeMaxUploadSize " + this.cfg.http_maxUploadSize);
      this.ws_submit_record("modify", "config.web", {
        key: { name: "http-max-upload-size" },
        data: { value: this.cfg.http_maxUploadSize }
      });
    },
    changeHTTPsSessionTimeout() {
      console.log("changeSessionTimeout " + this.cfg.http_sessionTimeout);
      this.ws_submit_record("modify", "config.web", {
        key: { name: "https-session-timeout" },
        data: { value: this.cfg.https_sessionTimeout }
      });
    },
    changeHTTPsMaxUploadSize() {
      console.log("changeMaxUploadSize " + this.cfg.http_maxUploadSize);
      this.ws_submit_record("modify", "config.web", {
        key: { name: "https-max-upload-size" },
        data: { value: this.cfg.https_maxUploadSize }
      });
    },
    rowSelected(items: any[]) {
      this.selected = items;
    }
  },

  computed: {
    ws_url() {
      return this.ws_get_url();
    }
  },

  watch: {
    "cfg.ssl": function() {
      // console.log(this.cfg.ssl);
      this.ws_submit_record("modify", "config.web", {
        key: { name: "https-available" },
        data: { value: this.ssl }
      });
    },
    "cfg.https_rewrite": function() {
      //   console.log(this.cfg.https_rewrite);
      this.ws_submit_record("modify", "config.web", {
        key: { name: "https-rewrite" },
        data: { value: this.cfg.https_rewrite }
      });
    }
  },
  beforeRouteEnter(to: any, from: any, next: any) {
    hasPrivilegesWaitForUser(store, MODULES.CONFIG_WEB, PRIVILEGES.VIEW).then(
      result => {
        next(result ? true : NO_ACCESS_ROUTE);
      }
    );
  }
});
</script>

<style scoped lang="css"></style>
