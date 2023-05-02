<template>
  <div class="text-white p-2 rounded flex flex-col items-center space-y-2 my-4 md:my-6 fixed w-full z-50 ">
    <div class="flex flex-row space-x-1 md:space-x-2  m-2 md:m-4 ">
      <button
      ref="generateButton" 
        @click="generateColorsAndSave"
        @keyup.space.prevent="generateColorsAndSave"
        class="py-2.5 px-5 bg-stone-800 hover:bg-stone-900 rounded shadow text-base font-bold group focus:outline-none focus:border-none"
        tabindex="0"
      ><span
          class="group-hover:opacity-80">Generate</span></button>
      <button @click="toggleAdvancedOptions" class="py-2.5 px-2 bg-stone-800 hover:bg-stone-900 rounded shadow text-xl">
        <i-mdi-arrow-down v-if="!showAdvancedOptions" class="group-hover:opacity-80 group" />
        <i-mdi-arrow-up v-if="showAdvancedOptions" class="group-hover:opacity-80 group" />
      </button>
      <div class="group flex flex-row relative  shadow transition duration-300">
        <button
          class="z-10 flex items-center justify-center py-2.5 px-2 rounded-l rounded-r group-hover:rounded-r-none transition duration-300 bg-stone-800 hover:bg-stone-900"  @click="savePaletteToSupabase">
          <i-mdi-heart @click="showModal = !showModal" class="text-xl group-hover:opacity-80" />
        </button>
        <button @click="getUserPalettes">Get palettes</button>
      </div>
      <div class="group flex flex-row relative  shadow transition duration-300">
        <button
          class="z-10 flex items-center justify-center py-2.5 px-2 rounded-l rounded-r group-hover:rounded-r-none transition duration-300 bg-stone-800 hover:bg-stone-900">
          <i-mdi-floppy @click="copyPalette" class="text-xl group-hover:opacity-80" />
          <div v-if="copied" class="copy-message text-sm text-green-500 -translate-y-4 absolute">Copied!</div>
        </button>
        <div
          class="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto flex flex-row space-x-2 absolute left-10 bg-stone-900 bg-inherit rounded-r transition duration-300 px-2">
          <div>
            <CopyJson :colorSchemeJson="palette" />
          </div>
          <div>
            <ExportPalette :colorSchemeJson="palette" />
          </div>
        </div>
      </div>
    </div>
    <transition name="slide">
      <div v-if="showAdvancedOptions"
  class="mt-2 flex flex-col sm:flex-row items-stretch space-y-4 sm:space-y-0 sm:space-x-4 bg-stone-950 bg-opacity-80 p-4 rounded-lg">
        <div class="flex flex-wrap justify-center flex-col">
          <label for="numBaseColors" class="block mb-1">Base Colors</label>
          <select v-model="numBaseColors" id="numBaseColors" class="w-full bg-gray-700 rounded p-2 shadow cursor-pointer">
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>
        <div class="flex flex-wrap justify-center flex-col">
          <label for="numShades" class="block mb-1">Shades</label>
          <div class="flex flex-row">
            <select v-model="numShades" id="numShades" class="w-full bg-gray-700 rounded-l p-2 cursor-pointer">
              <option value="1">2</option>
              <option value="2">4</option>
              <option value="3">6</option>
              <option value="4">8</option>
              <option value="5">10</option>
            </select>
            <div class="w-10 select-none transition duration-200 ease-in" @click="toggleShades">
              <div class="flex justify-center align-middle px-2 h-full bg-gray-700 rounded-r border-l-2 border-stone-800">
                <i-mdi-eye-off v-if="!showShades" class="cursor-pointer text-xl my-auto" />
                <i-mdi-eye v-if="showShades" class="cursor-pointer text-xl my-auto" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap justify-center flex-col">
          <label for="colorScheme" class="block mb-1">Color Scheme</label>
          <select v-model="colorScheme" id="colorScheme" class="w-full bg-gray-700 rounded p-2 shadow cursor-pointer">
            <option value="triadic">Triadic</option>
            <option value="complementary">Complementary</option>
            <option value="splitComplementary">Split Complementary</option>
            <option value="analogous">Analogous</option>
            <option value="square">Square</option>
            <option value="tetradic">Tetradic</option>
          </select>
        </div>
        <div class="flex flex-wrap flex-col">
          <label for="initialColor" class="block mb-1 text-xss">Initial Color</label>

          <!-- Start color picker -->
          <div class="relative cursor-pointer" @click.stop="showChrome = true">
            <div class="w-12 h-6 m-1 rounded" :style="{ backgroundColor: userSelectedInitialColor }"></div>
            <div v-if="showChrome" class="absolute top-8 z-10 p-1">
              <Chrome :model-value="somecolors" @update:model-value="debouncedOnColorUpdate" />
            </div>
          </div>
          <!-- End color picker -->

        </div>
        <div class="flex flex-col h-full">
          <label for="initialColor" class="mb-2 text-xss self-start">Random Color</label>
          <div class="flex items-center mt-auto h-full">
            <div class="relative inline-block w-10 align-middle select-none transition duration-200 ease-in mx-4">
              <input v-model="useSelectedInitialColor" id="useSelectedInitialColor" type="checkbox"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out" />
              <label for="useSelectedInitialColor"
                class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ease-in-out"></label>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <Teleport to="body">
      <uiLogIn v-model:visible="showModal" @close="closeModal"  />
    </Teleport>
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
  @apply transform translate-x-full border-gray-300;
}

.toggle-checkbox:checked+.toggle-label {
  @apply bg-gray-700;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
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

.copy-message {
  opacity: 0;
  animation: rise-up 1s forwards;
}

@keyframes rise-up {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  10%, 80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

</style>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import chroma from 'chroma-js';
import { generateColors, generateBaseColors } from '@/config/generateColors.js';
import { useDebounceFn } from '@vueuse/core';


const emit = defineEmits(['update:colorSchemeJson', 'update:showShades', 'color-scheme-generated']);
const numBaseColors = ref(4);
const numShades = ref(3);
const colorScheme = ref('triadic');
const useSelectedInitialColor = ref(false);
const copied = ref(false);

const generateButton = ref(null);

/* Modal logic */

const showModal = ref(false);

function closeModal() {
    showModal.value = false;
  }

/* end modal logic */

/* vueUseColor logic */

const somecolors = ref('#14B8A6');
const userSelectedInitialColor = ref(somecolors.value);
const showChrome = ref(false);

const debouncedOnColorUpdate = useDebounceFn((newColor) => {
  somecolors.value = newColor.hex8;
  userSelectedInitialColor.value = newColor.hex;
  console.log('Updated user selected initial color:', userSelectedInitialColor.value);
}, 1000);


const onClickOutside = (event) => {
  if (!event.target.closest('.relative.cursor-pointer')) {
    showChrome.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
  generateButton.value.focus();
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
});

/* end vueUseColor logic */

const showAdvancedOptions = ref(false);
const showShades = ref(true);

const colorSchemeJson = ref({});
provide('colorSchemeJson', colorSchemeJson);

const palette = ref({});
palette.value = colorSchemeJson;
const onColorSchemeGenerated = (colorSchemeJson) => {
  palette.value = colorSchemeJson;
};

function toggleAdvancedOptions() {
  showAdvancedOptions.value = !showAdvancedOptions.value;
}

/* Generate random initial color */
function randomHexColor(minBrightness = 32, maxBrightness = 223) {
  let color;
  do {
    const randomColorValue = () => {
      const min = Math.ceil(0);
      const max = Math.floor(255);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const r = randomColorValue();
    const g = randomColorValue();
    const b = randomColorValue();

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (brightness >= minBrightness && brightness <= maxBrightness) {
      color = "#" + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
    }
  } while (!color);

  return color;
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

  await nextTick();

  const initialColorValue = selectedInitialColor;
  const initialColorObject = chroma(initialColorValue);

  const baseColors = await generateBaseColors(
    colorScheme.value,
    numBaseColors.value,
    initialColorValue
  );

  const orderedOutput = await generateColors(
    numBaseColors.value,
    numShades.value,
    colorScheme.value,
    baseColors
  );
  const colorSchemeJson = orderedOutput;
  palette.value = colorSchemeJson;
  emit('color-scheme-generated', colorSchemeJson);
}

onMounted(() => {
  generateColorsAndSave();
});

function toggleShades(event) {
  if (event.detail === 1) {
    showShades.value = !showShades.value;
    emit("update:showShades", showShades.value);
  }
}


async function copyPalette() {
  const jsonString = JSON.stringify(palette.value, null, 2);
  copied.value = false; // Add this line to reset the copied state
  try {
    await navigator.clipboard.writeText(jsonString);
    copied.value = true;
  } catch (err) {
    console.error('Failed to copy color scheme JSON: ', err);
    copied.value = false;
  }
}
// Define the method to save the palette to Supabase
async function savePaletteToSupabase() {
  // Access the Supabase client
  const supabase = useSupabaseClient();
  const authClient = useSupabaseAuthClient();


 // Get the authenticated user object
 const user = useSupabaseUser().value;

// Check if the user is authenticated
if (!user) {
  console.error('User is not authenticated');
  return;
}

// Get the authenticated user's UUID
const userId = user.id;

try {
  const { data, error } = await authClient
    .from('colors')
    .insert([
      {
        public_id: userId, // Include the user's UUID in the user_id column
        palette: JSON.stringify(palette.value), // Save the palette as a JSON string or as an object based on your database schema
      },
    ]);
  if (error) {
    throw error;
  }
  // Handle success (e.g., show a success message)
  console.log('Palette saved successfully:', data);
} catch (err) {
  // Handle error (e.g., show an error message)
  console.error('Failed to save palette:', err);
}
}

//get palettes 

// Import the required composables

// Define the method to retrieve all saved color palettes by a particular user
async function getUserPalettes() {
  // Access the Supabase client
  const supabase = useSupabaseClient();

  // Get the authenticated user object
  const user = useSupabaseUser().value;

  // Check if the user is authenticated
  if (!user) {
    console.error('User is not authenticated');
    return;
  }

  // Get the authenticated user's UUID
  const userId = user.id;

  try {
    // Retrieve all color palettes where the public_id column matches the user's UUID
    const { data, error } = await supabase
      .from('colors')
      .select('*') // Select all columns
      .eq('public_id', userId); // Filter by user's UUID

    if (error) {
      throw error;
    }

    // Handle success (e.g., process the retrieved data)
    console.log('Retrieved color palettes:', data);
    return data;
    console.log(data) // Return the retrieved data
  } catch (err) {
    // Handle error (e.g., show an error message)
    console.error('Failed to retrieve color palettes:', err);
  }
}


</script>