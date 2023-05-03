<script setup>
import { ref, watchEffect } from 'vue';

const user = useSupabaseUser()

const showProfile = ref(false);

const props = defineProps({
  showProfileFromParent: {
    type: Boolean,
    default: false,
  },
});

watchEffect(() => {
  showProfile.value = props.showProfileFromParent;
});

</script>

<template>
  <div class="mt-20 " style="padding: 50px 0 100px 0">
    <Account v-if="user && showProfile" />
    <Auth v-else />
    <userSavedPalettes v-if="user" />
  </div>
</template>
