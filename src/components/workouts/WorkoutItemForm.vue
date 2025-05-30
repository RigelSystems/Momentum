<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import RecordForm from '../RecordForm.vue'
import { useAuthToken } from '@/composables/useAuthToken'

export interface WorkoutItem {
  id: number
  name: string
  icon: string
  status: string
  workout_id: number
  exercise_type: 'weighted' | 'timed'
  sets_completed?: number
  reps_completed?: number
  duration_completed?: number
  weight_completed?: number
  target_sets?: number
  target_reps?: number
  target_duration?: number
  target_weight?: number
}

export default defineComponent({
  name: 'WorkoutItemForm',
  props: {
    workoutId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    RecordForm
  },
  setup(props) {
    const { accessToken } = useAuthToken()
    const workoutItem = ref<Partial<WorkoutItem>>({
      name: '',
      workout_id: Number(props.workoutId),
      exercise_type: 'weighted',
      target_sets: 0,
      target_reps: 0,
      target_duration: 0,
      target_weight: 0
    })

    const isWeightedExercise = computed(() => workoutItem.value.exercise_type === 'weighted')
    const isTimedExercise = computed(() => workoutItem.value.exercise_type === 'timed')

    const endpoint = `${import.meta.env.VITE_API_URL}workout_items`
    const method = 'POST'

    const handleSave = async (savedRecord: WorkoutItem) => {
      window.location.reload()
    }

    return {
      workoutItem,
      endpoint,
      method,
      handleSave,
      accessToken,
      isWeightedExercise,
      isTimedExercise
    }
  }
})
</script>

<template>
  <RecordForm :record="workoutItem" :endpoint="endpoint" :method="method" @save="handleSave">
    <template #trigger="{ openDialog }">
      <slot name="trigger" :openDialog="openDialog">
        <n-button @click="openDialog">Add Exercise</n-button>
      </slot>
    </template>
    <template #title>
      <span>Add New Exercise</span>
    </template>
    <template #form="{ record }">
      <v-form>
        <NTextInput v-model:value="record.name" label="Exercise Name"></NTextInput>

        <NSelectInput
          v-model:value="record.exercise_type"
          :options="[
            { label: 'Weighted Exercise', value: 'weighted' },
            { label: 'Timed Exercise', value: 'timed' }
          ]"
          label="Exercise Type"
        ></NSelectInput>

        <template v-if="isWeightedExercise">
          <NTextInput 
            v-model:value="record.target_sets" 
            label="Target Sets" 
            type="number"
          ></NTextInput>

          <NTextInput 
            v-model:value="record.target_reps" 
            label="Target Reps" 
            type="number"
          ></NTextInput>

          <NTextInput 
            v-model:value="record.target_weight" 
            label="Target Weight (lbs)" 
            type="number"
          ></NTextInput>
        </template>

        <template v-if="isTimedExercise">
          <NTextInput 
            v-model:value="record.target_sets" 
            label="Target Sets" 
            type="number"
          ></NTextInput>

          <NTextInput 
            v-model:value="record.target_duration" 
            label="Target Duration (seconds)" 
            type="number"
          ></NTextInput>
        </template>
      </v-form>
    </template>
  </RecordForm>
</template> 