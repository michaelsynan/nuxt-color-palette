<template>
  <div class="text-white bg-stone-950 p-2 rounded m-4 flex flex-col items-center space-y-4">
        <button @click="generateColorsAndSave" class="py-2 px-3 bg-purple-800 hover:bg-purple-900 rounded shadow text-sm">Generate</button>
    <button @click="toggleAdvancedOptions" class="p-1.5 rounded-full bg-purple-800 hover:bg-purple-900 rounded shadow text-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-auto" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 12a2 2 0 110-4 2 2 0 010 4zm-7-2a7 7 0 1114 0 7 7 0 01-14 0z" clip-rule="evenodd" />
        <path d="M9 11h2v3H9z" />
      </svg>
    </button>
    <div v-if="showAdvancedOptions" class="mt-2 flex flex-cols space-x-4">
            <div class="flex flex-wrap justify-center flex-cols">
        <label for="numBaseColors" class="block mb-1">Base Colors:</label>
        <select v-model="numBaseColors" id="numBaseColors" class="w-full  bg-gray-700 rounded p-2 shadow">
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div class="flex flex-wrap justify-center flex-cols">
        <label for="numShades" class="block mb-1">Shades:</label>
        <select v-model="numShades" id="numShades" class="w-full bg-gray-700 rounded p-2 shadow">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div class="flex flex-wrap justify-center flex-cols">
        <label for="colorScheme" class="block mb-1">Color Scheme:</label>
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
        <label for="initialColor" class="block mb-1">Initial Color:</label>
        <input v-model="userSelectedInitialColor" id="initialColor" type="color" class="w-full bg-gray-700 rounded p-2 shadow">
      </div>
      <div class="w-full flex flex-col justify-end">
        <div class="flex items-center">
          <input v-model="useSelectedInitialColor" id="useSelectedInitialColor" type="checkbox" class="bg-gray-700 rounded p-2 shadow">
          <label for="useSelectedInitialColor" class="ml-2">Use selected initial color</label>
        </div>
      </div>
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
const userSelectedInitialColor = ref('#e01b24');
const showAdvancedOptions = ref(false);

function toggleAdvancedOptions() {
  showAdvancedOptions.value = !showAdvancedOptions.value;
}

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
  let selectedInitialColor;

  if (useSelectedInitialColor.value) {
    selectedInitialColor = userSelectedInitialColor.value;

    // Generate a random color scheme
    const randomColorSchemeOptions = [
      'triadic',
      'complementary',
      'splitComplementary',
      'analogous',
      'square',
      'tetradic',
    ];
    colorScheme.value =
      randomColorSchemeOptions[
        Math.floor(Math.random() * randomColorSchemeOptions.length)
      ];
  } else {
    selectedInitialColor = randomHexColor();
  }

  await nextTick(); // Wait for the next DOM update cycle

  const initialColorValue = selectedInitialColor;
  const initialColorObject = chroma(initialColorValue);
  console.log('Initial Color:', initialColorValue);

  console.log('Values for generateBaseColors:',
    'colorScheme:', colorScheme.value,
    'numBaseColors:', numBaseColors.value,
    'initialColorValue:', initialColorValue
  );

  const baseColors = await generateBaseColors(
    colorScheme.value,
    numBaseColors.value,
    initialColorValue
  );

  console.log('Base colors:', baseColors)

  console.log('Values for generateColors:',
    'numBaseColors:', numBaseColors.value,
    'numShades:', numShades.value,
    'colorScheme:', colorScheme.value,
    'baseColors:', baseColors
  );

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