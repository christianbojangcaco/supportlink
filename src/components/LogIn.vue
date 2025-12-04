<template>
  <v-app>
    <v-responsive style="background-color: #a8e4ef">
      <v-row justify="center" class="pa-6" style="background-color: #a8e4ef">
        <v-col cols="12" md="5" class="text-center" style="margin-top: 50px">
          <v-row>
            <v-col cols="12" class="text-center">
              <v-sheet class="mx-auto" width="400">
                <!-- Email/Password Login -->
                <v-text-field v-model="email" label="Email" type="email" />
                <v-text-field v-model="password" label="Password" type="password" />
                <v-btn class="mt-2" block @click="login">Login</v-btn>

                <div class="d-flex align-center my-4">
                  <v-divider class="flex-grow-1" color="grey" />
                  <span class="mx-2">or</span>
                  <v-divider class="flex-grow-1" color="grey" />
                </div>

                <!-- Google Login -->
                <v-btn class="mt-2" block @click="signInWithGoogle">
                  <div class="d-flex align-center">
                    <img
                      src="@/assets/google_logo.png"
                      alt="Google Logo"
                      style="height: 15px"
                      class="mr-2"
                    />
                    <span>Continue with Google</span>
                  </div>
                </v-btn>
              </v-sheet>

              <!-- Sign Up Link -->
              <p class="mt-5">
                No account yet? Create account
                <a href="#" @click.prevent="showSignUp = true">here</a>
              </p>
            </v-col>
          </v-row>
        </v-col>

        <!-- Right: Description and Images -->
        <v-col cols="12" md="7">
          <v-img :src="slLogo" max-width="20%" class="mb-4 mx-auto" alt="SupportLink Logo" />
          <p>
            SupportLink is designed to support the functionality of a community aid platform aimed
            at helping social workers efficiently manage and respond to help requests from
            individuals within their community.
          </p>

          <v-row class="mt-4" justify="center">
            <v-col cols="12" sm="4" class="text-center">
              <v-img
                :src="donationImg"
                aspect-ratio="16/9"
                class="rounded-lg bounce-animation"
                alt="Community Support"
              />
            </v-col>
            <v-col cols="12" sm="4" class="text-center">
              <v-img
                :src="supportImg"
                aspect-ratio="16/9"
                class="rounded-lg bounce-animation"
                alt="Support Session"
              />
            </v-col>
            <v-col cols="12" sm="4" class="text-center">
              <v-img
                :src="foodImg"
                aspect-ratio="16/9"
                class="rounded-lg bounce-animation"
                alt="Volunteer Distribution"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Footer -->
      <v-footer style="background-color: #ff8c00" border app>
        <v-container>
          <v-row justify="space-between">
            <v-col cols="12" sm="6" class="text-center text-sm-start">
              <span>© 2025 - SupportLink | All Rights Reserved</span>
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

    <!-- Sign Up Popup -->
    <v-dialog v-model="showSignUp" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Sign Up</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="fullName" label="Full Name" required />
            <v-text-field v-model="signUpEmail" label="Email" type="email" required />
            <v-text-field v-model="signUpPassword" label="Password" type="password" required />
            <v-text-field v-model="familyNumber" label="Family Number (optional)" />
            <v-btn color="primary" block class="mt-3" @click="signUp">Sign Up</v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="showSignUp = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabaseClient.js'

import slLogo from '@/assets/images/sllogo.png'
import donationImg from '@/assets/images/donation.jpg'
import supportImg from '@/assets/images/support.jpg'
import foodImg from '@/assets/images/food.jpg'

const router = useRouter()

// login form fields
const email = ref('')
const password = ref('')

// sign up form fields
const showSignUp = ref(false)
const fullName = ref('')
const signUpEmail = ref('')
const signUpPassword = ref('')
const familyNumber = ref('')

// login with email + password
const login = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    console.error('Login failed:', error.message)
    alert('Login failed: ' + error.message)
  } else {
    console.log('Login success:', data)
    if (router.currentRoute.value.path !== '/landingpage') {
      router.push('/landingpage')
    }
  }
} // ✅ this closing brace was missing

// login with Google OAuth
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/landingpage`, // after login, redirect here
    },
  })

  if (error) {
    console.error('Google login failed:', error.message)
    alert('Google login failed: ' + error.message)
  }
}

// sign up new user (no email approval required)
const signUp = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: signUpEmail.value,
    password: signUpPassword.value,
    options: {
      emailRedirectTo: null, // disables redirect email flow
      data: {
        full_name: fullName.value,
        family_number: familyNumber.value || null,
      },
    },
  })

  if (error) {
    console.error('Sign up failed:', error.message)
    alert('Sign up failed: ' + error.message)
    return
  }

  console.log('Sign up success:', data)
  alert('Account created successfully! You are now logged in.')

  showSignUp.value = false
  if (router.currentRoute.value.path !== '/landingpage') {
    router.push('/landingpage')
  }
}

// check session on mount
onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) {
    console.log('User already logged in:', session.user)
    if (router.currentRoute.value.path !== '/landingpage') {
      router.push('/landingpage')
    }
  }
})
</script>

<style scoped>
* {
  font-family: 'Lucida Sans';
}
.text-h5 {
  font-size: 1rem;
}
.text-center {
  text-align: center;
}
.mt-4 {
  margin-top: 16px;
}
.mb-4 {
  margin-bottom: 16px;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.bounce-animation {
  animation: bounce 2s infinite;
}
</style>
