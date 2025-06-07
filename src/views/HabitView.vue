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
  habit_entries: Array<{
    id: number
    date: string
    value: number
    created_at: string
    updated_at: string
  }>
  dashboard_data: Array<{
    title: string
    value: number
    icon: string
    colour: string
    bottomText: string
  }>
  colour: string
  monthly_data: Array<{
    month: string
    first_day_of_week: number
    entries: Array<{
      id: number
      date: string
      entry: any
    }>
    total_entries: number
    daily_average: number
    weekly_average: number
  }>
}

export default defineComponent({
  name: 'HabitView',
  components: {
    PageHeader,
    HabitEntry,
    Habit,
  },
  setup() {
    const lastSevenDays = getLastXDaysFormatted(365, 'YYYY-MM-DD');
    const lastSevenDaysNice = getLastXDaysFormatted(365, 'ddd<br>D');
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

    const fetchHabit = async () => {
      loading.value = true
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
    }

    onMounted(async () => {
     const apiUrl = `${import.meta.env.VITE_API_URL}habits/${habitId.value}`
      const fetchRecords = requestApi(apiUrl, 'GET')

      try {
        const data = await fetchRecords()
        console.log('Habit data:', data)
        habit.value = data
        console.log(data)
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

    const getHabitEntiryForDate = (habit: any, date: string) => {
      return habit.habit_entries.find((entry: any) => entry.date === date);
    }

    const getAccessToken = async () => {
      accessToken.value = await getAccessTokenSilently();
    };

    onMounted(async () => {
      await getAccessToken()
    })

    function getOrdinal(n: number) {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
      }
    }

    function getMonthlyData(year) {
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return months.map((monthName, i) => {
        const firstDayOfWeek = new Date(year, i, 1).getDay();
        // ...build entries array for the month...
        return {
          month: monthName,
          year,
          first_day_of_week: firstDayOfWeek,
          entries: [], // fill with your entries
          total_entries: 0,
          daily_average: 0,
          weekly_average: 0,
        };
      });
    }

    return {
      habit,
      breadcrumbs,
      lastSevenDays,
      lastSevenDaysNice,
      getHabitEntiryForDate,
      accessToken,
      getOrdinal
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

  <n-tabs>
    <template #tabs="{ activeTab, setActiveTab }">
      <n-tab
        label="Totals"
        :active="activeTab === 0"
        @click="setActiveTab(0)"
      />
      <n-tab
        label="Averages"
        :active="activeTab === 1"
        @click="setActiveTab(1)"
      />
      <n-tab
        label="Changes"
        :active="activeTab === 2"
        @click="setActiveTab(2)"
      />
      <n-tab
        label="Records"
        :active="activeTab === 3"
        @click="setActiveTab(3)"
      />
    </template>

    <template #default="{ activeTab }">
      <n-tab-panel :index="0" :activeTab="activeTab">
        <!-- Totals -->
        <div class="standard-container-3">
          <NDashboardTile
            v-if="habit?.dashboard_data_totals?.length > 0"
            v-for="(item, index) in habit.dashboard_data_totals"
            :key="index"
            :title="item.title"
            :value="item.value"
            :icon="item.icon"
            :colour="item.colour"
            :bottomText="item.bottomText"
          ></NDashboardTile>
        </div>
      </n-tab-panel>
      <n-tab-panel :index="1" :activeTab="activeTab">
        <!-- Averages -->
        <div class="standard-container-3">
          <NDashboardTile
            v-if="habit?.dashboard_data_averages?.length > 0"
            v-for="(item, index) in habit.dashboard_data_averages"
            :key="index"
            :title="item.title"
            :value="item.value"
            :icon="item.icon"
            :colour="item.colour"
            :bottomText="item.bottomText"
          ></NDashboardTile>
        </div>
      </n-tab-panel>
      <n-tab-panel :index="2" :activeTab="activeTab">
        <!-- Changes -->
        <div class="standard-container-3">
          <NDashboardTile
            v-if="habit?.dashboard_data_changes?.length > 0"
            v-for="(item, index) in habit.dashboard_data_changes"
            :key="index"
            :title="item.title"
            :value="item.value"
            :icon="item.icon"
            :colour="item.colour"
            :bottomText="item.bottomText"
          ></NDashboardTile>
        </div>
      </n-tab-panel>
      <n-tab-panel :index="3" :activeTab="activeTab">
        <!-- Records -->
        <div class="standard-container-3">
          <NDashboardTile
            v-if="habit?.dashboard_data_records?.length > 0"
            v-for="(item, index) in habit.dashboard_data_records"
            :key="index"
            :title="item.title"
            :value="item.value"
            :icon="item.icon"
            :colour="item.colour"
            :bottomText="item.bottomText"
          ></NDashboardTile>
        </div>
      </n-tab-panel>
    </template>
  </n-tabs>

  <div class="standard-container-3 calendar-yearly p-1">
    <div v-for="month in habit.monthly_data" :key="month.month" class="calendar-month-card">
      <h4 class="calendar-month-title">
        {{ month.month }} {{ month.year || habit.created_at?.slice(0, 4) }}
      </h4>
      <div class="calendar-days-header">
        <span v-for="day in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="day" class="calendar-day-header">{{ day }}</span>
      </div>
      <div class="calendar-days-grid">
        <!-- Pad empty days before the 1st of the month -->
        <span
          v-for="n in month.first_day_of_week"
          :key="'empty-' + n"
          class="calendar-day-cell empty"
        ></span>
        <!-- Render each day -->
        <div
          v-for="entry in month.entries"
          :key="entry.id"
          class="calendar-day-cell"
          style="position: relative;"
        >
          <span class="calendar-day-number">
            {{ new Date(entry.date).getDate() }}<sup>{{ getOrdinal(new Date(entry.date).getDate()) }}</sup>
          </span>
          <HabitEntry
            v-if="accessToken"
            :entry="entry.entry"
            :habit="habit"
            :date="entry.date"
            :colour="habit.colour"
            :fetchHabits="fetchHabits"
            :accessToken="accessToken"
          />
        </div>
      </div>
      <div class="calendar-month-stats">
        <p>Total: {{ month.total_entries }}</p>
        <p>Daily Average: {{ month.daily_average }}</p>
        <p>Weekly Average: {{ month.weekly_average }}</p>
      </div>
    </div>
  </div>
</template>

<style>
.calendar-month-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-month-title {
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 1.2rem;
  text-align: center;
}

.calendar-days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 100%;
  margin-bottom: 0.25rem;
}

.calendar-day-header {
  text-align: center;
  font-size: 0.9rem;
  color: #888;
  font-weight: 600;
}

.calendar-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  width: 100%;
  min-height: 120px;
}

.calendar-day-cell {
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px black;
}

.calendar-day-cell.empty {
  background: transparent;
  pointer-events: none;
}

.calendar-month-stats {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #555;
  text-align: center;
}

.calendar-day-number {
  position: absolute;
  text-align: center;
  bottom: 0;
  right: 0;
  border-left: 1px solid #000000;
  border-top: 1px solid #000000;
  font-size: 0.5em;
  color: #000000;
  pointer-events: none;
  z-index: 2;
  font-weight: 700;
  background: rgba(255,255,255,1);
  border-radius: 5px 0 0 0;
  padding: 0 2px;
}

@media (max-width: 900px) {
  .standard-container-3.calendar-yearly {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .standard-container-3.calendar-yearly {
    grid-template-columns: 1fr;
  }
}
</style>

