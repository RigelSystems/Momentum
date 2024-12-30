<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAccessTokenStore } from '@/stores/accessTokenStore';

export default defineComponent({
  name: 'HabitEntry',
  props: {
    entry: {
      type: Object,
      required: false,
    },
    habit: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    let loading = false;
    let value = ref(props.entry?.value || 0);

    const updateExistingRecord = async () => {
      loading = true;
      const accessTokenStore = useAccessTokenStore()
      const apiUrl = `${import.meta.env.VITE_API_URL}habit_entries/${props.entry?.id}`
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessTokenStore.accessToken}`,
        },
        body: JSON.stringify({
          value: value.value,
        }),
      });

      return response;
    };

    const createNewRecord = async () => {
      loading = true;
      const accessTokenStore = useAccessTokenStore()
      const apiUrl = `${import.meta.env.VITE_API_URL}habit_entries`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessTokenStore.accessToken}`,
        },
        body: JSON.stringify({
          habit_id: props.habit.id,
          date: props.date,
          value: value.value,
        }),
      });

      return response;
    };

    const toggleEntry = async () => {
      loading = true;
      value.value = value.value === 0 ? 1 : 0;
      const response = props.entry ? await updateExistingRecord() : await createNewRecord();

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
    <button v-if="value === 1" @click="toggleEntry" class="habit-entry habit-entry--check">
    </button>
    <button v-else @click="toggleEntry" class="habit-entry habit-entry--close">
    </button>
  </div>
</template>
