<template>
  <div>
    <input v-if="editMode" type="text" v-model="record.label" placeholder="Label" />
    <div v-else class="checklist-item-cell-toggle__label">{{ record.label }}</div>
    
    <div class="checklist-item-cell-toggle__toggle">
      <input type="checkbox" 
             :id="`toggle-${$props.cell?.id || 'new'}`"
             v-model="record.value"
             :disabled="!editMode" />
      <label :for="`toggle-${$props.cell?.id || 'new'}`"></label>
    </div>

    <div v-if="editMode" class="checklist-item-cell-toggle__actions">
      <button v-if="!existingRecord" 
              @click="createToggle">
        <span class="mdi mdi-content-save"></span>
      </button>
      <button v-if="existingRecord" 
              @click="deleteToggle">
        <span class="mdi mdi-trash-can-outline"></span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useAuthToken } from '@/composables/useAuthToken'

export default defineComponent({
  name: 'ChecklistItemCellToggle',
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
      label: props.cell?.label || '',
      value: props.cell?.value || false,
    })

    const createToggle = () => {
      const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_toggles`
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

    const updateToggle = () => {
      const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_toggles/${props.cell.id}`
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

    const deleteToggle = () => {
      const delete_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_toggles/${props.cell.id}`
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
        updateToggle()
      }
    })

    return {
      record,
      existingRecord,
      createToggle,
      deleteToggle,
    };
  },
});
</script>

<style scoped>
.checklist-item-cell-toggle__label {
  font-size: 0.9em;
  color: var(--color-text-light);
  margin-bottom: 0.5em;
}

.checklist-item-cell-toggle__toggle {
  position: relative;
  display: inline-block;
}

.checklist-item-cell-toggle__toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.checklist-item-cell-toggle__toggle label {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  background-color: #ccc;
  border-radius: 34px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.checklist-item-cell-toggle__toggle label:before {
  content: '';
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  top: 4px;
  left: 4px;
  background-color: white;
  transition: transform 0.2s ease;
}

.checklist-item-cell-toggle__toggle input:checked + label {
  background-color: var(--color-primary);
}

.checklist-item-cell-toggle__toggle input:checked + label:before {
  transform: translateX(26px);
}

.checklist-item-cell-toggle__toggle input:disabled + label {
  opacity: 0.7;
  cursor: not-allowed;
}

.checklist-item-cell-toggle__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.checklist-item-cell-toggle__actions button {
  padding: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  transition: color 0.2s ease;
}

.checklist-item-cell-toggle__actions button:hover {
  color: var(--color-primary);
}

.checklist-item-cell-toggle__actions button:last-child:hover {
  color: var(--color-danger);
}
</style> 