import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import TabNavigator from "./src/navigation/TabNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Status bar styling */}
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Wrap app content in SafeAreaView including bottom */}
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right", "bottom"]}>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
