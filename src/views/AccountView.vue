<script lang="ts">
import { defineComponent } from 'vue'
import PageHeader from '@/components/shared/PageHeader.vue'

export default defineComponent({
  name: 'AccountView',
  components: {
    PageHeader,
  },
})
</script>

<template>
  <div class="page-header">
    <PageHeader title="Account" />
  </div>
</template>
