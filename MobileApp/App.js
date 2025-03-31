import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInPage from './logIn';
import SignUpPage from './signUp';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
    <NavigationContainer> 
      <Stack.Navigator initialRouteName="signUp">
        <Stack.Screen name="logIn" component={LogInPage} options={{title: 'Log in' }} />
        <Stack.Screen name="signUp" component={SignUpPage} options={{title: 'Sign up' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

