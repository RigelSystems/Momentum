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
  <NButton
          label="Logout"
          @click="logoutAndClearState"
        />
  <NDropdown>
    <template #trigger>
      <NButton icon>
        <v-avatar
          color="brown"
          size="large"
        >
          <v-img
            :src="user?.picture"
            alt="User avatar"
          />
        </v-avatar>
      </NButton>
    </template>
    <template #default>
      <div class="mx-auto text-center">
        <h3>{{ user?.given_name }} {{ user?.family_name }}</h3>
        <p class="text-caption mt-1">
          {{ user?.email }}
        </p>
        <v-divider class="my-3"></v-divider>
        <NButton
          label="Logout"
          @click="logoutAndClearState"
        />
      </div>
    </template>
  </NDropdown>
</template>
