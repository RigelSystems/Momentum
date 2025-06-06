<template>
  <div>
    <input v-if="editMode" type="text" v-model="record.url" placeholder="Image URL" />
    <img v-else :src="record.url" :alt="record.alt_text" class="checklist-item-cell-image__image" />

    <div v-if="editMode" class="checklist-item-cell-image__actions">
      <button v-if="!existingRecord" 
              @click="createImage">
        <span class="mdi mdi-content-save"></span>
      </button>
      <button v-if="existingRecord" 
              @click="deleteImage">
        <span class="mdi mdi-trash-can-outline"></span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useAuthToken } from '@/composables/useAuthToken'

export default defineComponent({
  name: 'ChecklistItemCellImage',
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
      url: props.cell?.url || '',
      alt_text: props.cell?.alt_text || '',
    })

    const createImage = () => {
      const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_images`
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

    const updateImage = () => {
      const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_images/${props.cell.id}`
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

    const deleteImage = () => {
      const delete_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_images/${props.cell.id}`
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
        updateImage()
      }
    })

    return {
      record,
      existingRecord,
      createImage,
      deleteImage,
    };
  },
});
</script>

<style scoped>
.checklist-item-cell-image__image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.checklist-item-cell-image__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.checklist-item-cell-image__actions button {
  padding: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  transition: color 0.2s ease;
}

.checklist-item-cell-image__actions button:hover {
  color: var(--color-primary);
}

.checklist-item-cell-image__actions button:last-child:hover {
  color: var(--color-danger);
}
</style> 