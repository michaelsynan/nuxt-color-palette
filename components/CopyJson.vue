<template>
  <div>
    <button @click="copyPalette" class="py-3 px-2 text-white text-sm rounded min-w-max">Copy JSON</button>
    <div v-if="copied" class="copy-message text-sm text-green-500 mt-2 absolute">Copied to clipboard!</div>
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
    const copied = ref(false);

    function copyPalette() {
      const jsonText = JSON.stringify(props.colorSchemeJson, null, 2);
      navigator.clipboard.writeText(jsonText).then(() => {
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      });
    }

    return {
      copied,
      copyPalette,
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
