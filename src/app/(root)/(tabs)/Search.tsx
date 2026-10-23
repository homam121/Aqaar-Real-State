import { supabase } from '@/lib/supabase'
import AnimatedPropertyCard from '@/src/components/AnimatedPropertyCard'
import FiltersModal from '@/src/components/FiltersModal'
import { PropertyProps } from '@/src/types/types'
import useFilterStore from '@/store/useFilterStore'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'


const SCALE_VALUES: [number, number, number] = [0.95, 1, 0.95] 

const Search = () => {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>()
  const [result, setResult] = useState<PropertyProps[]>([])
  const { search, type, bedrooms, maxPrice, minPrice, setSearch } =
    useFilterStore()
  const [searchField, setSearchField] = useState('')
  const searchInputRef=useRef<TextInput>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeFilters = [type, bedrooms, maxPrice, minPrice]
    .map(v => v !== null)
    .filter(Boolean).length

  useEffect(() => {
    if(openFilters === 'true')  setShowModal(true) 
  }, [openFilters])

  const handleTextChange = useCallback(
    (text: string) => {
      setSearchField(text)
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
      debounceTimer.current = setTimeout(() => setSearch(text), 300)
    },
    [setSearch],
  )
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  useEffect(() => {
    fetchResult()
  }, [search, type, bedrooms, maxPrice, minPrice])

  const fetchResult = async () => {
    try{setLoading(true)
    let query = supabase.from('properties').select('*')
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,city.ilike.%${search}%,description.ilike.%${search}%`,
      )
    }
    if (type) {
      query = query.eq('type', type)
    }
    if (bedrooms) {
      query = query.eq('bedrooms', bedrooms)
    }
    if (minPrice) {
      query = query.gte('price', minPrice)
    }
    if (maxPrice) {
      query = query.lte('price', maxPrice)
    }
    const { data ,error} = await query.order('created_at', { ascending: false })
    if(error) {console.error("Error in FetchResult: ",error.message)}
    setResult(data ?? [])
    }
    catch(err){console.error('fetchResult function error',err)}
    finally{
      setLoading(false)
    }
  }

  {
    /* Animation Variables */
  }
  const scrollY = useSharedValue<number>(0)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y
    },
  })
  const ITEM_HEIGHT = 250

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 120],
      [25, 0],
      Extrapolation.CLAMP,
    )
    const opacity = interpolate(
      scrollY.value,
      [0, 120],
      [1, 0],
      Extrapolation.CLAMP,
    )
    const translateY = interpolate(
      scrollY.value,
      [0, 80],
      [0, -12],
      Extrapolation.CLAMP,
    )

    return {
      height,
      opacity,
      transform: [{ translateY }],
    }
  })
  //End of Animation Variables
  const listStickyHeaderCmpt = useMemo(
    () => (
      <>
        <Animated.View style={[titleAnimatedStyle]}>
          <Text className='text-2xl font-rubik-semiBold ml-10 color-TextColorPrimary'>
            Find Your Next Home
          </Text>
        </Animated.View>

        <View>
          <View className='px-9 py-5'>
            <TouchableOpacity
            hitSlop={5}
            onPress={()=>{if(searchInputRef.current)searchInputRef.current.focus()}}
              activeOpacity={0.7}
              style={{ boxShadow: '0px 0px 20px rgba(13, 60, 54, 0.2)' }}
              className='flex-row justify-between items-center bg-white pl-5 p-3 rounded-full'>
              <Ionicons name='search' size={25} color='black' />
              <TextInput
              ref={searchInputRef}
                hitSlop={{left:10,right:0,top:10,bottom:10}}
                selectionColor={'#FF714C'}
                className='font-rubik-regular flex-1 text-TextColorPrimary text-base px-5'
                placeholder='Search properties, locations etc..'
                placeholderTextColor={'#A0A1A0'}
                value={searchField}
                onChangeText={handleTextChange}
              />
              {searchField.trim() && (
                <TouchableOpacity
                  hitSlop={{left:10,right:0,top:10,bottom:10}}
                  className='mr-1'
                  onPress={() => {
                    setSearchField('')
                    setSearch('')
                  }}>
                  <Ionicons
                    name='close-circle-outline'
                    size={25}
                    color={'black'}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={0.5}
                hitSlop={{left:0,right:10,top:10,bottom:10}}
                onPress={() => {
                  setShowModal(!showModal)
                }}
                className=' p-1 rounded-xl'>
                <View className='relative'>
                  <Ionicons name='options-outline' size={24} color='black' />
                  {activeFilters > 0 && (
                    <View className='absolute -top-4 -right-3 bg-SecondaryOrg rounded-t-full rounded-br-full w-5'>
                      <Text className='font-rubik-semiBold color-white text-center text-sm'>
                        {activeFilters}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
      </>
    ),
    [
      activeFilters,
      searchField,
      showModal,
      titleAnimatedStyle,
      handleTextChange,
    ],
  )

  const renderItem = useCallback(
    ({ item, index }: { item: PropertyProps; index: number }) => (
      <AnimatedPropertyCard
        item={item}
        index={index}
        scrollY={scrollY}
        itemHeight={ITEM_HEIGHT}
        scaleValues={SCALE_VALUES}
        showDescription={true}
        showArea={true}
      />
    ),
    [ITEM_HEIGHT, scrollY],
  )
  
  return (
    <SafeAreaView className='flex-1 gap-5'>
      <Animated.FlatList
        ListHeaderComponent={listStickyHeaderCmpt}
        stickyHeaderIndices={[0]}
        data={result}
        keyExtractor={item => item.id.toString()}
        onScroll={scrollHandler}
        renderItem={renderItem}
        scrollEventThrottle={16}
        ItemSeparatorComponent={() => <View className='py-2'></View>}
        removeClippedSubviews={true}
        windowSize={5}
        initialNumToRender={8}
        
      />

      <FiltersModal visible={showModal} onClose={() => setShowModal(false)} />
    </SafeAreaView>
  )
}

export default Search
