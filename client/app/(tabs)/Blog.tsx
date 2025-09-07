import { getAccessToken } from "@/components/athntication";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const API_URL = "http://10.85.60.192:5000/api/blogs";

export default function Blog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [userId, setUserId] = useState("");

  type BlogItem = {
    _id: string;
    title: string;
    content: string;
    author: string;
    timestamp?: string;
    userId : string;
  };

  const [blogs, setBlogs] = useState<BlogItem[]>([]);


   useEffect(() => {
  const fetchUserName = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      type DecodedToken = { id: string; [key: string]: any };
      const decoded = jwtDecode<DecodedToken>(token);
      const userId = decoded.id;
      console.log("token user ID:", userId);

      console.log("Fetching user name...");
      const res = await axios.get(`http://10.85.60.192:5000/api/auth/${userId}`);
      
      setUserId(res.data._id); 
      console.log("Fetched user data:", res.data._id);
      
    } catch (error) {
      if (error instanceof Error)
        console.log("Error fetching user name:", error.message);
    }
  };

  fetchUserName();
}, []); 

  // Fetch blogs
  const fetchBlogs = async () => {
    try { 
      const res = await axios.get(`http://10.85.60.192:5000/api/blogs/${userId}`);
      setBlogs(res.data);
      console.log("Fetched blogs:", res.data);
    }

    catch (error) {
      if (error instanceof Error)
        console.log("Error fetching blogs:", error.message);
    }
  };  

  // Post blog
  const postBlog = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, author, userId}),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        setAuthor("");
        fetchBlogs();
      }
    } catch (err) {
      console.log("Error posting blog:", err);
    }
  };

  

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.heading}>Create Blog</Text>
        <TextInput
          placeholder="Title"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Content"
          style={[styles.input, { height: 100 }]}
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TextInput
          placeholder="Author"
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
        />
        <Button title="Post Blog" onPress={postBlog} />

        <Text style={styles.heading}>All Blogs</Text>
        <FlatList
          data={blogs}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text>{item.content}</Text>
              <Text style={styles.meta}>
                By {item.author} | {item.timestamp}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    alignContent: "center",
    marginBlock: 90,
  },
  heading: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  meta: { fontSize: 12, color: "gray", marginTop: 5 },
});
