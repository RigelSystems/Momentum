<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import HabitGroupForm from '@/components/habit_groups/HabitGroupForm.vue'
import './HabitGroup.css'
import { getLastXDaysFormatted } from '@/utils/dateUtils'
import { useAuthToken } from '@/composables/useAuthToken'
import Habit from '@/components/habits/Habit.vue'
import HabitEntry from '@/components/HabitEntry.vue'
import HabitForm from '@/components/habits/HabitForm.vue'

export interface HabitGroup {
  id?: number,
  name: string,
  icon: string,
  habits_with_goals_count?: number,
  completed_today_count?: number,
}

export default defineComponent({
  name: 'HabitGroup',
  props: {
    habitGroup: {
      type: Object as () => HabitGroup,
      required: true,
    },
  },
  components: {
    HabitGroupForm,
    HabitForm,
    HabitEntry,
    Habit,
  },
  setup(props) {
    const { accessToken } = useAuthToken()

    const last30daysNiceFormat = getLastXDaysFormatted(30, 'ddd<br>D');
    const last30days = getLastXDaysFormatted(30, 'YYYY-MM-DD');

    const habits = ref<Array<any>>([])
    const loading = ref(true)
    const errorMessage = ref<string | null>(null)

    const habitGroup = ref<HabitGroup>({
      id: props.habitGroup.id,
      name: props.habitGroup.name,
      icon: props.habitGroup.icon,
      habits_with_goals_count: props.habitGroup.habits_with_goals_count,
      completed_today_count: props.habitGroup.completed_today_count,
    })

    const fetchHabitGroup = async (habitGroupId) => {
      console.log('fetchHabitGroup', habitGroupId)
      const apiUrl = `${import.meta.env.VITE_API_URL}habit_groups/${habitGroupId}`
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
      })
      console.log('response', response)

      if (response.ok) {
        const responseBody = await response.json()
        console.log('responseBody', responseBody)
        habitGroup.value = responseBody
      } else {
        const responseBody = await response.json()
        errorMessage.value = responseBody.error
      }
    }

    const fetchHabits = async (habitGroupId: any) => {
      console.log('fetchHabits', habitGroupId)
      loading.value = true
      const apiUrl = `${import.meta.env.VITE_API_URL}habit_groups/${props.habitGroup.id}/habits`
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      if (response.ok) {
        const responseBody = await response.json()
        habits.value = responseBody
      } else {
        const responseBody = await response.json()
        errorMessage.value = responseBody.error
      }
      loading.value = false
    }

    const updateComponent = async () => {
      console.log('updateComponent', props.habitGroup.id)
      fetchHabitGroup(props.habitGroup.id)
      fetchHabits(props.habitGroup.id)
    }

    // watch the accessToken for changes, then fetch habits
    watch(accessToken, (newValue) => {
      if (newValue && accessToken.value) {
        fetchHabits(props.habitGroup.id)
      }
    }, { immediate: true })

    const getHabitEntiryForDate = (habit: any, date: string) => {
      return habit.habit_entries.find((entry: any) => entry.date === date);
    }

    const habitBulkUpdateUrl = `${import.meta.env.VITE_API_URL}habits/bulk_update`

    return {
      habitGroup,
      updateComponent,
      accessToken,
      habits,
      last30daysNiceFormat,
      last30days,
      loading,
      errorMessage,
      fetchHabits,
      habitBulkUpdateUrl,
      getHabitEntiryForDate,
    };
  },
});
</script>


<template>
  <n-dropdown>
    <template #label>
      <div class="table-group-name habit-group">
        <div class="habit-group__name-wrapper">
          <NCircleProgress
            :current="habitGroup.completed_today_count"
            :total="habitGroup.habits_with_goals_count"
            v-if="habitGroup.habits_with_goals_count > 0"
            :fontSize="35"
            :size="30"
            :strokeWidth="11"
            progressColor="#88bdb9"
          />
          <h3>{{ habitGroup.name }}</h3>
          <v-icon class="mr-2" size="x-small">mdi-{{ habitGroup.icon }}</v-icon>
        </div>

        <HabitGroupForm :habitGroup="habitGroup">
          <template #trigger="{ openDialog }">
            <span class="mdi mdi-pencil clickable" @click="openDialog"></span>
          </template>
        </HabitGroupForm>
      </div>
    </template>

    <template #content>
      <p class="p-1" v-if="habits.length === 0">Add your first habit to this group.</p>
      <div v-else class="completion-percentages-container">
        <div class="table-habit-name"></div>
        <small class="table-cell" v-for="date in last30daysNiceFormat" :key="date">
          <span class="table-date" v-html="date"></span>
        </small>
      </div>

      <n-order-list class="table-habit-tr" :items="habits" :updateUrl="habitBulkUpdateUrl" :loading="loading"
        :accessToken="accessToken" modelName="habits">
        <template #default="habit">
          <div class="table-habit-name">
            <Habit :habit="habit" />
          </div>
          <div class="table-cell" v-for="date in last30days" :key="date">
            <HabitEntry v-if="accessToken" :accessToken="accessToken" :entry="getHabitEntiryForDate(habit, date)" :habit="habit" :date="date"
              :colour="habit.colour" @updated="updateComponent" :loading="loading" />
          </div>
        </template>
      </n-order-list>
    </template>
  </n-dropdown>
</template>
