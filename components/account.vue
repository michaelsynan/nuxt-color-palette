<script setup>
const client = useSupabaseClient()

const user = useSupabaseUser()
const email = ref('')
const loading = ref(true)
const editing = ref(false)
loading.value = true


let { data } = await client
  .from('auth')
  .select(`email`)
  .eq('user_id', user.value.id)
  .single()

if (data) {
  email.value = user.value.email // Initialize email ref with user.email
}

loading.value = false

function saveEmail() {
  toggleEditing();
  updateEmail();
}

// Initialize email ref with user.email
watchEffect(() => {
  if (user.value) {
    email.value = user.value.email
  }
})

const newEmail = ref('')


    const updateEmail = async () => {
      const supabase = useSupabaseAuthClient()
      console.log('newEmail', email.value)
      const { user, error } = await supabase.auth.updateUser({
        email: email.value,
      })
   
        
      if (error) {
        console.error(error)
      } else {
        console.log('Email updated successfully')
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

function toggleEditing() {
  editing.value = !editing.value;
}

</script>

<template>
  <div class="flex flex-col px-2">
    <h3 class="pb-5">Account</h3>
    <form class="form-widget text-stone-400 pb-8 border-b-2 border-stone-600 mb-4" @submit.prevent="updateProfile">
      <div class="">
      <div>
        <label class="block  dark:text-gray-300 text-base font-bold mb-2" for="email">Email</label>
        <div v-if="editing">
          <input id="email" type="text" v-model="email" class="py-1.5 border-b border-white bg-transparent focus:outline-none focus:ring-0" />        
        </div>
        <div class="py-1.5 border-b border-[#0f0f0f]" v-else>{{ user.email }}</div>
      </div>
      <div class="mb-4">
        <span class="text-[#7C4771] cursor-pointer" v-if="!editing" @click="toggleEditing">edit</span>
        <span class="text-[#7C4771] cursor-pointer" v-else @click="saveEmail">save</span>
      </div>
      </div>
    </form>
    <div class="pt-4 w-full">
      <button class="button block bg-red-500 hover:bg-red-700 text-white font-bold py-2 focus:outline-none focus:shadow-outline px-4" @click="signOut" :disabled="loading">Sign Out</button>
    </div>
  </div>
</template>