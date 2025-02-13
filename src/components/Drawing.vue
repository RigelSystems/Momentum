<template>
  <div class="palette">
    <!-- Display a small set of colors to choose from -->
    <div
      v-for="color in palette"
      :key="color"
      class="palette-color"
      :style="{ backgroundColor: color }"
      @click="selectedColor = color"
    />
  </div>

  <div class="pixel-canvas">
    <div
      v-for="(row, rowIndex) in pixelData"
      :key="rowIndex"
      class="pixel-row"
    >
      <div
        v-for="(color, colIndex) in row"
        :key="colIndex"
        class="pixel-cell"
        :style="{ backgroundColor: color }"
        @click="changeColor(rowIndex, colIndex)"
      />
    </div>
  </div>

  <button @click="saveIcon">
    Save Icon
  </button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// Example palette
const palette = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff'];
const selectedColor = ref<string>(palette[1]); // Default color

// 8×8 grid, each cell is white by default
const pixelData = ref<string[][]>(
  Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => palette[0])
  )
);

function changeColor(rowIndex: number, colIndex: number) {
  pixelData.value[rowIndex][colIndex] = selectedColor.value;
}

// Example save: Convert to JSON, then send to the server/DB
function saveIcon() {
  const iconJson = JSON.stringify(pixelData.value);
  // e.g., axios.post('/api/icons', { data: iconJson })
  console.log('Icon JSON:', iconJson);
}
</script>

<style scoped>
.palette {
  display: flex;
  margin-bottom: 10px;
}

.palette-color {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  cursor: pointer;
  margin-right: 5px;
}

.pixel-canvas {
  display: inline-block;
  margin-bottom: 10px;
}

.pixel-row {
  display: flex;
}

.pixel-cell {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  cursor: pointer;
}
</style>
