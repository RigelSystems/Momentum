<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'
import Habit from '@/components/Habit.vue'
import HabitForm from '@/components/habits/HabitForm.vue'
import HabitEntry from '@/components/HabitEntry.vue'

export default defineComponent({
  name: 'HabitsView',
  components: {
    Habit,
    HabitForm,
    HabitEntry,
  },
  setup() {
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
      habits,
      loading,
      errorMessage,
      lastSevenDays,
      getHabitEntiryForDate
    }
  },
})
</script>

<template>
  <div class="page-wrapper">
    <h1>This is the habits page</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else-if="habits.length === 0">No habits found</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th v-for="date in lastSevenDays">{{ date }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="habit in habits" :key="habit.id">
            <td>
              <Habit :habit="habit" />
            </td>
            <td v-for="date in lastSevenDays">
              <HabitEntry
                :entry="getHabitEntiryForDate(habit, date)"
                :habit="habit"
                :date="date"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

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
</template>
