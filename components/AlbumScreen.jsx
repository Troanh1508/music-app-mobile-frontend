import { View, Text, ScrollView} from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';
import Toast from 'react-native-toast-message';


export default function AlbumScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋'
    });}

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
            <Text>AlbumPage for ID: {id}</Text>
        </View>
        <Button
      title='Show toast'
      onPress={showToast}
    />
        
    </ScrollView>
  )
}