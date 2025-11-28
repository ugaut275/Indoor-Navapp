import { Stack } from 'expo-router';
import { colors } from '../theme';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.backgroundCard,
                },
                headerTintColor: colors.textPrimary,
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
                headerShadowVisible: false,
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="views/LoginPage"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="views/signUp"
                options={{
                    title: 'Create Account',
                    headerStyle: { backgroundColor: colors.backgroundCard },
                    headerTintColor: colors.primary,
                }}
            />
            <Stack.Screen
                name="views/PasswordRecovery"
                options={{
                    title: 'Password Recovery',
                    headerStyle: { backgroundColor: colors.backgroundCard },
                    headerTintColor: colors.primary,
                }}
            />
            <Stack.Screen
                name="views/accountView"
                options={{
                    title: 'Profile',
                    headerStyle: { backgroundColor: colors.backgroundCard },
                    headerTintColor: colors.primary,
                }}
            />
            <Stack.Screen
                name="views/MapView"
                options={{
                    title: 'Navigation',
                    headerStyle: { backgroundColor: colors.backgroundCard },
                    headerTintColor: colors.primary,
                }}
            />
        </Stack>
    );
}

