<template lang="html">

  <section class="smf-config-download">

        <template>
            <div>
                <vue-headful
                    title="smf :: config download"
                    description="SMF dashboard"
                    keywords="SMF, solosTec"
                />
            </div>
        </template>

    <b-jumbotron fluid header="Download Configuration Files" lead="Backup or transfer the system configuration" />

    <b-container fluid>

        <b-form-row>
            <b-col class="m-2 p-2 shadow">
                <h4>Download {{deviceCount}} devices</h4>
                <b-form @submit="onSubmitDevices" @reset="onResetDevices">
                    <b-form-radio-group id="dev-download-type" v-model="dev.type" name="dev-download-type" class="mt-3">
                        <b-form-radio value="XML">XML</b-form-radio>
                        <b-form-radio value="JSON">JSON</b-form-radio>
                        <b-form-radio value="CSV">CSV</b-form-radio>
                    </b-form-radio-group>               
                    <b-form-radio-group id="dev-download-version" v-model="dev.version" name="dev-download-version">
                        <b-form-radio :disabled="dev.type != 'XML'" value="v32">Version 3.2</b-form-radio>
                        <b-form-radio :disabled="dev.type != 'XML'" value="v40">Version 4.0</b-form-radio>
                        <b-form-radio :disabled="dev.type != 'XML'" value="v50">Version 5.0</b-form-radio>
                    </b-form-radio-group>               
                    <b-button type="submit" variant="primary" class="mt-3 mr-3">Download &#8681;</b-button>
                    <b-button type="reset" variant="danger" class="mt-3">Reset</b-button>
                </b-form>
            </b-col>

            <b-col class="m-2 p-2 shadow">
                <h4>Download {{ gatewayCount }} gateways</h4>
                <b-form @submit="onSubmitGateways" @reset="onResetGateways">
                    <b-form-radio-group id="gw-download-type" v-model="gw.type" name="gw-download-type" class="mt-3">
                        <b-form-radio value="XML">XML</b-form-radio>
                        <b-form-radio value="JSON">JSON</b-form-radio>
                        <b-form-radio value="CSV">CSV</b-form-radio>
                    </b-form-radio-group>               
                    <b-button type="submit" variant="primary" class="mt-3 mr-3">Download &#8681;</b-button>
                    <b-button type="reset" variant="danger" class="mt-3">Reset</b-button>
                </b-form>
            </b-col> 

            <b-col class="m-2 p-2 shadow">
                <h4>Download {{ meterCount }} meters</h4>
                <b-form @submit="onSubmitMeters" @reset="onResetMeters">
                    <b-form-radio-group id="meter-download-type" v-model="meter.type" name="meter-download-type" class="mt-3">
                        <b-form-radio value="XML">XML</b-form-radio>
                        <b-form-radio value="JSON">JSON</b-form-radio>
                        <b-form-radio value="CSV">CSV</b-form-radio>
                    </b-form-radio-group>               
                    <b-button type="submit" variant="primary" class="mt-3 mr-3">Download &#8681;</b-button>
                    <b-button type="reset" variant="danger" class="mt-3">Reset</b-button>
                </b-form>
            </b-col>
        </b-form-row>

        <b-form-row>
            <b-col class="m-2 p-2 shadow">
                <h4>Download {{ LoRaCount }} LoRa devices</h4>
                <b-form @submit="onSubmitLoRa" @reset="onResetLoRa">
                    <b-form-radio-group id="meter-download-type" v-model="LoRa.type" name="LoRa-download-type" class="mt-3">
                        <b-form-radio value="XML">XML</b-form-radio>
                        <b-form-radio value="JSON">JSON</b-form-radio>
                        <b-form-radio value="CSV">CSV</b-form-radio>
                    </b-form-radio-group>               
                    <b-form-radio-group id="LoRa-download-type" v-model="LoRa.vendor" name="LoRa-vendor-type">
                        <b-form-radio value="actility">Actility</b-form-radio>
                        <b-form-radio value="swisscom">Swisscom</b-form-radio>
                        <b-form-radio value="sigfox">SigFox</b-form-radio>
                    </b-form-radio-group>               
                    <b-button type="submit" variant="primary" class="mt-3 mr-3">Download &#8681;</b-button>
                    <b-button type="reset" variant="danger" class="mt-3">Reset</b-button>
                </b-form>
            </b-col>

            <b-col class="m-2 p-2 shadow">
                <h4>Download {{ uplinkCount }} LoRa uplink records</h4>
                <b-form @submit="onSubmitUplink" @reset="onResetUplink">
                    <b-form-radio-group id="meter-uplink-type" v-model="uplink.type" name="uplink-download-type" class="mt-3">
                        <b-form-radio value="XML">XML</b-form-radio>
                        <b-form-radio value="JSON">JSON</b-form-radio>
                        <b-form-radio value="CSV">CSV</b-form-radio>
                    </b-form-radio-group>               
                    <b-button type="submit" variant="primary" class="mt-3 mr-3">Download &#8681;</b-button>
                    <b-button type="reset" variant="danger" class="mt-3">Reset</b-button>
                </b-form>
            </b-col>

            <b-col class="m-2 p-2 shadow">
                <h4>Download {{ msgCount }} system messages</h4>
                <b-form @submit="onSubmitMsg" @reset="onResetMsg">
                    <b-form-radio-group id="msg-uplink-type" v-model="msg.type" name="msg-download-type" class="mt-3">
                        <b-form-radio value="XML">XML</b-form-radio>
                        <b-form-radio value="JSON">JSON</b-form-radio>
                        <b-form-radio value="CSV">CSV</b-form-radio>
                    </b-form-radio-group>               
                    <b-button type="submit" variant="primary" class="mt-3 mr-3">Download &#8681;</b-button>
                    <b-button type="reset" variant="danger" class="mt-3">Reset</b-button>
                </b-form>
            </b-col>
        </b-form-row>

    </b-container>

  </section>

</template>

<script lang="js">

  import {webSocket} from '../../services/web-socket.js'

  export default  {
    name: 'smfConfigDownload',
    props: [],
    mixins: [webSocket],

    mounted() {
      this.ws_open("/smf/api/download/v0.7");
    },

    data() {
      return {
        deviceCount: 0,
        gatewayCount: 0,
        meterCount: 0,
        LoRaCount: 0,
        uplinkCount: 0,
        msgCount: 0,
        dev: {
            type: 'XML',
            version: 'v50'
        },
        gw: {
            type: 'XML',
        },
        meter: {
            type: 'XML',
        },
        LoRa: {
            type: 'XML',
            vendor: 'swisscom',
        },
        uplink: {
            type: 'XML',
        },
        msg: {
            type: 'XML',
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
            this.ws_subscribe("table.uplink.count");
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
                        else if (obj.channel == 'table.uplink.count') {
                            this.uplinkCount = obj.value;
                        }
                        else if (obj.channel == 'table.msg.count') {
                            this.msgCount = obj.value;
                        }
                    }
                }
            }
       },
       onSubmitDevices(evt) {
        evt.preventDefault()
        // alert(JSON.stringify(this.dev))
        this.$http.post("/config.download.html", this.dev, {
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
        this.dev.type = 'XML';
        this.dev.version = 'v50';
      },
      onSubmitGateways(evt) {
        evt.preventDefault()
        alert(JSON.stringify(this.gw))
      },
      onResetGateways(evt) {
        evt.preventDefault()
        this.gw.type = 'XML';
      },
      onSubmitMeters(evt) {
        evt.preventDefault()
        alert(JSON.stringify(this.meter))
      },
      onResetMeters(evt) {
        evt.preventDefault()
        this.meter.type = 'XML';
      },
      onSubmitLoRa(evt) {
        evt.preventDefault()
        alert(JSON.stringify(this.LoRa))
      },
      onResetLoRa(evt) {
        evt.preventDefault()
        this.LoRa.type = 'XML';
        this.LoRa.vendor = 'swisscom';
      },
      onSubmitUplink(evt) {
        evt.preventDefault()
        alert(JSON.stringify(this.uplink))
      },
      onResetUplink(evt) {
        evt.preventDefault()
        this.uplink.type = 'XML';
      },
      onSubmitMsg(evt) {
        evt.preventDefault()
        alert(JSON.stringify(this.msg))
      },
      onResetMsg(evt) {
        evt.preventDefault()
        this.msg.type = 'XML';
      }
    },

    computed: {

    }
}
</script>

<style scoped lang="css">
</style>
