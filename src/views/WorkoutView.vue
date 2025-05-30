<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import WorkoutForm from '@/components/workouts/WorkoutForm.vue'
import WorkoutItemForm from '@/components/checklist_items/WorkoutItemForm.vue'
import WorkoutItem from '@/components/checklist_items/WorkoutItem.vue'
import { useRoute } from 'vue-router'
import { useAuthToken } from '@/composables/useAuthToken'

export interface Workout {
  id?: number
  name: string
  description?: string
  status: string
  checklist_items: Array<any>
}

export default defineComponent({
  name: 'WorkoutView',
  components: {
    PageHeader,
    WorkoutForm,
    WorkoutItemForm,
    WorkoutItem
  },
  setup() {
    const { accessToken } = useAuthToken()
    const workout = ref<Workout>({
      name: '',
      description: '',
      status: '',
      checklist_items: []
    })
    const errorMessage = ref<string | null>(null)
    const loading = ref(true)
    const breadcrumbs = ref([
      {
        title: 'Workouts',
        disabled: false,
        href: '/#/workouts',
      }
    ])
    const route = useRoute()
    const workoutId = ref(route.params.id)

    watch(() => route.params.id, (newId) => {
      workoutId.value = newId
    })

    const fetchWorkout = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}checklists/${workoutId.value}`
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      if (response.ok) {
        loading.value = false
        const responseBody = await response.json()
        workout.value = responseBody
        breadcrumbs.value.push({
          title: responseBody.name,
          disabled: true,
          href: `/workouts/${workoutId}`,
        })
      } else {
        loading.value = false
        const responseBody = await response.json()
        errorMessage.value = responseBody.error
      }
    }

    watch(accessToken, (newValue) => {
      if (newValue) {
        fetchWorkout()
      }
    }, { immediate: true })

    const workoutItemBulkUpdateUrl = `${import.meta.env.VITE_API_URL}checklist_items/bulk_update`

    return {
      workout,
      breadcrumbs,
      workoutItemBulkUpdateUrl,
      accessToken,
      errorMessage,
      loading,
    }
  },
})
</script>

<template>
  <div class="page-header">
    <PageHeader :title="workout.name" />
    <WorkoutForm :workout="workout">
      <template #trigger="{ openDialog }">
        <n-button
          @click="openDialog"
        >Edit Workout</n-button>
      </template>
    </WorkoutForm>

    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:prepend>
        <v-icon icon="$vuetify" size="small"></v-icon>
      </template>
    </v-breadcrumbs>
  </div>

  <div class="p-1">
    <n-order-list :items="workout.checklist_items" :updateUrl="workoutItemBulkUpdateUrl" :accessToken="accessToken" :loading="loading" modelName="workout_items">
      <template #default="workout_item">
        <WorkoutItem :workoutItem="workout_item" />
      </template>
    </n-order-list>
  </div>

  <WorkoutItemForm :workoutId="workoutId">
    <template #trigger="{ openDialog }">
      <n-button
        class="m-1"
        @click="openDialog"
      >New Exercise</n-button>
    </template>
  </WorkoutItemForm>
</template> 