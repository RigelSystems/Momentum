<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import HabitGroupForm from '@/components/habit_groups/HabitGroupForm.vue'
import './HabitGroup.css'
import { getLastXDaysFormatted } from '@/utils/dateUtils'
import requestApi from '@/utils/requestApi'
import { useAuth0 } from '@auth0/auth0-vue'
import Habit from '@/components/habits/Habit.vue'
import HabitEntry from '@/components/HabitEntry.vue'

export interface HabitGroup {
  id?: number,
  name: string,
  icon: string,
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
    HabitEntry,
    Habit,
  },
  setup(props) {
    const last30daysNiceFormat = getLastXDaysFormatted(30, 'ddd<br>D');
    const last30days = getLastXDaysFormatted(30, 'YYYY-MM-DD');

    const habits = ref<Array<any>>([])
    const loading = ref(true)
    const errorMessage = ref<string | null>(null)

    const fetchHabits = async () => {
      loading.value = true
      const apiUrl = `${import.meta.env.VITE_API_URL}habit_groups/${props.habitGroup.id}/habits`
      const fetchRecords = requestApi(apiUrl, 'GET')

      try {
        const data = await fetchRecords()
        console.log('data:', data)
        habits.value = data

      } catch (e) {
        errorMessage.value = 'Failed to fetch records'
      }
      loading.value = false
    }

    const { getAccessTokenSilently, user } = useAuth0()
    const accessToken = ref<string | null>(null)

    const getAccessToken = async () => {
      accessToken.value = await getAccessTokenSilently();
    };

    onMounted(async () => {
      await getAccessToken();
    })

    onMounted(async () => {
      fetchHabits()
    })

    const getHabitEntiryForDate = (habit: any, date: string) => {
      return habit.habit_entries.find((entry: any) => entry.date === date);
    }

    const habitBulkUpdateUrl = `${import.meta.env.VITE_API_URL}habits/bulk_update`

    return {
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
          <h3>{{ habitGroup.name }}</h3>
          <v-icon class="mr-2" size="x-small">mdi-{{ habitGroup.icon }}</v-icon>
        </div>

        <HabitGroupForm :habitGroup="habitGroup">
          <template #trigger="{ openDialog }">
            <v-btn density="default" icon="mdi-dots-vertical" @click="openDialog" size="medium"
              class="mr-2 kabab-menu"></v-btn>
          </template>
        </HabitGroupForm>
      </div>
    </template>

    <template #content>
      <div class="completion-percentages-container">
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
              :colour="habit.colour" :fetchHabits="fetchHabits" />
          </div>
        </template>
      </n-order-list>
    </template>
  </n-dropdown>
</template>
