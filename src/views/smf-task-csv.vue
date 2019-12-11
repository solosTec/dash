<template lang="html">

    <section class="smf-task-csv">

        <template>
            <div>
                <vue-headful
                    title="smf :: task CSV"
                    description="SMF dashboard"
                    keywords="SMF, solosTec"
                />
            </div>
        </template>

    <!-- <b-jumbotron fluid header="Generate CSV reports" :lead="jumboLead" /> -->
    <b-jumbotron fluid :header="$t('header-task-csv')" :lead="jumboLead" />

    <b-container fluid>
      <b-row>
        <b-col md="12">
          <!-- table -->
          <b-table
            ref="csvTable"
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
            :items="csv"
            :busy="isBusy"
            :current-page="currentPage"
            :per-page="perPage"
            primary-key="pk"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            class="shadow"
            >

            <!-- caption slot -->
            <!-- <template slot="table-caption">{{ tableCaption }}</template> -->

            <!-- A virtual column -->
            <template v-slot:cell(index)="data">{{ data.index + 1 }}</template>

            <!-- loading slot -->
            <div slot="table-busy" class="text-center text-danger">
              <strong>Loading... {{busyLevel}}%</strong>
            </div>

          </b-table>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="2" offset-md="10">
          <b-pagination v-model="currentPage" :total-rows="csv.length" :per-page="perPage"/>
        </b-col>
      </b-row>
    </b-container>
  </section>

</template>

<script lang="js">

import {webSocket} from '../../services/web-socket.js'

export default  {
    name: 'smfTaskCSV',
    props: [],
    mixins: [webSocket],

    mounted() {
        this.ws_open("/smf/api/csv/v0.7");
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
            {
                key: 'cfg',
                label: 'Configuration'
            },
            {
                key: 'format',
                label: 'Format'
            },
            {
                key: 'offset',
                label: 'Offset'
            },
            {
                key: 'frame',
                label: 'Frame'
            },
            {
                key: 'start15min',
                label: 'Last run (15min)',
                formatter: (value, key, item) => {
                    return value.toUTCString();
                }
            },
            {
                key: 'start60min',
                label: 'Last run (60min)',
                formatter: (value, key, item) => {
                    return value.toUTCString();
                }
            },
            {
                key: 'start24h',
                label: 'Last run (24h)',
                formatter: (value, key, item) => {
                    return value.toUTCString();
                }
            },
            {
                key: 'srvCount15min',
                label: 'Server Count (15min)',
                class: 'text-right'
            },
            {
                key: 'srvCount60min',
                label: 'Server Count (60min)',
                class: 'text-right'
            },
            {
                key: 'srvCount24h',
                label: 'Server Count (24h)',
                class: 'text-right'
            }
            ],
            csv: [],
            selected: [],
            sortBy: 'name',
            sortDesc: false,
            sortDirection: 'desc'
        }
    },
    methods: {
        ws_on_open() {
            //  clear table
            this.csv = [];
            this.ws_subscribe("task.csv");
        },
        ws_on_data(obj) {
            if (obj.cmd != null) {
                console.log(this.$options.name + ' websocket received ' + obj.cmd + ' / ' + obj.channel);
                if (obj.cmd == 'insert') {
                    if (obj.channel == 'task.csv') {
                        var rec = {
                            pk: obj.rec.key.tag,
                            cfg: obj.rec.data.config,
                            format: obj.rec.data.format,
                            offset: obj.rec.data.offset,
                            frame: obj.rec.data.frame,
                            start15min: new Date(obj.rec.data.start15min.substring(0, 19)),
                            start60min: new Date(obj.rec.data.start60min.substring(0, 19)),
                            start24h: new Date(obj.rec.data.start24h.substring(0, 19)),
                            srvCount15min: obj.rec.data.srvCount15min,
                            srvCount60min: obj.rec.data.srvCount60min,
                            srvCount24h: obj.rec.data.srvCount24h };
                        this.csv.push(rec);
                    }
                }
                else if (obj.cmd == 'modify') {
                    this.csv.find(function(rec) {
                        if(rec.pk == obj.key[0]) {
                            console.log('modify csv ' + rec.pk);
                            if (obj.value.start15min != null) {
                                rec.start15min = new Date(obj.value.start15min.substring(0, 19));
                            }
                            else if (obj.value.start60min != null) {
                                rec.start60min = new Date(obj.value.start60min.substring(0, 19));
                            }
                            else if (obj.value.start24h != null) {
                                rec.start24h = new Date(obj.value.start24h.substring(0, 19));
                            }
                            else if (obj.value.srvCount15min != null) {
                                rec.srvCount15min = obj.value.srvCount15min;
                            }
                            else if (obj.value.srvCount60min != null) {
                                rec.srvCount60min = obj.value.srvCount60min;
                            }
                            else if (obj.value.srvCount24h != null) {
                                rec.srvCount24h = obj.value.srvCount24h;
                            }
                        }
                    });
                }
                else if (obj.cmd == 'delete') {
                    console.log('lookup csv ' + obj.key);
                    var idx = this.csv.findIndex(rec => rec.pk == obj.key);
                    console.log('delete index ' + idx);
                    this.csv.splice(idx, 1);
                }
                else if (obj.cmd == 'clear') {
                    this.csv = [];
                }
                else if (obj.cmd == 'load') {
                    if (obj.show != null) {
                        console.log('load state ' + obj.show);
                        this.isBusy = obj.show;
                    }
                    else if (obj.level != 0) {
                        this.busyLevel = obj.level;
                    }
                }
            }
        },
        rowSelected(items) {
            this.selected = items;
        }

    },
    computed: {
        jumboLead: function() {
            switch (this.csv.length ) {
                case 0: return this.$t('lead-task-csv-0');
                case 1: return this.$t('lead-task-csv-1');
                default:
                break;
            }
            return "There are " + this.csv.length + " nodes that creating CSV reports";
        }
    }
}
</script>

<style scoped lang="css">
</style>
