import useSavedProperty from '@/hooks/useSavedProperty'
import { useSupabase } from '@/hooks/useSupabase'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { PropertyProps } from '@/src/types/types'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated'
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

export default function ProductScreen() {
  const { width } = useWindowDimensions()
  const [property, setProperty] = useState<PropertyProps | null>(null)
  const [expanded, setExpanded] = useState(false)
  const[imageViewerVisible,setImageViewerVisible]=useState(false)
  const [mapKey, setMapKey] = useState(0)
  const [scrollEnabled, setScrollEnabled] = useState(true)
  const { id } = useLocalSearchParams<{ id: string }>()
  const carouselRef = useRef<ICarouselInstance>(null)
  const progress = useSharedValue<number>(0)
  const router = useRouter()
  
  //const[loading,setLoading]=useState(true)

  const sliderWidth = width * 0.92
  const imageHeight = sliderWidth - sliderWidth * 0.3

  const images: string[] = property?.images ?? []


  useEffect(() => {
    if (id) {
      fetchDetails()
    }
  }, [id])

  const fetchDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setProperty(data)
      //setLoading(false)
    } catch (error) {
      console.log('ERROR caught from fetchDetails:', error)
    }
  }

  const onPressPagination = useCallback((index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    })
  }, [])

  const isLongDescription = (property?.description?.length ?? 0) > 200

  const descriptionText =
    expanded || !isLongDescription
      ? property?.description
      : property?.description.slice(0, 200) + '...'

  const latitude = property?.latitude ?? 33.5138
  const longitude = property?.longitude ?? 36.2765

  const d = 0.0005
  const mapUrl = `https://openstreetmap.org/export/embed.html?bbox=${longitude - d}%2C${latitude - d}%2C${longitude + d}%2C${latitude + d}&layer=mapnik&marker=${latitude}%2C${longitude}`

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView
        scrollEnabled={scrollEnabled}
        contentContainerClassName='grow mx-[4%]'
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} className='mt-1 mb-3'>
          <Ionicons
            name='arrow-back-sharp'
            color={'#0D3C36'}
            size={45}
            className='ml-2'
          />
        </TouchableOpacity>

        {/* Image Slider Section Container */}
        <View
          className='bg-gray-100 rounded-[20px] overflow-hidden'
          style={{
            height: imageHeight,
            boxShadow: '0px 0px 10px rgba(0,0,0,0.25)',
          }}>
          <Carousel
            ref={carouselRef}
            data={images}
            onProgressChange={progress}
            onConfigurePanGesture={gesture => {
              'worklet'
              gesture.activeOffsetX([-2, 2])
              gesture.failOffsetY([-5, 5])
            }}
            onScrollStart={() => setScrollEnabled(false)}
            onScrollEnd={() => setScrollEnabled(true)}
            style={{ width: sliderWidth, height: imageHeight }}
            customAnimation={value => {
              'worklet'
              const translateX = interpolate(
                value,
                [-1, 0, 1],
                [-sliderWidth, 0, sliderWidth],
              )
              const scale = interpolate(
                value,
                [-1, 0, 1],
                [1.25, 1, 1.25],
                Extrapolation.CLAMP,
              )
              const opacity = interpolate(
                value,
                [-1, 0, 1],
                [0, 1, 0],
                Extrapolation.CLAMP,
              )
              return {
                transform: [{ translateX }, { scale }],
                opacity,
              }
            }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                resizeMode='cover'
                style={{ width: sliderWidth, height: imageHeight }}
              />
            )}
          />
        </View>

        {/* Animated Paging Dots */}
        {images.length > 1 && (
          <View className='flex-row justify-between mx-[4%] my-3'>
            <View
              className='z-20 px-4 py-0.5 bg-[rgba(13,60,54,0.7)] rounded-tr-2xl rounded-bl-2xl'
              style={{ boxShadow: '0px 2px 3px rgba(0,0,0,0.25)' }}>
              <Text
                numberOfLines={1}
                className='text-right text-sm color-white font-rubik-semiBold'>
                {property?.type}
              </Text>
            </View>
            <Pagination.Custom
              progress={progress}
              data={images}
              dotStyle={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: 50,
                width: 12,
                height: 12,
              }}
              activeDotStyle={{
                backgroundColor: 'rgba(255, 113, 76, 0.6)',
                width: 25,
              }}
              containerStyle={{ gap: 6 }}
              onPress={onPressPagination}
            />
          </View>
        )}

        {/* Details Section */}
        <View className='px-2'>
          <Text className='font-rubik-semiBold text-3xl text-TextColorPrimary'>
            {property?.title}
          </Text>
          <View className='mt-3'>
            <Text className='font-rubik-regular text-lg leading-6 text-TextColorPrimary'>
              {descriptionText}
            </Text>
            {isLongDescription && (
              <Text
                onPress={() => setExpanded(!expanded)}
                className={`mt-1 font-rubik-medium text-xl leading-6 ${expanded ? 'text-primaryGrn opacity-35' : 'text-SecondaryOrg'}`}>
                {expanded ? 'Read Less' : 'Read More'}
              </Text>
            )}
          </View>
          <Text className='text-SecondaryOrg font-rubik-semiBold text-3xl text-right my-4'>
            {property?.price !== undefined
              ? formatPrice(property?.price)
              : 'Not Available'}
          </Text>

          {/* Badges */}
          <View className='flex-row items-center justify-around my-3 py-3 rounded-2xl bg-gray-100'>
            <Badge value={property?.type ?? ''} icon='home' />
            <Divider />
            <Badge value={property?.bedrooms ?? 0} icon='bed' />
            <Divider />
            <Badge value={property?.bathrooms ?? 0} FontAwesomeicon='toilet' />
            <Divider />
            <Badge value={`${property?.area_sqm ?? 0}m²`} icon='expand' />
          </View>

          {/* Map */}
          <View
            className='mt-4 mb-3 h-80 rounded-[20px] overflow-hidden'
            style={{ boxShadow: '0px 0px 5px rgba(0,0,0,0.2)' }}>
            <WebView
              key={mapKey}
              source={{ uri: mapUrl }}
              nestedScrollEnabled
            />

            {/* Back to property location */}
            <TouchableOpacity
              onPress={() => setMapKey(k => k + 1)}
              hitSlop={8}
              className='absolute top-3 right-3 w-10 h-10 rounded-full bg-white items-center justify-center'
              style={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.3)' }}>
              <Ionicons name='locate' size={22} color='#0D3C36' />
            </TouchableOpacity>
          </View>

          {/* Open full map */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(root)/property/map',
                params: {
                  latitude: String(latitude),
                  longitude: String(longitude),
                  title: property?.title ?? '',
                },
              })
            }
            className='flex-row items-center justify-center gap-2 mb-5 py-3 rounded-2xl bg-primaryGrn'>
            <Ionicons name='map-outline' size={22} color='white' />
            <Text className='font-rubik-semiBold text-lg text-white'>
              View full map
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const Divider = () => (
  <View className='w-[1.5px] h-9 rounded-full bg-primaryGrn opacity-30' />
)

const Badge = ({
  value,
  icon,
  FontAwesomeicon,
}: {
  value: number | string
  FontAwesomeicon?: keyof typeof FontAwesome5.glyphMap
  icon?: keyof typeof Ionicons.glyphMap
}) => (
  <View className='items-center'>
    {!!icon && <Ionicons name={icon} size={28} color={'#0D3C36'} />}
    {!!FontAwesomeicon && (
      <FontAwesome5 name={FontAwesomeicon} size={26} color={'#0D3C36'} />
    )}
    <Text className='font-rubik-semiBold text-lg'>{value}</Text>
  </View>
)
