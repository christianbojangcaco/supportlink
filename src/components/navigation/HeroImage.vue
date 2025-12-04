<template>
  <div class="hero-image">
    <img :src="imageSrc" :alt="altText" />
  </div>
</template>

<script>
export default {
  name: 'HeroImage',
  props: {
    imageSrc: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      default: 'Hero Image',
    },
  },
}
</script>

<style scoped>
.hero-image img {
  max-width: 75%; /* Resize image to 50% of its parent container */
  height: auto; /* Maintain aspect ratio */
  border-radius: 10px; /* Apply rounded borders */
  display: block; /* Center alignment adjustment */
  margin: 0 auto; /* Center horizontally within the parent container */
}
</style>
