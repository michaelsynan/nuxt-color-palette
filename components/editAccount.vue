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
    <form class="form-widget bg-white dark:bg-stone-950 shadow-md rounded pb-8 flex-grow" @submit.prevent="updateProfile">
      <h2 class="pt-20 pb-5">Profile</h2>
      <div class="p-4">
      <div class="mb-4">
        <label class="block  dark:text-gray-300 text-sm font-bold mb-2" for="email">Email</label>
        <input id="email" type="text" :value="user.email" disabled class="shadow appearance-none border rounded w-full py-2 px-3 bg-stone-500 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="username">Username</label>
        <input id="username" type="text" v-model="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-stone-500 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="website">Website</label>
        <input id="website" type="url" v-model="website" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline" />
      </div>

      <div class="mb-2">
        <input
          type="submit"
          class="button primary block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :value="loading ? 'Loading ...' : 'Update'"
          :disabled="loading"
        />
      </div>
      </div>
    </form>
    <div class="py-4">
      <button class="button block w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" @click="signOut" :disabled="loading">Sign Out</button>
    </div>
  </div>
</template>
