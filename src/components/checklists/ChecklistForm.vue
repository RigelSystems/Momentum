<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import RecordForm from '../RecordForm.vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'

export interface Checklist {
  id?: number
  name: string
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
    RecordForm
  },
  setup(props) {
    const accessTokenStore = useAccessTokenStore()
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

    return {
      isEditMode,
      endpoint,
      method,
      handleSave,
      value,
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
        <v-text-field v-model="record.name" label="Name" required></v-text-field>
      </v-form>
    </template>
  </RecordForm>
</template>
