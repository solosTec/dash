<template lang="html">

    <section class="smf-monitor-messages">

        <template>
            <div>
                <vue-headful
                    title="smf :: monitor system messages"
                    description="SMF dashboard"
                    keywords="SMF, solosTec"
                />
            </div>
        </template>

    <!-- <b-jumbotron fluid header="System Messages" :lead="msgCount + ' messages logged'"> -->
        <b-jumbotron fluid :header="$t('header-monitor-messages')" :lead="$t('lead-monitor-messages', {count: this.messages.length})">
            <b-progress class="mt-2 shadow" :max="msgCount" show-value height="1.5rem">
                <b-progress-bar :value="stat.trace + stat.debug" variant="info" />
                <b-progress-bar :value="stat.info" variant="success" />
                <b-progress-bar :value="stat.warn" variant="secondary" />
                <b-progress-bar :value="stat.error" variant="warning" />
                <b-progress-bar :value="stat.fatal" variant="danger" />
            </b-progress>

        </b-jumbotron>

    <b-container fluid>

      <b-row>
        <b-col md="12">
          <b-table
            ref="msgTable"
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
            :fields="fields"
            :items="messages"
            :busy="isBusy"
            primary-key="id"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            :current-page="currentPage"
            :per-page="perPage"
            class="shadow">

            <!-- caption slot -->
            <template slot="table-caption">{{tableCaption}}</template>

            <!-- loading slot -->
            <div slot="table-busy" class="text-center text-danger">
              <strong>Loading... {{busyLevel}}%</strong>
            </div>

            <!-- <template slot="empty" slot-scope="scope">
              <p>{{ scope.emptyText }}</p>
            </template> -->
          </b-table>
        </b-col>
      </b-row>

      <b-row>

        <b-col md="2">
          <b-list-group>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              TRACE
              <b-badge variant="info" pill>{{stat.trace}}</b-badge>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              DEBUG
              <b-badge variant="info" pill>{{stat.debug}}</b-badge>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              INFO
              <b-badge variant="success" pill>{{stat.info}}</b-badge>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              WARN
              <b-badge variant="secondary" pill>{{stat.warn}}</b-badge>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              ERROR
              <b-badge variant="warning" pill>{{stat.error}}</b-badge>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              FATAL
              <b-badge variant="danger" pill>{{stat.fatal}}</b-badge>
            </b-list-group-item>
          </b-list-group>
        </b-col>

        <!-- <b-col md="4" offset-md="6"> -->
        <b-col md="10">
          <b-pagination v-model="currentPage" :total-rows="msgCount" :per-page="perPage" class="justify-content-end"/>
        </b-col>

      </b-row>

      <!-- <b-row>
        <b-col md="12">
          <h1>HALLO</h1>
        </b-col>
      </b-row> -->
      <br />
    </b-container>


  </section>
</template>

<script lang="js">

import {webSocket} from '../../services/web-socket.js'

export default  {
    name: 'smfMonitorMessages',
    props: [],
    mixins: [webSocket],

    mounted() {
        var rec = { id: 0, ts: new Date(), severity: 3, msg: "mounted"};
        rec["_rowVariant"] = 'success';
        this.messages.push(rec);
        this.ws_open("/smf/api/gw/v0.7");
        this.isBusy = true;
    },

    data() {
        return {
        msgCount: 0,
        isBusy: false,
        busyLevel: 0,
        currentPage: 1,
        perPage: 10,
        fields: [
          {
            key: 'id',
            label: 'ID',
            formatter: (value, key, item) => {
              return value + 1;
            },
            sortable: true
          },
          {
            key: 'ts',
            label: 'TimeStamp',
            formatter: (value, key, item) => {
              return value.toLocaleString()
            },
            sortable: true
          },
          {
            key: 'severity',
            label: 'Severity',
            formatter: (value, key, item) => {
               switch(value) {
                case 1: return "TRACE";
                case 2: return "DEBUG";
                case 3: return "INFO ";
                case 4: return "WARN ";
                case 5: return "ERROR";
                case 6: return "FATAL";
                default: break;
                }
              return 'ALL';
            },
            sortable: true
          },
          {
            key: 'msg',
            label: 'Message',
            sortable: true
          }

        ],
        messages: [],
        sortBy: 'id',
        sortDesc: true,
        sortDirection: 'desc',
        stat : {
          trace: 0,
          debug: 0,
          info: 0,
          warn: 0,
          error: 0,
          fatal: 0,
        }
      }
    },

    beforeDestroy() {
        this.ws_close();
    },

    methods: {
        rowSelected(items) {
        },

        ws_on_open() {
            //  clear table
            this.messages = [];
            this.ws_subscribe("monitor.msg");
            this.ws_subscribe("table.msg.count");
        },

      ws_on_data(obj) {
        if (obj.cmd != null) {
          console.log('websocket received ' + obj.cmd);
          if (obj.cmd == 'update') {
            if (obj.channel != null) {
              if (obj.channel == 'table.msg.count') {
                this.msgCount = obj.value;
              }
            }
          }
          else if (obj.cmd == 'insert') {
            //  {"rec": {"key": {"id":0}, "data": {"msg":"startup","severity":3,"ts":"2018-03-20 18:05:24.71590930"}}}
                console.log('message ' + obj.rec.key.id);
              // rec._rowVariant = 'warning';
              var rec = { id: obj.rec.key.id, ts: obj.rec.data.ts, severity: obj.rec.data.severity, msg: obj.rec.data.msg};
              switch (obj.rec.data.severity) {
                case 1:
                  this.stat.trace++;
                  break;
                case 2:
                  this.stat.debug++;
                  break;
                case 3:
                  this.stat.info++;
                  rec["_rowVariant"] = 'success';
                  break;
                case 4:
                  this.stat.warn++;
                  rec["_rowVariant"] = 'secondary';
                  break;
                case 5:
                  this.stat.error++;
                  rec["_rowVariant"] = 'warning';
                  break;
                case 6:
                  this.stat.fatal++;
                  rec["_rowVariant"] = 'danger';
                  break;
                default:
                  break;
              }
              this.messages.push(rec);
          }
          else if (obj.cmd == 'clear') {
            //  clear table
            this.messages = [];
          }
          else if (obj.cmd == 'delete') {
            console.log('lookup message ' + obj.key);
            var idx = this.messages.findIndex(rec => rec.id == obj.id);
            console.log('delete index ' + idx);
            this.messages.splice(idx, 1);
          }
          else if (obj.cmd == 'load') {
            //  load status
            if (obj.show != null) {
              console.log('load state ' + obj.show);
              this.isBusy = obj.show;
            }
            else if (obj.level != 0) {
              this.busyLevel = obj.level;
            }
          }
        }
      }

    },
    computed: {
      tableCaption() {
        return "Showing " + this.msgCount + " messages";
      }

    }
}
</script>

<style scoped lang="css">
</style>
