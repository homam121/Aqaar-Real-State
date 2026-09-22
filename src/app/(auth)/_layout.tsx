import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'
import { ActivityIndicator, View,Text } from 'react-native'

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded)
    return (
      <View className='justify-center items-center'>
        <ActivityIndicator size={30} color={'#FF714C'} />
        <Text className='text-center'>`We are in auth/_layout.tsx`</Text>
      </View>
    )

  if (isSignedIn) return <Redirect href={'/'} />

  return <Stack screenOptions={{headerShown:false}}/>
}
