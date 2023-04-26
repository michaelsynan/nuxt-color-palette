<template>
  <div class="text-white bg-stone-800 p-2.5 rounded m-4 flex items-end space-x-4">
    <button @click="generateColorsAndSave" class="py-2 px-4 bg-purple-800 hover:bg-purple-900 text-white font-semibold rounded shadow">Generate Colors</button>
    <div>
      <label for="numBaseColors" class="block mb-1 text-sm text-stone-400">Number of Base Colors:</label>
      <select v-model="numBaseColors" id="numBaseColors" class="w-full bg-gray-700 rounded p-2 shadow">
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
    <div>
      <label for="numShades" class="block mb-1 text-sm text-stone-400">Number of Shades:</label>
      <select v-model="numShades" id="numShades" class="w-full bg-gray-700 rounded p-2 shadow">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
    <div>
      <label for="colorScheme" class="block mb-1 text-sm text-stone-400">Color Scheme:</label>
      <select v-model="colorScheme" id="colorScheme" class="w-full bg-gray-700 rounded p-2 shadow">
        <option value="triadic">Triadic</option>
        <option value="complementary">Complementary</option>
        <option value="splitComplementary">Split Complementary</option>
        <option value="analogous">Analogous</option>
        <option value="square">Square</option>
        <option value="tetradic">Tetradic</option>
      </select>
    </div>
    <div>
      <label for="initialColor" class="block mb-1 text-sm text-stone-400">Initial Color:</label>
      <input v-model="userSelectedInitialColor" id="initialColor" type="color" class="w-full bg-gray-700 rounded p-2 shadow">
    </div>
    <div>
      <input v-model="useSelectedInitialColor" id="useSelectedInitialColor" type="checkbox" class="w-full bg-gray-700 rounded p-2 shadow">
      <label for="useSelectedInitialColor" class="ml-2 text-sm text-stone-400">Use selected initial color</label>
    </div>
  </div>
</template>
<script setup>
import { ref, defineEmits, onMounted, watchEffect } from 'vue';
import chroma from 'chroma-js';
import { generateColors, generateBaseColors } from '@/config/generateColors.js';

const numBaseColors = ref(3);
const numShades = ref(1);
const colorScheme = ref('triadic');
const emit = defineEmits(['color-scheme-generated']);
const useSelectedInitialColor = ref(false);
const userSelectedInitialColor = ref('#000000');

/* Generate random initial color */
function randomHexColor() {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + hex.padStart(6, '0');
}

const initialColor = ref(randomHexColor());

const firstColor = ref(initialColor.value);

watchEffect(() => {
  if (!useSelectedInitialColor.value) {
    firstColor.value = initialColor.value;
  } else {
    firstColor.value = userSelectedInitialColor.value;
  }
});

async function generateColorsAndSave() {
  if (!useSelectedInitialColor.value) {
    initialColor.value = randomHexColor();
  }
  const initialColorValue = firstColor.value;
  const initialColorObject = chroma(initialColorValue);
  console.log('Initial Color:', initialColorValue);

  const baseColors = generateBaseColors(colorScheme.value, numBaseColors.value, firstColor.value);
  const orderedOutput = await generateColors(
    numBaseColors.value,
    numShades.value,
    colorScheme.value,
    baseColors
  );

  const colorSchemeJson = orderedOutput;
  console.log('Color scheme JSON:', colorSchemeJson);
  emit('color-scheme-generated', colorSchemeJson);
}



onMounted(() => {
  generateColorsAndSave();
});

</script>