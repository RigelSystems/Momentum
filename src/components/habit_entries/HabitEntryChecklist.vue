<script lang="ts">
import { defineComponent, ref, computed, watch, toRefs } from 'vue';
import { useAuthToken } from '@/composables/useAuthToken';
import ChecklistItemWeightedExercise from '../workouts/ChecklistItemWeightedExercise.vue';
import ChecklistItemTask from '../checklist_items/ChecklistItemTask.vue';

export interface ChecklistItem {
  id: number;
  checklist_item_type_classify: string;
  sets?: number;
  reps?: number;
  weight?: number;
}

export interface HabitEntry {
  id?: number;
  name: string;
  checklist_items: ChecklistItem[];
}

export default defineComponent({
  name: 'HabitEntryChecklist',
  components: {
    ChecklistItemWeightedExercise,
    ChecklistItemTask,
  },
  props: {
    colour: { type: String, required: true },
    date:   { type: String, required: true },
    value:  { type: Number, required: false },
  },
  setup(props) {
    const { colour, value } = toRefs(props);
    const { accessToken } = useAuthToken();

    /* UI state */
    const show             = ref(false);
    const checklistId      = ref<number | null>(null);
    const checklist        = ref<HabitEntry | null>(null);
    const checklistStarted = ref(false);
    const currentItemIdx   = ref(0);
    const currentSetIdx    = ref(1);

    /* Derived */
    const styles = computed(() => ({
      backgroundColor: value.value ? colour.value : '#f0f0f0',
    }));

    const currentItem = computed(() =>
      checklist.value?.checklist_items[currentItemIdx.value] ?? null,
    );

    /* Remote data */
    const checklistUrl = `${import.meta.env.VITE_API_URL}/checklists`;

    const fetchChecklist = async (id: number) => {
      try {
        const res = await fetch(`${checklistUrl}/${id}`, {
          headers: { Authorization: `Bearer ${accessToken.value}` },
        });

        if (!res.ok) throw new Error(`Checklist fetch failed: ${res.status}`);

        checklist.value = await res.json();
      } catch (err) {
        /* eslint-disable no-console */
        console.error(err);
      }
    };

    watch(checklistId, (id) => id && fetchChecklist(id));

    /* Actions */
    const openDialog     = () => (show.value = true);
    const closeDialog    = () => (show.value = false);
    const startChecklist = () => (checklistStarted.value = true);

    const nextAction = () => {
      const item = currentItem.value;
      if (!item) return;

      if (item.sets && currentSetIdx.value < item.sets) {
        currentSetIdx.value++;
      } else {
        currentItemIdx.value++;
        currentSetIdx.value = 1;
      }
    };

    return {
      /* state */
      show,
      checklistId,
      checklist,
      checklistStarted,
      currentItemIdx,
      currentSetIdx,

      /* derived */
      styles,
      currentItem,
      checklistUrl,

      /* actions */
      openDialog,
      closeDialog,
      startChecklist,
      nextAction,

      /* external */
      accessToken,
    };
  },
});
</script>

<template>
  <NModal v-model:show="show">
    <template #trigger="{ openModal }">
      <slot name="trigger" :openDialog="openModal">
        <NButton class="habit-entry" :style="styles" @click="openModal" />
      </slot>
    </template>

    <template #header>
      <slot name="title">
        <h2 class="n-modal__title">Checklist - {{ date }}</h2>
      </slot>
    </template>

    <!-- Checklist selector -->
    <NSelectInputFromRequest
      v-if="!checklistStarted"
      :url="checklistUrl"
      valueKey="id"
      name="role"
      label="Select Checklist"
      v-model="checklistId"
      :accessToken="accessToken"
    />

    <!-- Checklist preview -->
    <div class="standard-container-1" v-if="!checklistStarted">
      <template v-for="item in checklist?.checklist_items" :key="item.id">
        <component
          :is="`ChecklistItem${item.checklist_item_type_classify}`"
          :checklistItem="item"
        />
      </template>
    </div>

    <!-- Active checklist -->
    <div v-if="checklistStarted">
      <p class="text-center">
        You have started the checklist. Please complete the items in your checklist.
      </p>

      <NCircleProgress
        :current="currentItemIdx + 1"
        :total="checklist?.checklist_items.length"
        :fontSize="35"
        :size="40"
        :strokeWidth="11"
        progressColor="#88bdb9"
      />

      <component
        :is="`ChecklistItem${currentItem?.checklist_item_type_classify}`"
        :checklistItem="currentItem"
      />

      <div v-for="set in currentItem?.sets" :key="set">
        <p :style="{ border: set === currentSetIdx ? '1px solid grey' : '' }">
          <strong>Set {{ set }}:</strong>
          {{ currentItem?.reps }} reps at {{ currentItem?.weight }} kg
        </p>
      </div>
    </div>

    <template #footer>
      <slot name="actions">
        <NButton v-if="checklistStarted" label="Back" @click="currentItemIdx--" />
        <NButton class="mx-2" colour="secondary" label="Cancel" @click="closeDialog" />
        <NButton
          v-if="checklistId && checklist?.checklist_items && !checklistStarted"
          label="Start"
          @click="startChecklist"
        />
        <NButton v-if="checklistStarted" label="Next" @click="nextAction" />
      </slot>
    </template>
  </NModal>
</template>
