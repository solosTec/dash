<template lang="html">

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
                <b-col md="10" class="p-3 shadow">
                    <b-tabs card v-model="tabIndex">

                        <b-tab title="Configuration" active>
                            <b-form v-on:submit.prevent>

                                <b-row>
                                    <b-col md="10" class="shadow">

                                        <b-row>
                                            <b-col md="6">
                                                <b-form-group label="Server ID" label-for="smf-form-gw-server">
                                                    <b-form-input id="smf-form-gw-server"
                                                                  type="text"
                                                                  v-model="form.serverId"
                                                                  :state="serverIdValidation"
                                                                  required
                                                                  placeholder="<Server ID>"
                                                                  maxlength="14" />
                                                    <b-form-invalid-feedback :state="serverIdValidation">
                                                        A server ID must be 14 characters long hexadecimal string
                                                    </b-form-invalid-feedback>
                                                    <b-form-valid-feedback :state="serverIdValidation">
                                                        OK
                                                    </b-form-valid-feedback>
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group label="Manufacturer" label-for="smf-form-gw-manufacturer">
                                                    <b-form-input id="smf-form-gw-manufacturer"
                                                                  type="text"
                                                                  v-model="form.manufacturer"
                                                                  required
                                                                  placeholder="<Manufacturer>" />
                                                </b-form-group>
                                            </b-col>
                                        </b-row>

                                        <b-row>
                                            <b-col md="6">
                                                <b-form-group label="User" label-for="smf-form-gw-server">
                                                    <b-form-input id="smf-form-gw-user"
                                                                  type="text"
                                                                  v-model="form.userName"
                                                                  required
                                                                  placeholder="<User Name>"
                                                                  maxlength="14" />
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group label="Password" label-for="smf-form-gw-pwd">
                                                    <b-input-group>
                                                        <b-form-input id="smf-form-gw-pwd"
                                                                      type="text"
                                                                      v-model="form.userPwd"
                                                                      required
                                                                      placeholder="<User Password>" />
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

                        <b-tab no-body>
                            <template slot="title">
                                Status
                                <b-spinner v-if="spinner.status" type="grow" small />
                            </template>
                            <b-list-group>
                                <template v-for="state in gw.status">
                                    <b-list-group-item :variant="state.variant" :key="state.variant">{{state.value}}</b-list-group-item>
                                </template>
                            </b-list-group>
                        </b-tab>

                        <b-tab>
                            <template slot="title">
                                IP-T
                                <b-spinner v-if="spinner.ipt" type="grow" small />
                            </template>
                            <b-form v-on:submit.prevent>

                                <b-row>
                                    <b-col md="6" class="border">

                                        <b-row>
                                            <b-col md="12" class="d-flex justify-content-start">
                                                <h2>&#9312;</h2>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group label="Host" label-for="smf-gw-ipt-host-0">
                                                    <b-form-input id="smf-gw-ipt-host-0"
                                                                  type="text"
                                                                  v-model="ipt.param[0].host"
                                                                  required
                                                                  v-b-popover.hover="'Specify a known hostname or an IPv4/IPv6 address'" title="Primary IP-T Master"
                                                                  placeholder="<IP-T Master>" />
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group label="Name" label-for="smf-gw-ipt-name-0">
                                                    <b-form-input id="smf-gw-ipt-name-0"
                                                                  type="text"
                                                                  v-model="ipt.param[0].user"
                                                                  required
                                                                  placeholder="<IP-T Name>" />
                                                </b-form-group>
                                            </b-col>
                                        </b-row>

                                        <b-row>
                                            <b-col md="6">
                                                <b-form-group label="Port" label-for="smf-gw-ipt-port-0">
                                                    <b-input-group>
                                                        <b-form-input id="smf-gw-ipt-port-0"
                                                                      type="number"
                                                                      v-model.number="ipt.param[0].port"
                                                                      required
                                                                      min="1024"
                                                                      max="‭65535‬"
                                                                      placeholder="<IP Port>" />
                                                        <b-input-group-append>
                                                            <b-button variant="info" v-on:click.stop="ipt.param[0].port = 26862">Default</b-button>
                                                        </b-input-group-append>
                                                    </b-input-group>
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group label="Password" label-for="smf-gw-ipt-pwd-0">
                                                    <b-input-group>
                                                        <b-form-input id="smf-gw-ipt-pwd-0"
                                                                      type="text"
                                                                      v-model="ipt.param[0].pwd"
                                                                      required
                                                                      placeholder="<Password>" />
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
                                                <b-form-group label="Host" label-for="smf-gw-ipt-host-1">
                                                    <b-form-input id="smf-gw-ipt-host-1"
                                                                  type="text"
                                                                  v-model="ipt.param[1].host"
                                                                  required
                                                                  v-b-popover.hover="'Specify a known hostname or an IPv4/IPv6 address'" title="Secondary IP-T Master"
                                                                  placeholder="<IP-T Master>" />
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group label="Name" label-for="smf-gw-ipt-name-1">
                                                    <b-form-input id="smf-gw-ipt-name-1"
                                                                  type="text"
                                                                  v-model="ipt.param[1].user"
                                                                  required
                                                                  placeholder="<IP-T Name>" />
                                                </b-form-group>
                                            </b-col>
                                        </b-row>

                                        <b-row>
                                            <b-col md="6">
                                                <b-form-group label="Port" label-for="smf-gw-ipt-port-1">
                                                    <b-input-group>
                                                        <b-form-input id="smf-gw-ipt-port-1"
                                                                      type="number"
                                                                      v-model.number="ipt.param[1].port"
                                                                      required
                                                                      min="1024"
                                                                      max="‭65535‬"
                                                                      placeholder="<IP Port>" />
                                                        <b-input-group-append>
                                                            <b-button variant="info" v-on:click.stop="ipt.param[1].port = 26863">Default</b-button>
                                                        </b-input-group-append>
                                                    </b-input-group>
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="6">
                                                <b-form-group label="Password" label-for="smf-gw-ipt-pwd-1">
                                                    <b-input-group>
                                                        <b-form-input id="smf-gw-ipt-pwd-1"
                                                                      type="text"
                                                                      v-model="ipt.param[1].pwd"
                                                                      required
                                                                      placeholder="<Password>" />
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
                                        <b-form-group label="Host" label-for="smf-gw-ipt-host">
                                            <b-form-input id="smf-gw-ipt-host"
                                                          type="text"
                                                          v-model="ipt.status.host"
                                                          v-b-popover.hover="'Current IP address'" title="Hostname" placement="top"
                                                          readonly
                                                          placeholder="<IP-T Master>" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Local Port" label-for="smf-gw-ipt-port-local">
                                            <b-form-input id="smf-gw-ipt-port-local"
                                                          type="number"
                                                          v-model.number="ipt.status.local"
                                                          readonly
                                                          min="1024"
                                                          max="‭65535‬"
                                                          placeholder="<IP Port>" />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="3">
                                        <b-form-group label="Remote Port" label-for="smf-gw-ipt-port-remote">
                                            <b-form-input id="smf-gw-ipt-port-remote"
                                                          type="number"
                                                          v-model.number="ipt.status.remote"
                                                          readonly
                                                          min="1024"
                                                          max="‭65535‬"
                                                          placeholder="<IP Port>" />
                                        </b-form-group>
                                    </b-col>
                                </b-row>

                            </b-form>
                        </b-tab>

                        <!-- Firmware -->
                        <b-tab no-body>
                            <template slot="title">
                                Firmware
                                <b-spinner v-if="spinner.firmware" type="grow" small />
                            </template>
                            <!-- table -->
                            <b-table ref="firmwareTable"
                                     bordered
                                     striped
                                     small
                                     hover
                                     show-empty
                                     stacked="md"
                                     selectable
                                     select-mode="single"
                                     selectedVariant="info"
                                     :fields="fw.fields"
                                     :items="fw.values"
                                     primary-key="ident"
                                     :sort-by.sync="fw.sortBy"
                                     :sort-desc.sync="fw.sortDesc"
                                     :sort-direction="fw.sortDirection"
                                     class="shadow">
                                <!-- :busy="isBusy"
                                :current-page="meters.currentPage"
                                :per-page="meters.perPage" -->
                                <!-- <template slot="active" slot-scope="row">
                                    <b-button size="sm" @click="onMeterActivate(row.item, row.index, $event.target)">
                                        {{ row.item.active ? '✔ Deactivate' : '✖ Activate' }}
                                    </b-button>
                                </template> -->
                            </b-table>
                        </b-tab>

                        <!-- Memory -->
                        <b-tab title="">
                            <template slot="title">
                                Memory
                                <b-spinner v-if="spinner.memory" type="grow" small />
                            </template>
                            <b-row>
                                <b-col md="6">
                                    <b-card-text>Memory (mirror)</b-card-text>
                                    <b-progress class="mt-2" height="2rem" :value="gw.memory.mirror" show-value />
                                </b-col>
                                <b-col md="6">
                                    <b-card-text>Memory (temp)</b-card-text>
                                    <b-progress class="mt-2" height="2rem" :value="gw.memory.tmp" show-value />
                                </b-col>
                            </b-row>
                        </b-tab>

                        <!-- Meters -->
                        <b-tab no-body>
                            <template slot="title">
                                Meters
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

                                <template slot="visible" slot-scope="row">
                                    <b-button size="sm"
                                              v-if="row.item.visible"
                                              @click="onMeterDelete(row.item, row.index, $event.target)">✔ Delete</b-button>
                                </template>

                                <template slot="active" slot-scope="row">
                                    <b-button size="sm"
                                              @click="onMeterActivate(row.item, row.index, $event.target)">{{ row.item.active ? '✔ Deactivate' : '✖ Activate' }}</b-button>
                                </template>
                            </b-table>
                            <div>
                                <b-link :href="meters.csv" download="meters.csv" type="text/csv">{{linkMeterDownloadTitle}}</b-link>
                            </div>
                        </b-tab>

                        <!-- wireless M-Bus -->
                        <b-tab no-body>
                            <template slot="title">
                                wireless M-Bus
                                <b-spinner v-if="spinner.wmbus" type="grow" small />
                            </template>

                            <b-form v-on:submit.prevent class="p-3 shadow">

                                <b-row>

                                    <b-col md="3" class="d-flex justify-content-center">
                                        <b-form-group label="Radio Protocol">
                                            <b-form-radio-group id="smf-gw-wmbus-protocol"
                                                                buttons
                                                                button-variant="outline-primary"
                                                                stacked
                                                                v-model="wmbus.protocol"
                                                                name="smf-gw-wmbus-protocol">
                                                <b-form-radio value="T">T2-Mode</b-form-radio>
                                                <b-form-radio value="S">S2-Mode</b-form-radio>
                                                <b-form-radio value="A" v-b-popover.hover="'Alternating Mode - requires to specify receiving timer parameters'" title="T2/S2 Automatic">T2/S2 Automatic</b-form-radio>
                                                <b-form-radio value="P">Parallel</b-form-radio>
                                            </b-form-radio-group>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group label="Installation Mode" label-for="smf-gw-wmbus-active">
                                            <b-form-checkbox switch v-model="wmbus.active" name="smf-gw-wmbus-active">
                                                {{ wmbus.active ? "Active" : "Inactive" }}
                                            </b-form-checkbox>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group label="Automatic Reboot (sec)" label-for="smf-gw-wmbus-reboot">
                                            <b-input-group :prepend="wmbusRebootPrep">
                                                <b-form-input id="smf-gw-wmbus-reboot"
                                                              type="number"
                                                              v-model.number="wmbus.reboot"
                                                              min="0"
                                                              max="‭60000"
                                                              step="60"
                                                              placeholder="<Reboot>" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="wmbus.reboot = 86400">Default</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>

                                        <b-form-group label="Transmission Power" label-for="smf-gw-wmbus-power">
                                            <b-form-select v-model="wmbus.power" class="mb-3" disabled>
                                                <option value="low">Low</option>
                                                <option value="basic">Basic</option>
                                                <option value="avg">Average</option>
                                                <option value="strong">Strong</option>
                                            </b-form-select>
                                        </b-form-group>

                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group label="Receiving Time S2 Mode (sec)" label-for="smf-gw-wmbus-smode">
                                            <b-input-group>
                                                <b-form-input :disabled="wmbus.protocol != 'A'"
                                                              id="smf-gw-wmbus-smode"
                                                              type="number"
                                                              v-model.number="wmbus.sMode"
                                                              min="0"
                                                              max="6000"
                                                              step="10"
                                                              placeholder="<Receiving Time S2 Mode>" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="wmbus.sMode = 30">Default</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>

                                        <b-form-group label="Receiving Time T2 Mode (sec)" label-for="smf-gw-wmbus-tmode">
                                            <b-input-group>
                                                <b-form-input :disabled="wmbus.protocol != 'A'"
                                                              id="smf-gw-wmbus-tmode"
                                                              type="number"
                                                              v-model.number="wmbus.tMode"
                                                              min="0"
                                                              max="6000"
                                                              step="10"
                                                              placeholder="<Receiving Time T2 Mode>" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="wmbus.tMode = 20">Default</b-button>
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
                                        <b-form-group label="Adapter Type / Manufacturer" label-for="smf-gw-wmbus-type">
                                            <b-form-input id="smf-gw-wmbus-type"
                                                          type="text"
                                                          v-model="wmbus.type"
                                                          readonly
                                                          placeholder="<Adapter Type>" />
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group label="Adapter ID" label-for="smf-gw-wmbus-id">
                                            <b-form-input id="smf-gw-wmbus-id"
                                                          type="text"
                                                          v-model="wmbus.id"
                                                          readonly
                                                          placeholder="<Adapter ID>" />
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group label="Firmware Version" label-for="smf-gw-wmbus-host">
                                            <b-form-input id="smf-gw-wmbus-host"
                                                          type="text"
                                                          v-model="wmbus.firmware"
                                                          readonly
                                                          placeholder="<Firmware>" />
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group label="Hardware Version" label-for="smf-gw-wmbus-hardware">
                                            <b-form-input id="smf-gw-wmbus-hardware"
                                                          type="text"
                                                          v-model="wmbus.hardware"
                                                          readonly
                                                          placeholder="<Hardware>" />
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                            </b-form>
                        </b-tab>

                        <!-- IEC -->
                        <b-tab no-body>
                            <template slot="title">
                                IEC
                                <b-spinner v-if="spinner.iec" type="grow" small />
                            </template>

                            <b-form v-on:submit.prevent v-bind:class="{ 'bg-warning' : !iec.params.active }">

                                <b-row class="p-3">
                                    <b-col md="3">
                                        <b-form-group label="Enabled" label-for="smf-gw-iec-active">
                                            <b-form-checkbox switch v-model="iec.params.active" name="smf-gw-iec-active">
                                                {{ iec.params.active ? "On" : "Off" }}
                                            </b-form-checkbox>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group label="Data Readout Period (sec)" label-for="smf-gw-iec-period">
                                            <b-input-group :prepend="iec.params.loopTime / 60 + ' min'">
                                                <b-form-input id="smf-gw-iec-period"
                                                              type="number"
                                                              v-model.number="iec.params.loopTime"
                                                              min="60"
                                                              max="‭50000"
                                                              step="60"
                                                              placeholder="<Data Readout Period>" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="iec.params.loopTime = 60">Default</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group label="Maximum Data Rate" label-for="smf-gw-iec-data-rate">
                                            <b-input-group>
                                                <b-form-input id="smf-gw-iec-data-rate"
                                                              type="number"
                                                              v-model.number="iec.params.maxDataRate"
                                                              min="60"
                                                              max="‭50000"
                                                              step="10"
                                                              placeholder="<Maximum Data Rate>" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="iec.params.maxDataRate = 10240">Default</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group label="Min. Timeout (msec)" label-for="smf-gw-iec-min-timeout">
                                            <b-input-group :prepend="(iec.params.minTimeout / 60).toFixed(2) + ' min'">
                                                <b-form-input id="smf-gw-iec-min-timeout"
                                                              type="number"
                                                              v-model.number="iec.params.minTimeout"
                                                              min="10"
                                                              max="‭60000"
                                                              step="10"
                                                              placeholder="<Data Readout Period>" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="iec.params.minTimeout = 200">Default</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>
                                    </b-col>

                                </b-row>

                                <b-row class="p-3">

                                    <b-col md="3">
                                        <b-form-group label="Automatic Activation" label-for="smf-gw-iec-auto-active">
                                            <b-form-checkbox switch v-model="iec.params.autoActivation" name="smf-gw-iec-auto-active">
                                                {{ iec.params.autoActivation ? "On" : "Off" }}
                                            </b-form-checkbox>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group label="Retries" label-for="smf-gw-iec-retries">
                                            <b-input-group>
                                                <b-form-input id="smf-gw-iec-retries"
                                                              type="number"
                                                              v-model.number="iec.params.retries"
                                                              min="0"
                                                              max="‭128"
                                                              step="1"
                                                              placeholder="<Retries>" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="iec.params.retries = 3">Default</b-button>
                                                </b-input-group-append>
                                            </b-input-group>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group label="Protocol" label-for="smf-gw-iec-protocol">
                                            <b-form-select v-model="iec.params.protocolMode" class="mb-3" disabled>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                            </b-form-select>
                                        </b-form-group>
                                    </b-col>

                                    <b-col md="3">
                                        <b-form-group label="Max. Timeout (msec)" label-for="smf-gw-iec-max-timeout">
                                            <b-input-group :prepend="(iec.params.maxTimeout / 60).toFixed(2) + ' min'">
                                                <b-form-input id="smf-gw-iec-max-timeout"
                                                              type="number"
                                                              v-model.number="iec.params.maxTimeout"
                                                              min="60"
                                                              max="‭60000"
                                                              step="10"
                                                              placeholder="<Data Readout Period>" />
                                                <b-input-group-append>
                                                    <b-button variant="info" v-on:click.stop="iec.params.maxTimeout = 5000">Default</b-button>
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
                                        <template slot="index" slot-scope="data">
                                            {{ data.index + 1 }}
                                        </template>

                                    </b-table>
                                </b-row>

                                <b-row class="p-3">
                                    <b-col md="12">
                                        <b-button type="submit" variant="primary" size="lg" v-on:click.stop="onIECUpdate">Submit</b-button>
                                    </b-col>
                                </b-row>

                            </b-form>
                        </b-tab>

                    </b-tabs>
                </b-col>

                <b-col md="2" class="p-3 bg-light">
                    <b-form v-on:submit.prevent>
                        <!-- bg-warning -->
                        <b-alert show dismissible class="bg-warning" v-if="mode === 'production'">
                            <span style="font-weight: bold">Note:</span> No other IP-T connection can be active during the execution of the requests below.
                        </b-alert>


                        <b-form-group label="LABEL" label-for="smf-form-dev-enabled">

                            <template slot="label">
                                <b-form-checkbox v-model="options.allSelected"
                                                 :indeterminate="options.indeterminate"
                                                 @change="toggleAll">{{ options.allSelected ? 'Un-select All' : 'Select All' }}</b-form-checkbox>
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

import {webSocket} from '../../services/web-socket.js'

export default  {
    name: 'smfConfigGateway',
    props: [],
    mixins: [webSocket],

    mounted() {
        this.ws_open("/smf/api/gw/v0.7");
        //this.options.selected = process.env.NODE_ENV !== 'production';
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
            formatter: (value, key, item) => {
                if (value == 0)  return '║';
                else if (value == 1)  return '⊶';
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
            iec: false
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
              { text: 'IEC', value: 'iec' }
              ],
          selected: [],
          allSelected: false,
          indeterminate: false
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
                    formatter: (value, key, item) => {
                        return value.toUpperCase();
                    }
                },
                {
                    key: 'maker',
                    label: 'Maker',
                    sortable: true
                },
                {
                    key: 'lastSeen',
                    label: 'Last Seen',
                    sortable: true,
                    formatter: (value, key, item) => {
                        return value.toLocaleString()
                    }
                },
                {
                    key: 'type',
                    label: 'Type',
                    sortable: true,
                    formatter: (value, key, item) => {
                        switch (value) {
                            case 0: return "wM-Bus";
                            case 1: return "serial";
                            case 2: return "gateway";
                            case 3: return "BCD";
                            case 4: return "EON";
                            case 5: return "DKE-1";
                            case 6: return "IMEI";
                            case 7: return "RWE";
                            case 8: return "DKE-2";
                            case 9: return "wM-Bus";
                            default:
                                break;
                        }
                        return "other";
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
                // { key: 'actions', label: 'Actions' },
                {
                    key: 'serverId',
                    label: 'Server ID',
                    sortable: true
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
            selected: [],
            fields: [
                {
                    key: 'nr',
                    label: 'Nr',
                    sortable: true,
                    class: 'text-right small'
                },
                {
                    key: 'name',
                    label: 'Name',
                    sortable: true
                },
                {
                    key: 'version',
                    label: 'Version',
                    sortable: true
                },
                {
                    key: 'active',
                    label: 'Active',
                    sortable: true,
                    formatter: (value, key, item) => {
                        if (value)  return '✔';
                        return '✖';
                    },
                    class: 'text-center'
                },
                {
                    key: 'srv',
                    label: 'Server',
                    sortable: true
                },
            ],
            sortBy: 'nr',
            sortDesc: false,
            sortDirection: 'desc',
            currentPage: 1,
            perPage: 50
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
                    key: 'index',
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
                }
            ],
            sortBy: '8181C7930AFF',
            sortDesc: false,
            sortDirection: 'desc'
        }
      }
    },

    beforeDestroy() {
        this.ws_close();
    },

    methods: {
        ws_on_open(path) {
            this.gateways = [];
            this.ws_subscribe("config.gateway");
            this.ws_subscribe("table.gateway.count");
        },

        ws_on_data(obj) {
            if (obj.cmd != null) {
            // console.log('websocket received ' + obj.cmd);
                if (obj.cmd == 'update') {
                    if (obj.channel != null) {
                        // console.log('update channel ' + obj.channel);
                        if (obj.channel == 'get.proc.param') {
                            if (obj.section == 'op-log-status-word') {
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
                                    this.gw.status.push({ value: 'NTP is running', variant: "success" });
                                }
                                //  hide loading spinner
                                this.spinner.status = false;
                            }
                            else if (obj.section == 'root-visible-devices') {
                                // console.log('visible device: ' + obj.rec.values.ident);
                                var lastSeenVisible = (obj.rec.values.timestamp != null)
                                            ? new Date(obj.rec.values.timestamp.substring(0, 19))
                                            : new Date();
                                //  obj.rec.values.number, obj.rec.values.ident, obj.rec.values.meterId, obj.rec.values.meter, obj.rec.values.maker, lastSeen, obj.rec.values.class, obj.rec.srv, obj.rec.values.type, true, false, obj.rec.gw
                                var recVisible = {
                                    nr: obj.rec.values.number,
                                    ident: obj.rec.values.ident,
                                    meterId: obj.rec.values.meterId,
                                    meter: obj.rec.values.meter,
                                    maker: obj.rec.values.maker,
                                    lastSeen: lastSeenVisible,
                                    type: obj.rec.values.type,
                                    visible: true,
                                    active: false,
                                    serverId: obj.rec.srv };

                                if (obj.rec.values.type < 2) {
                                    recVisible["_rowVariant"] = "success";
                                }

                                this.meters.values.push(recVisible);
                            }
                            else if (obj.section == 'root-active-devices') {
                                // console.log('active device: ' + obj.rec.values.ident + ' #' + obj.rec.values.number);
                                var recActive = this.meters.values.find(meter => {
                                    if (meter.ident == obj.rec.values.ident) {
                                        meter.active = true;
                                        return true;
                                    }
                                    return false;
                                });
                                // console.log('found: ' + recActive);
                                if (recActive === undefined) {
                                    var lastSeenActive = (obj.rec.values.timestamp != null)
                                                ? new Date(obj.rec.values.timestamp.substring(0, 19))
                                                : new Date();
                                    recActive = {
                                        nr: obj.rec.values.number,
                                        ident: obj.rec.values.ident,
                                        meterId: obj.rec.values.meterId,
                                        meter: obj.rec.values.meter,
                                        maker: obj.rec.values.maker,
                                        lastSeen: lastSeenActive,
                                        type: obj.rec.values.type,
                                        visible: false,
                                        active: true,
                                        serverId: obj.rec.srv };

                                    if (obj.rec.values.type < 2) {
                                        recActive["_rowVariant"] = "success";
                                    }

                                    this.meters.values.push(recActive);
                                }
                                //  hide loading spinner
                                this.spinner.meters = false;
                                this.meterTableComplete();
                            }
                            else if (obj.section == 'root-device-id') {
                                //  firmware
                                var rec = {
                                    nr: obj.rec.values.number,
                                    name: obj.rec.values.firmware,
                                    version: obj.rec.values.version,
                                    active: obj.rec.values.active,
                                    srv: obj.rec.srv};
                                this.fw.values.push(rec);

                                //  hide loading spinner
                                this.spinner.firmware = false;
                            }
                            else if (obj.section == 'root-memory-usage') {
                                this.gw.memory.mirror = obj.rec.values.mirror;
                                this.gw.memory.tmp = obj.rec.values.tmp;

                                //  hide loading spinner
                                this.spinner.memory = false;
                            }
                            else if (obj.section == 'root-wMBus-status') {
                                this.wmbus.type = obj.rec.values.manufacturer;
                                this.wmbus.id = obj.rec.values.id;
                                this.wmbus.firmware = obj.rec.values.firmware;
                                this.wmbus.hardware = obj.rec.values.hardware;
                            }
                            else if (obj.section == 'IF-wireless-mbus') {
                                switch (obj.rec.values.protocol) {
                                    case 0: this.wmbus.protocol = 'T'; break;
                                    case 1: this.wmbus.protocol = 'S'; break;
                                    case 2: this.wmbus.protocol = 'A'; break;
                                    case 3: this.wmbus.protocol = 'P'; break;
                                    default: break;
                                }
                                switch (obj.rec.values.power) {
                                    case 0: this.wmbus.power = 'low'; break;
                                    default: this.wmbus.power = 'basic'; break;
                                }
                                this.wmbus.reboot = obj.rec.values.reboot;
                                this.wmbus.active = (obj.rec.values.installMode != 0);
                                this.wmbus.sMode = obj.rec.values.sMode;
                                this.wmbus.tMode = obj.rec.values.tMode;

                                //  hide loading spinner
                                this.spinner.wmbus = false;
                            }
                            else if (obj.section == 'root-ipt-state') {
                                this.ipt.status.host = obj.rec.values.address;
                                this.ipt.status.local = obj.rec.values.local;
                                this.ipt.status.remote = obj.rec.values.remote;
                            }
                            else if (obj.section == 'root-ipt-param') {
                                this.ipt.param[obj.rec.values.idx - 1].host = obj.rec.values.address;
                                this.ipt.param[obj.rec.values.idx - 1].port = obj.rec.values.local;
                                this.ipt.param[obj.rec.values.idx - 1].user = obj.rec.values.name;
                                this.ipt.param[obj.rec.values.idx - 1].pwd = obj.rec.values.pwd;
                                //  hide loading spinner
                                this.spinner.ipt = false;
                            }
                            else if (obj.section == 'IF-IEC-62505-21') {
                                this.iec.params.active = obj.rec.values.active;
                                this.iec.params.autoActivation = obj.rec.values.autoActivation;
                                this.iec.params.loopTime = obj.rec.values.loopTime;
                                this.iec.params.maxDataRate = obj.rec.values.maxDataRate;
                                this.iec.params.maxTimeout = obj.rec.values.maxTimeout;
                                this.iec.params.maxVar = obj.rec.values.maxVar;
                                this.iec.params.minTimeout = obj.rec.values.minTimeout;
                                this.iec.params.protocolMode = obj.rec.values.protocolMode;
                                this.iec.params.retries = obj.rec.values.retries;
                                this.iec.params.rs485 = obj.rec.values.rs485;
                                this.iec.params.timeGrid = obj.rec.values.timeGrid;
                                this.iec.params.timeSync = obj.rec.values.timeSync;
                                this.iec.params.devices = obj.rec.values.devices;

                                //  hide loading spinner
                                this.spinner.iec = false;
                            }
                            else {
                                console.log('update channel ' + obj.channel + ' with unknown section ' + obj.section);

                            }
                        }
                        else if (obj.channel == 'attention.code') {
                            // Vue.toasted.show('ATTENTION please!');
                            if (obj.section == '8181c7c7fd00') {
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
                    }
                }
                else if (obj.cmd == 'insert') {
                    var rec = {
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

                    if (obj.rec.data.online == 1) {
                        rec["_rowVariant"] = 'success';
                    }
                    else if (obj.rec.data.online == 2) {
                        rec["_rowVariant"] = 'warning';
                    }

                    this.gateways.push(rec);
                }
                else if (obj.cmd == 'modify') {
                    console.log('lookup gateway ' + obj.key);
                    this.gateways.find(function(rec) {
                        if(rec.pk == obj.key) {
                            console.log('modify record ' + rec.name);
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
                                if (obj.value.online == 1) {
                                    rec._rowVariant = 'success';
                                }
                                else if (obj.value.online == 2) {
                                    rec._rowVariant = 'warning';
                                }
                                else {
                                    rec._rowVariant = null;
                                }
                                //  force refresh: https://github.com/bootstrap-vue/bootstrap-vue/issues/1529
                                // this.$refs.devTable.refresh();
                            }
                        }
                    });
                }
                else if (obj.cmd == 'clear') {
                    //  clear table
                    this.gateways = [];
                }
                else if (obj.cmd == 'delete') {
                    var idx = this.gateways.findIndex(rec => rec.pk == obj.key);
                    console.log('delete index ' + idx);
                    this.gateways.splice(idx, 1);
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
                else {
                    console.log('websocket received unknown command ' + obj.cmd);
                }

                //    update pagination
                this.visibleRows = this.gateways.length;
            }
        },

        rowSelected(items) {
            this.selected = items
            if (items.length > 0) {
                // console.log('selected ' + items[0].serverId);
                // console.log(items.length + ' rows selected ');

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
                console.log(this.options.selected.length + ' options selected ');

                var gw_req_vec = [];
                var self = this;
                this.options.selected.forEach(option => {
                    //  channels: ['Status Word', 'Meters', 'Firmware', 'Memory', 'wireless M-Bus', 'IP-Telemtry', 'IEC'],
                    console.log('option: ' + option);
                    if (option == 'status-word') {
                        gw_req_vec.push("op-log-status-word");
                        self.spinner.status = true;
                    }
                    else if (option == 'devices') {
                        gw_req_vec.push("root-visible-devices");
                        gw_req_vec.push("root-active-devices");
                        //  clear meter table
                        this.meters.values = [];
                        self.spinner.meters = true;
                    }
                    else if (option == 'firmware') {
                        gw_req_vec.push("root-device-id");
                        this.fw.values = [];
                        self.spinner.firmware = true;
                    }
                    else if (option == 'memory-usage') {
                        gw_req_vec.push("root-memory-usage");
                        self.spinner.memory = true;
                    }
                    else if (option == 'w-MBus') {
                        gw_req_vec.push("root-wMBus-status");
                        gw_req_vec.push("IF-wireless-mbus");
                        self.spinner.wmbus = true;
                    }
                    else if (option == 'ipt') {
                        gw_req_vec.push("root-ipt-state");
                        gw_req_vec.push("root-ipt-param");
                        self.spinner.ipt = true;
                    }
                    else if (option == 'iec') {
                        //  81 81 C7 93 00 FF
                        gw_req_vec.push("IF-IEC-62505-21");
                        // gw_req_vec.push("root-iec-param");
                        self.spinner.iec = true;
                    }
                });


                //  send request to gateway(s)
                if (gw_req_vec.length > 0) {
                    items.forEach(item => {
                        this.ws_submit_command("com:sml", "get.proc.param", [item.pk], [], gw_req_vec);
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
            console.log('onGatewayReboot: ' + this.selected.length + ' gateway(s)');
            this.$refs.dlgRebootGateway.show();
        },
        handleRebootGatewayOk(event) {
            event.preventDefault();
            this.selected.forEach(element => {
                this.ws_submit_command("com:sml", "set.proc.param", [element.pk], [], ["reboot"]);
            });
            this.$nextTick(() => {
                // Wrapped in $nextTick to ensure DOM is rendered before closing
                this.$refs.dlgRebootGateway.hide();
            });
        },

        generatePassword(event) {
            event.preventDefault();
            let charSet = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!';
            this.form.userPwd = "";
            // this.form[element] = '';
            for(let idx = 0; idx < 8; idx++) {
                this.form.userPwd += charSet.charAt(Math.floor(Math.random() * charSet.length));
            }
        },

        generatePasswordIPT(event, element) {
            event.preventDefault();
            let charSet = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!';
            // this.form.userPwd = "";
            this.ipt.param[element].pwd = '';
            for(let idx = 0; idx < 8; idx++) {
                this.ipt.param[element].pwd  += charSet.charAt(Math.floor(Math.random() * charSet.length));
            }
        },

        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.visibleRows = filteredItems.length
            this.currentPage = 1
        },

        onIPTUpdate(event)   {
            event.preventDefault();
            // console.log('onIPTUpdate: ' + this.form.name);
            this.ws_submit_command("com:sml",
                "set.proc.param",
                [this.form.pk],
                [{ ipt: this.ipt.param }],
                ["root-ipt-param"]);
        },
        onMeterDelete(item, index, button) {
            // alert("delete: " + item.ident);
            this.ws_submit_command("com:sml",
                "set.proc.param",
                [this.form.pk],
                [
                    { nr: item.nr },
                    { meter: item.meter },
                    { meterId: item.meterId }
                ],
                ["delete"]);
        },
        onMeterActivate(item, index, button) {
            if (item.active) {
                this.ws_submit_command("com:sml",
                    "set.proc.param",
                    [this.form.pk],
                    [
                        { nr: item.nr },
                        { meter: item.meter },
                        { meterId: item.meterId }
                    ],
                    ["deactivate"]);
            }
            else {
                this.ws_submit_command("com:sml",
                    "set.proc.param",
                    [this.form.pk],
                    [
                        { nr: item.nr },
                        { meter: item.meter },
                        { meterId: item.meterId }
                    ],
                    ["activate"]);
            }
        },
        onWMbusUpdate() {
            this.ws_submit_command("com:sml",
                "set.proc.param",
                [this.form.pk],
                [{ wmbus: this.wmbus }],
                ["IF-wireless-mbus"]);

        },
        onIECUpdate() {
            // alert("onIECUpdate: " + this.form.serverId);
            this.ws_submit_command("com:sml",
                "set.proc.param",
                [this.form.pk],
                [{ iec: this.iec.params }],
                ["IF-IEC-62505-21"]);
        },

        meterTableComplete() {
            var csv = 'Ident;Meter;Maker;ServerId\n';
            this.meters.values.forEach(function(row) {
                console.log(row.ident);
                csv += row.ident + ';' + row.meter + ';' + row.maker + ';' + row.serverId + '\n';
            });
            var data = new Blob([csv]);
            this.meters.csv = URL.createObjectURL(data);
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
            if (this.selected.length == 0)  {
                return "Delete";
            }
            else if(this.selected.length == 1) {
                return "Delete " + this.selected[0].name;
            }
            return "Delete " + this.selected.length + " gateway(s)";
        },
        btnRebootTitle() {
            if (this.selected.length == 0)  {
                return "Reboot";
            }
            else if(this.selected.length == 1) {
                return "Reboot " + this.selected[0].name;
            }
            return "Reboot " + this.selected.length + " gateway(s)";
        },
        isRecordSelected() {
            return this.selected.length != 0;
        },
        isRecordNew() {
            if (this.selected.length != 0) {
                return this.form.name != this.selected[0].name;
            }
            return this.form.name.length > 0;
        },
        serverIdValidation() {
            if (this.form.serverId == null) return false;
            var rex = /[0-9A-Fa-f]{14}/g;   //  test for hexadecimal string with 14 characters
            return rex.test(this.form.serverId);
        },
        wmbusRebootPrep() {
            if (this.wmbus.reboot > 3600) {
                return (this.wmbus.reboot / 3600).toFixed(2) + ' h';
            }
            else if (this.wmbus.reboot > 60) {
                return (this.wmbus.reboot / 60).toFixed(2) + ' min';
            }
            else if (this.wmbus.reboot == 0) {
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
        'options.selected'(newVal, oldVal) {
            console.log('selected ' + newVal + ", " + oldVal);
            if (newVal.length === 0) {
                this.options.indeterminate = false
                this.options.allSelected = false
            } else if (newVal.length === this.options.channels.length) {
                this.options.indeterminate = false
                this.options.allSelected = true
            }
            else {
                this.options.indeterminate = true
                this.options.allSelected = false
            }
        }
    }
}
</script>

<style scoped lang="css">
/* div.tab-content {
        min-height: 320rem;
    } */
</style>
