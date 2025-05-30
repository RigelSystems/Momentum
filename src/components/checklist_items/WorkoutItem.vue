<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthToken } from '@/composables/useAuthToken'

export interface WorkoutItem {
  id: number
  name: string
  icon: string
  status: string
  checklist_id: number
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

    const updateWorkoutItem = async (updates: Partial<WorkoutItem>) => {
      loading.value = true
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}checklist_items/${props.workoutItem.id}`, {
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

        // Emit update event to parent
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
      updateWorkoutItem
    }
  }
})
</script>

<template>
  <NCard :title="workoutItem.name">
    <template #content>
      <div class="workout-item-content">
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