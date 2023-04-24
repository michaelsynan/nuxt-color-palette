<!--
  <div class="flex flex-col justify-center">
    <button @click="toggleShades" class="mb-4">
      {{ showShades ? 'Hide Shades' : 'Show Shades' }}
    </button>
    <div class="flex justify-center">
      <div class="flex flex-wrap gap-4 w-max">
        <div v-for="(group, groupName) in filteredColorGroups" :key="groupName" class="flex-1">
          <div class="flex-col">
          <h3>{{ groupName }}</h3>
          <div class="flex flex-col">
            <div
              v-for="([colorKey, colorValue]) in Object.entries(group)"
              :key="colorKey"
              :class="[
                'color-square',
                colorKey.endsWith('-500') ? 'base-color h-32 w-32' : 'h-24 w-24',
                'flex flex-col justify-between items-center'
              ]"
              :style="{ backgroundColor: colorValue }"
            >
              <div></div>
              <span class="color-label mb-1">{{ colorValue }}</span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
-->
<template>
  <div>
    <button @click="toggleShades" class="mb-4">
      {{ showShades ? 'Hide Shades' : 'Show Shades' }}
    </button>
    <div class="flex justify-center flex-wrap">
      <div v-for="(group, groupName) in filteredColorGroups" :key="groupName" class="m-4">
        <h3 class="text-lg capitalize">{{ groupName }}</h3>
        <div class="flex flex-wrap">
          <div
            v-for="([colorKey, colorValue]) in Object.entries(group)"
            :key="colorKey"
            :class="[
              'color-square',
              colorKey.endsWith('-500') ? 'base-color h-32 w-32' : 'h-24 w-24',
              'flex flex-col justify-between items-center',
              showShades || colorKey.endsWith('-500') ? '' : 'hidden'
            ]"
            :style="{ backgroundColor: colorValue }"
          >
            <span class="color-label mb-1">{{ colorValue }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue';

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
  margin: 5px;
  border: 1px solid #dedede;
}
.color-label {
  color: #ffffff;
  font-size: 12px;
}

.base-color {
  /* position: absolute; */
  z-index: 1;
}

</style>
