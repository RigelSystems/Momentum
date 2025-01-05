<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SelectIcon',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selectedIcon = ref(props.modelValue);
    const icons = ref<Object[]>([]);

    const fetchIcons = async () => {
      const response = await fetch(
        'https://cdn.jsdelivr.net/npm/@mdi/svg@latest/meta.json'
      );
      const jsonResponse = await response.json();

      const someIconNames = jsonResponse.map((icon: any) => icon.name);
      icons.value = someIconNames;
    };
    fetchIcons();

    const handleChange = (event: Event) => {
      const target = event.target as HTMLSelectElement;
      selectedIcon.value = target.value;
      emit('update:modelValue', selectedIcon.value);
    };

    return {
      selectedIcon,
      handleChange,
      icons,
    };
  },
});
</script>

<template>
  <v-autocomplete
    class="mt-5"
    v-model="selectedIcon"
    :items="icons"
    color="blue-grey-lighten-2"
    label="Icon"
    chips
  >
    <template v-slot:chip="{ props, item }">
      <v-chip v-bind="props">
        <v-icon class="mr-2">{{ `mdi-${item.raw}` }}</v-icon>
      </v-chip>
    </template>

    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <v-list-item-avatar>
          <v-icon>{{ `mdi-${item.raw}` }}</v-icon>
        </v-list-item-avatar>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
