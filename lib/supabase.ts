import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!

//this for public read
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// authenticated client - In this we will attach clerk JWT(getToken())  and pass it to this func
export const createClerkSupabaseClient = (
  getToken: () => Promise<string | null>,
) => {
    return createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            async accessToken() {
                return getToken()
            },
        }
    )
}
