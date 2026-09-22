import { Dispatch, SetStateAction } from 'react'
import { Text, TextInput, View } from 'react-native'

interface TextInputFieldProps {
  title?: string
  placeholder?: string
  value: string
  onChangeText: Dispatch<SetStateAction<string>>
  keyboardType?: any
  secureTextEntry?: boolean
  autoCapitalize?: any
  textInputClassName?:string
}

const TextInputField = ({
  title,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry = false,
  autoCapitalize = 'none',
  textInputClassName
}: TextInputFieldProps) => {
  return (
    <View className='flex-1 relative '>
      <View className='absolute ml-3 px-1  bg-primary z-10'>
        <Text className='font-rubik-light text-xs '>{title}</Text>
      </View>
      <TextInput
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        className={`${textInputClassName} text-TextColorPrimary elevation shadow-md bg-primary border-[0.5px] my-2 border-FieldStroke rounded-[10px] text-l px-5 min-h-14 font-rubik-regular justify-center items-center `}
        placeholder={placeholder}
        selectionColor={'#FF714C'}
        autoCorrect={false}
      />
    </View>
  )
}

export default TextInputField
