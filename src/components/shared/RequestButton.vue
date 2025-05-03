<script lang="ts">
import { defineComponent, ref, emit } from 'vue';
import { useAuthToken } from '@/composables/useAuthToken';

export default defineComponent({
  name: 'RequestButton',
  props: {
    label: {
      type: String,
      default: 'Request',
    },
    url: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      default: 'get',
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const { accessToken } = useAuthToken();
    const loading = ref(true);
    const headers = ref<string[]>([]);
    const data = ref<Record<string, any>[]>([]);
    const errorMessage = ref<string | null>(null);

    const makeRequest = async () => {
      try {
        loading.value = true;
        errorMessage.value = null;
        const response = await fetch(props.url, {
          method: props.method,
          headers: {
            'Authorization': `Bearer ${accessToken.value}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(props.params),
        });

        headers.value = response.data.headers;
        data.value = response.data.data;
      } catch (error) {
        errorMessage.value = 'Failed to fetch data';
        console.error(error);
      } finally {
        loading.value = false;
        emit('requestCompleted')
      }
    };

    return {
      accessToken,
      makeRequest
    };
  },
});
</script>

<template>
  <button @click="makeRequest" v-if="accessToken">{{ label }}</button>
</template>
