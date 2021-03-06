import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NativeBaseProvider } from "native-base";
import { SSRProvider } from '@react-aria/ssr'
import { ApolloProvider } from '@apollo/client';
import client from './lib/apollo/connection'
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import CustomDrawer from './src/components/CustomDrawer';
import Home from './src/screens/Home'
import LoginRouter from './src/navigation/LoginRouter';
import GempaRouter from './src/navigation/EarthquakeRouter';
import CuacaRouter from './src/navigation/WeatherRouter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import SplashScreen from "react-native-splash-screen";

import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Gradient from "./src/geoLocation/Gradient";
import AuthContext from "./src/context";
const Drawer = createDrawerNavigator();

export default function App() {
  let [access_token, setAT] = useState(null);

  const loginDrawer = () => {
    if (!access_token) {
      return (
        <Drawer.Screen
          name="LoginRouter"
          options={{
            title: "Masuk",
            drawerIcon: () => {
              return (
                <MaterialCommunityIcons name="login" size={25} color="#fff" />
              );
            },
          }}
          component={LoginRouter}
        />
      );
    }
  };
  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ access_token, setAT }}>
        <SSRProvider>
          <NativeBaseProvider>
            <NavigationContainer>
              <Drawer.Navigator
                useLegacyImplementation={true}
                initialRouteName="Home"
                drawerContent={(props) => <CustomDrawer {...props} />}
                screenOptions={{
                  headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: "#34495e",
                  },
                  headerTitleStyle: {
                    fontWeight: "bold",
                  },
                  headerTintColor: "#fff",
                  drawerStyle: {
                    backgroundColor: "#34495e",
                  },
                  drawerActiveTintColor: "#fff",
                  drawerInactiveTintColor: "#fff",
                  drawerLabelStyle: {
                    marginLeft: -25,
                    fontSize: 20,
                  },
                }}
              >
                <Drawer.Screen
                  name="Home"
                  options={{
                    title: "AlertMe!",
                    drawerIcon: () => {
                      return <Ionicons name="home" size={25} color="#fff" />;
                    },
                  }}
                  component={Home}
                />
                <Drawer.Screen
                  name="GempaRouter"
                  options={{
                    title: "Gempa",
                    drawerIcon: () => {
                      return (
                        <MaterialCommunityIcons
                          name="alert-octagram-outline"
                          size={25}
                          color="#fff"
                        />
                      );
                    },
                  }}
                  component={GempaRouter}
                />
                <Drawer.Screen
                  name="CuacaRouter"
                  options={{
                    title: "Cuaca",
                    drawerIcon: () => {
                      return (
                        <MaterialCommunityIcons
                          name="weather-pouring"
                          size={25}
                          color="#fff"
                        />
                      );
                    },
                  }}
                  component={CuacaRouter}
                />
                {loginDrawer()}
              </Drawer.Navigator>
            </NavigationContainer>
          </NativeBaseProvider>
        </SSRProvider>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}