<template lang="html">

    <section class="smf-config-meter">

        <template>
            <div>
                <vue-headful title="smf :: config meters"
                             description="SMF dashboard"
                             keywords="SMF, solosTec" />
            </div>
        </template>

        <b-jumbotron fluid :header="$t('header-meter')" :lead="$t('lead-meter', {count: this.meters.length})" />

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
                    <b-pagination v-model="currentPage" :total-rows="visibleRows" :per-page="perPage" class="justify-content-end" />
                    <!--<b-pagination v-model="currentPage" :total-rows="meters.length" :per-page="perPage" class="justify-content-end" />-->
                </b-col>
            </b-row>
            <b-row>
                <b-col md="12">
                    <!-- table -->
                    <b-table ref="meterTable"
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
                             :items="meters"
                             :busy="isBusy"
                             :current-page="currentPage"
                             :per-page="perPage"
                             :filter="filter"
                             @filtered="onFiltered"
                             primary-key="pk"
                             :sort-by.sync="sortBy"
                             :sort-desc.sync="sortDesc"
                             :sort-direction="sortDirection"
                             class="shadow">

                        <!-- caption slot -->
                        <template slot="table-caption">
                            {{ tableCaption }}
                        </template>

                        <!-- A virtual column -->
                        <template slot="index" slot-scope="data">
                            {{ data.index + 1 + (perPage * (currentPage - 1)) }}
                        </template>

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
                        <b-tab title="Configuration" active>
                            <b-form v-on:submit.prevent>
                                <b-row>
                                    <b-col md="3">
                                        <b-form-group label="Ident" label-for="smf-form-meter-ident">
                                            <b-form-input id="smf-form-meter-ident"
                                                          type="text"
                                                          v-model="form.ident"
                                                          required
                                                          placeholder="<Ident>"
                                                          maxlength="22" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Meter" label-for="smf-form-meter-meter">
                                            <b-form-input id="smf-form-meter-meter"
                                                          type="text"
                                                          v-model="form.meter"
                                                          readonly
                                                          placeholder="<Meter>" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Metering Code" label-for="smf-form-meter-code">
                                            <b-form-input id="smf-form-meter-code"
                                                          type="text"
                                                          v-model="form.code"
                                                          placeholder="<Metering Code>"
                                                          pattern="[a-zA-Z0-9]{33}" required
                                                          maxlength="33" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Manufacturer" label-for="smf-form-meter-maker">
                                            <b-form-input id="smf-form-meter-maker"
                                                          type="text"
                                                          v-model="form.maker"
                                                          placeholder="<Manufacturer>" />
                                        </b-form-group>
                                    </b-col>
                                </b-row>

                                <b-row>
                                    <b-col md="3">
                                        <b-form-group label="Firmware" label-for="smf-form-meter-fw">
                                            <b-form-input id="smf-form-meter-fw"
                                                          type="text"
                                                          v-model="form.fw"
                                                          placeholder="<Firmware>" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Parameterization" label-for="smf-form-meter-param">
                                            <b-form-input id="smf-form-meter-param"
                                                          type="text"
                                                          v-model="form.vParam"
                                                          placeholder="<Parameterization>" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Factory Number" label-for="smf-form-meter-factory-nr">
                                            <b-form-input id="smf-form-meter-factory-nr"
                                                          type="text"
                                                          v-model="form.factoryNr"
                                                          placeholder="<Factory Number>" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Item" label-for="smf-form-meter-item">
                                            <b-form-input id="smf-form-meter-item"
                                                          type="text"
                                                          v-model="form.item"
                                                          placeholder="<Item>" />
                                        </b-form-group>
                                    </b-col>
                                </b-row>

                                <b-row>
                                    <b-col md="3">
                                        <b-form-group label="Metrological Class" label-for="smf-form-meter-class">
                                            <b-form-input id="smf-form-meter-class"
                                                          type="text"
                                                          v-model="form.mClass"
                                                          placeholder="<Metrological Class>" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Time of Manufactoring (TOM)" label-for="smf-form-meter-tom">
                                            <b-form-input id="smf-form-meter-tom"
                                                          type="date"
                                                          v-model="form.tom"
                                                          placeholder="<Time of Manufactoring>" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Update meter configuration" label-for="smf-form-meter-update">
                                            <b-button type="submit" id="smf-form-meter-update" variant="info" v-on:click.stop="onMeterUpdate">{{btnUpdateTitle}}</b-button>
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Delete meter configuration" label-for="smf-form-meter-delete">
                                            <b-button type="submit" id="smf-form-meter-delete" variant="danger" v-on:click.stop="onMeterDelete">{{btnDeleteTitle}}</b-button>
                                        </b-form-group>
                                    </b-col>
                                </b-row>

                            </b-form>
                        </b-tab>

                        <b-tab>
                            <template slot="title">
                                Gateway
                                <b-spinner v-if="spinner.readout" type="grow" small />
                            </template>

                            <b-form v-on:submit.prevent>
                                <b-row>
                                    <b-col md="6">
                                        <b-form-group label="Ident" label-for="smf-form-meter-ident-a">
                                            <b-form-input id="smf-form-meter-ident-a"
                                                          type="text"
                                                          v-model="form.ident"
                                                          readonly
                                                          placeholder="<Ident>"
                                                          maxlength="22" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="6">
                                        <b-form-group label="Gateway" label-for="smf-form-meter-gw">
                                            <b-form-input id="smf-form-meter-gw"
                                                          type="text"
                                                          v-model="form.serverId"
                                                          readonly
                                                          placeholder="<Ident>" />
                                        </b-form-group>
                                    </b-col>
                                </b-row>

                                <b-row>
                                    <b-col md="6">
                                        <!-- table -->
                                        <b-table ref="readoutTable"
                                                 bordered
                                                 striped
                                                 small
                                                 hover
                                                 show-empty
                                                 stacked="md"
                                                 selectable
                                                 select-mode="single"
                                                 selectedVariant="info"
                                                 @row-selected="rowSelected"
                                                 :fields="readout.fields"
                                                 :items="readout.values"
                                                 :busy="isBusy"
                                                 :current-page="readout.currentPage"
                                                 :per-page="readout.perPage"
                                                 primary-key="obis"
                                                 :sort-by.sync="readout.sortBy"
                                                 :sort-desc.sync="readout.sortDesc"
                                                 :sort-direction="readout.sortDirection"
                                                 class="shadow" />
                                    </b-col>
                                    <b-col md="6">
                                        <b-form-group label="Query last record">
                                            <b-button type="submit" variant="success" v-on:click.stop="onMeterQuery">{{btnQueryTitle}}</b-button>
                                        </b-form-group>
                                    </b-col>
                                </b-row>

                            </b-form>
                        </b-tab>

                        <b-tab no-body>
                            <template slot="title">
                                Meter
                                <b-spinner v-if="spinner.meter" type="grow" small />
                            </template>

                            <b-form v-on:submit.prevent class="p-3 shadow">
                                <b-row>
                                    <b-col md="9">
                                        <b-form-group label="Public Key" label-for="smf-form-meter-pubkey">
                                            <b-form-input id="smf-form-meter-pubkey"
                                                          type="text"
                                                          v-model="tabMeter.data.pubKey"
                                                          placeholder="<Public Key>" />
                                        </b-form-group>
                                        <b-form-group label="AES Key" label-for="smf-form-meter-aeskey">
                                            <b-form-input id="smf-form-meter-aeskey"
                                                          type="text"
                                                          v-model="tabMeter.data.aesKey"
                                                          :state="aesKeyValidation"
                                                          placeholder="<AES Key (128 Bit)>"
                                                          maxlength="32" />

                                            <b-form-invalid-feedback :state="aesKeyValidation">
                                                An AES key must be 32 characters long hexadecimal string.
                                            </b-form-invalid-feedback>
                                            <b-form-valid-feedback :state="aesKeyValidation">
                                                OK
                                            </b-form-valid-feedback>

                                        </b-form-group>
                                        <b-form-group label="User Name" label-for="smf-form-meter-user">
                                            <b-form-input id="smf-form-meter-user"
                                                          type="text"
                                                          v-model="tabMeter.data.user"
                                                          placeholder="<User Name>" />
                                        </b-form-group>
                                        <b-form-group label="Password" label-for="smf-form-meter-last-pwd">
                                            <b-input-group>
                                                <b-form-input id="smf-form-meter-last-pwd"
                                                              type="text"
                                                              v-model="tabMeter.data.pwd"
                                                              placeholder="<Password>" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="generatePassword" v-b-tooltip.hover title="Generate password">&#x21ba;</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group>
                                            <b-button type="submit" variant="success" :disabled="!isOnline" v-on:click.stop="onParameterRefresh">{{btnRefreshTitle}}</b-button>
                                        </b-form-group>
                                        <b-form-group>
                                            <b-button type="submit" variant="info" :disabled="!isOnline" v-on:click.stop="onParameterUpdate">{{btnUpdateTitle}}</b-button>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                            </b-form>

                            <b-form v-on:submit.prevent class="p-3">
                                <b-row>
                                    <b-col md="3">
                                        <b-form-group label="Device Class" label-for="smf-form-meter-class">
                                            <b-form-input id="smf-form-meter-class"
                                                          type="text"
                                                          v-model="tabMeter.data.devClass"
                                                          readonly
                                                          placeholder="<Device Class>" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Manufacturer" label-for="smf-form-meter-maker">
                                            <b-form-input id="smf-form-meter-maker"
                                                          type="text"
                                                          v-model="tabMeter.data.maker"
                                                          readonly
                                                          placeholder="<Manufacturer>" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Status" label-for="smf-form-meter-status">
                                            <b-form-input id="smf-form-meter-status"
                                                          type="number"
                                                          v-model="tabMeter.data.status"
                                                          readonly
                                                          placeholder="<Status Information>" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Bitmask" label-for="smf-form-meter-bitmask">
                                            <b-form-input id="smf-form-meter-bitmask"
                                                          type="text"
                                                          v-model="tabMeter.data.bitmask"
                                                          readonly
                                                          placeholder="<Bitmask>" />
                                        </b-form-group>
                                    </b-col>
                                </b-row>

                                <b-row>
                                    <b-col md="3">
                                        <b-form-group label="Interval (millisec.)" label-for="smf-form-meter-interval">
                                            <b-form-input id="smf-form-meter-interval"
                                                          type="number"
                                                          v-model="tabMeter.data.interval"
                                                          readonly
                                                          placeholder="<Time between two data sets>" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Last Record" label-for="smf-form-meter-last-record">
                                            <b-form-input id="smf-form-meter-last-record"
                                                          type="datetime"
                                                          v-model="tabMeter.data.lastRecord"
                                                          readonly
                                                          placeholder="<Last Record>" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="6">
                                    </b-col>
                                </b-row>
                            </b-form>

                        </b-tab>

                        <b-tab no-body>
                            <template slot="title">
                                Push Operations
                                <b-spinner v-if="spinner.push" type="grow" small />
                            </template>
                            <b-form v-on:submit.prevent class="p-3">
                                <b-row>
                                    <b-col md="6">
                                        <pushTargets ref="pushTargets" :items="tabPush.data.items" />
                                    </b-col>
                                    <b-col md="6">
                                        <b-form-group label="Refresh data">
                                            <b-button type="submit" variant="success" :disabled="!isOnline" v-on:click.stop="onPushTargetQuery">Query</b-button>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                            </b-form>
                        </b-tab>

                        <b-tab no-body>
                            <template slot="title">
                                Data Mirror
                                <b-spinner v-if="spinner.mirror" type="grow" small />
                            </template>
                            <b-form v-on:submit.prevent class="p-3">
                                <b-row>
                                    <b-col md="6">
                                        <dataMirror ref="dataMirror" :items="tabDataMirror.data.items" />
                                    </b-col>
                                    <b-col md="6">
                                        <b-form-group label="Refresh data">
                                            <b-button type="submit" variant="success" :disabled="!isOnline" v-on:click.stop="onDataMirrorQuery">Query</b-button>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                            </b-form>
                        </b-tab>

                    </b-tabs>
                </b-col>
            </b-row>

            <!-- Modal Component -->
            <b-modal ref="dlgDeleteMeter"
                     :title=btnDeleteTitle
                     @ok="handleDeleteMeterOk"
                     header-bg-variant="danger"
                     centered>
                <p>Proceed?</p>
            </b-modal>

        </b-container>

    </section>

</template>

<script lang="js">

    import { webSocket } from '../../services/web-socket.js';
    import dataMirror from '@/components/smf-table-data-mirror.vue'
    import pushTargets from '@/components/smf-table-push-targets.vue'

    export default {
        name: 'smfConfigMeter',
        props: [],
        mixins: [webSocket],
        components: {
            dataMirror, pushTargets
        },

        mounted() {
            this.ws_open("/smf/api/meter/v0.7");
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
                    //    pk (uuid)
                    {
                        key: 'ident',
                        label: 'Ident',
                        sortable: true
                    },
                    {
                        key: 'meter',
                        label: 'Meter',
                        sortable: true
                    },
                    {
                        key: 'code',
                        label: 'Code',
                        sortable: true
                    },
                    {
                        key: 'maker',
                        label: 'Maker',
                        sortable: true
                    },
                    {
                        key: 'tom',
                        label: 'TOM',
                        sortable: true,
                        formatter: (value, key, item) => {
                            return value.toUTCString();
                        }
                    },
                    //   {
                    //     key: 'fw',
                    //     label: 'Firmware',
                    //     sortable: true
                    //   },
                    //   {
                    //     key: 'item',
                    //     label: 'Item',
                    //     sortable: true
                    //   },
                    //   {
                    //     key: 'mClass',
                    //     label: 'Class',
                    //     sortable: true
                    //   },
                    {
                        key: 'serverId',
                        label: 'Server ID',
                        sortable: true
                    },
                    //   {
                    //     key: 'gwKey',
                    //     label: 'GW',
                    //     sortable: true
                    //   },
                    {
                        key: 'online',
                        label: 'Online',
                        sortable: true,
                        formatter: (value, key, item) => {
                            if (value == 0) return '║';
                            else if (value == 1) return '⊶';
                            return '⇆';
                        },
                        class: 'text-center'
                    },
                ],
                meters: [],
                selected: [],
                sortBy: 'name',
                sortDesc: false,
                sortDirection: 'desc',
                filter: null,
                visibleRows: 0,
                //  panel
                tabIndex: 1,
                form: {
                    pk: '',
                    ident: '',
                    meter: '',
                    code: '',
                    maker: '',
                    tom: "1970-01-01",
                    fw: '',
                    vParam: '',
                    factoryNr: '0000',
                    item: '',
                    mClass: '---',
                    serverId: '',
                    gwKey: ''
                },
                readout: {
                    values: [],
                    selected: [],
                    fields: [
                        {
                            key: 'obis',
                            label: 'OBIS',
                            sortable: true
                        },
                        {
                            key: 'value',
                            label: 'Value',
                            sortable: true
                        },
                        {
                            key: 'unit',
                            label: 'Unit',
                            sortable: true,
                            formatter: (value, key, item) => {
                                switch (value) {
                                    case 9: return "°C";
                                    case 13: return "m³";
                                    case 19: return "L";
                                    case 27: return "W";
                                    case 30: return "Wh";
                                    case 38: return "Ω";
                                    default:
                                        break;
                                }
                                return value;
                            }
                        },
                        {
                            key: 'time',
                            label: 'Time',
                            sortable: true
                        },
                        {
                            key: 'server',
                            label: 'Server',
                            sortable: true
                        },
                    ],
                    sortBy: 'obis',
                    sortDesc: false,
                    sortDirection: 'desc',
                    currentPage: 1,
                    perPage: 20
                },
                tabMeter: {
                    data: {
                        devClass: '-',
                        maker: '-',
                        status: 0,
                        bitmask: '00 00',
                        interval: 0,
                        lastRecord: "1964-04-20",
                        pubKey: '',
                        aesKey: '',
                        user: '',
                        pwd: '',
                        timeRef: 0
                    }
                },
                tabPush: {
                    data: {
                        items: [{nr:1, interval: 15, delay: 101, OBIS:'8181c78611ff', name:'water@solosTec'}]
                    }
                },
                tabDataMirror: {
                    data: {
                        items: []
                        //items: [{nr:1, active: true, entries: 101, period: 3, OBIS:'8181c78614ff', name:'name'}]
                    }
                },
                //  loading state of SML data
                spinner: {
                    readout: false,
                    meter: false,
                    push: false,
                    mirror: false
                },
            }
        },

        beforeDestroy() {
            this.ws_close();
        },

        methods: {
            ws_on_open() {
                //  clear table
                this.meters = [];
                this.ws_subscribe("config.meter");
            },
            ws_on_data(obj) {
                if (obj.cmd != null) {
                    console.log('websocket received ' + obj.cmd);
                    if (obj.cmd == 'insert') {
                        var tom = new Date(obj.rec.data.tom.substring(0, 19));
                        var rec = {
                            pk: obj.rec.key.pk,
                            ident: obj.rec.data.ident,
                            meter: obj.rec.data.meter,
                            code: obj.rec.data.code,
                            maker: obj.rec.data.maker,
                            tom: tom,
                            fw: obj.rec.data.vFirmware,
                            vParam: obj.rec.data.vParam,
                            factoryNr: obj.rec.data.factoryNr,
                            item: obj.rec.data.item,
                            mClass: obj.rec.data.mClass,
                            serverId: obj.rec.data.serverId,
                            gwKey: obj.rec.data.gw,
                            online: obj.rec.data.online
                        };

                        if (obj.rec.data.online == 1) {
                            rec["_rowVariant"] = 'success';
                        }
                        else if (obj.rec.data.online == 2) {
                            rec["_rowVariant"] = 'warning';
                        }
                        //  insert into table
                        this.meters.push(rec);
                    }
                    else if (obj.cmd == 'modify') {
                        console.log('lookup meter ' + obj.key);
                        self = this;
                        this.meters.find(function (rec) {
                            if (rec.pk == obj.key[0]) {
                                console.log('modify meter ' + rec.ident);
                                if (obj.value.ident != null) {
                                    rec.ident = obj.value.ident;
                                    if (self.form.pk == obj.key[0]) self.form.ident = obj.value.ident;
                                }
                                else if (obj.value.meter != null) {
                                    rec.meter = obj.value.meter;
                                    if (self.form.pk == obj.key[0]) self.form.meter = obj.value.meter;
                                }
                                else if (obj.value.code != null) {
                                    rec.code = obj.value.code;
                                    if (self.form.pk == obj.key[0]) self.form.code = obj.value.code;
                                }
                                else if (obj.value.maker != null) {
                                    rec.maker = obj.value.maker;
                                    if (self.form.pk == obj.key[0]) self.form.maker = obj.value.maker;
                                }
                                else if (obj.value.tom != null) {
                                    rec.tom = new Date(obj.value.tom.substring(0, 19));
                                }
                                else if (obj.value.vFirmware != null) {
                                    rec.fw = obj.value.vFirmware;
                                    if (self.form.pk == obj.key[0]) self.form.fw = obj.value.vFirmware;
                                }
                                else if (obj.value.vParam != null) {
                                    rec.vParam = obj.value.vParam;
                                    if (self.form.pk == obj.key[0]) self.form.vParam = obj.value.vParam;
                                }
                                else if (obj.value.factoryNr != null) {
                                    rec.factoryNr = obj.value.factoryNr;
                                    if (self.form.pk == obj.key[0]) self.form.factoryNr = obj.value.factoryNr;
                                }
                                else if (obj.value.item != null) {
                                    rec.item = obj.value.item;
                                    if (self.form.pk == obj.key[0]) self.form.item = obj.value.item;
                                }
                                else if (obj.value.mClass != null) {
                                    rec.mClass = obj.value.mClass;
                                    if (self.form.pk == obj.key[0]) self.form.mClass = obj.value.mClass;
                                }
                                else if (obj.value.serverId != null) {
                                    rec.serverId = obj.value.serverId;
                                }
                                else if (obj.value.gw != null) {
                                    rec.gwKey = obj.value.gw;
                                }
                                else if (obj.value.online != null) {
                                    rec.online = obj.value.online;
                                }
                            }
                        });
                    }
                    else if (obj.cmd == 'clear') {
                        //  clear table
                        this.meters = [];
                    }
                    else if (obj.cmd == 'delete') {
                        // console.log('lookup meter ' + obj.key);
                        var idx = this.meters.findIndex(rec => rec.pk == obj.key);
                        // console.log('delete index ' + idx);
                        this.meters.splice(idx, 1);
                    }
                    else if (obj.cmd == 'load') {
                        //  load status
                        if (obj.show != null) {
                            //   console.log('load state ' + obj.show);
                            this.isBusy = obj.show;
                        }
                        else if (obj.level != 0) {
                            this.busyLevel = obj.level;
                        }
                    }
                    else if (obj.cmd == 'update') {
                        console.log('update channel ' + obj.channel);
                        if (obj.channel == 'attention.code') {
                            //   toasts/alerts
                            if (obj.section == '8181c7c7fd00') {
                                //  OK
                                this.$toasted.global.sml_attention_ok(obj.rec.srv + " modification accepted", "info");
                            }
                            else {
                                //  error
                                // this.meters.showAttentionFailure = true;
                                this.$toasted.global.sml_attention_error(obj.rec.srv + ": " + obj.rec.values);
                            }
                            this.spinner.readout = false;
                            this.spinner.meter = false;
                            this.spinner.push = false;
                            this.spinner.mirror = false;
                        }
                        else if (obj.channel == 'get.list.request') {
                            // clear table
                            this.readout.values = [];
                            this.$toasted.global.sml_attention_ok(obj.rec.srv + " sent " + Object.keys(obj.rec.values).length + " values", "info");
                            Object.keys(obj.rec.values).forEach(key => {
                                // console.log('item ' + key);
                                // console.log('value ' + obj.rec.values[key].value);
                                var rec = {
                                    obis: key,
                                    value: obj.rec.values[key].value,
                                    unit: obj.rec.values[key].unit,
                                    time: obj.rec.values[key].valTime,
                                    server: obj.rec.srv
                                };
                                this.readout.values.push(rec);
                            });
                            //  hide spinner
                            this.spinner.readout = false;
                        }
                        else if (obj.channel == 'get.proc.param') {
                            if (obj.section == 'root-sensor-prop') {
                                this.spinner.meter = false;
                                // aesKey: null
                                // bitMask: "3030"
                                // class: "02"
                                // interval: 1234
                                // lastRecord: "2019-04-12 15:39:03.00000000"
                                // maker: "736f6c6f73546563"
                                // pubKey: "18011605e61e0d02bf0cfa357d9e7703"
                                // pwd: "707764"
                                // statusWord: 0
                                // user: "75736572"
                                this.tabMeter.data.devClass = obj.rec.values.devClass;
                                this.tabMeter.data.maker = obj.rec.values.maker;
                                this.tabMeter.data.status = obj.rec.values.status;
                                this.tabMeter.data.bitmask = obj.rec.values.bitMask;
                                this.tabMeter.data.interval = obj.rec.values.interval;
                                if (obj.rec.values.lastRecord != null) {
                                    // var tp = obj.rec.values.lastRecord.subString(0, 19);
                                    this.tabMeter.data.lastRecord = obj.rec.values.lastRecord.substring(0, 19);
                                }
                                else {
                                    this.tabMeter.data.lastRecord = null;
                                }
                                this.tabMeter.data.pubKey = obj.rec.values.pubKey;
                                this.tabMeter.data.aesKey = obj.rec.values.aesKey;
                                this.tabMeter.data.user = obj.rec.values.user;
                                this.tabMeter.data.pwd = obj.rec.values.pwd;
                            }
                            else if (obj.section == 'root-data-prop') {
                                this.spinner.mirror = false;
                                //this.tabPush.data.items = [];
                                //section: "root-data-prop"
                                //  [f5c74f17-c09f-4d95-bfef-7710edce0b16,9f773865-e4af-489a-8824-8f78a2311278,7,[f72f7307-40e6-483b-8106-115290f8f1fe],609a7d15-e32d-44fa-ada8-37d7a0b24420,get.proc.param,01-e61e-29436587-bf-03,root-data-prop,
                                //  % (("OBIS": 8181C78611FF), ("active": true), ("idx": 4), ("period": 00000000), ("profile": profile - 15min), ("registers": [8181C78203FF, 0700030000FF, 0000616100FF, 0000600101FF, 0000600100FF, 0000616100FF]), ("size": 00000064))]
                                var rec = {
                                    nr: obj.rec.values.idx,
                                    active: obj.rec.values.active,
                                    entries: obj.rec.values.size,
                                    period: obj.rec.values.period,
                                    OBIS: obj.rec.values.OBIS,
                                    name: obj.rec.values.profile,
                                    registers: obj.rec.values.registers
                                };

                                //  insert into table
                                this.tabDataMirror.data.items.push(rec);

                            }
                            else if (obj.section == 'root-push-ops') {
                                this.spinner.push = false;
                                var rec = {
                                    nr: obj.rec.values.idx,
                                    interval: obj.rec.values.interval,
                                    delay: obj.rec.values.delay,
                                    name: obj.rec.values.target,
                                    OBIS: obj.rec.values.service,
                                    source: obj.rec.values.source
                                };

                                //  insert into table
                                this.tabPush.data.items.push(rec);

                            }
                        }
                    }
                    this.visibleRows = this.meters.length;
                }
            },

            rowSelected(items) {
                this.selected = items;
                if (items.length > 0) {
                    console.log(items.length + ' rows selected ');
                    //   console.log('selected ' + items[0].ident);
                    this.form.pk = items[0].pk;
                    this.form.ident = items[0].ident;
                    this.form.meter = items[0].meter;
                    this.form.code = items[0].code;
                    this.form.maker = items[0].maker;
                    this.form.tom = items[0].tom.toISOString().substring(0, 10);
                    this.form.fw = items[0].fw;
                    this.form.vParam = items[0].vParam;
                    this.form.factoryNr = items[0].factoryNr;
                    this.form.item = items[0].item;
                    this.form.mClass = items[0].mClass;
                    this.form.serverId = items[0].serverId;
                    this.form.gwKey = items[0].gwKey;
                }
            },
            onMeterUpdate(event) {
                event.preventDefault();
                console.log('onMeterUpdate: ' + this.form.ident);
                this.ws_submit_record("modify", "config.meter", {
                    key: [this.form.pk],
                    data: {
                        ident: this.form.ident,
                        code: this.form.code,
                        maker: this.form.maker,
                        vFirmware: this.form.fw,
                        vParam: this.form.vParam,
                        factoryNr: this.form.factoryNr,
                        item: this.form.item,
                        mClass: this.form.mClass
                    }
                });
            },
            onMeterDelete(event) {
                event.preventDefault();
                console.log('onMeterDelete: ' + this.selected.length + ' meters');
                this.$refs.dlgDeleteMeter.show();
            },
            onMeterQuery(event) {
                event.preventDefault();
                // console.log('onMeterQuery: ' + this.form.ident);
                this.spinner.readout = true;
                this.ws_submit_command("com:sml",
                    "get.list.request",
                    [this.form.gwKey],
                    [{ meterId: this.form.ident }],
                    ["current-data-record"]);
            },
            onParameterRefresh(event) {
                event.preventDefault();
                this.spinner.meter = true;
                this.ws_submit_command("com:sml",
                    "get.proc.param",
                    [this.form.gwKey],
                    [this.form.ident],
                    ["root-sensor-params"]);
            },
            onParameterUpdate(event) {
                event.preventDefault();
                this.spinner.meter = true;
                this.ws_submit_command("com:sml",
                    "set.proc.param",
                    [this.form.gwKey],
                    [
                        { meterId: this.form.ident },
                        { data: this.tabMeter.data }
                    ],
                    ["root-sensor-params"]);
            },
            onDataMirrorQuery(event) {
                event.preventDefault();
                //console.log('onDataMirrorQuery: ' + this.form.ident);
                this.spinner.mirror = true;
                this.tabDataMirror.data.items = [];
                //  81 81 C7 86 20 FF
                this.ws_submit_command("com:sml",
                    "get.proc.param",
                    [this.form.gwKey],
                    [this.form.ident],
                    ["root-data-prop"]);
            },
            onPushTargetQuery(event) {
                event.preventDefault();
                //console.log('onDataMirrorQuery: ' + this.form.ident);
                this.spinner.push = true;
                this.tabPush.data.items = [];
                //  81 81 C7 86 20 FF
                this.ws_submit_command("com:sml",
                    "get.proc.param",
                    [this.form.gwKey],
                    [this.form.ident],
                    ["root-push-ops"]);    
            },
            handleDeleteMeterOk(event) {
                event.preventDefault();
                this.selected.forEach(element => {
                    this.ws_submit_key("delete", "config.meter", { tag: [element.pk] });
                });
                this.$nextTick(() => {
                    // Wrapped in $nextTick to ensure DOM is rendered before closing
                    this.$refs.dlgDeleteMeter.hide();
                })
            },
            generatePassword(event) {
                event.preventDefault();
                let charSet = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!';
                this.tabMeter.data.pwd = "";
                // this.form[element] = '';
                for (let idx = 0; idx < 8; idx++) {
                    this.tabMeter.data.pwd += charSet.charAt(Math.floor(Math.random() * charSet.length));
                }
            },
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.visibleRows = filteredItems.length
                this.currentPage = 1
            }
        },

        computed: {
            tableCaption() {
                return this.selected.length + "/" + this.visibleRows + " item(s) selected";
            },
            btnUpdateTitle() {
                if (this.selected.length > 0) {
                    return "Update " + this.selected[0].ident;
                }
                return "Update";
            },
            btnRefreshTitle() {
                if (this.selected.length > 0) {
                    return "Refresh " + this.selected[0].ident;
                }
                return "Refresh";
            },
            btnDeleteTitle() {
                if (this.selected.length == 0) {
                    return "Delete";
                }
                else if (this.selected.length == 1) {
                    return "Delete " + this.selected[0].ident;
                }
                return "Delete " + this.selected.length + " record(s)";
            },
            btnQueryTitle() {
                if (this.selected.length > 0) {
                    return "Query " + this.selected[0].ident;
                }
                return "Query";
            },
            aesKeyValidation() {
                if (this.tabMeter.data.aesKey == null) return true;
                if (this.tabMeter.data.aesKey.length == 0) return true;
                var rex = /[0-9A-Fa-f]{32}/g;   //  test for hexadecimal string
                return rex.test(this.tabMeter.data.aesKey);
            },
            isOnline() {
                if (this.selected.length == 0) return false;

                var self = this;
                var rec = this.meters.find(function (rec) {
                    //console.log(rec.pk + ' ? ' + self.form.pk);
                    if (rec.pk == self.form.pk) return true;
                });
                //console.log(rec.pk + ' - ' + rec.ident + ' - ' + rec.online);
                //  online state == 1
                return (rec == null) ? true : (rec.online == 1);
            }
        }
    }
</script>

<style scoped lang="css">
</style>
