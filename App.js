import React, { useContext } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import LoginScreen from "./src/screens/LoginScreen";
import TabNavigator from "./src/navigation/TabNavigator";
import OnboardingScreen1 from "./src/screens/OnboardingScreen1";
import OnboardingScreen2 from "./src/screens/OnboardingScreen2";
import OnboardingScreen3 from "./src/screens/Onboardingscreen3";

import { AuthProvider, AuthContext } from "./src/context/AuthContext";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (

        <Stack.Screen name="Home" component={TabNavigator} />
      ) : (

        <>
          <Stack.Screen
            name="OnboardingScreen1"
            component={OnboardingScreen1}
          />
          <Stack.Screen
            name="OnboardingScreen2"
            component={OnboardingScreen2}
          />
          <Stack.Screen
            name="OnboardingScreen3"
            component={OnboardingScreen3}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right", "bottom"]}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
