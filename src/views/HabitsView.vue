<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import HabitGroup from '@/components/habit_groups/HabitGroup.vue'
import HabitGroupForm from '@/components/habit_groups/HabitGroupForm.vue'
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
  <div class="habits-page">

    <!-- Page header -->
    <div class="habits-header">
      <div>
        <h2 class="habits-header__title">Habits</h2>
        <p class="habits-header__sub">Track your daily consistency</p>
      </div>
      <div class="habits-header__actions">
        <label class="habits-csv-label">
          <n-button :primary="false" size="small" :disabled="importing">
            <span class="mdi mdi-upload-outline"></span>
            {{ importing ? 'Importing…' : 'Import CSV' }}
          </n-button>
          <input ref="csvInput" type="file" accept=".csv" style="display:none" @change="handleImport" />
        </label>
      </div>
    </div>

    <!-- Import feedback -->
    <div v-if="importMessage" class="habits-import-badge" :class="importMessage.startsWith('Import failed') ? 'habits-import-badge--error' : 'habits-import-badge--success'">
      <span class="mdi" :class="importMessage.startsWith('Import failed') ? 'mdi-alert-circle-outline' : 'mdi-check-circle-outline'"></span>
      {{ importMessage }}
    </div>

    <!-- Content -->
    <div class="habits-content">
      <div v-if="loading" class="habits-empty">Loading…</div>
      <div v-else-if="errorMessage" class="habits-empty habits-empty--error">{{ errorMessage }}</div>
      <div v-else-if="habitGroups.length === 0" class="habits-empty">
        <span class="mdi mdi-cards-outline habits-empty__icon"></span>
        <p>Create your first habit group to get started.</p>
        <HabitGroupForm>
          <template #trigger="{ openDialog }">
            <n-button size="small" @click="openDialog">
              <span class="mdi mdi-folder-plus-outline"></span> New Group
            </n-button>
          </template>
        </HabitGroupForm>
      </div>
      <div v-else class="habit-table">
        <div class="horizontal-scroll">
          <div v-for="habitGroup in habitGroups" :key="habitGroup.id" class="table-habit-group">
            <HabitGroup :habitGroup="habitGroup" />
          </div>
          <div class="table-habit-group">
            <HabitGroupForm>
              <template #trigger="{ openDialog }">
                <div class="add-group-card" @click="openDialog">
                  <span class="mdi mdi-plus"></span>
                  <span>New Group</span>
                </div>
              </template>
            </HabitGroupForm>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.habits-page {
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.habits-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0 0.25rem;
}

.habits-header__title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

.habits-header__sub {
  font-size: 0.85rem;
  color: #9ca3af;
  margin: 0.1rem 0 0;
}

.habits-header__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.habits-csv-label {
  cursor: pointer;
}

.add-group-card {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 0.85rem 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: #9ca3af;
  font-size: 0.85rem;
  font-weight: 500;
  min-height: 48px;
  transition: border-color 0.15s, color 0.15s;
  user-select: none;
}

.add-group-card:hover {
  border-color: var(--theme-color, #88bdb9);
  color: var(--theme-color, #88bdb9);
}

.habits-import-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 500;
  width: fit-content;
}

.habits-import-badge--success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.habits-import-badge--error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.habits-content {
  flex: 1;
}

.habits-empty {
  padding: 3rem 1rem;
  text-align: center;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.habits-empty--error {
  color: #dc2626;
}

.habits-empty__icon {
  font-size: 2.5rem;
  opacity: 0.4;
}
</style>
