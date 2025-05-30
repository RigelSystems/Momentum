<script lang="ts">
import { defineComponent, computed, ref, emit } from 'vue'
import RecordForm from '../RecordForm.vue'
import SelectFromRequest from '../inputs/SelectFromRequest.vue'

export interface Friend {
  id?: number,
  name: string,
}

export default defineComponent({
  name: 'FriendForm',
  props: {
    friend: {
      type: Object as () => Friend,
      required: false,
      default: () => ({
        name: '',
        colour: '#fff',
        icon: '',
      }),
    },
  },
  components: {
    RecordForm,
    SelectFromRequest,
  },
  setup(props, { emit }) {
    const value = ref<string[]>([])

    const isEditMode = computed(() => !!props.friend.id)

    const endpoint = computed(
      () =>
        isEditMode.value
          ? `${import.meta.env.VITE_API_URL}/friends/${props.friend.id}` // Edit endpoint
          : `${import.meta.env.VITE_API_URL}/friends`, // Add endpoint
    )
    const method = computed(() => (isEditMode.value ? 'PUT' : 'POST'))

    const handleSave = async (savedRecord: Friend) => {
      emit('requestSent',)
    }

    return {
      isEditMode,
      endpoint,
      method,
      handleSave,
      value,
    }
  },
})
</script>

<template>
  <RecordForm :record="friend" :endpoint="endpoint" :method="method" @save="handleSave">
    <template #trigger="{ openDialog }">
      <slot name="trigger" :openDialog="openDialog">
        <NButton :label="isEditMode ? 'Edit Friend' : 'Add Friend'" />
      </slot>
    </template>
    <template #title>
      <span>{{ isEditMode ? 'Edit Friend' : 'Add New Friend' }}</span>
    </template>
    <template #form="{ record }">
      <v-form>
        <SelectFromRequest
          path="users"
          key="email"
          name="email"
          v-model="record.user_two_id"
          label="Users"
        />
      </v-form>
    </template>
  </RecordForm>
</template>
