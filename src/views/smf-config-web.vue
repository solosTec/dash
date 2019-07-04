/* eslint-disable no-console */
<template lang="html">

  <section class="smf-config-system">

        <template>
            <div>
                <vue-headful
                    title="smf :: config web-interface"
                    description="SMF dashboard"
                    keywords="SMF, solosTec"
                />
            </div>
        </template>

    <b-jumbotron fluid header="Configure the Web-Interface" :lead="ws_get_url()" />

    <b-container fluid>

        <b-card-group deck>

            <b-card title="SSL/TSL"
                    class="shadow">
                <b-form-checkbox switch v-model="cfg.ssl" name="check-button">
                    Enable SSL/TLS encryption (HTTPs)
                </b-form-checkbox>
                <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.ssl}}</b></small></div>
            </b-card>

            <b-card title="HTTPS Rewrite" class="shadow">
                <b-form-checkbox switch v-model="cfg.https_rewrite" name="check-button">
                    Redirect to HTTPS (if available)
                </b-form-checkbox>
                <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.https_rewrite}}</b></small></div>
            </b-card>

        </b-card-group>

        <br />

        <b-card-group deck>
            <b-card title="Session Timeout" class="shadow">
                <b-input-group prepend="sec." class="mt-3">
                    <b-form-input v-model.number="cfg.sessionTimeout" type="number" min="10" max="10000" step="10" placeholder="<Session Timeout>" />
                    <b-input-group-append>
                        <b-button variant="secondary" @click="cfg.sessionTimeout = cfg.def.sessionTimeout">Default</b-button>
                        <b-button variant="success" @click="changeSessionTimeout">Commit</b-button>
                    </b-input-group-append>
                </b-input-group>

                <!-- Maximum number of messages to be displayed. -->
                <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.sessionTimeout}} seconds</b></small></div>
            </b-card>

            <b-card title="Maximum Upload Size" class="shadow">
                <b-input-group :prepend="ws_format_bytes(cfg.maxUploadSize)" class="mt-3">
                    <b-form-input v-model.number="cfg.maxUploadSize" type="number" min="1024" max="10485760" step="1024" placeholder="<max. Events>" />
                    <b-input-group-append>
                        <b-button variant="secondary" @click="cfg.maxUploadSize = cfg.def.maxUploadSize">Default</b-button>
                        <b-button variant="success" @click="changeMaxUploadSize">Commit</b-button>
                    </b-input-group-append>
                </b-input-group>

                <!-- Maximum number of events to be displayed. -->
                <div slot="footer"><small class="text-muted">default = <b>{{ ws_format_bytes(cfg.def.maxUploadSize) }}</b></small></div>
            </b-card>
        </b-card-group>

        <br />

    </b-container>
  </section>

</template>

<script lang="js">

import {webSocket} from '../../services/web-socket.js'

export default  {
    name: 'smfConfigWeb',
    props: [],
    mixins: [webSocket],

    mounted() {
        this.ws_open("/smf/api/web/v0.8");
    },

    beforeDestroy() {
        this.ws_close();
    },

    data() {
        return {
            cfg: {
                ssl: false,
                https_rewrite: true,
                sessionTimeout: 30,
                maxUploadSize: 10 * 1024* 1024,
                def: {
                    ssl: false,
                    https_rewrite: true,
                    sessionTimeout: 30,
                    maxUploadSize: 10 * 1024 * 1024
                }
            }
        }
    },

    methods: {
        ws_on_open() {
            this.ws_subscribe("config.web");
        },
        ws_on_data(obj) {      
            if (obj.cmd != null) {
                console.log(this.$options.name + ' websocket received ' + obj.cmd + ' / ' + obj.channel);
                if (obj.cmd == 'insert') {
                    if (obj.rec.key.name == 'ssl') {
                        this.cfg.ssl = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == 'https-rewrite') {
                        this.cfg.https_rewrite = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == 'session-timeout') {
                        this.cfg.sessionTimeout= obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == 'max-upload-size') {
                        this.cfg.maxUploadSize= obj.rec.data.value;
                    }
                    else {
                        console.log(this.$options.name + ' unhandled key ' + obj.cmd + ' / ' + obj.channel + ' / ' + obj.rec.key.name);
                    }
                }
                else if (obj.cmd == 'modify') {
                    console.log('modify ' + obj.key[0] + ": " + obj.value);
                    if (obj.key[0] == 'ssl') {
                        this.cfg.ssl = obj.value;
                    }
                    else if (obj.key[0] == 'https-rewrite') {
                        this.cfg.https_rewrite = obj.value;
                    }
                    else if (obj.key[0] == 'session-timeout') {
                        this.cfg.sessionTimeout = obj.value;
                    }
                    else if (obj.key[0] == 'max-upload-size') {
                        this.cfg.maxUploadSize = obj.value;
                    }
                }
                else if (obj.cmd == 'load') {
                }
            }
        },
        changeSessionTimeout(evt) {
          console.log('changeSessionTimeout ' + this.cfg.sessionTimeout);
            this.ws_submit_record("modify", "config.web", {
                key: { name: "session-timeout" },
                data: { value: this.cfg.sessionTimeout }
            });

        },
        changeMaxUploadSize(evt) {
          console.log('changeMaxUploadSize ' + this.cfg.maxUploadSize);
            this.ws_submit_record("modify", "config.web", {
                key: { name: "max-upload-size" },
                data: { value: this.cfg.maxUploadSize }
            });

        }
    },

    computed: {

    },

    watch: {
        'cfg.ssl': function() {
            // console.log(this.cfg.ssl);
            this.ws_submit_record("modify", "config.web", {
                key: { name: "ssl" },
                data: { value: this.ssl }
            });
        },
        'cfg.https_rewrite': function() {
        //   console.log(this.cfg.https_rewrite);
            this.ws_submit_record("modify", "config.web", {
                key: { name: "https-rewrite" },
                data: { value: this.cfg.https_rewrite }
            });
        }
    }
}
</script>

<style scoped lang="css">
</style>
