<script>
import { ref } from 'vue';

export default {
  setup() {
    const colorSchemeJson = ref({});
    const showShades = ref(true); // Add this line to define the showShades ref
    const updateColorSchemeJson = (newColorSchemeJson) => {
      colorSchemeJson.value = newColorSchemeJson;
    };

    return {
      showShades, // Add this line to return the showShades ref
      colorSchemeJson,
      updateColorSchemeJson,
    };
  },
};
</script>


<template>
  <div class="h-full">
    <GenerateColors @color-scheme-generated="updateColorSchemeJson" />
    <div class="flex space-x-2 mx-4">
    

    </div>
    <ColorPalette :colors="colorSchemeJson" :showShades="showShades" />
  </div>
</template>


<style scoped></style>
