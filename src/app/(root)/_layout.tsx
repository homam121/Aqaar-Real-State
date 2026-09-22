import useUserSync from '@/hooks/useUserSync'
import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Slot } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

export default function App() {
  const { isSignedIn, isLoaded }= useAuth()

  useUserSync()

  if (!isLoaded)
    return (
      <View className='justify-center items-center bg-pr'>
        <ActivityIndicator size={30} color={'#FF714C'} />
      </View>
    )

  if(isSignedIn) return <Slot/>
  return <Redirect href={'/(auth)/sign-in'} /> 
}
