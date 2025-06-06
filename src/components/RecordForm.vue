<!-- RecordForm.vue -->
<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import NModal   from '@rigelsystems/novaui/src/stories/NModal/NModal.vue';
import NButton  from '@rigelsystems/novaui/src/stories/NButton/NButton.vue';

export default defineComponent({
  name: 'RecordForm',

  props: {
    record:   { type: Object,  default: () => ({}) },   // empty ⇒ "new" record
    endpoint: { type: String,  required: true },
    method:   { type: String,  default: 'POST' },
    dontReloadOnDelete: { type: Boolean, default: false },
  },

  setup(props, { emit }) {
    /* ------------------------------------------------------------------
     * state
     * ------------------------------------------------------------------ */
    const show         = ref(false);                      // bound to <NModal v-model>
    const localRecord  = ref({ ...props.record });
    const errorMessage = ref<string | null>(null);

    const { getAccessTokenSilently } = useAuth0();
    const accessToken = ref<string | null>(null);

    const modalTitle  = computed(() =>
      Object.keys(props.record ?? {}).length
        ? 'Edit Record'
        : 'Add Record'
    );

    /* ------------------------------------------------------------------
     * re-sync local copy whenever the parent sends a new record
     * ------------------------------------------------------------------ */
    watch(
      () => props.record,
      newRec => { localRecord.value = { ...newRec }; },
      { deep: true, immediate: true },
    );

    /* ------------------------------------------------------------------
     * helpers
     * ------------------------------------------------------------------ */
    const openDialog  = () => { show.value = true;  };
    const closeDialog = () => { show.value = false; };

    const saveRecord = async () => {
      errorMessage.value = null;

      const res = await fetch(props.endpoint, {
        method:  props.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${accessToken.value}`,
        },
        body: JSON.stringify(localRecord.value),
      });

      if (!res.ok) {
        errorMessage.value = await res.json();
      } else {
        closeDialog();
        emit('save', localRecord.value);
      }
    };

    const deleteRecord = async () => {
      errorMessage.value = null;

      const res = await fetch(props.endpoint, {
        method:  'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${accessToken.value}`,
        },
        body: JSON.stringify(localRecord.value),
      });

      if (!res.ok) {
        errorMessage.value = await res.json();
      } else {
        emit('delete');
        if (!props.dontReloadOnDelete) {
          window.location.reload();
        }
      }
    };

    const fetchToken = async () => {
      accessToken.value = await getAccessTokenSilently();
    };

    onMounted(fetchToken);

    return {
      /* template bindings */
      show,
      localRecord,
      modalTitle,
      errorMessage,

      /* public helpers */
      openDialog,
      saveRecord,
      deleteRecord,
      closeDialog,
    };
  },
});
</script>

<template>
  <NModal v-model="show" :title="modalTitle">
    <template #trigger="{ openModal }">
      <slot name="trigger" :openDialog="openModal">
        <NButton label="Add Record" class="n-modal__trigger" @click="openModal" />
      </slot>
    </template>

    <template #header>
      <slot name="title">
        <h2 class="n-modal__title">{{ modalTitle }}</h2>
      </slot>
    </template>

    <slot name="form" :record="localRecord">No form provided</slot>
    <p v-if="errorMessage" class="error text-center">{{ errorMessage }}</p>

    <template #footer>
      <slot name="actions">
        <NButton class="mr-auto" colour="danger" label="Delete" @click="deleteRecord" />
        <NButton class="mx-2" colour="secondary" label="Cancel" @click="closeDialog" />
        <NButton label="Save" @click="saveRecord"/>
      </slot>
    </template>
  </NModal>
</template>
