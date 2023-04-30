<template>
  <transition name="modal">

      <div v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950 bg-opacity-70 mx-auto shadow"
    @click.self="$emit('close')">
    <div class="bg-stone-800 p-8 shadow-md absolute relative rounded max-w-xl" @click.stop>
      <i-mdi-close class="absolute top-4 right-4 text-2xl" @click="$emit('close')"/>
        <h2 class="text-3xl uppercase font-bold mb-4">Signup's Coming Soon!</h2>
        <div class="my-4 text-lg">Formwork Studios is launching not just a color palette generator, but a themable component library, as well. Pre-register for early access!</div>
        <label for="email" class="text-stone-500">Email:</label>
        <div class="flex flex-row items-center space-x-4 p-1.5 bg-stone-950 rounded">
  <div class="w-full">
    <input id="email" class="block p-2 text-stone-40 shadow w-full rounded bg-transparent" placeholder="Enter Email" />
  </div>

  <button @click="$emit('close')" class="px-3 py-2 max-w-[140px] bg-white text-black w-full shadow rounded">Let's Talk</button>
</div>


      </div>
  </div>
    </transition>
  </template>
  
  
  <script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    watch: {
      visible(val) {
        if (val) {
          document.body.classList.add('modal-open');
        } else {
          document.body.classList.remove('modal-open');
        }
      },
    },
  });
  </script>
  
  <style scoped>
  .modal-enter,
  .modal-leave-to {
    opacity: 0;
    transform: scale(1.1);
  }
  
  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.3s;
  }
  
  .modal-open {
    overflow-y: hidden;
  }</style>
  