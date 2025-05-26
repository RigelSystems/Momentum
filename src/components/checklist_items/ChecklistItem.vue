<script lang="ts">
import { defineComponent } from 'vue';
import ChecklistItemForm from '@/components/checklist_items/ChecklistItemForm.vue'
import ChecklistItemWeightedExercise from '@/components/checklist_items/ChecklistItemWeightedExercise.vue'
import ChecklistItemTimedExercise from './ChecklistItemTimedExercise.vue';
import ChecklistItemTask from './ChecklistItemTask.vue';

export interface ChecklistItem {
  id?: number,
  name: string,
  icon: string,
  status: string,
  checklist_id: number,
  checklist_item_type?: string[],
  checklist_item_type_classify?: string,
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
    ChecklistItemWeightedExercise,
    ChecklistItemTimedExercise,
    ChecklistItemTask,
  },
});
</script>

<template>
  <div>
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
    <component
      :is="`ChecklistItem${checklistItem.checklist_item_type_classify}`"
      :checklistItem="checklistItem"
    ></component>
  </div>
</template>
