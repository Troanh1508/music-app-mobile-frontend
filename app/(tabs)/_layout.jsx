import { Stack, Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import FloatingPlayer from '@/components/FloatingPlayer';

export default function TabLayout() {
    const insets = useSafeAreaInsets();
  return (
    <>
        <Tabs screenOptions={{ 
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            headerTitleStyle: {
                color: COLORS.primary,
                fontWeight: 500,
            },
            headerShadowVisible: false,

            tabBarStyle: {
                            position: 'absolute',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            borderTopWidth: 0,
                            paddingTop: 8,
                            elevation: 0,
                        },
                        tabBarBackground: () => (
                            <BlurView
                                intensity={140}
                                tint="dark"
                                style={{
                                    ...StyleSheet.absoluteFillObject,
                                    overflow: 'hidden',
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                }}
                            />
                        ),
            }} >
            <Tabs.Screen name="(home)" options={{title:"Home",
            tabBarIcon: ({color, size}) => (
                <Ionicons name="home-outline" color={color} size={size} />
                ),
            }}/>
            <Tabs.Screen name="(search)" options={{title:"Search",
                tabBarIcon: ({color, size}) => (
                <Ionicons name="search-outline" color={color} size={size} />
                ),
            }} />

            <Tabs.Screen name="(favorite)" options={{title:"Favorites",
                tabBarIcon: ({color, size}) => (
                <Ionicons name="heart-outline" color={color} size={size} />
                ),
            }}/>
            <Tabs.Screen name="profile" options={{title:"Profile",
                tabBarIcon: ({color, size}) => (
                <Ionicons name="person-outline" color={color} size={size} />
                ),
            }} />
        </Tabs>

        <FloatingPlayer
                    style={{
                        position: 'absolute',
                        left: 8,
                        right: 8,
                        bottom: 78,
                    }}
        />
    </>

  );
}