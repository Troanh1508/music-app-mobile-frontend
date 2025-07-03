import { View, Text, ScrollView, FlatList} from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';
import { useMusicStore } from '../store/useMusicStore';
import { useEffect } from 'react';
import styles from '../assets/styles/home.styles';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';


export default function SingleScreen() {

    const { id } = useLocalSearchParams();
    const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", padding: 12 }}>
            <Ionicons
                onPress={() => router.back()}
                name="arrow-back"
                size={24}
                color="black"
            />
        </View>
    <View>
      <Text>SingleScreen for ID : {id}</Text>
    </View>
    </View>
  )
}