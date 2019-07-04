/* eslint-disable no-console */
<template lang="html">

  <section class="smf-config-system">

        <template>
            <div>
                <vue-headful
                    title="smf :: config system"
                    description="SMF dashboard"
                    keywords="SMF, solosTec"
                />
            </div>
        </template>

    <b-jumbotron fluid :header="$t('header-system', {version: this.cfg.version })" :lead="$t('lead-system', {node: this.cfg.hostname})" />

    <b-container fluid>

      <b-card-group deck>

          <b-card 
          title="Auto Login" 
          class="shadow">
            <b-form-checkbox switch v-model="cfg.auto_login" name="check-button">
              Accept unknown devices and transfer the login data to the configuration database (not recommended).
            </b-form-checkbox>              
            <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.auto_login}}</b></small></div>
          </b-card>

          <b-card title="Auto Enabled" class="shadow">
            <b-form-checkbox switch v-model="cfg.auto_enabled" name="check-button">
              Set automatically configured devices as enabled.
            </b-form-checkbox>              
            <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.auto_enabled}}</b></small></div>
          </b-card>

          <b-card title="Supersede" class="shadow">
            <b-form-checkbox switch v-model="cfg.supersede" name="check-button">
              New login terminates running session with same credentials (recommended).
            </b-form-checkbox>              
            <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.supersede}}</b></small></div>
          </b-card>

      </b-card-group>

      <br />

      <b-card-group deck>
          <b-card title="Country Code" class="shadow">
            <b-input-group class="mt-3">
                <b-form-select v-model="cfg.countryCode" :options="country.options" />
            </b-input-group>

             <!-- Maximum number of messages to be displayed. -->
            <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.countryCode}}</b></small></div>
          </b-card>
          <b-card title="Language Code" class="shadow">
            <b-input-group class="mt-3">
                <b-form-select v-model="cfg.languageCode" :options="language.options" />
            </b-input-group>

             <!-- Maximum number of messages to be displayed. -->
            <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.languageCode}}</b></small></div>
          </b-card>
      </b-card-group>

      <br />

      <b-card-group deck>
          <b-card title="System Messages" class="shadow">
            <b-input-group prepend="max." class="mt-3">
              <b-form-input v-model.number="cfg.maxMessages" type="number" min="10" max="10000" step="10" placeholder="<max. Messages>" />
              <b-input-group-append>
                <b-button variant="secondary" @click="cfg.maxMessages = cfg.def.maxMessages">Default</b-button>
                <b-button variant="success" @click="changeMaxMessages">Commit</b-button>
              </b-input-group-append>
            </b-input-group>

             <!-- Maximum number of messages to be displayed. -->
            <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.maxMessages}}</b></small></div>
          </b-card>

          <b-card title="System Events" class="shadow">
            <b-input-group prepend="max." class="mt-3">
              <b-form-input v-model.number="cfg.maxEvents" type="number" min="10" max="10000" step="10" placeholder="<max. Events>" />
              <b-input-group-append>
                <b-button variant="secondary" @click="cfg.maxEvents = cfg.def.maxEvents">Default</b-button>
                <b-button variant="success" @click="changeMaxEvents">Commit</b-button>
              </b-input-group-append>
            </b-input-group>

             <!-- Maximum number of events to be displayed. -->
            <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.maxEvents}}</b></small></div>
          </b-card>
      </b-card-group>

      <br />

      <b-card-group deck>

          <b-card title="Generate Time-Series" class="shadow">
            <b-form-checkbox switch v-model="cfg.tsdb" name="check-button">
              Write statistics into <b>{{cfg.tsdb_dir}}</b> (This may have a performance impact).
            </b-form-checkbox>              
            <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.tsdb}}</b></small></div>
          </b-card>

      </b-card-group>

      <br />

      <b-card-group deck>

          <b-card title="Catch new Meters" class="shadow">
            <b-form-checkbox switch v-model="cfg.catch_meters" name="check-button">
              Catch new meters during gateway configuration.
            </b-form-checkbox>              
            <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.catch_meters}}</b></small></div>
          </b-card>

          <b-card title="Catch new LoRa Devices" class="shadow">
            <b-form-checkbox switch v-model="cfg.catch_lora" name="check-button">
              Insert unkown LoRa devices automatically
            </b-form-checkbox>              
            <div slot="footer"><small class="text-muted">default = <b>{{cfg.def.catch_lora}}</b></small></div>
          </b-card>

      </b-card-group>

      <br />

    </b-container>
  </section>

</template>

<script lang="js">

import {webSocket} from '../../services/web-socket.js'

export default  {
    name: 'smfConfigSystem',
    props: [],
    mixins: [webSocket],

    mounted() {
        this.ws_open("/smf/api/system/v0.8");
    },

    beforeDestroy() {
        this.ws_close();
    },

    data() {
        return {
            cfg: {
                auto_login: false,
                auto_enabled: true,
                supersede: true,
                tsdb: false,
                tsdb_dir: '/',
                maxMessages: 1000,
                maxEvents: 2000,
                catch_meters: false,
                catch_lora: false,
                hostname: location.hostname,
                version: 'v0.0',
                countryCode: '',
                languageCode: '',
                def: {
                    auto_login: false,
                    auto_enabled: true,
                    supersede: true,
                    tsdb: false,
                    maxMessages: 1000,
                    maxEvents: 2000,
                    catch_meters : false,
                    catch_lora : false,
                    countryCode: 'AU',
                    languageCode: 'EN'
                }
            },
            country : {
                options: [
                    { value: 'AU', text: 'Australia'},
                    { value: 'AT', text: 'Austria'},
                    { value: 'CH', text: 'Switzerland'},
                    { value: 'DE', text: 'Germany'},
                    { value: 'FR', text: 'France'},
                    { value: 'GB', text: 'United Kingdom'}
                ]
            },
            //  ISO 639-1
            language : {
                options: [
                    { value: 'EN', text: 'english'},
                    { value: 'DE', text: 'deutsch'},
                    { value: 'ES', text: 'español'},
                    { value: 'FR', text: 'français'},
                    { value: 'RU', text: 'русский'},
                ]
            }
        }
    },

    methods: {
        ws_on_open() {
            this.ws_subscribe("config.system");
        },
        ws_on_data(obj) {      
            if (obj.cmd != null) {
                // console.log(this.$options.name + ' websocket received ' + obj.cmd + ' / ' + obj.channel);
                if (obj.cmd == 'insert') {
                    if (obj.rec.key.name == 'connection-auto-login') {
                        this.cfg.auto_login = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == 'connection-auto-enabled') {
                        this.cfg.auto_enabled = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == 'connection-superseed') {
                        this.cfg.supersede= obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == 'generate-time-series') {
                        this.cfg.tsdb= obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == 'host-name') {
                        this.cfg.hostname = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == 'smf-version') {
                        this.cfg.version = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "connection-auto-login-default") {
                        this.cfg.def.auto_login = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "connection-auto-enabled-default") {
                        this.cfg.def.auto_enabled = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "connection-superseed-default") {
                        this.cfg.def.auto_supersede = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "generate-time-series-default") {
                        this.cfg.def.tsdb = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "generate-time-series-dir") {
                        // $("#smf-config-system-time-series-dir").html('<a href="file:///' + obj.rec.data.value + '">' + obj.rec.data.value + '</a>');
                        this.cfg.tsdb_dir = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "max-messages") {
                        this.cfg.maxMessages = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "max-events") {
                        this.cfg.maxEvents = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "catch-meters") {
                        this.cfg.catch_meters = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "catch-lora") {
                        this.cfg.catch_lora = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "country-code") {
                        this.cfg.countryCode = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "country-code-default") {
                        this.cfg.def.countryCode = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "language-code") {
                        this.cfg.languageCode = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "language-code-default") {
                        this.cfg.def.languageCode = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "catch-meters-default") {
                        this.cfg.def.catch_meters = obj.rec.data.value;
                    }
                    else if (obj.rec.key.name == "catch-lora-default") {
                        this.cfg.def.catch_lora = obj.rec.data.value;
                    }
                    else {
                        console.log(this.$options.name + ' unhandled key ' + obj.cmd + ' / ' + obj.channel + ' / ' + obj.rec.key.name);
                    }
                }
                else if (obj.cmd == 'modify') {
                    console.log('modify ' + obj.key[0] + ": " + obj.value);
                    if (obj.key[0] == 'connection-auto-login') {
                        this.cfg.auto_login = obj.value;
                    }
                    else if (obj.key[0] == 'connection-auto-enabled') {
                        this.cfg.auto_enabled = obj.value;
                    }
                    else if (obj.key[0] == 'connection-superseed') {
                        this.cfg.supersede = obj.value;
                    }
                    else if (obj.key[0] == 'generate-time-series') {
                        this.cfg.tsdb = obj.value;
                    }
                    else if (obj.key[0] == 'max-messages') {
                        this.cfg.maxMessages = obj.value;
                    }
                    else if (obj.key[0] == 'max-events') {
                        this.cfg.maxEvents = obj.value;
                    }
                    else if (obj.key[0] == 'catch-meters') {
                        this.cfg.catch_meters = obj.value;
                    }
                    else if (obj.key[0] == 'catch-lora') {
                        this.cfg.catch_lora = obj.value;
                    }
                    else if (obj.key[0] == "country-code") {
                        this.cfg.countryCode = obj.value;
                    }
                    else if (obj.key[0] == "language-code") {
                        this.cfg.languageCode = obj.value;
                    }
                }
                else if (obj.cmd == 'load') {
                }
            }
        },
        changeMaxMessages(evt) {
          console.log('changeMaxMessages ' + this.cfg.maxMessages);
            this.ws_submit_record("modify", "config.system", {
                key: { name: "max-messages" },
                data: { value: this.cfg.maxMessages }
            });

        },
        changeMaxEvents(evt) {
          console.log('changeMaxEvents ' + this.cfg.maxEvents);
            this.ws_submit_record("modify", "config.system", {
                key: { name: "max-events" },
                data: { value: this.cfg.maxEvents }
            });

        }
    },

    computed: {

    },

    watch: {
        'cfg.auto_login': function() {
            // console.log(this.cfg.auto_login);
            this.ws_submit_record("modify", "config.system", {
                key: { name: "connection-auto-login" },
                data: { value: this.cfg.auto_login }
            });
        },
        'cfg.auto_enabled': function() {
        //   console.log(this.cfg.auto_enabled);
            this.ws_submit_record("modify", "config.system", {
                key: { name: "connection-auto-enabled" },
                data: { value: this.cfg.auto_enabled }
            });
        },
        'cfg.supersede': function() {
        //   console.log(this.cfg.supersede);
            this.ws_submit_record("modify", "config.system", {
                key: { name: "connection-superseed" },
                data: { value: this.cfg.supersede }
            });
        },
        'cfg.tsdb': function() {
            this.ws_submit_record("modify", "config.system", {
                key: { name: "generate-time-series" },
                data: { value: this.cfg.tsdb }
            });
        },
        'cfg.catch_meters': function() {
            this.ws_submit_record("modify", "config.system", {
                key: { name: "catch-meters" },
                data: { value: this.cfg.catch_meters }
            });
        },
        'cfg.catch_lora': function() {
            this.ws_submit_record("modify", "config.system", {
                key: { name: "catch-lora" },
                data: { value: this.cfg.catch_lora }
            });
        },
        'cfg.countryCode': function() {
            this.ws_submit_record("modify", "config.system", {
                key: { name: "country-code" },
                data: { value: this.cfg.countryCode }
            });
        },
        'cfg.languageCode': function() {
            this.ws_submit_record("modify", "config.system", {
                key: { name: "language-code" },
                data: { value: this.cfg.languageCode }
            });
        }
    }
}
</script>

<style scoped lang="css">
</style>
