<template>
  <div>
    <input v-if="editMode" type="text" v-model="record.label" placeholder="Label" />
    <div v-else class="checklist-item-cell-text__label">{{ record.label }}</div>
    <textarea v-if="editMode" v-model="record.content" placeholder="Content"></textarea>
    <div v-else class="checklist-item-cell-text__content">{{ record.content }}</div>

    <div v-if="editMode" class="checklist-item-cell-text__actions">
      <button v-if="!existingRecord" 
              @click="createText">
        <span class="mdi mdi-content-save"></span>
      </button>
      <button v-if="existingRecord" 
              @click="deleteText">
        <span class="mdi mdi-trash-can-outline"></span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useAuthToken } from '@/composables/useAuthToken'

export default defineComponent({
  name: 'ChecklistItemCellText',
  props: {
    checklistItemId: {
      type: Number,
      required: true,
    },
    cell: {
      type: Object,
      required: true,
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const existingRecord = computed(() => props.cell?.id)
    const { accessToken } = useAuthToken()
    const record = ref({
      content: props.cell?.content || '',
      label: props.cell?.label || '',
    })

    const createText = () => {
      const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_texts`
      const data = {
        checklist_item_cell: record.value,
      }
      fetch(save_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.value}`,
        },
        body: JSON.stringify(data),
      }).then(() => {
        emit('saved')
      })
    }

    const updateText = () => {
      const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_texts/${props.cell.id}`
      const data = {
        checklist_item_cell: record.value,
      }
      fetch(save_url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.value}`,
        },
        body: JSON.stringify(data),
      })
    }

    const deleteText = () => {
      const delete_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_texts/${props.cell.id}`
      fetch(delete_url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
        },
      }).then(() => {
        emit('deleted')
      })
    }

    watch(() => props.editMode, (newValue, oldValue) => {
      if (oldValue === true && newValue === false && existingRecord.value) {
        updateText()
      }
    })

    return {
      record,
      existingRecord,
      createText,
      deleteText,
    };
  },
});
</script>

<style scoped>
.checklist-item-cell-text__label {
  font-size: 0.9em;
  color: var(--color-text-light);
  margin-bottom: 0.5em;
}

.checklist-item-cell-text__content {
  font-size: 0.9em;
  white-space: pre-wrap;
}

.checklist-item-cell-text__input {
  width: 100%;
  background: transparent;
  border: none;
  font-size: 0.9em;
  color: inherit;
  padding: 0;
  resize: vertical;
  min-height: 60px;
}

.checklist-item-cell-text__input:focus {
  outline: none;
}

.checklist-item-cell-text__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.checklist-item-cell-text__actions button {
  padding: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  transition: color 0.2s ease;
}

.checklist-item-cell-text__actions button:hover {
  color: var(--color-primary);
}

.checklist-item-cell-text__actions button:last-child:hover {
  color: var(--color-danger);
}
</style> 