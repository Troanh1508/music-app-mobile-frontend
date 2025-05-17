import { View, Text, Pressable, Alert } from 'react-native'
import React from 'react'
import styles from "../assets/styles/profile.styles";
import COLORS from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';

export default function LogoutButton() {

    const { logout } = useAuthStore();

    const confirmLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "Logout", onPress: () => logout(), style: "destructive" },
            ]
        );
    }

  return (
    <Pressable onPress={confirmLogout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={2} color={COLORS.white} />
        <Text style={styles.logoutText}>Logout</Text>
    </Pressable>
  )
}