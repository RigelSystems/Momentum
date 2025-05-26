<script lang="ts">
import { defineComponent } from 'vue';

export interface HabitEntry {
  id?: number,
  name: string,
}

export default defineComponent({
  name: 'HabitEntryIcon',
  props: {
    checklistItem: {
      type: Object as () => HabitEntry,
      required: true,
    },
  },
});
</script>

<template>

</template>

