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

    <b-jumbotron fluid header="Configure the Web-Interface" :lead="'data path: ' + ws_get_url()" />

    <b-container fluid>

        <b-card-group deck>

            <b-card title="SSL/TSL available"
                    class="shadow">
                <b-form-checkbox switch v-model="cfg.ssl">
                    Enable SSL/TLS encryption (HTTPs)
                </b-form-checkbox>
                <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.ssl}}</b></small></div>
            </b-card>

            <b-card title="HTTPS Rewrite" class="shadow">
                <b-form-checkbox switch v-model="cfg.https_rewrite" :disabled="!ssl">
                    Redirect to HTTPS (if available)
                </b-form-checkbox>
                <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.https_rewrite}}</b></small></div>
            </b-card>

        </b-card-group>

        <br />

        <b-card-group deck>
            <b-card title="Session Timeout (HTTP)" class="shadow">
                <b-input-group prepend="sec." class="mt-3">
                    <b-form-input v-model.number="cfg.http_sessionTimeout" type="number" min="10" max="10000" step="10" placeholder="<Session Timeout>" />
                    <b-input-group-append>
                        <b-button variant="secondary" @click="cfg.http_sessionTimeout = cfg.def.http_sessionTimeout">Default</b-button>
                        <b-button variant="success" @click="changeHTTPSessionTimeout">Commit</b-button>
                    </b-input-group-append>
                </b-input-group>

                <!-- Maximum number of messages to be displayed. -->
                <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.http_sessionTimeout}} seconds</b></small></div>
            </b-card>

            <b-card title="Maximum Upload Size (HTTP)" class="shadow">
                <b-input-group :prepend="ws_format_bytes(cfg.http_maxUploadSize)" class="mt-3">
                    <b-form-input v-model.number="cfg.http_maxUploadSize" type="number" min="1024" max="10485760" step="1024" placeholder="<max. Upload Size>" />
                    <b-input-group-append>
                        <b-button variant="secondary" @click="cfg.http_maxUploadSize = cfg.def.http_maxUploadSize">Default</b-button>
                        <b-button variant="success" @click="changeHTTPMaxUploadSize">Commit</b-button>
                    </b-input-group-append>
                </b-input-group>

                <!-- Maximum number of events to be displayed. -->
                <div slot="footer"><small class="text-muted">default = <b>{{ ws_format_bytes(cfg.def.http_maxUploadSize) }}</b></small></div>
            </b-card>
        </b-card-group>

        <br />

        <b-card-group deck>
            <b-card title="Session Timeout (HTTPS)" class="shadow">
                <b-input-group prepend="sec." class="mt-3">
                    <b-form-input v-model.number="cfg.https_sessionTimeout" type="number" min="10" max="10000" step="10" placeholder="<Session Timeout>" :disabled="!ssl" />
                    <b-input-group-append>
                        <b-button variant="secondary" @click="cfg.https_sessionTimeout = cfg.def.https_sessionTimeout">Default</b-button>
                        <b-button variant="success" @click="changeHTTPsSessionTimeout" :disabled="!ssl">Commit</b-button>
                    </b-input-group-append>
                </b-input-group>

                <!-- Maximum number of messages to be displayed. -->
                <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.https_sessionTimeout}} seconds</b></small></div>
            </b-card>

            <b-card title="Maximum Upload Size (HTTPS)" class="shadow">
                <b-input-group :prepend="ws_format_bytes(cfg.https_maxUploadSize)" class="mt-3">
                    <b-form-input v-model.number="cfg.https_maxUploadSize" type="number" min="1024" max="10485760" step="1024" placeholder="<max. Upload Size>" :disabled="!ssl" />
                    <b-input-group-append>
                        <b-button variant="secondary" @click="cfg.https_maxUploadSize = cfg.def.https_maxUploadSize">Default</b-button>
                        <b-button variant="success" @click="changeHTTPsMaxUploadSize" :disabled="!ssl">Commit</b-button>
                    </b-input-group-append>
                </b-input-group>

                <!-- Maximum number of events to be displayed. -->
                <div slot="footer"><small class="text-muted">default = <b>{{ ws_format_bytes(cfg.def.https_maxUploadSize) }}</b></small></div>
            </b-card>
        </b-card-group>

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
                https_rewrite: false,
                http_sessionTimeout: 30,
                http_maxUploadSize: 10 * 1024* 1024,
                https_sessionTimeout: 30,
                https_maxUploadSize: 10 * 1024* 1024,
                def: {
                    ssl: false,
                    https_rewrite: true,
                    http_sessionTimeout: 30,
                    http_maxUploadSize: 10 * 1024 * 1024,
                    https_sessionTimeout: 30,
                    https_maxUploadSize: 10 * 1024 * 1024
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
                    if (obj.rec.key.name == 'https-available') {
                        this.cfg.ssl = (obj.rec.data.value == null) ? false : obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == 'https-rewrite') {
                        this.cfg.https_rewrite = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == 'http-session-timeout') {
                        this.cfg.http_sessionTimeout= obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == 'https-session-timeout') {
                        this.cfg.https_sessionTimeout = (obj.rec.data.value == null) ? 0 : obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == 'http-max-upload-size') {
                        this.cfg.http_maxUploadSize= obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == 'https-max-upload-size') {
                        this.cfg.https_maxUploadSize= (obj.rec.data.value == null) ? 0 : obj.rec.data.value;
                    }
                    else {
                        console.log(this.$options.name + ' unhandled key ' + obj.cmd + ' / ' + obj.channel + ' / ' + obj.rec.key.name);
                    }
                }
                else if (obj.cmd == 'modify') {
                    console.log('modify ' + obj.key[0] + ": " + obj.value);
                    if (obj.key[0] == 'https-available') {
                        this.cfg.ssl = obj.value;
                    }
                    else if (obj.key[0] == 'https-rewrite') {
                        this.cfg.https_rewrite = obj.value;
                    }
                    else if (obj.key[0] == 'http-session-timeout') {
                        this.cfg.http_sessionTimeout = obj.value;
                    }
                    else if (obj.key[0] == 'http-max-upload-size') {
                        this.cfg.http_maxUploadSize = obj.value;
                    }
                    else if (obj.key[0] == 'https-session-timeout') {
                        this.cfg.https_sessionTimeout = obj.value;
                    }
                    else if (obj.key[0] == 'https-max-upload-size') {
                        this.cfg.https_maxUploadSize = obj.value;
                    }
                }
                else if (obj.cmd == 'load') {
                }
            }
        },
        changeHTTPSessionTimeout(evt) {
          console.log('changeSessionTimeout ' + this.cfg.http_sessionTimeout);
            this.ws_submit_record("modify", "config.web", {
                key: { name: "http-session-timeout" },
                data: { value: this.cfg.http_sessionTimeout }
            });

        },
        changeHTTPMaxUploadSize(evt) {
          console.log('changeMaxUploadSize ' + this.cfg.http_maxUploadSize);
            this.ws_submit_record("modify", "config.web", {
                key: { name: "http-max-upload-size" },
                data: { value: this.cfg.http_maxUploadSize }
            });

        },
        changeHTTPsSessionTimeout(evt) {
          console.log('changeSessionTimeout ' + this.cfg.http_sessionTimeout);
            this.ws_submit_record("modify", "config.web", {
                key: { name: "https-session-timeout" },
                data: { value: this.cfg.https_sessionTimeout }
            });

        },
        changeHTTPsMaxUploadSize(evt) {
          console.log('changeMaxUploadSize ' + this.cfg.http_maxUploadSize);
            this.ws_submit_record("modify", "config.web", {
                key: { name: "https-max-upload-size" },
                data: { value: this.cfg.https_maxUploadSize }
            });

        }
    },

    computed: {

    },

    watch: {
        'cfg.ssl': function() {
            // console.log(this.cfg.ssl);
            this.ws_submit_record("modify", "config.web", {
                key: { name: "https-available" },
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
