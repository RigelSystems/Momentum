<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import RecordForm from '../RecordForm.vue'
import { useAuthToken } from '@/composables/useAuthToken'
import SelectIcon from '../inputs/SelectIcon.vue'
import { useRoute } from 'vue-router'
import SelectFromRequest from '../inputs/SelectFromRequest.vue'
import NTextInput from '@rigelsystems/novaui/src/stories/NTextInput/NTextInput.vue'

export interface ChecklistItem {
  id?: number // Optional for new records
  name: string,
  icon: string,
  checklist_id: number
  checklist_item_type?: string[]
  status?: string[]
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
    const { accessToken } = useAuthToken()
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
          ? `${import.meta.env.VITE_API_URL}checklist_items/${props.checklistItem.id}` // Edit endpoint
          : `${import.meta.env.VITE_API_URL}checklist_items`, // Add endpoint
    )
    const method = computed(() => (isEditMode.value ? 'PUT' : 'POST'))

    const handleSave = async (savedRecord: ChecklistItem) => {
      window.location.reload()
    }

    const statusUrl = `${import.meta.env.VITE_API_URL}/checklist_items/statuses`
    const typesUrl = `${import.meta.env.VITE_API_URL}/checklist_items/checklist_item_types`

    return {
      accessToken,
      isEditMode,
      endpoint,
      method,
      handleSave,
      value,
      checklistId,
      statusOptions,
      statusUrl,
      typesUrl
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

        <NTextInput
          v-model:value="record.name"
          name="name"
          label="Name"
        ></NTextInput>

        <NSelectInputFromRequest
          :url="typesUrl"
          valueKey="name"
          name="checklist_item_types"
          :accessToken="accessToken"
          v-model="record.checklist_item_type"
          label="checklist_item_types"
        />

       <!-- TODO: use component :is="ChecklistItemInputs record.checklist_item_type_classify" instead. -->

        <NSelectInputFromRequest
          v-if="record.checklist_item_type === 'task'"
          :url="statusUrl"
          valueKey="name"
          name="statuses"
          :accessToken="accessToken"
          v-model="record.status"
          label="statuses"
        />

        <NTextInput
          v-if="record.checklist_item_type === 'weighted_exercise'"
          v-model:value="record.sets"
          name="sets"
          label="Sets"
        ></NTextInput>

        <NTextInput
          v-if="record.checklist_item_type === 'weighted_exercise'"
          v-model:value="record.reps"
          name="reps"
          label="Reps"
        ></NTextInput>

        <NTextInput
          v-if="record.checklist_item_type === 'weighted_exercise'"
          v-model:value="record.weight"
          name="weight"
          label="Weight"
        ></NTextInput>

        <NTextInput
          v-if="record.checklist_item_type === 'weighted_exercise'"
          v-model:value="record.unit"
          name="unit"
          label="Unit"
        ></NTextInput>

        <NTextInput
          v-if="record.checklist_item_type === 'weighted_exercise'"
          v-model:value="record.rest"
          name="rest"
          label="Rest (seconds)"
        ></NTextInput>
      </v-form>
    </template>
  </RecordForm>
</template>
