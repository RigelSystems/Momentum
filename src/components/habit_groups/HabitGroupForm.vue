<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import RecordForm from '../RecordForm.vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'
import SelectIcon from '../inputs/SelectIcon.vue'

export interface HabitGroup {
  id?: number // Optional for new records
  name: string,
  icon: string,
}

export default defineComponent({
  name: 'HabitGroupForm',
  props: {
    habitGroup: {
      type: Object as () => HabitGroup,
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
    const isEditMode = computed(() => !!props.habitGroup.id)

    // Compute the endpoint and HTTP method
    const endpoint = computed(
      () =>
        isEditMode.value
          ? `${import.meta.env.VITE_API_URL}/habit_groups/${props.habitGroup.id}` // Edit endpoint
          : `${import.meta.env.VITE_API_URL}/habit_groups`, // Add endpoint
    )
    const method = computed(() => (isEditMode.value ? 'PUT' : 'POST'))

    const updateRecordIcon = (icon: string) => {
      props.habitGroup.icon = icon
    }

    const handleSave = async (savedRecord: HabitGroup) => {
      window.location.reload()
    }

    return {
      isEditMode,
      endpoint,
      method,
      handleSave,
      value,
      updateRecordIcon
    }
  },
})
</script>

<template>
  <RecordForm :record="habitGroup" :endpoint="endpoint" :method="method" @save="handleSave" modelName="Habit Group">
    <template #trigger="{ openDialog }">
      <slot name="trigger" :openDialog="openDialog">
        <n-button color="primary">{{ isEditMode ? 'Edit Habit Group' : 'Add Habit Group' }}</n-button>
      </slot>
    </template>
    <template #form="{ record }">
      <v-form>
        <NTextInput v-model:value="record.name" label="Name" required></NTextInput>

        <SelectIcon v-model="record.icon" @update="updateRecordIcon"/>
      </v-form>
    </template>
  </RecordForm>
</template>
