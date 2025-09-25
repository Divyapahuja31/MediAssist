import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,Image
} from "react-native";
import { TextInput, Text, Snackbar, IconButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {
  const { login, loading, error } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (error) setErr(error);
  }, [error]);

  const handleLogin = async () => {
    if (!email || !password) {
      setErr("Please enter email and password");
      return;
    }
    try {
      await login(email, password);
    } catch (e) {
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
            <Image source={require("../../assets/logo.png")} style={styles.image} />
        </View>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>
          Your Personal Health & Medicine Management
        </Text>

        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          left={<TextInput.Icon name="email" color="#6b7280" />}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          left={<TextInput.Icon name="lock" color="#6b7280" />}
          style={styles.input}
        />
        
        <TouchableOpacity onPress={() => setErr("Forgot password flow not added yet")} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{ width: "100%" }}
        >
          <LinearGradient
            colors={["#4fc3f7", "#4dd0e1"]}
            style={styles.gradient}
            start={[0, 0]}
            end={[1, 0]}
          >
            <Text style={styles.gradientText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.orRow}>
          <View style={styles.line} />
          <Text style={{ marginHorizontal: 10 }}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <IconButton
            icon="google"
            size={30}
            onPress={() => setErr("Social login not implemented")}
            style={styles.iconBtn}
          />
          <IconButton
            icon="apple"
            size={30}
            onPress={() => setErr("Social login not implemented")}
            style={styles.iconBtn}
          />
          <IconButton
            icon="facebook"
            size={30}
            onPress={() => setErr("Social login not implemented")}
            style={styles.iconBtn}
          />
        </View>

        <TouchableOpacity onPress={() => setErr("Sign up flow not added yet")}>
          <Text style={styles.signupText}>
            Don't have your account?{" "}
            <Text style={{ color: "#1976d2" }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <Snackbar
          visible={!!err}
          onDismiss={() => setErr("")}
          action={{ label: "OK", onPress: () => setErr("") }}
        >
          {err}
        </Snackbar>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 24, 
      paddingTop: 48, 
      backgroundColor: "#f9fafb", 
    },
    title: {
      fontSize: 30,
      fontWeight: "700",
      marginTop: 16, 
      color: "#111827", 
    },
    subtitle: {
      fontSize: 14, 
      color: "#6b7280",
      marginBottom: 32, 
      textAlign: "center",
      lineHeight: 20, 
    },
    image: {
      width: 280, 
      height: 280,
      resizeMode: "contain",
    },
    logoContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16, 
    },
    input: {
      width: "100%",
      marginBottom: 16, 
      backgroundColor: "#fff",
      borderRadius: 10, 
      borderWidth: 1,
      borderColor: "#d1d5db", 
      paddingHorizontal: 12, 
      height: 50, 
    },
    forgotPassword: {
      width: "100%",
      alignItems: "flex-end",
      marginBottom: 24, 
    },
    forgotPasswordText: {
      color: "#2563eb",
      fontSize: 14,
      fontWeight: "500",
    },
    gradient: {
      paddingVertical: 14,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16, 
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    gradientText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "700",
    },
    orRow: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      marginVertical: 24, 
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: "#e5e7eb",
    },
    socialRow: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-around",
      marginBottom: 24, 
    },
    iconBtn: {
      borderWidth: 1,
      borderColor: "#d1d5db",
      backgroundColor: "#fff",
      borderRadius: 40,
      width: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
    },
    signupText: {
      marginTop: 16, 
      color: "#6b7280",
      fontSize: 14,
      textAlign: "center",
    },
  });