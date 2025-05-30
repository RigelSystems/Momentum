<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import RecordForm from '../RecordForm.vue'
import { useAuthToken } from '@/composables/useAuthToken'

export interface Task {
  id?: number
  name: string
  description?: string
  status: string
}

export default defineComponent({
  name: 'TaskForm',
  props: {
    task: {
      type: Object as () => Task,
      required: false,
      default: () => ({
        name: '',
      }),
    }
  },
  emits: ['saved'],
  components: {
    RecordForm
  },
  setup(props, { emit }) {
    const { accessToken } = useAuthToken()
    const isEditMode = computed(() => !!props.task.id)

    const endpoint = computed(
      () =>
        isEditMode.value
          ? `${import.meta.env.VITE_API_URL}/tasks/${props.task.id}` // Edit endpoint
          : `${import.meta.env.VITE_API_URL}/tasks`, // Add endpoint
    )
    const method = computed(() => (isEditMode.value ? 'PUT' : 'POST'))

    const handleSave = (savedRecord: Task) => {
      emit('saved', savedRecord)
    }

    return {
      isEditMode,
      endpoint,
      method,
      handleSave,
      accessToken
    }
  }
})
</script>

<template>
  <RecordForm :record="task" :endpoint="endpoint" :method="method" @save="handleSave">
    <template #trigger="{ openDialog }">
      <slot name="trigger" :openDialog="openDialog">
        <n-button>{{ isEditMode ? 'Edit Task' : 'Add Task' }}</n-button>
      </slot>
    </template>
    <template #title>
      <h2 class="n-modal__title">{{ isEditMode ? 'Edit Task' : 'Add New Task' }}</h2>
    </template>
    <template #form="{ record }">
      <v-form>
        <NTextInput v-model:value="record.name" label="Name"></NTextInput>
        <v-textarea v-model="record.description" label="Description"></v-textarea>
      </v-form>
    </template>
  </RecordForm>
</template> 