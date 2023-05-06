<template>
  <div>
    <h3 class="pb-6 text-2xl">Saved Palettes</h3>
    <!-- Render the palettes here -->
    <div
      v-for="(palette, index) in palettes"
      :key="index"
      class="palette-grid relative group border-b-2 border-stone-800 pb-3"
    >
      <!-- Display a header for each palette -->
      <!-- <div class="palette-header">Palette {{ index + 1 }}</div> -->
      <div
        v-for="(color, colorIndex) in Object.entries(JSON.parse(palette.palette)).filter(([key]) => key.includes('-500'))"
        :key="colorIndex"
        :style="{ backgroundColor: color[1] }"
        class="color-swatch"
      >
        <!-- Color swatch content -->
      </div>
      <div class="absolute top-1/2 transform -translate-y-1/2 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center pb-2">
        <i-mdi-clipboard @click="removePalette(palette)" class="text-xl cursor-pointer" />
        <i-mdi-trash @click="removePalette(palette)"  class="text-xl cursor-pointer"/>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watchEffect, inject } from 'vue';

const { emit } = defineEmits(['palette-saved', 'savedPalette']); // Define the 'palette-saved' and 'savedPalette' events



const props = defineProps({
  savedPalette: Object,
});

  // Get the authenticated user object
  const user = useSupabaseUser().value;

  const palettes = ref([]);
// Define the method to retrieve all saved color palettes by a particular user
async function getUserPalettes() {
  // Access the Supabase client
  const supabase = useSupabaseClient();

  // Get the authenticated user object
  const user = useSupabaseUser().value;

  // Check if the user is authenticated
  if (!user) {
    console.error('User is not authenticated');
    return;
  }

  // Get the authenticated user's UUID
  const userId = user.id;

  try {
    // Retrieve all color palettes where the public_id column matches the user's UUID
    const { data, error } = await supabase
      .from('colors')
      .select('*') // Select all columns
      .eq('public_id', userId); // Filter by user's UUID

    if (error) {
      throw error;
    }

    // Update the palettes reactive variable with the retrieved data
    palettes.value = data;
  } catch (err) {
    // Handle error (e.g., show an error message)
    console.error('Failed to retrieve color palettes:', err);
  }
}



async function removePalette(palette) {
  const supabase = useSupabaseClient();

  if (!palette) {
    console.error('Invalid palette:', palette);
    return;
  }

  try {
    const { error } = await supabase
      .from('colors')
      .delete()
      .eq('id', palette.id); // Make sure you are using the correct column and value

    if (error) {
      throw error;
    }

    // Remove the palette from the palettes ref array
    palettes.value = palettes.value.filter(p => p.id !== palette.id);
  } catch (err) {
    // Handle error (e.g., show an error message)
    console.error('Failed to delete color palette:', err);
  }
}

// Call the getUserPalettes method when the component is mounted
onMounted(getUserPalettes);

watchEffect(() => {
    // If the user is not authenticated, clear the palettes array
    if (!user) {
      palettes.value = [];
    }
  });




// Inject the triggerApiCallRef from the parent component
const triggerApiCallRef = inject('triggerApiCallRef');

const triggerApiCall = () => {
  console.log('turtles');
  getUserPalettes();
};

// Assign the triggerApiCall function to the triggerApiCallRef
triggerApiCallRef.value = triggerApiCall;


</script>

<style scoped>
.color-swatch {
  width: 50px;
  height: 50px;
  margin: 5px;
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  grid-gap: 5px;
  margin-bottom: 20px; /* Add some spacing between palettes */
}

.palette-header {
  grid-column: 1 / -1; /* Span the entire width of the grid */
  font-weight: bold;
  margin-bottom: 10px;
}
</style>