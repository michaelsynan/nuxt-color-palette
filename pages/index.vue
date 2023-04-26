<script>
import { ref } from 'vue';

export default {
  setup() {
    const colorSchemeJson = ref({});

    const updateColorSchemeJson = (newColorSchemeJson) => {
      colorSchemeJson.value = newColorSchemeJson;
    };

    return {
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
    
    <ExportPalette :palette="colorSchemeJson" />
    <CopyJson :palette="colorSchemeJson" />
    </div>
    <ColorPalette :colors="colorSchemeJson" />
  </div>
</template>


<style scoped></style>
