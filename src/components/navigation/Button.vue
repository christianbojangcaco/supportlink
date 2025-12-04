<template>
  <button :class="['custom-button', variant]" :type="type" @click="$emit('click')">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'primary', // 'primary', 'secondary', 'danger', etc.
    },
    type: {
      type: String,
      default: 'button',
    },
  },
}
</script>

<style scoped>
.custom-button {
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
}
.custom-button.primary {
  background-color: #4caf50;
}
.custom-button.secondary {
  background-color: #2196f3;
}
.custom-button.danger {
  background-color: #f44336;
}
</style>
