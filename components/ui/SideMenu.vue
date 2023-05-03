<template>
  <!-- Hamburger menu button -->
  <button @click="isMenuOpen = !isMenuOpen" class="hamburger-menu text-4xl">
    <i-mdi-menu />
  </button>
  <!-- Side menu with conditional CSS classes -->
  <div :class="['side-menu', isMenuOpen ? 'open' : 'closed']">
    <div class="w-full absolute">
      <button @click="toggleAccount" class="profile text-4xl right-0 ml-auto relative">
        <i-mdi-account-circle />
      </button>
    </div>
    <enter v-if="!user" :showProfileFromParent="showProfile" />
    <account v-if="user && showAccount" />
    <userSavedPalettes v-if="user && !showAccount" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';

const { emit } = defineEmits();
const user = useSupabaseUser()

// Add the isMenuOpen ref variable
const isMenuOpen = ref(false);

function toggleAccount() {
  showAccount.value = !showAccount.value;
}

const showProfile = ref(false);

function handleShowProfile() {
  showProfile.value = true;
}

const showAccount = ref(false);

</script>

<style scoped>
/* Hamburger menu button styles */
.hamburger-menu {
  background-color: black;
  position: fixed;
  top: 10px;
  left: 5px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1000;
}

.profile {
  background-color: black;
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
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
