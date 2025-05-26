<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import RecordForm from '../RecordForm.vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'
import SelectIcon from '../inputs/SelectIcon.vue'

export interface Icon {
  id?: number // Optional for new records
  pixel_data: any,
}

export default defineComponent({
  name: 'IconForm',
  props: {
    icon: {
      type: Object as () => Icon,
      required: false, // Optional for adding new records
      default: () => ({
        name: '',
      }), // Default values for new records
    },
  },
  components: {
    RecordForm,
    SelectIcon,
  },
  setup(props) {
    const accessTokenStore = useAccessTokenStore()
    const value = ref<string[]>([])

    // Determine if we're editing or adding a new record
    const isEditMode = computed(() => !!props.icon.id)

    // Compute the endpoint and HTTP method
    const endpoint = computed(
      () =>
        isEditMode.value
          ? `${import.meta.env.VITE_API_URL}/icons/${props.icon.id}` // Edit endpoint
          : `${import.meta.env.VITE_API_URL}/icons`, // Add endpoint
    )
    const method = computed(() => (isEditMode.value ? 'PUT' : 'POST'))

    const handleSave = async (savedRecord: Icon) => {
      window.location.reload()
    }

    return {
      isEditMode,
      endpoint,
      method,
      handleSave,
      value
    }
  },
})
</script>

<template>
  <RecordForm :record="icon" :endpoint="endpoint" :method="method" @save="handleSave">
    <template #trigger="{ openDialog }">
      <slot name="trigger" :openDialog="openDialog">
        <n-button color="primary">{{ isEditMode ? 'Edit Habit Group' : 'Add Habit Group' }}</n-button>
      </slot>
    </template>
    <template #title>
      <span>{{ isEditMode ? 'Edit Habit Group' : 'Add New Habit Group' }}</span>
    </template>
    <template #form="{ record }">
      <v-form>
        <NPaint v-model:pixelData="record.pixel_data"></NPaint>
      </v-form>
    </template>
  </RecordForm>
</template>
