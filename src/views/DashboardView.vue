<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useAuthToken } from '@/composables/useAuthToken'

export default defineComponent({
  name: 'DashboardView',
  setup() {
    const { accessToken } = useAuthToken()
    const loading = ref(true)
    const data = ref<any[]>([])
    const errorMessage = ref<string | null>(null)

    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...')
        console.log('Access token:', accessToken.value)

        const apiUrl = `${import.meta.env.VITE_API_URL}dashboard`;
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken.value}`,
          },
        })

        const responseBody = await response.json()
        data.value = responseBody
      } catch (error) {
        errorMessage.value = 'Failed to fetch data'
        console.error(error)
        return null
      } finally {
        loading.value = false
      }
    }

    watch(accessToken, (newValue) => {
      if (newValue && accessToken.value) {
        console.log('Access token changed:', newValue)
        fetchDashboardData()
      }
    }, { immediate: true })

    return {
      data
    }
  }
})
</script>

<template>
  <div class="d-flex flex-column gap-1 p-1">
    <NDashboardTile
      v-if="data.length > 0"
      v-for="(item, index) in data"
      :key="index"
      :title="item.title"
      :value="item.value"
      :icon="item.icon"
      :colour="item.colour"
      :bottomText="item.bottomText"
    ></NDashboardTile>
  </div>
</template>
