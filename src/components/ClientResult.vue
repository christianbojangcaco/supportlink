<template>
  <v-app>
    <v-responsive style="background-color: #f5f5f5">
      <!-- Header -->
      <v-app-bar color="primary" dark>
        <v-toolbar-title class="text-center w-100"> Tracking Details </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn outlined color="secondary" @click="goBack"> Back to Landing Page </v-btn>
      </v-app-bar>

      <!-- Body -->
      <v-container class="mt-10 d-flex justify-center">
        <v-card elevation="6" class="pa-6 text-center" max-width="800">
          <v-card-title class="text-h6 justify-center"> Request Information </v-card-title>
          <v-card-text>
            <v-alert type="error" v-if="!request.tracking_number">
              No request found or you don’t have permission to view this tracking number.
            </v-alert>

            <v-simple-table v-else class="mx-auto two-col-table">
              <tbody>
                <tr>
                  <td class="label">Full Name</td>
                  <td class="data">{{ userFullName }}</td>
                </tr>
                <tr>
                  <td class="label">Email</td>
                  <td class="data">{{ userEmail }}</td>
                </tr>
                <tr>
                  <td class="label">Family Members</td>
                  <td class="data">{{ request.family_members || 'N/A' }}</td>
                </tr>
                <tr>
                  <td class="label">Request Type</td>
                  <td class="data">{{ request.type }}</td>
                </tr>
                <tr>
                  <td class="label">Request Details</td>
                  <td class="data">{{ request.details }}</td>
                </tr>
                <tr>
                  <td class="label">Tracking Number</td>
                  <td class="data">{{ request.tracking_number }}</td>
                </tr>
                <tr>
                  <td class="label">Status</td>
                  <td class="data">
                    <v-chip :color="statusColor(request.status)" dark class="ma-2">
                      {{ request.status }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-responsive>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/utils/supabaseClient.js'

const route = useRoute()
const router = useRouter()

const request = ref({})
const userFullName = ref('')
const userEmail = ref('')

// fetch request by tracking number with auth + ownership check
onMounted(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    router.push('/login') // redirect if not logged in
    return
  }

  const trackingNumber = route.params.trackingNumber
  const { data, error } = await supabase
    .from('requests')
    .select('tracking_number, type, family_members, details, status, user_id')
    .eq('tracking_number', trackingNumber)
    .eq('user_id', user.id) // ✅ enforce ownership
    .single()

  if (!error && data) {
    request.value = data
    // pull user info from auth metadata
    userFullName.value = user.user_metadata?.full_name || 'N/A'
    userEmail.value = user.email || 'N/A'
  } else {
    console.error('Error fetching request:', error?.message)
    request.value = {} // show alert
  }
})

// back button
const goBack = () => {
  router.push('/landingpage')
}

// status chip color coding
const statusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'orange'
    case 'In Transit':
      return 'blue'
    case 'Delivered':
      return 'green'
    default:
      return 'grey'
  }
}
</script>

<style scoped>
.v-toolbar-title {
  font-weight: bold;
  text-align: center;
  width: 100%;
}

/* Center container with side margins */
.v-container {
  display: flex;
  justify-content: center;
  margin-left: 150px;
  margin-right: 150px;
}

/* Center card content */
.v-card {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

/* Two-column table formatting */
.two-col-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto; /* ✅ centers the table itself */
}

.two-col-table td {
  padding: 12px;
  vertical-align: middle;
}

/* Label column styling */
.label {
  text-align: left; /* ✅ left-aligned text */
  font-weight: bold;
  width: 40%;
  /* ✅ shaded background for labels */
}

/* Data column styling */
.data {
  text-align: left; /* ✅ left-aligned text */
  width: 60%;
}
</style>
