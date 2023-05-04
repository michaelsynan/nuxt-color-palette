<script>
import { ref } from 'vue';

export default {
  setup() {
    const colorSchemeJson = ref({});
    const showShades = ref(true);
    const updateColorSchemeJson = (newColorSchemeJson) => {
      colorSchemeJson.value = newColorSchemeJson;
    };

    const updateShowShades = (newShowShades) => {
      showShades.value = newShowShades;
    };

    return {
      showShades,
      colorSchemeJson,
      updateColorSchemeJson,
      updateShowShades
    };
  },
};
</script>

<template>
  <div class="h-full">
    <uiSideMenu />
    <GenerateColors @color-scheme-generated="updateColorSchemeJson" @update:showShades="updateShowShades" />
    <ColorPalette :colors="colorSchemeJson" :showShades="showShades" />
  </div>
</template>


<style scoped></style>
