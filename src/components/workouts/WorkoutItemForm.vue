<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useAuthToken } from '@/composables/useAuthToken'
import { useRoute } from 'vue-router'
import RecordForm from '../RecordForm.vue'
import WeightedExerciseForm from './WeightedExerciseForm.vue'
import TimedExerciseForm from './TimedExerciseForm.vue'
import type { WeightedExercise } from './WeightedExerciseForm.vue'
import type { TimedExercise } from './TimedExerciseForm.vue'

export type ExerciseType = 'weighted' | 'timed'
export type Exercise = WeightedExercise | TimedExercise

export default defineComponent({
  name: 'WorkoutItemForm',
  components: {
    RecordForm,
    WeightedExerciseForm,
    TimedExerciseForm
  },
  props: {
    workoutId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const { accessToken } = useAuthToken()
    const exerciseType = ref<ExerciseType>('weighted')
    const exercise = ref<Exercise>({
      name: '',
      exercise_type: 'weighted',
      target_sets: 0,
      target_reps: 0,
      target_weight: 0,
      weight_unit: 'kg',
      rest_period: 60
    })

    const handleExerciseTypeChange = (type: ExerciseType) => {
      exerciseType.value = type
      if (type === 'weighted') {
        exercise.value = {
          name: '',
          exercise_type: 'weighted',
          target_sets: 0,
          target_reps: 0,
          target_weight: 0,
          weight_unit: 'kg',
          rest_period: 60
        }
      } else {
        exercise.value = {
          name: '',
          exercise_type: 'timed',
          target_duration: 0,
          target_distance: 0,
          distance_unit: 'km',
          rest_period: 60
        }
      }
    }

    const endpoint = computed(() => `${import.meta.env.VITE_API_URL}workout_items`)
    const method = computed(() => 'POST')

    const handleSave = async (savedExercise: Exercise) => {
      window.location.reload()
    }

    return {
      accessToken,
      exerciseType,
      exercise,
      handleExerciseTypeChange,
      handleSave,
      endpoint,
      method
    }
  }
})
</script>

<template>
  <RecordForm :record="exercise" :endpoint="endpoint" :method="method" @save="handleSave">
    <template #trigger="{ openDialog }">
      <slot name="trigger" :openDialog="openDialog">
        <NButton label="Add Exercise" />
      </slot>
    </template>
    <template #title>
      <span>Add New Exercise</span>
    </template>
    <template #form="{ record }">
      <div class="workout-item-form">
        <NSelect
          v-model:value="exerciseType"
          label="Exercise Type"
          :options="[
            { value: 'weighted', label: 'Weighted Exercise' },
            { value: 'timed', label: 'Timed Exercise' }
          ]"
          @update:value="handleExerciseTypeChange"
        />

        <WeightedExerciseForm
          v-if="exerciseType === 'weighted'"
          :workoutId="workoutId"
          :exercise="record"
          @save="handleSave"
        />

        <TimedExerciseForm
          v-if="exerciseType === 'timed'"
          :workoutId="workoutId"
          :exercise="record"
          @save="handleSave"
        />
      </div>
    </template>
  </RecordForm>
</template>

<style scoped>
.workout-item-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
