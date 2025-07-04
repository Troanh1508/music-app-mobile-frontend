import { Stack } from 'expo-router';
import { colors } from '@/constants/tokens';

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="addToPlaylist"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
