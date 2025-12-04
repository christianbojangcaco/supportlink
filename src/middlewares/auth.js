import { supabase } from '@/utils/supabaseClient' // Correct import path

export default async function auth(to, from, next) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    console.log('No user found or error occurred:', error)
    return next('/login')
  }
  console.log('User found:', user)
  next()
}
