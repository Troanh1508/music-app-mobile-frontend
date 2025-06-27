import { View, Text, ScrollView} from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


export default function ArtistScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
  return (
    <ScrollView>
        <View style={{ flexDirection: "row", padding: 12 }}>
            <Ionicons
                onPress={() => router.back()}
                name="arrow-back"
                size={24}
                color="black"
            />
        </View>
        <View>
            <Text>Artist Page for ID: {id}</Text>
        </View>
    </ScrollView>
  )
}