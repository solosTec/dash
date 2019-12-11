<template lang="html">
    <section class="smf-config-device">

        <template>
            <div>
                <vue-headful title="smf :: config devices"
                             description="SMF dashboard"
                             keywords="SMF, solosTec" />
            </div>
        </template>

        <b-jumbotron fluid :header="$t('header-device')" :lead="$t('lead-device', {count: this.devices.length})" />

        <b-container fluid>
            <b-row>
                <b-col md="9">

                    <b-row>
                        <b-col md="6">
                            <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
                                <b-input-group>
                                    <b-form-input v-model="filter" :placeholder="$t('config-gateway-02')" />
                                    <b-input-group-append>
                                        <b-button :disabled="!filter" @click="filter = ''">{{ $t('config-gateway-03') }}</b-button>
                                    </b-input-group-append>
                                </b-input-group>
                            </b-form-group>
                        </b-col>


                        <b-col md="6">
                            <b-form-row>
                                <smf-row-count-selector v-model="perPage" store-key="devices" class="col" />
                                <b-pagination v-model="currentPage" :total-rows="visibleRows" :per-page="perPage" class="justify-content-end" />
                            </b-form-row>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col md="12">
                            <!-- table -->
                            <b-table ref="devTable"
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
                                     :items="devices"
                                     :busy="isBusy"
                                     primary-key="pk"
                                     :sort-by.sync="sortBy"
                                     :sort-desc.sync="sortDesc"
                                     :sort-direction="sortDirection"
                                     :current-page="currentPage"
                                     :per-page="perPage"
                                     :filter="filter"
                                     @filtered="onFiltered"
                                     class="shadow">

                                <!-- A virtual column -->
                                <template v-slot:cell(index)="data">
                                    {{ data.index + 1 + (perPage * (currentPage - 1)) }}
                                </template>

                                <!-- A custom formatted column descr -->
                                <template v-slot:cell(descr)="data">
                                    <span v-b-popover.hover="data.value" :title="data.item.name">{{ formatDescription(data.value) }}</span>
                                </template>

                                <!-- caption slot -->
                                <template slot="table-caption">
                                    {{ tableCaption }}
                                </template>


                                <!-- loading slot -->
                                <div slot="table-busy" class="text-center text-danger">
                                    <strong>Loading... {{busyLevel}}%</strong>
                                </div>

                            </b-table>
                        </b-col>
                    </b-row>

                </b-col>

                <b-col md="3">

                    <!-- form -->
                    <b-form v-on:submit.prevent class="p-3 shadow">

                        <b-form-group :label="$t('config-device-01')" label-for="smf-form-dev-name">
                            <b-form-input id="smf-form-dev-name"
                                          type="text"
                                          v-model="form.name"
                                          required
                                          :placeholder="$t('config-device-01-01')" />
                        </b-form-group>

                        <b-form-group label="MSISDN" label-for="smf-form-dev-msisdn">
                            <b-form-input id="smf-form-dev-msisdn"
                                          type="text"
                                          v-model="form.msisdn"
                                          required
                                          placeholder="<MSISDN>" />
                        </b-form-group>

                        <b-form-group :label="$t('config-device-02')" label-for="smf-form-dev-pwd">
                            <b-input-group>
                                <b-form-input id="smf-form-dev-pwd"
                                              type="text"
                                              v-model="form.pwd"
                                              required
                                              :placeholder="$t('config-device-02-02')" />
                                <b-input-group-append>
                                    <b-button variant="info" v-on:click.stop="generatePassword" v-b-tooltip.hover title="Generate password">&#x21ba;</b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form-group>

                        <b-form-group :label="$t('config-device-03')" label-for="smf-form-dev-descr">
                            <b-form-input id="smf-form-dev-descr"
                                          type="text"
                                          v-model="form.descr"
                                          :placeholder="$t('config-device-03-03')" />
                        </b-form-group>

                        <b-form-group label="" label-for="smf-form-dev-enabled">
                            <b-form-checkbox switch v-model="form.enabled" :disabled="!isRecordSelected" name="smf-form-dev-enabled">
                                {{ form.enabled ? $t('config-device-04') : $t('config-device-05') }}
                            </b-form-checkbox>
                        </b-form-group>

                        <b-input-group class="pt-1">
                            <b-button type="submit" variant="primary" :disabled="!isRecordSelected" v-on:click.stop="onDeviceUpdate">{{btnUpdateTitle}}</b-button>&nbsp;
                        </b-input-group>

                        <b-input-group class="pt-3">
                            <b-button type="submit" variant="danger" :disabled="!isRecordSelected" v-on:click.stop="onDeviceDelete">{{btnDeleteTitle}}</b-button>
                        </b-input-group>

                        <hr />

                        <b-button type="submit" variant="success" :disabled="!isRecordNew" v-on:click.stop="onDeviceInsert">{{btnInsertTitle}}</b-button>
                    </b-form>
                </b-col>
            </b-row>
        </b-container>

        <!-- Modal Component -->
        <b-modal ref="dlgDeleteDevice"
                 :title=btnDeleteTitle
                 @ok="handleDeleteDeviceOk"
                 header-bg-variant="danger"
                 centered>
            <p>Proceed?</p>
        </b-modal>

    </section>
</template>

<script lang="js">

    import { webSocket } from '../mixins/web-socket';
    import store from './../store/index';
    import { hasPrivilegesWaitForUser } from "../mixins/privileges";
    import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "../store/modules/user";

    let tmpDevices = [];

    export default {
        name: 'smfConfigDevice',
        props: [],
        mixins: [webSocket],
        mounted() {
            this.ws_open("/smf/api/device/v0.7");
            console.log('devices view mounted')
        },
        data() {
            return {
                isBusy: true,
                busyLevel: 0,
                currentPage: 1,
                perPage: 15,
                fields: [
                    {
                        key: 'index',
                        class: 'text-right small text-muted'
                    },
                    {
                        key: 'name',
                        label: 'Name',
                        sortable: true
                    },
                    {
                        key: 'msisdn',
                        label: 'MSISDN',
                        sortable: true
                    },
                    {
                        key: 'pwd',
                        label: 'Password'
                    },
                    {
                        key: 'descr',
                        label: 'Description',
                        sortable: true
                    },
                    {
                        key: 'id',
                        label: 'Model',
                        sortable: true
                    },
                    {
                        key: 'vFirmware',
                        label: 'Firmware',
                        sortable: true
                    },
                    {
                        key: 'enabled',
                        label: 'Enabled',
                        sortable: true,
                        formatter: (value, key, item) => {
                            if (value) return '✔';
                            return '✖';
                        },
                        class: 'text-center'
                    },
                    {
                        key: 'age',
                        label: 'Created',
                        formatter: (value, key, item) => {
                            return value.toLocaleString()
                        },
                        sortable: true
                    }
                ],
                devices: [],
                // devices: [{ pk: "e92d32cf-5387-48ff-ad8b-29507a033075", age: new Date(), descr: "comment #4", enabled: true, id: "ID", msisdn: "1004", name: "device-4", pwd: "geheim", vFirmware: "v4" }],
                selected: [],
                sortBy: 'name',
                sortDesc: false,
                sortDirection: 'desc',
                filter: null,
                visibleRows: 0,
                form: {
                    name: '',
                    msisdn: '',
                    pwd: '',
                    descr: '',
                    enabled: true,
                    pk: ''
                }
            }
        },

        beforeDestroy() {
            this.ws_close();
        },

        methods: {

            ws_on_open() {
                //  clear table
                this.devices = [];
                this.ws_subscribe("config.device");
            },

            ws_on_data(obj) {
                if (obj.cmd != null) {
                    // eslint-disable-next-line
                    console.log(this.$options.name + ' websocket received ' + obj.cmd + ' / ' + obj.channel);
                    if (obj.cmd == 'update') {
                        // if (obj.channel != null) {
                        //     console.log('update channel ' + obj.channel);
                        //     if (obj.channel == 'table.session.count') {
                        //         this.sessionCount = obj.value;
                        //     }
                        // }
                    }
                    else if (obj.cmd == 'insert') {
                        var created = new Date(obj.rec.data.creationTime.substring(0, 19));
                        var rec = {
                            pk: obj.rec.key.pk,
                            age: created,
                            descr: obj.rec.data.descr,
                            enabled: obj.rec.data.enabled,
                            id: obj.rec.data.id,
                            msisdn: obj.rec.data.msisdn,
                            name: obj.rec.data.name,
                            pwd: obj.rec.data.pwd,
                            vFirmware: obj.rec.data.vFirmware
                        };

                        if (!obj.rec.data.enabled) {
                            rec["_rowVariant"] = "warning";
                        }
                        tmpDevices.push(rec);
                    }
                    else if (obj.cmd == 'modify') {
                        // eslint-disable-next-line
                        console.log('modify device ' + obj.key);
                        var self = this;
                        this.devices.find(function (rec) {
                            if (rec.pk == obj.key) {
                                // eslint-disable-next-line
                                console.log('modify record ' + rec.name);
                                if (obj.value.name != null) {
                                    rec.name = obj.value.name;
                                    if (self.form.pk == rec.pk) {
                                        self.form.name = rec.name;
                                    }
                                }
                                else if (obj.value.msisdn != null) {
                                    rec.msisdn = obj.value.msisdn;
                                    if (self.form.pk == rec.pk) {
                                        self.form.msisdn = rec.msisdn;
                                    }
                                }
                                else if (obj.value.pwd != null) {
                                    rec.pwd = obj.value.pwd;
                                    if (self.form.pk == rec.pk) {
                                        self.form.pwd = rec.pwd;
                                    }
                                }
                                else if (obj.value.descr != null) {
                                    rec.descr = obj.value.descr;
                                    if (self.form.pk == rec.pk) {
                                        self.form.descr = rec.descr;
                                    }
                                }
                                else if (obj.value.enabled != null) {
                                    rec.enabled = obj.value.enabled;
                                    if (!obj.value.enabled) {
                                        rec._rowVariant = 'warning';
                                    }
                                    else {
                                        rec._rowVariant = null;
                                    }
                                    if (self.form.pk == rec.pk) {
                                        self.form.enabled = rec.enabled;
                                    }
                                    //  force refresh: https://github.com/bootstrap-vue/bootstrap-vue/issues/1529
                                    // this.$refs.devTable.refresh();
                                }
                            }
                        });
                    }
                    else if (obj.cmd == 'clear') {
                        //  clear table
                        this.devices = [];
                    }
                    else if (obj.cmd == 'delete') {
                        // console.log('lookup device ' + obj.key);
                        var idx = this.devices.findIndex(rec => rec.pk == obj.key);
                        // eslint-disable-next-line
                        console.log('delete index ' + idx);
                        this.devices.splice(idx, 1);
                    }
                    else if (obj.cmd == 'load') {
                        //  load status
                        if (obj.show != null) {
                            // eslint-disable-next-line
                            //console.log('load state ' + obj.show);
                            this.isBusy = obj.show;

                            if (this.isBusy) {
                                // reset the tmpDevices array if the initial upload starts
                                tmpDevices = [];
                            } else {
                                // set the tmpDevices if the initial uploads is done
                                this.devices = tmpDevices;
                            }
                        }
                        else if (obj.level != 0) {
                            this.busyLevel = obj.level;
                        }
                    }
                    //    update pagination
                    this.visibleRows = this.devices.length;
                }
            },

            ws_on_closed(err) {
                // alert("ws closed: " + err);
            },

            rowSelected(items) {
                this.selected = items
                if (items.length > 0) {
                    // eslint-disable-next-line
                    console.log(items.length + ' rows selected ');
                    //   console.log('selected ' + items[0].name);
                    this.form.name = items[0].name;
                    this.form.msisdn = items[0].msisdn;
                    this.form.pwd = items[0].pwd;
                    this.form.descr = items[0].descr;
                    this.form.enabled = items[0].enabled;
                    this.form.pk = items[0].pk;
                    // this.$.properties.properties.name = items[0].name;
                }
                else {
                    // console.log('nothing selected');
                    this.form.name = "";
                    this.form.msisdn = null;
                    this.form.pwd = null;
                    this.form.descr = null;
                    this.form.enabled = true;
                    this.form.pk = null;
                }
            },

            onDeviceUpdate(event) {
                event.preventDefault();
                // console.log('onDeviceUpdate: ' + this.form.name);
                this.ws_submit_record("modify", "config.device", {
                    key: [this.form.pk],
                    data: {
                        name: this.form.name,
                        msisdn: this.form.msisdn,
                        descr: this.form.descr,
                        pwd: this.form.pwd,
                        enabled: this.form.enabled
                    }
                });
            },
            onDeviceDelete(event) {
                event.preventDefault();
                // eslint-disable-next-line
                //console.log('onDeviceDelete: ' + this.selected.length + ' devices');
                this.$refs.dlgDeleteDevice.show();
            },
            handleDeleteDeviceOk(event) {
                event.preventDefault();
                this.selected.forEach(element => {
                    this.ws_submit_key("delete", "config.device", { tag: [element.pk] });
                });
                this.$nextTick(() => {
                    // Wrapped in $nextTick to ensure DOM is rendered before closing
                    this.$refs.dlgDeleteDevice.hide();
                })
            },
            onDeviceInsert(event) {
                event.preventDefault();
                // eslint-disable-next-line
                console.log('onDeviceInsert: ' + event);
                this.ws_submit_record("insert", "config.device", {
                    key: [this.form.pk],
                    data: { name: this.form.name, msisdn: this.form.msisdn, descr: this.form.descr, pwd: this.form.pwd, enabled: this.form.enabled, age: new Date() }
                });
            },
            generatePassword(event) {
                event.preventDefault();
                let charSet = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!';
                this.form.pwd = "";
                for (let idx = 0; idx < 12; idx++) {
                    this.form.pwd += charSet.charAt(Math.floor(Math.random() * charSet.length));
                }
            },
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.visibleRows = filteredItems.length
                this.currentPage = 1
            },
            formatDescription(str) {
                if (str.length > 24) return str.substring(0, 24) + '...';
                return str;
            }
        },

        computed: {
            tableCaption() {
                return this.selected.length + "/" + this.devices.length + " devices(s) selected - " + this.visibleRows + " device(s) filtered";
            },
            btnUpdateTitle() {
                if (this.selected.length > 0) {
                    return this.$t('config-device-06') + this.selected[0].name;
                }
                return this.$t('config-device-06');
            },
            btnDeleteTitle() {
                if (this.selected.length == 0) {
                    return this.$t('config-device-07');
                }
                else if (this.selected.length == 1) {
                    return this.$t('config-device-07') + this.selected[0].name;
                }
                return this.$t('config-device-07') + this.selected.length + " record(s)";
            },
            btnInsertTitle() {
                return this.$t('config-device-08') + this.form.name;
            },
            isRecordSelected() {
                return this.selected.length != 0;
            },
            isRecordNew() {
                if (this.selected.length != 0) {
                    return this.form.name != this.selected[0].name;
                }
                return this.form.name.length > 0;
            }
        },
        beforeRouteEnter(to, from, next) {
            hasPrivilegesWaitForUser(store, MODULES.CONFIG_DEVICES, PRIVILEGES.VIEW).then((result) => {
                next(result ? true : NO_ACCESS_ROUTE);
            });
        }
    }
</script>

<style scoped lang="css">
    .truncate {
        width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
