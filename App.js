import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import TabNavigator from "./src/navigation/TabNavigator";
import OnboardingScreen1 from "./src/screens/OnboardingScreen1";
import OnboardingScreen2 from "./src/screens/OnboardingScreen2";
import OnboardingScreen3 from "./src/screens/Onboardingscreen3";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right", "bottom"]}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="OnboardingScreen1"   
          >
            <Stack.Screen name="OnboardingScreen1" component={OnboardingScreen1} />
          <Stack.Screen name="OnboardingScreen2" component={OnboardingScreen2} />
          <Stack.Screen name="OnboardingScreen3" component={OnboardingScreen3} />

            <Stack.Screen name="Home" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
