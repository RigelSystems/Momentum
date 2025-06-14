<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import ChecklistForm from '@/components/checklists/ChecklistForm.vue'
import ChecklistItem from '@/components/checklist_items/ChecklistItem.vue';
import { useRoute } from 'vue-router'
import { useAuthToken } from '@/composables/useAuthToken'

export interface Checklist {
  id?: number,
  name: string,
  status: string,
  checklist_items: Array<ChecklistItem>
}

export interface ChecklistItem {
  id: number,
  name: string,
  icon: string,
  status: string,
  checklist_id: number,
}

export default defineComponent({
  name: 'ChecklistView',
  components: {
    PageHeader,
    ChecklistItem,
    ChecklistForm,
  },
  setup() {
    const { accessToken } = useAuthToken()

    const checklist = ref<Checklist>({
      name: '',
      status: '',
      checklist_items: []
    })
    const errorMessage = ref<string | null>(null)
    const loading = ref(true)
    const breadcrumbs = ref([
      {
        title: 'Checklists',
        disabled: false,
        href: '/#/checklists',
      }
    ])
    const route = useRoute()
    const checklistId = ref(route.params.id)

    watch(() => route.params.id, (newId) => {
      checklistId.value = newId
    })

    const fetchChecklist = async () => {
      checklist.value.checklist_items = []
      const apiUrl = `${import.meta.env.VITE_API_URL}checklists/${checklistId.value}`
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      if (response.ok) {
        loading.value = false
        const responseBody = await response.json()
        checklist.value = responseBody
        console.log(checklist.value)
        breadcrumbs.value.push({
          title: responseBody.name,
          disabled: true,
          href: `/checklists/${checklistId}`,
        })
      } else {
        loading.value = false
        const responseBody = await response.json()
        errorMessage.value = responseBody.error
      }
    }

    const createChecklistItem = () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}checklist_items`
      const response = fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
        body: JSON.stringify({
          checklist_id: checklistId.value,
        }),
      })
      response.then(() => {
        fetchChecklist()
      })
    }

    watch(accessToken, async () => {
      await fetchChecklist()
    })

    const checklistItemBulkUpdateUrl = `${import.meta.env.VITE_API_URL}checklist_items/bulk_update`

    return {
      checklist,
      breadcrumbs,
      checklistItemBulkUpdateUrl,
      accessToken,
      errorMessage,
      loading,
      fetchChecklist,
      createChecklistItem
    }
  },
})
</script>

<template>
  <div class="page-header">
    <PageHeader :title="checklist.name" />
    
    <ChecklistForm :checklist="checklist">
        <template #trigger="{ openDialog }">
          <n-button
            @click="openDialog"
          >Edit List</n-button>
        </template>
    </ChecklistForm>
  </div>

  <div class="p-1">
    <n-order-list :items="checklist.checklist_items" :updateUrl="checklistItemBulkUpdateUrl" :accessToken="accessToken" :loading="loading" modelName="checklist_items">
      <template #default="checklist_item">
        <ChecklistItem :checklistItem="checklist_item" @save="fetchChecklist" />
      </template>
    </n-order-list>
  </div>

  <NButton @click="createChecklistItem">Create Checklist Item</NButton>

</template>
