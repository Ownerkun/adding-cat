import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";
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
    username: "jane_smith",
    userProfilePic:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    postImage:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400",
    caption: "Mountain hiking adventure! ⛰️",
  },
];

const HomeScreen = ({ navigation }) => {
  const { user, profile, signOut } = useAuth();

  const navigateToCreatePost = () => {
    navigation.navigate("CreatePost");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>เติมแมว 😸</Text>
          {profile && (
            <Text style={styles.welcomeText}>สวัสดี {profile.username}!</Text>
          )}
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.createPostButton}
            onPress={navigateToCreatePost}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#6200EA" />
          </TouchableOpacity>
        </View>
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
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  createPostButton: {
    backgroundColor: "#6200EA",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6200EA",
  },
  listContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
