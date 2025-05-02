<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'


export default defineComponent({
  name: 'DashboardView',
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
   <NRow :cols="{sm: [100], md: [50, 50], lg: [33.33,33.33,33.33]}" style="padding: 1rem">
    <NDashboardTile
      :title="'Tile 1'"
      :value="'value 1'"
      :icon="'mdi-home'"
      :bottomText="'Bottom Text 1'"
      :style="{background: '#fff', padding: '1rem', borderRadius: '8px'}"
    ></NDashboardTile>
    <NDashboardTile
      :title="'Tile 1'"
      :value="'value 1'"
      :icon="'mdi-home'"
      :bottomText="'Bottom Text 1'"
      :style="{background: '#fff', padding: '1rem', borderRadius: '8px'}"
    ></NDashboardTile>
    <NDashboardTile
      :title="'Tile 1'"
      :value="'value 1'"
      :icon="'mdi-home'"
      :bottomText="'Bottom Text 1'"
      :style="{background: '#fff', padding: '1rem', borderRadius: '8px'}"
    ></NDashboardTile>
    <NDashboardTile
      :title="'Tile 1'"
      :value="'value 1'"
      :icon="'mdi-home'"
      :bottomText="'Bottom Text 1'"
      :style="{background: '#fff', padding: '1rem', borderRadius: '8px'}"
    ></NDashboardTile>
   </NRow>
</template>
