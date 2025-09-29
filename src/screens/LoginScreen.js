import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  useWindowDimensions
} from "react-native";
import { TextInput, Text, Snackbar, IconButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext"; 

export default function LoginScreen({ navigation }) {
  const { login, loading, error } = useContext(AuthContext);
  const { width, height } = useWindowDimensions();
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
    } catch (e) {
    }
  };

  const styles = getStyles(width, height);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={styles.signupLink}>Sign Up</Text>
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

const getStyles = (width, height) => StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Math.max(20, width * 0.06),
    paddingTop: Platform.OS === "ios" ? Math.max(40, height * 0.05) : Math.max(30, height * 0.04),
    paddingBottom: 20,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: Math.min(32, Math.max(24, width * 0.075)),
    fontWeight: "700",
    marginTop: Math.max(10, height * 0.015),
    color: "#111827",
  },
  subtitle: {
    fontSize: Math.min(16, Math.max(13, width * 0.038)),
    color: "#6b7280",
    marginBottom: Math.max(20, height * 0.03),
    marginTop: Math.max(8, height * 0.01),
    textAlign: "center",
    lineHeight: Math.min(22, Math.max(18, width * 0.05)),
    paddingHorizontal: 10,
  },
  image: {
    width: Math.min(280, width * 0.7),
    height: Math.min(200, height * 0.25),
    resizeMode: "contain",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Math.max(15, height * 0.02),
  },
  input: {
    width: "100%",
    marginBottom: Math.max(12, height * 0.018),
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    fontSize: Math.min(16, Math.max(14, width * 0.04)),
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: Math.max(15, height * 0.02),
  },
  forgotPasswordText: {
    color: "#2563eb",
    fontSize: Math.min(15, Math.max(13, width * 0.037)),
    fontWeight: "500",
  },
  gradient: {
    paddingVertical: Math.max(14, height * 0.018),
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Math.max(10, height * 0.015),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  gradientText: {
    color: "#fff",
    fontSize: Math.min(18, Math.max(16, width * 0.045)),
    fontWeight: "700",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: Math.max(20, height * 0.025),
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
    marginBottom: Math.max(20, height * 0.025),
    paddingHorizontal: width * 0.1,
  },
  iconBtn: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    borderRadius: 50,
    width: Math.min(60, width * 0.15),
    height: Math.min(60, width * 0.15),
  },
  signupText: {
    marginTop: Math.max(15, height * 0.02),
    color: "#6b7280",
    fontSize: Math.min(15, Math.max(13, width * 0.037)),
    textAlign: "center",
  },
  signupLink: {
    color: "#1976d2",
    fontWeight: "600",
  },
});