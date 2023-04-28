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

    console.log('showShades from index:' + showShades.value)

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
    <GenerateColors @color-scheme-generated="updateColorSchemeJson" @update:showShades="updateShowShades" />
    <div class="flex space-x-2 mx-4">
    </div>
    <ColorPalette :colors="colorSchemeJson" :showShades="showShades" />  </div>
</template>


<style scoped></style>
