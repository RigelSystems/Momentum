<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useAuthToken } from '@/composables/useAuthToken'

export default defineComponent({
  name: 'ChecklistItemCellRating',
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
      value: props.cell?.cellable?.value || 0,
    })
    const hoverRating = ref(0)

    const createRating = () => {
      const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_ratings`
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

    const updateRating = () => {
      const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_ratings/${props.cell?.cellable?.id}`
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

    watch(() => props.editMode, (newValue, oldValue) => {
      if (oldValue === true && newValue === false && existingRecord.value) {
        updateRating()
      }
    })

    const handleStarHover = (rating: number) => {
      if (props.editMode) {
        hoverRating.value = rating
      }
    }

    const handleStarClick = (rating: number) => {
      if (props.editMode) {
        record.value.value = rating
      }
    }

    const handleMouseLeave = () => {
      hoverRating.value = 0
    }

    return {
      record,
      hoverRating,
      existingRecord,
      handleStarHover,
      handleStarClick,
      handleMouseLeave,
      createRating,
    };
  },
});
</script>

<template>
  <div :class="['checklist-item-cell-rating', 'checklist-item-cell', { 'checklist-item-cell-rating--edit': editMode }]">
    <div v-if="editMode" 
         class="checklist-item-cell-rating__stars"
         @mouseleave="handleMouseLeave">
      <span v-for="star in 5" 
            :key="star"
            class="checklist-item-cell-rating__star"
            :class="{ 'is-active': star <= (hoverRating || record.value) }"
            @mouseover="handleStarHover(star)"
            @click="handleStarClick(star)">
        <span class="mdi" :class="star <= (hoverRating || record.value) ? 'mdi-star' : 'mdi-star-outline'"></span>
      </span>
    </div>
    <div v-else class="checklist-item-cell-rating__stars">
      <span v-for="star in 5" 
            :key="star"
            class="checklist-item-cell-rating__star"
            :class="{ 'is-active': star <= record.value }">
        <span class="mdi" :class="star <= record.value ? 'mdi-star' : 'mdi-star-outline'"></span>
      </span>
    </div>

    <div v-if="editMode" class="checklist-item-cell-rating__actions">
      <button v-if="!existingRecord" 
              @click="createRating">
        <span class="mdi mdi-content-save"></span>
      </button>
    </div>
  </div>
</template>

<style scoped>

.checklist-item-cell-rating {
  display: flex;
  justify-content: space-between;   
  align-items: center;
}

.checklist-item-cell-rating__label {
  font-size: 0.9em;
  color: var(--color-text-light);
  margin-bottom: 0.5em;
}

.checklist-item-cell-rating__stars {
  display: flex;
  gap: 0.25rem;
}

.checklist-item-cell-rating__star {
  font-size: 1.5em;
  color: var(--color-text-light);
  cursor: pointer;
  transition: color 0.2s ease;
}

.checklist-item-cell-rating__star.is-active {
  color: var(--color-primary);
}

.checklist-item-cell-rating__star:hover {
  color: var(--color-primary);
}

.checklist-item-cell-rating__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.checklist-item-cell-rating__actions button {
  padding: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  transition: color 0.2s ease;
}

.checklist-item-cell-rating__actions button:hover {
  color: var(--color-primary);
}

.checklist-item-cell-rating__actions button:last-child:hover {
  color: var(--color-danger);
}
</style> 