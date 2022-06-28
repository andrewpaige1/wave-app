// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Feed from './screens/Feed'
import Library from './screens/Library';
import Profile from './screens/Profile';
import Search from './screens/Search';
import NewFeed from './screens/NewFeed'
import { useContext } from 'react';
import { AuthContext } from './Store';
import Login from './screens/Login'
//import { Text } from 'react-native';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
function Home() {
  return (
    <Tab.Navigator
    
    
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'md-home'
        } else if (route.name === 'Library') {
          iconName = 'ios-albums'
        } else if (route.name === 'Profile') {
          iconName = 'ios-person'
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarInactiveTintColor: 'gray',
    })}
    
    
    
    
    
    
    >
      <Tab.Screen name="Home" component={Feed} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Library" component={Library} />
    </Tab.Navigator>
  );
}

function Index() {
  const [auth, setAuth] = useContext(AuthContext)
    
  if(auth) {
      return (
        <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeScreen"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Search" component={Search} />
        </Stack.Navigator>
      </NavigationContainer>
      )
  } else {

    return (
        <NavigationContainer>
            <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            </Stack.Navigator>
        </NavigationContainer>
    )


  }
}


export default Index;
