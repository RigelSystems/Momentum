import { defineStore } from 'pinia'

export const useAccessTokenStore = defineStore('accessToken', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
  }),
  getters: {
    isPasswordSet(state): boolean {
      return !!state.accessToken
    },
  },
  actions: {
    setAccessToken(accessToken: string): void {
      this.accessToken = accessToken
      localStorage.setItem('accessToken', accessToken)
    },
    clearState(): void {
      this.accessToken = null
      localStorage.removeItem('accessToken')
    },
  },
})
