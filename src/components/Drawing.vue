<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export interface Icon {
  id: number;
  pixel_data: string[][];
}

export default defineComponent({
  name: 'Drawing',
  props: {
    accessToken: {
      type: String
    },
  },
  setup(props) {
    const selectedColor = ref<string>('#000000'); // Default color
    const icons = ref<Icon[]>([]);

    // Initialize the 8×8 grid with white color by default
    const pixelData = ref<string[][]>(
      Array.from({ length: 8 }, () => Array(8).fill('#ffffff'))
    );

    // Function to change the color of a pixel
    const changeColor = (rowIndex: number, colIndex: number) => {
      pixelData.value[rowIndex][colIndex] = selectedColor.value;
    };

    // Function to save the current pixel data as JSON
    const saveIcon = () => {
      const iconJson = JSON.stringify(pixelData.value);

      const apiUrl = `${import.meta.env.VITE_API_URL}icons`;
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.accessToken}`,
        },
        body: iconJson,
      })
        .then((response) => {
          if (response.ok) {
            console.log('Icon saved successfully!');
          } else {
            console.error('Failed to save icon:', response.statusText);
          }
        })
        .catch((error) => {
          console.error('Error saving icon:', error);
        });
    };

    const getIcons = () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}icons`;
      fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched icons:', data);
          icons.value = data;
        })
        .catch((error) => {
          console.error('Error fetching icons:', error);
        });
    };

    // watch for the accessToken prop to have a value before fetching icons
    // can't just be done in onMounted because it's only called once, so we'll need to watch
    watch(() => props.accessToken, (accessToken) => {
      if (accessToken) {
        getIcons();
      }
    });

    return {
      selectedColor,
      pixelData,
      changeColor,
      saveIcon,
      icons,
    };
  }
});
</script>

<template>
  <div class="palette">
    <input type="color" v-model="selectedColor" class="color-picker" />
  </div>

  <div class="pixel-canvas">
    <div v-for="(row, rowIndex) in pixelData" :key="rowIndex" class="pixel-row">
      <div
        v-for="(color, colIndex) in row"
        :key="colIndex"
        class="pixel-cell"
        :style="{ backgroundColor: color }"
        @click="changeColor(rowIndex, colIndex)"
      />
    </div>
  </div>

  <button @click="saveIcon">Save Icon</button>

  <div>
    <h3>Icons</h3>
    <ul>
      <li v-for="icon in icons" :key="icon.id" class="pixel-icon">
        <div v-for="(row, rowIndex) in icon.pixel_data" :key="rowIndex" class="pixel-row">
          <div
            v-for="(color, colIndex) in row"
            :key="colIndex"
            class="pixel-cell"
            :style="{ backgroundColor: color }"
          >
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.palette {
  display: flex;
  margin-bottom: 10px;
}

.color-picker {
  width: 100px;
  height: 30px;
  border: none;
  cursor: pointer;
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

.pixel-icon .pixel-cell {
  width: 3px;
  height: 3px;
  border: none;
}
</style>
