<template>
  <div id="app">
    <SMFNavigation
      brand="solos::Tec"
      logo="/logo.svg"
    />
    <router-view />
  </div>
</template>

<script>
import SMFNavigation from '@/components/smf-navigation.vue'

export default {
  name: 'App',
  components: {
    SMFNavigation
  },
  mounted () {
    console.log('NODE_ENV: ' + process.env.NODE_ENV)
  }
}
</script>

<style>
</style>
