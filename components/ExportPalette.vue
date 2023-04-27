<!-- components/ExportPaletteButton.vue -->
<template>
  <div>
    <button @click="exportPalette" class="py-1.5 px-3 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded">Copy Tailwind.config Tokens</button>
    <div v-if="exported" class="text-sm text-green-500 mt-2 absolute">Palette exported to clipboard!</div>
  </div>
</template>

<script>
export default {
  props: {
    palette: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      exported: false,
    };
  },
  methods: {
    formatPalette(palette) {
      const formattedPalette = {};

      for (const key in palette) {
        const [group, shade] = key.split('-');

        if (!formattedPalette[group]) {
          formattedPalette[group] = {};
        }

        formattedPalette[group][shade] = palette[key];
      }

      return formattedPalette;
    },
    exportPalette() {
      const formattedPalette = this.formatPalette(this.palette);
      const jsonText = JSON.stringify(formattedPalette, null, 2);
      navigator.clipboard.writeText(jsonText).then(() => {
        this.exported = true;
        setTimeout(() => {
          this.exported = false;
        }, 3000);
      });
    },
  },
};
</script>