import { useAuth0 } from '@auth0/auth0-vue'

export const useFeatureFlag = () => {
  const { user } = useAuth0()

  const isFeatureEnabled = (): boolean => {
    if (!user.value) return false
    return user.value.email === 'alex96ford19@gmail.com'
  }

  return {
    isFeatureEnabled
  }
} 