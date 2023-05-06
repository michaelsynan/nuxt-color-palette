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
  <form class="col flex m-4 h-full" @submit.prevent="handleLogin">
    <div class="col-6"><div class="rounded overflow-hidden -mt-10">
      <img src="/colorpalette.png" class="m-20 w-28 mx-auto rounded">
      </div>
      <p class="description">Sign in via magic link</p>
      <div>
        <input class="inputField p-2.5 rounded bg-stone-800 placeholder-stone-400 w-full my-2 focus:!ring-0 focus:!border-none focus:outline-none" type="email" placeholder="Your email" v-model="email" />
      </div>
      <div>
        <input
          type="submit"
          class="button rounded block bg-[#14b8a6] hover:bg-[#409087] p-2 font-bold cursor-pointer w-full mt-3 focus:ring-0 focus:border-none"
          :value="loading ? 'Loading' : 'Send Magic Link'"
          :disabled="loading"
        />
      </div>

    </div>
  </form>
</template>
