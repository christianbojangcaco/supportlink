import { ref } from 'vue'
import { supabase } from './supabaseClient'

export const user = ref(null)

export const login = async (email, password) => {
  try {
    const {
      data: { user: loggedInUser },
      error,
    } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    user.value = loggedInUser
    console.log('User logged in:', user.value)
    return loggedInUser
  } catch (error) {
    console.error('Error in login function:', error)
    throw error
  }
}

export const logout = async () => {
  await supabase.auth.signOut()
  user.value = null
  console.log('User logged out')
}

// Define and export logActivity function
export const logActivity = async (activity) => {
  try {
    const { error } = await supabase.from('activity_logs').insert({ activity })
    if (error) throw error
    console.log('Activity logged:', activity)
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}
