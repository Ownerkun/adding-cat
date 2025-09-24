import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import PostCard from "../components/PostCard";

const mockPosts = [
  {
    id: 1,
    username: "john_doe",
    userProfilePic:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    postImage:
      "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400",
    caption: "Beautiful sunset at the beach! 🌅",
  },
  {
    id: 2,
    username: "jane_smith",
    userProfilePic:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    postImage:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400",
    caption: "Mountain hiking adventure! ⛰️",
  },
  {
    id: 3,
    username: "alex_wong",
    userProfilePic:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    postImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
    caption: "City lights are amazing! 🌃",
  },
];

const HomeScreen = ({ navigation }) => {
  const navigateToCreatePost = () => {
    navigation.navigate("CreatePost");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>เติมแมว 😸</Text>
        <TouchableOpacity
          style={styles.createPostButton}
          onPress={navigateToCreatePost}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  createPostButton: {
    backgroundColor: "#6200EA",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
