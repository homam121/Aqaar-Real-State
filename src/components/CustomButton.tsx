import { Text, TouchableOpacity } from 'react-native'

interface CustomButtonProps {
  title: string
  onPress: () => void
  textStyles?: string
  containerStyles?: string
}

const CustomButton = ({
  title,
  onPress,
  textStyles,
  containerStyles,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{boxShadow: '0px 2px 3px rgba(0,0,0,0.25)'}}
      className={`bg-SecondaryOrg px-5 rounded-[10px] min-h-14 justify-center items-center  ${containerStyles}`}
      onPress={onPress}>
      <Text className={`font-rubik-semiBold text-lg text-white ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomButton
