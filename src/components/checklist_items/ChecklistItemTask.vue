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
  name: 'ChecklistItemTask',
  components: {
    ChecklistItemForm
  },
  props: {
    checklistItem: {
      type: Object as () => ChecklistItem,
      required: true,
    },
  },
  setup(props, {emit}) {
    const handleSave = () => {
      emit('save')
    }

    return {
      handleSave
    }
  }
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
    <ChecklistItemForm @save="handleSave" :checklistItem="checklistItem">
        <template #trigger="{ openDialog }">
          <n-button
            @click="openDialog"
          >Edit item</n-button>
        </template>
    </ChecklistItemForm>
  </div>
</template>
