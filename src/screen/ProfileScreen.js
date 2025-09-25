import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import PostCard from "../components/PostCard";
import ProfileHeader from "../components/ProfileHeader";
import { useAuth } from "../AuthContext";

const ProfileScreen = ({ navigation }) => {
  const { signOut } = useAuth();

  // Mock user data
  const [user, setUser] = useState({
    id: 1,
    username: "John Doe",
    profilePic:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    bio: "Travel enthusiast & photographer 📸",
  });

  // Mock user posts
  const [userPosts, setUserPosts] = useState([
    {
      id: 1,
      username: user.username,
      userProfilePic: user.profilePic,
      postImage:
        "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400",
      caption: "Beautiful sunset at the beach! 🌅",
      initialLikes: 42,
    },
    {
      id: 2,
      username: user.username,
      userProfilePic: user.profilePic,
      postImage:
        "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400",
      caption: "Mountain hiking adventure! ⛰️",
      initialLikes: 38,
    },
    {
      id: 3,
      username: user.username,
      userProfilePic: user.profilePic,
      postImage:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
      caption: "City lights are amazing! 🌃",
      initialLikes: 56,
    },
  ]);

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);

    // Update posts with new username
    const updatedPosts = userPosts.map((post) => ({
      ...post,
      username: updatedUser.username,
    }));
    setUserPosts(updatedPosts);
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

  const renderPostItem = ({ item }) => <PostCard post={item} />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#6200EA" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Header Component */}
        <ProfileHeader user={user} onUpdateUser={handleUpdateUser} />

        {/* Posts Section */}
        <View style={styles.postsSection}>
          <Text style={styles.postsTitle}>Your Posts</Text>
          {userPosts.length > 0 ? (
            <FlatList
              data={userPosts}
              renderItem={renderPostItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.noPostsContainer}>
              <Text style={styles.noPostsText}>No posts yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  postsSection: {
    padding: 16,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  noPostsContainer: {
    alignItems: "center",
    padding: 20,
  },
  noPostsText: {
    fontSize: 16,
    color: "#666",
  },
});

export default ProfileScreen;
