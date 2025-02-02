<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import RecordForm from '../RecordForm.vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'
import SelectIcon from '../inputs/SelectIcon.vue'
import { useRoute } from 'vue-router'
import SelectFromRequest from '../inputs/SelectFromRequest.vue'

export interface ChecklistItem {
  id?: number // Optional for new records
  name: string,
  icon: string,
  checklist_id: number
}

export default defineComponent({
  name: 'ChecklistItemForm',
  props: {
    checklistItem: {
      type: Object as () => ChecklistItem,
      required: false, // Optional for adding new records
      default: () => ({
        name: '',
        icon: '',
      }), // Default values for new records
    },
  },
  components: {
    RecordForm,
    SelectIcon,
    SelectFromRequest,
  },
  setup(props) {
    const accessTokenStore = useAccessTokenStore()
    const value = ref<string[]>([])
    const route = useRoute()
    const statusOptions = ref<string[]>(['not started', 'blocked', 'done'])
    const checklistId = computed<number>(() => parseInt(route.params.id as string));
    props.checklistItem.checklist_id = checklistId.value

    // Determine if we're editing or adding a new record
    const isEditMode = computed(() => !!props.checklistItem.id)

    // Compute the endpoint and HTTP method
    const endpoint = computed(
      () =>
        isEditMode.value
          ? `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItem.id}` // Edit endpoint
          : `${import.meta.env.VITE_API_URL}/checklist_items`, // Add endpoint
    )
    const method = computed(() => (isEditMode.value ? 'PUT' : 'POST'))

    const handleSave = async (savedRecord: ChecklistItem) => {
      window.location.reload()
    }

    return {
      isEditMode,
      endpoint,
      method,
      handleSave,
      value,
      checklistId,
      statusOptions
    }
  },
})
</script>

<template>
  <RecordForm :record="checklistItem" :endpoint="endpoint" :method="method" @save="handleSave">
    <template #trigger="{ openDialog }">
      <slot name="trigger" :openDialog="openDialog">
        <v-btn color="primary">{{ isEditMode ? 'Edit Checklist Item' : 'Add Checklist Item' }}</v-btn>
      </slot>
    </template>
    <template #title>
      <span>{{ isEditMode ? 'Edit Checklist Item' : 'Add New Checklist Item' }}</span>
    </template>
    <template #form="{ record }">
      <v-form>
        <input type="hidden" name="chcklist_id" v-model="record.checklist_id" />

        <v-text-field variant="outlined" v-model="record.name" label="Name" required></v-text-field>

        <SelectFromRequest
          path="checklist_items/status"
          key="name"
          name="name"
          v-model="record.status"
          label="Habit Type"
        />
      </v-form>
    </template>
  </RecordForm>
</template>
