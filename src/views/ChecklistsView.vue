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

    return {
      checklists,
      loading,
      errorMessage,
      handleTaskSaved,
      checklistBulkUpdateUrl,
      accessToken
    }
  },
})
</script>

<template>
  <div class="standard-container p-1">
    <PageHeader title="Checklists" />
  </div>

  <div class="p-1">
    <ChecklistForm @saved="handleTaskSaved">
      <template #trigger="{ openDialog }">
        <n-button @click="openDialog">New Checklist</n-button>
      </template>
    </ChecklistForm>
  </div>

  <n-order-list
    :items="checklists"
    :loading="loading"
    modelName="checklists"
    :updateUrl="checklistBulkUpdateUrl"
    :accessToken="accessToken"
  >
    <template #default="task">
      <NCard :title="task.name">
        <template #content>
          <p>{{ task.description }}</p>
          <RouterLink
            :to="{ name: 'checklist', params: { id: task.id } }"
            class="mr-2"
          >
            View
          </RouterLink>
        </template>
      </NCard>
    </template>
  </n-order-list>
</template> 