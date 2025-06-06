<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import RecordForm from '../RecordForm.vue'
import { useAuthToken } from '@/composables/useAuthToken'

export interface ChecklistItemCell {
  id?: number
  name: string
  cell_type: string
  content?: string
  label?: string
  max_rating?: number
  image_url?: string
  value?: boolean
}

export default defineComponent({
  name: 'ChecklistItemCellForm',
  props: {
    checklistItemCell: {
      type: Object as () => ChecklistItemCell,
      required: false,
      default: () => ({
        name: '',
        description: '',
        status: '',
        ai_prompt: '',
      }),
    },
    checklistItemId: {
      type: Number,
      required: true,
    },
  },
  components: {
    RecordForm, 
  },
  setup(props, { emit }) {
    const { accessToken } = useAuthToken()
    const record = ref<ChecklistItemCell>(props.checklistItemCell)

    // Determine if we're editing or adding a new record
    const isEditMode = computed(() => !!props.checklistItemCell.id)

    const handleSave = async () => { 
      const save_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cell_${record.value.cell_type}s`
      const data = {
        checklist_item_cell: record.value,
      }
      const response = await fetch(save_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.value}`,
        },
        body: JSON.stringify(data),
      })
      const responseData = await response.json()

      emit('save', responseData)
    }

    const cellTypesUrl = `${import.meta.env.VITE_API_URL}/checklist_items/item_cell_types`

    return {
      isEditMode,
      handleSave,
      accessToken,
      cellTypesUrl,
      record,
    }
  },
})
</script>

<template>
    <NSelectInputFromRequest
      :url="cellTypesUrl"
      valueKey="name"
      name="cell_type"
      label="Cell Type"
      :accessToken="accessToken"
      v-model="record.cell_type"
    />

    <!-- Title Inputs -->
    <template v-if="record.cell_type === 'title'">
      <NTextInput
        v-model:value="record.content"
        label="Content"
        placeholder="Enter title content"
        required
      />
    </template>

    <!-- Text Inputs -->
    <template v-if="record.cell_type === 'text'">
      <NTextInput
        v-model:value="record.label"
        label="Label"
        placeholder="Enter label"
      />
      <NTextInput
        v-model:value="record.content"
        label="Content"
        placeholder="Enter text content"
        required
      />
    </template>

    <!-- Rating Inputs -->
    <template v-if="record.cell_type === 'rating'">
      <NTextInput
        v-model:value="record.label"
        label="Label"
        placeholder="Enter label"
      />
      <NNumberInput
        v-model:value="record.max_rating"
        label="Max Rating"
        :min="1"
        :max="10"
        required
      />
    </template>

    <!-- Image Inputs -->
    <template v-if="record.cell_type === 'image'">
      <NTextInput
        v-model:value="record.label"
        label="Label"
        placeholder="Enter label"
      />
      <NTextInput
        v-model:value="record.image_url"
        label="Image URL"
        placeholder="Enter image URL"
        required
      />
    </template>

    <!-- Toggle Inputs -->
    <template v-if="record.cell_type === 'toggle'">
      <NTextInput
        v-model:value="record.label"
        label="Label"
        placeholder="Enter label"
      />
      <NToggleInput
        v-model:value="record.value"
        label="Default Value"
      />
    </template>

    <NButton @click="handleSave">Save</NButton>
</template>
