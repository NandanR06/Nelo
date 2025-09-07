import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import axios from "axios";
import { clearTokens, getAccessToken } from "@/components/athntication";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";

const Profile = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState({});
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const API_URL = "http://192.168.0.141:5000/api/auth/";
  const router = useRouter();

  // Decode token to get user ID
  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getAccessToken();
      if (!token) {
        console.log("No access token found.");
        return;
      }
      type DecodedToken = { id: string; [key: string]: any };
      const decoded = jwtDecode<DecodedToken>(token);
      setUserId(decoded.id);
    };
    fetchProfile();
  }, []);

  // Fetch user data when userId is set
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${API_URL}${userId}`);
        setUser(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email,
          password: "",
        });
      } catch (error) {
        if (error instanceof Error)
        console.log("Error fetching user data:", error.message);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (key:any, value :any) => {
    setForm({ ...form, [key]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}${userId}`, form);
      Alert.alert("Success", "Account updated successfully!");
    } catch (err) {
        if (err instanceof Error)
      Alert.alert("Error", err.message);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}${userId}`);
              await clearTokens()
              Alert.alert("Deleted", "Account and posts deleted!");
             router.replace("/Landing");
            } catch (err) {
                if (err instanceof Error)
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Account Page</Text>

        <Text>Username</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />

        <Text>Email</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
        />

        <Text>Password</Text>
        <TextInput
          style={styles.input}
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          secureTextEntry
          placeholder="Enter new password"
        />

        <View style={styles.buttonContainer}>
          <Button title="Update Account" onPress={handleUpdate} />
          <View style={{ height: 10 }} />
          <Button title="Delete Account" color="red" onPress={handleDelete} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",


  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
