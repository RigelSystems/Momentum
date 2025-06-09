<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import SelectIcon from './inputs/SelectIcon.vue'
import HabitEntryChecklist from './habit_entries/HabitEntryChecklist.vue'

export default defineComponent({
  name: 'HabitEntry',
  props: {
    accessToken: {
      type: String,
      required: false,
    },
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
    loading: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    SelectIcon,
    HabitEntryChecklist,
  },
  setup(props, { emit }) {
    let loading = false;
    let value = ref(props.entry?.value || 0);

    const habitValueForNumericalOrCurrency = computed(() => {
      if (props.habit.habit_type === 'Numerical') {
        return value.value || '-';
      } else if (props.habit.habit_type === 'Currency') {
        return `£${value.value || '-'}`;
      }
    });

    const habitEntryStyle = computed(() => {
      let fontSize = null;
      let stringValue = props.entry?.value?.toString()?.length || 0;
      if (props.habit.habit_type === 'Currency') {stringValue += 1}
      const backgroundColor = !value.value ? null : `${props.colour} !important`

      if (stringValue === 1) {
        fontSize = '18px';
      } else if (stringValue === 2) {
        fontSize = '16px';
      } else if (stringValue === 3) {
        fontSize = '10px';
      } else if (stringValue === 4) {
        fontSize = '8px';
      } else if (stringValue >= 5) {
        fontSize = '5px';
      }

      return {
        fontSize: fontSize,
        backgroundColor: backgroundColor,
      };
    });

    const updateExistingRecord = async (new_value: String) => {
      loading = true;
      const apiUrl = `${import.meta.env.VITE_API_URL}habit_entries/${props.entry.id}`
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.accessToken}`,
        },
        body: JSON.stringify({
          value: new_value,
        }),
      });

      return response;
    };

    const createNewRecord = async (new_value: String) => {
      loading = true;
      const apiUrl = `${import.meta.env.VITE_API_URL}habit_entries`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.accessToken}`,
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
        // props.fetchHabits()
        console.log('updated entry', responseBody)
        emit('updated')
      } else {
        loading = false;
        const responseBody = await response.json()
        console.error(responseBody)
      }
    };

    let holdTimer: ReturnType<typeof setTimeout>;
    const modalIsActive = ref(false);
    const startHold = () => {
      holdTimer = setTimeout(() => {
        modalIsActive.value = true;
      }, 500);
    }
    const endHold = () => {
      clearTimeout(holdTimer);
    }

    const updateRecordIcon = (icon: string) => {
      if (icon) {
        updateEntry(icon)
      }
    }

    const checklistUrl = `${import.meta.env.VITE_API_URL}checklists`

    return {
      entry: props.entry,
      updateEntry,
      loading,
      value,
      startHold,
      endHold,
      modalIsActive,
      updateRecordIcon,
      checklistUrl,
      habitEntryStyle,
      habitValueForNumericalOrCurrency
    };
  },
});
</script>

<template>
  <div v-if="loading">Loading...</div>

  <div v-if="habit.habit_type === 'Yes or No'">
    <button v-if="value === '1'" @click="updateEntry(`0`)" class="habit-entry habit-entry--check" :style="{ backgroundColor: colour }">
    </button>
    <button v-else @click="updateEntry(`1`)" class="habit-entry habit-entry--close">
    </button>
  </div>

  <div v-if="habit.habit_type === 'Numerical' || habit.habit_type === 'Currency'">
    <v-dialog max-width="500" v-model="modalIsActive" persistent>
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          @click="updateEntry((parseInt(value) + 1).toString())"
          @mousedown="startHold"
          @mouseup="endHold"
          @touchstart="startHold"
          @touchend="endHold"
          color="surface-variant"
          :text="habitValueForNumericalOrCurrency"
          variant="flat"
          class="habit-entry habit-entry--number"
          :style="habitEntryStyle"
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

  <div v-if="habit.habit_type === 'Icon'">
    <v-dialog max-width="500" v-model="modalIsActive" persistent>
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          @touchstart="startHold"
          @touchend="endHold"
          color="surface-variant"
          variant="flat"
          :class="`habit-entry habit-entry--number mdi mdi-${value}`"
          :style="(value == '0' || value === null) ? null : { backgroundColor: `${colour} !important` }"
        ></v-btn>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card :title="`${habit.name}: ${date}`">
          <v-card-text>
            <SelectIcon v-model="value.value" @update="updateRecordIcon"/>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Update Entry"
              @click="isActive.value = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>

  <div v-if="habit.habit_type === 'Checklist'">
    <HabitEntryChecklist :colour="colour" :date="date" :value="value"></HabitEntryChecklist>
  </div>
</template>
