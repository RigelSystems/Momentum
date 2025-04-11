<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import RecordForm from '../RecordForm.vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'
import SelectFromRequest from '../inputs/SelectFromRequest.vue'
import SelectIcon from '../inputs/SelectIcon.vue'

export interface Habit {
  id?: number,
  name: string,
  colour: string,
  icon: string,
  habit_group_id: number,
  start_time: string,
}

export default defineComponent({
  name: 'HabitForm',
  props: {
    habit: {
      type: Object as () => Habit,
      required: false,
      default: () => ({
        name: '',
        colour: '#fff',
        icon: '',
      }),
    },
    fetchHabits: {
      type: Function,
      required: true,
    }
  },
  components: {
    RecordForm,
    SelectFromRequest,
    SelectIcon
  },
  setup(props) {
    const accessTokenStore = useAccessTokenStore()
    const value = ref<string[]>([])
      const allowedMinutes = v => v % 5 === 0

    const isEditMode = computed(() => !!props.habit.id)

    const endpoint = computed(
      () =>
        isEditMode.value
          ? `${import.meta.env.VITE_API_URL}/habits/${props.habit.id}` // Edit endpoint
          : `${import.meta.env.VITE_API_URL}/habits`, // Add endpoint
    )
    const method = computed(() => (isEditMode.value ? 'PUT' : 'POST'))

    const updateRecordIcon = (icon: string) => {
      props.habit.icon = icon
    }

    const handleSave = (savedRecord: Habit) => {
      console.log('fetchHabits', props.fetchHabits)
      console.log('handleSave', savedRecord)
      props.fetchHabits()
    }

    return {
      isEditMode,
      endpoint,
      method,
      handleSave,
      value,
      updateRecordIcon,
      allowedMinutes
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
          path="friends/friends"
          key="email"
          name="email"
          v-model="record.users_id"
          :multiple="true"
          label="Users"
        />

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

        <v-time-picker
          key="start_time"
          v-model="record.start_time"
          format="24hr"
          :allowed-minutes="allowedMinutes"
        >

        </v-time-picker>

        <v-number-input
          :reverse="false"
          controlVariant="default"
          label="Duration"
          :hideInput="false"
          :inset="false"
          key="duration"
          name="duration"
          v-model="record.duration"
        ></v-number-input>

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

        <SelectIcon v-model="record.icon" @update="updateRecordIcon"/>

        <v-text-field v-model="record.goal_value" label="Goal Value" required></v-text-field>
      </v-form>
    </template>
  </RecordForm>
</template>
