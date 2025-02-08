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
        <v-btn
        density="default"
        icon="mdi-dots-vertical"
        @click="openDialog"
        size="x-small"
        class="mr-2 kabab-menu"
        ></v-btn>
      </template>
    </HabitForm>
    <v-icon class="mr-1">mdi-{{ habit.icon }}</v-icon>
    <div class="mr-1" v-if="habit.users.length > 1">
      <div v-for="user in habit.users" :key="user.id">
        <img class="sm-icon circle" :src="user.image" :alt="user.name" />
      </div>
    </div>
    <div>
      <h2 class="habit-name">{{ habit.name }}</h2>
    </div>
  </div>
</template>
