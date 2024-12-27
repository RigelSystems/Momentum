<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAccessTokenStore } from '@/stores/accessTokenStore';

export default defineComponent({
  name: 'HabitEntry',
  props: {
    entry: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    let loading = false;
    let value = ref(props.entry.value);

    const toggleEntry = async () => {
      loading = true;
      const accessTokenStore = useAccessTokenStore()
      const apiUrl = `${import.meta.env.VITE_API_URL}habit_entries/${props.entry.id}`
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessTokenStore.accessToken}`,
        },
        body: JSON.stringify({
          value: value.value === 0 ? 1 : 0,
        }),
      });

      if (response.ok) {
        loading = false;
        const responseBody = await response.json()
        value.value = responseBody.value
      } else {
        loading = false;
        const responseBody = await response.json()
        console.error(responseBody)
      }
    };

    return {
      entry: props.entry,
      toggleEntry,
      loading,
      value
    };
  },
});
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <p>{{ entry.date }}</p>
    <p>{{ value }}</p>
    <button @click="toggleEntry">Toggle</button>
  </div>
</template>
