<template>
  <transition name="modal">
    <div v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950 bg-opacity-70 mx-auto shadow"
      @click.self="handleClose">
      <div class="bg-stone-800 p-4 m-2 md:p-8 shadow-md absolute rounded max-w-xl" @click.stop>
        <i-mdi-close class="absolute top-4 right-4 text-2xl cursor-pointer" @click="handleClose" />
        <h2 class="text-2xl md:text-3xl uppercase font-bold mb-4">Signup's Coming Soon!</h2>
        <div class="my-4 text-base md:text-lg">Formwork Studios is launching not just a color palette generator, but a themable component library, as well.<br /> <br />
          
          Pre-register for early access!</div>
          <label for="email" class="text-stone-500">Email:</label>
  <div class="flex flex-col md:flex-row items-center space-x-4 space-y-2 p-0 md:p-1.5 bg-transparent md:bg-stone-950 rounded">
    <div class="w-full">
      <input v-model="email" id="email" class="block p-3 text-stone-40 shadow w-full rounded bg-stone-950 md:bg-transparent" placeholder="Enter Email" @keyup.enter="handleSubmit"  />
    </div>
    <button @click="handleSubmit" class="py-3 m-0 !ml-0 mt-2 md:!mt-0 py-2 max-w block md:inline-block md:max-w-[140px] bg-stone-100 hover:bg-stone-300 text-black w-full shadow rounded"  >Let's Talk</button>
  </div>
  <div class="text-red-500 mt-2" v-if="emailError">{{ emailError }}</div>
  <div class="mt-4 absolute" v-if="feedback">{{ feedback }}</div>
      </div>
    </div>
  </transition>
</template>
<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const client = useSupabaseClient();
    const email = ref('');
    const feedback = ref('');
    const emailError = ref('');

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


      const handleClose = () => {

      email.value = '';
      feedback.value = '';
      emailError.value = '';

      emit('close');
    };

    async function handleSubmit() {
      validateEmail();
      if (emailError.value) {
        return;
      }

      try {
        const { error } = await client.from("color_signup").insert({ email: email.value });
        if (error) {
          throw error;
        }
        feedback.value = "Form submitted successfully";
        email.value = "";
      } catch (error) {
        console.log("Error occurred", { error });
        feedback.value = "An error occurred";
      }
    }

    return {
      email,
      feedback,
      emailError,
      handleSubmit,
      handleClose,
    };
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
  }
</style>
  