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
    const checklists = ref<Array<any>>([])
    const errorMessage = ref<string | null>(null)
    const loading = ref(true)

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
        checklists.value = responseBody
        console.log(checklists.value)
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
      checklists,
      loading,
      accessToken,
      updateUrl
    }
  },
})
</script>

<template>
  <div class="page-header">
    <PageHeader title="Checklists" />
  </div>

  <NOrderList
    :items="checklists"
    :updateUrl="updateUrl"
    :loading="loading"
    :accessToken="accessToken"
    modelName="checklists"
  >
    <template #default="checklist">
      <h3>{{  checklist.name }}</h3>
      <p>{{ checklist.description }}</p>
      <div v-if="checklist.status === 'not_started'" >
              <small>Not Started - </small>
              <v-icon color="black-darken-3">mdi mdi-thought-bubble-outline</v-icon>
            </div>

            <div v-if="checklist.status === 'blocked'" >
              <small>Blocked - </small>
              <v-icon color="red-darken-3">mdi mdi-alert-octagon-outline</v-icon>
            </div>

            <div v-if="checklist.status === 'in_progress'" >
              <small>In Progress - </small>
              <v-icon color="green-darken-3">mdi mdi-hammer-screwdriver</v-icon>
            </div>

            <div v-if="checklist.status === 'completed'" >
              <small>Completed - </small>
              <v-icon color="green-darken-1">mdi mdi-check-outline</v-icon>
            </div>
      <RouterLink
        :to="{ name: 'checklist', params: { id: checklist.id } }"
        class="mr-2"
      >
      View
      </RouterLink>
    </template>
  </NOrderList>

  <ChecklistForm>
    <template #trigger="{ openDialog }">
      <v-btn
        density="comfortable"
        variant="tonal"
        text="New Checklist"
        class="mr-2"
        @click="openDialog"
      ></v-btn>
    </template>
  </ChecklistForm>
</template>
