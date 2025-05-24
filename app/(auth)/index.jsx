import { View, Text, TextInput, Pressable, ActivityIndicator} from 'react-native'
import { useState } from 'react'
import { Image } from "react-native";
import styles from '../../assets/styles/login.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { Link } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { Alert } from 'react-native';


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const {user, isLoading, login} = useAuthStore();

    const handleLogin = async() => {
        const result = await login(email, password);
        if(!result.success) Alert.alert("Error", result.error);
        
    }

    

    return (
        <View style={styles.container}>
            <View style={styles.topIllustration}>
                <Image
                    source={require("../../assets/images/spotify.png")}
                    style={styles.illustrationImage}
                    contentFit='contain'
                    transition={1000}
                />
            </View>

            <View style={styles.card}>
                <View style={styles.formContainer}>
                {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color={COLORS.primary}
                            style={styles.inputIcon}
                        />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor={COLORS.placeholderText}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    </View>
                    </View>
                {/* Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color={COLORS.primary}
                            style={styles.inputIcon}
                        />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor={COLORS.placeholderText}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <Pressable
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                        >
                        <Ionicons
                        name={showPassword ?  "eye-outline": "eye-off-outline"}
                        size={20}
                        color={COLORS.primary}
                        onPress={() => setShowPassword(!showPassword)}
                        />
                    </Pressable>

                    </View>
                    </View>
                    <Pressable style={styles.button} onPress={handleLogin}
                        disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </Pressable>
                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account?</Text>
                        <Link href="/signup" asChild>
                            <Pressable>
                                <Text style={styles.link}>Sign up</Text>
                            </Pressable>
                        </Link>
                    </View>
                </View>
            </View>

        </View>
    )
}