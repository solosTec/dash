<template lang="html">
  <section class="smf-config-gateway">
    <template>
      <div>
        <vue-headful
          title="smf :: config gateways"
          description="SMF dashboard"
          keywords="SMF, solosTec"
        />
      </div>
    </template>

    <b-jumbotron
      fluid
      :header="$t('header-gateway')"
      :lead="$t('lead-gateway', { count: this.gateways.length })"
    />

    <b-container fluid>
      <b-row>
        <b-col md="4">
          <b-form-group
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            :label="$t('tbl-filter')"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input v-model="filter" :placeholder="$t('tbl-search')" />
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">{{
                  $t("action-clear")
                }}</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col md="4">
          <b-form-row>
            <smf-row-count-selector
              v-model="perPage"
              store-key="gateway"
              class="col"
            />
          </b-form-row>
        </b-col>
        <b-col md="4">
          <b-pagination
            v-model="currentPage"
            :total-rows="visibleRows"
            :per-page="perPage"
            class="justify-content-end"
            align="fill"
            size="sm"
          />
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <!-- table -->
          <b-table
            ref="gwTable"
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
            primary-key="tag"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            class="shadow data-table"
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
      <b-row style="height: 50vh">
        <b-col md="12" class="p-3 shadow">
          <div v-if="selected.length === 0">Please select a gateway.</div>
          <b-tabs
            v-if="selected.length > 0"
            pills
            card
            v-model="tabIndex"
            @input="tabSelected"
            ref="tabs"
          >
            <!-- Configuration" -->
            <b-tab
              :title="$t('config-gateway-04')"
              active
              :smf-context="smfContext.configuration"
            >
              <smf-server-configuration
                :gateways="selected"
                :wsDelegate="createWsDelegate"
              ></smf-server-configuration>
            </b-tab>

            <!-- Status -->
            <b-tab
              no-body
              :disabled="selected[0].online === 0"
              :smf-context="smfContext.statusWord"
            >
              <template slot="title">
                {{ $t("config-gateway-09") }}
                <b-spinner v-if="spinner.status" type="grow" small />
              </template>
              <b-list-group v-if="!spinner.status">
                <template v-for="(state, index) in gw.status">
                  <b-list-group-item :variant="state.variant" :key="index">{{
                    state.value
                  }}</b-list-group-item>
                </template>
              </b-list-group>
            </b-tab>

            <!-- IPT -->
            <b-tab
              :disabled="selected[0].online === 0"
              no-body
              :smf-context="smfContext.ipt"
            >
              <template slot="title">
                {{ $t("config-gateway-10") }}
                <b-spinner v-if="spinner.ipt" type="grow" small />
              </template>
              <b-form @submit.prevent="">
                <b-row class="pt-4">
                  <b-col md="12">
                    <b-alert variant="warning" show="true" dismissible>
                      <span style="font-weight: bold">Note:</span>
                      {{ $t("config-gateway-02") }}
                    </b-alert>
                  </b-col>
                </b-row>

                <b-card-group deck v-if="!spinner.ipt">
                  <b-card
                    :header="$t('config-gateway-94')"
                    :title="$t('config-gateway-91')"
                    sub-title="Access Parameters"
                  >
                    <b-form-group
                      label="TCP/IP Address"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      :description="$t('config-gateway-79')"
                    >
                      <b-input-group prepend="Host" class="mt-2">
                        <b-form-input
                          id="smf-gw-ipt-host-0"
                          type="text"
                          v-model="ipt.param[0].host"
                          required
                          v-b-popover.hover="
                            'Specify a known hostname or an IPv4/IPv6 address'
                          "
                          :title="$t('config-gateway-91')"
                          :placeholder="
                            $t('config-gateway-11') | fmtPlaceholder
                          "
                        />

                        <b-form-input
                          id="smf-gw-ipt-port-0"
                          type="number"
                          v-model.number="ipt.param[0].port"
                          required
                          min="1024"
                          max="‭65535‬"
                          :placeholder="
                            $t('config-gateway-14') | fmtPlaceholder
                          "
                        />
                        <b-input-group-append>
                          <b-button
                            variant="info"
                            v-on:click.stop="
                              ipt.param[0].port = 26862;
                              ipt.param[0].host = 'localhost';
                            "
                            >{{ $t("com-default") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group
                      :label="$t('config-gateway-12')"
                      label-for="smf-gw-ipt-name-0"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      description="Device Name"
                    >
                      <b-form-input
                        id="smf-gw-ipt-name-0"
                        type="text"
                        v-model="ipt.param[0].user"
                        required
                        :placeholder="$t('config-gateway-12') | fmtPlaceholder"
                      />
                    </b-form-group>
                    <b-form-group
                      :label="$t('config-gateway-16')"
                      label-for="smf-gw-ipt-pwd-0"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      :description="$t('config-gateway-90')"
                    >
                      <b-input-group>
                        <b-form-input
                          id="smf-gw-ipt-pwd-0"
                          type="text"
                          v-model="ipt.param[0].pwd"
                          required
                          :placeholder="
                            $t('config-gateway-16') | fmtPlaceholder
                          "
                        />
                        <b-input-group-append>
                          <b-button
                            variant="info"
                            v-on:click.stop="generatePasswordIPT($event, 0)"
                            >&#x21ba;</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group
                      :label="$t('config-gateway-15')"
                      label-for="smf-gw-ipt-scrambled-0"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      :description="$t('config-gateway-96')"
                    >
                      <b-input-group>
                        <b-form-checkbox
                          switch
                          v-model="ipt.param[0].scrambled"
                        >
                          {{
                            wmbus.active
                              ? $t("config-gateway-40")
                              : $t("config-gateway-41")
                          }}
                        </b-form-checkbox>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols-sm="4" label-cols-lg="3">
                      <b-button
                        type="submit"
                        variant="primary"
                        v-on:click.stop="onIPTUpdate($event, 0)"
                        >{{ btnUpdateTitle }}</b-button
                      >
                    </b-form-group>
                  </b-card>

                  <b-card
                    :header="$t('config-gateway-95')"
                    :title="$t('config-gateway-92')"
                    sub-title="Access Parameters"
                  >
                    <b-form-group
                      label="TCP/IP Address"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      :description="$t('config-gateway-79')"
                    >
                      <b-input-group prepend="Host" class="mt-2">
                        <b-form-input
                          id="smf-gw-ipt-host-1"
                          type="text"
                          v-model="ipt.param[1].host"
                          required
                          v-b-popover.hover="
                            'Specify a known hostname or an IPv4/IPv6 address'
                          "
                          :title="$t('config-gateway-92')"
                          :placeholder="$t('config-gateway-11')"
                        />
                        <b-form-input
                          id="smf-gw-ipt-port-1"
                          type="number"
                          v-model.number="ipt.param[1].port"
                          required
                          min="1024"
                          max="‭65535‬"
                          :placeholder="
                            $t('config-gateway-14') | fmtPlaceholder
                          "
                        />
                        <b-input-group-append>
                          <b-button
                            variant="info"
                            v-on:click.stop="
                              ipt.param[1].port = 26863;
                              ipt.param[1].host = 'localhost';
                            "
                            >{{ $t("com-default") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group
                      :label="$t('config-gateway-12')"
                      label-for="smf-gw-ipt-name-1"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      description="Device Name"
                    >
                      <b-form-input
                        id="smf-gw-ipt-name-1"
                        type="text"
                        v-model="ipt.param[1].user"
                        required
                        :placeholder="$t('config-gateway-12') | fmtPlaceholder"
                      />
                    </b-form-group>
                    <b-form-group
                      :label="$t('config-gateway-16')"
                      label-for="smf-gw-ipt-pwd-1"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      :description="$t('config-gateway-90')"
                    >
                      <b-input-group>
                        <b-form-input
                          id="smf-gw-ipt-pwd-1"
                          type="text"
                          v-model="ipt.param[1].pwd"
                          required
                          :placeholder="
                            $t('config-gateway-16') | fmtPlaceholder
                          "
                        />
                        <b-input-group-append>
                          <b-button
                            variant="info"
                            v-on:click.stop="generatePasswordIPT($event, 1)"
                            >&#x21ba;</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group
                      :label="$t('config-gateway-15')"
                      label-for="smf-gw-ipt-scrambled-1"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      :description="$t('config-gateway-96')"
                    >
                      <b-input-group>
                        <b-form-checkbox
                          switch
                          v-model="ipt.param[1].scrambled"
                        >
                          {{
                            wmbus.active
                              ? $t("config-gateway-40")
                              : $t("config-gateway-41")
                          }}
                        </b-form-checkbox>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols-sm="4" label-cols-lg="3">
                      <b-button
                        type="submit"
                        variant="primary"
                        v-on:click.stop="onIPTUpdate($event, 1)"
                        >{{ btnUpdateTitle }}</b-button
                      >
                    </b-form-group>
                  </b-card>
                </b-card-group>

                <b-row class="pt-2">
                  <b-col md="12">
                    <b-button v-b-toggle.sidebar-footer>{{
                      $t("config-gateway-01")
                    }}</b-button>
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
                          <strong class="mr-auto">IP-T Connection State</strong>
                          <b-button size="sm" @click="hide">{{
                            $t("action-close")
                          }}</b-button>
                        </div>
                      </template>
                      <div class="px-3 py-2">
                        <b-form-group
                          :label="$t('config-gateway-11')"
                          label-for="smf-gw-ipt-host"
                          label-cols-sm="4"
                          label-cols-lg="3"
                        >
                          <b-form-input
                            id="smf-gw-ipt-host"
                            type="text"
                            v-model="ipt.status.host"
                            v-b-popover.hover="'Current IP address'"
                            title="Hostname"
                            placement="top"
                            readonly
                            :placeholder="
                              $t('config-gateway-11') | fmtPlaceholder
                            "
                          />
                        </b-form-group>
                        <b-form-group
                          :label="$t('config-gateway-18')"
                          label-for="smf-gw-ipt-port-local"
                          label-cols-sm="4"
                          label-cols-lg="3"
                        >
                          <b-form-input
                            id="smf-gw-ipt-port-local"
                            type="number"
                            v-model.number="ipt.status.local"
                            readonly
                            min="1024"
                            max="‭65535‬"
                            :placeholder="
                              $t('config-gateway-14') | fmtPlaceholder
                            "
                          />
                        </b-form-group>
                        <b-form-group
                          :label="$t('config-gateway-19')"
                          label-for="smf-gw-ipt-port-remote"
                          label-cols-sm="4"
                          label-cols-lg="3"
                        >
                          <b-form-input
                            id="smf-gw-ipt-port-remote"
                            type="number"
                            v-model.number="ipt.status.remote"
                            readonly
                            min="1024"
                            max="‭65535‬"
                            :placeholder="
                              $t('config-gateway-14') | fmtPlaceholder
                            "
                          />
                        </b-form-group>
                      </div>
                    </b-sidebar>
                  </b-col>
                </b-row>
              </b-form>
            </b-tab>

            <!-- Broker -->
            <b-tab
              :disabled="
                selected[0].online === 0 ||
                  !selected[0].model.startsWith('SMF-GW:')
              "
              no-body
              :smf-context="smfContext.broker"
            >
              <template slot="title">
                {{ $t("config-gateway-74") }}
                <b-spinner v-if="spinner.broker" type="grow" small />
              </template>

              <smfBrokerConfiguration
                :gateway="selected[0]"
                :brokers="brokers"
                :brokerPorts="brokerPorts"
                @brokersUpdate="onBrokersUpdate"
                @brokerHardwarePortUpdate="onBrokerHardwarePortUpdate"
              ></smfBrokerConfiguration>
            </b-tab>

            <!-- Firmware -->
            <b-tab
              :disabled="selected[0].online === 0"
              no-body
              :smf-context="smfContext.firmware"
            >
              <template slot="title">
                {{ $t("config-gateway-29") }}
                <b-spinner v-if="spinner.firmware" type="grow" small />
              </template>
              <!-- table -->
              <firmware v-if="!spinner.firmware" :items="fw.values" />
            </b-tab>

            <!-- Memory -->
            <b-tab
              :disabled="selected[0].online === 0"
              :smf-context="smfContext.memoryUsage"
            >
              <template slot="title">
                {{ $t("config-gateway-30") }}
                <b-spinner v-if="spinner.memory" type="grow" small />
              </template>
              <b-row v-if="!spinner.memory">
                <b-col md="6">
                  <b-card-text>{{ $t("config-gateway-31") }}</b-card-text>
                  <b-progress
                    class="mt-2"
                    height="2rem"
                    :value="gw.memory.mirror"
                    show-value
                  />
                </b-col>
                <b-col md="6">
                  <b-card-text>{{ $t("config-gateway-32") }}</b-card-text>
                  <b-progress
                    class="mt-2"
                    height="2rem"
                    :value="gw.memory.tmp"
                    show-value
                  />
                </b-col>
              </b-row>
            </b-tab>

            <!-- Meters -->
            <b-tab
              :disabled="selected[0].online === 0"
              no-body
              :smf-context="smfContext.devices"
            >
              <template slot="title">
                {{ $t("config-gateway-33") }}
                <b-spinner v-if="spinner.meters" type="grow" small />
              </template>

              <div v-if="!spinner.meters">
                <!-- table -->
                <b-table
                  ref="meterTable"
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
                  class="shadow"
                >
                  <template v-slot:cell(active)="row">
                    <b-button size="sm" @click="onMeterActivate(row.item)">
                      {{ row.item.active ? "✖ Deactivate" : "✔ Activate" }}
                    </b-button>
                  </template>
                  <template v-slot:cell(edit)="row">
                    <b-button
                      size="sm"
                      variant="info"
                      v-b-tooltip.hover
                      :title="'meter code: ' + row.item.mc"
                      :disabled="btnEditStatus(row.item.mc)"
                      @click="onMeterEdit(row.item)"
                      >{{ btnEdit }}</b-button
                    >
                  </template>
                </b-table>
                <div>
                  <b-link
                    :href="meters.csv"
                    download="meters.csv"
                    type="text/csv"
                    >{{ linkMeterDownloadTitle }}</b-link
                  >
                </div>
              </div>
            </b-tab>

            <!-- wireless M-Bus -->
            <b-tab
              :disabled="selected[0].online === 0"
              no-body
              :smf-context="smfContext.wirlessMBus"
            >
              <template slot="title">
                {{ $t("config-gateway-27") }}
                <b-spinner v-if="spinner.wmbus" type="grow" small />
              </template>
              <div v-if="!spinner.wmbus">
                <b-form @submit.prevent="">
                  <b-row class="pt-4">
                    <b-col>
                      <b-button
                        type="submit"
                        variant="primary"
                        size="lg"
                        v-on:click.stop="onWMbusUpdate"
                        >Submit</b-button
                      >
                    </b-col>
                  </b-row>

                  <b-card-group deck class="pt-4">
                    <b-card header="Timer">
                      <b-form-group
                        :label="$t('config-gateway-42')"
                        label-for="smf-gw-wmbus-reboot"
                        label-cols-sm="4"
                        label-cols-lg="3"
                        :description="$t('config-gateway-42-01')"
                      >
                        <b-input-group :prepend="wmbusRebootPrep">
                          <b-form-input
                            id="smf-gw-wmbus-reboot"
                            type="number"
                            v-model.number="wmbus.reboot"
                            min="0"
                            max="‭60000"
                            step="60"
                            placeholder="<Reboot>"
                          />
                          <b-input-group-append>
                            <b-button
                              variant="info"
                              v-on:click.stop="wmbus.reboot = 86400"
                              >{{ $t("config-gateway-48") }}</b-button
                            >
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>

                      <b-form-group
                        :label="$t('config-gateway-44')"
                        label-for="smf-gw-wmbus-smode"
                        label-cols-sm="4"
                        label-cols-lg="3"
                        :description="$t('config-gateway-44-01')"
                      >
                        <b-input-group>
                          <b-form-input
                            :disabled="wmbus.protocol !== 'A'"
                            id="smf-gw-wmbus-smode"
                            type="number"
                            v-model.number="wmbus.sMode"
                            min="0"
                            max="6000"
                            step="10"
                            :placeholder="
                              $t('config-gateway-44') | fmtPlaceholder
                            "
                          />
                          <b-input-group-append>
                            <b-button
                              variant="info"
                              v-on:click.stop="wmbus.sMode = 30"
                              >{{ $t("config-gateway-48") }}</b-button
                            >
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>

                      <b-form-group
                        :label="$t('config-gateway-46')"
                        label-for="smf-gw-wmbus-tmode"
                        label-cols-sm="4"
                        label-cols-lg="3"
                        :description="$t('config-gateway-46-01')"
                      >
                        <b-input-group>
                          <b-form-input
                            :disabled="wmbus.protocol !== 'A'"
                            id="smf-gw-wmbus-tmode"
                            type="number"
                            v-model.number="wmbus.tMode"
                            min="0"
                            max="6000"
                            step="10"
                            :placeholder="$t('config-gateway-47')"
                          />
                          <b-input-group-append>
                            <b-button
                              variant="info"
                              v-on:click.stop="wmbus.tMode = 20"
                              >{{ $t("config-gateway-48") }}</b-button
                            >
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>
                    </b-card>

                    <b-card header="Protocol">
                      <b-form-group
                        :label="$t('config-gateway-34')"
                        label-cols-sm="4"
                        label-cols-lg="3"
                        description="Select a radio protocol"
                      >
                        <b-form-radio-group
                          id="smf-gw-wmbus-protocol"
                          buttons
                          button-variant="outline-primary"
                          stacked
                          v-model="wmbus.protocol"
                          name="smf-gw-wmbus-protocol"
                        >
                          <b-form-radio value="T">{{
                            $t("config-gateway-35")
                          }}</b-form-radio>
                          <b-form-radio value="S">{{
                            $t("config-gateway-36")
                          }}</b-form-radio>
                          <b-form-radio
                            value="A"
                            v-b-popover.hover="$t('config-gateway-37')"
                            title="T2/S2 Automatic"
                            >T2/S2 Automatic</b-form-radio
                          >
                          <b-form-radio value="P">{{
                            $t("config-gateway-38")
                          }}</b-form-radio>
                        </b-form-radio-group>
                      </b-form-group>
                    </b-card>

                    <b-card header="Behaviour">
                      <b-form-group
                        :label="$t('config-gateway-39')"
                        label-for="smf-gw-wmbus-active"
                        label-cols-sm="4"
                        label-cols-lg="3"
                        description="Description"
                      >
                        <b-form-checkbox
                          switch
                          v-model="wmbus.active"
                          name="smf-gw-wmbus-active"
                        >
                          {{
                            wmbus.active
                              ? $t("config-gateway-40")
                              : $t("config-gateway-41")
                          }}
                        </b-form-checkbox>
                      </b-form-group>

                      <b-form-group
                        :label="$t('config-gateway-43')"
                        label-for="smf-gw-wmbus-power"
                        label-cols-sm="4"
                        label-cols-lg="3"
                        description="Description"
                      >
                        <b-form-select
                          v-model="wmbus.power"
                          class="mb-3"
                          disabled
                        >
                          <option value="low">{{
                            $t("config-gateway-43-01")
                          }}</option>
                          <option value="basic">{{
                            $t("config-gateway-43-02")
                          }}</option>
                          <option value="avg">{{
                            $t("config-gateway-43-03")
                          }}</option>
                          <option value="strong">{{
                            $t("config-gateway-43-04")
                          }}</option>
                        </b-form-select>
                      </b-form-group>
                    </b-card>
                  </b-card-group>
                </b-form>

                <b-form>
                  <b-row class="pt-4">
                    <b-col md="12">
                      <b-button v-b-toggle.sidebar-footer>{{
                        $t("config-gateway-03")
                      }}</b-button>
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
                            <strong class="mr-auto">M-Bus Hardware</strong>
                            <b-button size="sm" @click="hide">{{
                              $t("action-close")
                            }}</b-button>
                          </div>
                        </template>
                        <div class="px-3 py-2">
                          <b-form-group
                            :label="$t('config-gateway-49')"
                            label-for="smf-gw-wmbus-type"
                          >
                            <b-form-input
                              id="smf-gw-wmbus-type"
                              type="text"
                              v-model="wmbus.type"
                              readonly
                              :placeholder="
                                $t('config-gateway-49') | fmtPlaceholder
                              "
                            />
                          </b-form-group>
                          <b-form-group
                            :label="$t('config-gateway-51')"
                            label-for="smf-gw-wmbus-id"
                          >
                            <b-form-input
                              id="smf-gw-wmbus-id"
                              type="text"
                              v-model="wmbus.id"
                              readonly
                              :placeholder="
                                $t('config-gateway-51') | fmtPlaceholder
                              "
                            />
                          </b-form-group>
                          <b-form-group
                            :label="$t('config-gateway-53')"
                            label-for="smf-gw-wmbus-host"
                          >
                            <b-form-input
                              id="smf-gw-wmbus-host"
                              type="text"
                              v-model="wmbus.firmware"
                              readonly
                              :placeholder="
                                $t('config-gateway-53') | fmtPlaceholder
                              "
                            />
                          </b-form-group>
                          <b-form-group
                            :label="$t('config-gateway-55')"
                            label-for="smf-gw-wmbus-hardware"
                          >
                            <b-form-input
                              id="smf-gw-wmbus-hardware"
                              type="text"
                              v-model="wmbus.hardware"
                              readonly
                              :placeholder="
                                $t('config-gateway-55') | fmtPlaceholder
                              "
                            />
                          </b-form-group>
                        </div>
                      </b-sidebar>
                    </b-col>
                  </b-row>
                </b-form>
              </div>
            </b-tab>
            <!-- IEC -->
            <b-tab
              :disabled="selected[0].online === 0"
              no-body
              :smf-context="smfContext.iec"
            >
              <template slot="title">
                {{ $t("config-gateway-57") }}
                <b-spinner v-if="spinner.iec" type="grow" small />
              </template>

              <b-form
                v-if="!spinner.iec"
                @submit.prevent=""
                v-bind:class="{ 'bg-warning': !iec.params['8181C79301FF'] }"
              >
                <b-row class="p-3">
                  <b-col md="3">
                    <b-form-group
                      :label="$t('config-gateway-58')"
                      label-for="smf-gw-iec-active"
                    >
                      <b-form-checkbox
                        switch
                        v-model="iec.params['8181C79301FF']"
                        name="smf-gw-iec-active"
                      >
                        {{
                          iec.params["8181C79301FF"]
                            ? $t("config-gateway-59")
                            : $t("config-gateway-60")
                        }}
                      </b-form-checkbox>
                    </b-form-group>
                  </b-col>

                  <b-col md="3">
                    <b-form-group
                      :label="$t('config-gateway-61')"
                      label-for="smf-gw-iec-period"
                    >
                      <b-input-group
                        :prepend="iec.params.loopTime / 60 + ' min'"
                      >
                        <b-form-input
                          id="smf-gw-iec-period"
                          type="number"
                          v-model.number="iec.params.loopTime"
                          min="60"
                          max="‭50000"
                          step="60"
                          :placeholder="$t('config-gateway-62')"
                        />
                        <b-input-group-append>
                          <b-button
                            variant="info"
                            v-on:click.stop="iec.params.loopTime = 60"
                            >{{ $t("config-gateway-48") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>

                  <b-col md="3">
                    <b-form-group
                      :label="$t('config-gateway-63')"
                      label-for="smf-gw-iec-data-rate"
                    >
                      <b-input-group>
                        <b-form-input
                          id="smf-gw-iec-data-rate"
                          type="number"
                          v-model.number="iec.params.maxDataRate"
                          min="60"
                          max="‭50000"
                          step="10"
                          :placeholder="$t('config-gateway-64')"
                        />
                        <b-input-group-append>
                          <b-button
                            variant="info"
                            v-on:click.stop="iec.params.maxDataRate = 10240"
                            >{{ $t("config-gateway-48") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>

                  <b-col md="3">
                    <b-form-group
                      :label="$t('config-gateway-65')"
                      label-for="smf-gw-iec-min-timeout"
                    >
                      <b-input-group
                        :prepend="
                          (iec.params.minTimeout / 60).toFixed(2) + ' min'
                        "
                      >
                        <b-form-input
                          id="smf-gw-iec-min-timeout"
                          type="number"
                          v-model.number="iec.params.minTimeout"
                          min="10"
                          max="‭60000"
                          step="10"
                          :placeholder="$t('config-gateway-66')"
                        />
                        <b-input-group-append>
                          <b-button
                            variant="info"
                            v-on:click.stop="iec.params.minTimeout = 200"
                            >{{ $t("config-gateway-48") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>

                <b-row class="p-3">
                  <b-col md="3">
                    <b-form-group
                      :label="$t('config-gateway-67')"
                      label-for="smf-gw-iec-auto-active"
                    >
                      <b-form-checkbox
                        switch
                        v-model="iec.params.autoActivation"
                        name="smf-gw-iec-auto-active"
                      >
                        {{
                          iec.params.autoActivation
                            ? $t("config-gateway-59")
                            : $t("config-gateway-60")
                        }}
                      </b-form-checkbox>
                    </b-form-group>
                  </b-col>

                  <b-col md="3">
                    <b-form-group
                      :label="$t('config-gateway-68')"
                      label-for="smf-gw-iec-retries"
                    >
                      <b-input-group>
                        <b-form-input
                          id="smf-gw-iec-retries"
                          type="number"
                          v-model.number="iec.params.retries"
                          min="0"
                          max="‭128"
                          step="1"
                          :placeholder="$t('config-gateway-69')"
                        />
                        <b-input-group-append>
                          <b-button
                            variant="info"
                            v-on:click.stop="iec.params.retries = 3"
                            >{{ $t("config-gateway-48") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>

                  <b-col md="3">
                    <b-form-group
                      :label="$t('config-gateway-70')"
                      label-for="smf-gw-iec-protocol"
                    >
                      <b-form-select
                        v-model="iec.params.protocolMode"
                        class="mb-3"
                        disabled
                      >
                        <option value="A">{{
                          $t("config-gateway-70-01")
                        }}</option>
                        <option value="B">{{
                          $t("config-gateway-70-02")
                        }}</option>
                        <option value="C">{{
                          $t("config-gateway-70-03")
                        }}</option>
                        <option value="D">{{
                          $t("config-gateway-70-04")
                        }}</option>
                      </b-form-select>
                    </b-form-group>
                  </b-col>

                  <b-col md="3">
                    <b-form-group
                      :label="$t('config-gateway-71')"
                      label-for="smf-gw-iec-max-timeout"
                    >
                      <b-input-group
                        :prepend="
                          (iec.params.maxTimeout / 60).toFixed(2) + ' min'
                        "
                      >
                        <b-form-input
                          id="smf-gw-iec-max-timeout"
                          type="number"
                          v-model.number="iec.params.maxTimeout"
                          min="60"
                          max="‭60000"
                          step="10"
                          :placeholder="$t('config-gateway-72')"
                        />
                        <b-input-group-append>
                          <b-button
                            variant="info"
                            v-on:click.stop="iec.params.maxTimeout = 5000"
                            >{{ $t("config-gateway-48") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>

                <b-row class="p-3">
                  <b-table
                    ref="iecDeviceTable"
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
                    class="shadow"
                  >
                    <!-- A virtual column -->
                    <template v-slot:cell(index)="data">
                      {{ data.index + 1 }}
                    </template>
                  </b-table>
                </b-row>

                <b-row class="p-3">
                  <b-col md="12">
                    <b-button
                      type="submit"
                      variant="primary"
                      size="lg"
                      v-on:click.stop="onIECUpdate"
                      >{{ $t("config-gateway-73") }}</b-button
                    >
                  </b-col>
                </b-row>
              </b-form>
            </b-tab>

            <!-- Access -->
            <b-tab no-body :smf-context="smfContext.auth">
              <template slot="title">
                Access
                <b-spinner v-if="spinner.auth" type="grow" small />
              </template>

              <smfServerRootAccessRights
                class="smfServerRootAccessRights"
                v-if="serverRootAccessRights"
                :root-access-rights="serverRootAccessRights"
                @queryMeter="onQueryMeter"
              ></smfServerRootAccessRights>
              <smf-meter-access-rights
                v-if="meterAccessRights"
                :meter-access-rights="meterAccessRights"
              >
              </smf-meter-access-rights>

              <b-form @submit.prevent="">
                <b-row class="p-3">
                  <b-col md="3">
                    <b-button
                      type="submit"
                      variant="primary"
                      v-b-tooltip.hover
                      title="Clear cache and initialize it with gw/server ID"
                      v-on:click.stop="onProxyCacheReset"
                    >
                      Reset Cache
                      <b-spinner v-if="spinner.reset" type="grow" small />
                    </b-button>
                  </b-col>
                  <b-col md="3">
                    <b-button
                      type="submit"
                      variant="primary"
                      v-b-tooltip.hover
                      title="Fill cache with all access rights of the selected gateway"
                      v-on:click.stop="onProxyCacheUpdate"
                      >Update Cache</b-button
                    >
                  </b-col>
                  <b-col md="3">
                    <b-button
                      type="submit"
                      variant="primary"
                      v-b-tooltip.hover
                      title="Backup complete gateway configuration with setup service (not implemented yet)"
                      v-on:click.stop="onProxyCacheSync"
                      >Sync Cache</b-button
                    >
                  </b-col>
                  <b-col md="3">
                    <b-button
                      type="submit"
                      variant="outline-primary"
                      v-b-tooltip.hover
                      title="Get a list of all cached root sections"
                      v-on:click.stop="onProxyCacheSections"
                      >Get Sections</b-button
                    >
                  </b-col>
                </b-row>

                <b-row class="p-3">
                  <b-col md="3">
                    <b-button
                      type="submit"
                      variant="outline-success"
                      v-b-tooltip.hover
                      title="Query cache for all access rights for all meters of the selected gateway"
                      v-on:click.stop="onProxyCacheQuery"
                      >Query Cache</b-button
                    >
                  </b-col>
                  <b-col md="9"> </b-col>
                </b-row>
              </b-form>
            </b-tab>

            <!-- logs -->
            <b-tab
              :disabled="selected[0].online === 0"
              no-body
              title="Log"
              :smf-context="smfContext.log"
            >
              <b-form @submit.prevent="" class="p-3">
                <b-row>
                  <b-col md="6">
                    <b-form-group description="Select the time range">
                      <b-form-radio-group
                        buttons
                        button-variant="outline-primary"
                        v-model="tabOpLog.form.selected"
                        :options="tabOpLog.form.options"
                      >
                      </b-form-radio-group>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-pagination
                      v-model="tabOpLog.nav.currentPage"
                      :total-rows="tabOpLog.nav.visibleRows"
                      :per-page="tabOpLog.nav.perPage"
                      class="justify-content-end"
                    />
                  </b-col>
                  <b-col md="12">
                    <opLog
                      ref="opLog"
                      :items="tabOpLog.data.items"
                      :nav="tabOpLog.nav"
                    />
                  </b-col>
                </b-row>
              </b-form>
            </b-tab>

            <!-- Snapshots -->
            <b-tab
              no-body
              title="Snapshots"
              :smf-context="smfContext.snapshots"
            >
              <b-form @submit.prevent="">
                <b-row class="p-3">
                  <b-col md="12">
                    <b-button
                      type="submit"
                      variant="primary"
                      v-on:click.stop="onProxyCacheSync"
                      >Create Snapshot</b-button
                    >
                  </b-col>
                </b-row>
                <b-row class="p-3">
                  <b-col md="12">
                    <snapshots
                      :items="tabSnapshots.data.items"
                      :nav="tabSnapshots.nav"
                    />
                  </b-col>
                </b-row>
              </b-form>
            </b-tab>

            <!-- Custom Interface / NMS -->
            <b-tab
              no-body
              title="Custom IF"
              :disabled="selected[0].online === 0"
              :smf-context="smfContext.custom"
            >
              <template slot="title">
                {{ $t("config-gateway-75") }}
                <b-spinner v-if="spinner.custom" type="grow" small />
              </template>
              <b-card-group deck class="pt-4" v-if="!spinner.custom">
                <b-card
                  header="IP-T"
                  :title="$t('config-gateway-98')"
                  :sub-title="$t('config-gateway-100')"
                >
                  <b-form-group
                    :label="$t('config-gateway-84')"
                    label-cols-sm="4"
                    label-cols-lg="3"
                    :description="$t('config-gateway-79')"
                  >
                    <b-input-group
                      :prepend="$t('config-gateway-76')"
                      class="mt-2"
                    >
                      <b-form-input
                        id="smf-gw-custom-first-address"
                        type="text"
                        v-model="tabCustom.data.ipt.firstAddress"
                        required
                        v-b-popover.hover="'Specify bind address'"
                        :title="$t('config-gateway-84')"
                        :placeholder="$t('config-gateway-76') | fmtPlaceholder"
                      />
                      <b-form-input
                        id="smf-gw-custom-ipt-port"
                        type="number"
                        v-model.number="tabCustom.data.ipt.port"
                        min="1024"
                        max="‭65535‬"
                        disabled
                      />

                      <b-input-group-append>
                        <b-button
                          variant="info"
                          v-on:click.stop="
                            tabCustom.data.ipt.firstAddress = '192.168.1.229'
                          "
                          >{{ $t("com-default") }}</b-button
                        >
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                  <b-form-group
                    :label="$t('config-gateway-86')"
                    label-cols-sm="4"
                    label-cols-lg="3"
                    :description="$t('config-gateway-80')"
                  >
                    <b-input-group
                      :prepend="$t('config-gateway-77')"
                      class="mt-2"
                    >
                      <b-form-input
                        id="smf-gw-custom-first-mask"
                        type="text"
                        v-model="tabCustom.data.ipt.firstMask"
                        required
                        v-b-popover.hover="
                          'Specify a known hostname or an IPv4/IPv6 address'
                        "
                        :title="$t('config-gateway-86')"
                        :placeholder="$t('config-gateway-11') | fmtPlaceholder"
                      />
                      <b-input-group-append>
                        <b-button
                          variant="info"
                          v-on:click.stop="
                            tabCustom.data.ipt.firstMask = '225.225.255.0'
                          "
                          >{{ $t("com-default") }}</b-button
                        >
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>

                  <b-form-group
                    :label="$t('config-gateway-78')"
                    label-for="smf-gw-ipt-scrambled-0"
                    label-cols-sm="4"
                    label-cols-lg="3"
                    :description="$t('config-gateway-81')"
                  >
                    <b-input-group>
                      <b-form-checkbox switch v-model="tabCustom.data.ipt.dhcp">
                        {{
                          tabCustom.data.ipt.dhcp
                            ? $t("config-gateway-40")
                            : $t("config-gateway-41")
                        }}
                      </b-form-checkbox>
                    </b-input-group>
                  </b-form-group>

                  <b-form-group
                    :label="$t('config-gateway-85')"
                    label-cols-sm="4"
                    label-cols-lg="3"
                    :description="$t('config-gateway-79')"
                  >
                    <b-input-group
                      :prepend="$t('config-gateway-76')"
                      class="mt-2"
                    >
                      <b-form-input
                        id="smf-gw-custom-second-address"
                        type="text"
                        v-model="tabCustom.data.ipt.secondAddress"
                        required
                        v-b-popover.hover="'Specify bind address'"
                        :title="$t('config-gateway-85')"
                        :placeholder="$t('config-gateway-11') | fmtPlaceholder"
                      />
                      <b-form-input
                        id="smf-gw-custom-ipt-port-2"
                        type="number"
                        v-model.number="tabCustom.data.ipt.port"
                        min="1024"
                        max="‭65535‬"
                        disabled
                      />

                      <b-input-group-append>
                        <b-button
                          variant="info"
                          v-on:click.stop="
                            tabCustom.data.ipt.secondAddress = '192.168.1.229'
                          "
                          >{{ $t("com-default") }}</b-button
                        >
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                  <b-form-group
                    :label="$t('config-gateway-87')"
                    label-cols-sm="4"
                    label-cols-lg="3"
                    :description="$t('config-gateway-80')"
                  >
                    <b-input-group
                      :prepend="$t('config-gateway-77')"
                      class="mt-2"
                    >
                      <b-form-input
                        id="smf-gw-custom-ipt-mask-2"
                        type="text"
                        v-model="tabCustom.data.ipt.secondMask"
                        required
                        v-b-popover.hover="'Specify a subnet mask'"
                        :title="$t('config-gateway-87')"
                        :placeholder="$t('config-gateway-11') | fmtPlaceholder"
                      />
                      <b-input-group-append>
                        <b-button
                          variant="info"
                          v-on:click.stop="
                            tabCustom.data.ipt.secondMask = '225.225.255.0'
                          "
                          >{{ $t("com-default") }}</b-button
                        >
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                  <b-form-group label-cols-sm="4" label-cols-lg="3">
                    <b-button
                      type="submit"
                      variant="primary"
                      :disabled="!customIPTHasChanged()"
                      v-on:click.stop="onCustomIPTUpdate($event)"
                      >{{ btnUpdateTitle }}</b-button
                    >
                  </b-form-group>
                </b-card>
                <b-card
                  header="NMS"
                  :title="$t('config-gateway-99')"
                  :sub-title="$t('config-gateway-100')"
                >
                  <b-form-group
                    :label="$t('config-gateway-88')"
                    label-cols-sm="4"
                    label-cols-lg="3"
                    :description="$t('config-gateway-79')"
                  >
                    <b-input-group prepend="Host" class="mt-2">
                      <b-form-input
                        id="smf-gw-custom-nms-address"
                        type="text"
                        v-model="tabCustom.data.nms.address"
                        required
                        v-b-popover.hover="'Specify bind address'"
                        :title="$t('config-gateway-88')"
                        :placeholder="$t('config-gateway-11') | fmtPlaceholder"
                      />
                      <b-form-input
                        id="smf-gw-custom-nms-port"
                        type="number"
                        v-model.number="tabCustom.data.nms.port"
                        min="1024"
                        max="‭65535‬"
                        required
                      />

                      <b-input-group-append>
                        <b-button
                          variant="info"
                          v-on:click.stop="
                            tabCustom.data.nms.address = '0.0.0.0'
                          "
                          >{{ $t("com-default") }}</b-button
                        >
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                  <b-form-group
                    :label="$t('config-gateway-12')"
                    label-for="smf-custom-nms-user"
                    label-cols-sm="4"
                    label-cols-lg="3"
                    :description="$t('config-gateway-89')"
                  >
                    <b-form-input
                      id="smf-custom-nms-user"
                      type="text"
                      v-model="tabCustom.data.nms.user"
                      required
                      :placeholder="$t('config-gateway-12') | fmtPlaceholder"
                    />
                  </b-form-group>
                  <b-form-group
                    :label="$t('config-gateway-16')"
                    label-for="smf-custom-nms-pwd"
                    label-cols-sm="4"
                    label-cols-lg="3"
                    :description="$t('config-gateway-90')"
                  >
                    <b-input-group>
                      <b-form-input
                        id="smf-custom-nms-pwd"
                        type="text"
                        v-model="tabCustom.data.nms.pwd"
                        required
                        :placeholder="$t('config-gateway-16') | fmtPlaceholder"
                      />
                      <b-input-group-append>
                        <b-button
                          variant="info"
                          v-on:click.stop="generatePasswordNMS($event)"
                          >&#x21ba;</b-button
                        >
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>

                  <b-form-group
                    :label="$t('config-gateway-83')"
                    label-for="smf-custom-nms-enabled"
                    label-cols-sm="4"
                    label-cols-lg="3"
                    :description="$t('config-gateway-82')"
                  >
                    <b-input-group>
                      <b-form-checkbox
                        switch
                        v-model="tabCustom.data.nms.enabled"
                      >
                        {{
                          tabCustom.data.nms.enabled
                            ? $t("config-gateway-40")
                            : $t("config-gateway-41")
                        }}
                      </b-form-checkbox>
                    </b-input-group>
                  </b-form-group>
                  <b-form-group label-cols-sm="4" label-cols-lg="3">
                    <b-button
                      type="submit"
                      variant="primary"
                      :disabled="!customNMSHasChanged()"
                      v-on:click.stop="onCustomNMSUpdate($event)"
                      >{{ btnUpdateTitle }}</b-button
                    >
                  </b-form-group>
                </b-card>
              </b-card-group>
              <b-row class="pt-2">
                <b-col md="12">
                  <b-button v-b-toggle.sidebar-footer>
                    {{ $t("config-gateway-01") }}
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
                        <strong class="mr-auto">{{
                          $t("config-gateway-97")
                        }}</strong>
                        <b-button size="sm" @click="hide">{{
                          $t("action-close")
                        }}</b-button>
                      </div>
                    </template>
                    <div class="px-3 py-2">
                      <b-form-group
                        :label="$t('config-gateway-84')"
                        label-for="smf-gw-custom-ep-1"
                      >
                        <b-form-input
                          id="smf-gw-custom-ep-1"
                          type="text"
                          v-model="tabCustom.data.ipt.ep1"
                          readonly
                          :placeholder="
                            $t('config-gateway-84') | fmtPlaceholder
                          "
                        />
                      </b-form-group>
                      <b-form-group
                        :label="$t('config-gateway-85')"
                        label-for="smf-gw-custom-ep-2"
                      >
                        <b-form-input
                          id="smf-gw-custom-ep-2"
                          type="text"
                          v-model="tabCustom.data.ipt.ep2"
                          readonly
                          :placeholder="
                            $t('config-gateway-85') | fmtPlaceholder
                          "
                        />
                      </b-form-group>
                    </div>
                  </b-sidebar>
                </b-col>
              </b-row>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { webSocket } from "@/mixins/web-socket";
import opLog from "@/components/gateway/smf-table-op-log.vue";
import snapshots from "@/components/gateway/smf-table-snapshots.vue";
import firmware from "@/components/gateway/smf-table-firmware.vue";
import { MESSAGE_REQUEST, MESSAGE_RESPONSE } from "@/constants/msgTypes";
import { SML_CODES } from "@/constants/rootCodes";
import { hasPrivilegesWaitForUser } from "@/mixins/privileges";
import store from "../store";
import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "@/store/modules/user";
import { generatePassword } from "@/shared/generate-password";
import smfServerConfiguration from "@/components/gateway/smf-server-configuration.vue";
import smfServerRootAccessRights from "@/components/gateway/smf-server-root-access-rights.vue";
import smfMeterAccessRights from "@/components/gateway/smf-meter-access-rights.vue";
import smfBrokerConfiguration from "@/components/gateway/smf-broker-configuration.vue";
import mixins from "vue-typed-mixins";
import {
  UIRootAccessMeter,
  UIRootAccessRightsRole,
  UIRootAccessUser
} from "@/api/root-access-rights";
import { BTabs } from "bootstrap-vue";
import { Gateway } from "@/api/gateway";
import { BBroker, BHardwarePorts } from "@/api/broker";

const gatewayTableFields = [
  {
    key: "index",
    class: "text-right small text-muted"
  },
  {
    key: "serverId",
    label: "Server ID",
    sortable: true
  },
  {
    key: "name",
    label: "Name",
    sortable: true
  },
  {
    key: "descr",
    label: "Description",
    sortable: true
  },
  {
    key: "manufacturer",
    label: "Manufacturer",
    sortable: true
  },
  {
    key: "model",
    label: "Model",
    sortable: true
  },
  {
    key: "vFirmware",
    label: "Firmware",
    sortable: true
  },
  {
    key: "userName",
    label: "User",
    sortable: true
  },
  {
    key: "userPwd",
    label: "Password",
    sortable: true
  },
  {
    key: "online",
    label: "Online",
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
        default:
          break;
      }
      return "⛔";
    },
    class: "text-center",
    sortable: true
  }
];

let tmpGateways: any[] = [];

// workaround: https://youtrack.jetbrains.com/issue/WEB-43243
const Vue = mixins(webSocket);

export default Vue.extend({
  name: "smfConfigGateway",
  props: [],
  mixins: [webSocket],
  components: {
    smfServerConfiguration,
    smfServerRootAccessRights,
    smfMeterAccessRights,
    smfBrokerConfiguration,
    opLog,
    snapshots,
    firmware
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
      fields: gatewayTableFields,
      gateways: [] as Gateway[],
      selected: [] as Gateway[],
      sortBy: "name",
      sortDesc: false,
      sortDirection: "desc",
      filter: null as null | string,
      visibleRows: 0,
      //  loading state of SML data
      spinner: {
        status: false,
        ipt: false,
        broker: false,
        firmware: false,
        memory: false,
        meters: false,
        wmbus: false,
        iec: false,
        auth: false,
        log: false,
        custom: false,
        reset: false
      },
      form: {
        tag: "" as string | null,
        serverId: "",
        manufacturer: "solos::Tec",
        descr: "",
        model: "",
        vFirmware: "",
        userName: "",
        userPwd: "",
        online: 0,
        name: ""
      } as Gateway,
      //  gw options
      smfContext: {
        configuration: "configuration",
        statusWord: "status-word",
        ipt: "ipt",
        broker: "broker",
        firmware: "firmware",
        memoryUsage: "memory-usage",
        devices: "devices",
        wirlessMBus: "w-MBus",
        iec: "iec",
        auth: "auth",
        log: "log",
        snapshots: "snapshots",
        custom: "custom interface"
      },
      options: {
        channels: [
          { text: "Status Word", value: "status-word" },
          { text: "IP-Telemetry", value: "ipt" },
          { text: "Firmware", value: "firmware" },
          { text: "Memory", value: "memory-usage" },
          { text: "Meters", value: "devices" },
          { text: "wireless M-Bus", value: "w-MBus" },
          { text: "IEC", value: "iec" },
          { text: "Access", value: "auth" },
          { text: "Operation Log", value: "log" }
        ],
        selected: [],
        allSelected: false,
        indeterminate: false
      },

      //  the selected tab: -1 will ensure that the active attribute forces a tabIndex change event on the first view
      tabIndex: -1,

      gw: {
        status: [] as any[],
        memory: {
          mirror: 0,
          tmp: 0
        }
      },

      ipt: {
        param: [
          {
            host: "",
            port: 26862,
            user: "",
            pwd: "",
            scrambled: true
          },
          {
            host: "",
            port: 26862,
            user: "",
            pwd: "",
            scrambled: true
          }
        ],
        status: {
          host: "",
          local: 0,
          remote: 0
        }
      },
      brokers: [] as BBroker[],
      brokerPorts: null as null | BHardwarePorts,
      meters: {
        values: [] as any,
        selected: [],
        fields: [
          {
            key: "nr",
            label: "Nr",
            sortable: true,
            class: "text-right small"
          },
          {
            key: "ident",
            label: "Ident",
            sortable: true
          },
          // {
          //     key: 'meterId',
          //     label: 'Meter ID',
          //     sortable: true
          // },
          {
            key: "meter",
            label: "Meter",
            sortable: true,
            formatter: (value: string) => {
              return value ? value.toUpperCase() : "?";
            }
          },
          {
            key: "maker",
            label: "Maker",
            sortable: true,
            formatter: (value: any) => {
              return value ? value : "-";
            }
          },
          {
            key: "lastSeen",
            label: "Last Seen",
            sortable: true,
            formatter: (value: any) => {
              return value.toLocaleString();
            }
          },
          {
            key: "type",
            label: "Type",
            sortable: true,
            formatter: (value: number) => {
              switch (value) {
                case 0:
                  return "M-Bus (wired)";
                case 1:
                  return "M-Bus (radio)";
                case 2:
                  return "wM-Bus";
                case 3:
                  return "Serial";
                case 4:
                  return "Gateway";
                case 5:
                  return "BCD";
                case 6:
                  return "EON";
                case 7:
                  return "DKE-1";
                case 8:
                  return "IMEI";
                case 9:
                  return "RWE";
                case 10:
                  return "DKE-2";
                case 11:
                  return "Switch";
                default:
                  break;
              }
              return "Other";
            }
          },
          {
            key: "visible",
            label: "Visible",
            formatter: (value: boolean) => (value ? "✔" : "✖")
          },
          {
            key: "active",
            label: "Active"
          },
          {
            key: "serverId",
            label: "Server ID",
            sortable: true
          },
          {
            key: "edit",
            label: "Edit"
          }
        ],
        sortBy: "meter",
        sortDesc: false,
        sortDirection: "desc",
        csv: ""
      },

      //  firmware
      fw: {
        values: [] as any,
        selected: []
      },

      //  wireless M-Bus
      wmbus: {
        type: "",
        id: "",
        firmware: "",
        hardware: "",
        power: "basic",
        reboot: 86400,
        protocol: "S",
        active: true,
        sMode: 0,
        tMode: 0,
        "123456": true
      },
      serverRootAccessRights: null,
      meterAccessRights: null,
      iec: {
        params: {
          // TODO @michael: is i a good idea to use same OBIS codes here? - no :)
          "8181C79301FF": false, // active
          autoActivation: true,
          loopTime: 3600,
          maxDataRate: 10240,
          minTimeout: 200,
          maxTimeout: 5000,
          maxVar: 9,
          protocolMode: "C",
          retries: 3,
          rs485: null,
          timeGrid: 900,
          timeSync: 14400,
          devices: []
        } as any,
        selected: [],
        fields: [
          {
            key: "nr",
            label: "Nr",
            sortable: true,
            class: "text-right small"
          },
          {
            key: "8181C7930AFF",
            label: "Name",
            sortable: true
          },
          {
            key: "8181C7930BFF",
            label: "Baudrate",
            sortable: true
          },
          {
            key: "8181C7930CFF",
            label: "Address",
            sortable: true
          },
          {
            key: "8181C7930DFF",
            label: "P1",
            sortable: false,
            formatter: (value: any) => {
              if (value) return value;
              return "-";
            }
          },
          {
            key: "8181C7930EFF",
            label: "W5",
            sortable: false,
            formatter: (value: any) => {
              if (value) return value;
              return "-";
            }
          }
        ],
        sortBy: "8181C7930AFF",
        sortDesc: false,
        sortDirection: "desc"
      },
      tabOpLog: {
        data: {
          items: [] as any
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
          items: [
            {
              nr: 1,
              utc: new Date(),
              serverId: "0500153B02297E",
              remark: "nice description"
            }
          ]
        },
        nav: {
          currentPage: 1,
          visibleRows: 0,
          perPage: 5
        }
      },
      tabCustom: {
        dataItpUnchangedString: "",
        dataNmsUnchangedString: "",
        data: {
          ipt: {
            firstAddress: "129.168.1.229",
            firstMask: "255.255.255.0",
            port: "7259",
            dhcp: false,
            secondAddress: "129.168.1.229",
            secondMask: "255.255.255.0",
            ep1: "0.0.0.0",
            ep2: "0.0.0.0"
          },
          nms: {
            address: "0.0.0.0",
            port: "7261",
            user: "operator",
            pwd: "operator",
            enabled: true
          }
        }
      }
    };
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

    ws_on_data(obj: any) {
      if (obj.cmd != null) {
        // console.log('websocket received ' + obj.cmd);
        if (obj.cmd === "update") {
          if (obj.channel != null) {
            console.log("update channel: " + obj.channel);
            if (obj.channel === MESSAGE_RESPONSE.getProcParameter) {
              //console.log("section :::" + obj.section + ":::");
              //console.log(obj.rec.values);
              if (obj.section[0] === SML_CODES.CLASS_OP_LOG_STATUS_WORD) {
                //  hide loading spinner
                this.spinner.status = false;
                this.gw.status = [];
                // state.variant">{{state.value}
                if (obj.rec.values.word.FATAL_ERROR) {
                  this.gw.status.push({
                    value: "ERROR state",
                    variant: "danger"
                  });
                } else {
                  this.gw.status.push({
                    value: "Ready for operation",
                    variant: null
                  });
                }

                if (obj.rec.values.word.AUTHORIZED_IPT) {
                  this.gw.status.push({
                    value: "IP-T connection established",
                    variant: "success"
                  });
                } else {
                  this.gw.status.push({
                    value: "no IP-T master",
                    variant: "warning"
                  });
                }

                if (obj.rec.values.word.OUT_OF_MEMORY) {
                  this.gw.status.push({
                    value: "out of memory",
                    variant: "warning"
                  });
                } else {
                  this.gw.status.push({
                    value: "sufficient memory",
                    variant: "success"
                  });
                }

                if (obj.rec.values.word.SERVICE_IF_AVAILABLE) {
                  this.gw.status.push({
                    value: "customer interface available",
                    variant: null
                  });
                } else {
                  this.gw.status.push({
                    value: "no customer interface",
                    variant: null
                  });
                }

                if (obj.rec.values.word.EXT_IF_AVAILABLE) {
                  this.gw.status.push({
                    value: "extension interface available",
                    variant: null
                  });
                } else {
                  this.gw.status.push({
                    value: "no extension interface",
                    variant: null
                  });
                }

                if (obj.rec.values.word.WIRELESS_BUS_IF_AVAILABLE) {
                  this.gw.status.push({
                    value: "wireless M-Bus interface available",
                    variant: "success"
                  });
                } else {
                  this.gw.status.push({
                    value: "no wireless M-Bus interface",
                    variant: null
                  });
                }

                if (obj.rec.values.word.PLC_AVAILABLE) {
                  this.gw.status.push({
                    value: "PLC interface available",
                    variant: null
                  });
                } else {
                  this.gw.status.push({
                    value: "no PLC interface",
                    variant: null
                  });
                }

                if (obj.rec.values.word.WIRED_MBUS_IF_AVAILABLE) {
                  this.gw.status.push({
                    value: "wired M-Bus interface available",
                    variant: "success"
                  });
                } else {
                  this.gw.status.push({
                    value: "no wired M-Bus interface",
                    variant: null
                  });
                }

                if (obj.rec.values.word.NO_TIMEBASE) {
                  this.gw.status.push({
                    value: "uncertain timebase",
                    variant: "dark"
                  });
                } else {
                  this.gw.status.push({
                    value: "NTP is running (Time base is secure)",
                    variant: "success"
                  });
                }
              } else if (
                obj.section[0] === SML_CODES.CODE_ROOT_VISIBLE_DEVICES
              ) {
                Object.values(obj.rec.values).forEach((e: any) => {
                  //console.log(e);
                  const lastSeenVisible =
                    e[SML_CODES.CURRENT_UTC] != null
                      ? new Date(e[SML_CODES.CURRENT_UTC].substring(0, 19))
                      : new Date();

                  const recVisible = {
                    tag: e.tag[0],
                    nr: e.nr,
                    ident: e[SML_CODES.CODE_SERVER_ID],
                    meter: e.serial,
                    maker: e.maker,
                    lastSeen: lastSeenVisible,
                    type: e.type,
                    visible: true,
                    active: false,
                    serverId: obj.rec.srv
                  } as any;

                  if (obj.rec.values.type < 2) {
                    recVisible["_rowVariant"] = "success";
                  }
                  //console.log("visisble ", recVisible);
                  this.meters.values.push(recVisible);
                });
              } else if (
                obj.section[0] === SML_CODES.CODE_ROOT_ACTIVE_DEVICES
              ) {
                //  hide loading spinner
                this.spinner.meters = false;

                Object.values(obj.rec.values).forEach((e: any) => {
                  //console.log("active", e);
                  let recActive = this.meters.values.find((meter: any) => {
                    //console.log('active device: compare ' + meter.ident + ' <> ' + e[SML_CODES.CODE_SERVER_ID]);
                    if (meter.ident === e[SML_CODES.CODE_SERVER_ID]) {
                      meter.active = true;
                      meter.tag = obj.rec.values.tag;
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
                    const lastSeenVisible =
                      e[SML_CODES.CURRENT_UTC] != null
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
                      tag: e.tag[0],
                      mc: e.mc
                    };

                    if (obj.rec.values.type < 2) {
                      recActive["_rowVariant"] = "success";
                    }

                    //console.log("active ", recActive);
                    this.meters.values.push(recActive);
                  }
                });

                //
                //  update download link
                //
                this.meterTableComplete();
              } else if (obj.section[0] === SML_CODES.CODE_ROOT_DEVICE_IDENT) {
                //  hide loading spinner
                this.spinner.firmware = false;
                //  firmware
                //  iterate over 8181C78206FF
                //  this is an array of objects
                const srv = obj.rec.values["8181C78204FF"];
                const values = Object.values(obj.rec.values["8181C78206FF"]);
                //console.log(values);
                values.forEach((e: any, idx: number) => {
                  //console.log(e);
                  const rec = {
                    nr: idx,
                    name: e["8181C78208FF"],
                    version: e["818100020000"],
                    active: e["8181C7820EFF"],
                    srv: srv
                  };
                  this.fw.values.push(rec);
                });
              } else if (obj.section[0] === SML_CODES.CODE_ROOT_MEMORY_USAGE) {
                //  hide loading spinner
                this.spinner.memory = false;
                this.gw.memory.mirror = obj.rec.values["0080800011FF"];
                this.gw.memory.tmp = obj.rec.values["0080800012FF"];
              } else if (obj.section[0] === SML_CODES.CODE_ROOT_W_MBUS_STATUS) {
                this.wmbus.type = obj.rec.values["810600000100"];
                this.wmbus.id = obj.rec.values["810600000300"];
                this.wmbus.firmware = obj.rec.values["810600020000"];
                this.wmbus.hardware = obj.rec.values["8106000203FF"];
              } else if (obj.section[0] === SML_CODES.CODE_IF_wMBUS) {
                //  hide loading spinner
                this.spinner.wmbus = false;

                //  radio protocol (T-mode, S-mode, S/T automatic, S/T parallel)
                switch (obj.rec.values[SML_CODES.W_MBUS_PROTOCOL]) {
                  case 0:
                    this.wmbus.protocol = "T";
                    break;
                  case 1:
                    this.wmbus.protocol = "S";
                    break;
                  case 2:
                    this.wmbus.protocol = "A";
                    break;
                  case 3:
                    this.wmbus.protocol = "P";
                    break;
                  default:
                    break;
                }
                switch (obj.rec.values[SML_CODES.W_MBUS_POWER]) {
                  case 0:
                    this.wmbus.power = "low";
                    break;
                  default:
                    this.wmbus.power = "basic";
                    break;
                }
                //  reboot (seconds)
                this.wmbus.reboot = obj.rec.values[SML_CODES.W_MBUS_REBOOT];
                //  install mode
                this.wmbus.active =
                  obj.rec.values[SML_CODES.W_MBUS_INSTALL_MODE];
                this.wmbus.sMode = obj.rec.values[SML_CODES.W_MBUS_MODE_S];
                this.wmbus.tMode = obj.rec.values[SML_CODES.W_MBUS_MODE_T];
              } else if (obj.section[0] === SML_CODES.CODE_ROOT_IPT_STATE) {
                this.ipt.status.host = obj.rec.values["814917070000"];
                this.ipt.status.local = obj.rec.values["81491A070000"];
                this.ipt.status.remote = obj.rec.values["814919070000"];
              } else if (obj.section[0] === SML_CODES.CODE_ROOT_IPT_PARAM) {
                //console.log(obj.rec.values);
                //  hide loading spinner
                this.spinner.ipt = false;
                this.ipt.param[0].host =
                  obj.rec.values["81490D070001"]["814917070001"];
                this.ipt.param[0].port =
                  obj.rec.values["81490D070001"]["81491A070001"];
                this.ipt.param[0].user =
                  obj.rec.values["81490D070001"]["8149633C0101"];
                this.ipt.param[0].pwd =
                  obj.rec.values["81490D070001"]["8149633C0201"];
                this.ipt.param[0].scrambled =
                  obj.rec.values["81490D070001"]["8149633C0301"];

                this.ipt.param[1].host =
                  obj.rec.values["81490D070002"]["814917070002"];
                this.ipt.param[1].port =
                  obj.rec.values["81490D070002"]["81491A070002"];
                this.ipt.param[1].user =
                  obj.rec.values["81490D070002"]["8149633C0102"];
                this.ipt.param[1].pwd =
                  obj.rec.values["81490D070002"]["8149633C0202"];
                this.ipt.param[1].scrambled =
                  obj.rec.values["81490D070002"]["8149633C0302"];
              } else if (obj.section[0] === SML_CODES.CODE_ROOT_BROKER) {
                console.log(obj);
                this.spinner.broker = false;
                this.brokers = obj.rec.values.brokers;
              } else if (obj.section[0] === SML_CODES.CODE_ROOT_HARDWARE_PORT) {
                console.log(obj);
                this.brokerPorts = obj.rec.values;
              } else if (obj.section[0] === SML_CODES.CODE_IF_1107) {
                //  hide loading spinner
                this.spinner.iec = false;

                this.iec.params[SML_CODES.IF_1107_ACTIVE] =
                  obj.rec.values[SML_CODES.IF_1107_ACTIVE];
                this.iec.params.loopTime =
                  obj.rec.values[SML_CODES.IF_1107_LOOP_TIME];
                this.iec.params.retries =
                  obj.rec.values[SML_CODES.IF_1107_RETRIES];
                this.iec.params.minTimeout =
                  obj.rec.values[SML_CODES.IF_1107_MIN_TIMEOUT];
                this.iec.params.maxTimeout =
                  obj.rec.values[SML_CODES.IF_1107_MAX_TIMEOUT];
                this.iec.params.maxDataRate =
                  obj.rec.values[SML_CODES.IF_1107_MAX_DATA_RATE];
                this.iec.params.rs485 = Boolean(
                  obj.rec.values[SML_CODES.IF_1107_RS485]
                );
                this.iec.params.autoActivation =
                  obj.rec.values[SML_CODES.IF_1107_AUTO_ACTIVATION];
                this.iec.params.timeGrid =
                  obj.rec.values[SML_CODES.IF_1107_TIME_GRID];
                this.iec.params.timeSync =
                  obj.rec.values[SML_CODES.IF_1107_TIME_SYNC];
                this.iec.params.maxVar =
                  obj.rec.values[SML_CODES.IF_1107_MAX_VARIATION];
                switch (obj.rec.values[SML_CODES.IF_1107_PROTOCOL_MODE]) {
                  case 0:
                    this.iec.params.protocolMode = "A";
                    break;
                  case 1:
                    this.iec.params.protocolMode = "B";
                    break;
                  case 2:
                    this.iec.params.protocolMode = "C";
                    break;
                  case 3:
                    this.iec.params.protocolMode = "D";
                    break;
                  case 4:
                    this.iec.params.protocolMode = "E";
                    break;
                  default:
                    this.iec.params.protocolMode =
                      obj.rec.values[SML_CODES.IF_1107_PROTOCOL_MODE];
                    break;
                }
                //  object
                const whatIsThis = obj.rec.values["8181C79309FF"];
                this.iec.params.devices = whatIsThis
                  ? Array.from(whatIsThis)
                  : [];
              } else if (obj.section[0] === SML_CODES.CODE_ROOT_ACCESS_RIGHTS) {
                this.spinner.auth = false;
                console.log(
                  "update channel " +
                    obj.channel +
                    ", section " +
                    obj.section[0]
                );
                console.log(obj);
                if (obj.section.length === 1) {
                  this.serverRootAccessRights = obj.rec;
                } else {
                  // section contains the path
                  this.meterAccessRights = obj.rec;
                }
              } else if (obj.section[0] === SML_CODES.CODE_DEVICE_CLASS) {
                console.log(
                  "update channel " + obj.channel + " ToDo: " + obj.section[0]
                );
              } else if (obj.section[0] === SML_CODES.DATA_MANUFACTURER) {
                console.log(
                  "update channel " + obj.channel + " ToDo: " + obj.section[0]
                );
              } else if (obj.section[0] === SML_CODES.CODE_SERVER_ID) {
                console.log(
                  "update channel " + obj.channel + " ToDo: " + obj.section[0]
                );
              } else if (
                obj.section[0] === SML_CODES.CODE_ROOT_CUSTOM_INTERFACE
              ) {
                this.spinner.custom = false;
                //console.log(obj.rec.values);
                this.tabCustom.data.ipt.firstAddress =
                  obj.rec.values[SML_CODES.CUSTOM_IF_IP_ADDRESS_1];
                this.tabCustom.data.ipt.firstMask =
                  obj.rec.values[SML_CODES.CUSTOM_IF_IP_MASK_1];
                //this.tabCustom.data.ipt.port = const
                this.tabCustom.data.ipt.dhcp =
                  obj.rec.values[SML_CODES.CUSTOM_IF_DHCP];
                this.tabCustom.data.ipt.secondAddress =
                  obj.rec.values[SML_CODES.CUSTOM_IF_IP_ADDRESS_2];
                this.tabCustom.data.ipt.secondMask =
                  obj.rec.values[SML_CODES.CUSTOM_IF_IP_MASK_2];
              } else if (obj.section[0] === SML_CODES.CODE_ROOT_CUSTOM_PARAM) {
                console.log(obj.rec.values);
                this.tabCustom.data.ipt.ep1 = obj.rec.values["810217070000"];
                this.tabCustom.data.ipt.ep1 = obj.rec.values["810217070002"];
              } else if (obj.section[0] === SML_CODES.CODE_ROOT_NMS) {
                console.log(obj.rec.values);
                this.tabCustom.data.nms.address =
                  obj.rec.values["9200000001FF"];
                this.tabCustom.data.nms.port = obj.rec.values["9200000002FF"];
                this.tabCustom.data.nms.user = obj.rec.values["9200000003FF"];
                this.tabCustom.data.nms.pwd = obj.rec.values["9200000004FF"];
                this.tabCustom.data.nms.enabled =
                  obj.rec.values["9200000005FF"];
              } else {
                console.error(
                  "update channel " +
                    obj.channel +
                    " with unknown section " +
                    obj.section
                );
              }
              this.tabCustom.dataItpUnchangedString = JSON.stringify(
                this.tabCustom.data.ipt
              );
              this.tabCustom.dataNmsUnchangedString = JSON.stringify(
                this.tabCustom.data.nms
              );
            } else if (obj.channel === MESSAGE_RESPONSE.getProfileList) {
              //console.log(obj.rec.values['8181C789E2FF'] + ", size: "+ this.tabOpLog.data.items.length);
              if (obj.section[0] === SML_CODES.CLASS_OP_LOG) {
                //  get timestamp
                const utc =
                  obj.rec.values["010000090B00"] != null
                    ? new Date(obj.rec.values["010000090B00"].substring(0, 19))
                    : new Date();

                //  build record
                let rec = {
                  index: this.tabOpLog.data.items.length,
                  status: obj.rec.values.status,
                  event: obj.rec.values["8181C789E2FF"],
                  peer: obj.rec.values["8181000000FF"],
                  utc: utc,
                  serverId: obj.rec.values["8181C78204FF"],
                  target: obj.rec.values["8147170700FF"],
                  //target: 'T:' + obj.rec.values.evtType + ' S:' + obj.rec.values.evtSource + ' L:' + obj.rec.values.evtLevel,
                  pushNr: obj.rec.values["8181C78A01FF"],
                  details: obj.rec.values["8181C78123FF"]
                };
                this.tabOpLog.data.items.push(rec);
                //    update pagination
                this.tabOpLog.nav.visibleRows = this.tabOpLog.data.items.length;
              } else {
                console.error(
                  "update channel " +
                    obj.channel +
                    " with unknown section " +
                    obj.section
                );
              }
            } else if (obj.channel === "attention.code") {
              // Vue.toasted.show('ATTENTION please!');
              if (obj.section[0] === "8181c7c7fd00") {
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
              //  hide loading spinner
              this.spinner.status = false;
              this.spinner.ipt = false;
              this.spinner.firmware = false;
              this.spinner.meters = false;
              this.spinner.wmbus = false;
              this.spinner.iec = false;
              this.spinner.custom = false;
              this.meterAccessRights = null;
            } else if (obj.channel === "table.gateway.count") {
              //  unused
            } else if (obj.channel === "cache.reset") {
              console.log(obj, " cache reset");
              this.spinner.reset = false;
              //this.sections.active = obj.section;
            } else if (obj.channel === "cache.sections") {
              console.log(obj, " list sections");
              //this.sections.active = obj.section;
            } else if (obj.channel === "cache.update") {
              console.log(obj, " cache.update");
            } else if (obj.channel === "cache.query") {
              console.log(obj, " cache.query");
            } else {
              console.warn("update unknown channel " + obj.channel, obj);
            }
          }
        } else if (obj.cmd === "insert") {
          let rec: any = {
            tag: obj.rec.key.tag,
            serverId: obj.rec.data.serverId,
            manufacturer: obj.rec.data.manufacturer,
            descr: obj.rec.data.descr,
            name: obj.rec.data.name,
            model: obj.rec.data.model,
            vFirmware: obj.rec.data.vFirmware,
            userName: obj.rec.data.userName,
            userPwd: obj.rec.data.userPwd,
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
            tmpGateways.push(rec);
          } else {
            //  operational insert
            this.gateways.push(rec);
          }
        } else if (obj.cmd === "modify") {
          //console.log('lookup gateway ' + obj.key[0]);
          this.gateways.find(function(rec: any) {
            //console.log('compare ' + obj.key[0] + ' <==> ' + rec.tag);
            if (rec.tag === obj.key[0]) {
              //console.log('modify record ' + rec.name);
              if (obj.value.serverId != null) {
                rec.serverId = obj.value.serverId;
              } else if (obj.value.manufacturer != null) {
                rec.manufacturer = obj.value.manufacturer;
              } else if (obj.value.descr != null) {
                rec.descr = obj.value.descr;
              } else if (obj.value.userName != null) {
                rec.userName = obj.value.userName;
              } else if (obj.value.userPwd != null) {
                rec.userPwd = obj.value.userPwd;
              } else if (obj.value.online != null) {
                rec.online = obj.value.online;
                if (obj.value.online === 1) {
                  //  cause possibly an update problem
                  rec["_rowVariant"] = "success";
                } else if (obj.value.online === 2) {
                  rec["_rowVariant"] = "warning";
                } else if (obj.value.online === 3) {
                  rec["_rowVariant"] = "secondary";
                } else {
                  rec["_rowVariant"] = null;
                }
                //  force refresh: https://github.com/bootstrap-vue/bootstrap-vue/issues/1529
                // this.$refs.devTable.refresh();
              }
            }
          });
        } else if (obj.cmd === "clear") {
          //  clear table
          this.gateways = [];
          this.meters.values = [];
          this.tabOpLog.data.items = [];
        } else if (obj.cmd === "delete") {
          const idx = this.gateways.findIndex(
            (rec: any) => rec.tag === obj.key[0]
          );
          this.gateways.splice(idx, 1);
        } else if (obj.cmd === "load") {
          //  load status
          if (obj.show != null) {
            this.isBusy = obj.show;
            tmpGateways = [];
          }
          if (obj.level !== 100) {
            this.busyLevel = obj.level;
          } else {
            this.gateways = tmpGateways;
          }
        } else {
          console.log("websocket received unknown command " + obj.cmd);
        }

        //    update pagination
        this.visibleRows = this.gateways.length;
      }
    },
    updateSmfContext() {
      const bTabs = this.$refs.tabs as BTabs;
      const smfContext = bTabs.tabs[this.tabIndex].$attrs["smf-context"];
      console.log(`${smfContext} selected`);

      const pkGateway = this.selected[0].tag as string;
      if (smfContext === this.smfContext.statusWord) {
        this.spinner.status = true;
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CLASS_OP_LOG_STATUS_WORD,
          [pkGateway]
        );
      } else if (smfContext === this.smfContext.ipt) {
        this.spinner.ipt = true;
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_IPT_PARAM,
          [pkGateway]
        );
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_IPT_STATE,
          [pkGateway]
        );
      } else if (smfContext === this.smfContext.broker) {
        this.spinner.broker = true;
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_BROKER,
          [pkGateway]
        );
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_HARDWARE_PORT,
          [pkGateway]
        );
      } else if (smfContext === this.smfContext.firmware) {
        this.fw.values = [];
        this.spinner.firmware = true;
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_DEVICE_IDENT,
          [pkGateway]
        );
      } else if (smfContext === this.smfContext.memoryUsage) {
        this.spinner.memory = true;
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_MEMORY_USAGE,
          [pkGateway]
        );
      } else if (smfContext === this.smfContext.devices) {
        this.meters.values = [];
        this.spinner.meters = true;
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_VISIBLE_DEVICES,
          [pkGateway]
        );
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_ACTIVE_DEVICES,
          [pkGateway]
        );
      } else if (smfContext === this.smfContext.wirlessMBus) {
        this.spinner.wmbus = true;
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_W_MBUS_STATUS,
          [pkGateway]
        );
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_IF_wMBUS,
          [pkGateway]
        );
      } else if (smfContext === this.smfContext.iec) {
        this.spinner.iec = true;
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_IF_1107,
          [pkGateway]
        );
      } else if (smfContext === this.smfContext.auth) {
        this.spinner.auth = true;
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_ACCESS_RIGHTS,
          [pkGateway],
          { serverId: this.form.serverId, path: [] }
        );
      } else if (smfContext === this.smfContext.log) {
        this.tabOpLog.data.items = [];
        this.spinner.log = true;
        this.ws_submit_request(
          MESSAGE_REQUEST.getProfileList,
          SML_CODES.CLASS_OP_LOG,
          [pkGateway],
          { range: Number(this.tabOpLog.form.selected) * 24 }
        ); //  hours
      } else if (smfContext === this.smfContext.custom) {
        this.spinner.custom = true;
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_CUSTOM_INTERFACE,
          [pkGateway]
        );
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_CUSTOM_PARAM,
          [pkGateway]
        );
        this.ws_submit_request(
          MESSAGE_REQUEST.getProcParameter,
          SML_CODES.CODE_ROOT_NMS,
          [pkGateway]
        );
      }
    },
    tabSelected() {
      // at elast one item (e.g. gateway) is always selected
      // get the context of the selected tab
      this.updateSmfContext();
    },
    rowSelected(items: Gateway[]) {
      this.selected = items;
      this.form.serverId = "";
      this.form.name = "";
      this.form.tag = null;
      if (items.length > 0) {
        this.form.serverId = items[0].serverId;
        this.form.name = items[0].name;
        this.form.tag = items[0].tag;
        if (items.length === 1) {
          // the tabs are rendered only if an item is selected - so wait a tick until the tabs-element is there
          setTimeout(() => this.updateSmfContext());
        }
      }
    },
    meterSelected(items: any) {
      this.meters.selected = items;
      if (items.length > 0) {
        console.log("selected " + items[0].ident);
      } else {
        //  ToDo: ...
      }
    },
    generatePasswordIPT(event: Event, element: any) {
      event.preventDefault();
      this.ipt.param[element].pwd = generatePassword();
    },
    generatePasswordNMS(event: Event) {
      event.preventDefault();
      //    ToDo: throws exception "property 'pwd' is undefined" - why?
      this.tabCustom.data.nms.pwd = generatePassword();
    },

    onFiltered(filteredItems: any[]) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.visibleRows = filteredItems.length;
      this.currentPage = 1;
    },

    onIPTUpdate(event: Event, index: number) {
      event.preventDefault();
      //console.log(this.ipt.param[index]);
      this.ws_submit_request(
        MESSAGE_REQUEST.setProcParameter,
        SML_CODES.CODE_ROOT_IPT_PARAM,
        [this.form.tag!],
        { index: index + 1, ipt: this.ipt.param[index] }
      );
    },
    customIPTHasChanged() {
      return (
        this.tabCustom.dataItpUnchangedString !==
        JSON.stringify(this.tabCustom.data.ipt)
      );
    },
    onCustomIPTUpdate(event: Event) {
      event.preventDefault();
      console.log(this.tabCustom.data.ipt);
      this.ws_submit_request(
        MESSAGE_REQUEST.setProcParameter,
        SML_CODES.CODE_ROOT_CUSTOM_INTERFACE,
        [this.form.tag!],
        this.tabCustom.data.ipt
      );
    },
    customNMSHasChanged() {
      return (
        this.tabCustom.dataNmsUnchangedString !==
        JSON.stringify(this.tabCustom.data.nms)
      );
    },
    onCustomNMSUpdate(event: Event) {
      event.preventDefault();
      console.log(this.tabCustom.data.nms);
      this.ws_submit_request(
        MESSAGE_REQUEST.setProcParameter,
        SML_CODES.CODE_ROOT_BROKER,
        [this.form.tag!],
        this.tabCustom.data.nms
      );
    },
    onBrokersUpdate(brokers: BBroker[]) {
      console.log(JSON.stringify(brokers));
      this.ws_submit_request(
        MESSAGE_REQUEST.setProcParameter,
        SML_CODES.CODE_ROOT_BROKER,
        [this.form.tag!],
        { brokers }
      );
    },
    onBrokerHardwarePortUpdate(hardwarePort: BHardwarePorts) {
      console.log(JSON.stringify(hardwarePort));
      //{ "COM3": { "databits": 8, "parity": "none", "flowcontrol": "none", "stopbits": "two", "baudrate": 57600 } }
      this.ws_submit_request(
        MESSAGE_REQUEST.setProcParameter,
        SML_CODES.CODE_ROOT_HARDWARE_PORT,
        [this.form.tag!],
        hardwarePort
      );
    },
    onMeterDelete(item: any) {
      this.ws_submit_request(
        MESSAGE_REQUEST.setProcParameter,
        SML_CODES.CODE_DELETE_DEVICE,
        [this.form.tag!],
        { nr: item.nr, meter: item.ident }
      );
    },
    onMeterActivate(item: any) {
      if (item.active) {
        this.ws_submit_request(
          MESSAGE_REQUEST.setProcParameter,
          SML_CODES.CODE_DEACTIVATE_DEVICE,
          [this.form.tag!],
          { nr: item.nr, meter: item.ident }
        );
      } else {
        this.ws_submit_request(
          MESSAGE_REQUEST.setProcParameter,
          SML_CODES.CODE_ACTIVATE_DEVICE,
          [this.form.tag!],
          { nr: item.nr, meter: item.ident }
        );
      }
    },
    onMeterEdit(item: any) {
      this.$router.push({
        name: "smfConfigMeter",
        params: { meterPk: item.tag }
      });
    },
    onWMbusUpdate() {
      this.ws_submit_request(
        MESSAGE_REQUEST.setProcParameter,
        SML_CODES.CODE_IF_wMBUS,
        [this.form.tag!],
        { wmbus: this.wmbus }
      );
    },
    onIECUpdate() {
      this.ws_submit_request(
        MESSAGE_REQUEST.setProcParameter,
        SML_CODES.CODE_IF_1107,
        [this.form.tag!],
        { iec: this.iec.params }
      );
    },

    meterTableComplete() {
      let csv = "Ident;Meter;Maker;ServerId\n";
      this.meters.values.forEach(function(row: any) {
        //console.log(row.ident);
        csv +=
          row.ident +
          ";" +
          row.meter +
          ";" +
          row.maker +
          ";" +
          row.serverId +
          "\n";
      });
      const data = new Blob([csv]);
      this.meters.csv = URL.createObjectURL(data);
    },
    btnEditStatus(mc: any) {
      // console.log("btnEditStatus " , mc);
      if (typeof mc == "undefined") return true;
      return mc.length > 2 && mc.startsWith("MC");
    },
    onProxyCacheReset() {
      this.spinner.reset = true;
      this.ws_proxy(
        "cache.reset",
        [this.form.tag!],
        [
          SML_CODES.CLASS_OP_LOG_STATUS_WORD,
          SML_CODES.CODE_ROOT_IPT_PARAM,
          SML_CODES.CODE_ROOT_ACCESS_RIGHTS,
          SML_CODES.CODE_ROOT_ACTIVE_DEVICES,
          SML_CODES.CODE_ROOT_VISIBLE_DEVICES
        ]
      );
    },
    onProxyCacheSections() {
      this.ws_proxy("cache.sections", [this.form.tag!]);
    },
    onProxyCacheUpdate() {
      this.ws_proxy(
        "cache.update",
        [this.form.tag!],
        [SML_CODES.CODE_ROOT_ACCESS_RIGHTS]
      );
    },
    onProxyCacheSync() {
      //  create snapshot of current configuration
      this.ws_proxy(
        "cache.sync",
        [this.form.tag!],
        [
          SML_CODES.CODE_ROOT_ACCESS_RIGHTS,
          SML_CODES.CODE_ROOT_ACTIVE_DEVICES,
          SML_CODES.CODE_ROOT_VISIBLE_DEVICES
        ]
      );
    },
    onProxyCacheQuery() {
      this.ws_proxy(
        "cache.query",
        [this.form.tag!],
        [SML_CODES.CODE_ROOT_ACCESS_RIGHTS]
      );
    },
    onQueryMeter(
      {
        role,
        user,
        meter
      }: {
        role: UIRootAccessRightsRole;
        user: UIRootAccessUser;
        meter: UIRootAccessMeter;
      } /* meter, user, role */
    ) {
      // set the current visible meter access rights to null -> make them unvisible
      this.meterAccessRights = null;

      this.ws_submit_request(
        MESSAGE_REQUEST.getProcParameter,
        SML_CODES.CODE_ROOT_ACCESS_RIGHTS,
        [this.form.tag!],
        //  path is [role, user, meterID]
        {
          serverId: this.form.serverId,
          path: [role.role, user.userId, meter.nr]
        }
      );
    }
  },

  computed: {
    tableCaption(): string {
      return (
        this.selected.length + "/" + this.gateways.length + " item(s) selected"
      );
    },
    btnUpdateTitle(): string {
      if (this.selected.length > 0) {
        return "Update " + this.selected[0].serverId;
      }
      return "Update";
    },
    btnEdit() {
      return "Edit";
    },
    isRecordSelected(): boolean {
      return this.selected.length !== 0;
    },
    wmbusRebootPrep(): string {
      if (this.wmbus.reboot > 3600) {
        return (this.wmbus.reboot / 3600).toFixed(2) + " h";
      } else if (this.wmbus.reboot > 60) {
        return (this.wmbus.reboot / 60).toFixed(2) + " min";
      } else if (this.wmbus.reboot === 0) {
        return "OFF";
      }
      return this.wmbus.reboot + " sec.";
    },
    linkMeterDownloadTitle(): string {
      if (this.selected.length > 0) {
        return (
          "Download " +
          this.meters.values.length +
          " meter records from gateway " +
          this.selected[0].name
        );
      }
      return "Download meter table";
    },
    createWsDelegate() {
      return {
        ws_submit_record: (cmd: any, channel: any, obj: any) => {
          this.ws_submit_record(cmd, channel, obj);
        },
        ws_submit_key: (cmd: any, channel: any, key: any) => {
          this.ws_submit_key(cmd, channel, key);
        },
        ws_submit_request: (
          msgType: any,
          root: any,
          pk_gw: any,
          params: any
        ) => {
          this.ws_submit_request(msgType, root, pk_gw, params);
        }
      };
    }
  },

  watch: {},
  beforeRouteEnter(to: any, from: any, next: any) {
    hasPrivilegesWaitForUser(
      store,
      MODULES.CONFIG_GATEWAY,
      PRIVILEGES.VIEW
    ).then(result => {
      next(result ? true : NO_ACCESS_ROUTE);
    });
  }
});
</script>

<style lang="scss" scoped>
.smfServerRootAccessRights {
  margin: 1em 0;
}
</style>
