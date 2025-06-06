<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useAuthToken } from '@/composables/useAuthToken'

export default defineComponent({
  name: 'ChecklistItemCellTitle',
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
      content: props.cell?.content || 'Title',
    })

    const createTitle = () => {
      const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_titles`
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
        console.log('saved from cell title')
        emit('save')
      })
    }

    const updateTitle = () => {
      const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_titles/${props.cell.id}`
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

    const deleteTitle = () => {
      const delete_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_titles/${props.cell.id}`
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
        updateTitle()
      }
    })

    return {
      record,
      existingRecord,
      createTitle,
      deleteTitle,
    };
  },
});
</script>

<template>
  <div class="checklist-item-cell-title">
    <input v-if="editMode" type="text" v-model="record.content" />
    <span v-else>{{ record.content }}</span>

    <div v-if="editMode" class="checklist-item-cell-title__actions">
      <button v-if="!existingRecord" 
              @click="createTitle">
        <span class="mdi mdi-content-save"></span>
      </button>
      <button v-if="existingRecord" 
              @click="deleteTitle">
        <span class="mdi mdi-trash-can-outline"></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.checklist-item-cell-title input {
  width: 100%;
  height: 30px;
}

.checklist-item-cell-title {
  display: flex;
  justify-content: space-between;
}

.checklist-item-cell-title__actions {
  display: flex;
  gap: 0.5rem;
}

.checklist-item-cell-title__actions button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  transition: color 0.2s ease;
}

.checklist-item-cell-title__actions button:hover {
  color: var(--color-primary);
}

.checklist-item-cell-title__actions button:last-child:hover {
  color: var(--color-danger);
}
</style>