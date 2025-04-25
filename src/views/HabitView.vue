<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useRoute } from 'vue-router'
import Habit from '@/components/habits/Habit.vue'
import HabitEntry from '@/components/HabitEntry.vue'
import { getLastXDaysFormatted } from '@/utils/dateUtils'
import requestApi from '@/utils/requestApi'

interface Habit {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

export default defineComponent({
  name: 'HabitView',
  components: {
    PageHeader,
    HabitEntry,
    Habit,
  },
  setup() {
    const lastSevenDays = getLastXDaysFormatted(30, 'YYYY-MM-DD');
    const lastSevenDaysNice = getLastXDaysFormatted(30, 'ddd<br>D');
    const { getAccessTokenSilently, user } = useAuth0()
    const accessToken = ref<string | null>(null)
    const errorMessage = ref<string | null>(null)
    const loading = ref(true)
    const breadcrumbs = ref([
      {
        title: 'Habits',
        disabled: false,
        href: '/#/habits',
      }
    ])
    const habit = ref({} as Habit)
    const route = useRoute()
    const habitId = ref(route.params.id)

    watch(() => route.params.id, (newId) => {
      habitId.value = newId
    })

    onMounted(async () => {
     const apiUrl = `${import.meta.env.VITE_API_URL}habits/${habitId.value}`
      const fetchRecords = requestApi(apiUrl, 'GET')

      try {
        const data = await fetchRecords()
        console.log('Habit data:', data)
        habit.value = data
        breadcrumbs.value.push({
          title: data.name,
          disabled: true,
          href: `/habits/${habitId}`,
        })
      } catch (e) {
        errorMessage.value = 'Failed to fetch records'
      }
      loading.value = false
    })

    const getAccessToken = async () => {
      accessToken.value = await getAccessTokenSilently();
    };

    onMounted(async () => {
      await getAccessToken()
    })

    const getHabitEntiryForDate = (habit: any, date: string) => {
      return habit.habit_entries.find((entry: any) => entry.date === date);
    }

    return {
      habit,
      breadcrumbs,
      lastSevenDays,
      lastSevenDaysNice,
      getHabitEntiryForDate,
      accessToken
    }
  },
})
</script>

<template>
  <div class="page-header">
    <PageHeader :title="habit.name" />

    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:prepend>
        <v-icon icon="$vuetify" size="small"></v-icon>
      </template>
    </v-breadcrumbs>
  </div>

  <div class="page-wrapper">
    <div class="completion-percentages-container">
      <div class="table-habit-name"></div>
      <small class="table-cell" v-for="date in lastSevenDaysNice" :key="date">
        <span class="table-date" v-html="date"></span>
      </small>
    </div>

    <div class="habit-entires__container">
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
    </div>
  </div>
</template>

