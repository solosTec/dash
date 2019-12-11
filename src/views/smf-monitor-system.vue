<template lang="html">

    <section class="smf-monitor-system">

        <template>
            <div>
                <vue-headful
                    title="smf :: monitor SMF"
                    description="SMF dashboard"
                    keywords="SMF, solosTec"
                />
            </div>
        </template>

    <!-- <b-jumbotron fluid header="System Status" :lead="nodes.length + ' nodes online'" /> --> -->
    <b-jumbotron fluid :header="$t('header-monitor-system')" :lead="$t('lead-monitor-system', {count: this.nodes.length})" />

    <b-container fluid>
      <b-row>
        <b-col md="12">
        <b-card-group deck>

            <b-card title="CPU" class="shadow">
              <b-card-text>CPU load in %</b-card-text>
              <!-- https://stackoverflow.com/a/52142602/3979819 -->
              <b-progress class="mt-2" height="1.2rem" :value="stat.cpuLoad.value" :max="stat.max" :variant="stat.cpuLoad.variant" show-value />
              <div slot="footer"><small class="text-muted">{{stat.cpuCount}} CPUs available</small></div>
            </b-card>

            <b-card title="Memory" class="shadow">
              <b-card-text>Virtual Memory Usage</b-card-text>
              <b-progress class="mt-2" height="1.2rem" :value="stat.virtualMemory.percent" :max="stat.max" :variant="stat.virtualMemory.variant" show-value></b-progress >
              <div slot="footer"><small class="text-muted">{{virtualMemoryTotalFormatted}} virtual memory are available</small></div>
            </b-card>

            <b-card title="I/O" class="shadow">
              <b-card-text>Bytes exchanged with server.</b-card-text>
              <!-- <b-progress class="mt-2" height="1.2rem" :max="stat.rx + stat.sx" show-value>
                <b-progress-bar :value="stat.sx" variant="info" />
                <b-progress-bar :value="stat.rx" variant="success" />
              </b-progress> -->
              <b-card-text>{{ received }} received</b-card-text>
              <b-card-text>{{ send }} sent</b-card-text>
              <div slot="footer"><small class="text-muted">{{ totalIoFormatted }} in total</small></div>
            </b-card>

        </b-card-group>
        </b-col>
      </b-row>

      <br />

      <b-row>
        <b-col md="12">
          <b-table
            ref="sysTable"
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
            :items="nodes"
            :busy="isBusy"
            primary-key="key"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            :current-page="currentPage"
            :per-page="perPage"
            class="shadow"
            >

            <!-- A virtual column -->
            <template v-slot:cell(index)="data">{{ data.index + 1 }}</template>

            <!-- caption slot -->
            <!-- <template slot="table-caption">{{ tableCaption }}</template> -->
            <!-- <template slot="table-caption">ToDo: CAPTION</template> -->

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
    </b-container>
  </section>

</template>

<script lang="js">

import {webSocket} from '../../services/web-socket.js'
import {mapState} from "vuex";

export default  {
    name: 'smfMonitorSystem',
    props: [],
    mixins: [webSocket],
    mounted() {
        this.ws_open("/smf/api/system/v0.7");
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
                key: 'index',
                class: 'text-right small text-muted'
            },
            {
                key: 'class',
                label: 'Class',
                sortable: true
            },
            {
                key: 'version',
                label: 'Version',
                sortable: true
            },
            {
                key: 'clients',
                label: 'Clients',
                sortable: true,
                class: 'text-right'
            },
            {
                key: 'loginTime',
                label: 'Login',
                sortable: true
            },
            {
                key: 'ping',
                label: 'Ping',
                sortable: true
            },
            {
                key: 'ep',
                label: 'IP',
                sortable: true
            },
            {
                key: 'pid',
                label: 'PID',
                sortable: true,
                class: 'text-right'
            }
            ],
            nodes: [],
            sortBy: 'class',
            sortDesc: false,
            sortDirection: 'desc',
            stat : {
                cpuCount: 0,
                cpuLoad : {
                    value: 0,
                    variant: 'success'
                },
                virtualMemory :{
                    total: 0,
                    used: 0,
                    percent: 0,
                    variant: 'success'
                },
                ioLoad: 0,
                nodeCount: 0,
                max: 100
            },
            sysTimer: null
        }
    },

    beforeDestroy() {
        clearTimeout(this.sysTimer);
        this.ws_close();
    },

    methods: {
        rowSelected(items) {
        },

        ws_on_open() {
            //  clear table
            this.nodes = [];

            this.ws_update("sys.mem.virtual.total");
            this.ws_update("sys.cpu.count");
            this.ws_update("sys.mem.virtual.stat");
            this.ws_update("sys.cpu.usage.total");

            this.ws_subscribe("status.cluster");
            this.ws_subscribe("table.cluster.count");

            // this.onSysTimer();
        },

        ws_on_data(obj) {
            if (obj.cmd != null) {
                console.log(this.$options.name + ' websocket received ' + obj.cmd + ' [' + obj.channel + ']');
                if (obj.cmd == 'update') {
                    if (obj.channel != null) {
                        // console.log('update channel ' + obj.channel + ": " + obj.value);
                        if (obj.channel == 'sys.cpu.usage.total') {
                            this.stat.cpuLoad.value = obj.value;
                            if (obj.value < 75) {
                                this.stat.cpuLoad.variant = "success";
                            }
                            else if (obj.value < 90) {
                                this.stat.cpuLoad.variant = "warning";
                            }
                            else {
                                this.stat.cpuLoad.variant = "danger";
                            }
                        }
                        else if (obj.channel == 'sys.cpu.count') {
                            this.stat.cpuCount = obj.value;
                        }
                        else if (obj.channel == 'sys.mem.virtual.used') {
                            // this.stat.virtualMemory.used = obj.value;
                        }
                        else if (obj.channel == 'sys.mem.virtual.total') {
                            this.stat.virtualMemory.total = obj.value;
                        }
                        else if (obj.channel == 'sys.mem.virtual.stat') {
                            //  {"cmd": "update", "channel": "sys.mem.virtual.stat", "value": {"percent":34.919550616183272,"total":39400308736,"used":13758410752}}
                            // this.stat.virtualMemory.total = obj.value.total;
                            this.stat.virtualMemory.used = obj.value.used;
                            this.stat.virtualMemory.percent = obj.value.percent;
                            if (obj.value.percent < 60) {
                                this.stat.virtualMemory.variant = "success";
                            }
                            else if (obj.percent < 85) {
                                this.stat.virtualMemory.variant = "warning";
                            }
                            else {
                                this.stat.virtualMemory.variant = "danger";
                            }
                        }
                    }
                }
                else if (obj.cmd == 'insert') {
                    if (obj.channel == 'status.cluster') {
                        var rec = { key: obj.rec.key.tag,
                            class: obj.rec.data.class,
                            version: obj.rec.data.version,
                            clients: obj.rec.data.clients,
                            loginTime: obj.rec.data.loginTime,
                            ping: obj.rec.data.ping,
                            ep: obj.rec.data.ep,
                            pid: obj.rec.data.pid };
                        this.nodes.push(rec);
                    }
                }
                else if (obj.cmd == 'clear') {
                    //  clear table
                    this.nodes = [];
                }
                else if (obj.cmd == 'delete') {
                    // console.log('lookup node ' + obj.key);
                    var idx = this.nodes.findIndex(rec => rec.key == obj.key);
                    // console.log('delete index ' + idx);
                    this.nodes.splice(idx, 1);
                }
                else if (obj.cmd == 'modify') {
                    this.nodes.find(function(rec) {
                        if(rec.key == obj.key) {
                            // console.log('modify record ' + rec.key);
                            if (obj.value.clients != null) {
                                rec.clients = obj.value.clients;
                            }
                            else if (obj.value.ping != null) {
                                rec.ping = obj.value.ping;
                            }
                        }
                    });
                }
                else if (obj.cmd == 'load') {
                    //  load status
                    if (obj.show != null) {
                        // console.log('load state ' + obj.show);
                        this.isBusy = obj.show;
                    }
                    else if (obj.level != 0) {
                        this.busyLevel = obj.level;
                    }
                }
            }
        },
        onSysTimer() {

            this.ws_update("sys.mem.virtual.stat");
            this.ws_update("sys.cpu.usage.total");

            //  restart
            this.sysTimer = setTimeout(this.onSysTimer, 5000);
        }
    },
    computed: {
        tableCaption() {
            return "Showing " + this.nodes.length + " cluster nodes";
        },
        virtualMemoryTotalFormatted() {
            return this.ws_format_bytes(this.stat.virtualMemory.total);
        },
        ...mapState({
            totalIoFormatted: function (state) {
              return this.ws_format_bytes(state.websocket.sx + state.websocket.rx);
            },
            received: function(state) {
                return this.ws_format_bytes(state.websocket.rx);
            },
            send: function(state){
                return this.ws_format_bytes(state.websocket.sx);
            }
        })
    }
}
</script>

<style scoped lang="css">
</style>
