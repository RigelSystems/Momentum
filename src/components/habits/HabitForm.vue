<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import RecordForm from '../RecordForm.vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'
import SelectFromRequest from '../inputs/SelectFromRequest.vue'
import SelectIcon from '../inputs/SelectIcon.vue'

export interface Habit {
  id?: number // Optional for new records
  name: string,
  colour: string,
  icon: string,
  habit_group_id: number,
}

export default defineComponent({
  name: 'HabitForm',
  props: {
    habit: {
      type: Object as () => Habit,
      required: false, // Optional for adding new records
      default: () => ({
        name: '',
      }), // Default values for new records
    },
  },
  components: {
    RecordForm,
    SelectFromRequest,
    SelectIcon
  },
  setup(props) {
    const accessTokenStore = useAccessTokenStore()
    const value = ref<string[]>([])

    // Determine if we're editing or adding a new record
    const isEditMode = computed(() => !!props.habit.id)

    // Compute the endpoint and HTTP method
    const endpoint = computed(
      () =>
        isEditMode.value
          ? `${import.meta.env.VITE_API_URL}/habits/${props.habit.id}` // Edit endpoint
          : `${import.meta.env.VITE_API_URL}/habits`, // Add endpoint
    )
    const method = computed(() => (isEditMode.value ? 'PUT' : 'POST'))

    // Handle save event
    const handleSave = async (savedRecord: Habit) => {
      console.log(`${isEditMode.value ? 'Updated' : 'Created'} record:`, savedRecord)

      // Reload the page to reflect the changes
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
  <RecordForm :record="habit" :endpoint="endpoint" :method="method" @save="handleSave">
    <template #trigger="{ openDialog }">
      <slot name="trigger" :openDialog="openDialog">
        <v-btn color="primary">{{ isEditMode ? 'Edit Habit' : 'Add Habit' }}</v-btn>
      </slot>
    </template>
    <template #title>
      <span>{{ isEditMode ? 'Edit Habit' : 'Add New Habit' }}</span>
    </template>
    <template #form="{ record }">
      <v-form>
        <v-text-field v-model="record.name" label="Name" required></v-text-field>

        <SelectFromRequest
          path="habit_groups"
          key="name"
          name="habit_group_id"
          v-model="record.habit_group_id"
          label="Habit Group"
        />

        <SelectFromRequest
          path="habits/types"
          key="name"
          name="name"
          v-model="record.habit_type"
          label="Habit Type"
        />

        <v-menu :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="tonal">
              Habit colour
              <div
                :style="{
                  width: '24px',
                  height: '24px',
                  backgroundColor: record.colour || '#fff',
                  borderRadius: '5px',
                  display: 'inline-block',
                  marginLeft: '10px',
                }"
              ></div>
            </v-btn>
          </template>

          <v-card min-width="300">
            <v-color-picker v-model="record.colour" :modes="['hex']"></v-color-picker>
          </v-card>
        </v-menu>

        <SelectIcon v-model="record.icon" label="Icon" />
      </v-form>
    </template>
  </RecordForm>
</template>
