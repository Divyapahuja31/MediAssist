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
    paddingHorizontal: 28,
    paddingTop: 36,
    backgroundColor: "#fbfdff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 40,
    textAlign: "center",
  },
  image:{
    width: 350,
    height: 350,
    resizeMode: 'contain'
  },
  logoContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    width: "100%",
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20
  },
  forgotPasswordText: {
    color: '#6b7280',
    fontSize: 13
  },
  gradient: {
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
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
    marginVertical: 14,
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
    marginBottom: 6,
  },
  iconBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    borderRadius: 40,
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },
  signupText: {
    marginTop: 10,
    color: "#6b7280",
  },
});