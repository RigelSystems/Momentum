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

    const updateExistingRecord = async (new_value: String) => {
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

    const createNewRecord = async (new_value: String) => {
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

    const updateEntry = async (new_value: String) => {
      loading = true;
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

    let holdTimer;
    const modalIsActive = ref(false);
    const startHold = () => {
      holdTimer = setTimeout(() => {
        modalIsActive.value = true;
      }, 1000);
    }
    const endHold = () => {
      clearTimeout(holdTimer);
    }

    return {
      entry: props.entry,
      updateEntry,
      loading,
      value,
      startHold,
      endHold,
      modalIsActive
    };
  },
});
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-if="habit.habit_type === 'Yes or No'">
    <button v-if="value === 1" @click="updateEntry(`0`)" class="habit-entry habit-entry--check" :style="{ backgroundColor: colour }">
    </button>
    <button v-else @click="updateEntry(`1`)" class="habit-entry habit-entry--close">
    </button>
  </div>
  <div v-if="habit.habit_type === 'Numerical'">
    <v-dialog max-width="500" v-model="modalIsActive" persistent>
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          @click="updateEntry(value + 1)"
          @mousedown="startHold"
          @mouseup="endHold"
          color="surface-variant"
          :text="value || 0"
          variant="flat"
          class="habit-entry habit-entry--number"
        ></v-btn>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card :title="`${habit.name}: ${date}`">
          <v-card-text>
            <v-text-field
              v-model="value"
              label="Value"
              type="number"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Update Entry"
              @click="isActive.value = false; updateEntry(value)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>
