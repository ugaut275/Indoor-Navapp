import { Stack } from 'expo-router';
import { colors } from '../theme';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 20,
                },
                headerShadowVisible: true,
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
                    headerStyle: { backgroundColor: colors.secondary },
                    headerTintColor: colors.white,
                }}
            />
            <Stack.Screen 
                name="views/accountView"
                options={{ 
                    title: 'Profile',
                    headerStyle: { backgroundColor: colors.primary },
                    headerTintColor: colors.white,
                }}
            />
            <Stack.Screen 
                name="views/MapView"
                options={{ 
                    title: 'Navigation',
                    headerStyle: { backgroundColor: colors.primary },
                    headerTintColor: colors.white,
                }}
            />
        </Stack>
    );
}

