<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useAuthToken } from '@/composables/useAuthToken'
import WorkoutForm from '@/components/workouts/WorkoutForm.vue'

export interface Workout {
  id: number
  name: string
  description?: string
  status: string
  checklist_items: Array<any>
}

export default defineComponent({
  name: 'WorkoutsView',
  components: {
    PageHeader,
    WorkoutForm
  },
  setup() {
    const { accessToken } = useAuthToken()
    const loading = ref(true)
    const workouts = ref<Workout[]>([])
    const errorMessage = ref<string | null>(null)

    const fetchWorkouts = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}workouts`
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      if (response.ok) {
        const responseBody = await response.json()
        workouts.value = responseBody
        loading.value = false
      } else {
        const responseBody = await response.json()
        errorMessage.value = responseBody.error
        loading.value = false
      }
    }

    watch(accessToken, (newValue) => {
      if (newValue) {
        fetchWorkouts()
      }
    }, { immediate: true })

    const handleWorkoutSaved = () => {
      fetchWorkouts()
    }

    return {
      workouts,
      loading,
      errorMessage,
      handleWorkoutSaved
    }
  },
})
</script>

<template>
  <div class="standard-container p-1">
    <PageHeader title="Workouts" />
  </div>

  <div class="p-1">
    <WorkoutForm @save="handleWorkoutSaved">
      <template #trigger="{ openDialog }">
        <n-button @click="openDialog">New Workout</n-button>
      </template>
    </WorkoutForm>
  </div>

  <n-order-list
    :items="workouts"
    :loading="loading"
    modelName="workouts"
  >
    <template #default="workout">
      <NCard :title="workout.name">
        <template #content>
          <p>{{ workout.description }}</p>
          <RouterLink
            :to="{ name: 'workout', params: { id: workout.id } }"
            class="mr-2"
          >
            View
          </RouterLink>
        </template>
      </NCard>
    </template>
  </n-order-list>
</template> 