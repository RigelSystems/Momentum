<script lang="ts">
import { defineComponent, computed } from 'vue';
import ChecklistItemForm from '@/components/checklist_items/ChecklistItemForm.vue'

export interface ChecklistItem {
  id?: number,
  name: string,
  icon: string,
  value: string,
  checklist_id: number,
}

export default defineComponent({
  name: 'ChecklistItemRating',
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

    const rating = computed(() => {
      const value = parseFloat(props.checklistItem.value);
      if (isNaN(value) || value < 0.5 || value > 5) {
        return 0;
      }
      return value;
    });

    const stars = computed(() => {
      const fullStars = Math.floor(rating.value);
      const hasHalfStar = rating.value % 1 >= 0.5;
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
      
      return {
        full: fullStars,
        half: hasHalfStar ? 1 : 0,
        empty: emptyStars
      };
    });

    return {
      handleSave,
      stars,
      rating
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
      <div class="rating-stars">
        <template v-for="n in stars.full" :key="'full-' + n">
          <i class="mdi mdi-star"></i>
        </template>
        <template v-if="stars.half">
          <i class="mdi mdi-star-half-full"></i>
        </template>
        <template v-for="n in stars.empty" :key="'empty-' + n">
          <i class="mdi mdi-star-outline"></i>
        </template>
        <span class="rating-value">({{ rating }})</span>
      </div>
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

<style scoped>
.rating-stars {
  display: flex;
  align-items: center;
  gap: 2px;
}

.rating-stars i {
  color: #ffd700;
  font-size: 1.2em;
}

.rating-value {
  margin-left: 8px;
  color: #666;
}
</style>
