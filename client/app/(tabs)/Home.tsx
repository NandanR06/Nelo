import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { clearTokens, getAccessToken } from "@/components/athntication";
import axios from "axios";
import {
  GestureHandlerRootView,
  Swipeable,
  TextInput,
} from "react-native-gesture-handler";
import EditModel from "@/components/EditModel";
import { jwtDecode } from "jwt-decode";

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  timestamp?: string;
  userId: string;
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");

  const CURRENT_USER = userId; // logged-in user ID
  const API_URL = "http://192.168.0.141:5000/api/blogs";

  const router = useRouter();

  // get logged in userId from token
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;

        type DecodedToken = { id: string; [key: string]: any };
        const decoded = jwtDecode<DecodedToken>(token);

        setUserId(decoded.id);
        console.log("Decoded user ID from token:", decoded.id);
      } catch (error) {
        if (error instanceof Error)
          console.log("Error decoding token:", error.message);
      }
    };

    fetchUserId();
  }, []);

  // logout
  const handleLogout = () => {
    clearTokens();
    Alert.alert("Logged Out", "You have been logged out.");
    router.replace("/Landing");
  };

  // fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(API_URL);
      setBlogs(res.data);
      console.log("Fetched blogs:", res.data);
    } catch (error) {
      if (error instanceof Error)
        console.log("Error fetching blogs:", error.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenEdit = (item: Blog) => {
    setCurrentId(item._id);
    setTitle(item.title);
    setContent(item.content);
    setModalVisible(true);
  };

  // save edit
  const handleSaveEdit = async () => {
    if (!currentId) return;

    try {
      await fetch(`${API_URL}/${currentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          userId: CURRENT_USER, 
        }),
      });
      setModalVisible(false);
      fetchBlogs();
    } catch (error) {
      console.log("Error saving edit:", error);
    }
  };

  // delete blog
  const deleteBlog = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: CURRENT_USER }),
      });
      fetchBlogs();
    } catch (error) {
      console.log("Error deleting blog:", error);
    }
  };

  // swipeable buttons
  const renderRightDelete = (item: Blog) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: "red" }]}
      onPress={() => deleteBlog(item._id)}
    >
      <Text style={styles.actionText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderLeftEdit = (item: Blog) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: "orange" }]}
      onPress={() => handleOpenEdit(item)}
    >
      <Text style={styles.actionText}>Edit</Text>
    </TouchableOpacity>
  );

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.includes(search) ||
      blog.content.includes(search) ||
      blog.author.includes(search) ||
      blog.timestamp?.includes(search)
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons
            name="person-circle"
            size={30}
            color="blue"
            onPress={handleLogout}
          />
        </View>

        {/* Blog List */}
        <View style={{ flex: 1, padding: 10 }}>
          <Text style={styles.heading}>All Blogs</Text>
          <TextInput
            style={styles.search}
            placeholder="Search by Title, Content"
            value={search}
            onChangeText={setSearch}
          />
          <FlatList
            data={filteredBlogs}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Swipeable
                renderLeftActions={() =>
                  item.userId === CURRENT_USER ? renderLeftEdit(item) : null
                }
                renderRightActions={() =>
                  item.userId === CURRENT_USER ? renderRightDelete(item) : null
                }
              >
                <View
                  style={[
                    styles.card,
                    item.userId === CURRENT_USER && styles.ownCard,
                  ]}
                >
                  <Text style={styles.title}>{item.title}</Text>
                  <Text>{item.content}</Text>
                  <Text style={styles.meta}>
                    By {item.author} | {item.timestamp}
                  </Text>
                </View>
              </Swipeable>
            )}
          />
        </View>

        {/* Edit Modal */}
        <EditModel
          visible={modalVisible}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          onClose={() => setModalVisible(false)}
          handleSaveEdit={handleSaveEdit}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 50,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "#f8f8f855",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingRight: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  heading: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
  },
  ownCard: {
    backgroundColor: "#d6f5d6",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  meta: { fontSize: 12, color: "blue", marginTop: 5 },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  actionText: { color: "white", fontWeight: "bold" },
});
