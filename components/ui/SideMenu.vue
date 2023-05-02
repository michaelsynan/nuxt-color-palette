<template>
  <!-- Side menu -->
  <div class="side-menu" :class="{ open: isMenuOpen }">
    <div class="bg-stone-800 text-white p-4">
      <button @click="getUserPalettes">Get palettes</button>
    </div>
    <div>
      <div class="text-8xl text-white"> TESTING</div>
      <!-- Render the palettes here -->
      <div v-for="(palette, index) in palettes" :key="index" class="palette-grid">
        <!-- Display a header for each palette -->
        <div class="palette-header">Palette {{ index + 1 }}</div>
        <div v-for="(color, colorIndex) in Object.entries(JSON.parse(palette.palette)).filter(([key]) => key.includes('-500'))" :key="colorIndex" :style="{ backgroundColor: color[1] }" class="color-swatch">
          <!-- Color swatch content -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import the necessary functions and reactive variables
import { ref } from 'vue';

// Define a reactive variable to control the visibility of the side menu
const isMenuOpen = ref(false);

// Define the method to toggle the side menu
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

// Your other script setup code here
</script>

<style scoped>
.side-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: black;
  color: white;
  padding: 20px;
  overflow-y: auto;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.side-menu.open {
  transform: translateX(0);
}

.color-swatch {
  width: 50px;
  height: 50px;
  margin: 5px;
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  grid-gap: 5px;
  margin-bottom: 20px;
}

.palette-header {
  grid-column: 1 / -1;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
