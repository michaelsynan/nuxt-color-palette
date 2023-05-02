<template>
  <div class="bg-stone-800 text-white p-4">
    <button @click="getUserPalettes">Get palettes</button>
  </div>
  <div>
   
    <!-- Render the palettes here -->
    <div v-for="(palette, index) in palettes" :key="index" class="palette-grid">
      <!-- Display a header for each palette -->
      <div class="palette-header">Palette {{ index + 1 }}</div>
      <div v-for="(color, colorIndex) in Object.entries(JSON.parse(palette.palette)).filter(([key]) => key.includes('-500'))" :key="colorIndex" :style="{ backgroundColor: color[1] }" class="color-swatch">
        <!-- Color swatch content -->
      </div>
      <i-mdi-trash @click="removePalette(index)" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';



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



// Add the removePalette function
async function removePalette(index) {
  const supabase = useSupabaseClient();
  const palette = palettes.value[index];

  if (!palette) {
    console.error('Invalid palette index:', index);
    return;
  }

  try {
    const { error } = await supabase
      .from('colors')
      .delete()
      .eq('id', palette.id); // Filter by palette id

    if (error) {
      throw error;
    }

    // Remove the palette from the palettes ref array
    palettes.value.splice(index, 1);
  } catch (err) {
    // Handle error (e.g., show an error message)
    console.error('Failed to delete color palette:', err);
  }
}

// Call the getUserPalettes method when the component is mounted
onMounted(getUserPalettes);
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