<template lang="html">
  <b-form @submit.prevent="">
    <b-form-group
      label-cols-sm="4"
      label-cols-lg="3"
      class="text-right button-update"
    >
      <b-button
        type="submit"
        variant="primary"
        :disabled="
          !uiBrokerHasChanged($v.uiBrokers.$model) || $v.uiBrokers.$invalid
        "
        @click.stop.prevent="onBrokerUpdate($v.uiBrokers.$model)"
      >
        Update
      </b-button>
    </b-form-group>

    <b-card-group deck>
      <b-card
        v-for="uiBroker in $v.uiBrokers.$each.$iter"
        :key="uiBroker.hardwarePort.$model"
        class="broker-card"
      >
        <template v-slot:header>
          <div style="display: flex; justify-content: space-between">
            <span
              >Hardware Port {{ uiBroker.hardwarePort.$model }} (
              {{ uiBroker.name.$model }})</span
            >
            <b-button
              size="sm"
              variant="primary"
              :disabled="noBrokerPortsAvailable(uiBroker.$model)"
              @click="configurePort(uiBroker.$model)"
            >
              Configure
            </b-button>
          </div>
        </template>

        <b-form-group label="Send Login" label-cols-sm="4" label-cols-lg="3">
          <b-input-group-prepend is-text>
            <b-form-checkbox
              v-model="uiBroker.login.$model"
              class="mr-n2"
              switch
            >
              <span class="sr-only">Send login data</span>
            </b-form-checkbox>
          </b-input-group-prepend>
        </b-form-group>

        <b-form-group>
          <b-table-simple hover small caption-top>
            <b-tbody>
              <b-tr
                v-for="(address, idx) in uiBroker.addresses.$each.$iter"
                :key="idx"
              >
                <b-td>
                  <b-form-group>
                    <b-input-group prepend="Host" class="mt-2">
                      <b-form-input
                        type="text"
                        v-model.trim="address.host.$model"
                        v-b-popover.hover="
                          'Specify a known hostname or an IPv4/IPv6 address'
                        "
                        :placeholder="'Hostname or IP-address' | fmtPlaceholder"
                        :state="address.host.$invalid ? false : null"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback v-if="!address.host.required">
                        Host is required.
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback
                        v-if="!address.host.hostValidator"
                      >
                        Invalid input.
                      </b-form-invalid-feedback>
                    </b-input-group>
                  </b-form-group>
                  <b-form-group v-if="uiBroker.login.$model">
                    <b-input-group prepend="User" class="mt-2">
                      <b-form-input
                        type="text"
                        v-model.trim="address.user.$model"
                        v-b-popover.hover="'Specify a username'"
                        :placeholder="'Username' | fmtPlaceholder"
                        :state="address.user.$invalid ? false : null"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback v-if="!address.user.required">
                        Username is required if login is activated.
                      </b-form-invalid-feedback>
                    </b-input-group>
                  </b-form-group>
                </b-td>
                <b-td>
                  <b-form-group>
                    <b-input-group prepend="Service" class="mt-2">
                      <b-form-input
                        type="number"
                        v-model.number="address.service.$model"
                        :placeholder="'Service' | fmtPlaceholder"
                        :state="address.service.$invalid ? false : null"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback v-if="!address.service.required">
                        Service is required.
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback v-if="!address.service.integer">
                        Input is not a number.
                      </b-form-invalid-feedback>
                    </b-input-group>
                  </b-form-group>
                  <b-form-group v-if="uiBroker.login.$model">
                    <b-input-group prepend="Password" class="mt-2">
                      <b-form-input
                        type="text"
                        v-model.trim="address.pwd.$model"
                        v-b-popover.hover="'Specify a password'"
                        :placeholder="'Password' | fmtPlaceholder"
                        :state="address.pwd.$invalid ? false : null"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback v-if="!address.pwd.required">
                        Password is required if login is activated.
                      </b-form-invalid-feedback>
                    </b-input-group>
                  </b-form-group>
                </b-td>
                <b-td class="text-right">
                  <b-input-group class="mt-2">
                    <b-button
                      size="sm"
                      variant="danger"
                      class="button-delete"
                      @click="removeAddress(address.$model, uiBroker.$model)"
                    >
                      Delete
                    </b-button>
                  </b-input-group>
                </b-td>
              </b-tr>
            </b-tbody>
            <b-tfoot>
              <b-td colspan="3" class="text-right">
                <b-button
                  size="sm"
                  variant="success"
                  @click="addAddress(uiBroker.$model)"
                >
                  Add
                </b-button>
              </b-td>
            </b-tfoot>
          </b-table-simple>
        </b-form-group>
      </b-card>
    </b-card-group>
  </b-form>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Gateway } from "@/api/gateway";

import { BBroker, BBrokerAddress, BHardwarePorts } from "@/api/broker";
import {
  helpers,
  integer,
  ipAddress,
  or,
  required
} from "vuelidate/lib/validators";
import { SmfDialogService } from "@/shared/smf-dialog.service";
import SmfConfigurePortDialog from "@/components/dialogs/smf-configure-port.dialog.vue";

const hostName = helpers.regex(
  "alpha",
  /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/
);

// const isLoginActive = function (this: any, address: BBrokerAddress) {
//     const broker: UIBroker = this.$v.uiBrokers.$model.find((brokerModel: any) => {
//         return brokerModel.addresses.includes(address)
//     })
//     return (broker && broker.login) || false;
// }

interface UIBroker {
  hardwarePort: string;
  name: string;
  login: boolean;
  addresses: BBrokerAddress[];
}

export default Vue.extend({
  name: "smfBrokerConfiguration",
  components: {},
  props: {
    gateway: {
      type: Object as PropType<Gateway>,
      required: true
    },
    brokers: {
      type: Array as PropType<BBroker[]>,
      required: true
    },
    brokerPorts: {
      type: Object as PropType<null | BHardwarePorts>
    }
  },
  data() {
    return {
      fields: [
        { key: "host", label: "Hostname or IP-Address" },
        { key: "service", label: "Port" },
        { key: "action", label: "" }
      ],
      uiBrokers: [] as UIBroker[],
      originalUiBrokers: [] as UIBroker[]
    };
  },
  validations: {
    uiBrokers: {
      $each: {
        hardwarePort: {},
        name: {},
        login: {},
        addresses: {
          required,
          $each: {
            host: {
              required,
              hostValidator: or(hostName, ipAddress)
            },
            service: {
              required,
              integer
            },
            user: {
              // required: requiredIf(isLoginActive),
            },
            pwd: {
              // required: requiredIf(isLoginActive)
            }
          }
        }
      }
    }
  },
  computed: {},
  methods: {
    noBrokerPortsAvailable(uiBroker: UIBroker): boolean {
      if (!this.brokerPorts) {
        return true;
      }
      return !this.brokerPorts[uiBroker.hardwarePort];
    },
    uiBrokerHasChanged(uiBrokers: UIBroker[]): boolean {
      return (
        JSON.stringify(this.originalUiBrokers) !== JSON.stringify(uiBrokers)
      );
    },
    addAddress(uiBroker: UIBroker): void {
      uiBroker.addresses.push({ host: "", service: undefined });
    },
    removeAddress(address: BBrokerAddress, uiBroker: UIBroker): void {
      uiBroker.addresses = uiBroker.addresses.filter(a => a !== address);
    },
    onBrokerUpdate(uiBrokers: UIBroker[]) {
      const bBrokers: BBroker[] = uiBrokers.map(uiBroker => {
        return {
          hardwarePort: uiBroker.hardwarePort,
          login: uiBroker.login,
          addresses: uiBroker.addresses
        };
      });
      this.$emit("brokersUpdate", bBrokers);
    },
    async configurePort(broker: UIBroker) {
      if (!this.brokerPorts) {
        return;
      }
      const brokerHardware = this.brokerPorts[broker.hardwarePort];
      console.log(brokerHardware);
      const result = await SmfDialogService.openFormDialog(
        this,
        "Configure Hardware Port: " + broker.name,
        SmfConfigurePortDialog,
        brokerHardware
      );
      if (result) {
        this.$emit("brokerHardwarePortUpdate", {
          [broker.hardwarePort]: result
        });
      }
    }
  },
  watch: {
    brokers: {
      immediate: true,
      handler(brokers: BBroker[]) {
        this.uiBrokers = brokers.map(bBroker => {
          return {
            hardwarePort: bBroker.hardwarePort,
            name: bBroker.hardwarePort,
            login: bBroker.login,
            addresses: bBroker.addresses
          } as UIBroker;
        });
        this.originalUiBrokers = JSON.parse(JSON.stringify(this.uiBrokers));
        // reset the form - resets the dirty state to false and removes all validation infos
        this.$v.uiBrokers.$reset();
      }
    }
  }
});
</script>
<style scoped>
.broker-card {
  min-width: calc(50% - 30px);
  max-width: calc(50% - 30px);
  margin-bottom: 30px;
}

.button-delete {
  margin-top: 0.25rem;
  margin-right: -0.25rem;
}

.button-update {
  margin-top: 1em;
}
</style>
