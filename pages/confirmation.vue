<template>
  <div class="flex items-center justify-center min-h-screen">
    <a :href="confirmationUrl">Click here to confirm</a>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

// Access the current route object
const route = useRoute();

// Extract the confirmation_url query parameter from the route object
const confirmationUrl = route.query.confirmation_url;
</script>