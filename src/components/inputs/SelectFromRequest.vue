<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useAccessTokenStore } from '@/stores/accessTokenStore'

export default defineComponent({
  name: 'SelectFromRequest',
  props: {
    path: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const items = ref<string[]>([])
    const selected = ref(props.modelValue)
    const loading = ref<boolean>(true)
    const errorMessage = ref<string | null>(null)

    const MAX_RETRIES = 3
    let retries = 0

    const fetchItems = async () => {
      loading.value = true
      errorMessage.value = null

      try {
        const accessTokenStore = useAccessTokenStore()
        const apiUrl = `${import.meta.env.VITE_API_URL}${props.path}`
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessTokenStore.accessToken}`,
          },
        })

        if (!response.ok) {
          // If it's a 500 error and we haven't exceeded retries, retry after a delay
          if (response.status === 500 && retries < MAX_RETRIES) {
            retries++
            setTimeout(fetchItems, 500) // Retry after 2 seconds
            return
          }

          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        let mappedData = [];
        if (props.key) {
          mappedData = data.forEach((item: any) => {
            item['id'] = item[props.key]
          })
        } else {
          mappedData = data
        }


        items.value = mappedData
      } catch (error: any) {
        errorMessage.value = error instanceof Error ? error.message : String(error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchItems()
    })

    const handleChange = (value: string) => {
      selected.value = value
      emit('update:modelValue', selected.value)
    }

    watch(
      () => props.modelValue,
      (newValue) => {
        selected.value = newValue
      },
    )

    return {
      items,
      selected,
      handleChange,
      loading,
      errorMessage,
    }
  },
})
</script>

<template>
  <v-autocomplete
    v-model="selected"
    :label="$props.label"
    :items="items"
    item-title="name"
    item-value="id"
    @update:modelValue="handleChange"
    :loading="loading"
    :error-messages="errorMessage"
    :name="$props.name"
    outlined
    dense
    :multiple="$props.multiple"
    searchable
    clearable
  ></v-autocomplete>
</template>
