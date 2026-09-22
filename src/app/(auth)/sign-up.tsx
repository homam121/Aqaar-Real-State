import TextInputField from '@/src/components/TextInputField'
import { useAuth, useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignUp = () => {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const { isSignedIn } = useAuth()
  const { signUp, isLoaded, setActive } = useSignUp()

  const sendEmailCode = async () => {
    if (signUp?.status === 'missing_requirements') {
      await signUp?.prepareEmailAddressVerification({
        strategy: 'email_code',
      })
      console.log('sent')
    }
  }

  const onSignUpPress = async () => {
    if (!isLoaded) return // Clerk structural safeguard
    setLoading(true)
    try {
      const signUpAttempt = await signUp?.create({
        emailAddress: email,
        firstName,
        lastName,
        password,
      })
      if (signUpAttempt?.status === 'missing_requirements') {
        await signUp?.prepareEmailAddressVerification({
          strategy: 'email_code',
        })
        console.log('signUp?.prepareEmailAddressVerification done')
      }
    } catch (err: any) {
      console.log('Error on ##onsignUpPress## :', JSON.stringify(err, null, 2))
      return
    } finally {
      setLoading(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return // Clerk structural safeguard
    setLoading(true)
    try {
      await signUp?.attemptEmailAddressVerification({ code })

      if (signUp?.status === 'complete' && setActive) {
        await setActive({
          session: signUp.createdSessionId,
        })

        router.replace('/Home')
      } else {
        console.error('onVerifyPress : sign up not completed', signUp)
      }
    } catch (error: any) {
      console.log('onVerifyPress catch error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (signUp?.status === 'complete' || isSignedIn) {
    router.replace('/Home')
    return
  }

  if (
    signUp?.status === 'missing_requirements' &&
    signUp?.unverifiedFields.includes('email_address') &&
    signUp?.missingFields.length === 0
  ) {
    return (
      <SafeAreaView className='bg-primary flex-1'>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps='handled'>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
            className='justify-center flex-1'>
            <View className='justify-center items-center flex-[0.3]'>
              <Image
                className='w-72 h-40'
                source={require('@/assets/Aqaar_Logo.png')}
                resizeMode='contain'
              />
            </View>
            <View className='flex-[0.5]'>
              <Text className='font-rubik-semiBold text-3xl text-center text-TextColorPrimary'>
                Verify Email
              </Text>
              <Text className='font-rubik-medium text-center px-7 pt-2'>
                We send a code to{' '}
                <Text className='font-rubik-medium text-center px-7 pt-2 text-SecondaryOrg'>
                  {email}
                </Text>
              </Text>
              <View className='px-10 gap-5 mt-10'>
                <View className='flex-1 mx-32'>
                  <TextInputField
                    title='Code'
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    textInputClassName='text-center'
                    
                  />
                </View>
                <View className='flex-1 mt-10 flex-row justify-between'>
                  <View>
                    <Text className='font-rubik-medium text-TextColorPrimary'>
                      You didn't receive a code?
                    </Text>
                    <Pressable
                      onPress={() => {
                        sendEmailCode()
                      }}>
                      <Text className='font-rubik-semiBold text-SecondaryOrg '>
                        Resend {`🔄️`}
                      </Text>
                    </Pressable>
                  </View>
                  <TouchableOpacity
                    disabled={loading}
                    activeOpacity={0.7}
                    className={`bg-SecondaryOrg min-w-28 elevation px-5 rounded-[10px] min-h-14 justify-center items-center `}
                    onPress={() => {
                      onVerifyPress()
                    }}>
                    {loading ? (
                      <ActivityIndicator
                        className='color-white'
                        size={'large'}
                      />
                    ) : (
                      <Text
                        className={`font-rubik-semiBold text-lg text-white`}>
                        Confirm
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <View className='justify-center  mb-16'>
          <Text className='font-rubik-regular text-center text-SecondaryGry text-sm'>
            All Rights Reserved For Aqaar©
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
          className='justify-center flex-1'>
          <View className='justify-center items-center flex-[0.3]'>
            <Image
              className='w-72 h-40'
              source={require('@/assets/Aqaar_Logo.png')}
              resizeMode='contain'
            />
          </View>
          <View className='flex-[0.5]'>
            <Text className='font-rubik-semiBold text-3xl text-center text-TextColorPrimary'>
              Create Account
            </Text>
            <Text className='font-rubik-medium text-center px-7 pt-2'>
              Join us and make your first step of finding your dream house
            </Text>
            <View className='px-10 gap-5 mt-10'>
              <View className='flex-row gap-5'>
                <TextInputField
                  title='First Name'
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize={'words'}
                />
                <TextInputField
                  title='Last Name'
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize={'words'}
                />
              </View>
              <TextInputField
                title='Email'
                keyboardType={'email-address'}
                value={email}
                onChangeText={setEmail}
              />
              <TextInputField
                title='Password'
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              <View className='flex-row justify-between mt-10'>
                <View>
                  <Text className='font-rubik-medium text-TextColorPrimary'>
                    Already have an account?
                  </Text>
                  <Link href={'/sign-in'} asChild>
                    <Text className='font-rubik-semiBold text-SecondaryOrg '>
                      Sign In {`>`}
                    </Text>
                  </Link>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className={`bg-SecondaryOrg elevation px-5 rounded-[10px] min-h-14 justify-center items-center `}
                  onPress={() => {
                    onSignUpPress()
                  }}>
                  {loading ? (
                    <ActivityIndicator className='color-white' size={'large'} />
                  ) : (
                    <Text className={`font-rubik-semiBold text-lg text-white`}>
                      Sign Up
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* <View className='justify-center mt-28 flex-[0.2]'>
            <Text className='font-rubik-regular text-center text-SecondaryGry text-sm'>
              All Rights Reserved For Aqaar©
            </Text>
          </View> */}
        </KeyboardAvoidingView>
      </ScrollView>
      <View className='justify-center  mb-16'>
        <Text className='font-rubik-regular text-center text-SecondaryGry text-sm'>
          All Rights Reserved For Aqaar©
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default SignUp
