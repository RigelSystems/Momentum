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
        window.location.href = '/daily-discipline/dashboard'
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
  <main>
    <v-btn @click="loginWithRedirect" color="primary">Log In</v-btn>
  </main>
</template>
