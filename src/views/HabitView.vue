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

  <div>
    <div v-for="month in habit.monthly_data" :key="month.month">
      <div>
        <h4>{{ month.month }}</h4>

        <div class="habit-yearly-container">
          <div class="habit-yearly-wrapper" v-for="entry in month.entries" :key="entry.id">
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

        <p>Total: {{ month.total_entries }}</p>
        <p>Daily Average: {{ month.daily_average }}</p>
        <p>Monthly Average: {{ month.monthly_average }}</p>
      </div>
    </div>
  </div>
</template>

