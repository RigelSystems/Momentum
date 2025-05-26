<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useAuthToken } from '@/composables/useAuthToken'
import ChecklistItemWeightedExercise from '../checklist_items/ChecklistItemWeightedExercise.vue';
import ChecklistItemTask from '../checklist_items/ChecklistItemTask.vue';

export interface HabitEntry {
  id?: number,
  name: string,
}

export default defineComponent({
  name: 'HabitEntryChecklist',
  props: {
    colour: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  components: {
    ChecklistItemWeightedExercise,
    ChecklistItemTask,
  },
  setup(props) {
    const { accessToken } = useAuthToken()
    const styles = {
      backgroundColor: props.colour,
    };
    const show = ref(false);
    const openDialog  = () => { show.value = true;  };
    const closeDialog = () => { show.value = false; };
    const checklistId = ref<number | null>(null);
    const checklist = ref<HabitEntry | null>(null);

    const fetchChecklist = async (id: number) => {
      console.log(`Fetching checklist with ID: ${id}`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/checklists/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch checklist');
      }
      const data = await response.json();
      console.log('Fetched checklist:', data);
      checklist.value = data;
    };

    // watch the checklistID for changes
    watch(checklistId, (newId) => {
      if (newId) {
        console.log(`Selected checklist ID: ${newId}`);
        fetchChecklist(newId)
      }
    });

    const checklistUrl = `${import.meta.env.VITE_API_URL}/checklists`;

    return {
      show,
      openDialog,
      closeDialog,
      styles,
      accessToken,
      checklistUrl,
      checklistId,
      checklist,
    };
  }
});
</script>

<template>
    <NModal v-model="show">
      <template #trigger="{ openModal }">
        <slot name="trigger" :openDialog="openModal">
          <NButton
          class="habit-entry"
          :style="styles"
          @click="openModal"
        />
        </slot>
      </template>

      <template #header>
        <slot name="title">
          <h2 class="n-modal__title">Checklist - {{ date }}</h2>
        </slot>
      </template>

      <NSelectInputFromRequest
        :url="checklistUrl"
        valueKey="id"
        name="role"
        label="Select Checklist"
        v-model="checklistId"
        :accessToken="accessToken"
      />

      <div class="standard-container-1">
        <div v-for="item in checklist?.checklist_items" :key="item.id">
          <component
          :is="`ChecklistItem${item.checklist_item_type_classify}`"
          :checklistItem="item"
          ></component>
        </div>
      </div>

      <template #footer>
        <slot name="actions">
          <NButton class="mx-2" colour="secondary" label="Cancel" @click="closeDialog" />
          <NButton label="Save" @click=""/>
        </slot>
      </template>
  </NModal>
</template>

