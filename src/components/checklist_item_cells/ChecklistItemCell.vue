<template>
  <div class="checklist-item-cell" :class="[`checklist-item-cell--${type}`]">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: string;
}>();
</script>

<style scoped>
.checklist-item-cell {
  padding: 0.5rem;
  border-radius: 4px;
  background: var(--color-background-soft);
  margin: 0.25rem 0;
}

.checklist-item-cell--title {
  font-weight: bold;
  font-size: 1.1em;
}

.checklist-item-cell--text {
  font-size: 0.9em;
}

.checklist-item-cell--rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checklist-item-cell--image {
  max-width: 100%;
  border-radius: 4px;
}

.checklist-item-cell--toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style> 