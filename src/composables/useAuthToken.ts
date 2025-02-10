import { ref, onMounted, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

export function useAuthToken() {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0()
  const accessToken = ref<string | null>(null)

  const fetchAccessToken = async () => {
    if (!isAuthenticated.value) return // Ensure user is authenticated
    try {
      accessToken.value = await getAccessTokenSilently()
      console.log('Access Token Fetched:', accessToken.value) // Debug log
    } catch (error) {
      console.error('Failed to fetch access token', error)
    }
  }

  const fetchAccessTokenWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      await fetchAccessToken()
      if (accessToken.value) break // Stop retrying if token is retrieved
      console.warn(`Retrying access token fetch... (${i + 1}/${retries})`)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 sec before retrying
    }
  }

  // Watch for authentication state and fetch token when user is authenticated
  watch(isAuthenticated, (auth) => {
    if (auth) fetchAccessTokenWithRetry()
  }, { immediate: true }) // Run immediately if already authenticated

  return { accessToken, user, fetchAccessTokenWithRetry }
}
