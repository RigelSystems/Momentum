<script lang="ts">
import { defineComponent } from 'vue';
import User from '@/components/User.vue';

export default defineComponent({
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  components: {
    User,
  },
});
</script>

<template>
  <div class="page-header-title">
    <h1>{{ title }}</h1>
  </div>
</template>
