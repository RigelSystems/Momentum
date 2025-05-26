<script lang="ts">
import { defineComponent } from 'vue';

export interface ChecklistItem {
  id?: number,
  name: string,
  icon: string,
  status: string,
  checklist_id: number,
}

export default defineComponent({
  name: 'ChecklistItemTimedExercise',
  props: {
    checklistItem: {
      type: Object as () => ChecklistItem,
      required: true,
    },
  },
});
</script>

<template>
  Timed checklist item component
</template>
