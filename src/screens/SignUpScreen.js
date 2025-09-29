import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { TextInput, Text, Snackbar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

export default function SignUpScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [err, setErr] = useState("");

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      setErr("All fields are required");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    // Add sign-up logic here
    setErr("Sign up successful! Please login.");
    setTimeout(() => {
      navigation.navigate("Login");
    }, 1500);
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          left={<TextInput.Icon name="account" color="#6b7280" />}
          style={styles.input}
        />

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

        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          left={<TextInput.Icon name="lock" color="#6b7280" />}
          right={
            <TextInput.Icon
              name={showConfirmPassword ? "eye-off" : "eye"}
              color="#6b7280"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleSignUp}
          style={{ width: "100%" }}
        >
          <LinearGradient
            colors={["#4fc3f7", "#4dd0e1"]}
            style={styles.gradient}
            start={[0, 0]}
            end={[1, 0]}
          >
            <Text style={styles.gradientText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>Login</Text>
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
    paddingTop: Platform.OS === "ios" ? Math.max(50, height * 0.06) : Math.max(40, height * 0.05),
    paddingBottom: 20,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: Math.min(32, Math.max(24, width * 0.075)),
    fontWeight: "700",
    marginBottom: Math.max(8, height * 0.01),
    color: "#111827",
  },
  subtitle: {
    fontSize: Math.min(16, Math.max(13, width * 0.038)),
    color: "#6b7280",
    marginBottom: Math.max(25, height * 0.035),
    textAlign: "center",
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
  gradient: {
    paddingVertical: Math.max(14, height * 0.018),
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Math.max(15, height * 0.02),
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
  loginText: {
    marginTop: Math.max(20, height * 0.025),
    color: "#6b7280",
    fontSize: Math.min(15, Math.max(13, width * 0.037)),
    textAlign: "center",
  },
  loginLink: {
    color: "#1976d2",
    fontWeight: "600",
  },
});
