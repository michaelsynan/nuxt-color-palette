<script setup>

const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({ email: email.value })
    if (error) throw error
    alert('Check your email for the login link!')
  } catch (error) {
    alert(error.error_description || error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="col flex-center flex m-4 h-full" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <img src="colorpalette.png" class="p-20 -mt-10">
      <p class="description">Sign in via magic link</p>
      <div>
        <input class="inputField p-2.5 bg-stone-800 placeholder-stone-400 w-full my-2 focus:!ring-0 focus:!border-none focus:outline-none" type="email" placeholder="Your email" v-model="email" />
      </div>
      <div>
        <input
          type="submit"
          class="button block bg-[#14b8a6] hover:bg-[#409087] p-2 font-bold cursor-pointer w-full mt-3 focus:ring-0 focus:border-none"
          :value="loading ? 'Loading' : 'Send magic link'"
          :disabled="loading"
        />
      </div>

    </div>
  </form>
</template>
