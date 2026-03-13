<script lang="ts">
import { defineComponent } from 'vue';
import HabitForm from '@/components/habits/HabitForm.vue'

export interface Habit {
  id?: number // Optional for new records
  name: string,
  colour: string,
  icon: string,
  habit_type: string,
  habit_group_id: number,
  habit_group: {
    id: number,
    name: string,
  },
  users: Array<{
    id: number,
    name: string,
    image: string,
  }>,
}

export default defineComponent({
  name: 'Habit',
  props: {
    habit: {
      type: Object as () => Habit,
      required: true,
    },
    fetchHabits: {
      type: Function,
      required: true,
    },
  },
  components: {
    HabitForm,
  },
});
</script>

<template>
  <div class="habit-row">
    <HabitForm
      :habit="habit"
      :fetchHabits="fetchHabits"
    >
      <template #trigger="{ openDialog }">
        <span class="mdi mdi-pencil habit-row__edit" @click="openDialog"></span>
      </template>
    </HabitForm>
    <v-icon class="habit-row__icon">mdi-{{ habit.icon }}</v-icon>
    <a :href="`/#/habits/${ habit.id }`" class="habit-row__name">{{ habit.name }}</a>
  </div>
</template>

<style scoped>
.habit-row {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.habit-row__edit {
  font-size: 0.75rem;
  color: #c4c9d4 !important;
  cursor: pointer;
  transition: color 0.15s;
  flex-shrink: 0;
}

.habit-row__edit:hover {
  color: #6b7280 !important;
}

.habit-row__icon {
  font-size: 0.75rem !important;
  flex-shrink: 0;
}

.habit-row__name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.habit-row__name:hover {
  color: var(--theme-color, #88bdb9);
}
</style>
