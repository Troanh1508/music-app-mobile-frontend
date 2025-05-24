import { View, Text } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import styles from '../../assets/styles/profile.styles';
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';

export default function profile() {

    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const router = useRouter();




  return (
    <View style={styles.container}>
        <ProfileHeader/>
        <LogoutButton/>
    </View>
  )
}