<template>
  <div class="h-screen w-screen overflow-hidden">
    <div
      class="space-x-4 w-10 align-middle select-none transition duration-200 ease-in mb-4 fixed bottom-10 left-10 flex flex-cols">

      <!--
      <ExportPalette :palette="props.colors" />
      <CopyJson :palette="props.colors" />
      -->
    </div>
    <div class="grid grid-cols-fit grid-rows-fit flex-grow h-full">
      <div id="color-container" v-for="(group, groupName) in filteredColorGroups" :key="groupName"
        class="m-1 flex-grow flex-shrink-0">
        <h3 class="text-lg capitalize hidden">{{ groupName }}</h3>

        <div v-for="([colorKey, colorValue]) in Object.entries(group).filter(([key]) => key.endsWith('-500'))"
          :key="colorKey" class="color-square base-color items-center justify-center flex-grow flex-shrink-0"
          :style="{ backgroundColor: colorValue }">
          <span class="color-label font-bold opacity-70" :class="computedTextColor(colorValue)">{{ colorValue }}</span>
        </div>

        <div class="flex flex-grow h-40">
          <transition name="fade"
            v-for="([colorKey, colorValue]) in Object.entries(group).filter(([key]) => !key.endsWith('-500'))"
            :key="colorKey">
            <div v-if="showShades" class="color-square flex items-center justify-center h-full w-full"
              :style="{ backgroundColor: colorValue }">
              <span class="text-xs hidden">{{ colorValue }}</span>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, onMounted } from 'vue';

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
  showShades: {
    type: Boolean,
    default: false,
    required: true,
  },
});

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

onMounted(() => {
  console.log('showShades from ColorPalette (onMounted):', props.showShades);
});


watch(
  () => props.colors,
  () => {
    updateColorGroups();
  }
);

watch(
  () => props.showShades,
  (newVal) => {
    console.log('showShades from ColorPalette (updated):', newVal);
  }
);

const filteredColorGroups = computed(() => {
  if (props.showShades) {
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

console.log('showShades from ColorPalette:' + props.showShades)
</script>

<style scoped>
.grid-cols-fit {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.grid-rows-fit {
  grid-template-rows: repeat(auto-fit, minmax(200px, 1fr));
}



.toggle-checkbox:checked {
  @apply transform translate-x-full border-purple-400;
}

.toggle-checkbox:checked+.toggle-label {
  @apply bg-purple-800;
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
