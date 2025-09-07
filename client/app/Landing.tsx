import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { saveTokens } from "@/components/athntication";
import { getAccessToken } from "@/components/athntication";

export default function Landing() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [enable, setEnable] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  function validateEmail(email: any) {
    setEnable(true);
    setIsEmailValid(true);

    return emailRegex.test(email);
  }

  function validatePassword(password: any) {
    setEnable(true);
    if (password.length >= 8 && passwordRegex.test(password)) {
      setIsPasswordValid(true);
    }
    return passwordRegex.test(password);
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAccessToken();
      if (token) {
        router.replace("/Home");
      }
    };
    checkAuth();
  });
  const handleLogin = () => {
    // Handle login logic here

    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character."
      );
      return;
    }
    Alert.alert("Success", "Valid email and password!");
    setEnable(true);

    console.log("Logging in with:", { name, email, password });
    loginUser(email, password);
  };

  async function loginUser(email: any, password: any) {
    try {
      const res = await fetch("http://192.168.0.141:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      console.log("Login successful:", data);

      if (res.ok) {
        console.log("Login successful:", data);
        await saveTokens(data.accessToken, data.refreshToken); // store JWT
        router.replace("/Home");

        console.log("User logged in, tokens saved");
      } else {
        Alert.alert("Login Failed", data.message || "Unknown error occurred");
        console.log("Login failed:", data.message);
      }
    } catch (e) {
      Alert.alert("Login Error", "An error occurred during login.");
      console.error("Login error:", e);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={styles.container}>
        <View>
          <View>
            <Text style={styles.title}>Login</Text>
            <Text>Name</Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <Text>Email</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(eamil) => {
                setEmail(eamil);
                validateEmail(eamil);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <Text>Password</Text>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(password) => {
                setPassword(password);
                validatePassword(password);
              }}
              secureTextEntry
              style={styles.input}
            />
            {isEmailValid && isPasswordValid && (
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text
                  style={[
                    styles.buttonText,
                    enable
                      ? { backgroundColor: "blue" }
                      : { backgroundColor: "gray" },
                  ]}
                >
                  Login
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#111827",
    textAlign: "center",
  },
  input: {
    width: 300,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
