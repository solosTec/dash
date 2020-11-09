<template lang="html">
  <section class="smf-config-meter">
    <template>
      <div>
        <vue-headful
          description="SMF dashboard"
          keywords="SMF, solosTec"
          title="smf :: config meters"
        />
      </div>
    </template>

    <b-jumbotron
      :header="$t('header-meter')"
      :lead="$t('lead-meter', { count: this.meters.length })"
      fluid
    />

    <b-container fluid>
      <b-row>
        <b-col md="6">
          <b-form-group
            :label="$t('tbl-filter')"
            class="mb-0"
            label-cols-sm="3"
          >
            <b-input-group>
              <b-form-input v-model="filter" :placeholder="$t('tbl-search')" />
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">
                  {{ $t("action-del") }}
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col md="6">
          <b-form-row>
            <smf-row-count-selector
              v-model="perPage"
              class="col"
              store-key="meter"
            />
            <b-pagination
              v-model="currentPage"
              :per-page="perPage"
              :total-rows="visibleRows"
              class="justify-content-end"
            />
          </b-form-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <!-- table -->
          <b-table
            ref="meterTable"
            :busy="isBusy"
            :current-page="currentPage"
            :fields="fields"
            :filter="filter"
            :items="meters"
            :per-page="perPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            bordered
            class="shadow"
            hover
            primary-key="pk"
            select-mode="range"
            selectable
            selectedVariant="info"
            show-empty
            small
            stacked="md"
            striped
            @filtered="onFiltered"
            @row-selected="rowSelected"
          >
            <!-- caption slot -->
            <template slot="table-caption">
              {{ tableCaption }}
            </template>

            <!-- A virtual column -->
            <template v-slot:cell(index)="data">
              {{ data.index + 1 + perPage * (currentPage - 1) }}
            </template>

            <!-- loading slot -->
            <div slot="table-busy" class="text-center text-danger">
              <strong>Loading... {{ busyLevel }}%</strong>
            </div>
          </b-table>
        </b-col>
      </b-row>

      <!-- details -->
      <b-row>
        <b-col class="p-3 shadow" md="12">
          <div v-if="selected.length === 0">{{ $t("config-meter-26") }}</div>
          <b-tabs
            v-if="selected.length > 0"
            ref="tabs"
            v-model="tabIndex"
            card
            pills
            @input="tabSelected"
          >
            <b-tab
              :smf-context="smfContext.configuration"
              active
              :title="$t('config-meter-01')"
            >
              <b-form @:submit.prevent="">
                <b-row>
                  <b-col md="6">
                    <b-form-group
                      :description="$t('config-meter-08')"
                      :label="$t('config-meter-07')"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-meter-ident"
                        v-model="form.ident"
                        maxlength="22"
                        placeholder="<Ident>"
                        required
                        type="text"
                      />
                    </b-form-group>
                    <b-form-group
                      :description="$t('config-meter-10')"
                      :label="$t('config-meter-09')"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-meter-meter"
                        v-model="form.meter"
                        placeholder="<Meter>"
                        readonly
                        type="text"
                      />
                    </b-form-group>
                    <b-form-group
                      :description="$t('config-meter-12')"
                      :label="$t('config-meter-11')"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-meter-code"
                        v-model="form.code"
                        maxlength="48"
                        pattern="[A-Z]{2}[a-zA-Z0-9]{17,46}"
                        placeholder="<Metering Code>"
                        required
                        type="text"
                      />
                    </b-form-group>
                    <b-form-group
                      :description="$t('config-meter-14')"
                      :label="$t('config-meter-13')"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-meter-maker"
                        v-model="form.maker"
                        placeholder="<Manufacturer>"
                        type="text"
                      />
                    </b-form-group>
                    <b-form-group
                      :description="$t('config-meter-27')"
                      :label="$t('config-meter-15')"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-meter-item"
                        v-model="form.item"
                        placeholder="<Item>"
                        type="text"
                      />
                    </b-form-group>
                    <b-form-group
                      description="Update meter configuration"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-button
                        id="smf-form-meter-update"
                        type="submit"
                        variant="info"
                        v-on:click.stop="onMeterUpdate"
                        >{{ btnUpdateTitle }}
                      </b-button>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group
                      :description="$t('config-meter-17')"
                      :label="$t('config-meter-16')"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-meter-fw"
                        v-model="form.fw"
                        placeholder="<Firmware>"
                        type="text"
                      />
                    </b-form-group>
                    <b-form-group
                      :description="$t('config-meter-29')"
                      :label="$t('config-meter-28')"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-meter-param"
                        v-model="form.protocol"
                        placeholder="<Protocol>"
                        type="text"
                      />
                    </b-form-group>
                    <b-form-group
                      :description="$t('config-meter-21')"
                      :label="$t('config-meter-20')"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-meter-factory-nr"
                        v-model="form.factoryNr"
                        placeholder="<Factory Number>"
                        type="text"
                      />
                    </b-form-group>
                    <b-form-group
                      :description="$t('config-meter-23')"
                      :label="$t('config-meter-22')"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-meter-class"
                        v-model="form.mClass"
                        placeholder="<Metrological Class>"
                        type="text"
                      />
                    </b-form-group>
                    <b-form-group
                      :description="$t('config-meter-25')"
                      :label="$t('config-meter-24')"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-meter-tom"
                        v-model="form.tom"
                        placeholder="<Time of Manufactoring>"
                        type="date"
                      />
                    </b-form-group>
                    <b-form-group
                      description="Delete meter configuration"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-button
                        id="smf-form-meter-delete"
                        type="submit"
                        variant="danger"
                        v-on:click.stop="onMeterDelete"
                        >{{ btnDeleteTitle }}
                      </b-button>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-form>
            </b-tab>

            <b-tab
              :smf-context="smfContext.location"
              :title="$t('config-meter-30')"
            >
              <b-form @:submit.prevent="">
                <b-row>
                  <b-col md="6">
                    <b-form-group
                      description="..."
                      label="Country"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-location-country"
                        v-model="location.country"
                        maxlength="32"
                        placeholder="<Country>"
                        required
                        type="text"
                      />
                    </b-form-group>

                    <b-form-group
                      description="street, city"
                      label="Address"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-location-address"
                        v-model="location.address"
                        maxlength="64"
                        placeholder="<Address>"
                        required
                        type="text"
                      />
                    </b-form-group>

                    <b-form-group
                      :description="location.lat + '°'"
                      label="Latitude"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-location-lat"
                        v-model="location.lat"
                        type="range"
                        min="-90"
                        max="90"
                        step="0.001"
                      />
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group
                      description="..."
                      label="Region"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-location-region"
                        v-model="location.region"
                        maxlength="32"
                        placeholder="<Region>"
                        required
                        type="text"
                      />
                    </b-form-group>

                    <b-form-group
                      description="..."
                      label="Description"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-location-descr"
                        v-model="location.descr"
                        maxlength="128"
                        placeholder="<Description>"
                        required
                        type="text"
                      />
                    </b-form-group>

                    <b-form-group
                      :description="location.long + '°'"
                      label="Longitude"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-input
                        id="smf-form-location-long"
                        v-model="location.long"
                        type="range"
                        min="-180"
                        max="180"
                        step="0.001"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-form>
            </b-tab>

            <b-tab :smf-context="smfContext.access" no-body>
              <template slot="title">
                {{ $t("config-meter-02") }}
                <b-spinner v-if="spinner.meter" small type="grow" />
              </template>

              <b-form class="p-3" @:submit.prevent="">
                <b-row>
                  <b-col md="9">
                    <b-form-group
                      description="cryptographic public key"
                      label="Public Key"
                      label-cols-lg="3"
                      label-cols-sm="4"
                      label-for="smf-form-meter-pubkey"
                    >
                      <b-form-input
                        id="smf-form-meter-pubkey"
                        v-model="tabMeter.data.pubKey"
                        placeholder="<Public Key>"
                        type="text"
                      />
                    </b-form-group>
                    <b-form-group
                      label="AES Key"
                      label-cols-lg="3"
                      label-cols-sm="4"
                      label-for="smf-form-meter-aeskey"
                    >
                      <b-form-input
                        id="smf-form-meter-aeskey"
                        v-model="tabMeter.data.aesKey"
                        :state="aesKeyValidation"
                        maxlength="32"
                        placeholder="<AES Key (128 Bit)>"
                        type="text"
                      />

                      <b-form-invalid-feedback :state="aesKeyValidation">
                        An AES key must be 32 characters long hexadecimal
                        string.
                      </b-form-invalid-feedback>
                      <b-form-valid-feedback :state="aesKeyValidation">
                        OK
                      </b-form-valid-feedback>
                    </b-form-group>
                    <b-form-group
                      description="meter login name"
                      label="User Name"
                      label-cols-lg="3"
                      label-cols-sm="4"
                      label-for="smf-form-meter-user"
                    >
                      <b-form-input
                        id="smf-form-meter-user"
                        v-model="tabMeter.data.user"
                        placeholder="<User Name>"
                        type="text"
                      />
                    </b-form-group>
                    <b-form-group
                      description="meter login password"
                      label="Password"
                      label-cols-lg="3"
                      label-cols-sm="4"
                      label-for="smf-form-meter-last-pwd"
                    >
                      <b-input-group>
                        <b-form-input
                          id="smf-form-meter-last-pwd"
                          v-model="tabMeter.data.pwd"
                          placeholder="<Password>"
                          type="text"
                        />
                        <b-input-group-append>
                          <b-button
                            v-b-tooltip.hover
                            title="Generate password"
                            variant="info"
                            v-on:click.stop="generatePassword"
                            >&#x21ba;
                          </b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group>
                      <b-button
                        :disabled="!isOnline"
                        type="submit"
                        variant="info"
                        v-on:click.stop="onParameterUpdate"
                        >{{ btnUpdateTitle }}
                      </b-button>
                    </b-form-group>
                  </b-col>
                </b-row>

                <b-row class="pt-2">
                  <b-col md="12">
                    <b-button v-b-toggle.sidebar-footer
                      >Show Meter Status
                    </b-button>
                    <b-sidebar
                      id="sidebar-footer"
                      aria-label="Sidebar with custom footer"
                      no-header
                      shadow="true"
                    >
                      <template v-slot:footer="{ hide }">
                        <div
                          class="d-flex bg-dark text-light align-items-center px-3 py-2"
                        >
                          <strong class="mr-auto">Meter Status</strong>
                          <b-button size="sm" @click="hide">Close</b-button>
                        </div>
                      </template>
                      <div class="px-3 py-2">
                        <b-form-group
                          label="Device Class"
                          label-for="smf-form-device-class"
                        >
                          <b-form-input
                            id="smf-form-device-class"
                            v-model="tabMeter.data.devClass"
                            placeholder="<Device Class>"
                            readonly
                            type="text"
                          />
                        </b-form-group>
                        <b-form-group
                          label="Manufacturer"
                          label-for="smf-form-meter-maker-2"
                        >
                          <b-form-input
                            id="smf-form-meter-maker-2"
                            v-model="tabMeter.data.maker"
                            placeholder="<Manufacturer>"
                            readonly
                            type="text"
                          />
                        </b-form-group>
                        <b-form-group
                          label="Status"
                          label-for="smf-form-meter-status"
                        >
                          <b-form-input
                            id="smf-form-meter-status"
                            v-model="tabMeter.data.status"
                            placeholder="<Status Information>"
                            readonly
                            type="number"
                          />
                        </b-form-group>
                        <b-form-group
                          label="Bitmask"
                          label-for="smf-form-meter-bitmask"
                        >
                          <b-form-input
                            id="smf-form-meter-bitmask"
                            v-model="tabMeter.data.bitmask"
                            placeholder="<Bitmask>"
                            readonly
                            type="text"
                          />
                        </b-form-group>
                        <b-form-group
                          label="Interval (millisec.)"
                          label-for="smf-form-meter-interval"
                        >
                          <b-form-input
                            id="smf-form-meter-interval"
                            v-model="tabMeter.data.interval"
                            placeholder="<Time between two data sets>"
                            readonly
                            type="number"
                          />
                        </b-form-group>
                        <b-form-group
                          label="Last Record"
                          label-for="smf-form-meter-last-record"
                        >
                          <b-form-input
                            id="smf-form-meter-last-record"
                            v-model="tabMeter.data.lastRecord"
                            placeholder="<Last Record>"
                            readonly
                            type="datetime"
                          />
                        </b-form-group>
                      </div>
                    </b-sidebar>
                  </b-col>
                </b-row>
              </b-form>
            </b-tab>

            <b-tab
              :disabled="selected[0].online === 0"
              :smf-context="smfContext.gateway"
            >
              <template slot="title">
                Gateway
                <b-spinner v-if="spinner.readout" small type="grow" />
              </template>

              <b-form @:submit.prevent="">
                <b-row>
                  <b-col md="6">
                    <b-form-group
                      label="Ident"
                      label-for="smf-form-meter-ident-a"
                    >
                      <b-form-input
                        id="smf-form-meter-ident-a"
                        v-model="form.ident"
                        maxlength="22"
                        placeholder="<Ident>"
                        readonly
                        type="text"
                      />
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group label="Gateway" label-for="smf-form-meter-gw">
                      <b-form-input
                        id="smf-form-meter-gw"
                        v-model="form.serverId"
                        placeholder="<Ident>"
                        readonly
                        type="text"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="6">
                    <!-- table -->
                    <b-table
                      ref="readoutTable"
                      :busy="isBusy"
                      :current-page="readout.currentPage"
                      :fields="readout.fields"
                      :items="readout.values"
                      :per-page="readout.perPage"
                      :sort-by.sync="readout.sortBy"
                      :sort-desc.sync="readout.sortDesc"
                      :sort-direction="readout.sortDirection"
                      bordered
                      class="shadow"
                      hover
                      primary-key="obis"
                      select-mode="single"
                      selectable
                      selectedVariant="info"
                      show-empty
                      small
                      stacked="md"
                      striped
                      @row-selected="rowSelected"
                    >
                      <!-- A custom formatted column descr -->
                      <template v-slot:cell(obis)="data">
                        <span
                          v-b-popover.hover="
                            data.item.value + ' ' + getUnitName(data.item.unit)
                          "
                          :title="data.value | toRegisterName"
                          >{{ data.item.obis }}</span
                        >
                      </template>
                    </b-table>
                  </b-col>
                </b-row>
              </b-form>
            </b-tab>

            <b-tab
              :disabled="selected[0].online === 0"
              :smf-context="smfContext.pushOperation"
              no-body
            >
              <template slot="title">
                {{ $t("config-meter-04") }}
                <b-spinner v-if="spinner.push" small type="grow" />
              </template>
              <b-form class="p-3" @:submit.prevent="">
                <b-row>
                  <b-col md="12">
                    <pushTargets
                      ref="pushTargets"
                      :items="tabPush.data.items"
                    />
                  </b-col>
                </b-row>
              </b-form>
            </b-tab>

            <b-tab
              :disabled="selected[0].online === 0"
              :smf-context="smfContext.dataMirror"
              no-body
            >
              <template slot="title">
                {{ $t("config-meter-05") }}
                <b-spinner v-if="spinner.mirror" small type="grow" />
              </template>
              <b-form class="p-3" @:submit.prevent="">
                <b-row>
                  <b-col md="12">
                    <dataMirror
                      ref="dataMirror"
                      :items="tabDataMirror.data.items"
                    />
                  </b-col>
                </b-row>
              </b-form>
            </b-tab>

            <b-tab :smf-context="smfContext.brokerMode" no-body>
              <template slot="title">
                Broker Mode
                <b-spinner v-if="spinner.broker" small type="grow" />
              </template>
              <b-form class="p-3" @:submit.prevent="">
                <b-row>
                  <b-col md="6">
                    <b-form-group
                      description="IEC broker state"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-checkbox size="lg" switch
                        >IEC Broker
                      </b-form-checkbox>
                    </b-form-group>
                    <b-form-group
                      description="M-Bus broker state"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-form-checkbox size="lg" switch
                        >M-Bus Broker
                      </b-form-checkbox>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group
                      description="Add to or remove from IEC broker"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-button
                        id="smf-form-meter-broker-1"
                        type="submit"
                        variant="secondary"
                        v-on:click.stop="onBrokerUpdate('iec')"
                        >Apply
                      </b-button>
                    </b-form-group>
                    <b-form-group
                      description="Add to or remove from M-Bus broker"
                      label-cols-lg="3"
                      label-cols-sm="4"
                    >
                      <b-button
                        id="smf-form-meter-broker-2"
                        type="submit"
                        variant="secondary"
                        v-on:click.stop="onBrokerUpdate('mbus')"
                        >Apply
                      </b-button>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-form>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>

      <!-- Modal Component -->
      <b-modal
        ref="dlgDeleteMeter"
        :title="btnDeleteTitle"
        centered
        header-bg-variant="danger"
        @ok="handleDeleteMeterOk"
      >
        <p>Proceed?</p>
      </b-modal>
    </b-container>
  </section>
</template>

<script lang="ts">
import { webSocket } from "@/mixins/web-socket";
import { MESSAGE_REQUEST, MESSAGE_RESPONSE } from "@/constants/msgTypes";
import { SML_CODES } from "@/constants/rootCodes";
import dataMirror from "@/components/smf-table-data-mirror.vue";
import pushTargets from "@/components/smf-table-push-targets.vue";
import { hasPrivilegesWaitForUser } from "@/mixins/privileges";
import store from "../store";
import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "@/store/modules/user";
import { generatePassword } from "@/shared/generate-password";
import mixins from "vue-typed-mixins";
import Vue from "vue";
import { BTabs } from "bootstrap-vue";

let tmpMeters: any[] = [];

const getUnitName = (code: number): string | number => {
  switch (code) {
    case 9:
      return "°C";
    case 13:
      return "m³";
    case 19:
      return "L";
    case 27:
      return "W";
    case 30:
      return "Wh";
    case 38:
      return "Ω";
    default:
      break;
  }
  return code;
};

export default mixins(webSocket, Vue).extend({
  name: "smfConfigMeter",
  props: [],
  mixins: [webSocket],
  components: {
    dataMirror,
    pushTargets
  },

  mounted() {
    this.ws_open("/smf/api/meter/v0.8");
  },

  data() {
    return {
      getUnitName,
      isBusy: false,
      busyLevel: 0,
      currentPage: 1,
      perPage: 10,
      fields: [
        {
          key: "index",
          class: "text-right small text-muted"
        },
        {
          key: "ident",
          label: "Ident",
          sortable: true
        },
        {
          key: "meter",
          label: "Meter",
          sortable: true
        },
        {
          key: "protocol",
          label: "Protocol",
          sortable: true
        },
        {
          key: "maker",
          label: "Maker",
          sortable: true
        },
        {
          key: "tom",
          label: "TOM",
          sortable: true,
          formatter: (value: any) => {
            return value.toLocaleDateString();
          }
        },
        {
          key: "serverId",
          label: "Server ID",
          sortable: true
        },
        {
          key: "online",
          label: "Online",
          sortable: true,
          formatter: (value: number) => {
            switch (value) {
              case 0:
                return "║";
              case 1:
                return "⊶";
              case 2:
                return "↔";
              case 3:
                return "🔄";
              case -1:
                return "∅";
              default:
                break;
            }
            return "⛔";
          },
          class: "text-center"
        }
      ],
      meters: [] as any[],
      selected: [] as any[],
      sortBy: "name",
      sortDesc: false,
      sortDirection: "desc",
      filter: null as string | null,
      visibleRows: 0,
      //  panel
      tabIndex: 1,
      form: {
        pk: "",
        ident: "",
        meter: "",
        code: "",
        maker: "",
        tom: "1970-01-01",
        fw: "",
        vParam: "",
        factoryNr: "0000",
        item: "",
        mClass: "---",
        protocol: "∇",
        serverId: "",
        gwKey: ""
      },
      location: {
        country: "",
        region: "",
        address: "",
        descr: "",
        lat: 49.500499,
        long: 8.500619,
        proj: "GPS"
      },
      smfContext: {
        configuration: "configuration",
        location: "location",
        access: "access",
        gateway: "gateway",
        pushOperation: "pushOperations",
        dataMirror: "dataMirror",
        brokerMode: "brokerMode"
      },
      readout: {
        values: [] as any[],
        selected: [] as any[],
        fields: [
          {
            key: "obis",
            label: "OBIS",
            sortable: true
          },
          {
            key: "value",
            label: "Value",
            sortable: true
          },
          {
            key: "unit",
            label: "Unit",
            sortable: true,
            formatter: (value: number) => {
              return getUnitName(value);
            }
          },
          {
            key: "time",
            label: "Time",
            sortable: true
          },
          {
            key: "server",
            label: "Server",
            sortable: true
          }
        ],
        sortBy: "obis",
        sortDesc: false,
        sortDirection: "desc",
        currentPage: 1,
        perPage: 20
      },
      tabMeter: {
        data: {
          devClass: "-",
          maker: "-",
          status: 0,
          bitmask: "00 00",
          interval: 0,
          lastRecord: "1964-04-20" as string | null,
          pubKey: "",
          aesKey: "",
          user: "",
          pwd: "",
          timeRef: 0
        }
      },
      tabPush: {
        data: {
          //items: [{nr:1, interval: 15, delay: 101, OBIS:'8181c78611ff', name:'water@solosTec'}]
          items: [] as any[]
        }
      },
      tabDataMirror: {
        data: {
          items: [] as any[]
          // items: [{nr:1, active: true, entries: 101, period: 3, OBIS:'8181c78614ff', name:'name'}]
        }
      },
      //  loading state of SML data
      spinner: {
        readout: false,
        meter: false,
        push: false,
        mirror: false,
        broker: false
      }
    };
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
    ws_on_data(obj: any) {
      if (obj.cmd != null) {
        //console.log('websocket received command ' + obj.cmd);
        if (obj.cmd === "insert") {
          const tom = new Date(obj.rec.data.tom.substring(0, 19));
          //console.log('insert meter ' + obj.rec.key.pk + " - "+ obj.rec.data.ident);
          let rec: any = {
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
            protocol: obj.rec.data.protocol,
            serverId: obj.rec.data.serverId,
            gwKey: obj.rec.data.gw,
            online: obj.rec.data.online
          };

          if (obj.rec.data.online === 1) {
            rec["_rowVariant"] = "success";
          } else if (obj.rec.data.online === 2) {
            rec["_rowVariant"] = "warning";
          } else if (obj.rec.data.online === 3) {
            rec["_rowVariant"] = "secondary ";
          }

          if (this.isBusy) {
            //  bulk insert
            tmpMeters.push(rec);
          } else {
            //  operational insert
            this.meters.push(rec);
          }
        } else if (obj.cmd === "modify") {
          //console.log('lookup meter ' + obj.key);
          const self = this;
          this.meters.find(function(rec) {
            if (rec.pk === obj.key[0]) {
              //console.log('modify meter ' + rec.ident);
              if (obj.value.ident != null) {
                rec.ident = obj.value.ident;
                if (self.form.pk === obj.key[0])
                  self.form.ident = obj.value.ident;
              } else if (obj.value.meter != null) {
                rec.meter = obj.value.meter;
                if (self.form.pk === obj.key[0])
                  self.form.meter = obj.value.meter;
              } else if (obj.value.code != null) {
                rec.code = obj.value.code;
                if (self.form.pk === obj.key[0])
                  self.form.code = obj.value.code;
              } else if (obj.value.maker != null) {
                rec.maker = obj.value.maker;
                if (self.form.pk === obj.key[0])
                  self.form.maker = obj.value.maker;
              } else if (obj.value.tom != null) {
                rec.tom = new Date(obj.value.tom.substring(0, 19));
              } else if (obj.value.vFirmware != null) {
                rec.fw = obj.value.vFirmware;
                if (self.form.pk === obj.key[0])
                  self.form.fw = obj.value.vFirmware;
              } else if (obj.value.vParam != null) {
                rec.vParam = obj.value.vParam;
                if (self.form.pk === obj.key[0])
                  self.form.vParam = obj.value.vParam;
              } else if (obj.value.factoryNr != null) {
                rec.factoryNr = obj.value.factoryNr;
                if (self.form.pk === obj.key[0])
                  self.form.factoryNr = obj.value.factoryNr;
              } else if (obj.value.item != null) {
                rec.item = obj.value.item;
                if (self.form.pk === obj.key[0])
                  self.form.item = obj.value.item;
              } else if (obj.value.mClass != null) {
                rec.mClass = obj.value.mClass;
                if (self.form.pk === obj.key[0])
                  self.form.mClass = obj.value.mClass;
              } else if (obj.value.protocol != null) {
                rec.protocol = obj.value.protocol;
                if (self.form.pk === obj.key[0])
                  self.form.protocol = obj.value.protocol;
              } else if (obj.value.serverId != null) {
                rec.serverId = obj.value.serverId;
              } else if (obj.value.gw != null) {
                rec.gwKey = obj.value.gw;
              } else if (obj.value.online != null) {
                rec.online = obj.value.online;
              } else if (obj.value.protocol != null) {
                rec.protocol = obj.value.protocol;
              }
            }
          });
        } else if (obj.cmd === "clear") {
          //  clear table
          this.meters = [];
        } else if (obj.cmd === "delete") {
          const idx = this.meters.findIndex(rec => rec.pk === obj.key[0]);
          this.meters.splice(idx, 1);
        } else if (obj.cmd === "load") {
          //  load status
          if (obj.show != null) {
            //   console.log('load state ' + obj.show);
            this.isBusy = obj.show;
            if (this.isBusy) {
              // reset the tmpMeters array if the initial upload starts
              tmpMeters = [];
            } else {
              // set the tmpMeters if the initial uploads is done
              this.meters = tmpMeters;
            }
          } else if (obj.level !== 0) {
            this.busyLevel = obj.level;
          }

          if (obj.show === false) {
            // the table is loaded, we can select the meter - if there is one
            const meterPk = this.$route.params.meterPk;
            const meterIsAvailable = this.meters.findIndex(
              meter => meter.pk === meterPk
            );
            if (meterIsAvailable !== -1) {
              // filter the table by the primary key - just in case there amount of meters is greate
              // than the page size (in this case the selected meter may not be visible.
              this.filter = meterPk;
              // wait a tick to let the view update itself and the table is filtered
              // after that the forst row must be the matching meter
              setTimeout(() => {
                (this.$refs.meterTable as any).selectRow(0);
              }, 1);
            }
          }
        } else if (obj.cmd === "update") {
          console.log("update channel " + obj.channel);
          if (obj.channel === "attention.code") {
            //   toasts/alerts
            if (obj.section === "8181c7c7fd00") {
              //  OK
              this.$toasted.global.sml_attention_ok(
                obj.rec.srv + " modification accepted",
                "info"
              );
            } else {
              //  error
              // this.meters.showAttentionFailure = true;
              this.$toasted.global.sml_attention_error(
                obj.rec.srv + ": " + obj.rec.values
              );
            }
            this.spinner.readout = false;
            this.spinner.meter = false;
            this.spinner.push = false;
            this.spinner.mirror = false;
          } else if (obj.channel === "config.location") {
            this.location = obj.rec.data;
          } else if (obj.channel === MESSAGE_RESPONSE.getList) {
            //console.log(obj);
            //  hide spinner
            this.spinner.readout = false;
            // clear table
            this.readout.values = [];
            if (obj.rec.values.values != null) {
              this.$toasted.global.sml_attention_ok(
                obj.rec.srv +
                  " sent " +
                  Object.keys(obj.rec.values.values).length +
                  " values",
                "info"
              );
              Object.keys(obj.rec.values.values).forEach(key => {
                //console.log(key);
                //console.log(obj.rec.values.values[key]);
                const rec = {
                  obis: key,
                  value: obj.rec.values.values[key].value,
                  unit: obj.rec.values.values[key].unit,
                  time: obj.rec.values.values[key].valTime,
                  server: obj.rec.srv
                };
                this.readout.values.push(rec);
              });
            } else {
              this.$toasted.global.sml_attention_ok(
                obj.rec.srv + " has no values",
                "info"
              );
            }
          } else if (obj.channel === MESSAGE_RESPONSE.getProcParameter) {
            console.log(MESSAGE_RESPONSE.getProcParameter + ": " + obj.section);
            //console.log(obj.rec.values);
            console.log(obj);
            if (obj.section[0] === SML_CODES.CODE_ROOT_SENSOR_PARAMS) {
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
              this.tabMeter.data.devClass = obj.rec.values["8181C78202FF"];
              this.tabMeter.data.maker = obj.rec.values["8181C78203FF"];
              this.tabMeter.data.status = obj.rec.values["810060050000"];
              this.tabMeter.data.bitmask = obj.rec.values["8181C78601FF"];
              this.tabMeter.data.interval = obj.rec.values["8181C78602FF"];
              if (obj.rec.values.lastRecord != null) {
                // var tp = obj.rec.values.lastRecord.subString(0, 19);
                this.tabMeter.data.lastRecord = obj.rec.values.lastRecord.substring(
                  0,
                  19
                );
              } else {
                this.tabMeter.data.lastRecord = null;
              }
              this.tabMeter.data.pubKey = obj.rec.values["8181C78205FF"];
              this.tabMeter.data.aesKey = obj.rec.values["8181C78603FF"];
              if (this.tabMeter.data.aesKey != null) {
                this.tabMeter.data.aesKey = this.tabMeter.data.aesKey.toUpperCase();
              }
              this.tabMeter.data.user = obj.rec.values["8181613C01FF"];
              this.tabMeter.data.pwd = obj.rec.values["8181613C02FF"];
            } else if (obj.section[0] === SML_CODES.CODE_ROOT_DATA_COLLECTOR) {
              this.spinner.mirror = false;
              Object.values(obj.rec.values).forEach((e: any, idx: number) => {
                //console.log(e);

                const rec = {
                  nr: idx + 1,
                  active: e["8181C78621FF"],
                  entries: e["8181C78622FF"],
                  period: e["8181C78781FF"],
                  OBIS: e["8181C78A83FF"],
                  name: "Name",
                  registers: e["8181C78A23FF"]
                };

                //  insert into table
                this.tabDataMirror.data.items.push(rec);
              });
            } else if (obj.section[0] === SML_CODES.PUSH_OPERATIONS) {
              this.spinner.push = false;
              Object.values(obj.rec.values).forEach((e: any, idx: number) => {
                console.log(e);
                const rec = {
                  nr: idx + 1,
                  interval: e["8181C78A02FF"],
                  delay: e["8181C78A03FF"],
                  name: e["8147170700FF"],
                  OBIS: e["8149000010FF"], // profile
                  source: e["8181C78A04FF"]["8181C78A04FF"] // push quelle
                };

                //  insert into table
                this.tabPush.data.items.push(rec);
              });
            }
          } else {
            console.log("unknown channel: " + obj.channel);
          }
        }
        this.visibleRows = this.meters.length;
      }
    },
    updateSmfContext() {
      const bTabs = this.$refs.tabs as BTabs;
      const smfContext = bTabs.tabs[this.tabIndex].$attrs["smf-context"];
      console.log(`${smfContext} selected for`, this.selected[0]);

      if (smfContext === this.smfContext.gateway) {
        this.spinner.readout = true;
        this.ws_submit_request(
          MESSAGE_REQUEST.getList,
          SML_CODES.LIST_CURRENT_DATA_RECORD,
          [this.form.gwKey],
          { meter: this.form.ident }
        );
      } else if (smfContext === this.smfContext.pushOperation) {
        this.spinner.push = true;
        this.tabPush.data.items = [];
        //  81 81 C7 8A 01 FF
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.PUSH_OPERATIONS,
          [this.form.gwKey],
          { meter: this.form.ident }
        );
      } else if (smfContext === this.smfContext.dataMirror) {
        this.spinner.mirror = true;
        this.tabDataMirror.data.items = [];
        //  81 81 C7 86 20 FF
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_DATA_COLLECTOR,
          [this.form.gwKey],
          { meter: this.form.ident }
        );
      } else if (smfContext === this.smfContext.access) {
        this.accessRefresh();
      } else if (smfContext === this.smfContext.location) {
        this.location.country = "";
        this.location.region = "";
        this.location.address = "";
        this.location.descr = "";
        this.location.lat = 49.500499;
        this.location.long = 8.500619;

        this.locationRefresh();
      }
    },
    tabSelected() {
      // at elast one item (e.g. meter) is always selected
      // get the context of the selected tab
      this.updateSmfContext();
    },
    rowSelected(items: any[]) {
      this.selected = items;
      if (items.length > 0) {
        console.log(items.length + " rows selected ");
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
        this.form.protocol = items[0].protocol;
        this.form.serverId = items[0].serverId;
        this.form.gwKey = items[0].gwKey;
        if (items.length === 1) {
          // the tabs are rendered only if an item is selected - so wait a tick until the tabs-element is there
          setTimeout(() => this.updateSmfContext());
        }
      }
    },
    onMeterUpdate(event: Event) {
      event.preventDefault();
      console.log("onMeterUpdate: " + this.form.ident);
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
          mClass: this.form.mClass,
          protocol: this.form.protocol,
          tom: this.form.tom
        }
      });
    },
    onMeterDelete(event: Event) {
      event.preventDefault();
      console.log("onMeterDelete: " + this.selected.length + " meters");
      (this.$refs.dlgDeleteMeter as any).show();
    },
    onParameterUpdate(event: Event) {
      event.preventDefault();
      this.spinner.meter = true;
      this.ws_submit_request(
        MESSAGE_REQUEST.setProcParameter,
        SML_CODES.CODE_ROOT_SENSOR_PARAMS,
        [this.form.gwKey],
        { meter: this.form.ident, data: this.tabMeter.data }
      );
    },
    accessRefresh() {
      this.spinner.meter = true;
      //  FIXME: use a different message channel if server ID is NULL
      this.ws_submit_request(
        MESSAGE_REQUEST.getProcParameter,
        SML_CODES.CODE_ROOT_SENSOR_PARAMS,
        [this.form.gwKey],
        { meter: this.form.ident }
      );
    },
    locationRefresh() {
      this.ws_submit_record("query", "config.location", {
        key: [this.form.pk],
        data: {}
      });
    },
    handleDeleteMeterOk(event: Event) {
      event.preventDefault();
      this.selected.forEach(element => {
        this.ws_submit_key("delete", "config.meter", { tag: [element.pk] });
      });
      this.$nextTick(() => {
        // Wrapped in $nextTick to ensure DOM is rendered before closing
        (this.$refs.dlgDeleteMeter as any).hide();
      });
    },
    generatePassword(event: Event) {
      event.preventDefault();
      this.tabMeter.data.pwd = generatePassword();
    },
    onFiltered(filteredItems: any[]) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.visibleRows = filteredItems.length;
      this.currentPage = 1;
    },
    onBrokerUpdate(type: "iec" | "mbus") {}
  },
  computed: {
    tableCaption(): string {
      return (
        this.selected.length + "/" + this.visibleRows + " item(s) selected"
      );
    },
    btnUpdateTitle(): string {
      if (this.selected.length > 0) {
        return "Update " + this.selected[0].ident;
      }
      return "Update";
    },
    btnRefreshTitle(): string {
      if (this.selected.length > 0) {
        return "Refresh " + this.selected[0].ident;
      }
      return "Refresh";
    },
    btnDeleteTitle(): string {
      if (this.selected.length === 0) {
        return "Delete";
      } else if (this.selected.length === 1) {
        return "Delete " + this.selected[0].ident;
      }
      return "Delete " + this.selected.length + " record(s)";
    },
    aesKeyValidation(): boolean {
      if (this.tabMeter.data.aesKey == null) return true;
      if (this.tabMeter.data.aesKey.length === 0) return true;
      const rex = /[0-9A-Fa-f]{32}/g; //  test for hexadecimal string
      return rex.test(this.tabMeter.data.aesKey);
    },
    isOnline(): boolean {
      if (this.selected.length === 0) return false;

      let self = this;
      const rec = this.meters.find(function(rec) {
        //console.log(rec.pk + ' ? ' + self.form.pk);
        if (rec.pk === self.form.pk) return true;
      });
      //console.log(rec.pk + ' - ' + rec.ident + ' - ' + rec.online);
      //  online state == 1
      return rec == null ? true : rec.online === 1;
    }
  },
  beforeRouteEnter(to: any, from: any, next: any) {
    hasPrivilegesWaitForUser(
      store,
      MODULES.CONFIG_METERS,
      PRIVILEGES.VIEW
    ).then(result => {
      next(result ? true : NO_ACCESS_ROUTE);
    });
  }
});
</script>

<style lang="css" scoped></style>
