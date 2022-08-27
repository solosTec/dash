<template>
  <div class="ConfDevices bg-light py-5">
    <div class="container">
      <h1>{{ $t('header-device') }}</h1>
      <p>{{
          $t("lead-device")
      }} </p>
    </div>
  </div>
  <div class="container-fluid">
    <SegwTable />
  </div>
</template> 

<script>
import SegwTable from '../../components/SegwTable.vue'

export default {
  components: {
    SegwTable
  }
}
</script>