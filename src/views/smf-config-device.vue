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
                    <smf-data-table
                            :busyLevel="busyLevel"
                            tableName="devices"
                            :items="devices"
                            :fields="fields"
                            @itemSelected="rowSelected">

                        <template v-slot:cell(descr)="data">
                            <span v-b-popover.hover="data.value" :title="data.item.name">{{ formatDescription(data.value) }}</span>
                        </template>

                    </smf-data-table>
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

<script lang="ts">

    import {
        webSocket,
        WSDeleteResponse,
        WSInsertResponse,
        WSLoadResponse,
        WSModifyResponse,
        WSResponse
    } from '@/mixins/web-socket';
    import store from './../store/index';
    import {hasPrivilegesWaitForUser} from "@/mixins/privileges";
    import {MODULES, NO_ACCESS_ROUTE, PRIVILEGES} from "@/store/modules/user";
    import {generatePassword} from "@/shared/generate-password";
    import smfDataTable from '@/components/smf-data-table.vue';
    import mixins from 'vue-typed-mixins';
    import Vue from 'vue';
    import {BModal} from 'bootstrap-vue';
    import {TranslateResult} from 'vue-i18n';
    import {Device} from '@/backend-api/device';
    import {Route} from 'vue-router';

    interface BTableItem {
        _rowVariant?: 'warning' | null;
    }

    interface UiDevice extends BTableItem {
        pk: string;
        age: Date;
        descr: string;
        enabled: boolean;
        id: string;
        msisdn: string;
        name: string;
        pwd: string;
        vFirmware: string;
    }

    interface FormDevice {
        name: string;
        msisdn: string | null;
        pwd: string | null;
        descr: string | null;
        enabled: boolean;
        pk: string | null;
    }

    const fields = [
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
            formatter: (value: string) => value ? '✔' : '✖',
            class: 'text-center'
        },
        {
            key: 'age',
            label: 'Created',
            formatter: (value: string) => value.toLocaleString(),
            sortable: true
        }
    ];

    let tmpDevices: UiDevice[] = [];

    export default mixins(webSocket, Vue).extend({
        name: 'smfConfigDevice',
        props: [],
        components: {
            smfDataTable
        },
        mixins: [webSocket],
        mounted() {
            this.ws_open("/smf/api/device/v0.8");
            console.log('devices view mounted')
        },
        data() {
            return {
                isBusy: true,
                busyLevel: 0,
                fields,
                devices: [] as UiDevice[],
                selected: [] as UiDevice[],
                form: {
                    name: '',
                    msisdn: '',
                    pwd: '',
                    descr: '',
                    enabled: true,
                    pk: ''
                } as FormDevice
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

            ws_on_data(obj: WSResponse) {
                if (obj.cmd) {
                    // eslint-disable-next-line
                    console.log(this.$options.name + ' websocket received ' + obj.cmd + ' / ' + obj.channel);
                    if (obj.cmd === 'update') {
                        // if (obj.channel != null) {
                        //     console.log('update channel ' + obj.channel);
                        //     if (obj.channel == 'table.session.count') {
                        //         this.sessionCount = obj.value;
                        //     }
                        // }
                    }
                    else if (obj.cmd === 'insert') {
                        const insertResponse = obj as WSInsertResponse<Device>;
                        const bDevice = insertResponse.rec.data;
                        const created = new Date(bDevice.creationTime.substring(0, 19));
                        const rec: UiDevice = {
                            pk: insertResponse.rec.key.pk,
                            age: created,
                            descr: bDevice.descr,
                            enabled: bDevice.enabled,
                            id: bDevice.id,
                            msisdn: bDevice.msisdn,
                            name: bDevice.name,
                            pwd: bDevice.pwd,
                            vFirmware: bDevice.vFirmware,
                            _rowVariant: bDevice.enabled ? null : 'warning'
                        };

                        if (this.isBusy) {
                            //  bulk insert
                            tmpDevices.push(rec);
                        }
                        else {
                            //  operational insert
                            this.devices.push(rec);
                        }
                    }
                    else if (obj.cmd === 'modify') {
                        const modResponse = obj as WSModifyResponse<Device>;
                        // eslint-disable-next-line
                        console.log('modify device ' + modResponse.key);
                        this.devices.forEach( (rec: UiDevice) => {
                            if (rec.pk === modResponse.key) {
                                // eslint-disable-next-line
                                console.log('modify record ' + rec.name);
                                if (modResponse.value.name != null) {
                                    rec.name = modResponse.value.name;
                                    if (this.form.pk === rec.pk) {
                                        this.form.name = rec.name;
                                    }
                                }
                                else if (modResponse.value.msisdn != null) {
                                    rec.msisdn = modResponse.value.msisdn;
                                    if (this.form.pk === rec.pk) {
                                        this.form.msisdn = rec.msisdn;
                                    }
                                }
                                else if (modResponse.value.pwd != null) {
                                    rec.pwd = modResponse.value.pwd;
                                    if (this.form.pk === rec.pk) {
                                        this.form.pwd = rec.pwd;
                                    }
                                }
                                else if (modResponse.value.descr != null) {
                                    rec.descr = modResponse.value.descr;
                                    if (this.form.pk === rec.pk) {
                                        this.form.descr = rec.descr;
                                    }
                                }
                                else if (modResponse.value.enabled != null) {
                                    rec.enabled = modResponse.value.enabled;
                                    rec._rowVariant = modResponse.value.enabled ? null : 'warning';
                                    if (this.form.pk === rec.pk) {
                                        this.form.enabled = rec.enabled;
                                    }
                                }
                            }
                        });
                    }
                    else if (obj.cmd === 'clear') {
                        //  clear table
                        this.devices = [];
                    }
                    else if (obj.cmd === 'delete') {
                        var idx = this.devices.findIndex(rec => rec.pk === (obj as WSDeleteResponse).key);
                        // eslint-disable-next-line
                        console.log('delete index ' + idx);
                        this.devices.splice(idx, 1);
                    }
                    else if (obj.cmd === 'load') {
                        const loadResponse = obj as WSLoadResponse;
                        if (loadResponse.hasOwnProperty('show')) {
                            this.isBusy = loadResponse.show;

                            if (this.isBusy) {
                                // reset the tmpDevices array if the initial upload starts
                                tmpDevices = [];
                            } else {
                                // set the tmpDevices if the initial uploads is done
                                this.devices = tmpDevices;
                            }
                        }
                        if (loadResponse.hasOwnProperty('level')) {
                            this.busyLevel = loadResponse.level;
                        }
                    }
                }
            },

            ws_on_closed(err: any) {},

            rowSelected(items: UiDevice[]) {
                this.selected = items;
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

            onDeviceUpdate(event: Event) {
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
            onDeviceDelete(event: Event) {
                event.preventDefault();
                // eslint-disable-next-line
                //console.log('onDeviceDelete: ' + this.selected.length + ' devices');
                (this.$refs.dlgDeleteDevice as BModal).show();
            },
            handleDeleteDeviceOk(event: Event) {
                event.preventDefault();
                this.selected.forEach(element => {
                    this.ws_submit_key("delete", "config.device", { tag: [element.pk] });
                });
                this.$nextTick(() => {
                    // Wrapped in $nextTick to ensure DOM is rendered before closing
                    (this.$refs.dlgDeleteDevice as BModal).hide();
                })
            },
            onDeviceInsert(event: Event) {
                event.preventDefault();
                // eslint-disable-next-line
                console.log('onDeviceInsert: ' + event);
                this.ws_submit_record("insert", "config.device", {
                    key: [this.form.pk],
                    data: {
                        name: this.form.name,
                        msisdn: this.form.msisdn,
                        descr: this.form.descr,
                        pwd: this.form.pwd,
                        enabled: this.form.enabled,
                        age: new Date()
                    }
                });
            },
            generatePassword(event: Event) {
                event.preventDefault();
                this.form.pwd = generatePassword();
            },
            formatDescription(str: string) {
                if (str.length > 24) return str.substring(0, 24) + '...';
                return str;
            }
        },

        computed: {
            btnUpdateTitle(): string | TranslateResult {
                if (this.selected.length > 0) {
                    return this.$t('config-device-06') + ' ' + this.selected[0].name;
                }
                return this.$t('config-device-06');
            },
            btnDeleteTitle(): string | TranslateResult {
                if (this.selected.length === 0) {
                    return this.$t('config-device-07');
                }
                else if (this.selected.length === 1) {
                    return this.$t('config-device-07') + ' ' + this.selected[0].name;
                }
                return this.$t('config-device-07') + ' ' + this.selected.length + " record(s)";
            },
            btnInsertTitle(): string | TranslateResult {
                return this.$t('config-device-08') + ' ' + this.form.name;
            },
            isRecordSelected(): boolean {
                return this.selected.length !== 0;
            },
            isRecordNew(): boolean {
                if (this.selected.length !== 0) {
                    return this.form.name !== this.selected[0].name;
                }
                return this.form.name.length > 0;
            }
        },
        beforeRouteEnter(to: Route, from: Route, next: any) {
            hasPrivilegesWaitForUser(store, MODULES.CONFIG_DEVICES, PRIVILEGES.VIEW).then((result) => {
                next(result ? true : NO_ACCESS_ROUTE);
            });
        }
    })
</script>
