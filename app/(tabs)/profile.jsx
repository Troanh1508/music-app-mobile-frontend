import { View, Text, ScrollView, RefreshControl } from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router';
import styles from '@/assets/styles/profile.styles';
import ProfileHeader from '@/components/ProfileHeader';
import LogoutButton from '@/components/LogoutButton';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function profile() {

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    // await sleep(2000);
    await loadData();
    setRefreshing(false);
  };

  const loadData = async () => {
      try {
        setLoading(true);
  
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      loadData();
    }, []);

    if (loading && !refreshing) return <LoadingSpinner message="Loading..." />;

  




  return (
    <ScrollView style={{ backgroundColor: "black", flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={"white"}
            />
          }
        >
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />
    </View>
    </ScrollView>

  )
}