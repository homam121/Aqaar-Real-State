import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { AnimatedPropertyCardProps } from '../types/types'
import PropertyCard from './PropertyCard'
import { memo } from 'react'

const AnimatedPropertyCard = ({
  item,
  index,
  scrollY,
  itemHeight,
  scaleValues,
  showDescription,
  showArea
}: AnimatedPropertyCardProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const itemOffset = index * itemHeight + 100
    const inputRange = [
      itemOffset - 400, // قبل ما يوصل للعنصر
      itemOffset - 100, // العنصر قرب يظهر
      itemOffset + 400, // بعد ما يتجاوز العنصر
    ]

    const opacity = interpolate(
      scrollY.value,
      inputRange,
      [0.98, 1, 0.9], // يبقى طبيعي -> طبيعي -> يتصغر بعد التجاوز
      Extrapolation.CLAMP,
    )

    const scale = interpolate(
      scrollY.value,
      inputRange,
      [scaleValues[0], scaleValues[1], scaleValues[2]], // يبقى طبيعي -> طبيعي -> يتصغر بعد التجاوز
      Extrapolation.CLAMP,
    )

    return {
      transform: [{ scale }],
      opacity: opacity,
    }
  })

  return (
    <Animated.View style={[animatedStyle]}>
      <PropertyCard item={item} showDescription={showDescription} showArea={showArea}/>
    </Animated.View>
  )
}

// Memoize to avoid re-renders when parent re-renders (e.g., typing in search)
export default memo(AnimatedPropertyCard, (prev, next) => {
  return (
    prev.item?.id === next.item?.id &&
    prev.index === next.index &&
    prev.itemHeight === next.itemHeight
  )
})
