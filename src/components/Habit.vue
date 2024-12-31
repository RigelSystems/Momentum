<script lang="ts">
import { defineComponent } from 'vue';
import HabitForm from '@/components/habits/HabitForm.vue'

export interface Habit {
  id?: number // Optional for new records
  name: string,
  colour: string,
  icon: string,
  habit_group: {
    id: number,
    name: string,
  },
}

export default defineComponent({
  name: 'Habit',
  props: {
    habit: {
      type: Object as () => Habit,
      required: true,
    },
  },
  components: {
    HabitForm,
  },
});
</script>

<template>
  <div class="d-flex justify-space-start align-center">
    <HabitForm :habit="habit">
        <template #trigger="{ openDialog }">
          <v-btn
            density="default"
            icon="mdi-pencil"
            @click="openDialog"
            size="x-small"
            class="mr-2"
          ></v-btn>
        </template>
      </HabitForm>
    <v-icon class="mr-1">mdi-{{ habit.icon }}</v-icon>
    <div>
      <h2 class="habit-name">{{ habit.name }}</h2>
      <p>{{ habit.habit_group.name }}</p>
    </div>
  </div>
</template>
