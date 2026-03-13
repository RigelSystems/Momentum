import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

export interface User {
  id: number
  email: string
  name: string
  image: string | null
  telegram_link_token: string | null
  telegram_chat_id: string | null
  premium: boolean
}

export function useUser() {
  const { getAccessTokenSilently } = useAuth0()
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUser = async () => {
    loading.value = true
    error.value = null

    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`${import.meta.env.VITE_API_URL}users/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        user.value = await response.json()
      } else {
        const body = await response.json()
        error.value = body.error
      }
    } finally {
      loading.value = false
    }
  }

  return { user, loading, error, fetchUser }
}
