<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import RecordForm from '../RecordForm.vue'
import { useAuthToken } from '@/composables/useAuthToken'
import NSelectInputFromRequest from '@rigelsystems/novaui/src/stories/NSelectInputFromRequest/NSelectInputFromRequest.vue'

export interface Workout {
  id?: number
  name: string
  description?: string
  status: string
  workout_type: string
}

export default defineComponent({
  name: 'WorkoutForm',
  props: {
    workout: {
      type: Object as () => Workout,
      required: false,
      default: () => ({
        name: '',
        workout_type: '',
      }),
    }
  },
  emits: ['save'],
  components: {
    RecordForm,
    NSelectInputFromRequest
  },
  setup(props, { emit }) {
    const { accessToken } = useAuthToken()
    const isEditMode = computed(() => !!props.workout.id)

    const endpoint = computed(
      () =>
        isEditMode.value
          ? `${import.meta.env.VITE_API_URL}/workouts/${props.workout.id}` // Edit endpoint
          : `${import.meta.env.VITE_API_URL}/workouts`, // Add endpoint
    )
    const method = computed(() => (isEditMode.value ? 'PUT' : 'POST'))

    const handleSave = (savedRecord: Workout) => {
      emit('save', savedRecord)
    }

    return {
      isEditMode,
      endpoint,
      method,
      handleSave,
      accessToken,
    }
  }
})
</script>

<template>
  <RecordForm :record="workout" :endpoint="endpoint" :method="method" @save="handleSave">
    <template #trigger="{ openDialog }">
      <slot name="trigger" :openDialog="openDialog">
        <n-button>{{ isEditMode ? 'Edit Workout' : 'Add Workout' }}</n-button>
      </slot>
    </template>
    <template #title>
      <h2 class="n-modal__title">{{ isEditMode ? 'Edit Workout' : 'Add New Workout' }}</h2>
    </template>
    <template #form="{ record }">
      <v-form>
        <NTextInput v-model:value="record.name" label="Name"></NTextInput>
        <v-textarea v-model="record.description" label="Description"></v-textarea>
      </v-form>
    </template>
  </RecordForm>
</template> 