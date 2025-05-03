<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import Friends from '@/components/friends/Friends.vue'
import FriendForm from '@/components/friends/FriendForm.vue'

export default defineComponent({
  name: 'AccountView',
  components: {
    PageHeader,
    Friends,
    FriendForm,
  },
  setup() {
    const { getAccessTokenSilently } = useAuth0()
    const accessToken = ref<string | null>(null)
    const loading = ref(true)
    const errorMessage = ref<string | null>(null)
    const user = ref<any>(null)

    const fetchUser = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}users/me`
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      if (response.ok) {
        loading.value = false
        const responseBody = await response.json()

        user.value = responseBody

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
      fetchUser()
    })

    return {
      accessToken,
      user
    }
  }
})
</script>

<template>
  <NRow :cols="{sm: [100], md: [100], lg: [100]}" style="padding: 1rem">
    <NCard subtitle="Get notifications and ask helpful questions about your data" title="Helpful Bot">
      <template #content v-if="user?.telegram_chat_id">
        <br>
        <p>You're connected to your bot. Click the link below to chat.</p>
      </template>
      <template #content>
        <br>
        <p>Send this message to your bot to start, you'll only have to do this once.</p>
        <p><b>/start {{ user?.telegram_link_token }}</b></p>
        <a href="https://t.me/momentum_rigelsystems_bot?start=1">Connect Bot</a>
      </template>
    </NCard>


    <h2>Friends</h2>

    <FriendForm>
      <template #trigger="{ openDialog }">
        <v-btn
          density="comfortable"
          variant="tonal"
          text="Find Friend"
          class="mr-2"
          @click="openDialog"
        ></v-btn>
      </template>
    </FriendForm>

    <Friends v-if="accessToken" :accessToken="accessToken"/>
  </NRow>
</template>
