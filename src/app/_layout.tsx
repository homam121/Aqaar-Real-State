import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Slot } from 'expo-router';
import "@/global.css";
import {useFonts} from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

SplashScreen.preventAutoHideAsync()

export default function AppLayout() {
  const [fontLoaded,error] =useFonts({
    "Rubik-Light" : require('@/assets/fonts/Rubik-Light.ttf'),
    "Rubik-Regular" : require('@/assets/fonts/Rubik-Regular.ttf'),
    "Rubik-Medium" : require('@/assets/fonts/Rubik-Medium.ttf'),
    "Rubik-SemiBold" : require('@/assets/fonts/Rubik-SemiBold.ttf'),
    "Rubik-Bold" : require('@/assets/fonts/Rubik-Bold.ttf'),
  })

  useEffect(()=>{
    if(fontLoaded||error){
      SplashScreen.hideAsync()
    }
  },[fontLoaded,error])

   if(!fontLoaded&&!error) return null

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {/* ClerkLoaded wraps your code cleanly without a fallback prop */}
      <ClerkLoaded>
        <SlotWrapper />
      </ClerkLoaded>
    </ClerkProvider>
  );
}

// A separate child wrapper checks if the layout is ready to prevent blank screens
function SlotWrapper() {
  return <Slot />;
}
