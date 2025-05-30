<script lang="ts">
import { defineComponent, ref } from 'vue'
import RecordForm from '../RecordForm.vue'
import { useAuthToken } from '@/composables/useAuthToken'
import type { WorkoutItem } from './WorkoutItem.vue'

export default defineComponent({
  name: 'WorkoutItemForm',
  props: {
    checklistId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    RecordForm
  },
  setup(props) {
    const { accessToken } = useAuthToken()
    const workoutItem = ref<Partial<WorkoutItem>>({
      name: '',
      checklist_id: Number(props.checklistId),
      target_sets: 0,
      target_reps: 0,
      target_duration: 0,
      target_weight: 0
    })

    const endpoint = `${import.meta.env.VITE_API_URL}checklist_items`
    const method = 'POST'

    const handleSave = async (savedRecord: WorkoutItem) => {
      window.location.reload()
    }

    return {
      workoutItem,
      endpoint,
      method,
      handleSave,
      accessToken
    }
  }
})
</script>

<template>
  <RecordForm :record="workoutItem" :endpoint="endpoint" :method="method" @save="handleSave">
    <template #trigger="{ openDialog }">
      <slot name="trigger" :openDialog="openDialog">
        <n-button @click="openDialog">Add Workout Item</n-button>
      </slot>
    </template>
    <template #title>
      <span>Add New Workout Item</span>
    </template>
    <template #form="{ record }">
      <v-form>
        <NTextInput v-model:value="record.name" label="Exercise Name"></NTextInput>

        <NTextInput 
          v-model:value="record.target_sets" 
          label="Target Sets" 
          type="number"
        ></NTextInput>

        <NTextInput 
          v-model:value="record.target_reps" 
          label="Target Reps" 
          type="number"
        ></NTextInput>

        <NTextInput 
          v-model:value="record.target_duration" 
          label="Target Duration (seconds)" 
          type="number"
        ></NTextInput>

        <NTextInput 
          v-model:value="record.target_weight" 
          label="Target Weight (lbs)" 
          type="number"
        ></NTextInput>
      </v-form>
    </template>
  </RecordForm>
</template> 