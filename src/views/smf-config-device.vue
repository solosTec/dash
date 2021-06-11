<template lang="html">
  <section class="smf-config-device">
    <template>
      <div>
        <vue-headful
          description="SMF dashboard"
          keywords="SMF, solosTec"
          title="smf :: config devices"
        />
      </div>
    </template>

    <b-jumbotron
      :header="$t('header-device')"
      :lead="$t('lead-device', { count: this.devices.length })"
      fluid
    />

    <b-container fluid>
      <b-row>
        <b-col md="12">
          <smf-data-table
            :busyLevel="busyLevel"
            :fields="fields"
            :items="devices"
            tableName="devices"
            @itemSelected="selected = $event"
          >
            <template v-slot:editButtons>
              <smf-table-edit-buttons
                :selectedItems="selected"
                @onUpdate="onDeviceUpdate"
                @onExecuteDelete="onExecuteDeviceDelete"
                @onInsert="onDeviceInsert"
              ></smf-table-edit-buttons>
            </template>

            <template v-slot:cell(descr)="data">
              <span v-b-popover.hover="data.value" :title="data.item.name">{{
                formatDescription(data.value)
              }}</span>
            </template>

            <template v-slot:cell(enabled)="data">
              <b-form-group>
                <b-form-checkbox
                  v-model="data.value"
                  switch
                  @change="switchEnableState($event, data.item.tag)"
                >
                </b-form-checkbox>
              </b-form-group>
            </template>
          </smf-data-table>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import {
  Channel,
  Cmd,
  webSocket,
  WSDeleteResponse,
  WSInsertResponse,
  WSLoadResponse,
  WSModifyResponse,
  WSResponse
} from "@/mixins/web-socket";
import store from "./../store/index";
import { hasPrivilegesWaitForUser } from "@/mixins/privileges";
import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "@/store/modules/user";
import smfDataTable from "@/components/smf-data-table.vue";
import smfTableEditButtons from "@/components/smf-table-edit-buttons.vue";
import mixins from "vue-typed-mixins";
import Vue from "vue";
import { Device } from "@/api/device";
import { Route } from "vue-router";
import { SmfDialogService } from "@/shared/smf-dialog.service";
import SmfNewOrEditDeviceDialog from "@/components/dialogs/smf-new-or-edit-device.dialog.vue";
import { BTableItem } from "@/shared/b-table-item";

interface UiDevice extends BTableItem {
  tag: string;
  _age: Date;
  descr: string;
  enabled: boolean | null;
  id: string;
  msisdn: string;
  name: string;
  pwd: string;
  vFirmware: string;
}

const fields = [
  {
    key: "name",
    label: "Name",
    sortable: true
  },
  {
    key: "msisdn",
    label: "MSISDN",
    sortable: true
  },
  {
    key: "pwd",
    label: "Password"
  },
  {
    key: "descr",
    label: "Description",
    sortable: true
  },
  {
    key: "id",
    label: "Model",
    sortable: true
  },
  {
    key: "vFirmware",
    label: "Firmware",
    sortable: true
  },
  {
    key: "enabled",
    label: "Enabled",
    sortable: true,
    class: "text-center"
  },
  {
    key: "_age",
    label: "Created",
    formatter: (value: string) => value.toLocaleString(),
    sortable: true
  }
];

let tmpDevices: UiDevice[] = [];

export default mixins(webSocket, Vue).extend({
  name: "smfConfigDevice",
  props: [],
  components: {
    smfDataTable,
    smfTableEditButtons
  },
  mixins: [webSocket],
  mounted() {
    this.ws_open("/smf/api/device/v0.9");
  },
  data() {
    return {
      isBusy: true,
      busyLevel: 0,
      fields,
      devices: [] as UiDevice[],
      selected: [] as UiDevice[]
    };
  },
  beforeDestroy() {
    this.ws_close();
  },
  methods: {
    ws_on_open() {
      this.devices = [];
      this.ws_subscribe(Channel.ConfigDevices);
    },
    ws_on_data(obj: WSResponse) {
      if (obj.cmd) {
        console.log(
          `${this.$options.name} websocket received ${obj.cmd} / ${obj.channel}`
        );
        if (obj.cmd === Cmd.insert) {
          const insertResponse = obj as WSInsertResponse<Device>;
          const bDevice = insertResponse.rec.data;
          const created = new Date(bDevice.creationTime.substring(0, 19));
          const rec: UiDevice = {
            tag: insertResponse.rec.key.tag as string,
            _age: created,
            descr: bDevice.descr,
            enabled: bDevice.enabled,
            id: bDevice.id,
            msisdn: bDevice.msisdn,
            name: bDevice.name,
            pwd: bDevice.pwd,
            vFirmware: bDevice.vFirmware,
            _rowVariant: bDevice.enabled ? null : "warning"
          };

          if (this.isBusy) {
            //  bulk insert
            tmpDevices.push(rec);
          } else {
            //  operational insert
            this.devices.push(rec);
          }
        } else if (obj.cmd === Cmd.modify) {
          const modResponse = obj as WSModifyResponse<Device>;
          this.devices.forEach((rec: UiDevice) => {
            if (rec.tag === modResponse.key[0]) {
              rec = Object.assign(rec, modResponse.value);
              rec._rowVariant = rec.enabled ? null : "warning";
            }
          });
        } else if (obj.cmd === Cmd.clear) {
          this.devices = [];
        } else if (obj.cmd === Cmd.delete) {
          const key = (obj as WSDeleteResponse).key[0];
          this.devices = this.devices.filter(d => d.tag !== key);
        } else if (obj.cmd === Cmd.load) {
          const loadResponse = obj as WSLoadResponse;
          if (loadResponse.hasOwnProperty("show")) {
            this.isBusy = loadResponse.show;

            if (this.isBusy) {
              // reset the tmpDevices array if the initial upload starts
              tmpDevices = [];
            } else {
              // set the tmpDevices if the initial uploads is done
              this.devices = tmpDevices;
              this.busyLevel = 100;
            }
          }
          if (loadResponse.hasOwnProperty("level")) {
            this.busyLevel = loadResponse.level;
          }
        }
      }
    },
    async onDeviceUpdate() {
      const data = await SmfDialogService.openFormDialog(
        this,
        "Update device",
        SmfNewOrEditDeviceDialog,
        this.selected[0]
      );
      if (data) {
        this.ws_submit_record(Cmd.modify, Channel.ConfigDevices, {
          key: [data.tag],
          data
        });
      }
    },
    async onExecuteDeviceDelete() {
      this.selected.forEach(element => {
        this.ws_submit_key(Cmd.delete, Channel.ConfigDevices, {
          tag: [element.tag]
        });
      });
    },
    async onDeviceInsert() {
      const newDevice = await SmfDialogService.openFormDialog(
        this,
        "Add new device",
        SmfNewOrEditDeviceDialog,
        { name: "", msisdn: "", pwd: "", descr: "", enabled: true }
      );
      if (newDevice) {
        this.ws_submit_record(Cmd.insert, Channel.ConfigDevices, {
          key: [null],
          data: {
            ...newDevice,
            creationTime: new Date(),
            source: process.env.VUE_APP_SMF_SERVER
          }
        });
      }
    },
    switchEnableState(enabled: boolean, tag: string) {
      this.ws_submit_record(Cmd.modify, Channel.ConfigDevices, {
        key: [tag],
        data: {
          enabled
        }
      });
    },
    formatDescription(str: string) {
      if (str.length > 24) return `${str.substring(0, 24)}...`;
      return str;
    }
  },
  beforeRouteEnter(to: Route, from: Route, next: any) {
    hasPrivilegesWaitForUser(
      store,
      MODULES.CONFIG_DEVICES,
      PRIVILEGES.VIEW
    ).then(result => {
      next(result ? true : NO_ACCESS_ROUTE);
    });
  }
});
</script>
<style lang="scss" scoped></style>
