<template>
  <transition name="modal">
    <div v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950 bg-opacity-70 mx-auto shadow"
      @click.self="handleClose">
      <div class="bg-stone-800 p-4 m-2 md:p-8 shadow-md absolute rounded max-w-xl" @click.stop>
        <i-mdi-close class="absolute top-4 right-4 text-2xl cursor-pointer" @click="handleClose" />

        <div class="flex flex-row mb-4 mt-2 space-x-4">
          <img src="/colorpalette.png" class="h-36 mr-4 object-contain rounded" />
          <div class="space-between flex flex-col">
            <h2 class="text-2xl md:text-2xl uppercase">Signup to Get Started </h2>
            <div class="my-4 text-base md:text-lg">We're building an entire suite of tools. Join to save your palettes and get notified as more launches.
            </div>
          </div>
        </div>

        <label for="email" class="text-stone-500">Email:</label>
        <div
          class="flex flex-col md:flex-row items-center space-x-8">
          <div class="w-full mr-2">
            <input v-model="email" id="email"
              class="block text-stone-300 placeholder-stone-600 shadow w-full rounded-l bg-stone-950 p-2.5 focus:ring-0 focus:border-none border-none ring-0 rounded focus:outline-none"
              placeholder="Enter Email" @keyup.enter="handleLogin" />
          </div>
          <button @click="handleLogin"
            class="m-0 !ml-0 mt-2 md:!mt-0 py-2 border-0button rounded block bg-[#14b8a6] hover:bg-[#409087] p-2 font-bold cursor-pointer px-10 focus:ring-0 focus:border-none">Enter</button>
        </div>
        <div class="text-red-500 mt-2" v-if="emailError">{{ emailError }}</div>
        <div class="mt-4 absolute" v-if="feedback">{{ feedback }}</div>
      </div>
    </div>
  </transition>
</template><script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const client = useSupabaseClient();
const email = ref('');
const loading = ref(false);
const feedback = ref('');
const emailError = ref('');
const user = useSupabaseUser();

function validateEmail() {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!email.value) {
    emailError.value = 'Please enter an email address';
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email address';
  } else {
    emailError.value = '';
  }
}

// Modify the handleClose function to accept an optional delay parameter
const handleClose = (delay = 0) => {
  // Use setTimeout to introduce the delay, if specified
  setTimeout(() => {
    email.value = '';
    feedback.value = '';
    emailError.value = '';
    emit('close');
  }, delay);
};

const handleLogin = async () => {
  try {
    loading.value = true;
    const { error } = await client.auth.signInWithOtp({ email: email.value });
    if (error) throw error;
    alert('Check your email for the login link!');
    // Close the modal with a 500ms delay after successful sign-in
    handleClose(250);
  } catch (error) {
    alert(error.error_description || error.message);
    // Close the modal with a 500ms delay after an error occurs
    handleClose(250);
  } finally {
    loading.value = false;
  }
};


watch(() => props.visible, (val) => {
  if (val) {
    document.body.classList.add('modal-open');
  } else {
    document.body.classList.remove('modal-open');
  }
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
}
</style>
  