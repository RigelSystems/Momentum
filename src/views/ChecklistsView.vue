<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import ChecklistForm from '@/components/checklists/ChecklistForm.vue'
import { useAuth0 } from '@auth0/auth0-vue'

export default defineComponent({
  name: 'ChecklistsView',
  components: {
    PageHeader,
    ChecklistForm,
  },
  setup() {
    const { getAccessTokenSilently, user } = useAuth0()
    const accessToken = ref<string | null>(null)
    const errorMessage = ref<string | null>(null)
    const loading = ref(true)
    const tasks = ref<Array<any>>([])
    const workouts = ref<Array<any>>([])

    const fetchChecklists = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}checklists`
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      if (response.ok) {
        loading.value = false
        const responseBody = await response.json()

        tasks.value = responseBody.filter((checklist: any) => checklist.checklist_type === 'tasks')
        workouts.value = responseBody.filter((checklist: any) => checklist.checklist_type === 'workout')

        console.log('Fetched tasks:', tasks.value)
        console.log('Fetched workouts:', workouts.value)

        console.log('Fetched checklists:', responseBody)
      } else {
        loading.value = false
        const responseBody = await response.json()
        errorMessage.value = responseBody.error
      }
    }

    const getAccessToken = async () => {
      accessToken.value = await getAccessTokenSilently();
    };

    const updateUrl = `${import.meta.env.VITE_API_URL}checklists/bulk_update`

    onMounted(async () => {
      await getAccessToken()
      fetchChecklists()
    })

    return {
      tasks,
      workouts,
      loading,
      accessToken,
      updateUrl
    }
  },
})
</script>

<template>
    <div class="standard-container p-1">
      <ChecklistForm>
        <template #trigger="{ openDialog }">
          <n-button @click="openDialog">New List</n-button>
        </template>
      </ChecklistForm>
    </div>

    <n-tabs>
      <template #tabs="{ activeTab, setActiveTab }">
        <n-tab
          label="Tasks"
          :active="activeTab === 0"
          @click="setActiveTab(0)"
        />
        <n-tab
          label="Workouts"
          :active="activeTab === 1"
          @click="setActiveTab(1)"
        />
      </template>

      <template #default="{ activeTab }">
        <n-tab-panel :index="0" :activeTab="activeTab">
          <!-- Tasks -->
          <n-order-list
            :items="tasks"
            :updateUrl="updateUrl"
            :loading="loading"
            :accessToken="accessToken"
            modelName="checklists"
          >
            <template #default="checklist">
              <NCard :title="checklist.name">
                <template #content>
                  <p>{{ checklist.description }}</p>

                  <RouterLink
                    :to="{ name: 'checklist', params: { id: checklist.id } }"
                    class="mr-2"
                  >
                  View
                  </RouterLink>
                </template>
              </NCard>
            </template>
          </n-order-list>
        </n-tab-panel>
        <n-tab-panel :index="1" :activeTab="activeTab">
          <!-- Workouts -->
          <n-order-list
            :items="workouts"
            :updateUrl="updateUrl"
            :loading="loading"
            :accessToken="accessToken"
            modelName="checklists"
          >
            <template #default="checklist">
              <NCard :title="checklist.name">
                <template #content>
                  <p>{{ checklist.description }}</p>

                  <RouterLink
                    :to="{ name: 'checklist', params: { id: checklist.id } }"
                    class="mr-2"
                  >
                  View
                  </RouterLink>
                </template>
              </NCard>
            </template>
          </n-order-list>
        </n-tab-panel>
      </template>
    </n-tabs>
</template>
