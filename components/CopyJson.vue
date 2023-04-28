<!-- components/CopyJson.vue -->
<template>
  <div>
    <button @click="copyPalette" class=" text-white text-sm rounded min-w-max">Copy JSON</button>
    <div v-if="copied" class="text-sm text-green-500 mt-2 absolute">Copied to clipboard!</div>
  </div>
</template>

<script>
import { ref, watch, inject } from 'vue';

export default {
  props: {
    colorSchemeJson: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const copied = ref(false);

    watch(
      () => props.colorSchemeJson,
      (newColors) => {
        console.log('New colors:', newColors);
      }
    );

    function copyPalette() {
      console.log('console log from copyjson:', props.colorSchemeJson);
      const jsonText = JSON.stringify(props.colorSchemeJson, null, 2);
      navigator.clipboard.writeText(jsonText).then(() => {
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 3000);
      });
    }

    return {
      copied,
      copyPalette,
    };
  },
};
</script>
