import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!isLogin && password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (!isLogin && !username.trim()) {
      Alert.alert("Error", "Please enter a username");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await signIn(email, password);
        if (error) {
          Alert.alert("Error", error.message);
        }
      } else {
        // Register
        const { data, error } = await signUp(email, password, username.trim());
        if (error) {
          Alert.alert("Error", error.message);
        } else if (data?.user) {
          Alert.alert("Success", [
            { text: "OK", onPress: () => setIsLogin(true) },
          ]);
          // Clear form
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setUsername("");
        }
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear form when switching modes
    setPassword("");
    setConfirmPassword("");
    setUsername("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <MaterialIcons name="pets" size={60} color="#6200EA" />
          <Text style={styles.title}>เติมแมว</Text>
          <Text style={styles.subtitle}>
            {isLogin ? "Welcome back!" : "Create your account"}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {!isLogin && (
            <TextInput
              label="Username"
              mode="outlined"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              disabled={loading}
              left={<TextInput.Icon icon="account" />}
            />
          )}

          <TextInput
            label="Email"
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            disabled={loading}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            disabled={loading}
            left={<TextInput.Icon icon="lock" />}
          />

          {!isLogin && (
            <TextInput
              label="Confirm Password"
              mode="outlined"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              disabled={loading}
              left={<TextInput.Icon icon="lock-check" />}
            />
          )}

          <TouchableOpacity
            style={[styles.authButton, loading && styles.authButtonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.authButtonText}>
                {isLogin ? "Sign In" : "Sign Up"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchModeButton}
            onPress={toggleAuthMode}
            disabled={loading}
          >
            <Text style={styles.switchModeText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </Text>
          </TouchableOpacity>

          {isLogin && (
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => navigation.navigate("ForgetPassword")}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  authButton: {
    backgroundColor: "#6200EA",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  authButtonDisabled: {
    backgroundColor: "#ccc",
  },
  authButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchModeButton: {
    alignItems: "center",
    padding: 10,
  },
  switchModeText: {
    color: "#6200EA",
    fontSize: 14,
    fontWeight: "500",
  },
  forgotPasswordButton: {
    alignItems: "center",
    padding: 10,
    marginTop: 10,
  },
  forgotPasswordText: {
    color: "#666",
    fontSize: 14,
  },
});

export default AuthScreen;
