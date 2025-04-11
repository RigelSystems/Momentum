<script lang="ts">
import { defineComponent, watchEffect, ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'TimelineView',
  setup() {
    const { getAccessTokenSilently, user } = useAuth0()
    const accessToken = ref<string | null>(null)
    const loading = ref(true)
    const errorMessage = ref<string | null>(null)
    const startDateTime = dayjs().startOf('day').format('YYYY-MM-DDTHH:mm:ss')
    console.log('startDateTime', startDateTime)
    const endDateTime = dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    const minuteInterval = 15
    const items = ref<any[]>([])

    const fetchHabits = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}habits/for_timeline`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        const responseBody = await response.json()
        items.value = responseBody
        loading.value = false
        console.log('responseBody', responseBody)
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
      fetchHabits()
    })

    return {
      startDateTime,
      endDateTime,
      minuteInterval,
      items,
    }
  },
})
</script>

<template>
  <n-timeline
    v-if="items?.length > 0"
    :startDateTime="startDateTime"
    :endDateTime="endDateTime"
    :minuteInterval="15"
    :items="items"
  >
  </n-timeline>




</template>
