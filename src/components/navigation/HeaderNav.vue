<template>
  <v-app-bar elevation="2" style="background-color: #ff6600">
    <!-- Logo section: Aligns the logo to the start -->
    <v-img src="/public/sllogo.png" contain width="100" class="mr-4"></v-img>

    <v-btn text href="#">Requests</v-btn>
    <v-btn text href="#">Resources</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'HeaderNav',
}
</script>

<style scoped>
/* Optional: Style for buttons or app bar */
.v-app-bar {
  padding: 0 20px;
}

.v-btn {
  font-weight: bold;
  text-transform: none;
  color: #333;
}

.v-btn:hover {
  color: #4caf50; /* Add hover effect */
}

.v-img {
  max-width: 100px; /* Adjust logo width */
}
</style>
