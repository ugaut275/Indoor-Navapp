import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './views/LoginPage';
import SignUpScreen from './views/signUp';
import AccountView from './views/accountView';
const Stack = createNativeStackNavigator();

function App() {
    return (
        <Stack.Navigator initialRouteName="LoginPage">
            <Stack.Screen 
                name="LoginPage" 
                component={LoginPage}
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="SignUpScreen" 
                component={SignUpScreen}
                options={{ 
                    title: 'Create Account',
                    headerStyle: { backgroundColor: '#007AFF' },
                    headerTintColor: '#fff',
                }}
            />
                <Stack.Screen 
                name="accountView" 
                component={AccountView}
                options={{ 
                    title: 'Profile',
                    headerStyle: { backgroundColor: '#171a1fff' },
                    headerTintColor: '#ece6e6ff',
                
                }}
            />
        </Stack.Navigator>
    );
}

export default App;