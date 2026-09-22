import { formatPrice } from '@/lib/utils'
import Entypo from '@expo/vector-icons/Entypo'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image, Text, View } from 'react-native'
import { PropertyProps } from '../types/types'

interface PropertyCardProps {
  item: PropertyProps;
  showDescription?: boolean;
  showArea?:boolean;
}

const PropertyCard = ({ item, showDescription ,showArea}: PropertyCardProps) => {
  return (
    <View
      className='gap-3 bg-white justify-between '
      style={{
        borderTopLeftRadius: 125,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        marginHorizontal: 15,
      }}>
      <View className='flex-row gap-3 px-4 py-2 justify-between'>
        <View
          className='absolute top-0 z-20 right-0 px-4 py-0.5'
          style={{
            backgroundColor: 'rgba(13, 60, 54, 0.7)',
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 16,
            boxShadow: '0px 2px 3px rgba(0,0,0,0.25)',
          }}>
          <Text
            numberOfLines={1}
            className='text-right text-sm color-white font-rubik-semiBold'>
            {item.type}
          </Text>
        </View>
        <View
          style={{
            boxShadow: '0px 2px 5px rgba(0,0,0,0.25)',
            borderRadius: 24,
          }}>
          <Image
            source={{ uri: item.images[0] }}
            className='w-32 h-28 self-center'
            style={{ borderRadius: 24 }}
            resizeMode='cover'
          />
        </View>
        <View className='pl-3 pr-1 pb-1 pt-2  flex-1 justify-between gap-1 '>
          <View className=''>
            <View className='flex-row justify-between items-start gap-2'>
              <Text
                numberOfLines={1}
                className='font-rubik-semiBold text-lg color-TextColorPrimary pt-1 mb-1 pr-16'>
                {item.title}
              </Text>
            </View>
            <View className='gap-1'>
              <View className='flex-row'>
                <Entypo name='location' size={14} color='#0D3C36' />
                <Text
                  numberOfLines={1}
                  className='pl-1 text-sm font-rubik-light color-TextColorPrimary pr-5'>
                  {item.address}
                </Text>
              </View>
            </View>
          </View>

          <View className='justify-between pr-2 flex-row '>
            <View className='flex-row gap-3 self-center'>
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
              <View className='flex-row '>
                <View className=' w-5 justify-end '>
                  <Ionicons name='resize-sharp' size={15} color='#0D3C36' />
                </View>
                <Text className='text-sm font-rubik-light'>
                  {item.area_sqm}m²
                </Text>
              </View>
            </View>
            <Text className='text-SecondaryOrg font-rubik-semiBold'>
              {formatPrice(item.price)}
            </Text>
          </View>
        </View>
      </View>
      {showDescription && (
        <>
          <View className='border-[0.5px] mx-7 opacity-25'></View>
          <Text
            numberOfLines={4}
            className='px-7 pb-5 text-base font-rubik-regular color-TextColorPrimary'>
            {item.description}
          </Text>
        </>
      )}
    </View>
  )
}

export default PropertyCard
