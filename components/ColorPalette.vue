<template>
  <div class="h-screen w-screen overflow-hidden">
    <div class="grid grid-cols-fit grid-rows-fit h-full">
      <div id="color-container" v-for="(group, groupName) in filteredColorGroups" :key="groupName"
        class="m-1 flex flex-col h-auto">
        <div v-for="([colorKey, colorValue]) in Object.entries(group).filter(([key]) => key.endsWith('-500'))"
          :key="colorKey" class=" rounded items-center justify-center flex-grow flex-shrink-0 text-center flex"
          :style="{ backgroundColor: colorValue }">
          <span class="color-label font-bold uppercase text-xl md:text-2xl" :class="computedTextColor(colorValue)">{{ colorValue }}</span>
        </div>
        <div class="flex flex-row -mt-10 h-10 md:-mt-20 md:h-20 rounded overflow-hidden">
          <div v-for="([colorKey, colorValue]) in non500Colors(group)" :key="colorKey"
               v-if="showShades" class="color-square flex items-center justify-center h-full w-full"
               :style="{ backgroundColor: colorValue }">
            <span class="text-xs hidden">{{ colorValue }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';

const non500Colors = (group) => {
  return Object.entries(group).filter(([key]) => !key.endsWith('-500'));
};


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

watchEffect(() => {
  updateColorGroups();
});const getAnimatedStyle = (index) => {
  const transition = useTransition(
    ref(true),
    {
      duration: 1000,
      delay: props.delay * index,
      from: { transform: 'translateY(0)' },
      to: { transform: `translateY(${index % 2 === 0 ? '-' : ''}100%)` }
    },
    ref(false)
  );

  return transition.value;
};

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

</style>