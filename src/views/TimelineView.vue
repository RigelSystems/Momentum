<script lang="ts">
import { defineComponent, watchEffect, ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import dayjs from 'dayjs'
import requestApi from '../utils/requestApi'
import Habit from '@/components/habits/Habit.vue'

export default defineComponent({
  name: 'TimelineView',
  components: {
    Habit,
  },
  setup() {
    const loading = ref(true)
    const errorMessage = ref<string | null>(null)
    const startDateTime = dayjs().startOf('day').format('YYYY-MM-DDTHH:mm:ss')
    const endDateTime = dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    const minuteInterval = 15
    const items = ref<any[]>([])
    const expiredHabits = ref<any[]>([])

    onMounted(async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}habits/for_timeline`
      const fetchRecords = requestApi(apiUrl, 'POST')

      try {
        const data = await fetchRecords()
        items.value = data
      } catch (e) {
        errorMessage.value = 'Failed to fetch records'
      }
      loading.value = false
    })

    onMounted(async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}habits/past_start_time`
      const fetchRecords = requestApi(apiUrl, 'POST')

      try {
        const data = await fetchRecords()
        expiredHabits.value = data
      } catch (e) {
        errorMessage.value = 'Failed to fetch records'
      }
    })

    return {
      startDateTime,
      endDateTime,
      minuteInterval,
      items,
      expiredHabits
    }
  },
})
</script>

<template>
  <NRow :cols="{sm: [100], md: [30, 70], lg: [20, 80]}" style="padding: 1rem">
    <div>
      <h3 class="text-h5">Expired Habits</h3>
      <Habit
        v-if="expiredHabits.length > 0"
        v-for="habit in expiredHabits"
        :key="habit.id"
        :habit="habit"
      />
      <p v-else>No expired habits!</p>
    </div>

    <div>
      <h3 class="text-h5">Timeline</h3>
      <n-timeline
        v-if="items?.length > 0"
        :startDateTime="startDateTime"
        :endDateTime="endDateTime"
        :minuteInterval="15"
        :items="items"
      >
      </n-timeline>
    </div>
  </NRow>
</template>
