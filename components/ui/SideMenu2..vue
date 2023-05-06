<template>
  <!-- Hamburger menu button -->
  <button @click="isMenuOpen = !isMenuOpen" class="hamburger-menu p-2 text-2xl mt-3 ml-4 bg-stone-800 hover:bg-stone-900 rounded shadow ">
    <i-mdi-menu v-if="!isMenuOpen" />
    <i-mdi-close v-else />
  </button>
  <!-- Side menu with conditional CSS classes -->
  <div :class="['side-menu', isMenuOpen ? 'open' : 'closed']" class="pt-20 absolute px-4">
    <div class="w-full flex justify-end items-center mr-10">
      <button @click="toggleAccount" class="profile text-4xl relative -top-14">
        <i-mdi-account-circle />
      </button>
    </div>
    <enter v-if="!user" :showProfileFromParent="showProfile" />

   
    <account v-if="user && showAccount" />

    <userSavedPalettes
  v-if="user && !showAccount"
  />
   
  </div>
</template>

<script setup>
import { ref } from 'vue';

const user = useSupabaseUser()

// Add the isMenuOpen ref variable
const isMenuOpen = ref(false);


</script>


<style scoped>
/* Hamburger menu button styles */
.hamburger-menu {
  position: fixed;
  top: 10px;
  left: 5px;
  border: none;
  cursor: pointer;
  z-index: 1000;
}

.profile {
  border: none;
  cursor: pointer;
  z-index: 1000;
}

/* Side menu styles */
.side-menu {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 300px;
  background: #0f0f0f;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
  z-index: 999;
}

/* CSS classes for open and closed states */
.side-menu.closed {
  transform: translateX(-100%);
}

.side-menu.open {
  transform: translateX(0);
}
</style>
