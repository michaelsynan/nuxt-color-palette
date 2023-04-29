<template>
  <div>
    <NuxtPage />
  </div>
</template>


<script>
import '@/assets/css/main.css'
import VueColor from '@ckpack/vue-color';

export default {
  setup() {
    const nuxtApp = useNuxtApp();
    nuxtApp.vueApp.use(VueColor);
  },
};

</script>

<style></style>