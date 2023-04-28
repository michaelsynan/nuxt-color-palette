<template>
  <div class="text-white p-2 rounded m-4 flex flex-col items-center space-y-2 my-8 fixed w-full z-50">
    <div class="flex flex-row space-x-2">
      <button @click="generateColorsAndSave"
        class="py-2.5 px-5 bg-stone-800 hover:bg-stone-900 rounded shadow text-base font-bold group"><span
          class="group-hover:opacity-80">Generate</span></button>
      <button @click="toggleAdvancedOptions" class="py-2.5 px-2 bg-stone-800 hover:bg-stone-900 rounded shadow text-xl">
        <i-mdi-arrow-down v-if="!showAdvancedOptions" class="group-hover:opacity-80 group" />
        <i-mdi-arrow-up v-if="showAdvancedOptions" class="group-hover:opacity-80 group" />
      </button>
      <div class="group flex flex-row relative  shadow transition duration-300">
        <button
          class="z-10 flex items-center justify-center py-2.5 px-2 rounded-l rounded-r group-hover:rounded-r-none transition duration-300 bg-stone-800 hover:bg-stone-900">
          <i-mdi-floppy @click="copyPalette" class="text-xl group-hover:opacity-80" />
        </button>
        <div
          class="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto flex flex-row space-x-2 absolute left-10 bg-stone-900 bg-inherit rounded-r transition duration-300">
          <div class="py-2.5 px-2"><span>Json</span></div>
          <div class="py-2.5 px-2"><span>Tailwind</span></div>
        </div>
      </div>
    </div>
    <transition name="slide">
      <div v-if="showAdvancedOptions"
        class="mt-2 flex flex-row items-end space-x-4 bg-stone-950 bg-opacity-80 p-4 rounded-lg pr-10">

        <div class="flex flex-wrap justify-center flex-col">
          <label for="numBaseColors" class="block mb-1">Base Colors:</label>
          <select v-model="numBaseColors" id="numBaseColors" class="w-full bg-gray-700 rounded p-2 shadow">
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div class="flex flex-wrap justify-center flex-col">
          <label for="numShades" class="block mb-1">Shades:</label>
          <select v-model="numShades" id="numShades" class="w-full bg-gray-700 rounded p-2 shadow">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div class="flex flex-wrap justify-center flex-col">
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
        <div class="flex flex-wrap justify-center flex-col items-end">
          <label for="initialColor" class="block mb-1">Initial Color:</label>
          <input v-model="userSelectedInitialColor" id="initialColor" type="color" class="bg-gray-700 rounded p-2 shadow">
        </div>
        <div class="flex items-center">
          <span class="text-xs text-stone-400">Random</span>
          <div class="relative inline-block w-10 align-middle select-none transition duration-200 ease-in mx-4">
            <input v-model="useSelectedInitialColor" id="useSelectedInitialColor" type="checkbox"
              class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out" />
            <label for="useSelectedInitialColor"
              class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ease-in-out"></label>
          </div>
          <span class="text-xs text-stone-400">Select</span>
        </div>
        <div class="w-10 select-none transition duration-200 ease-in">
          <label for="toggle" class="block text-xs text-stone-400 mb-2">Shades:</label>
          <div class="flex justify-center">
            <i-mdi-eye v-if="!showShades" @click="toggleShades" class="cursor-pointer text-xl" />
            <i-mdi-eye-off v-if="showShades" @click="toggleShades" class="cursor-pointer text-xl" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.toggle-label {
  width: 100%;
}

.toggle-checkbox-shades:checked {
  @apply transform translate-x-4 border-purple-400;
}

.toggle-checkbox-shades:checked+.toggle-label-shades {
  @apply bg-purple-800;
}

.toggle-label-shades {
  width: 50%;
}


.toggle-checkbox:checked {
  @apply transform translate-x-full border-purple-400;
}

.toggle-checkbox:checked+.toggle-label {
  @apply bg-purple-800;
}



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
</style>

<script setup>
import { ref, defineEmits, onMounted, watchEffect } from 'vue';
import chroma from 'chroma-js';
import { generateColors, generateBaseColors } from '@/config/generateColors.js';

const numBaseColors = ref(3);
const numShades = ref(1);
const colorScheme = ref('triadic');
const emit = defineEmits(['color-scheme-generated', "update:showShades"]);
const useSelectedInitialColor = ref(false);
const userSelectedInitialColor = ref('#e01b24');
const showAdvancedOptions = ref(false);
const showShades = ref(false);


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
  emit("update:showShades", showShades.value);
  console.log('showShades:' + showShades.value)
}


</script>