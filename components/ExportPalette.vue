<template>
  <div>
    <button @click="exportPalette" class="py-2.5 px-2 items-center justify-center">Tailwind
      <div v-if="exported" class="copy-message text-sm text-green-500 absolute">Copied!</div>
    </button>

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

<style scoped>
.copy-message {
  opacity: 0;
  animation: rise-up 1s forwards;
}

@keyframes rise-up {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  10%, 80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>