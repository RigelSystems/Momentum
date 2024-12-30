<script lang="ts">
import { defineComponent } from 'vue';
import HabitFrom from '@/components/habits/HabitForm.vue'

export default defineComponent({
  name: 'Habit',
  props: {
    habit: {
      type: Object,
      required: true,
    },
  },
  components: {
    HabitFrom,
  },
  setup(props) {
    return {
      habit: props.habit,
    };
  },
});
</script>

<template>
  <div>
    <HabitForm :habit="habit" />
    <h2>{{ habit.name }}</h2>
  </div>
</template>
