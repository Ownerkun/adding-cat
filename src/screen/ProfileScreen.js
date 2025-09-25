import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import PostCard from "../components/PostCard";
import ProfileHeader from "../components/ProfileHeader";
import { useAuth } from "../AuthContext";
import { usePost } from "../PostContext";

const ProfileScreen = ({ navigation }) => {
  const { user, profile, signOut } = useAuth();
  const { posts, fetchPosts, loading } = usePost();
  const [userPosts, setUserPosts] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);

  //Filter posts to show only user's posts
  useEffect(() => {
    if (user && posts) {
      const filteredPosts = posts.filter((post) => post.user_id === user.id);
      setUserPosts(filteredPosts);
      setProfileLoading(false);
    }
  }, [posts, user]);

  const handleUpdateUser = async (updatedUser) => {
    console.log("User updated:", updatedUser);
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

  const renderPostItem = ({ item }) => (
    <PostCard post={item} isOwnPost={true} navigation={navigation} />
  );

  if (profileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EA" />
      </View>
    );
  }

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
        {profile && (
          <ProfileHeader
            user={{
              id: user.id,
              username: profile.username,
              profilePic: profile.avatar_url,
            }}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {/* Posts Section */}
        <View style={styles.postsSection}>
          <Text style={styles.postsTitle}>Your Posts ({userPosts.length})</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#6200EA" />
          ) : userPosts.length > 0 ? (
            <FlatList
              data={userPosts}
              renderItem={renderPostItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.noPostsContainer}>
              <MaterialIcons name="photo-camera" size={60} color="#ccc" />
              <Text style={styles.noPostsText}>No posts yet</Text>
              <Text style={styles.noPostsSubtext}>
                Share your first photo by tapping the + button
              </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    padding: 40,
  },
  noPostsText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  noPostsSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default ProfileScreen;
