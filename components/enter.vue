<script setup>
const user = useSupabaseUser()
</script>

<template>
  <div class="fixed bottom-0 left-0 bg-black" style="padding: 50px 0 100px 0">
    <Account v-if="user" />
    <Auth v-else />
  </div>
</template>
