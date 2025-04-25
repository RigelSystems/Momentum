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
    const { getAccessTokenSilently, user } = useAuth0()
    const accessToken = ref<string | null>(null)

    const getAccessToken = async () => {
      accessToken.value = await getAccessTokenSilently();
    };

    onMounted(async () => {
      await getAccessToken()
    })

    return {
      accessToken,
      user
    }
  }
})
</script>

<template>
  <div class="page-header">
    <PageHeader title="Account" />
  </div>

  <div class="page-content">
    <Friends v-if="accessToken" :accessToken="accessToken"/>
  </div>


  <div v-if="false">
    <hr>
    <br/>
    <p>To recieve notifications connect to our helpful bot.</p>
    <a href="https://t.me/momentum_rigelsystems_bot?start=1">Connect Bot</a>
    <br/>
    <hr>
  </div>


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
</template>
