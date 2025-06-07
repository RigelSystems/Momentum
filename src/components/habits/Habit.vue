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
  <div class="d-flex justify-space-start align-center">
    <HabitForm
      :habit="habit"
      :fetchHabits="fetchHabits"
    >
      <template #trigger="{ openDialog }">
        <span class="mdi mdi-square-edit-outline clickable" @click="openDialog"></span>
      </template>
    </HabitForm>
    <v-icon class="mr-1">mdi-{{ habit.icon }}</v-icon>
    <div>
      <a :href="`/#/habits/${ habit.id }`">{{ habit.name }}</a>
    </div>
  </div>
</template>

<style scoped>
.v-icon--size-default {
  font-size: 0.75rem;
}

.clickable {
  cursor: pointer;
}
</style>
