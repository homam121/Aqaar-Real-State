import { supabase } from '@/lib/supabase'
import AnimatedPropertyCard from '@/src/components/AnimatedPropertyCard'
import FeaturedCard, { FeaturedCardProps } from '@/src/components/FeaturedCard'
import { PropertyProps } from '@/src/types/types'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel'
import { SafeAreaView } from 'react-native-safe-area-context'

const SCALE_VALUES: [number, number, number] = [0.98,1,0.93]

const Home = () => {
  const [featuredData, setFeaturedData] = useState<PropertyProps[]>([])
  const [recommendedData, setRecommendedData] = useState<PropertyProps[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollEnabled, setScrollEnabled] = useState(true)
  
  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, []),
  )

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: featuredFetched } = await supabase
        .from('properties')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
      featuredFetched ? setFeaturedData(featuredFetched) : []

      const { data: recommendedFetched } = await supabase
        .from('properties')
        .select('*')
        .eq('is_featured', false)
        .order('created_at', { ascending: false })
      recommendedFetched ? setRecommendedData(recommendedFetched) : []
    } catch (error) {
      console.log('fetchData ERROR ::: ', error)
    } finally {
      setLoading(false)
    }
  }

  const router = useRouter()
  const { width, height } = Dimensions.get('window')
  const ref = React.useRef<ICarouselInstance>(null)
  const progress = useSharedValue<number>(0)
  const scrollY = useSharedValue<number>(0)

  // Stabilise callback so memoised header doesn't change
  const onPressPagination = useCallback((index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    })
  }, [])

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y
    },
  })

  const ITEM_HEIGHT = 140

  // 🔥 Memoise the header – it will NOT re-render when scrollEnabled changes
  const listHeaderCmpt = useMemo(() => (
    <View>
      <Text className="text-2xl font-rubik-semiBold ml-10 mb-8 color-TextColorPrimary">
        Featured Estates
      </Text>

      <Carousel
        onConfigurePanGesture={gesture => {
          'worklet'
          gesture.activeOffsetX([-2, 2])
          gesture.failOffsetY([-2, 2])
        }}
        ref={ref}
        loop
        autoPlay
        autoPlayInterval={3000}
        data={featuredData}
        onProgressChange={progress}
        // These callbacks now ONLY toggle state – carousel stays mounted
        onScrollStart={() => setScrollEnabled(false)}
        onScrollEnd={() => setScrollEnabled(true)}
        style={{
          width,
          height: height * 0.34,
          justifyContent: 'center',
        }}
        customAnimation={value => {
          'worklet'
          const scale = interpolate(
            value,
            [-1, 0, 1],
            [0.5, 1, 0.5],
            Extrapolation.CLAMP,
          )
          const translateX = interpolate(
            value,
            [-1, 0, 1],
            [-width * 0.85, 0, width * 0.85],
          )
          const rotateZ = interpolate(value, [-1, 0, 1], [-8, 0, 8])
          const opacity = interpolate(
            value,
            [-1, 0, 1],
            [0.6, 1, 0.6],
            Extrapolation.CLAMP,
          )
          const zIndex = interpolate(value, [-1, 0, 1], [5, 10, 5])

          return {
            transform: [{ scale }, { translateX }, { rotate: `${rotateZ}deg` }],
            opacity,
            zIndex,
          }
        }}
        renderItem={({ item, animationValue }: FeaturedCardProps) => (
          <FeaturedCard item={item} animationValue={animationValue} />
        )}
      />

      <ScrollView
        fadingEdgeLength={80}
        centerContent
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ alignSelf: 'center', marginHorizontal: 50 }}
        contentContainerStyle={{
          paddingHorizontal: 30,
          gap: 6,
          marginTop: 12,
        }}>
        <Pagination.Custom
          progress={progress}
          data={featuredData}
          dotStyle={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 50,
            width: 10,
            height: 10,
          }}
          activeDotStyle={{
            backgroundColor: 'rgba(255, 113, 76, 0.6)',
            width: 20,
          }}
          containerStyle={{ gap: 6 }}
          onPress={onPressPagination}
        />
      </ScrollView>

      <View className="mx-9 my-6">
        <View
          style={{ boxShadow: '0px 0px 20px rgba(13, 60, 54, 0.2)' }}
          className="flex-row justify-between items-center bg-white p-3 rounded-full">
          <Ionicons name="search" size={25} color="black" />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/Search')}>
            <Text className="font-rubik-regular text-SecondaryGry text-center text-base">
              Search properties, locations etc..
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            hitSlop={8}
            onPress={() => router.push('/Search?openFilters=true')}
            className=" p-1 rounded-xl">
            <Ionicons name="filter" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-2xl font-rubik-semiBold ml-10 mb-8 color-TextColorPrimary">
        Find Your Next Home
      </Text>
    </View>
  ), [featuredData, width, height, onPressPagination])

  return (
    <SafeAreaView className="flex-1">
      {loading ? (
        <View>
          <ActivityIndicator size={'large'} color={'#18685f'} />
          <Text className="text-center font-rubik-regular text-TextColorPrimary">
            Loading Your Dream House, Please Wait ...
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          scrollEnabled={scrollEnabled}
          nestedScrollEnabled={true}
          data={recommendedData}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={listHeaderCmpt}
          onScroll={scrollHandler}
          renderItem={({ item, index }) => (
            <AnimatedPropertyCard
              item={item}
              index={index}
              scrollY={scrollY}
              itemHeight={ITEM_HEIGHT}
              scaleValues={SCALE_VALUES}
            />
          )}
          ItemSeparatorComponent={() => <View className="py-2"></View>}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={8}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT + 16,
            offset: (ITEM_HEIGHT + 16) * index + 800,
            index,
          })}
        />
      )}
    </SafeAreaView>
  )
}

export default Home