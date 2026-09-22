import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from '@/src/components/CustomButton'
import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

const Profile = () => {
  const {signOut} =useAuth()
  const router = useRouter()
  return (
    <View>
      <Text>Profile</Text>
      <CustomButton title='Sign out' onPress={async () => {
        await signOut()
        router.replace('/(auth)/sign-in')
      }}/>
    </View>
  )
}

export default Profile