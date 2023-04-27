<template>
  <div class="text-white p-2 rounded m-4 flex flex-col items-center space-y-2 my-8 fixed w-full z-50">
    <button @click="generateColorsAndSave" class="py-3 px-6 bg-purple-800 hover:bg-purple-900 rounded shadow text-xl">Generate</button>
    <button @click="toggleAdvancedOptions" class="p-1.5 rounded-full bg-purple-400 hover:bg-purple-900 shadow text-sm animate-pluse">
      <i-mdi-arrow-down v-if="!showAdvancedOptions" />
      <i-mdi-arrow-up v-if="showAdvancedOptions" />
    </button>
    <transition name="slide">
      <div v-if="showAdvancedOptions" class="mt-2 flex flex-cols space-x-4 bg-stone-950 p-4 rounded-lg">
     
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
      <div class="space-x-4 w-10 align-middle select-none transition duration-200 ease-in mb-4">
    <label for="toggle" class="block mb-2 text-sm text-stone-400">Toggle Shades:</label>
    <div>
      <input
        type="checkbox"
        @click="toggleShades"
        name="toggle"
        id="toggle"
        class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
      />
      <label
        for="toggle"
        class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ease-in-out"
      ></label>
    </div>
  </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}


.toggle-checkbox:checked {
  @apply transform translate-x-full border-purple-400;
}

.toggle-checkbox:checked+.toggle-label {
  @apply bg-purple-800;
}


</style>

<script setup>
import { ref, defineEmits, onMounted, watchEffect } from 'vue';
import chroma from 'chroma-js';
import { generateColors, generateBaseColors } from '@/config/generateColors.js';

const numBaseColors = ref(3);
const numShades = ref(1);
const colorScheme = ref('triadic');
const emit = defineEmits(['color-scheme-generated', "update:show-shades"]);
const useSelectedInitialColor = ref(false);
const userSelectedInitialColor = ref('#e01b24');
const showAdvancedOptions = ref(false);
const showShades = ref(true);


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



function toggleShades() {
  showShades.value = !showShades.value;
  emit("update:show-shades", showShades.value);
}


</script>