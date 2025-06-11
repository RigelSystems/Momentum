<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthToken } from '@/composables/useAuthToken'

export default defineComponent({
  name: 'DeleteCell',
  props: {
    checklistItemId: {
      type: Number,
      required: true,
    },
    cellId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { accessToken } = useAuthToken()

    const deleteCell = () => {
      const delete_url = `${import.meta.env.VITE_API_URL}/checklist_items/${props.checklistItemId}/checklist_item_cells/${props.cellId}`
      fetch(delete_url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
        },
      }).then(() => {
        emit('delete')
      })
    }

    return {
      deleteCell,
    }
  },
});
</script>

<template>
  <span class="mdi mdi-trash-can-outline clickable" @click="deleteCell"></span>
</template>

<style scoped>
.mdi {
  color: #000000 !important;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background-color: #f0f0f0;
  border: solid 1px #f0f0f0;
}
</style>
