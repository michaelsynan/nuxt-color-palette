<template>
  <div class="h-full">

    <uiSideMenu />
<div class="text-8xl text-white fixed top-0 right-0 z-50" v-if="user">Am user</div>
<div class="text-8xl text-white fixed top-0 right-0 z-50" v-else>Am not user</div>
    <GenerateColors 
      @color-scheme-generated="updateColorSchemeJson" 
      @update:showShades="updateShowShades" 
      @trigger-api-call="triggerApiCall"
    />

    <ColorPalette :colors="colorSchemeJson" :showShades="showShades" />

  </div>
</template>

<script setup>
import { ref, provide } from 'vue';
const user = useSupabaseUser()
const colorSchemeJson = ref({});
const showShades = ref(true);

const triggerApiCallRef = ref(null);

const updateColorSchemeJson = (newColorSchemeJson) => {
  colorSchemeJson.value = newColorSchemeJson;
};

const updateShowShades = (newShowShades) => {
  showShades.value = newShowShades;
};


// Define the triggerApiCall method
const triggerApiCall = () => {
  // This function will be called from the generatepalette.vue component
  // when the button is clicked
  if (triggerApiCallRef.value) {
    triggerApiCallRef.value();
  }
};

// Provide the triggerApiCallRef to child components
provide('triggerApiCallRef', triggerApiCallRef);
</script>


<style scoped></style>
