import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
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
  const { profile } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>เติมแมว 😸</Text>
          {profile && (
            <Text style={styles.welcomeText}>สวัสดี {profile.username}!</Text>
          )}
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
  listContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
