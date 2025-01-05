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
    colour: {
      type: String,
      required: true,
    },
    fetchHabits: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    let loading = false;
    let value = ref(props.entry?.value || 0);

    const updateExistingRecord = async (new_value: Number) => {
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
          value: new_value,
        }),
      });

      return response;
    };

    const createNewRecord = async (new_value: Number) => {
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
          value: new_value,
        }),
      });

      return response;
    };

    const toggleEntry = async () => {
      loading = true;
      let new_value = value.value === 0 ? 1 : 0;
      const response = props.entry ? await updateExistingRecord(new_value) : await createNewRecord(new_value);

      if (response.ok) {
        loading = false;
        const responseBody = await response.json()
        value.value = responseBody.value
        props.fetchHabits()
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
  <div v-if="habit.habit_type === 'boolean'">
    <button v-if="value === 1" @click="toggleEntry" class="habit-entry habit-entry--check" :style="{ backgroundColor: colour }">
    </button>
    <button v-else @click="toggleEntry" class="habit-entry habit-entry--close">
    </button>
  </div>
  <div v-if="habit.habit_type === 'numerical'">
    <v-dialog max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          color="surface-variant"
          :text="habit.value || 0"
          variant="flat"
          class="habit-entry habit-entry--number"
        ></v-btn>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card title="Dialog">
          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Close Dialog"
              @click="isActive.value = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>
