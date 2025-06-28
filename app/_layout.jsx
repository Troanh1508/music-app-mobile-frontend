import { Stack, useSegments, useRouter, SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AudioPlayerProvider } from '@/store/AudioPlayerProvider';

export default function RootLayout() {

  const router = useRouter();
  const segments = useSegments(); 

  const { checkAuth, user, token } = useAuthStore();


  useEffect(() => {
    checkAuth();
  },[]);

  // handle navigation based on auth state
  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) setImmediate(() => { router.replace("/(auth)"); });
    else if (isSignedIn && inAuthScreen) setImmediate(() => { router.replace("/(tabs)"); });
  }, [user, token, segments]);

  return ( 
    <AudioPlayerProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <SafeScreen>
            <Stack screenOptions={{headerShown: false}}>
              <Stack.Screen name="(tabs)"/>
              <Stack.Screen name="(auth)"/>
              <Stack.Screen
                name="player"
                options={{
                  presentation: 'card',
                  gestureEnabled: true,
                  gestureDirection: 'vertical',
                  animationDuration: 400,
                  headerShown: false,
                }}
              />
            </Stack>
          </SafeScreen> 
          <StatusBar style="light"/>
        </GestureHandlerRootView>
        <Toast/>
        
      </SafeAreaProvider>
    </AudioPlayerProvider>
  );
}
