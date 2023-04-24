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
  <div>
    <div>Generate Colors</div>
    <ExportPalette :palette="colorSchemeJson" />
    <CopyJson :palette="colorSchemeJson" />
    <ColorPalette :colors="colorSchemeJson" />
    <GenerateColors @color-scheme-generated="updateColorSchemeJson" />
  </div>
</template>


<style scoped></style>
