<template lang="html">

    <section class="smf-config-upload">

        <template>
            <div>
                <vue-headful title="smf :: config upload"
                             description="SMF dashboard"
                             keywords="SMF, solosTec" />
            </div>
        </template>

        <b-jumbotron fluid :header="$t('header-upload')" :lead="$t('lead-upload')" />

        <b-container fluid>
            <b-form-row>
                <b-col class="m-2 p-2 shadow">
                    <h4>Upload Devices</h4>
                    <p>{{device_text}}</p>
                    <b-form @submit="onSubmitDevices" @reset="onResetDevices">
                        <b-form-file v-model="dev.file"
                                     :state="Boolean(dev.file)"
                                     accept="application/xml, application/json"
                                     placeholder="Choose a file..."
                                     drop-placeholder="Drop file here...">
                        </b-form-file>
                        <b-form-radio-group id="dev-upload-policy" v-model="dev.policy" name="dev-upload-policy" class="mt-3">
                            <b-form-radio value="append">Append</b-form-radio>
                            <b-form-radio value="merge">Merge</b-form-radio>
                            <b-form-radio value="subst">Overwrite</b-form-radio>
                        </b-form-radio-group>
                        <b-form-radio-group id="dev-upload-version" v-model="dev.version" name="dev-upload-version" class="mt-3">
                            <b-form-radio value="v3.2">Version 3.2</b-form-radio>
                            <b-form-radio value="v4.0">Version 4.0</b-form-radio>
                            <b-form-radio value="v0.8">Version 0.8</b-form-radio>
                        </b-form-radio-group>
                        <b-button :disabled="!Boolean(dev.file)" type="submit" variant="primary" class="mt-3 mr-3">Start Upload &#8682;</b-button>
                        <b-button type="reset" variant="danger" class="mt-3">Reset</b-button>
                        <p class="mt-3"><small class="text-muted">{{deviceCount}} device(s) configured</small></p>
                    </b-form>

                </b-col>

                <b-col class="m-2 p-2 shadow">
                    <h4>Upload Gateways</h4>
                    <p>{{gateway_text}}</p>
                    <b-form @submit="onSubmitGateway" @reset="onResetGateway">
                        <b-form-file v-model="gw.file"
                                     :state="Boolean(gw.file)"
                                     accept="application/xml, application/json"
                                     placeholder="Choose a file..."
                                     drop-placeholder="Drop file here...">
                        </b-form-file>
                        <b-form-radio-group id="gw-upload-policy" v-model="gw.policy" name="gw-upload-policy" class="mt-3">
                            <b-form-radio value="append">Append</b-form-radio>
                            <b-form-radio value="merge">Merge</b-form-radio>
                            <b-form-radio value="subst">Overwrite</b-form-radio>
                        </b-form-radio-group>
                        <b-button :disabled="!Boolean(gw.file)" type="submit" variant="primary" class="mt-3 mr-3">Start Upload &#8682;</b-button>
                        <b-button type="reset" variant="danger" class="mt-3">Reset</b-button>
                        <p class="mt-3"><small class="text-muted">{{gatewayCount}} gateway(s) configured</small></p>
                    </b-form>
                </b-col>

                <b-col class="m-2 p-2 shadow">
                    <h4>Upload Meter</h4>
                    <p>{{meter_text}}</p>
                    <b-form @submit="onSubmitMeter" @reset="onResetMeter">
                        <b-form-file v-model="meter.file"
                                     :state="Boolean(meter.file)"
                                     accept="application/xml, application/json"
                                     placeholder="Choose a file..."
                                     drop-placeholder="Drop file here...">
                        </b-form-file>
                        <b-form-radio-group id="meter-upload-policy" v-model="meter.policy" name="meter-upload-policy" class="mt-3">
                            <b-form-radio value="append">Append</b-form-radio>
                            <b-form-radio value="merge">Merge</b-form-radio>
                            <b-form-radio value="subst">Overwrite</b-form-radio>
                        </b-form-radio-group>
                        <b-button :disabled="!Boolean(meter.file)" type="submit" variant="primary" class="mt-3 mr-3">Start Upload &#8682;</b-button>
                        <b-button type="reset" variant="danger" class="mt-3">Reset</b-button>
                        <p class="mt-3"><small class="text-muted">{{meterCount}} meter(s) configured</small></p>
                    </b-form>

                </b-col>
            </b-form-row>

            <br />

            <b-form-row>
                <b-col class="m-2 p-2 shadow">
                    <h4>Upload LoRa Devices</h4>
                    <p>{{lora_text}}</p>
                    <b-form @submit="onSubmitLoRa" @reset="onResetLoRa">
                        <b-form-file v-model="LoRa.file"
                                     :state="Boolean(LoRa.file)"
                                     accept="application/xml, application/json"
                                     placeholder="Choose a file..."
                                     drop-placeholder="Drop file here...">
                        </b-form-file>
                        <b-form-radio-group id="lora-upload-policy" v-model="LoRa.policy" name="lora-upload-policy" class="mt-3">
                            <b-form-radio value="append">Append</b-form-radio>
                            <b-form-radio value="merge">Merge</b-form-radio>
                            <b-form-radio value="subst">Overwrite</b-form-radio>
                        </b-form-radio-group>
                        <b-button :disabled="!Boolean(LoRa.file)" type="submit" variant="primary" class="mt-3 mr-3">Start Upload &#8682;</b-button>
                        <b-button type="reset" variant="danger" class="mt-3">Reset</b-button>
                        <p class="mt-3"><small class="text-muted">{{ LoRaCount }} LoRa devices(s) configured</small></p>
                    </b-form>
                </b-col>

                <b-col class="m-2 p-2 shadow"></b-col>
                <b-col class="m-2 p-2 shadow"></b-col>
            </b-form-row>

        </b-container>
    </section>

</template>

<script lang="js">

  import {webSocket} from '../mixins/web-socket.js'
  import {hasPrivilegesWaitForUser} from "../mixins/privileges";
  import store from "../store";
  import {MODULES, NO_ACCESS_ROUTE, PRIVILEGES} from "../store/modules/user";


  export default  {
    name: 'smfConfigUpload',
    props: [],
    mixins: [webSocket],

    mounted() {
    //   console.log("$http: "+ this.$http);
      this.ws_open("/smf/api/upload/v0.7");
    },

    data() {
      return {
        deviceCount: 0,
        gatewayCount: 0,
        meterCount: 0,
        LoRaCount: 0,
        dev: {
            file: null,
            policy: 'append',
            version: 'v0.8'
        },
        gw: {
            file: null,
            policy: 'append'
        },
        meter: {
            file: null,
            policy: 'append'
        },
        LoRa: {
            file: null,
            policy: 'append'
        }
      }
    },

    beforeDestroy() {
      this.ws_close();
    },

    methods: {
        ws_on_open() {
            this.ws_subscribe("table.device.count");
            this.ws_subscribe("table.gateway.count");
            this.ws_subscribe("table.meter.count");
            this.ws_subscribe("table.msg.count");
            this.ws_subscribe("table.LoRa.count");
        },
        ws_on_data(obj) {
            if (obj.cmd != null) {
            console.log('websocket received ' + obj.cmd);
                if (obj.cmd == 'update') {
                    if (obj.channel != null) {
                        if (obj.channel == 'table.device.count') {
                            this.deviceCount = obj.value;
                        }
                        else if (obj.channel == 'table.gateway.count') {
                            this.gatewayCount = obj.value;
                        }
                        else if (obj.channel == 'table.meter.count') {
                            this.meterCount = obj.value;
                        }
                        else if (obj.channel == 'table.LoRa.count') {
                            this.LoRaCount = obj.value;
                        }
                    }
                }
            }
       },
       onSubmitDevices(evt) {
            evt.preventDefault();
            //alert(JSON.stringify(this.dev))
            //console.log(this.dev);
            let formData = new FormData();
           formData.append('file', this.dev.file);
           formData.append('policy', this.dev.policy);
           formData.append('version', this.dev.version);

            this.$http.post("/upload/config/device/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            progress(e) {
                if (e.lengthComputable) {
                    console.log(e.loaded / e.total * 100);
                }
            }
        })
            .then(res =>{
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
      },
      onResetDevices(evt) {
        evt.preventDefault()
        this.dev.file = null;
        this.dev.policy = 'append';
        this.dev.version = 'v0.8';
      },

      onSubmitGateway(evt) {
        evt.preventDefault()
        // alert(JSON.stringify(this.gw))
        let formData = new FormData();
        formData.append('file', this.gw.file);
        formData.append('policy', this.gw.policy);
        this.$http.post("/upload/config/gw/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            progress(e) {
                if (e.lengthComputable) {
                    console.log(e.loaded / e.total * 100);
                }
            }
        })
            .then(res =>{
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
      },
      onResetGateway(evt) {
        evt.preventDefault()
        this.gw.file = null;
        this.gw.policy = 'append';
      },
      onSubmitMeter(evt) {
        evt.preventDefault()
        // alert(JSON.stringify(this.meter))
        let formData = new FormData();
        formData.append('file', this.meter.file);
        formData.append('policy', this.meter.policy);
          this.$http.post("/upload/config/meter/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            progress(e) {
                if (e.lengthComputable) {
                    console.log(e.loaded / e.total * 100);
                }
            }
        })
            .then(res =>{
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
      },
      onResetMeter(evt) {
        evt.preventDefault()
        this.meter.file = null;
        this.meter.policy = 'append';
      },
      onSubmitLoRa(evt) {
        evt.preventDefault()
        // alert(JSON.stringify(this.LoRa))
        let formData = new FormData();
        formData.append('file', this.LoRa.file);
        formData.append('policy', this.LoRa.policy);
        this.$http.post("/upload/config/LoRa/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            progress(e) {
                if (e.lengthComputable) {
                    console.log(e.loaded / e.total * 100);
                }
            }
        })
            .then(res =>{
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
      },
      onResetLoRa(evt) {
        evt.preventDefault()
        this.LoRa.file = null;
        this.LoRa.policy = 'append';
      }
    },

    computed: {
        device_text() {
            if (!this.dev.file)   {
                return "Select a device configuration file.";
            }
            return this.dev.file.name + " with " + this.dev.file.size + " bytes selected.";
        },
        gateway_text() {
            if (!this.gw.file)   {
                return "Select a gateway configuration file.";
            }
            return this.gw.file.name + " with " + this.gw.file.size + " bytes selected.";
        },
        meter_text() {
            if (!this.meter.file)   {
                return "Select a meter configuration file.";
            }
            return this.meter.file.name + " with " + this.meter.file.size + " bytes selected.";
        },
        lora_text() {
            if (!this.LoRa.file)   {
                return "Select a LoRa configuration file.";
            }
            return this.LoRa.file.name + " with " + this.LoRa.file.size + " bytes selected.";
        }
    },
      beforeRouteEnter(to, from, next) {
          hasPrivilegesWaitForUser(store, MODULES.CONFOG_UPLOAD, PRIVILEGES.VIEW).then((result) => {
              next( result ? true: NO_ACCESS_ROUTE);
          });
      }

    //watch: {
    //    'dev.file'(newVal, oldVal) {
    //        console.log('dev.file ' + oldVal + " => " + newVal);
    //    }
    //}

}
</script>

<style scoped lang="css">
</style>
