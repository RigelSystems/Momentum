<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthToken } from '@/composables/useAuthToken'

export interface WeightedExercise {
  id?: number
  name: string
  exercise_type: 'weighted'
  target_sets: number
  target_reps: number
  target_weight: number
  weight_unit: string
  rest_period: number
  sets_completed?: number
  reps_completed?: number
  weight_completed?: number
}

export default defineComponent({
  name: 'WeightedExerciseForm',
  props: {
    workoutId: {
      type: Number,
      required: true
    },
    exercise: {
      type: Object as () => Partial<WeightedExercise>,
      default: () => ({
        exercise_type: 'weighted',
        target_sets: 0,
        target_reps: 0,
        target_weight: 0,
        weight_unit: 'kg',
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
  <div class="weighted-exercise-form">
    <NTextInput
      v-model:value="exercise.name"
      name="name"
      label="Exercise Name"
      required
    />

    <NTextInput
      v-model:value="exercise.target_sets"
      name="target_sets"
      label="Target Sets"
      type="number"
      required
    />

    <NTextInput
      v-model:value="exercise.target_reps"
      name="target_reps"
      label="Target Reps"
      type="number"
      required
    />

    <NTextInput
      v-model:value="exercise.target_weight"
      name="target_weight"
      label="Target Weight"
      type="number"
      required
    />

    <NSelect
      v-model:value="exercise.weight_unit"
      name="weight_unit"
      label="Weight Unit"
      :options="[
        { value: 'kg', label: 'Kilograms' },
        { value: 'lbs', label: 'Pounds' }
      ]"
      required
    />

    <NTextInput
      v-model:value="exercise.rest_period"
      name="rest_period"
      label="Rest Period (seconds)"
      type="number"
      required
    />

    <input type="hidden" name="workout_id" :value="workoutId" />
    <input type="hidden" name="exercise_type" value="weighted" />
  </div>
</template>

<style scoped>
.weighted-exercise-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style> 