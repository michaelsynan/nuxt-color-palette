<template>
  <div class="text-white bg-gray-800 p-4 rounded-lg flex items-end space-x-4">
    <button @click="generateColorsAndSave" class="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg">Generate Colors</button>
    <div>
      <label for="numBaseColors" class="block mb-1">Number of Base Colors:</label>
      <select v-model="numBaseColors" id="numBaseColors" class="w-full bg-gray-700 rounded p-2">
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
    <div>
      <label for="numShades" class="block mb-1">Number of Shades:</label>
      <select v-model="numShades" id="numShades" class="w-full bg-gray-700 rounded p-2">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </div>
    <div>
      <label for="colorScheme" class="block mb-1">Color Scheme:</label>
      <select v-model="colorScheme" id="colorScheme" class="w-full bg-gray-700 rounded p-2">
        <option value="triadic">Triadic</option>
        <option value="complementary">Complementary</option>
        <option value="splitComplementary">Split Complementary</option>
        <option value="analogous">Analogous</option>
        <option value="square">Square</option>
        <option value="tetradic">Tetradic</option>
      </select>
    </div>
  </div>
</template> 


<script setup>
import { ref, defineEmits } from 'vue';
import { generateColors } from '@/config/generateColors.js';

const numBaseColors = ref(3);
const numShades = ref(1);
const colorScheme = ref('triadic');

const emit = defineEmits(['color-scheme-generated']);

async function generateColorsAndSave() {
  const orderedOutput = await generateColors(
    numBaseColors.value,
    numShades.value,
    colorScheme.value
  );
  const colorSchemeJson = orderedOutput;
  console.log('Color scheme JSON:', colorSchemeJson);
  emit('color-scheme-generated', colorSchemeJson);
}
</script>
