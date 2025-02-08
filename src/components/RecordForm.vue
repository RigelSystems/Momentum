<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

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
  setup(props, { emit }) {
    const dialog = ref(false)
    const localRecord = ref({ ...props.record })
    const errorMessage = ref<string | null>(null)
    const { getAccessTokenSilently, user } = useAuth0()
    const accessToken = ref<string | null>(null)

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
          Authorization: `Bearer ${accessToken.value}`, // Include the access token
        },
        body: JSON.stringify(localRecord.value),
      })

      if (!response.ok) {
        console.log('response not ok')
        errorMessage.value = await response.json()
      } else {
        console.log('response ok')
        dialog.value = false
        emit('save', localRecord.value)
      }
    }

    const deleteRecord = async () => {
      errorMessage.value = null
      const response = await fetch(props.endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.value}`, // Include the access token
        },
        body: JSON.stringify(localRecord.value),
      })

      if (!response.ok) {
        errorMessage.value = await response.json()
      } else {
        window.location.reload()
      }
    }

    const getAccessToken = async () => {
      accessToken.value = await getAccessTokenSilently();
    };

    onMounted(async () => {
      await getAccessToken()
    })

    return {
      dialog,
      localRecord,
      openDialog,
      saveRecord,
      deleteRecord,
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
            <v-btn color="red" class="mr-auto" @click="deleteRecord">Delete</v-btn>
            <v-btn color="secondary" @click="dialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="saveRecord">Save</v-btn>
          </slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
