<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'

export default defineComponent({
  name: 'Avatar',
  setup() {
    const { logout, user } = useAuth0()

    const accessTokenStore = useAccessTokenStore()

    const logoutAndClearState = async () => {
      // Clear local Pinia state
      accessTokenStore.$reset()
      accessTokenStore.clearState()

      // Clear browser's localStorage or cookies if used
      localStorage.clear()
      sessionStorage.clear()

      // Perform Auth0 logout
      await logout()
    }

    const clearState = () => {
      accessTokenStore.clearState()
    }

    return {
      logout,
      user,
      logoutAndClearState,
      clearState
    }
  },
})
</script>

<template>
  <v-menu
    rounded
  >
    <template v-slot:activator="{ props }">
      <v-btn
        icon
        v-bind="props"
      >
        <v-avatar
          color="brown"
          size="large"
        >
        <v-img
              :src="user?.picture"
              alt="User avatar"
            />
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <div class="mx-auto text-center">
          <h3>{{ user?.given_name }} {{ user?.family_name }}</h3>
          <p class="text-caption mt-1">
            {{ user?.email }}
          </p>
          <v-divider class="my-3"></v-divider>
          <v-btn
            variant="text"
            rounded
            @click="logoutAndClearState"
          >
            Logout
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
