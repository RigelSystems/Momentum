<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'

export default defineComponent({
  name: 'Avatar',
  props: {
    initials: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
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
      console.log('cliecked')
    }

    return { logout, user, logoutAndClearState, clearState }
  },
})
</script>

<template>
  <div class="me-5">
    <v-row justify="center">
      <v-menu min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="brown" size="large">
              <span class="text-h5">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="brown">
                <span class="text-h5">{{ initials }}</span>
              </v-avatar>
              <h3>{{ fullName }}</h3>
              <p class="text-caption mt-1">
                {{ email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" rounded @click="logoutAndClearState"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-row>
  </div>
</template>
