<template>
  <div class="bg-light py-5">
    <div class="container">
      <h1>{{ $t('header-gateway') }}</h1>
      <p>{{
          $t("lead-gateway")
      }} </p>
    </div>
  </div>
  <SegwTableExpand>
    
  </SegwTableExpand>
</template>

<script>
import SegwTableExpand from '../../components/SegwTableExpand.vue'
   
export default {
  components: {
    SegwTableExpand
  }
}

</script>