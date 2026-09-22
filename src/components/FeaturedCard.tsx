import Entypo from '@expo/vector-icons/Entypo'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image, Text, View } from 'react-native'
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  
} from 'react-native-reanimated'
import { PropertyProps } from '../types/types'
import Animated from 'react-native-reanimated'
import { formatPrice } from '@/lib/utils'

export interface FeaturedCardProps {
  item: PropertyProps
  animationValue: any
}

const FeaturedCard = ({ item, animationValue }: FeaturedCardProps) => {
  const cardStyle = useAnimatedStyle(() => {
    const topRightRadius = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [50, 50, 16],
      Extrapolation.CLAMP,
    )
    const topLeftRadius = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [16, 50, 50],
      Extrapolation.CLAMP,
    )
    const evaluation = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [1, 3, 1],
      Extrapolation.CLAMP)
    return {
      borderTopLeftRadius: topLeftRadius,
      borderTopRightRadius: topRightRadius,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      elevation:evaluation
    }
  })
  return (
    <Animated.View
      style={[{
        marginHorizontal: 12,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
       
        width: '50%',
        alignSelf: 'center',
      },cardStyle]}>
      <Image
        source={{uri:item.images[0]}}
        className='w-full h-44'
        resizeMode='cover'
      />
      <View className='pl-3 pr-1 pb-3 pt-2 bg-white'>
        <View
          className='self-end px-2 rounded-tl-xl'
          style={{ backgroundColor: 'rgba(255, 113, 76, 0.8)' }}>
          <Text className='text-right text-sm color-white font-rubik-semiBold'>
            {item.type}
          </Text>
        </View>

        <Text
          numberOfLines={1}
          className='font-rubik-semiBold text-lg color-TextColorPrimary pt-1 mb-1'>
          {item.title}
        </Text>
        <View className='gap-1'>
          <View className='flex-row'>
            <Entypo name='location' size={14} color='#0D3C36' />
            <Text
              numberOfLines={1}
              className='pl-1 text-sm font-rubik-light color-TextColorPrimary pr-5'>
              {item.address}
            </Text>
          </View>

          <View className='flex-row gap-3'>
            <View className='flex-row '>
              <View className='w-5 justify-end'>
                <Ionicons name='bed' size={15} color='#0D3C36' />
              </View>
              <Text className='pl-1 text-sm font-rubik-light'>
                {item.bedrooms}
              </Text>
            </View>
            <View className='flex-row '>
              <View className=' w-5 justify-end pl-1 '>
                <FontAwesome5 name='toilet' size={14} color='#0D3C36' />
              </View>
              <Text className='pl-1 text-sm font-rubik-light'>
                {item.bathrooms}
              </Text>
            </View>
          </View>
        </View>
        <View className='self-end pr-2'>
          <Text className='text-SecondaryOrg font-rubik-semiBold'>
            {formatPrice(item.price)}
            
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}

export default FeaturedCard
