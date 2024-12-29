<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'

export default defineComponent({
  name: 'RecordForm',
  props: {
    record: {
      type: Object,
      default: () => ({}), // Default to an empty object for new records
    },
    endpoint: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      default: 'POST', // Default to 'POST' for creating records
    },
  },
  setup(props) {
    const dialog = ref(false)
    const localRecord = ref({ ...props.record })
    const errorMessage = ref<string | null>(null)
    const accessTokenStore = useAccessTokenStore()

    watch(
      () => props.record,
      (newRecord) => {
        localRecord.value = { ...newRecord }
      },
      { deep: true, immediate: true },
    )

    const openDialog = () => {
      dialog.value = true
    }

    const saveRecord = async () => {
      console.error(JSON.stringify(localRecord.value))
      errorMessage.value = null
      const response = await fetch(props.endpoint, {
        method: props.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessTokenStore.accessToken}`, // Include the access token
        },
        body: JSON.stringify(localRecord.value),
      })
      console.log(JSON.stringify(localRecord.value))

      if (!response.ok) {
        console.log(JSON.stringify(localRecord.value))
        errorMessage.value = await response.json()
      } else {
        console.log(JSON.stringify(localRecord.value))
        window.location.reload()
      }
    }

    return {
      dialog,
      localRecord,
      openDialog,
      saveRecord,
      errorMessage,
    }
  },
})
</script>

<template>
  <div>
    <!-- Customizable trigger button -->
    <slot name="trigger" :openDialog="openDialog">
      <v-btn color="primary" @click="openDialog">Add Record</v-btn>
    </slot>

    <!-- Dialog for the form -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <!-- Customizable title -->
        <v-card-title>
          <slot name="title">Add/Edit Record</slot>
        </v-card-title>

        <!-- Form content -->
        <v-card-text>
          <slot name="form" :record="localRecord">No form provided</slot>
        </v-card-text>

        <p v-if="errorMessage" class="error text-center">{{ errorMessage }}</p>

        <v-card-actions>
          <slot name="actions">
            <v-btn text color="secondary" @click="dialog = false">Cancel</v-btn>
            <v-btn text color="primary" @click="saveRecord">Save</v-btn>
          </slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
