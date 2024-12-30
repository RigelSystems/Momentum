<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'
import { useAuth0 } from '@auth0/auth0-vue'
import User from '@/components/User.vue'
import Habit from '@/components/Habit.vue'
import HabitForm from '@/components/habits/HabitForm.vue'
import HabitEntry from '@/components/HabitEntry.vue'
import PageHeader from '@/components/shared/PageHeader.vue'

export default defineComponent({
  name: 'HabitsView',
  components: {
    Habit,
    HabitForm,
    HabitEntry,
    User,
    PageHeader,
  },
  setup() {
    const { user } = useAuth0()
    const habits = ref<Array<any>>([])
    const loading = ref(true)
    const errorMessage = ref<string | null>(null)

    function getLast7Days() {
      const dates = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        dates.push(formattedDate);
      }

      return dates;
    }
    const lastSevenDays = getLast7Days();

    function getLast7DaysNiceFormat() {
      const dates = [];
      const today = new Date();
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dayName = daysOfWeek[date.getDay()];
        const dayOfMonth = date.getDate();
        dates.push(`${dayName} ${dayOfMonth}`);
      }

      return dates;
    }

    const lastSevenDaysNice = getLast7DaysNiceFormat();




    const fetchHabits = async () => {
      const accessTokenStore = useAccessTokenStore()
      const apiUrl = `${import.meta.env.VITE_API_URL}habits`
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessTokenStore.accessToken}`,
        },
      })

      if (response.ok) {
        loading.value = false
        const responseBody = await response.json()
        habits.value = responseBody
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
        }
      }
    }

    const getHabitEntiryForDate = (habit: any, date: string) => {
      return habit.habit_entries.find((entry: any) => entry.date === date);
    }

    onMounted(() => {
      fetchHabits()
    })

    return {
      user,
      habits,
      loading,
      errorMessage,
      lastSevenDays,
      getHabitEntiryForDate,
      lastSevenDaysNice
    }
  },
})
</script>

<template>
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
      model-value="10"
      striped
    >
    <template v-slot:default="{ value }">
        <strong>{{ Math.ceil(value) }}%</strong>
      </template></v-progress-linear>
    </div>
  </div>

  <div class="text-center horizontal-scroll">
    <v-chip
      class="ma-2 shadow"
      color="blue"
      label
    >
      <v-icon icon="mdi-twitter" start></v-icon>
      New Tweets
    </v-chip>
    <v-chip
      class="ma-2"
      color="dark"
      disabled
      label
    >
      <v-icon icon="mdi-twitter" start></v-icon>
      New Tweets
    </v-chip>
    <v-chip
      class="ma-2"
      color="dark"
      disabled
      label
    >
      <v-icon icon="mdi-twitter" start></v-icon>
      New Tweets
    </v-chip>
    <v-chip
      class="ma-2"
      color="dark"
      disabled
      label
    >
      <v-icon icon="mdi-twitter" start></v-icon>
      New Tweets
    </v-chip>
  </div>

  <div class="page-wrapper shadow">
    <div v-if="loading">Loading...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else-if="habits.length === 0">No habits found</div>
    <div v-else>
      <div class="habit-table">
        <div class="horizontal-scroll">
          <div class="table-habit-tr table-habit-dates">
            <div class="table-cell" v-for="date in lastSevenDaysNice">
              <span class="table-date">{{ date }}</span>
            </div>
          </div>
          <div class="table-habit-tr" v-for="habit in habits" :key="habit.id">
            <div class="table-habit-name">
              <Habit :habit="habit" />
            </div>
            <div class="table-cell" v-for="date in lastSevenDays">
              <HabitEntry
                :entry="getHabitEntiryForDate(habit, date)"
                :habit="habit"
                :date="date"
              />
            </div>
          </div>
        </div>
      </div>
    </div>



    <div class="mt-5">
      <HabitForm>
        <template #trigger="{ openDialog }">
          <v-btn
            density="comfortable"
            variant="tonal"
            text="New Habit"
            @click="openDialog"
          ></v-btn>
        </template>
      </HabitForm>
    </div>
  </div>
</template>
