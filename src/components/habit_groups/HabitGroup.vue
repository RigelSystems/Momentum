<script lang="ts">
import { defineComponent } from 'vue';
import HabitGroupForm from '@/components/habit_groups/HabitGroupForm.vue'
import './HabitGroup.css'

export interface HabitGroup {
  id?: number,
  name: string,
  icon: string,
}

export default defineComponent({
  name: 'HabitGroup',
  props: {
    habitGroup: {
      type: Object as () => HabitGroup,
      required: true,
    },
  },
  components: {
    HabitGroupForm,
  },
});
</script>

<template>
  <div class="table-group-name habit-group">
    <div class="habit-group__name-wrapper">
      <h3>{{ habitGroup.name }}</h3>
      <v-icon class="mr-2" size="x-small">mdi-{{ habitGroup.icon }}</v-icon>
    </div>

    <HabitGroupForm :habitGroup="habitGroup">
      <template #trigger="{ openDialog }">
        <v-btn
          density="default"
          icon="mdi-dots-vertical"
          @click="openDialog"
          size="medium"
          class="mr-2 kabab-menu"
        ></v-btn>
      </template>
    </HabitGroupForm>
  </div>
</template>
