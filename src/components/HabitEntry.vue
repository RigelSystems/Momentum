<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HabitEntry',
  props: {
    entry: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    return {
      entry: props.entry,
    };
  },
});
</script>

<template>
  <div>
    <p>{{ entry.date }}</p>
    <p>{{ entry.value }}</p>
  </div>
</template>
