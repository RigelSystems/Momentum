<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import Drawing from '@/components/Drawing.vue'
import { useAuth0 } from '@auth0/auth0-vue'

export default defineComponent({
  name: 'DashboardView',
  components: {
    PageHeader,
    Drawing,
  },
  setup() {
    const { getAccessTokenSilently, user } = useAuth0()
    const accessToken = ref<string | undefined>(undefined)

    const getAccessToken = async () => {
      accessToken.value = await getAccessTokenSilently();
    };

    onMounted(async () => {
      await getAccessToken()
    })

    return {
      accessToken
    }
  }
})
</script>

<template>
  <div class="page-header">
    <PageHeader title="Dashboard" />
  </div>

  <div class="page-content">
    <Drawing :accessToken="accessToken"/>
  </div>
</template>
