<script lang="ts">
import { defineComponent } from 'vue';
import HabitEntry from '@/components/HabitEntry.vue'

export default defineComponent({
  name: 'Habit',
  props: {
    habit: {
      type: Object,
      required: true,
    },
  },
  components: {
    HabitEntry,
  },
  setup(props) {
    return {
      habit: props.habit,
    };
  },
});
</script>

<template>
  <div class="habit-wrapper">
    <h2>{{ habit.name }}</h2>
    <p>{{ habit.description }}</p>
    <HabitEntry v-for="entry in habit.habit_entries" :key="entry.id" :entry="entry" />
  </div>
</template>
