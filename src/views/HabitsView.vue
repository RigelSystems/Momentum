<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import HabitGroup from '@/components/habit_groups/HabitGroup.vue'
import HabitGroupForm from '@/components/habit_groups/HabitGroupForm.vue'
import HabitForm from '@/components/habits/HabitForm.vue'
import requestApi from '@/utils/requestApi'
import { useAuthToken } from '@/composables/useAuthToken'

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
    const importing = ref(false)
    const importMessage = ref<string | null>(null)
    const { accessToken } = useAuthToken()

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

    const handleImport = async (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return

      importing.value = true
      importMessage.value = null

      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}habits/import`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken.value}` },
          body: formData,
        })
        const body = await response.json()
        if (response.ok) {
          importMessage.value = 'Import successful'
          await fetchHabitGroups()
        } else {
          importMessage.value = `Import failed: ${body.error}`
        }
      } catch (e) {
        importMessage.value = 'Import failed'
      }

      importing.value = false
      ;(event.target as HTMLInputElement).value = ''
    }

    return {
      habitGroups,
      fetchHabitGroups,
      loading,
      errorMessage,
      importing,
      importMessage,
      handleImport,
    }
  },
})
</script>

<template>
  <div class="standard-container p-1">
    <HabitGroupForm>
      <template #trigger="{ openDialog }">
        <n-button @click="openDialog">New Habit Group</n-button>
      </template>
    </HabitGroupForm>

    <HabitForm @save="fetchHabitGroups" v-if="habitGroups.length > 0">
      <template #trigger="{ openDialog }">
        <n-button @click="openDialog">New Habit</n-button>
      </template>
    </HabitForm>

    <label>
      <n-button :disabled="importing" @click="$refs.csvInput.click()">
        {{ importing ? 'Importing...' : 'Import CSV' }}
      </n-button>
      <input ref="csvInput" type="file" accept=".csv" style="display:none" @change="handleImport" />
    </label>

    <span v-if="importMessage" style="margin-left: 8px">{{ importMessage }}</span>
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
