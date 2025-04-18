<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import dayjs from 'dayjs'
import User from '@/components/User.vue'
import Habit from '@/components/habits/Habit.vue'
import HabitForm from '@/components/habits/HabitForm.vue'
import HabitEntry from '@/components/HabitEntry.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import HabitGroup from '@/components/habit_groups/HabitGroup.vue'
import HabitGroupForm from '@/components/habit_groups/HabitGroupForm.vue'
import { getLastXDaysFormatted } from '@/utils/dateUtils'
import requestApi from '@/utils/requestApi'

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
    const { getAccessTokenSilently, user } = useAuth0()
    const accessToken = ref<string | null>(null)

    const groupedHabits = ref<Array<any>>([])
    const habitGroups = ref<Array<any>>([])
    const loading = ref(true)
    const errorMessage = ref<string | null>(null)
    const completionPercentages = ref<CompletionPercentages>({})

    const todaysDateFormatted = dayjs().format('YYYY-MM-DD');
    const lastSevenDays = getLastXDaysFormatted(30, 'YYYY-MM-DD');
    const lastSevenDaysNice = getLastXDaysFormatted(30, 'ddd<br>D');

    const fetchHabits = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}habits/get_habits`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      if (response.ok) {
        loading.value = false
        const responseBody = await response.json()
        completionPercentages.value = responseBody.completion_percentages
        groupedHabits.value = responseBody.habits

        console.log(completionPercentages.value)

      } else {
        loading.value = false
        const responseBody = await response.json()
        errorMessage.value = responseBody.error

        // Not ideal but it works for now
        // if (errorMessage.value === 'Access token has expired or is invalid.') {
        //   localStorage.clear()
        //   sessionStorage.clear()
        //   window.location.reload()
        // }
      }
    }

    const fetchHabitGroups = async () => {
      console.log('accessToken', accessToken.value)
      const apiUrl = `${import.meta.env.VITE_API_URL}habit_groups`
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
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

    const habitComplete = (percentage: number) => {
      return percentage === 100 ? true : false
    }

    const getAccessToken = async () => {
      accessToken.value = await getAccessTokenSilently();
    };

    const habitBulkUpdateUrl = `${import.meta.env.VITE_API_URL}habits/bulk_update`

    onMounted(async () => {
      await getAccessToken()
      fetchHabits()
      fetchHabitGroups()
    })

    return {
      accessToken,
      user,
      groupedHabits,
      habitGroups,
      loading,
      errorMessage,
      lastSevenDays,
      completionPercentages,
      todaysDateFormatted,
      getHabitEntiryForDate,
      lastSevenDaysNice,
      fetchHabits,
      habitComplete,
      habitBulkUpdateUrl
    }
  },
})
</script>

<template>
  <div class="page-header">
    <PageHeader title="My Habits" />

    <div class="page-header-card shadow">
      <h2 class="mb-3"><b>Progress</b></h2>

      <v-progress-linear
      v-for="(data, habitGroup) in completionPercentages"
        color="light-blue"
        height="25"
        :model-value="data[todaysDateFormatted]"
        striped
      >
        <template v-slot:default="{ value }">
          <strong>{{ habitGroup }} {{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>
    </div>
  </div>

  <div class="page-wrapper shadow">
    <div v-if="loading">Loading...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else-if="groupedHabits.length === 0">No habits found</div>
    <div v-else>
      <div class="habit-table">
        <div class="horizontal-scroll">
          <div v-for="(habits, groupName) in groupedHabits" :key="groupName" class="table-habit-group">
            <n-dropdown>
              <template #label>
                <HabitGroup :habitGroup="habits[0].habit_group" />
              </template>

              <template #content>
                <div class="completion-percentages-container">
                  <div class="table-habit-name"></div>
                  <small class="table-cell" v-for="date in lastSevenDaysNice" :key="date">
                    <span class="table-date" v-html="date"></span>
                  </small>
                </div>

                <n-order-list
                  class="table-habit-tr"
                  :items="habits"
                  :updateUrl="habitBulkUpdateUrl"
                  :loading="loading"
                  :accessToken="accessToken"
                  modelName="habits"
                >
                  <template #default="habit">
                    <div class="table-habit-name">
                      <Habit
                        :habit="habit"
                        :fetchHabits="fetchHabits"
                      />
                    </div>
                    <div class="table-cell" v-for="date in lastSevenDays" :key="date">
                      <HabitEntry
                        v-if="accessToken"
                        :entry="getHabitEntiryForDate(habit, date)"
                        :habit="habit"
                        :date="date"
                        :colour="habit.colour"
                        :fetchHabits="fetchHabits"
                        :accessToken="accessToken"
                      />
                    </div>
                  </template>
                </n-order-list>
              </template>
            </n-dropdown>
          </div>
        </div>
      </div>

    <div class="mt-5 d-flex justify-space-start">
      <HabitForm
        v-if="fetchHabits"
        :fetchHabits="fetchHabits"
      >
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
  </div>
</template>
