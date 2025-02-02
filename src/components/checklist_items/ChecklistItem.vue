<script lang="ts">
import { defineComponent } from 'vue';
import ChecklistItemForm from '@/components/checklist_items/ChecklistItemForm.vue'

export interface ChecklistItem {
  id?: number,
  name: string,
  icon: string,
  status: string,
  checklist_id: number,
}

export default defineComponent({
  name: 'ChecklistItem',
  props: {
    checklistItem: {
      type: Object as () => ChecklistItem,
      required: true,
    },
  },
  components: {
    ChecklistItemForm,
  },
});
</script>

<template>
  <div class="table-group-name">
    <ChecklistItemForm :checklistItem="checklistItem">
      <template #trigger="{ openDialog }">
        <v-btn
          density="default"
          icon="mdi-dots-vertical"
          @click="openDialog"
          size="medium"
          class="mr-2 kabab-menu"
        ></v-btn>
      </template>
    </ChecklistItemForm>
    <v-icon class="mr-2" size="small">mdi-{{ checklistItem.icon }}</v-icon>
    <h3>{{ checklistItem.name }} - {{ checklistItem.status }}</h3>
  </div>
</template>
