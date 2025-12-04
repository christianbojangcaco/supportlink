<template>
  <v-app>
    <v-responsive style="background-color: #a8e4ef">
      <!-- Header -->
      <v-app-bar color="primary" dark>
        <v-toolbar-title> Hi {{ lastName }} </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn outlined color="error" class="px-6 py-2" @click="logout"> Logout </v-btn>
      </v-app-bar>

      <!-- Body -->
      <v-container class="mt-10">
        <!-- Plus sign + Search -->
        <v-row align="center" class="mb-4 plus-row">
          <v-btn icon color="primary" class="plus-btn" @click="showRequestForm = true">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-text-field
            v-model="searchQuery"
            label="Search for tracking number"
            class="ml-4"
            clearable
          />
        </v-row>

        <!-- Table with logo watermark -->
        <div class="table-container">
          <v-card elevation="6" class="table-card">
            <v-simple-table class="full-width-table">
              <thead>
                <tr>
                  <th class="equal-col">Tracking Number</th>
                  <th class="equal-col">Status</th>
                  <th class="equal-col">Time & Date</th>
                  <!-- ✅ moved before Action -->
                  <th class="equal-col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredTracking" :key="item.number">
                  <td class="equal-col">{{ item.number }}</td>
                  <td class="equal-col">
                    <span :class="statusClass(item.status)">{{ item.status }}</span>
                  </td>
                  <td class="equal-col">
                    {{ formatDate(item.created_at) }}
                    <!-- ✅ show time/date -->
                  </td>
                  <td class="equal-col">
                    <v-btn color="primary" @click="goToClientResult(item.number)"> Track </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>

            <!-- Logo watermark -->
            <img :src="slLogo" alt="SupportLink Logo" class="logo-watermark" />
          </v-card>
        </div>
      </v-container>

      <!-- Footer -->
      <v-footer style="background-color: #ff8c00" border app>
        <v-container>
          <v-row justify="space-between">
            <v-col cols="12" sm="6" class="text-center text-sm-start">
              <span>© 2024 - SupportLink | All Rights Reserved</span>
            </v-col>
            <v-col cols="12" sm="6" class="text-center text-sm-end">
              <a href="/privacy-policy" class="footer-link">Privacy Policy</a>
              <span class="footer-divider mx-2">|</span>
              <a href="/terms-of-service" class="footer-link">Terms of Service</a>
              <span class="footer-divider mx-2">|</span>
              <a href="/faqs" class="footer-link">FAQs</a>
              <span class="footer-divider mx-2">|</span>
              <a href="/feedback" class="footer-link">Feedback</a>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-responsive>

    <!-- Request Form Popup -->
    <v-dialog v-model="showRequestForm" max-width="600">
      <v-card>
        <v-card-title class="text-h6">New Request</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitRequest">
            <v-select
              v-model="requestType"
              :items="['Financial', 'Shelter', 'Guidance']"
              label="Request Type"
              required
            />

            <!-- Conditional fields -->
            <v-text-field
              v-if="requestType === 'Financial' || requestType === 'Shelter'"
              v-model="familyMembers"
              label="Number of Family Members"
              type="number"
              required
            />

            <v-textarea v-model="details" label="Details" auto-grow required />

            <v-btn type="submit" color="primary" block class="mt-3">Submit</v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="showRequestForm = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabaseClient.js'

import slLogo from '@/assets/images/sllogo.png'

const router = useRouter()

// user full name
const fullName = ref('')
const lastName = computed(() => {
  if (!fullName.value) return ''
  const parts = fullName.value.trim().split(' ')
  return parts[parts.length - 1]
})

// tracking data from Supabase
const trackingList = ref([])
const searchQuery = ref('')
const filteredTracking = computed(() => {
  if (!searchQuery.value) return trackingList.value
  return trackingList.value.filter((item) =>
    item.number.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// request form
const showRequestForm = ref(false)
const requestType = ref('')
const familyMembers = ref('')
const details = ref('')

// fetch user info
onMounted(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    fullName.value = user.user_metadata?.full_name || user.email
    await loadTracking()
  } else {
    router.push('/login')
  }
})

// load tracking requests from Supabase (only for logged-in user)
const loadTracking = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data, error } = await supabase
    .from('requests')
    .select('tracking_number, status, created_at') // ✅ include created_at
    .eq('user_id', user.id)

  if (!error && data) {
    trackingList.value = data.map((r) => ({
      number: r.tracking_number,
      status: r.status,
      created_at: r.created_at,
    }))
  }
}

// logout
const logout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

// submit request
const submitRequest = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    alert('You must be logged in to submit a request.')
    return
  }

  // generate random tracking number
  const trackingNumber = Math.random().toString(36).substring(2, 10).toUpperCase()

  const newRequest = {
    tracking_number: trackingNumber,
    type: requestType.value,
    family_members:
      requestType.value === 'Financial' || requestType.value === 'Shelter'
        ? familyMembers.value
        : null,
    details: details.value,
    status: 'Pending',
    created_at: new Date(),
    user_id: user.id,
  }

  const { error } = await supabase.from('requests').insert([newRequest])

  if (error) {
    console.error('Error submitting request:', error.message)
    alert('Failed to submit request: ' + error.message)
    return
  }

  alert('Request submitted successfully! Tracking Number: ' + trackingNumber)
  showRequestForm.value = false
  requestType.value = ''
  familyMembers.value = ''
  details.value = ''

  await loadTracking()
}

// go to client result
const goToClientResult = (trackingNumber) => {
  router.push(`/clientresult/${trackingNumber}`)
}

// status color coding
const statusClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'status-pending'
    case 'In Transit':
      return 'status-transit'
    case 'Delivered':
      return 'status-delivered'
    default:
      return ''
  }
}

// format date helper
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.v-toolbar-title {
  font-weight: bold;
}

/* Table formatting */
.full-width-table {
  width: 100%; /* occupy full card width */
  table-layout: fixed; /* equal column widths */
  border-collapse: collapse;
  margin: 0 auto; /* center table inside card */
}

/* Force equal spacing for all columns */
.full-width-table th,
.full-width-table td {
  width: 25%; /* 4 equal columns */
  text-align: center; /* center horizontally */
  vertical-align: middle; /* center vertically */
  padding: 12px;
}

/* Status color coding */
.status-pending {
  color: orange;
  font-weight: bold;
}
.status-transit {
  color: blue;
  font-weight: bold;
}
.status-delivered {
  color: green;
  font-weight: bold;
}

/* Margin adjustments */
.plus-row {
  margin-top: 20px;
}
.plus-btn {
  margin-top: -20px;
}

/* Watermark logo */
.table-container {
  position: relative;
  display: flex;
  justify-content: center; /* ✅ center the table horizontally */
}
.table-card {
  position: relative;
  z-index: 2;
  width: 100%; /* ✅ card stretches full width */
}
.logo-watermark {
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.05;
  width: 40%;
  z-index: 1;
  pointer-events: none;
}
</style>
