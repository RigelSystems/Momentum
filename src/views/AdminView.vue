<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { useAuthToken } from '@/composables/useAuthToken';
import IconForm from '@/components/icons/IconForm.vue'

export default defineComponent({
  name: 'AdminView',
  components: {
    IconForm
  },
  setup() {
    console.log('AdminView setup called');
    const { accessToken } = useAuthToken();
    const iconData = ref<any[]>([]);

    const fetchIcons = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/icons`;
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken.value}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch icons');
        }

        const icons = await response.json();
        iconData.value = icons;
      } catch (error) {
        console.error('Error fetching icons:', error);
      }
    };

    console.log('accessToken:', accessToken.value);

    watch(accessToken, (newValue) => {
      if (newValue && accessToken.value) {
        console.log('Access token changed, fetching icons...');
        fetchIcons()
      }
    }, { immediate: true })


    const submitIcon = (data: any) => {
      console.log('Submitting icon data:', data);
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}admin/icons`;
        const response = fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken.value}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to submit icon');
        }

        const responseBody = response.json();
        console.log('Icon submitted successfully:', responseBody);
      } catch (error) {
        console.error('Error submitting icon:', error);
      }
    };

    return {
      accessToken,
      submitIcon,
      iconData
    }
  },
})

</script>

<template>
  <IconForm>
    <template #trigger="{ openDialog }">
      <n-button
        @click="openDialog"
      >New Icon</n-button>
    </template>
  </IconForm>

  <div class="standard-container p-1">
    <div v-if="iconData.length > 0" v-for="icon in iconData" class="icon-display-container">
      <NPaintDisplay
        :key="icon.id"
        :pixelData="icon.pixel_data"
        :size="9"
        >
      </NPaintDisplay>
      <IconForm :icon="icon">
        <template #trigger="{ openDialog }">
          <n-button
            @click="openDialog"
          >Edit Icon</n-button>
        </template>
      </IconForm>
    </div>
  </div>
</template>
