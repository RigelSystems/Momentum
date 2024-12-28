<script lang="ts">
import { watch, defineComponent, onMounted, ref } from 'vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'
import Habit from '@/components/Habit.vue'

export default defineComponent({
  name: 'HabitsView',
  components: {
    Habit,
  },
  setup() {
    const habits = ref<Array<any>>([])
    const loading = ref(true)
    const errorMessage = ref<string | null>(null)

    const fetchHabits = async () => {
      const accessTokenStore = useAccessTokenStore()
      const apiUrl = `${import.meta.env.VITE_API_URL}habits`
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

        // Not ideal but it works for now
        if (errorMessage.value === 'Access token has expired or is invalid.') {
          accessTokenStore.$reset()
          accessTokenStore.clearState()
          localStorage.clear()
          sessionStorage.clear()
        }
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
  <div class="page-wrapper">
    <h1>This is the habits page</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else-if="habits.length === 0">No habits found</div>
    <div v-else>
      <div class="habit-container">
        <Habit v-for="habit in habits" :key="habit.id" :habit="habit" />
      </div>
    </div>
  </div>
</template>
