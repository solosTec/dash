<template lang="html">

    <section class="smf-task-tsdb">

        <template>
            <div>
                <vue-headful
                    title="smf :: task time series database"
                    description="SMF dashboard"
                    keywords="SMF, solosTec"
                />
            </div>
        </template>

        <!-- <b-jumbotron fluid header="Bridge to Time Series Databases" :lead="tsdbs.length + ' time series databases online'" /> -->
        <b-jumbotron fluid :header="$t('header-task-tsdb')" :lead="$t('lead-task-tsdb', {count: this.tsdbs.length})" />

        <b-container fluid>
            <b-row>
                <b-col md="12">
                <!-- table -->
                <b-table
                    ref="tsdbTable"
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
                    :items="tsdbs"
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

            <!-- details -->
            <b-row>
                <b-col md="12" class="p-3 shadow">
                <b-tabs pills card v-model="tabIndex">

                <b-tab title="Single File" active>
                    <b-row>
                    <b-col md="12">
                        <b-form-group label="Enabled" label-for="smf-task-tsdb-single-active">
                            <b-form-checkbox switch v-model="single.active"  name="smf-task-tsdb-single-active">
                                {{ single.active ? "Active" : "Inactive" }}
                            </b-form-checkbox>
                        </b-form-group>
                    </b-col>
                    </b-row>
                </b-tab>

                <b-tab title="Multiple Files">
                    <b-row>
                    <b-col md="12">
                        <b-form-group label="Enabled" label-for="smf-task-tsdb-multiple-active">
                            <b-form-checkbox switch v-model="multiple.active"  name="smf-task-tsdb-multiple-active">
                                {{ multiple.active ? "Active" : "Inactive" }}
                            </b-form-checkbox>
                        </b-form-group>
                    </b-col>
                    </b-row>
                </b-tab>

                <b-tab title="Database">
                    <b-row>
                    <b-col md="12">
                        <b-form-group label="Enabled" label-for="smf-task-tsdb-db-active">
                            <b-form-checkbox switch v-model="db.active"  name="smf-task-tsdb-db-active">
                                {{ db.active ? "Active" : "Inactive" }}
                            </b-form-checkbox>
                        </b-form-group>
                    </b-col>
                    </b-row>
                </b-tab>

                <b-tab title="Line Protocol">
                    <b-row>
                    <b-col md="12">
                        <b-form-group label="Enabled" label-for="smf-task-tsdb-lineprotocol-active">
                            <b-form-checkbox switch v-model="lineProtocol.active"  name="smf-task-tsdb-lineprotocol-active">
                                {{ lineProtocol.active ? "Active" : "Inactive" }}
                            </b-form-checkbox>
                        </b-form-group>
                    </b-col>
                    </b-row>
                </b-tab>

                <b-tab title="Influxdb">
                    <b-row>
                    <b-col md="12">
                        <b-form-group label="Enabled" label-for="smf-task-tsdb-influxdb-active">
                            <b-form-checkbox switch v-model="influxdb.active"  name="smf-task-tsdb-influxdb-active">
                                {{ influxdb.active ? "Active" : "Inactive" }}
                            </b-form-checkbox>
                        </b-form-group>
                    </b-col>
                    </b-row>
                </b-tab>

                <b-tab title="Monitor">
                <b-row>
                <b-col md="12">
                <!-- table -->
                <b-table
                    ref="monitorTable"
                    bordered
                    striped
                    small
                    hover
                    show-empty
                    stacked="md"
                    selectable
                    select-mode="single"
                    selectedVariant="info"
                    @row-selected="ruleSelected"
                    :fields="monitor.fields"
                    :items="monitor.rules"
                    :busy="monitor.isBusy"
                    :sort-by.sync="monitor.sortBy"
                    :sort-desc.sync="monitor.sortDesc"
                    :sort-direction="monitor.sortDirection"
                    class="shadow"
                    >

                    <!-- caption slot -->
                    <!-- <template slot="table-caption">{{ tableCaption }}</template> -->

                    <!-- A virtual column -->
                    <template v-slot:cell(index)="data">{{ data.index + 1 }}</template>

                    <!-- row.item row.index -->
                    <template v-slot:cell(apply)="row">
                      <!-- <b-button size="sm"> -->
                      {{calculateTotalHours(row.item.apply)}} h
                      <!-- </b-button> -->
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
                        <b-row>
                        <b-col md="6">
                            <b-form-group label="Select a Rule" label-for="smf-task-tsdb-rule">
                                <b-form-select v-model="monitor.form.rule" class="mb-3">
                                    <option value="sessionCount">Session Count</option>
                                    <option value="demo">Demo Rule</option>
                                </b-form-select>
                            </b-form-group>
                        </b-col>

                        <b-col md="6">
                            <b-form-group label="Threshold" label-for="smf-task-tsdb-limit">
                            <b-input-group>
                                <b-form-input
                                id="smf-task-tsdb-limit"
                                type="number"
                                v-model.number="monitor.form.limit"
                                min="0"
                                max="6000"
                                step="10"
                                placeholder="<Threshold>" />
                                <b-input-group-append>
                                    <b-button variant="info" v-on:click.stop="monitor.form.limit = 100">Default</b-button>
                                </b-input-group-append>
                            </b-input-group>
                            </b-form-group>
                        </b-col>
                        </b-row>

                        <b-row>
                        <b-col md="10">
                            <b-form-group label="Apply the rule in the following hours" label-for="smf-task-tsdb-apply">
                            <b-form-checkbox-group id="smf-task-tsdb-apply" name="smf-task-tsdb-apply" buttons v-model="monitor.form.apply">
                            <b-form-checkbox value="0">0h</b-form-checkbox>
                            <b-form-checkbox value="1">1h</b-form-checkbox>
                            <b-form-checkbox value="2">2h</b-form-checkbox>
                            <b-form-checkbox value="3">3h</b-form-checkbox>
                            <b-form-checkbox value="4">4h</b-form-checkbox>
                            <b-form-checkbox value="5">5h</b-form-checkbox>
                            <b-form-checkbox value="6">6h</b-form-checkbox>
                            <b-form-checkbox value="7">7h</b-form-checkbox>
                            <b-form-checkbox value="8">8h</b-form-checkbox>
                            <b-form-checkbox value="9">9h</b-form-checkbox>
                            <b-form-checkbox value="10">10h</b-form-checkbox>
                            <b-form-checkbox value="11">11h</b-form-checkbox>
                            <b-form-checkbox value="12">12h</b-form-checkbox>

                            <b-form-checkbox value="13">13h</b-form-checkbox>
                            <b-form-checkbox value="14">14h</b-form-checkbox>
                            <b-form-checkbox value="15">15h</b-form-checkbox>
                            <b-form-checkbox value="16">16h</b-form-checkbox>
                            <b-form-checkbox value="17">17h</b-form-checkbox>
                            <b-form-checkbox value="18">18h</b-form-checkbox>
                            <b-form-checkbox value="19">19h</b-form-checkbox>
                            <b-form-checkbox value="20">20h</b-form-checkbox>
                            <b-form-checkbox value="21">21h</b-form-checkbox>
                            <b-form-checkbox value="22">22h</b-form-checkbox>
                            <b-form-checkbox value="23">23h</b-form-checkbox>

                            </b-form-checkbox-group>
                            </b-form-group>
                        </b-col>
                        <b-col md="2">
                            <b-form-group label="Total Hours" label-for="smf-task-tsdb-apply">
                                <b-form-input
                                id="smf-task-tsdb-apply"
                                type="number"
                                readonly
                                v-model.number="monitor.form.totalHours"/>
                            </b-form-group>
                        </b-col>
                        </b-row>

                    </b-col>
                    </b-row>

                    <b-row>
                    <b-col md="12">
                        <b-button type="submit" variant="primary" size="lg" v-on:click.stop="onRuleUpdate">Submit</b-button>
                    </b-col>
                    </b-row>

                </b-tab>

                </b-tabs>
                </b-col>
            </b-row>

        </b-container>
    </section>

</template>

<script lang="js">

import {webSocket} from '../mixins/web-socket'
import {hasPrivilegesWaitForUser} from "../mixins/privileges";
import store from "../store";
import {MODULES, NO_ACCESS_ROUTE, PRIVILEGES} from "../store/modules/user";

export default  {
    name: 'smfTaskTSDB',
    props: [],
    mixins: [webSocket],

    mounted() {
        this.ws_open("/smf/api/tsdb/v0.8");
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
                key: 'version',
                label: 'Version',
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
            },
            {
                key: 'ping',
                label: 'Ping',
                sortable: true
            }
            ],
            tsdbs: [],
            selected: [],
            sortBy: 'ep',
            sortDesc: false,
            sortDirection: 'desc',

            //  panel
            tabIndex: 1,

            single: {
                active: false
            },

            multiple: {
                active: false
            },

            db: {
                active: false
            },

            lineProtocol: {
                active: false
            },

            influxdb: {
                active: false
            },

            monitor: {
                fields: [
                {
                    key: 'index',
                    class: 'text-right small text-muted'
                },
                {
                    key: 'name',
                    label: 'Name',
                    formatter: (value, key, item) => {
                        if (value == 'sessionCount')  return 'Session Count';
                        else if (value == 'demo')  return 'Demo Rule';
                        return value;
                    },
                    sortable: true
                },
                {
                    key: 'buildin',
                    label: 'Built-in',
                    sortable: true
                },
                {
                    key: 'apply',
                    label: 'Total hours',
                    sortable: true
                },
                {
                    key: 'limit',
                    label: 'Limit',
                    sortable: true
                },
                ],
                rules: [
                    {name: 'sessionCount', buildin: true, apply: 222, limit: 300 },
                    {name: 'sessionCount', buildin: true, apply: 1024, limit: 100 },
                    {name: 'demo', buildin: true, apply: 88, limit: 2000 },
                ],
                selected: [],
                sortBy: 'name',
                sortDesc: false,
                sortDirection: 'desc',
                form: {
                    rule: 'sessionCount',
                    limit: 0,
                    apply: [],
                    value: 0,
                    totalHours: 0
                }
            }
        };
    },
    methods: {
        rowSelected(items) {
            this.selected = items;
            if (items.length > 0) {
                console.log('selected ' + items[0].key);
                // console.log(items.length + ' rows selected ');
                this.ws_submit_command("com:task", "req.config", items[0].key, ["tsdb"], ["single", "multiple", "db", "lineProtocol", "influxdb", "monitor"]);
            }
        },
        ws_on_open() {
            //  clear table
            this.tsdbs = [];
            // this.ws_subscribe("task.tsdb");
            this.ws_subscribe("status.cluster");
        },
        ws_on_data(obj) {
            if (obj.cmd != null) {
                console.log(this.$options.name + ' websocket received ' + obj.cmd + ' / ' + obj.channel);
                if (obj.cmd == 'insert') {
                    if (obj.channel == 'status.cluster') {
                        if (obj.rec.data.class == 'tsdb') {
                            var rec = { key: obj.rec.key.tag,
                                version: obj.rec.data.version,
                                ping: obj.rec.data.ping,
                                ep: obj.rec.data.ep,
                                pid: obj.rec.data.pid };
                            this.tsdbs.push(rec);
                        }
                    }
                }
                else if (obj.cmd == 'modify') {
                    this.tsdbs.find(function(rec) {
                        if(rec.key == obj.key) {
                            if (obj.value.ping != null) {
                                rec.ping = obj.value.ping;
                            }
                        }
                    });
                }
                else if (obj.cmd == 'delete') {
                    var idx = this.tsdbs.findIndex(rec => rec.key == obj.key);
                    this.tsdbs.splice(idx, 1);
                }
                else if (obj.cmd == 'clear') {
                    this.tsdbs = [];
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
        ruleSelected(items) {
            this.monitor.selected = items;
            if (items.length > 0) {
                console.log('selected rule ' + items[0].name);
                this.monitor.form.rule = items[0].name;
                this.monitor.form.limit = items[0].limit;
                this.monitor.form.apply = [];
                //  convert integer into string array
                var idx;
                for (idx = 1; idx < 25; idx++) {
                    var n = Math.pow(2, idx);
                    if ((items[0].apply & n) == n)  this.monitor.form.apply.push(idx.toString());
                }
            }
        },
        onRuleUpdate(event) {
            event.preventDefault();
        },
        calculateTotalHours(val) {
            var idx;
            var total = 0;
            for (idx = 1; idx < 25; idx++) {
                var n = Math.pow(2, idx);
                if ((val & n) == n)  total++;
            }
            return total;
        }
    },
    computed: {

    },
    watch: {
        'monitor.form.apply' : function() {
            // alert(this.monitor.form.apply);
            var val = 0;
            this.monitor.form.apply.forEach(function(item){
                var idx = parseInt(item, 10);
                var n = Math.pow(2, idx);
                val |= n;
            });
            if (this.monitor.selected.length > 0) {
                this.monitor.form.value = val;
                this.monitor.form.totalHours = this.calculateTotalHours(val);
            }
            // alert(val);
        }
    },
    beforeRouteEnter(to, from, next) {
        hasPrivilegesWaitForUser(store, MODULES.TASK_TSDB, PRIVILEGES.VIEW).then((result) => {
            next( result ? true: NO_ACCESS_ROUTE);
        });
    }
}
</script>

<style scoped lang="css">
</style>
