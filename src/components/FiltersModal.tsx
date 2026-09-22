import useFilterStore from '@/store/useFilterStore'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useState } from 'react'
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import CustomButton from './CustomButton'

export default function FiltersModal({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: () => void
}) {
  const {
    type,
    bedrooms,
    maxPrice,
    minPrice,
    resetFilters,
    setBedrooms,
    setMaxPrice,
    setMinPrice,
    setType,
  } = useFilterStore()

  const [localMinPrice, setLocalMinPrice] = useState<string>(
    minPrice ? String(minPrice) : '',
  )
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(
    maxPrice ? String(maxPrice) : '',
  )

  const PROPERTY_TYPES: { label: string; value: string | null }[] = [
    { label: 'All', value: null },
    { label: 'Villa', value: 'villa' },
    { label: 'House', value: 'house' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'Studio', value: 'studio' },
  ]

  const BEDROOMS: { label: string; value: number | null }[] = [
    { label: 'Any', value: null },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '+4', value: 4 },
  ]

  const PRICE_PRESETS: {
    label: string
    valueMin: number | null
    valueMax: number | null
  }[] = [
    { label: 'Under 500k', valueMin: null, valueMax: 500000 },
    { label: '500k - 1M', valueMin: 500000, valueMax: 1000000 },
    { label: '1M - 3M', valueMin: 1000000, valueMax: 3000000 },
    { label: 'Above 3M', valueMin: 3000000, valueMax: null },
  ]

  const PRICE_CARDS: {
    label: string
    placeholder: string
    value: string
    onChangeValue: (value: string) => void
  }[] = [
    {
      label: 'Min Price',
      placeholder: 'e.g : 1000',
      value: localMinPrice,
      onChangeValue: setLocalMinPrice,
    },
    {
      label: 'Max Price',
      placeholder: 'e.g : 9999',
      value: localMaxPrice,
      onChangeValue: setLocalMaxPrice,
    },
  ]

  const activeFilters = [
    type,
    bedrooms,
    localMinPrice === '' ? null : localMinPrice,
    localMaxPrice === '' ? null : localMaxPrice,
  ]
    .map(v => v !== null)
    .filter(Boolean).length

  const onSubmitFunction = async () => {
    await setMinPrice(localMinPrice ? Number(localMinPrice) : null)
    await setMaxPrice(localMaxPrice ? Number(localMaxPrice) : null)
    await onClose()
  }

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      presentationStyle='overFullScreen'
      animationType='slide'
      transparent
      statusBarTranslucent>
      <View className='flex-1 justify-end '>
        <Pressable
          className='absolute inset-0 bg-black/15'
          onTouchStart={onClose}></Pressable>

        <View className='bg-white rounded-t-[50px] '>
          <View className='mt-8 mb-8 gap-6'>
            <View className='flex-row justify-between px-9'>
              <View className='flex-row gap-2 items-center'>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name='arrow-back-sharp' size={22} color={'black'} />
                </TouchableOpacity>
                <Text className='text-2xl font-rubik-bold  color-TextColorPrimary'>
                  Filters
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  resetFilters()
                  setLocalMinPrice('')
                  setLocalMaxPrice('')
                }}
                className='flex-row items-center gap-1'>
                <Ionicons name='reload-sharp' size={20} color={'#FF714C'} />
                <Text className='text-lg font-rubik-semiBold  color-SecondaryOrg'>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
            {/* Filter Body */}
            <View className='px-7 gap-2 '>
              {/* Property Type */}
              <View className='gap-3'>
                <Text className='text-xl font-rubik-semiBold  color-TextColorPrimary '>
                  Property Type
                </Text>
                <View className='flex-row flex-wrap gap-3 pl-3'>
                  {PROPERTY_TYPES.map(e => (
                    <View key={e.label}>
                      <TouchableOpacity
                        onPress={() => setType(e.value)}
                        style={[
                          {
                            borderWidth: 1.5,
                            borderColor: '#18685f',
                            borderRadius: 24,
                            boxShadow: '0px 1px 3px rgba(0,0,0,0.25)',
                          },
                          e.value === type && { backgroundColor: '#18685f' },
                        ]}
                        className='p-3'>
                        <Text
                          className={`font-rubik-medium text-TextColorPrimary ${e.value === type && 'text-white'}`}>
                          {e.label}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
              {/* Bedrooms */}
              <View className='gap-3'>
                <Text className='text-xl font-rubik-semiBold  color-TextColorPrimary '>
                  Bedrooms
                </Text>
                <View className='flex-row flex-wrap gap-3 pl-3'>
                  {BEDROOMS.map(e => (
                    <View key={e.label}>
                      <TouchableOpacity
                        onPress={() => setBedrooms(e.value)}
                        style={[
                          {
                            borderWidth: 1.5,
                            borderColor: '#18685f',
                            borderRadius: 24,
                            boxShadow: '0px 1px 3px rgba(0,0,0,0.25)',
                          },
                          e.value === bedrooms && {
                            backgroundColor: '#18685f',
                          },
                        ]}
                        className='p-3 w-16 items-center'>
                        <Text
                          className={`font-rubik-medium text-TextColorPrimary ${e.value === bedrooms && 'text-white'}`}>
                          {e.label}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
              {/* Price Input Fields + tags*/}
              <View className='gap-4'>
                <Text className='text-xl font-rubik-semiBold  text-TextColorPrimary '>
                  Price
                </Text>
                <View className='flex-row justify-evenly gap-5 px-3'>
                  {PRICE_CARDS.map(e => (
                    <View key={e.label} className='flex-1 relative '>
                      <View
                        className='absolute px-1 bg-white z-10'
                        style={{ top: -5, left: 10 }}>
                        <Text className='font-rubik-medium text-xs text-center text-primaryGrn'>
                          {e.label}
                        </Text>
                      </View>
                      <TextInput
                        keyboardType='number-pad'
                        value={e.value}
                        onChangeText={text => {
                          const cleanText = text.replace(/[^0-9]/g, '')
                          e.onChangeValue(cleanText)
                        }}
                        style={{
                          borderWidth: 1.5,
                          borderColor: '#18685f',
                          borderRadius: 18,
                          boxShadow: '0px 1px 3px rgba(0,0,0,0.25)',
                        }}
                        className={` text-TextColorPrimary text-lg px-5 font-rubik-regular `}
                        placeholder={e.placeholder}
                        selectionColor={'#FF714C'}
                        placeholderTextColor={'#A0A1A0'}
                      />
                    </View>
                  ))}
                </View>
                {/* We used a condition check the value of PRICE_PRESETS eq to the local prices if exists if its empty is it equal to null */}
                <View>
                  <View className='flex-row flex-wrap gap-3 pl-3'>
                    {PRICE_PRESETS.map(e => (
                      <View key={e.label}>
                        <TouchableOpacity
                          onPress={() => {
                            setLocalMinPrice(
                              e.valueMin ? String(e.valueMin) : '',
                            )

                            setLocalMaxPrice(
                              e.valueMax ? String(e.valueMax) : '',
                            )
                          }}
                          style={[
                            {
                              borderWidth: 1.5,
                              borderColor: '#18685f',
                              borderRadius: 24,
                              boxShadow: '0px 1px 3px rgba(0,0,0,0.25)',
                            },
                            e.valueMin ===
                              (localMinPrice === ''
                                ? null
                                : Number(localMinPrice)) &&
                              e.valueMax ===
                                (localMaxPrice === ''
                                  ? null
                                  : Number(localMaxPrice)) && {
                                backgroundColor: '#18685f',
                              },
                          ]}
                          className={`p-3 items-center `}>
                          <Text
                            className={`font-rubik-medium ${
                              e.valueMin ===
                                (localMinPrice === ''
                                  ? null
                                  : Number(localMinPrice)) &&
                              e.valueMax ===
                                (localMaxPrice === ''
                                  ? null
                                  : Number(localMaxPrice))
                                ? 'text-white'
                                : 'text-TextColorPrimary'
                            } }`}>
                            {e.label}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
            <View className='px-9 '>
              <CustomButton
                title={`Apply Filters ${activeFilters === 0 ? '' : `( ${activeFilters} )`}`}
                onPress={() => onSubmitFunction()}
                containerStyles={`${activeFilters === 0 ? 'opacity-60' : 'opacity-100'} bg-primaryGrn rounded-[18px]`}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
