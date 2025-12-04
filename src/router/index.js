import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/utils/supabaseClient'

// Import components
import LandingPage from '@/components/LandingPage.vue'
import LogIn from '@/components/LogIn.vue'
import ClientResult from '@/components/ClientResult.vue'

async function authGuard(to, from, next) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.log('No user found, redirecting to login')
    next('/login')
  } else {
    console.log('User found, continuing navigation')
    next() // ✅ just allow navigation, don’t force redirect
  }
}

async function loginGuard(to, from, next) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.log('No user logged in, continue to login page')
    next()
  } else {
    console.log('User already logged in, redirecting to /landingpage')
    next('/landingpage') // ✅ redirect logged-in users to LandingPage
  }
}

const routes = [
  { path: '/', component: LogIn },
  { path: '/landingpage', component: LandingPage, beforeEnter: authGuard },
  { path: '/login', component: LogIn, beforeEnter: loginGuard },
  { path: '/clientresult/:trackingNumber', component: ClientResult, beforeEnter: authGuard },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Global navigation guard to handle logout and prevent accessing previous pages
router.beforeEach(async (to, from, next) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && to.path !== '/login' && to.path !== '/') {
    console.log('User logged out, redirecting to login page')
    next('/login') // ✅ only redirect if not already on login
  } else {
    next()
  }
})

export default router
