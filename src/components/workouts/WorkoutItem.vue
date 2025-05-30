<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useAuthToken } from '@/composables/useAuthToken'
import type { WorkoutItem } from './WorkoutItemForm.vue'

export default defineComponent({
  name: 'WorkoutItem',
  props: {
    workoutItem: {
      type: Object as () => WorkoutItem,
      required: true
    }
  },
  setup(props) {
    const { accessToken } = useAuthToken()
    const loading = ref(false)

    const isWeightedExercise = computed(() => props.workoutItem.exercise_type === 'weighted')
    const isTimedExercise = computed(() => props.workoutItem.exercise_type === 'timed')

    const updateWorkoutItem = async (updates: Partial<WorkoutItem>) => {
      loading.value = true
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}workout_items/${props.workoutItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken.value}`,
          },
          body: JSON.stringify(updates),
        })

        if (!response.ok) {
          throw new Error('Failed to update workout item')
        }

        return await response.json()
      } catch (error) {
        console.error('Error updating workout item:', error)
        throw error
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      updateWorkoutItem,
      isWeightedExercise,
      isTimedExercise
    }
  }
})
</script>

<template>
  <NCard :title="workoutItem.name">
    <template #content>
      <div class="workout-item-content">
        <div class="workout-metric">
          <label>Exercise Type:</label>
          <span>{{ workoutItem.exercise_type === 'weighted' ? 'Weighted' : 'Timed' }}</span>
        </div>

        <div v-if="workoutItem.target_sets" class="workout-metric">
          <label>Sets:</label>
          <NTextInput
            v-model:value="workoutItem.sets_completed"
            type="number"
            :min="0"
            :max="workoutItem.target_sets"
            @update:value="updateWorkoutItem({ sets_completed: $event })"
          />
          <span>/ {{ workoutItem.target_sets }}</span>
        </div>

        <template v-if="isWeightedExercise">
          <div v-if="workoutItem.target_reps" class="workout-metric">
            <label>Reps:</label>
            <NTextInput
              v-model:value="workoutItem.reps_completed"
              type="number"
              :min="0"
              :max="workoutItem.target_reps"
              @update:value="updateWorkoutItem({ reps_completed: $event })"
            />
            <span>/ {{ workoutItem.target_reps }}</span>
          </div>

          <div v-if="workoutItem.target_weight" class="workout-metric">
            <label>Weight (lbs):</label>
            <NTextInput
              v-model:value="workoutItem.weight_completed"
              type="number"
              :min="0"
              @update:value="updateWorkoutItem({ weight_completed: $event })"
            />
            <span>/ {{ workoutItem.target_weight }}</span>
          </div>
        </template>

        <template v-if="isTimedExercise">
          <div v-if="workoutItem.target_duration" class="workout-metric">
            <label>Duration (s):</label>
            <NTextInput
              v-model:value="workoutItem.duration_completed"
              type="number"
              :min="0"
              :max="workoutItem.target_duration"
              @update:value="updateWorkoutItem({ duration_completed: $event })"
            />
            <span>/ {{ workoutItem.target_duration }}</span>
          </div>
        </template>
      </div>
    </template>
  </NCard>
</template>

<style scoped>
.workout-item-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workout-metric {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.workout-metric label {
  min-width: 100px;
}
</style> 