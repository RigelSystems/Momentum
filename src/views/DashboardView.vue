<script lang="ts">
import { defineComponent } from 'vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import Drawing from '@/components/Drawing.vue'

export default defineComponent({
  name: 'DashboardView',
  components: {
    PageHeader,
    Drawing,
  },
})
</script>

<template>
  <div class="page-header">
    <PageHeader title="Dashboard" />
  </div>

  <div class="page-content">
    <Drawing />
  </div>
</template>
