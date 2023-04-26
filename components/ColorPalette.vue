<template>
  <div class="h-full">
    <div class="inline-block w-10 align-middle select-none transition duration-200 ease-in mb-4 fixed bottom-10 left-10">
      <label for="toggle" class="block mb-2 text-sm text-stone-400">Toggle Shades:</label>
      <input type="checkbox" @change="toggleShades" name="toggle" id="toggle"
        class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out" />
      <label for="toggle"
        class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ease-in-out"></label>
    </div>
    <div class="flex items-center justify-center h-full py-6">
      
      <div v-for="(group, groupName) in filteredColorGroups" :key="groupName" class="m-4 max-w-[200px]">
        <h3 class="text-lg capitalize hidden">{{ groupName }}</h3>

        <div class="flex flex-wrap">
          <div v-for="([colorKey, colorValue]) in Object.entries(group).filter(([key]) => key.endsWith('-500'))"
            :key="colorKey" class="color-square base-color h-32 w-32 flex flex-col justify-between items-center flex-grow my-4"
            :style="{ backgroundColor: colorValue }">
<span class="color-label font-bold mt-auto" :class="computedTextColor(colorValue)">{{ colorValue }}</span>
                    </div>
        </div>
        <div class="color-grid">
        <transition name="fade" v-for="([colorKey, colorValue]) in Object.entries(group).filter(([key]) => !key.endsWith('-500'))"
          :key="colorKey">
          <div v-if="showShades" :class="[
                'color-square',
                'h-8 w-8',
                'flex flex-col justify-between items-center text-xs'
              ]" :style="{ backgroundColor: colorValue }">
          </div>
        </transition>
      </div>

      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue';


// Add this method inside the <script setup> section
function computedTextColor(bgColor) {
  const color = bgColor.substring(1);
  const rgb = parseInt(color, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luma < 128 ? 'text-white' : 'text-black';
}


const props = defineProps({
  colors: {
    type: Object,
    required: true,
  },
});

const showShades = ref(true);
const colorGroups = ref({});

const updateColorGroups = () => {
  const groups = {};
  for (const key in props.colors) {
    const groupName = key.split('-')[0];
    if (!groups[groupName]) {
      groups[groupName] = {};
    }
    groups[groupName][key] = props.colors[key];
  }
  colorGroups.value = groups;
};

updateColorGroups();

watch(
  () => props.colors,
  () => {
    updateColorGroups();
  }
);

function toggleShades() {
  showShades.value = !showShades.value;
}

const filteredColorGroups = computed(() => {
  if (showShades.value) {
    return colorGroups.value;
  }

  const filteredGroups = {};
  for (const groupName in colorGroups.value) {
    filteredGroups[groupName] = {};
    for (const colorKey in colorGroups.value[groupName]) {
      if (colorKey.endsWith('-500')) {
        filteredGroups[groupName][colorKey] = colorGroups.value[groupName][colorKey];
      }
    }
  }
  return filteredGroups;
});
</script>

<style scoped>
.color-square {
  display: inline-flex;
 /** margin: 5px; *.
}

.color-label {
  color: #ffffff;
  font-size: 12px;
}

.base-color {
  /* position: absolute; */
  z-index: 1;
}

.toggle-checkbox:checked {
  @apply transform translate-x-full border-purple-400;
}

.toggle-checkbox:checked+.toggle-label {
  @apply bg-purple-800;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(2rem, 1fr));
  gap: 0rem;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}



</style>
