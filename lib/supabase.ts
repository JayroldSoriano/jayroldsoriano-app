import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://eqxppxrprpqmvyarotzp.supabase.co'
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxeHBweHJwcnBxbXZ5YXJvdHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MzkyNjUsImV4cCI6MjA2NjIxNTI2NX0.g3lRkXtsFaopoATiwCtXj2EBKCbD6YuS5YbJgIHyzUI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
