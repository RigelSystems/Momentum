<script lang="ts">
import { defineComponent } from 'vue';

export interface ChecklistItem {
  id?: number,
  name: string,
  icon: string,
  status: string,
  checklist_id: number,
  reps?: Number,
  sets?: Number,
  checklist_item_type?: string[],
  checklist_item_type_classify?: string,
  weight?: number,
  rest?: number,
  unit?: string,
}

export default defineComponent({
  name: 'ChecklistItemWeightedExercise',
  props: {
    checklistItem: {
      type: Object as () => ChecklistItem,
      required: true,
    },
  },
});
</script>

<template>
  <div class="n-container-style">
    <h3>{{ checklistItem.name }}</h3>
    <p>
      <span class="mdi mdi-weight">{{ checklistItem.weight }}{{ checklistItem.unit }}</span>
      <span class="mdi mdi-repeat">{{ checklistItem.sets }} × {{ checklistItem.reps }}</span>
      <span class="mdi mdi-sleep">{{ checklistItem.rest }} secs</span>
    </p>
  </div>
</template>

<style scoped>
p {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.mdi {
  font-size: 0.9rem;
}
</style>
