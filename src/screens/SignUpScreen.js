import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { TextInput, Text, Snackbar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      setErr("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    // Add sign-up logic here
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create an Account</Text>

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
          secureTextEntry
          left={<TextInput.Icon name="lock" color="#6b7280" />}
          style={styles.input}
        />

        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          left={<TextInput.Icon name="lock" color="#6b7280" />}
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

        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={{ color: "#1976d2" }}>Login</Text>
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
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.06,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "700",
    marginBottom: height * 0.04,
    color: "#111827",
  },
  input: {
    width: "100%",
    marginBottom: height * 0.02,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: width * 0.03,
    height: height * 0.06,
  },
  gradient: {
    paddingVertical: height * 0.02,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.02,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  gradientText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "700",
  },
  loginText: {
    marginTop: height * 0.02,
    color: "#6b7280",
    fontSize: width * 0.035,
    textAlign: "center",
  },
});
