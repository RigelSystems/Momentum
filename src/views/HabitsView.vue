<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import HabitGroup from '@/components/habit_groups/HabitGroup.vue'
import HabitGroupForm from '@/components/habit_groups/HabitGroupForm.vue'
import HabitForm from '@/components/habits/HabitForm.vue'
import requestApi from '@/utils/requestApi'

interface CompletionPercentages {
  [key: string]: {
    [key: string]: number
  }
}

export default defineComponent({
  name: 'HabitsView',
  components: {
    HabitGroup,
    HabitForm,
    HabitGroupForm,
  },
  setup() {
    const habitGroups = ref<Array<any>>([])
    const loading = ref(true)
    const errorMessage = ref<string | null>(null)

    const fetchHabitGroups = async () => {
      loading.value = true
      const apiUrl = `${import.meta.env.VITE_API_URL}habit_groups`
      const fetchRecords = requestApi(apiUrl, 'GET')

      try {
        const data = await fetchRecords()
        console.log('data:', data)
        habitGroups.value = data

      } catch (e) {
        errorMessage.value = 'Failed to fetch records'
      }
      loading.value = false
    }

    onMounted(async () => {
      fetchHabitGroups()
    })

    return {
      habitGroups,
      fetchHabitGroups,
      loading,
      errorMessage,
    }
  },
})
</script>

<template>
  <div class="standard-container p-1">
    <HabitGroupForm>
      <template #trigger="{ openDialog }">
        <n-button
          @click="openDialog"
        >New Habit Group</n-button>
      </template>
    </HabitGroupForm>

    <HabitForm @save="fetchHabitGroups" v-if="habitGroups.length > 0">
        <template #trigger="{ openDialog }">
          <n-button
            @click="openDialog"
          >New Habit</n-button>
        </template>
      </HabitForm>
  </div>

  <div class="page-wrapper">
    <div v-if="loading">Loading...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else-if="habitGroups.length === 0">Create your first habit group.</div>
    <div v-else>
      <div class="habit-table">
        <div class="horizontal-scroll">
          <div v-for="habitGroup in habitGroups" :key="habitGroup.id" class="table-habit-group">
            <HabitGroup :habitGroup="habitGroup" />
          </div>
        </div>
      </div>
  </div>
  </div>
</template>
