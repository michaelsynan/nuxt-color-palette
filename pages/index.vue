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
    <GenerateColors @color-scheme-generated="updateColorSchemeJson" />
    <div>Generate Colors</div>
    <ExportPalette :palette="colorSchemeJson" />
    <CopyJson :palette="colorSchemeJson" />
    <ColorPalette :colors="colorSchemeJson" />

  </div>
</template>


<style scoped></style>
