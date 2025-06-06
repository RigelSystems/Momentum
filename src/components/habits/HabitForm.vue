<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import RecordForm from '../RecordForm.vue'
import SelectIcon from '../inputs/SelectIcon.vue'
import { useAuthToken } from '@/composables/useAuthToken'
import { useFeatureFlag } from '@/composables/useFeatureFlag'

export interface Habit {
  id?: number,
  name: string,
  colour: string,
  icon: string,
  habit_group_id: number,
  start_time: string,
  duration?: number,
  goal_condition?: string,
  goal_value?: number,
  habit_type?: string,
  wants_reminder?: boolean,
  check_in_time?: string,
  wants_check_in?: boolean,
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
        goal_condition: 'No Goal'
      }),
    }
  },
  emits: ['save'],
  components: {
    RecordForm,
    SelectIcon,
  },
  setup(props, { emit }) {
    const { isFeatureEnabled } = useFeatureFlag()
    const { accessToken } = useAuthToken()
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
      console.log('habit form handle save', savedRecord)
      // reload the page for now
      window.location.reload()
      emit('save', savedRecord)
    }

    const friendsUrl = `${import.meta.env.VITE_API_URL}/friends/friends`
    const habitGroupsUrl = `${import.meta.env.VITE_API_URL}/habit_groups`
    const habitTypesUrl = `${import.meta.env.VITE_API_URL}/habits/types`
    const goalConditionsUrl = `${import.meta.env.VITE_API_URL}/habits/goal_conditions`

    return {
      isEditMode,
      accessToken,
      friendsUrl,
      habitGroupsUrl,
      habitTypesUrl,
      goalConditionsUrl,
      endpoint,
      method,
      handleSave,
      value,
      updateRecordIcon,
      allowedMinutes,
      isFeatureEnabled
    }
  },
})
</script>

<template>
  <RecordForm :record="habit" :endpoint="endpoint" :method="method" @save="handleSave">
    <template #trigger="{ openDialog }">
      <slot name="trigger" :openDialog="openDialog">
        <NButton :label="isEditMode ? 'Edit Habit' : 'Add Habit'" />
      </slot>
    </template>
    <template #title>
      <h2 class="n-modal__title">{{ isEditMode ? 'Edit Habit' : 'Add New Habit' }}</h2>
    </template>
    <template #form="{ record }">
      <v-form>
        <h1>Details</h1>

        <NTextInput v-model:value="record.name" label="Name"></NTextInput>

        <NSelectInputFromRequest
          :url="habitGroupsUrl"
          valueKey="id"
          name="habit_group_id"
          label="Habit Group"
          :accessToken="accessToken"
          v-model="record.habit_group_id"
        />

        <NSelectInputFromRequest
          :url="habitTypesUrl"
          valueKey="name"
          name="habit_type"
          label="Habit Type"
          :accessToken="accessToken"
          v-model="record.habit_type"
        />

        <SelectIcon v-model="record.icon" @update="updateRecordIcon"/>

        <NColourPicker v-model="record.colour"></NColourPicker>

        <h1>Goal</h1>

        <NSelectInputFromRequest
          :url="goalConditionsUrl"
          valueKey="name"
          name="goal_condition"
          label="Goal Condition"
          :accessToken="accessToken"
          v-model="record.goal_condition"
        />

        <NTextInput
          v-if="!(record.goal_condition === 'No Goal' || record.goal_condition === 'Anything' || !record.goal_condition)"
          v-model:value="record.goal_value"
          label="Goal Value"
          ></NTextInput>


        <template v-if="isFeatureEnabled()">

          <h1>Reminder</h1>

          <p>Would you like a reminder set for this habit? <input type="checkbox" v-model="record.wants_reminder"></p>

          <NTimeInput
            v-if="record.wants_reminder || record.start_time"
            label="Select Time"
            v-model:value="record.start_time"
          />

          <v-number-input
            v-if="record.wants_reminder"
            :reverse="false"
            controlVariant="default"
            label="Duration"
            :hideInput="false"
            :inset="false"
            key="duration"
            name="duration"
            v-model="record.duration"
          ></v-number-input>

          <h1>Check-in</h1>

          <p>Would you like a check-in set for this habit? <input type="checkbox" v-model="record.wants_check_in"></p>

          <NTimeInput
            v-if="record.wants_check_in || record.check_in_time"
            label="Select Time"
            v-model:value="record.check_in_time"
          />

          <h1>Access</h1>

          <NSelectInputFromRequest
            :url="friendsUrl"
            valueKey="id"
            name="role"
            label="Select Users"
            :accessToken="accessToken"
            v-model="record.users_id"
          />
        </template>
      </v-form>
    </template>
  </RecordForm>
</template>
