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

    onMounted(async () => {
      await getAccessToken()
      fetchChecklists()
    })

    return {
      checklists,
    }
  },
})
</script>

<template>
  <div class="page-header">
    <PageHeader title="Checklists" />
  </div>

  <v-list>
    <v-list-item
      v-for="checklist in checklists"
      :key="checklist.id"
      :to="`/checklists/${checklist.id}`"
    >
      <v-list-item-title>{{ checklist.name }}</v-list-item-title>
    </v-list-item>
  </v-list>

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
