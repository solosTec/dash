<template lang="html">

    <section class="smf-status-session">

        <template>
            <div>
                <vue-headful
                    title="smf :: status sessions"
                    description="SMF dashboard"
                    keywords="SMF, solosTec"
                />
            </div>
        </template>

    <!-- <b-jumbotron fluid header="All subscribers that are online" :lead="sessions.length + ' sessions so far'"> -->
    <b-jumbotron fluid :header="$t('header-status-session')" :lead="$t('lead-status-session', {count: this.sessions.length})" >
        <b-progress class="mt-2" height="1.2rem" :max="deviceCount" show-value>
            <b-progress-bar :value="sessions.length" variant="success" />
            <b-progress-bar :value="deviceCount - sessions.length" variant="warning" />
        </b-progress>
    </b-jumbotron>


    <b-container fluid>

      <b-row>
        <b-col md="6">
            <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
                <b-input-group>
                    <b-form-input v-model="filter" placeholder="Type to Search" />
                    <b-input-group-append>
                    <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-form-group>
        </b-col>
        <b-col md="6">
          <b-pagination v-model="currentPage" :total-rows="sessions.length" :per-page="perPage" class="justify-content-end" />
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <!-- table -->
            <b-table ref="sessionTable"
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
                     :items="sessions"
                     :busy="isBusy"
                     :current-page="currentPage"
                     :per-page="perPage"
                     :filter="filter"
                     primary-key="pk"
                     :sort-by.sync="sortBy"
                     :sort-desc.sync="sortDesc"
                     :sort-direction="sortDirection"
                     class="shadow">

                <!-- A virtual column -->
                <template slot="index" slot-scope="data">
                    {{ data.index + 1 + (perPage * (currentPage - 1)) }}
                </template>

                <template slot="stop" slot-scope="row">
                    <b-button size="sm"
                              variant="warning"
                              class="shadow"
                              @click="onSessionAction(row.item, row.index, $event.target)">Stop</b-button>
                </template>

                <!-- loading slot -->
                <div slot="table-busy" class="text-center text-danger">
                    <strong>Loading... {{busyLevel}}%</strong>
                </div>

            </b-table>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
            <b-form v-on:submit.prevent class="p-3 shadow">
                <b-input-group class="pt-3">
                    <b-button type="submit" variant="danger" :disabled="!isRecordSelected" v-on:click.stop="onSessionStop">{{btnStopTitle}}</b-button>
                </b-input-group>
            </b-form>
        </b-col>
      </b-row>

    </b-container>

  </section>

</template>

<script lang="js">

  import {webSocket} from '../../services/web-socket.js'

  export default  {
    name: 'smfStatusSession',
    props: [],
    mixins: [webSocket],

    mounted() {
        this.ws_open("/smf/api/session/v0.7");
    },

    data() {
      return {
        isBusy: false,
        busyLevel: 0,
        currentPage: 1,
        perPage: 10,
        fields: [
          {
            key: 'index',
            class: 'text-right small text-muted'
          },
          //  UUID
          {
            key: 'name',
            label: 'Name',
            sortable: true
          },
          {
            key: 'protocol',
            label: 'Protocol',
            sortable: true
          },
          {
            key: 'rx',
            label: 'RX',
            sortable: true,
            class: 'text-right',
            formatter: (value, key, item) => {
                return this.ws_format_bytes(value);
            }
          },
          {
            key: 'sx',
            label: 'SX',
            sortable: true,
            class: 'text-right',
            formatter: (value, key, item) => {
                return this.ws_format_bytes(value);
            },
          },
          {
            key: 'px',
            label: 'PX',
            sortable: true,
            class: 'text-right',
            formatter: (value, key, item) => {
                return this.ws_format_bytes(value);
            },
          },
          {
            key: 'login',
            label: 'Login',
            sortable: true,
            formatter: (value, key, item) => {
                return value.toUTCString();
            }
          },
          {
            key: 'source',
            label: 'Source',
            sortable: true,
            class: 'text-right',
            formatter: (value, key, item) => {
                return value.toString().padStart(10, '0');
            }
          },
          {
              key: 'stop',
              label: "Action",
              class: 'text-center'
          },
          {
            key: 'lastSeen',
            label: 'Last Activity',
            sortable: true,
            formatter: (value, key, item) => {
                return ('00' + value.getUTCHours()).slice(-2) + ":" + ('00' + value.getUTCMinutes()).slice(-2) + ":" + ('00' + value.getUTCSeconds()).slice(-2);
            },
            class: 'text-right'
          }
        ],
        sessions: [],
        selected: [],
        sortBy: 'name',
        sortDesc: false,
        sortDirection: 'desc',
        filter: null,
        visibleRows: 0,
        deviceCount: 0
      }
    },

    beforeDestroy() {
        this.ws_close();
    },

    methods: {
        ws_on_open() {
            //  clear table
            this.sessions = [];
            this.ws_subscribe("status.session");
            this.ws_subscribe("table.device.count");
        },
        ws_on_data(obj) {
            if (obj.cmd != null) {
                console.log(this.$options.name + ' websocket received ' + obj.cmd + ' / ' + obj.channel);
                if (obj.cmd == 'insert') {
                    var loginTime = new Date(obj.rec.data.loginTime.substring(0, 19));
                    var rec = {
                        pk: obj.rec.key.tag,
                        name: obj.rec.data.name,
                        source: obj.rec.data.source,
                        protocol: obj.rec.data.layer,
                        rx: obj.rec.data.rx,
                        sx: obj.rec.data.sx,
                        px: obj.rec.data.px,
                        login: loginTime,
                        lastSeen: loginTime };
                    this.sessions.push(rec);
                }
                else if (obj.cmd == 'delete') {
                    var idx = this.sessions.findIndex(rec => rec.pk == obj.key);
                    console.log('delete index ' + idx);
                    this.sessions.splice(idx, 1);
                }
                else if (obj.cmd == 'modify') {
                    this.sessions.find(function(rec) {
                        if(rec.pk == obj.key) {
                            // console.log('modify record ' + rec.name);
                            if (obj.value.rx != null) {
                                rec.rx = obj.value.rx;
                            }
                            else if (obj.value.sx != null) {
                                rec.sx = obj.value.sx;
                            }
                            else if (obj.value.px != null) {
                                rec.px = obj.value.px;
                            }
                            //  update activity
                            rec.lastSeen = new Date();
                        }
                    });
                }
                else if (obj.cmd == 'clear') {
                    this.sessions = [];
                }
                else if (obj.cmd == 'load') {
                    if (obj.show != null) {
                        this.isBusy = obj.show;
                    }
                    else if (obj.level != 0) {
                        this.busyLevel = obj.level;
                    }
                }
                else if (obj.cmd == 'update') {
                    if (obj.channel != null) {
                        console.log('update channel ' + obj.channel);
                        if (obj.channel == 'table.device.count') {
                            this.deviceCount = obj.value;
                        }
                    }
                }
            }
        },
        rowSelected(items) {
            this.selected = items;
        },
        onSessionStop(evt) {
            this.selected.forEach(element => {
                this.ws_submit_key("stop", "status.session", [element.pk] );
            });
        },
        onSessionAction(item, index, button) {
            this.ws_submit_key("stop", "status.session", [item.pk] );
        }
    },

    computed: {
        isRecordSelected() {
            return this.selected.length != 0;
        },
        btnStopTitle() {
            if (this.selected.length == 0)  {
                return "Stop";
            }
            else if(this.selected.length == 1) {
                return "Stop Session " + this.selected[0].name;
            }
            return "Stop " + this.selected.length + " Sessions";
        }
    }
}
</script>

<style scoped lang="css">
</style>
