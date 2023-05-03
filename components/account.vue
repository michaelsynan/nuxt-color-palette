<script setup>
const supabase = useSupabaseClient()

const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_path = ref('')

loading.value = true
const user = useSupabaseUser()

let { data } = await supabase
  .from('profiles')
  .select(`username, website, avatar_url`)
  .eq('id', user.value.id)
  .single()

if (data) {
  username.value = data.username
  website.value = data.website
  avatar_path.value = data.avatar_url
}

loading.value = false

async function updateProfile() {
  try {
    loading.value = true
    const user = useSupabaseUser()

    const updates = {
      id: user.value.id,
      username: username.value,
      website: website.value,
      avatar_url: avatar_path.value,
      updated_at: new Date(),
    }

    let { error } = await supabase.from('profiles').upsert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    })
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    let { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <form class="form-widget text-stone-400 shadow-md rounded pb-8" @submit.prevent="updateProfile">
      <h3 class="pt-20 pb-5">Account</h3>
      <div class="">
      <div>
        <label class="block  dark:text-gray-300 text-base font-bold mb-2" for="email">Email</label>
        <div>{{ user.email }}</div>
      </div>
      <div class="mb-4">
        <span class="text-[#7C4771] cursor-pointer">edit</span>
      </div>
 
      </div>
    </form>
    <div class="py-4 w-full">
      <button class="button block bg-red-500 hover:bg-red-700 text-white font-bold py-2 focus:outline-none focus:shadow-outline px-4" @click="signOut" :disabled="loading">Sign Out</button>
    </div>
  </div>
</template>
