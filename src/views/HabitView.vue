<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useRoute } from 'vue-router'

interface Habit {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

export default defineComponent({
  name: 'HabitView',
  components: {
    PageHeader,
  },
  setup() {
    const { getAccessTokenSilently, user } = useAuth0()
    const accessToken = ref<string | null>(null)
    const errorMessage = ref<string | null>(null)
    const loading = ref(true)
    const breadcrumbs = ref([
      {
        title: 'Habits',
        disabled: false,
        href: '/momentum/#/habits',
      }
    ])
    const habit = ref({} as Habit)
    const route = useRoute()
    const habitId = ref(route.params.id)

    watch(() => route.params.id, (newId) => {
      habitId.value = newId
    })

    const fetchHabit = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}habits/${habitId.value}`
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      if (response.ok) {
        loading.value = false
        const responseBody = await response.json()
        habit.value = responseBody
        breadcrumbs.value.push({
          title: responseBody.name,
          disabled: true,
          href: `/habits/${habitId}`,
        })
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
      await fetchHabit()
    })

    return {
      habit,
      breadcrumbs
    }
  },
})
</script>

<template>
  <div class="page-header">
    <PageHeader :title="habit.name" />

    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:prepend>
        <v-icon icon="$vuetify" size="small"></v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

