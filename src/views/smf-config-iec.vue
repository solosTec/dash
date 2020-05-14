﻿
<template lang="html">
    <section class="smf-config-iec">

        <template>
            <div>
                <vue-headful title="smf :: config IEC1107"
                             description="SMF dashboard"
                             keywords="SMF, solosTec" />
            </div>
        </template>

        <b-jumbotron fluid :header="$t('header-iec')" :lead="$t('lead-iec', {count: this.items.length})" />

        <b-container fluid>
            <b-row>
                <b-col md="9">
                    <tblIEC ref="IEC"
                         :items="items"
                         :nav="nav"
                         v-model="selected"
                         @rowSelected="rowSelected"
                         class="p-3 shadow" />
                </b-col>
                <b-col md="3">
                    <b-form v-on:submit.prevent class="p-3 shadow">

                        <b-form-group label="IP address" label-for="smf-form-iec-ep">
                            <b-form-input id="smf-form-iec-ep"
                                          type="text"
                                          v-model="form.ep"
                                          required
                                          placeholder="<IP address (dotted)>"
                                          minlength="7"
                                          maxlength="15"
                                          size="15" />
                        </b-form-group>

                        <b-form-group label="Direction" label-for="smf-form-iec-direction">
                            <b-form-radio-group id="smf-form-iec-direction" v-model="form.direction" name="smf-form-iec-direction">
                                <b-form-radio value="in" v-b-popover.hover="'The TCP/IP connection will be established by the meter device.'" title="Incoming connection">↤ Incoming</b-form-radio>
                                <b-form-radio value="out" v-b-popover.hover="'The TCP/IP connection will be established by the IEC node.'" title="Outgoing connection">Outgoing ↦</b-form-radio>
                            </b-form-radio-group>
                        </b-form-group>

                        <b-form-group label="Readout Interval" label-for="smf-form-iec-interval">
                            <b-form-input id="smf-form-iec-interval"
                                          type="text"
                                          v-model="form.interval"
                                          required
                                          placeholder="<readout interval>"
                                          maxlength="64" />
                        </b-form-group>

                        <b-input-group class="pt-1">
                            <b-button type="submit" variant="primary" :disabled="!isRecordSelected" v-on:click.stop="onMeterUpdate">{{btnUpdateTitle}}</b-button>
                        </b-input-group>

                        <b-input-group class="pt-3">
                            <b-button type="submit" variant="danger" :disabled="!isRecordSelected" v-on:click.stop="onMeterDelete">{{btnDeleteTitle}}</b-button>
                        </b-input-group>

                        <hr />

                        <b-button type="submit" variant="success" :disabled="!isRecordNew" v-on:click.stop="onDeviceInsert">{{btnInsertTitle}}</b-button>

                    </b-form>
                </b-col>
            </b-row>
        </b-container>

    </section>
</template>

<script lang="ts">

    import {
        webSocket
    } from '@/mixins/web-socket';
    import tblIEC from '@/components/smf-table-iec.vue'
    import mixins from 'vue-typed-mixins';
    import Vue from 'vue';

    import { TranslateResult } from 'vue-i18n';

    interface UiMeter  {
        pk: string;
        meter: string;
        ep: string;
        direction: string;
        interval: string;
    }

    export default mixins(webSocket, Vue).extend( {
        name: 'smfConfigGateway',
        props: [],
        mixins: [webSocket],
        components: {
            tblIEC
        },

        mounted() {
            this.ws_open("/smf/api/iec/v0.8");
        },

        data() {
            return {
                items: [] as UiMeter[],
                selected: [] as UiMeter[],
                nav: {
                    currentPage: 1,
                    visibleRows: 0,
                    perPage: 5,
                    isBusy: false,
                    busyLevel: 0,
                    filter: null,
                },
                form: {
                    pk: '',
                    meter: '',
                    ep: '0.0.0.0',
                    direction: 'in',
                    interval: '00:01:0.0'
                }
            }
        },
        beforeDestroy() {
            this.ws_close();
        },

        methods: {
            ws_on_open() {
                this.items = [];
                this.ws_subscribe("config.iec");
                this.ws_subscribe("table.iec.count");
            },
            cmd_load(channel, show, level) {
                this.nav.busyLevel = level;
                if (show != null) this.nav.isBusy = show;
            },
            cmd_insert(channel, key, data) {
                if (channel == 'config.iec') {
                    let rec: UiMeter = {
                        pk: key.pk,
                        meter: data.meter,
                        ep: data.ep !== null ? data.ep : '0.0.0.0:4004',
                        interval: data.interval,
                        direction: data.direction ? 'in' : 'out'
                    };
                    this.items.push(rec);
                }
            },
            cmd_update(channel, value) {
                //  unused
            },
            ws_on_data(obj) {
                if (obj.cmd != null) {
                    console.log('websocket received ', obj);
                    switch (obj.cmd) {
                        case 'load':
                            this.cmd_load(obj.channel, obj.show, obj.level);
                            break;
                        case 'insert':
                            this.cmd_insert(obj.channel, obj.rec.key, obj.rec.data);
                            break;
                        case 'update':
                            this.cmd_update(obj.channel, obj.value);
                            break;
                        default:
                            console.warn('undefined cmd ', obj);
                            break;
                    }
                }
            },
            onMeterUpdate(event: Event) {
                event.preventDefault();
                this.ws_submit_record("modify", "config.iec", {
                    key: [this.form.pk],
                    data: {
                        pk: this.form.pk,
                        ep: this.form.ep,
                        direction: Boolean(this.form.direction == 'in'),
                        interval: this.form.interval
                    }
                });
            },
            onMeterDelete(event: Event) {
                event.preventDefault();
            },
            onMeterInsert(event: Event) {
                event.preventDefault();
                this.ws_submit_record("insert", "config.iec", {
                    key: [this.form.pk],
                    data: {
                        pk: this.form.pk,
                        ep: this.form.ep,
                        direction: Boolean(this.form.direction == 'in'),
                        interval: this.form.interval
                    }
                });
            },
            rowSelected(items: UiMeter[]) {
                this.selected = items;
                if (items.length > 0) {
                    this.form.pk = items[0].pk;
                    this.form.meter = items[0].meter;
                    this.form.ep = items[0].ep;
                    this.form.direction = items[0].direction ? 'in' : 'out';
                    this.form.interval = items[0].interval;
                }
                else {
                    // console.log('nothing selected');
                    this.pk = '';
                    this.form.meter = '';
                    this.ep = '0.0.0.0';
                    this.direction = 'out';
                    this.interval = '00:01:0.0';
                }
            }
        },

        computed: {
            isRecordSelected() {
                return this.selected.length != 0;
            },
            isRecordNew(): boolean {
                if (this.selected.length !== 0) {
                    return this.form.ep !== this.selected[0].ep;
                }
                return this.form.ep.length > 0;
            },
            btnInsertTitle(): string | TranslateResult { 
                //return this.$t('action-insert') + ' ' + this.form.meter;
                return 'Insert ' + this.form.meter;
            },
            btnDeleteTitle(): string | TranslateResult {
                if (this.selected.length === 0) {
                    //return this.$t('action-del');
                    return 'Delete';
                }
                else if (this.selected.length === 1) {
                    //return this.$t('action-del') + ' ' + this.selected[0].meter;
                    return 'Delete ' + this.selected[0].meter;
                }
                //return this.$t('action-del') + ' ' + this.selected.length + " record(s)";
                return 'Delete ' + this.selected.length + " record(s)";
            },
            btnUpdateTitle(): string | TranslateResult {
                if (this.selected.length > 0) {
                    //return this.$t('action-update') + ' ' + this.selected[0].meter;
                    return 'Update ' + this.selected[0].meter;
                }
                return 'Update';
            }
        },

        watch: {
            //selected: function (items) {
            //    console.log('selected ', items);
            //}
        }
    })
</script>

<style scoped lang="css">
</style>
