﻿
<template lang="html">
    <section class="smf-config-iec">

        <template>
            <div>
                <vue-headful title="smf :: config IEC"
                             description="SMF dashboard"
                             keywords="SMF, solosTec" />
            </div>
        </template>

        <b-jumbotron fluid header="IEC header" lead="Config IEC devices" />
<!--        <b-jumbotron fluid :header="$t('header-gateway')" :lead="$t('lead-gateway', {count: this.gateways.length})" />-->
    </section>
</template>

<script lang="js">

    import { webSocket } from '../mixins/web-socket'

    export default {
        name: 'smfConfigGateway',
        props: [],
        mixins: [webSocket],
        components: {
        },

        mounted() {
            this.ws_open("/smf/api/iec/v0.8");
        },

        data() {
            meter: []
        },
        beforeDestroy() {
            this.ws_close();
        },

        methods: {
            ws_on_open() {
                this.meter = [];
                this.ws_subscribe("config.iec");
                this.ws_subscribe("table.iec.count");
            },
        },
        computed: {
        }
    }
</script>

<style scoped lang="css">
</style>
