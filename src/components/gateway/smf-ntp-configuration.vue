<template lang="html">
  <b-form @submit.prevent="">
    <h1>NTP</h1>
  </b-form>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

import { NTP } from "@/api/ntp";
import {
  helpers,
  integer,
  ipAddress,
  or,
  required
} from "vuelidate/lib/validators";

export default Vue.extend({
  name: "smfNTPConfiguration",
  components: {},
  props: {
    NTPs: {
      type: Array as PropType<NTP[]>,
      required: true
    }
  },
  data() {
    return {
      fields: [
        { key: "host", label: "Hostname or IP-Address" },
        { key: "service", label: "Port" },
        { key: "action", label: "" }
      ]
      //  uiNTPs: [] as UINTP[],
      //  originalUiNTPs: [] as UINTP[]
    };
  },
  validations: {},
  computed: {},
  methods: {},
  watch: {}
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
