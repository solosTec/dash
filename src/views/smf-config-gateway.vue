﻿<template lang="html">

    <section class="smf-config-gateway">

        <template>
            <div>
                <vue-headful title="smf :: config gateways"
                             description="SMF dashboard"
                             keywords="SMF, solosTec" />
            </div>
        </template>

        <b-jumbotron fluid :header="$t('header-gateway')" :lead="$t('lead-gateway', {count: this.gateways.length})" />

        <b-container fluid>
            <b-row>
                <b-col md="6">
                    <b-form-group label-cols-sm="3" :label="$t('config-gateway-01')" class="mb-0">
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
                        <smf-row-count-selector v-model="perPage" store-key="gateway" class="col"/>
                        <b-pagination v-model="currentPage" :total-rows="visibleRows" :per-page="perPage" class="justify-content-end" />
                    </b-form-row>
                </b-col>
            </b-row>

            <b-row>
                <b-col md="12">
                    <!-- table -->
                    <b-table ref="gwTable"
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
                        <template v-slot:cell(index)="data">
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
                <b-col md="10" class="p-3 shadow">
                    <b-tabs pills card v-model="tabIndex">

                        <b-tab :title="$t('config-gateway-04')" active>
                            <b-form @submit.prevent="">

                                <b-row>
                                    <b-col md="10" class="shadow">

                                        <b-row>
                                            <b-col md="6">
                                                <b-form-group :label="$t('config-gateway-05')" label-for="smf-form-gw-server">
                                                    <b-form-input id="smf-form-gw-server"
                                                                  type="text"
                                                                  v-model="form.serverId"
                                                                  :state="serverIdValidation"
                                                                  required
                                                                  :placeholder="getPlaceholder($t('config-gateway-05'))"
                                                                  maxlength="14" />
                                                    <b-form-invalid-feedback :state="serverIdValidation">
                                                        A server ID must be a 14 characters long hexadecimal string
                                                    </b-form-invalid-feedback>
                                                    <b-form-valid-feedback :state="serverIdValidation">
                                                        OK
                                                    </b-form-valid-feedback>
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group :label="$t('config-gateway-06')" label-for="smf-form-gw-manufacturer">
                                                    <b-form-input id="smf-form-gw-manufacturer"
                                                                  type="text"
                                                                  v-model="form.manufacturer"
                                                                  required
                                                                  :placeholder="getPlaceholder($t('config-gateway-06'))" />
                                                </b-form-group>
                                            </b-col>
                                        </b-row>

                                        <b-row>
                                            <b-col md="6">
                                                <b-form-group :label="$t('config-gateway-07')" label-for="smf-form-gw-server">
                                                    <b-form-input id="smf-form-gw-user"
                                                                  type="text"
                                                                  v-model="form.userName"
                                                                  required
                                                                  :placeholder="getPlaceholder($t('config-gateway-07'))"
                                                                  maxlength="14" />
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group :label="$t('config-gateway-08')" label-for="smf-form-gw-pwd">
                                                    <b-input-group>
                                                        <b-form-input id="smf-form-gw-pwd"
                                                                      type="text"
                                                                      v-model="form.userPwd"
                                                                      required
                                                                      :placeholder="getPlaceholder($t('config-gateway-08'))" />
                                                        <b-input-group-append>
                                                            <b-button variant="info" v-on:click.stop="generatePassword">&#x21ba;</b-button>
                                                        </b-input-group-append>
                                                    </b-input-group>
                                                </b-form-group>
                                            </b-col>
                                        </b-row>


                                    </b-col>
                                    <b-col md="2">

                                        <b-row class="p-3">
                                            <b-col md="12">
                                                <b-button type="submit" variant="primary" v-on:click.stop="onGatewayUpdate">{{btnUpdateTitle}}</b-button>&nbsp;
                                            </b-col>
                                        </b-row>

                                        <b-row class="p-3">
                                            <b-col md="12">
                                                <b-button type="submit" variant="warning" v-on:click.stop="onGatewayReboot" v-b-popover.hover="'Connection will be lost during reboot!'" :title="btnRebootTitle">{{btnRebootTitle}}</b-button>
                                            </b-col>
                                        </b-row>

                                        <b-row class="p-3">
                                            <b-col md="12">
                                                <b-button type="submit" variant="danger" v-on:click.stop="onGatewayDelete">{{btnDeleteTitle}}</b-button>
                                            </b-col>
                                        </b-row>

                                    </b-col>
                                </b-row>


                            </b-form>
                        </b-tab>

                        <!-- Status -->
                        <b-tab no-body>
                            <template slot="title">
                                {{ $t('config-gateway-09') }}
                                <b-spinner v-if="spinner.status" type="grow" small />
                            </template>
                            <b-list-group>
                                <template v-for="(state, index) in gw.status">
                                    <b-list-group-item :variant="state.variant" :key="index">{{state.value}}</b-list-group-item>
                                </template>
                            </b-list-group>
                        </b-tab>

                        <b-tab>
                            <template slot="title">
                                {{ $t('config-gateway-10') }}
                                <b-spinner v-if="spinner.ipt" type="grow" small />
                            </template>
                            <b-form @submit.prevent="">

                                <b-row>
                                    <b-col md="6" class="border">

                                        <b-row>
                                            <b-col md="12" class="d-flex justify-content-start">
                                                <h2>&#9312;</h2>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group :label="$t('config-gateway-11')" label-for="smf-gw-ipt-host-0">
                                                    <b-form-input id="smf-gw-ipt-host-0"
                                                                  type="text"
                                                                  v-model="ipt.param[0].host"
                                                                  required
                                                                  v-b-popover.hover="'Specify a known hostname or an IPv4/IPv6 address'" title="Primary IP-T Master"
                                                                  :placeholder="getPlaceholder($t('config-gateway-11'))" />
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group :label="$t('config-gateway-12')" label-for="smf-gw-ipt-name-0">
                                                    <b-form-input id="smf-gw-ipt-name-0"
                                                                  type="text"
                                                                  v-model="ipt.param[0].user"
                                                                  required
                                                                  :placeholder="getPlaceholder($t('config-gateway-12'))" />
                                                </b-form-group>
                                            </b-col>
                                        </b-row>

                                        <b-row>
                                            <b-col md="6">
                                                <b-form-group :label="$t('config-gateway-14')" label-for="smf-gw-ipt-port-0">
                                                    <b-input-group>
                                                        <b-form-input id="smf-gw-ipt-port-0"
                                                                      type="number"
                                                                      v-model.number="ipt.param[0].port"
                                                                      required
                                                                      min="1024"
                                                                      max="‭65535‬"
                                                                      :placeholder="getPlaceholder($t('config-gateway-14'))" />
                                                        <b-input-group-append>
                                                            <b-button variant="info" v-on:click.stop="ipt.param[0].port = 26862">{{ $t('com-default') }}</b-button>
                                                        </b-input-group-append>
                                                    </b-input-group>
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group :label="$t('config-gateway-16')" label-for="smf-gw-ipt-pwd-0">
                                                    <b-input-group>
                                                        <b-form-input id="smf-gw-ipt-pwd-0"
                                                                      type="text"
                                                                      v-model="ipt.param[0].pwd"
                                                                      required
                                                                      :placeholder="getPlaceholder($t('config-gateway-16'))" />
                                                        <b-input-group-append>
                                                            <b-button variant="info" v-on:click.stop="generatePasswordIPT($event, 0)">&#x21ba;</b-button>
                                                        </b-input-group-append>
                                                    </b-input-group>
                                                </b-form-group>
                                            </b-col>
                                        </b-row>

                                    </b-col>
                                    <b-col md="6" class="border">

                                        <b-row>
                                            <b-col md="12" class="d-flex justify-content-end">
                                                <h2>&#9313;</h2>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group :label="$t('config-gateway-11')" label-for="smf-gw-ipt-host-1">
                                                    <b-form-input id="smf-gw-ipt-host-1"
                                                                  type="text"
                                                                  v-model="ipt.param[1].host"
                                                                  required
                                                                  v-b-popover.hover="'Specify a known hostname or an IPv4/IPv6 address'" title="Secondary IP-T Master"
                                                                  :placeholder="$t('config-gateway-11')" />
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group :label="$t('config-gateway-12')" label-for="smf-gw-ipt-name-1">
                                                    <b-form-input id="smf-gw-ipt-name-1"
                                                                  type="text"
                                                                  v-model="ipt.param[1].user"
                                                                  required
                                                                  :placeholder="getPlaceholder($t('config-gateway-12'))" />
                                                </b-form-group>
                                            </b-col>
                                        </b-row>

                                        <b-row>
                                            <b-col md="6">
                                                <b-form-group :label="$t('config-gateway-14')" label-for="smf-gw-ipt-port-1">
                                                    <b-input-group>
                                                        <b-form-input id="smf-gw-ipt-port-1"
                                                                      type="number"
                                                                      v-model.number="ipt.param[1].port"
                                                                      required
                                                                      min="1024"
                                                                      max="‭65535‬"
                                                                      :placeholder="getPlaceholder($t('config-gateway-14'))" />
                                                        <b-input-group-append>
                                                            <b-button variant="info" v-on:click.stop="ipt.param[1].port = 26863">{{ $t('com-default') }}</b-button>
                                                        </b-input-group-append>
                                                    </b-input-group>
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group :label="$t('config-gateway-16')" label-for="smf-gw-ipt-pwd-1">
                                                    <b-input-group>
                                                        <b-form-input id="smf-gw-ipt-pwd-1"
                                                                      type="text"
                                                                      v-model="ipt.param[1].pwd"
                                                                      required
                                                                      :placeholder="getPlaceholder($t('config-gateway-16'))" />
                                                        <b-input-group-append>
                                                            <b-button variant="info" v-on:click.stop="generatePasswordIPT($event, 1)">&#x21ba;</b-button>
                                                        </b-input-group-append>
                                                    </b-input-group>
                                                </b-form-group>
                                            </b-col>
                                        </b-row>

                                    </b-col>
                                </b-row>

                                <b-row class="pt-4">
                                    <b-col md="2">
                                        <b-button type="submit" variant="primary" size="lg" v-on:click.stop="onIPTUpdate">{{btnUpdateTitle}}</b-button>
                                    </b-col>
                                    <b-col md="10">
                                        <b-alert variant="warning" show dismissible>
                                            <span style="font-weight: bold">Note:</span> Changing the IP-T configuration can lead to connection breakdown.
                                        </b-alert>
                                    </b-col>
                                </b-row>

                                <b-row class="border">
                                    <b-col md="6">
                                        <b-form-group :label="$t('config-gateway-11')" label-for="smf-gw-ipt-host">
                                            <b-form-input id="smf-gw-ipt-host"
                                                          type="text"
                                                          v-model="ipt.status.host"
                                                          v-b-popover.hover="'Current IP address'" title="Hostname" placement="top"
                                                          readonly
                                                          :placeholder="getPlaceholder($t('config-gateway-11'))" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-18')" label-for="smf-gw-ipt-port-local">
                                            <b-form-input id="smf-gw-ipt-port-local"
                                                          type="number"
                                                          v-model.number="ipt.status.local"
                                                          readonly
                                                          min="1024"
                                                          max="‭65535‬"
                                                          :placeholder="getPlaceholder($t('config-gateway-14'))" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-19')" label-for="smf-gw-ipt-port-remote">
                                            <b-form-input id="smf-gw-ipt-port-remote"
                                                          type="number"
                                                          v-model.number="ipt.status.remote"
                                                          readonly
                                                          min="1024"
                                                          max="‭65535‬"
                                                          :placeholder="getPlaceholder($t('config-gateway-14'))" />
                                        </b-form-group>
                                    </b-col>
                                </b-row>

                            </b-form>
                        </b-tab>

                        <!-- Firmware -->
                        <b-tab no-body>
                            <template slot="title">
                                {{ $t('config-gateway-29') }}
                                <b-spinner v-if="spinner.firmware" type="grow" small />
                            </template>
                            <!-- table -->
                            <firmware ref="firmware" :items="fw.values" />
                        </b-tab>

                        <!-- Memory -->
                        <b-tab title="">
                            <template slot="title">
                                {{ $t('config-gateway-30') }}
                                <b-spinner v-if="spinner.memory" type="grow" small />
                            </template>
                            <b-row>
                                <b-col md="6">
                                    <b-card-text>{{ $t('config-gateway-31') }}</b-card-text>
                                    <b-progress class="mt-2" height="2rem" :value="gw.memory.mirror" show-value />
                                </b-col>
                                <b-col md="6">
                                    <b-card-text>{{ $t('config-gateway-32') }}</b-card-text>
                                    <b-progress class="mt-2" height="2rem" :value="gw.memory.tmp" show-value />
                                </b-col>
                            </b-row>
                        </b-tab>

                        <!-- Meters -->
                        <b-tab no-body>
                            <template slot="title">
                                {{ $t('config-gateway-33') }}
                                <b-spinner v-if="spinner.meters" type="grow" small />
                            </template>

                            <!-- table -->
                            <b-table ref="meterTable"
                                     bordered
                                     striped
                                     small
                                     hover
                                     show-empty
                                     stacked="md"
                                     selectable
                                     select-mode="single"
                                     selectedVariant="info"
                                     @row-selected="meterSelected"
                                     :fields="meters.fields"
                                     :items="meters.values"
                                     primary-key="ident"
                                     :sort-by.sync="meters.sortBy"
                                     :sort-desc.sync="meters.sortDesc"
                                     :sort-direction="meters.sortDirection"
                                     class="shadow">

                                <template v-slot:cell(visible)="row">
                                    <b-button size="sm"
                                              v-if="row.item.visible"
                                              @click="onMeterDelete(row.item, row.index, $event.target)">✔ Delete</b-button>
                                </template>

                                <template v-slot:cell(active)="row">
                                    <b-button size="sm"
                                              @click="onMeterActivate(row.item, row.index, $event.target)">{{ row.item.active ? '✖ Deactivate' : '✔ Activate' }}</b-button>
                                </template>
                                <template v-slot:cell(edit)="row">
                                    <b-button size="sm"
                                              variant="info"
                                              v-b-tooltip.hover :title="'meter code: ' + row.item.mc"
                                              :disabled="btnEditStatus(row.item.mc)"
                                              @click="onMeterEdit(row.item)">{{ btnEdit }}</b-button>
                                </template>
                            </b-table>
                            <div>
                                <b-link :href="meters.csv" download="meters.csv" type="text/csv">{{ linkMeterDownloadTitle }}</b-link>
                            </div>
                        </b-tab>

                        <!-- wireless M-Bus -->
                        <b-tab no-body>
                            <template slot="title">
                                {{ $t('config-gateway-27') }}
                                <b-spinner v-if="spinner.wmbus" type="grow" small />
                            </template>

                            <b-form @submit.prevent="" class="p-3 shadow">

                                <b-row>

                                    <b-col md="3" class="d-flex justify-content-center">
                                        <b-form-group :label="$t('config-gateway-34')">
                                            <b-form-radio-group id="smf-gw-wmbus-protocol"
                                                                buttons
                                                                button-variant="outline-primary"
                                                                stacked
                                                                v-model="wmbus.protocol"
                                                                name="smf-gw-wmbus-protocol">
                                                <b-form-radio value="T">{{$t('config-gateway-35')}}</b-form-radio>
                                                <b-form-radio value="S">{{$t('config-gateway-36')}}</b-form-radio>
                                                <b-form-radio value="A" v-b-popover.hover="$t('config-gateway-37')" title="T2/S2 Automatic">T2/S2 Automatic</b-form-radio>
                                                <b-form-radio value="P">{{$t('config-gateway-38')}}</b-form-radio>
                                            </b-form-radio-group>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-39')" label-for="smf-gw-wmbus-active">
                                            <b-form-checkbox switch v-model="wmbus.active" name="smf-gw-wmbus-active">
                                                {{ wmbus.active ? $t('config-gateway-40') : $t('config-gateway-41') }}
                                            </b-form-checkbox>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-42')" label-for="smf-gw-wmbus-reboot">
                                            <b-input-group :prepend="wmbusRebootPrep">
                                                <b-form-input id="smf-gw-wmbus-reboot"
                                                              type="number"
                                                              v-model.number="wmbus.reboot"
                                                              min="0"
                                                              max="‭60000"
                                                              step="60"
                                                              placeholder="<Reboot>" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="wmbus.reboot = 86400">{{$t('config-gateway-48')}}</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>

                                        <b-form-group :label="$t('config-gateway-43')" label-for="smf-gw-wmbus-power">
                                            <b-form-select v-model="wmbus.power" class="mb-3" disabled>
                                                <option value="low">{{$t('config-gateway-43-01')}}</option>
                                                <option value="basic">{{$t('config-gateway-43-02')}}</option>
                                                <option value="avg">{{$t('config-gateway-43-03')}}</option>
                                                <option value="strong">{{$t('config-gateway-43-04')}}</option>
                                            </b-form-select>
                                        </b-form-group>

                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-44')" label-for="smf-gw-wmbus-smode">
                                            <b-input-group>
                                                <b-form-input :disabled="wmbus.protocol !== 'A'"
                                                              id="smf-gw-wmbus-smode"
                                                              type="number"
                                                              v-model.number="wmbus.sMode"
                                                              min="0"
                                                              max="6000"
                                                              step="10"
                                                              :placeholder="getPlaceholder($t('config-gateway-44'))" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="wmbus.sMode = 30">{{$t('config-gateway-48')}}</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>

                                        <b-form-group :label="$t('config-gateway-46')" label-for="smf-gw-wmbus-tmode">
                                            <b-input-group>
                                                <b-form-input :disabled="wmbus.protocol !== 'A'"
                                                              id="smf-gw-wmbus-tmode"
                                                              type="number"
                                                              v-model.number="wmbus.tMode"
                                                              min="0"
                                                              max="6000"
                                                              step="10"
                                                              :placeholder="$t('config-gateway-47')" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="wmbus.tMode = 20">{{$t('config-gateway-48')}}</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>

                                    </b-col>

                                </b-row>

                                <b-row class="p-3">
                                    <b-col md="12">
                                        <b-button type="submit" variant="primary" size="lg" v-on:click.stop="onWMbusUpdate">Submit</b-button>
                                    </b-col>
                                </b-row>

                            </b-form>

                            <b-form class="p-3">
                                <b-row>
                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-49')" label-for="smf-gw-wmbus-type">
                                            <b-form-input id="smf-gw-wmbus-type"
                                                          type="text"
                                                          v-model="wmbus.type"
                                                          readonly
                                                          :placeholder="getPlaceholder($t('config-gateway-49'))" />
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-51')" label-for="smf-gw-wmbus-id">
                                            <b-form-input id="smf-gw-wmbus-id"
                                                          type="text"
                                                          v-model="wmbus.id"
                                                          readonly
                                                          :placeholder="getPlaceholder($t('config-gateway-51'))" />
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-53')" label-for="smf-gw-wmbus-host">
                                            <b-form-input id="smf-gw-wmbus-host"
                                                          type="text"
                                                          v-model="wmbus.firmware"
                                                          readonly
                                                          :placeholder="getPlaceholder($t('config-gateway-53'))" />
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-55')" label-for="smf-gw-wmbus-hardware">
                                            <b-form-input id="smf-gw-wmbus-hardware"
                                                          type="text"
                                                          v-model="wmbus.hardware"
                                                          readonly
                                                          :placeholder="getPlaceholder($t('config-gateway-55'))" />
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                            </b-form>
                        </b-tab>

                        <!-- IEC -->
                        <b-tab no-body>
                            <template slot="title">
                                {{$t('config-gateway-57')}}
                                <b-spinner v-if="spinner.iec" type="grow" small />
                            </template>

                            <b-form @submit.prevent="" v-bind:class="{ 'bg-warning' : !iec.params.active }">

                                <b-row class="p-3">
                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-58')" label-for="smf-gw-iec-active">
                                            <b-form-checkbox switch v-model="iec.params.active" name="smf-gw-iec-active">
                                                {{ iec.params.active ? $t('config-gateway-59') : $t('config-gateway-60') }}
                                            </b-form-checkbox>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-61')" label-for="smf-gw-iec-period">
                                            <b-input-group :prepend="iec.params.loopTime / 60 + ' min'">
                                                <b-form-input id="smf-gw-iec-period"
                                                              type="number"
                                                              v-model.number="iec.params.loopTime"
                                                              min="60"
                                                              max="‭50000"
                                                              step="60"
                                                              :placeholder="$t('config-gateway-62')" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="iec.params.loopTime = 60">{{$t('config-gateway-48')}}</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-63')" label-for="smf-gw-iec-data-rate">
                                            <b-input-group>
                                                <b-form-input id="smf-gw-iec-data-rate"
                                                              type="number"
                                                              v-model.number="iec.params.maxDataRate"
                                                              min="60"
                                                              max="‭50000"
                                                              step="10"
                                                              :placeholder="$t('config-gateway-64')" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="iec.params.maxDataRate = 10240">{{$t('config-gateway-48')}}</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-65')" label-for="smf-gw-iec-min-timeout">
                                            <b-input-group :prepend="(iec.params.minTimeout / 60).toFixed(2) + ' min'">
                                                <b-form-input id="smf-gw-iec-min-timeout"
                                                              type="number"
                                                              v-model.number="iec.params.minTimeout"
                                                              min="10"
                                                              max="‭60000"
                                                              step="10"
                                                              :placeholder="$t('config-gateway-66')" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="iec.params.minTimeout = 200">{{$t('config-gateway-48')}}</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>
                                    </b-col>

                                </b-row>

                                <b-row class="p-3">

                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-67')" label-for="smf-gw-iec-auto-active">
                                            <b-form-checkbox switch v-model="iec.params.autoActivation" name="smf-gw-iec-auto-active">
                                                {{ iec.params.autoActivation ? $t('config-gateway-59') : $t('config-gateway-60') }}
                                            </b-form-checkbox>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-68')" label-for="smf-gw-iec-retries">
                                            <b-input-group>
                                                <b-form-input id="smf-gw-iec-retries"
                                                              type="number"
                                                              v-model.number="iec.params.retries"
                                                              min="0"
                                                              max="‭128"
                                                              step="1"
                                                              :placeholder="$t('config-gateway-69')" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="iec.params.retries = 3">{{$t('config-gateway-48')}}</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-70')" label-for="smf-gw-iec-protocol">
                                            <b-form-select v-model="iec.params.protocolMode" class="mb-3" disabled>
                                                <option value="A">{{$t('config-gateway-70-01')}}</option>
                                                <option value="B">{{$t('config-gateway-70-02')}}</option>
                                                <option value="C">{{$t('config-gateway-70-03')}}</option>
                                                <option value="D">{{$t('config-gateway-70-04')}}</option>
                                            </b-form-select>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group :label="$t('config-gateway-71')" label-for="smf-gw-iec-max-timeout">
                                            <b-input-group :prepend="(iec.params.maxTimeout / 60).toFixed(2) + ' min'">
                                                <b-form-input id="smf-gw-iec-max-timeout"
                                                              type="number"
                                                              v-model.number="iec.params.maxTimeout"
                                                              min="60"
                                                              max="‭60000"
                                                              step="10"
                                                              :placeholder="$t('config-gateway-72')" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="iec.params.maxTimeout = 5000">{{$t('config-gateway-48')}}</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>
                                    </b-col>

                                </b-row>

                                <b-row class="p-3">
                                    <b-table ref="iecDeviceTable"
                                             bordered
                                             striped
                                             small
                                             hover
                                             show-empty
                                             stacked="md"
                                             selectable
                                             select-mode="single"
                                             selectedVariant="info"
                                             :fields="iec.fields"
                                             :items="iec.params.devices"
                                             primary-key="8181C7930AFF"
                                             :sort-by.sync="iec.sortBy"
                                             :sort-desc.sync="iec.sortDesc"
                                             :sort-direction="iec.sortDirection"
                                             class="shadow">
                                        <!-- A virtual column -->
                                        <template v-slot:cell(index)="data">
                                            {{ data.index + 1 }}
                                        </template>

                                    </b-table>
                                </b-row>

                                <b-row class="p-3">
                                    <b-col md="12">
                                        <b-button type="submit" variant="primary" size="lg" v-on:click.stop="onIECUpdate">{{$t('config-gateway-73')}}</b-button>
                                    </b-col>
                                </b-row>

                            </b-form>
                        </b-tab>

                        <!-- Access -->
                        <b-tab no-body title="Access">
                            <b-form @submit.prevent="">
                                <b-row class="p-3">
                                    <b-col md="12">
                                        <b-button type="submit" variant="primary" v-on:click.stop="onAuthServer">Query Server</b-button>
                                    </b-col>
                                </b-row>
                                <b-row class="p-3">
                                    <b-col md="3">
                                        <b-form-input type="number"
                                                      id="smf-form-gw-access-meter"
                                                      required
                                                      v-model="access.meterNr"
                                                      placeholder="<meterId>"
                                                      maxlength="2"
                                                      v-b-popover.hover="'User ID'" title="User" />
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-input type="number"
                                                      id="smf-form-gw-access-role"
                                                      required
                                                      v-model="access.role"
                                                      placeholder="<role>"
                                                      maxlength="2"
                                                      v-b-popover.hover="'Role ID'" title="Role" />
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-input type="number"
                                                      id="smf-form-gw-access-user"
                                                      required
                                                      v-model="access.user"
                                                      placeholder="<user>"
                                                      maxlength="2"
                                                      v-b-popover.hover="'User ID'" title="User" />
                                    </b-col>
                                    <b-col md="3">
                                        <b-button type="submit" variant="primary" v-on:click.stop="onAuthUpdate">Query Meter</b-button>
                                    </b-col>
                                </b-row>

                                <b-row class="p-3">
                                    <b-col md="3">
                                        <b-button type="submit"
                                                  variant="primary"
                                                  v-b-tooltip.hover title="Clear cache and initialize it with gw/server ID"
                                                  v-on:click.stop="onProxyCacheReset">Reset Cache</b-button>
                                    </b-col>
                                    <b-col md="3">
                                        <b-button type="submit"
                                                  variant="primary"
                                                  v-b-tooltip.hover title="Fill cache with all access rights of the selected gateway"
                                                  v-on:click.stop="onProxyCacheUpdate">Update Cache</b-button>
                                    </b-col>
                                    <b-col md="3">
                                        <b-button type="submit"
                                                  variant="primary"
                                                  v-b-tooltip.hover title="Backup complete gateway configuration with setup service (not implemented yet)"
                                                  v-on:click.stop="onProxyCacheSync">Sync Cache</b-button>
                                    </b-col>
                                    <b-col md="3">
                                        <b-button type="submit"
                                                  variant="outline-primary"
                                                  v-b-tooltip.hover title="Get a list of all cached root sections"
                                                  v-on:click.stop="onProxyCacheSections">Get Sections</b-button>
                                    </b-col>
                                </b-row>

                                <b-row class="p-3">
                                    <b-col md="3">
                                        <b-button type="submit"
                                                  variant="outline-success"
                                                  v-b-tooltip.hover title="Query cache for all access rights for all meters of the selected gateway"
                                                  v-on:click.stop="onProxyCacheQuery">Query Cache</b-button>
                                    </b-col>
                                    <b-col md="9">
                                    </b-col>
                                </b-row>

                            </b-form>
                        </b-tab>

                        <!-- logs -->
                        <b-tab no-body title="Log">
                            <b-form @submit.prevent="" class="p-3">
                                <b-row>
                                    <b-col md="6">
                                        <b-form-group description="Select the time range">
                                            <b-form-radio-group buttons
                                                                button-variant="outline-primary"
                                                                v-model="tabOpLog.form.selected"
                                                                :options="tabOpLog.form.options">
                                            </b-form-radio-group>
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="6">
                                        <b-pagination v-model="tabOpLog.nav.currentPage" :total-rows="tabOpLog.nav.visibleRows" :per-page="tabOpLog.nav.perPage" class="justify-content-end" />
                                    </b-col>
                                    <b-col md="12">
                                        <opLog ref="opLog" :items="tabOpLog.data.items" :nav="tabOpLog.nav" />
                                    </b-col>
                                </b-row>
                            </b-form>
                        </b-tab>

                        <!-- Snapshots -->
                        <b-tab no-body title="Snapshots">
                            <b-form @submit.prevent="">
                                <b-row class="p-3">
                                    <b-col md="3">
                                        <b-button type="submit" 
                                                  variant="primary"
                                                  v-on:click.stop="onProxyCacheSync">Create Snapshot</b-button>
                                    </b-col>
                                    <b-col md="9">
                                        <b-form-input type="text"
                                                      id="smf-form-snapshot"
                                                      placeholder="<description>"
                                                      />
                                    </b-col>
                                </b-row>
                                <b-row class="p-3">
                                    <b-col md="12">
                                        <snapshots ref="snapshots" :items="tabSnapshots.data.items" :nav="tabSnapshots.nav" />
                                    </b-col>
                                </b-row>
                            </b-form>
                        </b-tab>

                    </b-tabs>
                </b-col>

                <b-col md="2" class="p-3 bg-light">
                    <b-form @submit.prevent="">

                        <b-form-group label="Cached Sections" label-for="smf-form-dev-enabled">
                            <b-form-checkbox-group id="sections"
                                                   stacked
                                                   v-model="sections.active"
                                                   name="smf-form-gw-sections"
                                                   :options="sections.options"
                                                   class="ml-4"
                                                   aria-label="Individual flavours" />

                        </b-form-group>

                        <!--obsolete-->
                        <!-- bg-warning -->
                        <b-alert show dismissible class="bg-warning" v-if="mode === 'production'">
                            <span style="font-weight: bold">Note:</span> No other IP-T connection can be active during the execution of the requests below.
                        </b-alert>
                        <b-form-group label="sections" label-for="smf-form-sections">

                            <template slot="label">
                                <b-form-checkbox v-model="options.allSelected"
                                                 :indeterminate="options.indeterminate"
                                                 @change="toggleAll">{{ options.allSelected ? $t('config-gateway-20') : $t('config-gateway-21') }}</b-form-checkbox>
                            </template>

                            <b-form-checkbox-group id="options"
                                                   stacked
                                                   v-model="options.selected"
                                                   name="smf-form-gw-channels"
                                                   :options="options.channels"
                                                   class="ml-4"
                                                   aria-label="Individual flavours" />
                        </b-form-group>

                    </b-form>

                </b-col>
            </b-row>

        </b-container>

        <!-- Modal Components -->
        <b-modal ref="dlgDeleteGateway"
                 :title=btnDeleteTitle
                 @ok="handleDeleteGatewayOk"
                 header-bg-variant="danger">
            <p>Proceed?</p>
        </b-modal>

        <b-modal ref="dlgRebootGateway"
                 :title=btnRebootTitle
                 @ok="handleRebootGatewayOk"
                 header-bg-variant="warning">
            <p>Proceed?</p>
        </b-modal>

    </section>

</template>

<script lang="js">

    import {webSocket} from '../mixins/web-socket'
    import opLog from '@/components/smf-table-op-log.vue'
    import snapshots from '@/components/smf-table-snapshots.vue'
    import firmware from '@/components/smf-table-firmware.vue'
    import { MESSAGE_TYPES } from '@/constants/msgTypes'
    import { SML_CODES } from '@/constants/rootCodes.js'
    import {hasPrivilegesWaitForUser} from "../mixins/privileges";
    import store from "../store";
    import {MODULES, NO_ACCESS_ROUTE, PRIVILEGES} from "../store/modules/user";
    import {generatePassword} from "@/shared/generate-password";

    let tmpGateways = [];

export default  {
    name: 'smfConfigGateway',
    props: [],
    mixins: [webSocket],
    components: {
        // eslint-disable-next-line vue/no-unused-components
        opLog, snapshots, firmware, MESSAGE_TYPES, SML_CODES
    },

    mounted() {
        this.ws_open("/smf/api/gw/v0.8");
    },

    data() {
        return {
            isBusy: false,
            busyLevel: 0,
            currentPage: 1,
            perPage: 10,
            mode: process.env.NODE_ENV,
            fields: [
          {
            key: 'index',
            class: 'text-right small text-muted'
          },
          // pk
          {
            key: 'serverId',
            label: 'Server ID',
            sortable: true
          },
          {
            key: 'name',
            label: 'Name',
            sortable: true
          },
          {
            key: 'descr',
            label: 'Description',
            sortable: true
          },
          {
            key: 'manufacturer',
            label: 'Manufacturer',
            sortable: true
          },
          {
            key: 'model',
            label: 'Model',
            sortable: true
          },
          {
            key: 'vFirmware',
            label: 'Firmware',
            sortable: true
          },
          {
            key: 'userName',
            label: 'User',
            sortable: true
          },
          {
            key: 'userPwd',
            label: 'Password',
            sortable: true
          },
          {
            key: 'online',
            label: "Online",
            formatter: (value) => {
                if (value === 0)  return '║';
                else if (value === 1)  return '⊶';
                return '⇆';
            },
            class: 'text-center',
            sortable: true
          }
        ],
        gateways:[],
        selected: [],
        sortBy: 'name',
        sortDesc: false,
        sortDirection: 'desc',
        filter: null,
        visibleRows: 0,
        //  loading state of SML data
        spinner: {
            status: false,
            ipt: false,
            firmware: false,
            memory: false,
            meters: false,
            wmbus: false,
            iec: false,
            log: false
        },
        form: {
            pk: '',
            serverId: '',
            manufacturer: 'solos::Tec',
            descr: '',
            model: '',
            vFirmware: '',
            userName: '',
            userPwd: '',
            online: 0
        },
        //  gw options
        options: {
          channels: [
              { text: 'Status Word', value: 'status-word' },
              { text: 'IP-Telemetry', value: 'ipt' },
              { text: 'Firmware', value: 'firmware' },
              { text: 'Memory', value: 'memory-usage' },
              { text: 'Meters', value: 'devices' },
              { text: 'wireless M-Bus', value: 'w-MBus' },
              { text: 'IEC', value: 'iec' },
              { text: 'Access', value: 'auth' },
              { text: 'Operation Log', value: 'log' }
              ],
            selected: [],
            allSelected: false,
            indeterminate: false,
            },
        // pure experimental - should be part of the gateway table, since this data are specific for every gateway
        sections: {
            options: [
                { text: 'IP-T', value: SML_CODES.CODE_ROOT_IPT_PARAM, disabled: true },
                { text: 'Firmware', value: SML_CODES.CODE_ROOT_DEVICE_IDENT, disabled: true },
                { text: 'Visible devices', value: SML_CODES.CODE_ROOT_VISIBLE_DEVICES, disabled: true },
                { text: 'Active devices', value: SML_CODES.CODE_ROOT_ACTIVE_DEVICES, disabled: true },
                { text: 'Wireless mbus', value: SML_CODES.CODE_IF_wMBUS, disabled: true },
                { text: 'IEC', value: SML_CODES.CODE_IF_1107, disabled: true },
                { text: 'Access', value: SML_CODES.CODE_ROOT_ACCESS_RIGHTS, disabled: true }
            ],
            // active section
            active: []
        },

        //  panel
        tabIndex: 1,

        gw : {
            status: [],
            memory : {
                mirror: 0,
                tmp: 0
          }
        },

        ipt : {
            param: [
                {
                        host: '',
                        port: 26862,
                        user: '',
                        pwd: ''
                },
                {
                        host: '',
                        port: 26862,
                        user: '',
                        pwd: ''
                }
            ],
            status: {
                host: '',
                local: 0,
                remote: 0
            }
        },

        meters: {
            values: [],
            selected: [],
            fields: [
                {
                    key: 'nr',
                    label: 'Nr',
                    sortable: true,
                    class: 'text-right small'
                },
                {
                    key: 'ident',
                    label: 'Ident',
                    sortable: true
                },
                // {
                //     key: 'meterId',
                //     label: 'Meter ID',
                //     sortable: true
                // },
                {
                    key: 'meter',
                    label: 'Meter',
                    sortable: true,
                    formatter: (value) => {
                        return value ? value.toUpperCase() : '?';
                    }
                },
                {
                    key: 'maker',
                    label: 'Maker',
                    sortable: true,
                    formatter: (value) => {
                        return (value) ? value : '-';
                    }
                },
                {
                    key: 'lastSeen',
                    label: 'Last Seen',
                    sortable: true,
                    formatter: (value) => {
                        return value.toLocaleString()
                    }
                },
                {
                    key: 'type',
                    label: 'Type',
                    sortable: true,
                    formatter: (value) => {
                        switch (value) {
                            case 0: return "M-Bus (wired)";
                            case 1: return "M-Bus (radio)";
                            case 2: return "wM-Bus";
                            case 3: return "Serial";
                            case 4: return "Gateway";
                            case 5: return "BCD";
                            case 6: return "EON";
                            case 7: return "DKE-1";
                            case 8: return "IMEI";
                            case 9: return "RWE";
                            case 10: return "DKE-2";
                            case 11: return "Switch";
                            default:
                                break;
                        }
                        return "Other";
                    }
                },
                {
                    key: 'visible',
                    label: 'Visible'
                },
                {
                    key: 'active',
                    label: 'Active'
                },
                {
                    key: 'serverId',
                    label: 'Server ID',
                    sortable: true
                },
                {
                    key: 'edit',
                    label: 'Edit'
                }
            ],
            sortBy: 'meter',
            sortDesc: false,
            sortDirection: 'desc',
            csv: ''
        },

        //  firmware
        fw: {
            values: [],
            selected: []
        },

        //  wireless M-Bus
        wmbus: {
            type: '',
            id: '',
            firmware: '',
            hardware: '',
            power: 'basic',
            reboot: 86400,
            protocol: 'S',
            active: true,
            sMode: 0,
            tMode: 0
            },

        access: {
            meterNr: 1,
            role: 3,
            user: 1,
        },

        iec: {
            params: {
                active: false,
                autoActivation: true,
                loopTime: 3600,
                maxDataRate: 10240,
                minTimeout: 200,
                maxTimeout: 5000,
                maxVar: 9,
                protocolMode: 'C',
                retries: 3,
                rs485: null,
                timeGrid: 900,
                timeSync: 14400,
                devices: []
            },
            selected: [],
            fields: [
                {
                    key: 'nr',
                    label: 'Nr',
                    sortable: true,
                    class: 'text-right small'
                },
                {
                    key: '8181C7930AFF',
                    label: 'Name',
                    sortable: true
                },
                {
                    key: '8181C7930BFF',
                    label: 'Baudrate',
                    sortable: true
                },
                {
                    key: '8181C7930CFF',
                    label: 'Address',
                    sortable: true
                },
                {
                    key: '8181C7930DFF',
                    label: 'P1',
                    sortable: false,
                    formatter: (value) => {
                        if (value)  return value;
                        return '-';
                    }
                },
                {
                    key: '8181C7930EFF',
                    label: 'W5',
                    sortable: false,
                    formatter: (value) => {
                        if (value)  return value;
                        return '-';
                    }
                }
            ],
            sortBy: '8181C7930AFF',
            sortDesc: false,
            sortDirection: 'desc'
            },
            tabOpLog: {
                data: {
                    items: []
                    //items: [{nr:1, active: true, entries: 101, period: 3, OBIS:'8181c78614ff', name:'name'}]
                },
                nav: {
                    currentPage: 1,
                    visibleRows: 0,
                    perPage: 15
                },
                form: {
                    selected: "1",
                    options: [
                        { text: "-1d", value: "1" },
                        { text: "-2d", value: "2" },
                        { text: "-3d", value: "3" },
                        { text: "-4d", value: "4" },
                        { text: "-5d", value: "5" },
                        { text: "-6d", value: "6" },
                        { text: "-7d", value: "7" },
                        { text: "All", value: "365" }
                      ]
                }
            },
            tabSnapshots: {
                data: {
                    //items: []
                    items: [{ nr: 1, utc: new Date(), serverId: '0500153B02297E', remark: 'nice description' }]
                },
                nav: {
                    currentPage: 1,
                    visibleRows: 0,
                    perPage: 5
                },
            }
        }
    },

    beforeDestroy() {
        this.ws_close();
    },

    methods: {
        ws_on_open() {
            this.gateways = [];
            this.ws_subscribe("config.gateway");
            this.ws_subscribe("table.gateway.count");
        },

        ws_on_data(obj) {
            if (obj.cmd != null) {
            // console.log('websocket received ' + obj.cmd);
                if (obj.cmd === 'update') {
                    if (obj.channel != null) {
                        console.log('update channel: ' + obj.channel);
                        if (obj.channel === MESSAGE_TYPES.getProcParameter) {
                            //console.log("section :::" + obj.section + ":::");
                            //console.log(obj.rec.values);
                            if (obj.section === SML_CODES.CLASS_OP_LOG_STATUS_WORD) {
                                //  hide loading spinner
                                this.spinner.status = false;
                                this.gw.status = [];
                                // state.variant">{{state.value}
                                if (obj.rec.values.word.FATAL_ERROR) {
                                    this.gw.status.push({ value: 'ERROR state', variant: 'danger' });
                                }
                                else {
                                    this.gw.status.push({ value: 'Ready for operation', variant: null });
                                }

                                if (obj.rec.values.word.AUTHORIZED_IPT) {
                                    this.gw.status.push({ value: 'IP-T connection established', variant: 'success' });
                                }
                                else {
                                    this.gw.status.push({ value: 'no IP-T master', variant: 'warning' });
                                }

                                if (obj.rec.values.word.OUT_OF_MEMORY) {
                                    this.gw.status.push({ value: 'out of memory', variant: 'warning' });
                                }
                                else {
                                    this.gw.status.push({ value: 'sufficient memory', variant: 'success' });
                                }

                                if (obj.rec.values.word.SERVICE_IF_AVAILABLE) {
                                    this.gw.status.push({ value: 'customer interface available', variant: null });
                                }
                                else {
                                    this.gw.status.push({ value: 'no customer interface', variant: null });
                                }

                                if (obj.rec.values.word.EXT_IF_AVAILABLE) {
                                    this.gw.status.push({ value: 'extension interface available', variant: null });
                                }
                                else {
                                    this.gw.status.push({ value: 'no extension interface', variant: null });
                                }

                                if (obj.rec.values.word.MBUS_IF_AVAILABLE) {
                                    this.gw.status.push({ value: 'wireless M-Bus interface available', variant: null });
                                }
                                else {
                                    this.gw.status.push({ value: 'no wireless M-Bus interface', variant: null });
                                }

                                if (obj.rec.values.word.PLC_AVAILABLE) {
                                    this.gw.status.push({ value: 'PLC interface available', variant: null });
                                }
                                else {
                                    this.gw.status.push({ value: 'no PLC interface', variant: null });
                                }

                                if (obj.rec.values.word.NO_TIMEBASE) {
                                    this.gw.status.push({ value: 'uncertain timebase', variant: "dark" });
                                }
                                else {
                                    this.gw.status.push({ value: 'NTP is running (Time base is secure)', variant: "success" });
                                }
                            }
                            else if (obj.section === SML_CODES.CODE_ROOT_VISIBLE_DEVICES) {
                                Object.values(obj.rec.values).forEach((e) => {
                                    //console.log(e);
                                    const lastSeenVisible = (e[SML_CODES.CURRENT_UTC] != null)
                                        ? new Date(e[SML_CODES.CURRENT_UTC].substring(0, 19))
                                        : new Date();

                                    const recVisible = {
                                        pk: e.pk[0],
                                        nr: e.nr,
                                        ident: e[SML_CODES.CODE_SERVER_ID],
                                        meter: e.serial,
                                        maker: e.maker,
                                        lastSeen: lastSeenVisible,
                                        type: e.type,
                                        visible: true,
                                        active: false,
                                        serverId: obj.rec.srv
                                    };

                                    if (obj.rec.values.type < 2) {
                                        recVisible["_rowVariant"] = "success";
                                    }
                                    console.log("visisble ", recVisible);
                                    this.meters.values.push(recVisible);

                                });
                            }
                            else if (obj.section === SML_CODES.CODE_ROOT_ACTIVE_DEVICES) {
                                //  hide loading spinner
                                this.spinner.meters = false;

                                Object.values(obj.rec.values).forEach((e) => {
                                    //console.log(e);
                                    let recActive = this.meters.values.find(meter => {
                                        //console.log('active device: compare ' + meter.ident + ' <> ' + e[SML_CODES.CODE_SERVER_ID]);
                                        if (meter.ident === e[SML_CODES.CODE_SERVER_ID]) {
                                            meter.active = true;
                                            meter.pk = obj.rec.values.pk;
                                            meter.mc = obj.rec.values.mc;
                                            return true;
                                        }
                                        return false;
                                    });

                                    //
                                    //  this meter is only active and not visible,
                                    //  therefore a new record have to be inserted
                                    //
                                    if (recActive === undefined) {
                                        var lastSeenVisible = (e[SML_CODES.CURRENT_UTC] != null)
                                            ? new Date(e[SML_CODES.CURRENT_UTC].substring(0, 19))
                                            : new Date();
                                        recActive = {
                                            nr: e.nr,
                                            ident: e[SML_CODES.CODE_SERVER_ID],
                                            meter: e.serial,
                                            maker: e.maker,
                                            lastSeen: lastSeenVisible,
                                            type: e.type,
                                            visible: false,
                                            active: true,
                                            serverId: obj.rec.srv,
                                            pk: e.pk[0],
                                            mc: e.mc
                                        };

                                        if (obj.rec.values.type < 2) {
                                            recActive["_rowVariant"] = "success";
                                        }

                                        console.log("active ", recActive);
                                        this.meters.values.push(recActive);
                                    }

                                });

                                //
                                //  update download link
                                //
                                this.meterTableComplete();
                            }
                            else if (obj.section === SML_CODES.CODE_ROOT_DEVICE_IDENT) {
                                //  hide loading spinner
                                this.spinner.firmware = false;
                                //  firmware
                                //  iterate over 8181C78206FF
                                //  this is an array of objects
                                const srv = obj.rec.values['8181C78204FF'];
                                const values = Object.values(obj.rec.values['8181C78206FF']);
                                //console.log(values);
                                values.forEach((e, idx) => {
                                    //console.log(e);
                                    const rec = {
                                        nr: idx,
                                        name: e['8181C78208FF'],
                                        version: e['818100020000'],
                                        active: e['8181C7820EFF'],
                                        srv: srv
                                    };
                                    this.fw.values.push(rec);
                                });
                            }
                            else if (obj.section === SML_CODES.CODE_ROOT_MEMORY_USAGE) {
                                //  hide loading spinner
                                this.spinner.memory = false;
                                this.gw.memory.mirror = obj.rec.values['0080800011FF'];
                                this.gw.memory.tmp = obj.rec.values['0080800012FF'];
                            }
                            else if (obj.section === SML_CODES.CODE_ROOT_W_MBUS_STATUS) {
                                this.wmbus.type = obj.rec.values['810600000100'];
                                this.wmbus.id = obj.rec.values['810600000300'];
                                this.wmbus.firmware = obj.rec.values['810600020000'];
                                this.wmbus.hardware = obj.rec.values['8106000203FF'];
                            }
                            else if (obj.section === SML_CODES.CODE_IF_wMBUS) {
                                //  hide loading spinner
                                this.spinner.wmbus = false;

                                //  radio protocol (T-mode, S-mode, S/T automatic, S/T parallel)
                                switch (obj.rec.values[SML_CODES.W_MBUS_PROTOCOL]) {
                                    case 0: this.wmbus.protocol = 'T'; break;
                                    case 1: this.wmbus.protocol = 'S'; break;
                                    case 2: this.wmbus.protocol = 'A'; break;
                                    case 3: this.wmbus.protocol = 'P'; break;
                                    default: break;
                                }
                                switch (obj.rec.values[SML_CODES.W_MBUS_POWER]) {
                                    case 0: this.wmbus.power = 'low'; break;
                                    default: this.wmbus.power = 'basic'; break;
                                }
                                //  reboot (seconds)
                                this.wmbus.reboot = obj.rec.values[SML_CODES.W_MBUS_REBOOT];
                                //  install mode
                                this.wmbus.active = obj.rec.values[SML_CODES.W_MBUS_INSTALL_MODE];
                                this.wmbus.sMode = obj.rec.values[SML_CODES.W_MBUS_MODE_S];
                                this.wmbus.tMode = obj.rec.values[SML_CODES.W_MBUS_MODE_T];
                            }
                            else if (obj.section === SML_CODES.CODE_ROOT_IPT_STATE) {
                                this.ipt.status.host = obj.rec.values['814917070000'];
                                this.ipt.status.local = obj.rec.values['81491A070000'];
                                this.ipt.status.remote = obj.rec.values['814919070000'];
                            }
                            else if (obj.section === SML_CODES.CODE_ROOT_IPT_PARAM) {
                                //console.log(obj.rec.values);
                                //  hide loading spinner
                                this.spinner.ipt = false;
                                this.ipt.param[0].host = obj.rec.values['81490D070001']['814917070001'];
                                this.ipt.param[0].port = obj.rec.values['81490D070001']['81491A070001'];
                                this.ipt.param[0].user = obj.rec.values['81490D070001']['8149633C0101'];
                                this.ipt.param[0].pwd = obj.rec.values['81490D070001']['8149633C0201'];

                                this.ipt.param[1].host = obj.rec.values['81490D070002']['814917070002'];
                                this.ipt.param[1].port = obj.rec.values['81490D070002']['81491A070002'];
                                this.ipt.param[1].user = obj.rec.values['81490D070002']['8149633C0102'];
                                this.ipt.param[1].pwd = obj.rec.values['81490D070002']['8149633C0202'];
                            }
                            else if (obj.section === SML_CODES.CODE_IF_1107) {
                                //  hide loading spinner
                                this.spinner.iec = false;

                                this.iec.params.active = obj.rec.values[SML_CODES.IF_1107_ACTIVE];
                                this.iec.params.loopTime = obj.rec.values[SML_CODES.IF_1107_LOOP_TIME];
                                this.iec.params.retries = obj.rec.values[SML_CODES.IF_1107_RETRIES];
                                this.iec.params.minTimeout = obj.rec.values[SML_CODES.IF_1107_MIN_TIMEOUT];
                                this.iec.params.maxTimeout = obj.rec.values[SML_CODES.IF_1107_MAX_TIMEOUT];
                                this.iec.params.maxDataRate = obj.rec.values[SML_CODES.IF_1107_MAX_DATA_RATE];
                                this.iec.params.rs485 = Boolean(obj.rec.values[SML_CODES.IF_1107_RS485]);
                                this.iec.params.autoActivation = obj.rec.values[SML_CODES.IF_1107_AUTO_ACTIVATION];
                                this.iec.params.timeGrid = obj.rec.values[SML_CODES.IF_1107_TIME_GRID];
                                this.iec.params.timeSync = obj.rec.values[SML_CODES.IF_1107_TIME_SYNC];
                                this.iec.params.maxVar = obj.rec.values[SML_CODES.IF_1107_MAX_VARIATION];
                                switch (obj.rec.values[SML_CODES.IF_1107_PROTOCOL_MODE]) {
                                    case 0:
                                        this.iec.params.protocolMode = 'A';
                                        break;
                                    case 1:
                                        this.iec.params.protocolMode = 'B';
                                        break;
                                    case 2:
                                        this.iec.params.protocolMode = 'C';
                                        break;
                                    case 3:
                                        this.iec.params.protocolMode = 'D';
                                        break;
                                    case 4:
                                        this.iec.params.protocolMode = 'E';
                                        break;
                                    default:
                                        this.iec.params.protocolMode = obj.rec.values[SML_CODES.IF_1107_PROTOCOL_MODE];
                                        break;
                                }
                                //  object
                                const whatIsThis = obj.rec.values['8181C79309FF'];
                                this.iec.params.devices = whatIsThis ? Array.from(whatIsThis) : [];

                            }
                            else if (obj.section === SML_CODES.CODE_ROOT_ACCESS_RIGHTS) {
                                console.log('update channel ' + obj.channel + ', section ' + obj.section);
                                console.log(obj.rec);
                            }
                            else if (obj.section === SML_CODES.CODE_DEVICE_CLASS) {
                                console.log('update channel ' + obj.channel + ' ToDo: ' + obj.section);
                            }
                            else if (obj.section === SML_CODES.DATA_MANUFACTURER) {
                                console.log('update channel ' + obj.channel + ' ToDo: ' + obj.section);
                            }
                            else if (obj.section === SML_CODES.CODE_SERVER_ID) {
                                console.log('update channel ' + obj.channel + ' ToDo: ' + obj.section);
                            }
                            else {
                                console.error('update channel ' + obj.channel + ' with unknown section ' + obj.section);

                            }
                        }
                        else if (obj.channel === MESSAGE_TYPES.getProfileList) {
                            //console.log(obj.rec.values['8181C789E2FF'] + ", size: "+ this.tabOpLog.data.items.length);
                            if (obj.section === SML_CODES.CLASS_OP_LOG) {

                                //  get timestamp
                                const utc = (obj.rec.values['010000090B00'] != null)
                                    ? new Date(obj.rec.values['010000090B00'].substring(0, 19))
                                    : new Date();

                                //  build record
                                let rec = {
                                    index: this.tabOpLog.data.items.length,
                                    status: obj.rec.values.status,
                                    event: obj.rec.values['8181C789E2FF'],
                                    peer: obj.rec.values['8181000000FF'],
                                    utc: utc,
                                    serverId: obj.rec.values['8181C78204FF'],
                                    target: obj.rec.values['8147170700FF'],
                                    //target: 'T:' + obj.rec.values.evtType + ' S:' + obj.rec.values.evtSource + ' L:' + obj.rec.values.evtLevel,
                                    pushNr: obj.rec.values['8181C78A01FF'],
                                    details: obj.rec.values['8181C78123FF']
                                };
                                this.tabOpLog.data.items.push(rec);
                                //    update pagination
                                this.tabOpLog.nav.visibleRows = this.tabOpLog.data.items.length;

                            }
                            else {
                                console.error('update channel ' + obj.channel + ' with unknown section ' + obj.section);
                            }
                        }
                        else if (obj.channel === 'attention.code') {
                            // Vue.toasted.show('ATTENTION please!');
                            if (obj.section === '8181c7c7fd00') {
                                //  OK
                                this.$toasted.global.sml_attention_ok(obj.rec.srv + " modification accepted", "info");
                            }
                            else {
                                //  error
                                // this.meters.showAttentionFailure = true;
                                this.$toasted.global.sml_attention_error(obj.rec.srv + ": " + obj.rec.values);
                            }
                            //  hide loading spinner
                            this.spinner.status = false;
                            this.spinner.ipt = false;
                            this.spinner.firmware = false;
                            this.spinner.meters = false;
                            this.spinner.wmbus = false;
                            this.spinner.iec = false;
                        }
                        else if (obj.channel === 'table.gateway.count') {
                            //  unused
                        }
                        else if (obj.channel === 'cache.reset') {
                            //console.log(obj, ' new sections');
                            this.sections.active = obj.section;
                        }
                        else if (obj.channel === 'cache.sections') {
                            console.log(obj, ' new sections');
                            this.sections.active = obj.section;

                        }
                        else if (obj.channel === 'cache.update') {
                            console.log(obj, ' cache.update');
                        }
                        else if (obj.channel === 'cache.query') {
                            console.log(obj, ' cache.query');
                        }
                       else {
                            console.error('update unknown channel ' + obj.channel);
                        }
                    }
                }
                else if (obj.cmd === 'insert') {
                    let rec = {
                        pk: obj.rec.key.pk,
                        serverId: obj.rec.data.serverId,
                        manufacturer: obj.rec.data.manufacturer,
                        descr: obj.rec.data.descr,
                        name: obj.rec.data.name,
                        model: obj.rec.data.model,
                        vFirmware: obj.rec.data.vFirmware,
                        userName: obj.rec.data.userName,
                        userPwd: obj.rec.data.userPwd,
                        online: obj.rec.data.online };

                    if (obj.rec.data.online === 1) {
                        rec["_rowVariant"] = 'success';
                    }
                    else if (obj.rec.data.online === 2) {
                        rec["_rowVariant"] = 'warning';
                    }

                    if (this.isBusy) {
                        //  bulk insert
                        tmpGateways.push(rec);
                    }
                    else {
                        //  operational insert
                        this.gateways.push(rec);
                    }

                }
                else if (obj.cmd === 'modify') {
                    //console.log('lookup gateway ' + obj.key[0]);
                    this.gateways.find(function(rec) {
                        //console.log('compare ' + obj.key[0] + ' <==> ' + rec.pk);
                        if(rec.pk === obj.key[0]) {
                            //console.log('modify record ' + rec.name);
                            if (obj.value.serverId != null) {
                                rec.serverId = obj.value.serverId;
                            }
                            else if (obj.value.manufacturer != null) {
                                rec.manufacturer = obj.value.manufacturer;
                            }
                            else if (obj.value.descr != null) {
                                rec.descr = obj.value.descr;
                            }
                            else if (obj.value.userName != null) {
                                rec.userName = obj.value.userName;
                            }
                            else if (obj.value.userPwd != null) {
                                rec.userPwd = obj.value.userPwd;
                            }
                            else if (obj.value.online != null) {
                                rec.online = obj.value.online;
                                if (obj.value.online === 1) {
                                    //  cause possibly an update problem
                                    rec["_rowVariant"] = 'success';
                                }
                                else if (obj.value.online === 2) {
                                    rec["_rowVariant"] = 'warning';
                                }
                                else {
                                    rec["_rowVariant"]  = null;
                                }
                                //  force refresh: https://github.com/bootstrap-vue/bootstrap-vue/issues/1529
                                // this.$refs.devTable.refresh();
                            }
                        }
                    });
                }
                else if (obj.cmd === 'clear') {
                    //  clear table
                    this.gateways = [];
                    this.meters.values = [];
                    this.tabOpLog.data.items = [];
                }
                else if (obj.cmd === 'delete') {
                    const idx = this.gateways.findIndex(rec => rec.pk === obj.key[0]);
                    this.gateways.splice(idx, 1);
                }
                else if (obj.cmd === 'load') {
                    //  load status
                    if (obj.show != null) {
                        this.isBusy = obj.show;
                        tmpGateways = [];
                    }
                    else if (obj.level !== 0) {
                        this.busyLevel = obj.level;
                        this.gateways = tmpGateways;
                    }
                }
                else {
                    console.log('websocket received unknown command ' + obj.cmd);
                }

                //    update pagination
                this.visibleRows = this.gateways.length;
            }
        },

        rowSelected(items) {
            this.selected = items;
            if (items.length > 0) {
                //console.log('selected ' + items[0].serverId);

                this.form.serverId = items[0].serverId;
                this.form.manufacturer = items[0].manufacturer;
                this.form.descr = items[0].descr;
                this.form.name = items[0].name;
                this.form.model = items[0].model;
                this.form.vFirmware = items[0].vFirmware;
                this.form.userName = items[0].userName;
                this.form.userPwd = items[0].userPwd;
                this.form.online = items[0].online;
                this.form.pk = items[0].pk;

                //    collect gateway requests
                //console.log(this.options.selected.length + ' options selected ');

                //
                //  1 gateway selected
                //
                if (items.length === 1) {
                    const self = this;
                    this.options.selected.forEach(option => {
                        //  channels: ['Status Word', 'Meters', 'Firmware', 'Memory', 'wireless M-Bus', 'IP-Telemtry', 'IEC'],
                        //console.log('option: ' + option);
                        if (option === 'status-word') {
                            //  810060050000
                            self.ws_submit_request(MESSAGE_TYPES.getProcParameter, SML_CODES.CLASS_OP_LOG_STATUS_WORD, [items[0].pk]);
                            self.spinner.status = true;
                        }
                        else if (option === 'devices') {
                            //gw_req_vec.push("root-visible-devices");
                            //gw_req_vec.push("root-active-devices");
                            self.ws_submit_request(MESSAGE_TYPES.getProcParameter, SML_CODES.CODE_ROOT_VISIBLE_DEVICES, [items[0].pk]);
                            self.ws_submit_request(MESSAGE_TYPES.getProcParameter, SML_CODES.CODE_ROOT_ACTIVE_DEVICES, [items[0].pk]);
                            //  clear meter table
                            self.meters.values = [];
                            self.spinner.meters = true;
                        }
                        else if (option === 'firmware') {
                            //gw_req_vec.push("root-device-id");
                            self.ws_submit_request(MESSAGE_TYPES.getProcParameter, SML_CODES.CODE_ROOT_DEVICE_IDENT, [items[0].pk]);
                            self.fw.values = []; // ? self
                            self.spinner.firmware = true;
                        }
                        else if (option === 'memory-usage') {
                            //gw_req_vec.push("root-memory-usage");
                            self.ws_submit_request(MESSAGE_TYPES.getProcParameter, SML_CODES.CODE_ROOT_MEMORY_USAGE, [items[0].pk]);
                            self.spinner.memory = true;
                        }
                        else if (option === 'w-MBus') {
                            //gw_req_vec.push("root-wMBus-status");
                            //gw_req_vec.push("IF-wireless-mbus");
                            self.ws_submit_request(MESSAGE_TYPES.getProcParameter, SML_CODES.CODE_ROOT_W_MBUS_STATUS, [items[0].pk]);
                            self.ws_submit_request(MESSAGE_TYPES.getProcParameter, SML_CODES.CODE_IF_wMBUS, [items[0].pk]);
                            self.spinner.wmbus = true;
                        }
                        else if (option === 'ipt') {
                            //gw_req_vec.push("root-ipt-state");
                            //gw_req_vec.push("root-ipt-param");
                            self.ws_submit_request(MESSAGE_TYPES.getProcParameter, SML_CODES.CODE_ROOT_IPT_PARAM, [items[0].pk]);
                            self.ws_submit_request(MESSAGE_TYPES.getProcParameter, SML_CODES.CODE_ROOT_IPT_STATE, [items[0].pk]);
                            self.spinner.ipt = true;
                        }
                        else if (option === 'iec') {
                            //gw_req_vec.push("IF-IEC-62505-21");
                            self.ws_submit_request(MESSAGE_TYPES.getProcParameter, SML_CODES.CODE_IF_1107, [items[0].pk]);
                            self.spinner.iec = true;
                        }
                        else if (option === 'log') {
                            //   SML_GetProfileList_Req
                            //  request operation log: 81 81 C7 89 E1 FF (OBIS_CLASS_OP_LOG)
                            //console.log("selected: " + this.tabOpLog.form.selected);
                            this.tabOpLog.data.items = [];
                            self.ws_submit_request(MESSAGE_TYPES.getProfileList
                                , SML_CODES.CLASS_OP_LOG
                                , [items[0].pk]
                                , {range: this.tabOpLog.form.selected * 24});   //  hours

                            self.spinner.log = true;
                        }
                    });
                }
            }
            else {
                console.log('nothing selected');
                this.form.serverId = "";
                this.form.manufacturer = null;
                this.form.descr = null;
                this.form.name = '';
                this.form.model = null;
                this.form.vFirmware = null;
                this.form.userName = null;
                this.form.userPwd = null;
                this.form.online = false;
                this.form.pk = null;
            }
        },
        meterSelected(items) {
            this.meters.selected = items;
            if (items.length > 0) {
                console.log('selected ' + items[0].ident);
            }
            else {
                //  ToDo: ...
            }
        },
        toggleAll(checked) {
            // this.options.selected = checked ? this.options.channels.slice() : []
            this.options.selected = [];
            if (checked) {
                this.options.channels.forEach(option => {
                    this.options.selected.push(option.value);
                });
            }
        },
        onGatewayUpdate(event) {
            event.preventDefault();
            // console.log('onGatewayUpdate: ' + this.form.name);
            this.ws_submit_record("modify", "config.gateway", {
                key: [this.form.pk],
                data: { serverId: this.form.serverId, manufacturer: this.form.manufacturer, userName: this.form.userName, userPwd: this.form.userPwd }
            });
        },
        onGatewayDelete(event) {
            event.preventDefault();
            console.log('onGatewayDelete: ' + this.selected.length + ' gateway(s)');
            this.$refs.dlgDeleteGateway.show();
        },
        handleDeleteGatewayOk(event) {
            event.preventDefault();
            this.selected.forEach(element => {
                this.ws_submit_key("delete", "config.gateway", { tag: [element.pk] });
            });
            this.$nextTick(() => {
                // Wrapped in $nextTick to ensure DOM is rendered before closing
                this.$refs.dlgDeleteGateway.hide();
            });
        },
        onGatewayReboot(event) {
            event.preventDefault();
            //console.log('onGatewayReboot: ' + this.selected.length + ' gateway(s)');
            this.$refs.dlgRebootGateway.show();
        },
        handleRebootGatewayOk(event) {
            event.preventDefault();
            this.selected.forEach(element => {
                //this.ws_submit_command("com:sml", "set.proc.param", [element.pk], [], ["reboot"]);
                //console.log('ws_submit_request: ' + MESSAGE_TYPES.setProcParameter + ' gateway:' + element.pk);
                this.ws_submit_request(MESSAGE_TYPES.setProcParameter, SML_CODES.CODE_REBOOT, [element.pk]);
            });
            this.$nextTick(() => {
                // Wrapped in $nextTick to ensure DOM is rendered before closing
                this.$refs.dlgRebootGateway.hide();
            });
        },

        generatePassword(event) {
            event.preventDefault();
            this.form.userPwd = generatePassword();
        },

        generatePasswordIPT(event, element) {
            event.preventDefault();
            this.ipt.param[element].pwd = generatePassword();
        },

        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.visibleRows = filteredItems.length;
            this.currentPage = 1
        },

        onIPTUpdate(event)   {
            event.preventDefault();
            this.ws_submit_request(MESSAGE_TYPES.setProcParameter,
                SML_CODES.CODE_ROOT_IPT_PARAM,
                [this.form.pk],
                { ipt: this.ipt.param });
        },
        onMeterDelete(item) {
            this.ws_submit_request(MESSAGE_TYPES.setProcParameter,
                SML_CODES.CODE_DELETE_DEVICE,
                [this.form.pk],
                { nr: item.nr, meter: item.ident });
        },
        onMeterActivate(item) {
            if (item.active) {
                this.ws_submit_request(MESSAGE_TYPES.setProcParameter,
                    SML_CODES.CODE_DEACTIVATE_DEVICE,
                    [this.form.pk],
                    { nr: item.nr, meter: item.ident });
            }
            else {
                this.ws_submit_request(MESSAGE_TYPES.setProcParameter,
                    SML_CODES.CODE_ACTIVATE_DEVICE,
                    [this.form.pk],
                    { nr: item.nr, meter: item.ident });
            }
        },
        onMeterEdit(item) {
           this.$router.push({ name: 'smfConfigMeter', params: { meterPk: item.pk }});
        },
        onWMbusUpdate() {
            this.ws_submit_request(MESSAGE_TYPES.setProcParameter,
                SML_CODES.CODE_IF_wMBUS,
                [this.form.pk],
                { wmbus: this.wmbus });

        },
        onIECUpdate() {
            this.ws_submit_request(MESSAGE_TYPES.setProcParameter,
                SML_CODES.CODE_IF_1107,
                [this.form.pk],
                { iec: this.iec.params });
        },

        onAuthUpdate() {
            console.log("onAuthUpdate: " + this.access.meterNr);
            this.ws_submit_request(MESSAGE_TYPES.getProcParameter,
                SML_CODES.CODE_ROOT_ACCESS_RIGHTS,
                [this.form.pk],
                //  path is [role, user, meterID]
                { serverId: this.form.serverId, path: [this.access.role, this.access.user, this.access.meterNr] });
        },
        onAuthServer() {
            console.log("onAuthServer: " + this.access.meterNr);
            this.ws_submit_request(MESSAGE_TYPES.getProcParameter,
                SML_CODES.CODE_ROOT_ACCESS_RIGHTS,
                [this.form.pk],
                //  path is [role, user, meterID]
                { serverId: this.form.serverId, path: [] });
        },

        meterTableComplete() {
            let csv = 'Ident;Meter;Maker;ServerId\n';
            this.meters.values.forEach(function(row) {
                //console.log(row.ident);
                csv += row.ident + ';' + row.meter + ';' + row.maker + ';' + row.serverId + '\n';
            });
            const data = new Blob([csv]);
            this.meters.csv = URL.createObjectURL(data);
        },
        btnEditStatus(mc) {
            // console.log("btnEditStatus " , mc);
            if (typeof mc == 'undefined') return true;
            return (mc.length > 2) && mc.startsWith("MC");
        },
        getPlaceholder(str) {
            //console.log(str);
            return "<" + str + ">";
        },
        onProxyCacheReset() {
            this.ws_proxy("cache.reset", [this.form.pk], [SML_CODES.CLASS_OP_LOG_STATUS_WORD, SML_CODES.CODE_ROOT_IPT_PARAM, SML_CODES.CODE_ROOT_ACCESS_RIGHTS, SML_CODES.CODE_ROOT_ACTIVE_DEVICES, SML_CODES.CODE_ROOT_VISIBLE_DEVICES]);
        },
        onProxyCacheSections() {
            this.ws_proxy("cache.sections", [this.form.pk]);
        },
        onProxyCacheUpdate() {
            this.ws_proxy("cache.update", [this.form.pk], [SML_CODES.CODE_ROOT_ACCESS_RIGHTS]);
        },
        onProxyCacheSync() {
            //  create snapshot of current configuration
            this.ws_proxy("cache.sync", [this.form.pk], [SML_CODES.CODE_ROOT_ACCESS_RIGHTS, SML_CODES.CODE_ROOT_ACTIVE_DEVICES, SML_CODES.CODE_ROOT_VISIBLE_DEVICES]);
        },
        onProxyCacheQuery() {
            this.ws_proxy("cache.query", [this.form.pk], [SML_CODES.CODE_ROOT_ACCESS_RIGHTS]);
        }

   },

    computed: {
        tableCaption() {
            return this.selected.length + "/" + this.gateways.length + " item(s) selected";
        },
        btnUpdateTitle() {
            if(this.selected.length > 0) {
                return "Update " + this.selected[0].name;
            }
            return "Update";
        },
        btnDeleteTitle() {
            if (this.selected.length === 0)  {
                return "Delete";
            }
            else if(this.selected.length === 1) {
                return "Delete " + this.selected[0].name;
            }
            return "Delete " + this.selected.length + " gateway(s)";
        },
        btnRebootTitle() {
            if (this.selected.length === 0)  {
                return "Reboot";
            }
            else if(this.selected.length === 1) {
                return "Reboot " + this.selected[0].name;
            }
            return "Reboot " + this.selected.length + " gateway(s)";
        },
        btnEdit() {
            return "Edit";
        },
        isRecordSelected() {
            return this.selected.length !== 0;
        },
        isRecordNew() {
            if (this.selected.length !== 0) {
                return this.form.name !== this.selected[0].name;
            }
            return this.form.name.length > 0;
        },
        serverIdValidation() {
            if (this.form.serverId == null) return false;
            const rex = /[0-9A-Fa-f]{14}/g;   //  test for hexadecimal string with 14 characters
            return rex.test(this.form.serverId);
        },
        wmbusRebootPrep() {
            if (this.wmbus.reboot > 3600) {
                return (this.wmbus.reboot / 3600).toFixed(2) + ' h';
            }
            else if (this.wmbus.reboot > 60) {
                return (this.wmbus.reboot / 60).toFixed(2) + ' min';
            }
            else if (this.wmbus.reboot === 0) {
                return 'OFF';
            }
            return this.wmbus.reboot + ' sec.';
        },
        linkMeterDownloadTitle() {
            if(this.selected.length > 0) {
                return "Download " + this.meters.values.length + " meter records from gateway " + this.selected[0].name;
            }
            return "Download meter table";
        }
    },

    watch: {
        'options.selected'(newVal) {
            //console.log('selected ' + newVal + ", " + oldVal);
            if (newVal.length === 0) {
                this.options.indeterminate = false;
                this.options.allSelected = false;
            } else if (newVal.length === this.options.channels.length) {
                this.options.indeterminate = false;
                this.options.allSelected = true;
            }
            else {
                this.options.indeterminate = true;
                this.options.allSelected = false;
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        hasPrivilegesWaitForUser(store, MODULES.CONFIG_GATEWAY, PRIVILEGES.VIEW).then((result) => {
            next( result ? true: NO_ACCESS_ROUTE);
        });
    }
}
</script>

<style scoped lang="css">
/* div.tab-content {
        min-height: 320rem;
    } */
</style>
