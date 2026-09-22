import { createClerkSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@clerk/clerk-expo'
import { useMemo } from 'react'

export const useSupabase = () => {
  const { getToken } = useAuth()
  const client = useMemo(() => {
    return createClerkSupabaseClient(async () =>await getToken())
  }, [getToken])
  return client
}
