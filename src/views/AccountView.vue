<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import Friends from '@/components/friends/Friends.vue'
import FriendForm from '@/components/friends/FriendForm.vue'
import User from '@/components/User.vue'

export default defineComponent({
  name: 'AccountView',
  components: {
    PageHeader,
    Friends,
    FriendForm,
    User,
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
<p class="p-1">Welcome {{ user?.name }}</p>

  <n-tabs>
    <template #tabs="{ activeTab, setActiveTab }">
      <n-tab
        label="Friends"
        :active="activeTab === 0"
        @click="setActiveTab(0)"
      />
      <n-tab
        label="Settings"
        :active="activeTab === 1"
        @click="setActiveTab(1)"
      />
    </template>

    <template #default="{ activeTab }">
      <n-tab-panel :index="0" :activeTab="activeTab">
        <!-- Friends -->
        <Friends v-if="accessToken" :accessToken="accessToken"/>
      </n-tab-panel>
      <n-tab-panel :index="1" :activeTab="activeTab">
        <!-- Settings -->
        <NRow :cols="{sm: [100], md: [100], lg: [100]}">
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
        </NRow>
      </n-tab-panel>
    </template>
  </n-tabs>
</template>
