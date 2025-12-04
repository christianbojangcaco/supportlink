<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabaseClient' // Ensure this path is correct

const notifications = ref([])

onMounted(async () => {
  const { data, error } = await supabase.from('notifications').select('*')
  if (error) {
    console.error('Error fetching notifications:', error)
    return
  }
  notifications.value = data
})
</script>

<template>
  <v-card>
    <v-card-title>Notifications</v-card-title>
    <v-list>
      <v-list-item v-for="notification in notifications" :key="notification.id">
        <template v-slot:default>
          <v-list-item-title>{{ notification.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style scoped>
.v-card {
  margin-top: 16px;
}
</style>
