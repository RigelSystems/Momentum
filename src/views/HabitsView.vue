<script lang="ts">
import { watch, defineComponent, onMounted, ref } from 'vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'

export default defineComponent({
  name: 'HabitsView',
  components: {},
  setup() {
    const habits = ref<Array<any>>([])
    const loading = ref(true)
    const errorMessage = ref<string | null>(null)

    const fetchHabits = async () => {
      const accessTokenStore = useAccessTokenStore()
      const apiUrl = `${import.meta.env.VITE_API_URL}/habits`
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessTokenStore.accessToken}`,
        },
      })

      if (response.ok) {
        loading.value = false
        const responseBody = await response.json()
        habits.value = responseBody
      } else {
        loading.value = false
        const responseBody = await response.json()
        errorMessage.value = responseBody.error
      }
    }

    onMounted(() => {
      fetchHabits()
    })

    return {
      habits,
      loading,
      errorMessage,
    }
  },
})
</script>

<template>
  <div class="about">
    <h1>This is the habits page</h1>\
    <div v-if="loading">Loading...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else-if="habits.length === 0">No habits found</div>
    <div v-else>
      <ul>
        <li v-for="habit in habits" :key="habit.id">
          {{ habit.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
