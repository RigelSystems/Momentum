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
    value: {
      type: Number,
      required: false,
    },
  },
  components: {
    ChecklistItemWeightedExercise,
    ChecklistItemTask,
  },
  setup(props) {
    const { accessToken } = useAuthToken()
    const styles = {
      backgroundColor: props.value ? props.colour : '#f0f0f0',
    };
    const show = ref(false);
    const openDialog  = () => { show.value = true;  };
    const closeDialog = () => { show.value = false; };
    const checklistId = ref<number | null>(null);
    const checklist = ref<HabitEntry | null>(null);
    const checklistSelected = ref(false);
    const currentItemCount = ref(0);
    const currentSetCount = ref(1);

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

    const startChecklist = () => {
      checklistSelected.value = true;
    }

    const nextAction = () => {
      const currentItem = checklist.value?.checklist_items[currentItemCount.value];

      if (currentItem && currentItem.sets) {
        if (currentSetCount.value < currentItem.sets) {
          currentSetCount.value++;
        } else {
          currentItemCount.value++;
          currentSetCount.value = 1;
        }
      } else {
        currentItemCount.value++;
        currentSetCount.value = 1;
      }
    };

    return {
      show,
      openDialog,
      closeDialog,
      styles,
      checklistSelected,
      accessToken,
      checklistUrl,
      checklistId,
      checklist,
      startChecklist,
      currentItemCount,
      currentSetCount,
      nextAction
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
        v-if="!checklistSelected"
        :url="checklistUrl"
        valueKey="id"
        name="role"
        label="Select Checklist"
        v-model="checklistId"
        :accessToken="accessToken"
      />

      <div class="standard-container-1" v-if="!checklistSelected">
        <div v-for="item in checklist?.checklist_items" :key="item.id">
          <component
          :is="`ChecklistItem${item.checklist_item_type_classify}`"
          :checklistItem="item"
          ></component>
        </div>
      </div>

      <div v-if="checklistSelected">
        <p class="text-center">You have started the checklist.</p>
        <p class="text-center">Please complete the items in your checklist.</p>

        <NCircleProgress
          :current="currentItemCount + 1"
          :total="checklist?.checklist_items?.length"
          :fontSize="35"
          :size="40"
          :strokeWidth="11"
          progressColor="#88bdb9"
        />

        <component
          :is="`ChecklistItem${checklist?.checklist_items[currentItemCount]?.checklist_item_type_classify}`"
          :checklistItem="checklist?.checklist_items[currentItemCount]"
          ></component>

        <div v-for="set in checklist?.checklist_items[currentItemCount]?.sets" :key="set.id">
          <p :style="[`border: ${set == currentSetCount ? 'solid grey 1px' : ''};`]">
            <strong>Set {{ set }}:</strong>
            {{ checklist?.checklist_items[currentItemCount]?.reps }} reps at {{ checklist?.checklist_items[currentItemCount]?.weight }} kg
          </p>
        </div>
      </div>

      <template #footer>
        <slot name="actions">
          <NButton label="Back" @click="currentItemCount--" v-if="checklistSelected"/>
          <NButton class="mx-2" colour="secondary" label="Cancel" @click="closeDialog" />
          <NButton label="Start" @click="startChecklist" v-if="checklistId && checklist?.checklist_items && !checklistSelected"/>
          <NButton label="Next" @click="nextAction" v-if="checklistSelected"/>
        </slot>
      </template>
  </NModal>
</template>

