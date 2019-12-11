<template lang="html">
    <section class="smf-monitor-lora">

        <template>
            <div>
                <vue-headful
                    title="smf :: monitor LoRa uplinks"
                    description="SMF dashboard"
                    keywords="SMF, solosTec"
                />
            </div>
        </template>

    <!-- <b-jumbotron fluid header="LoRa Uplink" :lead="uplinks.length + ' uplinks stored'" /> -->
    <b-jumbotron fluid :header="$t('header-monitor-lora')" :lead="$t('lead-monitor-lora', {count: this.uplinks.length})" />


    <b-container fluid>
      <b-row>
        <b-col md="12">
          <!-- table -->
          <b-table
            ref="uplinkTable"
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
            :items="uplinks"
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

            <!-- loading slot -->
            <div slot="table-busy" class="text-center text-danger">
              <strong>Loading... {{busyLevel}}%</strong>
            </div>

          </b-table>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="2" offset-md="10">
          <b-pagination v-model="currentPage" :total-rows="uplinks.length" :per-page="perPage"/>
        </b-col>
      </b-row>

    </b-container>

  </section>

</template>

<script lang="js">

import {webSocket} from '../mixins/web-socket.js'
import {hasPrivilegesWaitForUser} from "../mixins/privileges";
import store from "../store";
import {MODULES, NO_ACCESS_ROUTE, PRIVILEGES} from "../store/modules/user";

export default  {
    name: 'smfMonitorLora',
    props: [],
    mixins: [webSocket],

    mounted() {
        this.ws_open("/smf/api/lorauplink/v0.7");
    },
    data() {
        return {
            isBusy: false,
            busyLevel: 0,
            currentPage: 1,
            perPage: 10,
            fields: [
            {
                key: 'id',
                label: 'ID',
                sortable: true,
                class: 'text-right small text-muted'
            },
            {
                key: 'ts',
                label: 'Timestamp (UTC)',
                sortable: true,
                formatter: (value, key, item) => {
                    return value.toUTCString();
                }
            },
            {
                key: 'DevEUI',
                label: 'DevEUI',
                sortable: true
            },
            {
                key: 'FPort',
                label: 'FPort',
                sortable: true,
                class: 'text-right'
            },
            {
                key: 'FCntUp',
                label: 'FCntUp',
                sortable: true,
                class: 'text-right'
            },
            {
                key: 'FCntDn',
                label: 'FCntDn',
                sortable: true,
                class: 'text-right'
            },
            {
                key: 'ADRbit',
                label: 'ADRbit',
                sortable: true,
                class: 'text-right'
            },
            {
                key: 'MType',
                label: 'MType',
                sortable: true,
                class: 'text-right'
            },
            {
                key: 'CustomerID',
                label: 'CustomerID',
                sortable: true,
                class: 'text-right'
            },
            {
                key: 'payload',
                label: 'Payload',
                sortable: true
            },
            ],
            uplinks:[],
            selected: [],
            sortBy: 'id',
            sortDesc: false,
            sortDirection: 'desc',
        }
    },

    beforeDestroy() {
        this.ws_close();
    },

    methods: {
        rowSelected(items) {
            this.selected = items
        },
        ws_on_open() {
            //  clear table
            this.uplinks = [];
            this.ws_subscribe("monitor.lora");
        },
        ws_on_data(obj) {
            if (obj.cmd != null) {
                console.log(this.$options.name + ' websocket received ' + obj.cmd + ' / ' + obj.channel);
                if (obj.cmd == 'insert') {
                    var ts = new Date(obj.rec.data.ts.substring(0, 19));
                    // var rowNode = table_msg.row.add([obj.rec.key.id, ts, obj.rec.data.DevEUI, obj.rec.data.FPort, obj.rec.data.FCntUp, obj.rec.data.ADRbit, obj.rec.data.MType, obj.rec.data.FCntDn, obj.rec.data.CustomerID, payload]).draw().node();
                    var rec = {
                        id: obj.rec.key.id,
                        ts: ts,
                        DevEUI: obj.rec.data.DevEUI,
                        FPort: obj.rec.data.FPort,
                        FCntUp: obj.rec.data.FCntUp,
                        ADRbit: obj.rec.data.ADRbit,
                        MType: obj.rec.data.MType,
                        FCntDn: obj.rec.data.FCntDn,
                        CustomerID: obj.rec.data.CustomerID,
                        payload: obj.rec.data.Payload};
                    this.uplinks.push(rec);

                }
                else if (obj.cmd == 'clear') {
                    this.uplinks = [];
                }
             }
        }
    },
    beforeRouteEnter(to, from, next) {
        hasPrivilegesWaitForUser(store, MODULES.MONITOR_LORA, PRIVILEGES.VIEW).then((result) => {
            next( result ? true: NO_ACCESS_ROUTE);
        });
    }
}
</script>

<style scoped lang="css">
</style>
