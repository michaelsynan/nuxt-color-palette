<template>
  <div class="flex items-center justify-center min-h-screen">
    <a :href="confirmationUrl">Click here to confirm</a>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted, computed } from 'vue';

// Access the current route object
const route = useRoute();

// Create a computed property to dynamically compute the value of the confirmationUrl
const confirmationUrl = computed(() => route.query.confirmation_url);

// Use the onMounted lifecycle hook to log the confirmationUrl when the component is mounted
onMounted(() => {
  console.log(confirmationUrl.value);
});
</script>