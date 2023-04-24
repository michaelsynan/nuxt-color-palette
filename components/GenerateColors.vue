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
      <input v-model="initialColor" id="initialColor" type="color" class="w-full bg-gray-700 rounded p-2 shadow">
    </div>
  </div>
</template>
<script setup>
import { ref, defineEmits } from 'vue';
import chroma from 'chroma-js';
import { generateColors } from '@/config/generateColors.js';

const numBaseColors = ref(3);
const numShades = ref(1);
const colorScheme = ref('triadic');
const initialColor = ref('#FFFFFF');

const emit = defineEmits(['color-scheme-generated']);

async function generateColorsAndSave() {
  const initialColorValue = initialColor.value;
  const initialColorObject = chroma(initialColorValue);
  console.log('Initial Color:', initialColorValue);

  function getBaseColors() {
    const color = initialColorObject;
    switch (colorScheme.value) {
      case 'triadic':
        return [color, chroma(color).set('hsl.h', '+120'), chroma(color).set('hsl.h', '-120')];
      case 'complementary':
        return [color, chroma(color).set('hsl.h', '+180')];
      case 'splitComplementary':
        return [color, chroma(color).set('hsl.h', '+150'), chroma(color).set('hsl.h', '-150')];
      case 'analogous':
        return [chroma(color).set('hsl.h', '-30'), color, chroma(color).set('hsl.h', '+30')];
      case 'square':
        return [color, chroma(color).set('hsl.h', '+90'), chroma(color).set('hsl.h', '+180'), chroma(color).set('hsl.h', '+270')];
      case 'tetradic':
        return [color, chroma(color).set('hsl.h', '+60'), chroma(color).set('hsl.h', '+180'), chroma(color).set('hsl.h', '+240')];
      default:
        return [color];
    }
  }

  const baseColors = getBaseColors();
  console.log('Base Colors:', baseColors);

  const orderedOutput = await generateColors(
    numBaseColors.value,
    numShades.value,
    colorScheme.value,
    baseColors
  );

  const colorSchemeJson = orderedOutput;
  console.log('Color scheme JSON:', colorSchemeJson);
  emit('color-scheme-generated', colorSchemeJson);
};

</script>
