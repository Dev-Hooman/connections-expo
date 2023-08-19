import React from 'react'

import { View, ActivityIndicator } from 'react-native';

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Context for user state handling
import { useAuthProvider } from '../context/AuthContext';

//screens import
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

//firebase imports
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';
import AddChatScreen from '../screens/AddChatScreen';
import ProfileScreen from '../screens/ProfileScreen';


const Stack = createNativeStackNavigator();


function AppNavigation() {
  const { user, setUser } = useAuthProvider()
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    return unsubscribeAuth;
  }, [user]);


  if (isLoading) {

    return (
      <View className="flex-1 justify-content items-center" >
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ?
      // Chatstack
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: true }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddChat" component={AddChatScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />

        </Stack.Navigator>

        :

        // AuthStack
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Signup' component={SignupScreen} />
        </Stack.Navigator>}
    </NavigationContainer>
  )
}

export default AppNavigation  