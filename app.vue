<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script>
import '@/assets/css/main.css'
import { Chrome, create } from '@ckpack/vue-color';

export default {
  setup() {
    const nuxtApp = useNuxtApp();
    useHead({
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
}),
    nuxtApp.vueApp.use(
      create({
        components: {
          Chrome,
        },
      })
    );
  },
};

</script>

<style></style>