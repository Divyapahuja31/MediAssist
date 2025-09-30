import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { TextInput, Text, Snackbar, IconButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login, loading, error } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    } catch {}
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />

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
            secureTextEntry={!showPassword}
            left={<TextInput.Icon name="lock" color="#6b7280" />}
            right={
              <TextInput.Icon
                name={showPassword ? "eye-off" : "eye"}
                color="#6b7280"
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => setErr("Forgot password flow not added yet")}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{ width: "100%" }}
          >
            <LinearGradient colors={["#4fc3f7", "#4dd0e1"]} style={styles.loginButton}>
              <Text style={styles.loginText}>
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
            {["google", "apple", "facebook"].map((icon) => (
              <IconButton
                key={icon}
                icon={icon}
                size={30}
                onPress={() => setErr("Social login not implemented")}
                style={styles.iconBtn}
              />
            ))}
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signupText}>
              Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#f9fafb",
  },
  logo: {
    width: 250,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  input: {
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    fontSize: 15,
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  iconBtn: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 60,
    height: 60,
  },
  signupText: {
    marginTop: 15,
    color: "#6b7280",
    fontSize: 14,
    textAlign: "center",
  },
  signupLink: {
    color: "#1976d2",
    fontWeight: "600",
  },
});
