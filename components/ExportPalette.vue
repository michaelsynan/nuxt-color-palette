<template>
  <div>
    <button @click="exportPalette" class="py-2.5 px-2">Tailwind</button>
    <div v-if="exported" class="text-sm text-green-500 mt-2 absolute">Copied to clipboard!</div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    colorSchemeJson: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const exported = ref(false);

    function formatPalette(palette) {
      const formattedPalette = {};

      for (const key in palette) {
        const [group, shade] = key.split('-');

        if (!formattedPalette[group]) {
          formattedPalette[group] = {};
        }

        formattedPalette[group][shade] = palette[key];
      }

      return formattedPalette;
    }

    function exportPalette() {
      const formattedPalette = formatPalette(props.colorSchemeJson);
      const jsonText = JSON.stringify(formattedPalette, null, 2);
      navigator.clipboard.writeText(jsonText).then(() => {
        exported.value = true;
        setTimeout(() => {
          exported.value = false;
        }, 3000);
      });
    }

    return {
      exported,
      exportPalette,
    };
  },
};
</script>