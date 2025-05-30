<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import ChecklistItemForm from '@/components/checklist_items/ChecklistItemForm.vue'
import ChecklistItem from '@/components/checklist_items/ChecklistItem.vue'
import { useRoute } from 'vue-router'
import { useAuthToken } from '@/composables/useAuthToken'

export interface Task {
  id?: number
  name: string
  description?: string
  status: string
  checklist_items: Array<any>
}

export default defineComponent({
  name: 'TaskView',
  components: {
    PageHeader,
    TaskForm,
    ChecklistItemForm,
    ChecklistItem
  },
  setup() {
    const { accessToken } = useAuthToken()
    const task = ref<Task>({
      name: '',
      description: '',
      status: '',
      checklist_items: []
    })
    const errorMessage = ref<string | null>(null)
    const loading = ref(true)
    const breadcrumbs = ref([
      {
        title: 'Tasks',
        disabled: false,
        href: '/#/tasks',
      }
    ])
    const route = useRoute()
    const taskId = ref(route.params.id)

    watch(() => route.params.id, (newId) => {
      taskId.value = newId
    })

    const fetchTask = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}checklists/${taskId.value}`
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      if (response.ok) {
        loading.value = false
        const responseBody = await response.json()
        task.value = responseBody
        breadcrumbs.value.push({
          title: responseBody.name,
          disabled: true,
          href: `/tasks/${taskId}`,
        })
      } else {
        loading.value = false
        const responseBody = await response.json()
        errorMessage.value = responseBody.error
      }
    }

    watch(accessToken, (newValue) => {
      if (newValue) {
        fetchTask()
      }
    }, { immediate: true })

    const checklistItemBulkUpdateUrl = `${import.meta.env.VITE_API_URL}checklist_items/bulk_update`

    return {
      task,
      breadcrumbs,
      checklistItemBulkUpdateUrl,
      accessToken,
      errorMessage,
      loading,
    }
  },
})
</script>

<template>
  <div class="page-header">
    <PageHeader :title="task.name" />
    <TaskForm :task="task">
      <template #trigger="{ openDialog }">
        <n-button
          @click="openDialog"
        >Edit Task</n-button>
      </template>
    </TaskForm>

    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:prepend>
        <v-icon icon="$vuetify" size="small"></v-icon>
      </template>
    </v-breadcrumbs>
  </div>

  <div class="p-1">
    <n-order-list :items="task.checklist_items" :updateUrl="checklistItemBulkUpdateUrl" :accessToken="accessToken" :loading="loading" modelName="checklist_items">
      <template #default="checklist_item">
        <ChecklistItem :checklistItem="checklist_item" />
      </template>
    </n-order-list>
  </div>

  <ChecklistItemForm>
    <template #trigger="{ openDialog }">
      <n-button
        class="m-1"
        @click="openDialog"
      >New Task Item</n-button>
    </template>
  </ChecklistItemForm>
</template> 