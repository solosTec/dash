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
                    <iec ref="IEC" 
                         :items="items" 
                         :nav="nav" 
                         v-model="selected"
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
                            <b-button type="submit" variant="primary" :disabled="!isRecordSelected" v-on:click.stop="onMeterUpdate">{{$t('action-update')}}</b-button>
                        </b-input-group>

                        <b-input-group class="pt-3">
                            <b-button type="submit" variant="danger" :disabled="!isRecordSelected" v-on:click.stop="onMeterDelete">{{$t('action-del')}}</b-button>
                        </b-input-group>
                    </b-form>
                </b-col>
            </b-row>
        </b-container>

</section>
</template>

<script lang="js">

    import { webSocket } from '../mixins/web-socket'
    import iec from '@/components/smf-table-iec.vue'

    export default {
        name: 'smfConfigGateway',
        props: [],
        mixins: [webSocket],
        components: {
            iec
        },

        mounted() {
            this.ws_open("/smf/api/iec/v0.8");
        },

        data() {
            return {
                items:[],
                selected: [],
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
                    ep: '0.0.0.0',
                    direction: false,
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
                    let rec = {
                        pk: key.pk,
                        meter: data.meter,
                        ep: data.ep,
                        interval: data.interval,
                        direction: data.direction
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
                            console.err('undefined cmd ', obj);
                            break;
                    }
                }
            },
            onMeterUpdate(event) {
                event.preventDefault();
            },
            onMeterDelete(event) {
                event.preventDefault();
            },
            rowSelected(items) {
            }
        },
        computed: {
            isRecordSelected() {
                return this.selected.length != 0;
            }
        }
    }
</script>

<style scoped lang="css">
</style>
