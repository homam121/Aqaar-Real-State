import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Linking, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

export default function MapScreen() {
  const { latitude, longitude, title } = useLocalSearchParams<{
    latitude: string
    longitude: string
    title?: string
  }>()
  const router = useRouter()
  const [mapKey, setMapKey] = useState(0)

  const lat = parseFloat(latitude)
  const lng = parseFloat(longitude)

  const d = 0.0005
  const mapUrl = `https://openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 mx-[4%]'>
        {/* Header */}
        <View className='flex-row items-center mt-1 mb-3'>
          <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
            <Ionicons name='arrow-back-sharp' color='#0D3C36' size={45} />
          </TouchableOpacity>
          <Text
            numberOfLines={1}
            className='flex-1 ml-3 font-rubik-semiBold text-2xl text-TextColorPrimary'>
            {title}
          </Text>
        </View>

        {/* Full map */}
        <View
          className='flex-1 rounded-[20px] overflow-hidden'
          style={{ boxShadow: '0px 0px 8px rgba(0,0,0,0.25)' }}>
          <WebView key={mapKey} source={{ uri: mapUrl }} nestedScrollEnabled />

          {/* Back to property location */}
          <TouchableOpacity
            onPress={() => setMapKey((k) => k + 1)}
            hitSlop={8}
            className='absolute top-3 right-3 w-10 h-10 rounded-full bg-white items-center justify-center'
            style={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.3)' }}>
            <Ionicons name='locate' size={22} color='#0D3C36' />
          </TouchableOpacity>
        </View>

        {/* Open in Google Maps */}
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(`https://www.google.com/maps?q=${lat},${lng}`)
          }
          className='flex-row items-center justify-center gap-2 my-4 py-3 rounded-2xl bg-primaryGrn'>
          <Ionicons name='navigate-outline' size={22} color='white' />
          <Text className='font-rubik-semiBold text-lg text-white'>
            Open in Google Maps
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}