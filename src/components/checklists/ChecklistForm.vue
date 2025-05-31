<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import RecordForm from '../RecordForm.vue'
import SelectFromRequest from '../inputs/SelectFromRequest.vue'
import { useAuthToken } from '@/composables/useAuthToken'

export interface Checklist {
  id?: number
  name: string
  description?: string
  status?: string
  ai_prompt?: string
}

export default defineComponent({
  name: 'ChecklistForm',
  props: {
    checklist: {
      type: Object as () => Checklist,
      required: false,
      default: () => ({
        name: '',
      }),
    },
  },
  components: {
    RecordForm,
    SelectFromRequest
  },
  setup(props) {
    const { accessToken } = useAuthToken()
    const value = ref<string[]>([])

    // Determine if we're editing or adding a new record
    const isEditMode = computed(() => !!props.checklist.id)

    // Compute the endpoint and HTTP method
    const endpoint = computed(
      () =>
        isEditMode.value
          ? `${import.meta.env.VITE_API_URL}/checklists/${props.checklist.id}` // Edit endpoint
          : `${import.meta.env.VITE_API_URL}/checklists`, // Add endpoint
    )
    const method = computed(() => (isEditMode.value ? 'PUT' : 'POST'))

    const handleSave = async (savedRecord: Checklist) => {
      window.location.reload()
    }

    const checklistTypeUrl = `${import.meta.env.VITE_API_URL}/checklists/checklist_types`

    return {
      isEditMode,
      endpoint,
      method,
      handleSave,
      value,
      accessToken,
      checklistTypeUrl
    }
  },
})
</script>

<template>
  <RecordForm :record="checklist" :endpoint="endpoint" :method="method" @save="handleSave">
    <template #trigger="{ openDialog }">
      <slot name="trigger" :openDialog="openDialog">
        <v-btn color="primary">{{ isEditMode ? 'Edit Checklist' : 'Add Checklist' }}</v-btn>
      </slot>
    </template>
    <template #title>
      <span>{{ isEditMode ? 'Edit Checklist' : 'Add New Checklist' }}</span>
    </template>
    <template #form="{ record }">
      <v-form>
        <NTextInput v-model:value="record.name" label="Name"></NTextInput>

        <v-textarea v-model="record.description" label="Description"></v-textarea>

        <NTextInput v-model:value="record.ai_prompt" label="AI Prompt"></NTextInput>
      </v-form>
    </template>
  </RecordForm>
</template>
