<template lang="html">

    <section class="smf-monitor-tsdb">
        <template>
            <div>
                <vue-headful
                    title="smf :: monitor time series database"
                    description="SMF dashboard"
                    keywords="SMF, solosTec"
                />
            </div>
        </template>

        <!-- <b-jumbotron fluid header="Time Series" /> -->
        <b-jumbotron fluid :header="$t('header-monitor-tsdb')"/>
        <b-container fluid>

            <b-row>
                <b-col md="6">
                    <b-form-group label-cols-sm="3" :label="$t('tbl-filter')" class="mb-0">
                        <b-input-group>
                            <b-form-input v-model="filter" :placeholder="$t('tbl-search')" />
                            <b-input-group-append>
                                <b-button :disabled="!filter" @click="filter = ''">{{ $t('action-del') }}</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>

            <b-col md="6">
                <b-form-row>
                    <smf-row-count-selector v-model="perPage" store-key="tsdb" class="col"/>
                    <b-pagination v-model="currentPage" :total-rows="visibleRows" :per-page="perPage" class="justify-content-end" />
                </b-form-row>
            </b-col>
            </b-row>

            <b-row>
                <b-col md="12">
                    <b-table
                    ref="timeSeriesTable"
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
                    :items="timeSeries"
                    :busy="isBusy"
                    primary-key="id"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :filter="filter"
                    @filtered="onFiltered"
                    class="shadow">

                    <!-- caption slot -->
                    <!-- <template slot="table-caption">{{tableCaption}}</template> -->

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

<script lang="ts">

import {webSocket} from '@/mixins/web-socket'
import {hasPrivilegesWaitForUser} from "@/mixins/privileges";
import store from "../store";
import {MODULES, NO_ACCESS_ROUTE, PRIVILEGES} from "@/store/modules/user";
import mixins from 'vue-typed-mixins';
import Vue from 'vue';

export default  mixins(webSocket, Vue).extend({
    name: 'smfMonitorTSDB',
    props: [],
    mixins: [webSocket],

    mounted() {
        this.ws_open("/smf/api/tsdb/v0.8");
    },
    data() {
        return {
            isBusy: true,
            busyLevel: 0,
            currentPage: 1,
            perPage: 25,
            fields: [
                {
                    key: 'id',
                    class: 'text-right small text-muted',
                    formatter: (value: any) => {
                        return value + 1;
                    }
                },
                {
                    key: 'ts',
                    label: 'Timestamp',
                    sortable: true,
                    formatter: (value: any) => {
                        return value.toLocaleString()
                    }
                },
                {
                    key: 'account',
                    label: 'Account',
                    sortable: true
                },
                {
                    key: 'evt',
                    label: 'Event',
                    sortable: true
                },
                {
                    key: 'obj',
                    label: 'Object',
                    sortable: true
                }
            ],
            timeSeries: [] as any[],
            sortBy: 'id',
            sortDesc: true,
            sortDirection: 'asc',
            filter: null,
            visibleRows: 0
        }
    },
    methods: {
        rowSelected(items: any[]) {
        },
        ws_on_open() {
            //  clear table
            this.timeSeries = [];

            this.ws_subscribe("monitor.tsdb");

        },
        ws_on_data(obj: any) {
            if (obj.cmd != null) {
                console.log(this.$options.name + ' websocket received ' + obj.cmd);
                if (obj.cmd == 'update') {
                    if (obj.channel != null) {
                        console.log('update channel ' + obj.channel + ": " + obj.value);
                    }
                }
                else if (obj.cmd == 'insert') {
                    const ts = new Date(obj.rec.data.ts.substring(0, 19));
                    const rec = {
                        id: obj.rec.key.id,
                        account: obj.rec.data.account,
                        evt: obj.rec.data.evt,
                        obj: obj.rec.data.obj,
                        ts: ts } as any;

                    if (obj.rec.data.evt == 'login') {
                        rec["_rowVariant"] = "success";
                    }
                    else if (obj.rec.data.evt == 'offline') {
                        rec["_rowVariant"] = "warning";
                    }
                    this.timeSeries.push(rec);
                }
                else if (obj.cmd == 'clear') {
                    this.timeSeries = [];
                }
                // eslint-disable-next-line no-empty
                else if (obj.cmd == 'delete') {
                }
                // eslint-disable-next-line no-empty
                else if (obj.cmd == 'modify') {
                }
                else if (obj.cmd == 'load') {
                    //  load status
                    if (obj.show != null) {
                        // console.log('load state ' + obj.show);
                        this.isBusy = obj.show;
                    }
                    else if (obj.level != 0) {
                        console.log('load state ' + obj.level);
                        this.busyLevel = obj.level;
                        //  https://stackoverflow.com/questions/53119086/how-do-i-update-the-items-async-in-a-b-table-from-bootstrap-vue-reusing-the-item
                        //  doesn't work here
                        // this.$refs.timeSeriesTable.refresh();
                    }
                }
                //    update pagination
                this.visibleRows = this.timeSeries.length;

            }
        },
        onFiltered(filteredItems: any[]) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.visibleRows = filteredItems.length
            this.currentPage = 1
        },

    },
    beforeRouteEnter(to: any, from: any, next: any) {
        hasPrivilegesWaitForUser(store, MODULES.MONITOR_TSDB, PRIVILEGES.VIEW).then((result) => {
            next( result ? true: NO_ACCESS_ROUTE);
        });
    }
})
</script>

<style scoped lang="css">
</style>
