<template>
  <div class="checklist-item-cell-toggle__container">
    <input v-if="editMode" type="text" v-model="record.label" placeholder="Label" />
    <div v-else class="checklist-item-cell-toggle__label">{{ record.label }}</div>

    <div class="checklist-item-cell-toggle__toggle">
      <button 
        :class="['toggle-button', { 'is-checked': record.value }]"
        @click="toggleValue"
        :disabled="!editMode">
        <span :class="['mdi', record.value ? 'mdi-check' : 'mdi-close']"></span>
      </button>
    </div>

    <div v-if="editMode" class="checklist-item-cell-toggle__actions">
      <button v-if="!existingRecord"
              @click="createToggle">
        <span class="mdi mdi-content-save"></span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useAuthToken } from '@/composables/useAuthToken'

export interface ToggleRecord {
  id?: number;
  label: string;
  value: boolean;
  checklist_item_cell: {
    id?: number;
    label: string;
    value: boolean;
  }
  cellable: {
    id?: number;
    label: string;
    value: boolean;
  }
}

export default defineComponent({
  name: 'ChecklistItemCellToggle',
  props: {
    checklistItemId: {
      type: Number,
      required: true,
    },
    cell: {
      type: Object as () => ToggleRecord | undefined,     
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

    const record = ref<ToggleRecord>({
      id: props.cell?.cellable?.id,
      label: props.cell?.cellable?.label || '',
      value: props.cell?.cellable?.value || false,
      checklist_item_cell: props.cell?.cellable || {
        label: '',
        value: false,
      },
      cellable: props.cell?.cellable || {
        label: '',
        value: false,
      },
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
        emit('save')
      })
    }

    const updateToggle = () => {
      const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_toggles/${props.cell?.cellable?.id}`
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

    const toggleValue = () => {
      record.value.value = !record.value.value
      if (existingRecord.value) {
        updateToggle()
      }
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
      toggleValue,
    };
  },
});
</script>

<style scoped>
.checklist-item-cell-toggle__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.checklist-item-cell-toggle__label {
  font-size: 0.9em;
  color: var(--color-text-light);
}

.checklist-item-cell-toggle__toggle {
  display: inline-block;
}

.toggle-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--color-text-light);
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toggle-button.is-checked {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.toggle-button:not(.is-checked) {
  color: var(--color-text-light);
}

.toggle-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.toggle-button .mdi {
  font-size: 1.5em;
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