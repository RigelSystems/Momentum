<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'
import { useAuth0 } from '@auth0/auth0-vue'
import User from '@/components/User.vue'
import Habit from '@/components/Habit.vue'
import HabitForm from '@/components/habits/HabitForm.vue'
import HabitEntry from '@/components/HabitEntry.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import HabitGroup from '@/components/habit_groups/HabitGroup.vue'
import HabitGroupForm from '@/components/habit_groups/HabitGroupForm.vue'

interface CompletionPercentages {
  [key: string]: {
    [key: string]: number
  }
}

export default defineComponent({
  name: 'HabitsView',
  components: {
    Habit,
    HabitForm,
    HabitEntry,
    HabitGroup,
    User,
    PageHeader,
    HabitGroupForm
  },
  setup() {
    const { user } = useAuth0()
    const groupedHabits = ref<Array<any>>([])
    const habitGroups = ref<Array<any>>([])
    const loading = ref(true)
    const errorMessage = ref<string | null>(null)
    const todaysCompletionPercentage = ref(0)
    const completionPercentages = ref<CompletionPercentages>({})
    const selectedTimeFrame = ref(null)
    const availableTimeFrames = ["Today", "This Week", "This Month", "This Year"]

    function getLastXDays(days = 7) {
      const dates = [];
      const today = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        dates.push(formattedDate);
      }

      return dates;
    }
    const lastSevenDays = getLastXDays(30);

    function getLastXDaysNiceFormat(days = 7) {
      const dates = [];
      const today = new Date();
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dayName = daysOfWeek[date.getDay()];
        const dayOfMonth = date.getDate();
        dates.push(`${dayName}<br>${dayOfMonth}`);
      }

      return dates;
    }
    const lastSevenDaysNice = getLastXDaysNiceFormat(30);

    const fetchHabits = async () => {
      const accessTokenStore = useAccessTokenStore()
      const apiUrl = `${import.meta.env.VITE_API_URL}habits/get_habits`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessTokenStore.accessToken}`,
        },
        body: JSON.stringify({
          time_frame: selectedTimeFrame.value
        }),
      })

      if (response.ok) {
        loading.value = false
        const responseBody = await response.json()
        todaysCompletionPercentage.value = responseBody.todays_completion_percentage
        completionPercentages.value = responseBody.completion_percentages
        groupedHabits.value = responseBody.habits

      } else {
        loading.value = false
        const responseBody = await response.json()
        errorMessage.value = responseBody.error

        // Not ideal but it works for now
        if (errorMessage.value === 'Access token has expired or is invalid.') {
          accessTokenStore.$reset()
          accessTokenStore.clearState()
          localStorage.clear()
          sessionStorage.clear()
          window.location.reload()
        }
      }
    }

    const fetchHabitGroups = async () => {
      const accessTokenStore = useAccessTokenStore()
      const apiUrl = `${import.meta.env.VITE_API_URL}habit_groups`
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessTokenStore.accessToken}`,
        },
      })

      if (response.ok) {
        loading.value = false
        const responseBody = await response.json()
        habitGroups.value = responseBody
      } else {
        loading.value = false
        const responseBody = await response.json()
        errorMessage.value = responseBody.error
      }
    }

    const getHabitEntiryForDate = (habit: any, date: string) => {
      return habit.habit_entries.find((entry: any) => entry.date === date);
    }

    onMounted(() => {
      fetchHabits()
      fetchHabitGroups()
    })

    return {
      user,
      groupedHabits,
      habitGroups,
      loading,
      errorMessage,
      lastSevenDays,
      completionPercentages,
      getHabitEntiryForDate,
      lastSevenDaysNice,
      todaysCompletionPercentage,
      fetchHabits,
      selectedTimeFrame,
      availableTimeFrames,
    }
  },
})
</script>

<template>
  {{ completionPercentages }}

  <div class="page-header">
    <PageHeader title="My Habits" />

    <div class="page-header-card shadow">
      <h3 class="d-flex justify-space-between">
        <b>Today</b>
        <b>20th Monday</b>
      </h3>
      <p class="mb-3">72% avg / day</p>
      <v-progress-linear
      color="light-blue"
      height="25"
      :model-value="todaysCompletionPercentage"
      striped
    >
    <template v-slot:default="{ value }">
        <strong>{{ Math.ceil(value) }}%</strong>
      </template></v-progress-linear>
    </div>
  </div>

  <div class="text-center horizontal-scroll">
    <v-chip
      v-for="habitGroup in habitGroups"
      :key="habitGroup.id"
      class="ma-2 shadow"
      color="blue"
      label
    >
      <v-icon icon="mdi-twitter" start></v-icon>
      {{ habitGroup.name }}
    </v-chip>
  </div>

  <div class="page-wrapper shadow">
    <v-autocomplete
      v-model="selectedTimeFrame"
      :items="availableTimeFrames"
      label="Select Time Frame"
      outlined
      dense
    ></v-autocomplete>

    <div v-if="loading">Loading...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else-if="groupedHabits.length === 0">No habits found</div>
    <div v-else>
      <div class="habit-table">
        <div class="horizontal-scroll">
          <div class="table-habit-tr table-habit-dates">
            <div class="table-cell" v-for="date in lastSevenDaysNice">
              <span class="table-date" v-html="date"></span>
            </div>
          </div>

          <div v-for="(habits, groupName) in groupedHabits" :key="groupName" class="table-habit-group">
            <HabitGroup :habitGroup="habits[0].habit_group" />
            <div class="completion-percentages-container">
              <small class="table-cell" v-for="date in lastSevenDays" :key="date">
                %{{ completionPercentages[habits[0].habit_group.name][date] }}
              </small>
            </div>

            <div
              class="table-habit-tr"
              v-for="habit in habits"
              :key="habit.id"
            >
              <div class="table-habit-name">
                <Habit :habit="habit" />
              </div>
              <div class="table-cell" v-for="date in lastSevenDays" :key="date">
                <HabitEntry
                  :entry="getHabitEntiryForDate(habit, date)"
                  :habit="habit"
                  :date="date"
                  :colour="habit.colour"
                  :fetchHabits="fetchHabits"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5 d-flex justify-space-start">
      <HabitForm>
        <template #trigger="{ openDialog }">
          <v-btn
            density="comfortable"
            variant="tonal"
            text="New Habit"
            class="mr-2"
            @click="openDialog"
          ></v-btn>
        </template>
      </HabitForm>

      <HabitGroupForm>
        <template #trigger="{ openDialog }">
          <v-btn
            density="comfortable"
            variant="tonal"
            text="New Habit Group"
            @click="openDialog"
          ></v-btn>
        </template>
      </HabitGroupForm>
    </div>
  </div>
</template>
