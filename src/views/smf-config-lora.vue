<template lang="html">

    <section class="smf-config-lora">

        <template>
            <div>
                <vue-headful title="smf :: config LoRa"
                             description="SMF dashboard"
                             keywords="SMF, solosTec" />
            </div>
        </template>

        <b-jumbotron fluid :header="$t('header-LoRa')" :lead="$t('lead-LoRa', {count: this.gateways.length})" />

        <b-container fluid>
            <b-row>
                <b-col md="9">
                    <!-- table -->
                    <b-table ref="gatewayTable"
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
                             :items="gateways"
                             :busy="isBusy"
                             :current-page="currentPage"
                             :per-page="perPage"
                             primary-key="pk"
                             :sort-by.sync="sortBy"
                             :sort-desc.sync="sortDesc"
                             :sort-direction="sortDirection"
                             class="shadow">

                        <!-- caption slot -->
                        <!-- <template slot="table-caption">{{ tableCaption }}</template> -->
                        <!-- A virtual column -->
                        <template v-slot:cell(index)="data">
                            {{ data.index + 1 }}
                        </template>

                        <!-- loading slot -->
                        <div slot="table-busy" class="text-center text-danger">
                            <strong>Loading... {{busyLevel}}%</strong>
                        </div>

                    </b-table>
                </b-col>

                <b-col md="3">
                    <!-- form -->
                    <b-form v-on:submit.prevent class="p-3 shadow">
                        <b-form-group label="DevEUI" label-for="smf-form-lora-eui">
                            <b-form-input id="smf-form-dev-name"
                                          type="text"
                                          v-model="form.eui"
                                          required
                                          placeholder="<DevEUI>"
                                          maxlength="19" />
                        </b-form-group>

                        <b-form-group label="AES Key" label-for="smf-form-lora-aes">
                            <b-form-input id="smf-form-dev-name"
                                          type="text"
                                          v-model="form.aes"
                                          required
                                          placeholder="<AES Key>"
                                          maxlength="64" />
                        </b-form-group>

                        <b-form-group label="Driver" label-for="smf-form-lora-driver">
                            <b-form-select v-model="form.driver" class="mb-3">
                                <option value="binary">Binary</option>
                                <option value="ascii">ASCII</option>
                                <option value="mbus">M-Bus</option>
                                <option value="waterv2">Water v2</option>
                                <option value="demo">Demo (BETA)</option>
                            </b-form-select>
                        </b-form-group>

                        <b-form-group label="Activation" label-for="smf-form-lora-activation">
                            <b-form-radio-group id="smf-form-lora-activation" v-model="form.activation" name="smf-form-lora-activation">
                                <b-form-radio value="otaa" v-b-popover.hover="'Over-the-Air Activation (OTAA) is the preferred and most secure way to connect with the LoRa Network. Devices perform a join-procedure with the network, during which a dynamic DevAddr is assigned and security keys are negotiated with the device.'" title="Over-the-Air Activation">OTAA</b-form-radio>
                                <b-form-radio value="abp" v-b-popover.hover="'In some cases you might need to hardcode the DevAddr as well as the security keys in the device. This means activating a device by personalization (ABP). This strategy might seem simpler, because you skip the join procedure, but it has some downsides related to security.'" title="Activation by Personalization">ABP</b-form-radio>
                            </b-form-radio-group>
                        </b-form-group>

                        <b-form-group label="AppEUI" label-for="smf-form-lora-appeui">
                            <b-form-input id="smf-form-lora-appeui"
                                          type="text"
                                          v-model="form.appeui"
                                          required
                                          placeholder="<App EUI>"
                                          maxlength="19" />
                        </b-form-group>

                        <b-form-group label="GatewayEUI" label-for="smf-form-lora-appeui">
                            <b-form-input id="smf-form-lora-appeui"
                                          type="text"
                                          v-model="form.gweui"
                                          required
                                          placeholder="<Gateway EUI>"
                                          maxlength="19" />
                        </b-form-group>

                        <b-input-group class="pt-1">
                            <b-button type="submit" variant="primary" :disabled="!isRecordSelected" v-on:click.stop="onDeviceUpdate">{{btnUpdateTitle}}</b-button>
                        </b-input-group>

                        <b-input-group class="pt-3">
                            <b-button type="submit" variant="danger" :disabled="!isRecordSelected" v-on:click.stop="onDeviceDelete">{{btnDeleteTitle}}</b-button>
                        </b-input-group>
                    </b-form>
                </b-col>
            </b-row>

            <b-row>
                <b-col md="4" offset-md="8">
                    <b-pagination v-model="currentPage" :total-rows="gateways.length" :per-page="perPage" />
                </b-col>
            </b-row>

        </b-container>

    </section>

</template>

<script lang="js">

    import { webSocket } from '../mixins/web-socket.js'
    import {hasPrivilegesWaitForUser} from "../mixins/privileges";
    import store from "../store";
    import {MODULES, NO_ACCESS_ROUTE, PRIVILEGES} from "../store/modules/user";

    export default {
        name: 'smfConfigLora',
        props: [],
        mixins: [webSocket],

        mounted() {
            this.ws_open("/smf/api/lora/v0.7");
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
                    //    uuid
                    {
                        key: 'euid',
                        label: 'DevEUI',
                        sortable: true
                    },
                    {
                        key: 'aes',
                        label: 'AES Key',
                        sortable: true
                    },
                    {
                        key: 'driver',
                        label: 'Driver',
                        sortable: true
                    },
                    {
                        key: 'activation',
                        label: 'Activation',
                        sortable: true,
                        formatter: (value, key, item) => {
                            return value.toUpperCase();
                        }
                    },
                    {
                        key: 'devAddr',
                        label: 'DevAddr',
                        sortable: true,
                        class: 'text-right'
                    },
                    {
                        key: 'appEUI',
                        label: 'AppEUI',
                        sortable: true
                    },
                    {
                        key: 'gwEUI',
                        label: 'GatewayEUI',
                        sortable: true
                    }
                ],
                gateways: [],
                selected: [],
                sortBy: 'name',
                sortDesc: false,
                sortDirection: 'desc',
                form: {
                    pk: '',
                    eui: '',
                    aes: '',
                    driver: 'ascii',
                    activation: "otaa",
                    appeui: '',
                    gweui: ''
                }
            }
        },

        beforeDestroy() {
            this.ws_close();
        },

        methods: {
            ws_on_open() {
                //  clear table
                this.gateways = [];

                //  subscribe channel
                this.ws_subscribe("config.lora");
            },

            ws_on_data(obj) {
                if (obj.cmd != null) {
                    console.log(this.$options.name + ' websocket received ' + obj.cmd + ' / ' + obj.channel);
                    if (obj.cmd == 'insert') {
                        var activation = obj.rec.data.activation ? 'otaa' : 'abp';
                        this.gateways.push({
                            pk: obj.rec.key.pk,
                            euid: obj.rec.data.DevEUI,
                            aes: obj.rec.data.AESKey,
                            driver: obj.rec.data.driver,
                            activation: activation,
                            devAddr: obj.rec.data.DevAddr,
                            appEUI: obj.rec.data.AppEUI,
                            gwEUI: obj.rec.data.GatewayEUI
                        });
                    }
                    else if (obj.cmd == 'delete') {
                        console.log('lookup gateway ' + obj.pk);
                        var idx = this.gateways.findIndex(rec => rec.pk == obj.pk);
                        console.log('delete index ' + idx);
                        this.gateways.splice(idx, 1);
                    }
                    else if (obj.cmd == 'modify') {
                        console.log('lookup device ' + obj.key);
                        var self = this;
                        this.gateways.find(function (rec) {
                            if (rec.pk == obj.key) {
                                if (obj.value.DevEUI != null) {
                                    rec.euid = obj.value.DevEUI;
                                    if (self.form.pk == obj.key) self.form.euid = obj.value.DevEUI;
                                }
                                else if (obj.value.AESKey != null) {
                                    rec.aes = obj.value.AESKey;
                                    if (self.form.pk == obj.key) self.form.aes = obj.value.AESKey;
                                }
                                else if (obj.value.driver != null) {
                                    rec.driver = obj.value.driver;
                                    if (self.form.pk == obj.key) self.form.driver = obj.value.driver;
                                }
                                else if (obj.value.activation != null) {
                                    rec.activation = obj.value.activation ? 'otaa' : 'abp';
                                    if (self.form.pk == obj.key) self.form.activation = rec.activation;
                                }
                                else if (obj.value.DevAddr != null) {
                                    rec.devAddr = obj.value.DevAddr;
                                    if (self.form.pk == obj.key) self.form.devAddr = obj.value.devAddr;
                                }
                                else if (obj.value.AppEUI != null) {
                                    rec.appEUI = obj.value.AppEUI;
                                    if (self.form.pk == obj.key) self.form.appEUI = obj.value.AppEUI;
                                }
                                else if (obj.value.GatewayEUI != null) {
                                    rec.gwEUI = obj.value.GatewayEUI;
                                    if (self.form.pk == obj.key) self.form.gwEUI = obj.value.GatewayEUI;
                                }
                            }
                        });
                    }
                    else if (obj.cmd == 'clear') {
                        this.gateways = [];
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
            },

            rowSelected(items) {
                this.selected = items;
                if (items.length > 0) {
                    this.form.pk = items[0].pk;
                    this.form.eui = items[0].euid;
                    this.form.aes = items[0].aes;
                    this.form.driver = items[0].driver;
                    this.form.activation = items[0].activation;
                    this.form.appeui = items[0].appEUI;
                    this.form.devAddr = items[0].devAddr;
                    this.form.gweui = items[0].gwEUI;
                    console.log('select ' + items[0].pk);
                }
            },
            onDeviceUpdate(event) {
                event.preventDefault();
                console.log('onDeviceUpdate: ' + this.form.eui);
                this.ws_submit_record("modify", "config.lora", {
                    key: [this.form.pk],
                    data: {
                        DevEUI: this.form.name,
                        AESKey: this.form.aes,
                        driver: this.form.driver,
                        activation: (this.form.activation == 'otaa') ? true : false,
                        DevAddr: this.form.devAddr,
                        AppEUI: this.form.appeui,
                        GatewayEUI: this.form.gweui
                    }
                });
            },
            onDeviceDelete(event) {
                event.preventDefault();
                console.log('onDeviceDelete: ' + this.selected.length + ' devices');
                // this.$refs.dlgDeleteDevice.show();
            },

        },
        computed: {
            isRecordSelected() {
                return this.selected.length != 0;
            },
            tableCaption() {
                return this.selected.length + "/" + this.selected.length + " item(s) selected";
            },
            btnUpdateTitle() {
                if (this.selected.length > 0) {
                    return "Update " + this.form.eui;
                }
                return "Update";
            },
            btnDeleteTitle() {
                if (this.selected.length == 0) {
                    return "Delete";
                }
                else if (this.selected.length == 1) {
                    return "Delete " + this.form.eui;
                }
                return "Delete " + this.selected.length + " record(s)";
            }
        },
        beforeRouteEnter(to, from, next) {
            hasPrivilegesWaitForUser(store, MODULES.CONFIG_LORA, PRIVILEGES.VIEW).then((result) => {
                next( result ? true: NO_ACCESS_ROUTE);
            });
        }
    }
</script>

<style scoped lang="css">
</style>
