import TextInputField from '@/src/components/TextInputField'
import { useAuth, useSignIn } from '@clerk/clerk-expo'
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

const signIn = () => {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const { isSignedIn } = useAuth()
  const { signIn, isLoaded, setActive } = useSignIn()

  const sendEmailCode = async () => {
    if (signIn?.status === 'needs_second_factor') {
      await signIn?.prepareSecondFactor({
        strategy: 'email_code',
      })
      console.log('sent')
    }
  }

  const onSignInPress = async () => {
    if (!isLoaded) return // Clerk structural safeguard
    setLoading(true)
    try {
      const signInAttempt = await signIn?.create({
        identifier: email,
        password,
      })

      if (signInAttempt?.status === 'complete') {
        await setActive({ session: signIn.createdSessionId })
        router.replace('/Home')
        console.log('signIn status === complete done')
      } else if (signInAttempt?.status === 'needs_second_factor') {
        await signIn.prepareSecondFactor({
          strategy: 'email_code',
        })
        console.log('MFA code dispatched, awaiting user verification step')
      } else {
        console.log(
          'Error at onSignInPress try{} Unhandled sign-in status context:',
          signInAttempt?.status,
        )
      }
    } catch (err: any) {
      console.log(
        'Error on ##onsignInPress## catch :',
        JSON.stringify(err, null, 2),
        err.errors[0].message
      )
      return
    } finally {
      setLoading(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return // Clerk structural safeguard
    setLoading(true)
    try {
      await signIn?.attemptSecondFactor({
        strategy: 'email_code',
        code,
      })

      if (signIn?.status === 'complete') {
        await setActive({
          session: signIn.createdSessionId,
        })

        router.replace('/Home')
      } else {
        console.error('onVerifyPress : sign up not completed', signIn)
      }
    } catch (error: any) {
      console.log('onVerifyPress catch error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (signIn?.status === 'complete' || isSignedIn) {
    router.replace('/Home')
    return
  }

  if (signIn?.status === 'needs_second_factor') {
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
                    keyboardType='number-pad'
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
              Welcome Back !
            </Text>
            <Text className='font-rubik-medium text-center px-7 pt-2'>
              Login to your account
            </Text>
            <View className='px-10 gap-5 mt-10'>
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
                    Don't you have an account?
                  </Text>
                  <Link href={'/sign-up'} asChild>
                    <Text className='font-rubik-semiBold text-SecondaryOrg '>
                      Sign Up {`>`}
                    </Text>
                  </Link>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className={`bg-SecondaryOrg elevation px-5 rounded-[10px] min-h-14 justify-center items-center `}
                  onPress={() => {
                    onSignInPress()
                  }}>
                  {loading ? (
                    <ActivityIndicator className='color-white' size={'large'} />
                  ) : (
                    <Text className={`font-rubik-semiBold text-lg text-white`}>
                      Sign In
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

export default signIn
