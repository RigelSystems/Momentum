<script lang="ts">
import { defineComponent, watchEffect } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const { user, loginWithRedirect, isAuthenticated } = useAuth0()

    // Reactively watch for `user` changes
    watchEffect(() => {
      if (isAuthenticated.value && user?.value?.email) {
        // window.location.href = '/#/dashboard'
      }
    })

    return {
      loginWithRedirect,
      user
    }
  },
})
</script>

<template>
  <NHeroSection
    :actionButtons="[{
      label: 'Log in / Sign up',
      primary: true,
      onClick: () => {
        loginWithRedirect()
      }
    }]"
    content="Sign up or log in to access your personalized dashboard."
    subtitle="Helping you stay organized and productive"
    title="Momentum"
  />
</template>
