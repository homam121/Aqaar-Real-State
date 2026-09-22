import { useAuth } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

export default function App() {
  const { isSignedIn, isLoaded }= useAuth()

  if (!isLoaded)
    return (
      <View className='justify-center items-center bg-pr'>
        <ActivityIndicator size={30} color={'#FF714C'} />
      </View>
    )

  return isSignedIn ? (
    <Redirect href={'/(root)/(tabs)/Search'} />
  ) : (
    <Redirect href={'/(auth)/sign-in'} />
  )
}
