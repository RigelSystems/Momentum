<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthToken } from '@/composables/useAuthToken'

export interface TimedExercise {
  id?: number
  name: string
  exercise_type: 'timed'
  target_duration: number
  target_distance?: number
  distance_unit?: string
  rest_period: number
  duration_completed?: number
  distance_completed?: number
}

export default defineComponent({
  name: 'TimedExerciseForm',
  props: {
    workoutId: {
      type: Number,
      required: true
    },
    exercise: {
      type: Object as () => Partial<TimedExercise>,
      default: () => ({
        exercise_type: 'timed',
        target_duration: 0,
        target_distance: 0,
        distance_unit: 'km',
        rest_period: 60
      })
    }
  },
  setup(props) {
    const { accessToken } = useAuthToken()
    return {
      accessToken
    }
  }
})
</script>

<template>
  <div class="timed-exercise-form">
    <NTextInput
      v-model:value="exercise.name"
      name="name"
      label="Exercise Name"
      required
    />

    <NTextInput
      v-model:value="exercise.target_duration"
      name="target_duration"
      label="Target Duration (seconds)"
      type="number"
      required
    />

    <NTextInput
      v-model:value="exercise.target_distance"
      name="target_distance"
      label="Target Distance"
      type="number"
    />

    <NSelect
      v-model:value="exercise.distance_unit"
      name="distance_unit"
      label="Distance Unit"
      :options="[
        { value: 'km', label: 'Kilometers' },
        { value: 'm', label: 'Meters' },
        { value: 'mi', label: 'Miles' }
      ]"
    />

    <NTextInput
      v-model:value="exercise.rest_period"
      name="rest_period"
      label="Rest Period (seconds)"
      type="number"
      required
    />

    <input type="hidden" name="workout_id" :value="workoutId" />
    <input type="hidden" name="exercise_type" value="timed" />
  </div>
</template>

<style scoped>
.timed-exercise-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style> 