<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useAuthToken } from '@/composables/useAuthToken'
import TaskForm from '@/components/tasks/TaskForm.vue'

export interface Task {
  id: number
  name: string
  description?: string
  status: string
  checklist_items: Array<any>
}

export default defineComponent({
  name: 'TasksView',
  components: {
    PageHeader,
    TaskForm
  },
  setup() {
    const { accessToken } = useAuthToken()
    const loading = ref(true)
    const tasks = ref<Task[]>([])
    const errorMessage = ref<string | null>(null)

    const fetchTasks = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}checklists`
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      if (response.ok) {
        const responseBody = await response.json()
        tasks.value = responseBody.filter((task: any) => task.checklist_type === 'tasks')
        loading.value = false
      } else {
        const responseBody = await response.json()
        errorMessage.value = responseBody.error
        loading.value = false
      }
    }

    watch(accessToken, (newValue) => {
      if (newValue) {
        fetchTasks()
      }
    }, { immediate: true })

    const handleTaskSaved = () => {
      fetchTasks()
    }

    return {
      tasks,
      loading,
      errorMessage,
      handleTaskSaved
    }
  },
})
</script>

<template>
  <div class="standard-container p-1">
    <PageHeader title="Tasks" />
  </div>

  <div class="p-1">
    <TaskForm @saved="handleTaskSaved">
      <template #trigger="{ openDialog }">
        <n-button @click="openDialog">New Task</n-button>
      </template>
    </TaskForm>
  </div>

  <n-order-list
    :items="tasks"
    :loading="loading"
    modelName="tasks"
  >
    <template #default="task">
      <NCard :title="task.name">
        <template #content>
          <p>{{ task.description }}</p>
          <RouterLink
            :to="{ name: 'task', params: { id: task.id } }"
            class="mr-2"
          >
            View
          </RouterLink>
        </template>
      </NCard>
    </template>
  </n-order-list>
</template> 