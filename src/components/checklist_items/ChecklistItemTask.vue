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
  name: 'ChecklistItemTask',
  props: {
    checklistItem: {
      type: Object as () => ChecklistItem,
      required: true,
    },
  },
});
</script>

<template>
  <div class="n-container-style">
    <h3 class="checklist-item-name">
      {{ checklistItem.name }}
    </h3>
    <div class="checklist-item-status">
      {{ checklistItem.status }}
    </div>
  </div>
</template>
