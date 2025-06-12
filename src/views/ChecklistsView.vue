<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useAuthToken } from '@/composables/useAuthToken'
import ChecklistForm from '@/components/checklists/ChecklistForm.vue'

export interface Task {
  id: number
  name: string
  description?: string
  status: string
  checklist_items: Array<any>
}

export default defineComponent({
  name: 'ChecklistsView',
  components: {
    PageHeader,
    ChecklistForm
  },
  setup() {
    const { accessToken } = useAuthToken()
    const loading = ref(true)
    const checklists = ref<Task[]>([])
    const errorMessage = ref<string | null>(null)
    const dataGrid = ref<any>(null)

    const fetchChecklists = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}checklists`
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      if (response.ok) {
        const responseBody = await response.json()
        checklists.value = responseBody
        loading.value = false
      } else {
        const responseBody = await response.json()
        errorMessage.value = responseBody.error
        loading.value = false
      }
    }

    watch(accessToken, (newValue) => {
      if (newValue) {
        fetchChecklists()
      }
    }, { immediate: true })

    const handleTaskSaved = () => {
      fetchChecklists()
    }

    const checklistBulkUpdateUrl = computed(() => `${import.meta.env.VITE_API_URL}checklists/bulk_update`)
    const checklistUrl = computed(() => `${import.meta.env.VITE_API_URL}checklists`)

    return {
      checklists,
      loading,
      errorMessage, 
      handleTaskSaved,
      checklistBulkUpdateUrl,
      accessToken,
      checklistUrl,
      dataGrid
    }
  },
})
</script>

<template>
  <div class="standard-container p-1">
    <PageHeader title="Checklists" />
    <ChecklistForm @save="handleTaskSaved">
      <template #trigger="{ openDialog }">
        <NButton @click="openDialog">New Checklist</NButton>
      </template>
    </ChecklistForm>
  </div>

  <div class="standard-container p-1">
    <NDataGrid
      v-if="accessToken"
      ref="dataGrid"
      :url="checklistUrl"
      :accessToken="accessToken"
      :pageSize="10"
      :search="true"
      :sortable="true"
      :searchableFields="['name']"
      :sortableFields="['name']"
    />
  </div>
</template> 