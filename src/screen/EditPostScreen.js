import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { usePost } from "../PostContext";
import { useAuth } from "../AuthContext";

const EditPostScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [caption, setCaption] = useState(post.caption || "");
  const [loading, setLoading] = useState(false);
  const { updatePost, deletePost } = usePost();
  const { profile } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      title: "Edit Post",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          style={styles.headerButton}
          disabled={loading || !caption.trim()}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#6200EA" />
          ) : (
            <Text
              style={[
                styles.saveButtonText,
                !caption.trim() && styles.saveButtonDisabled,
              ]}
            >
              Save
            </Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, caption, loading]);

  const handleSave = async () => {
    if (!caption.trim()) {
      Alert.alert("Error", "Please enter a caption");
      return;
    }

    if (caption === post.caption) {
      navigation.goBack();
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePost(post.id, caption.trim());

      if (error) {
        throw error;
      }

      Alert.alert("Success", "Post updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating post:", error);
      Alert.alert("Error", "Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await deletePost(post.id);

              if (error) {
                throw error;
              }

              Alert.alert("Success", "Post deleted successfully");
              navigation.navigate("Main", { screen: "Profile" });
            } catch (error) {
              console.error("Error deleting post:", error);
              Alert.alert("Error", "Failed to delete post");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image Preview */}
      <View style={styles.imageSection}>
        <Text style={styles.sectionTitle}>Photo</Text>
        <Image source={{ uri: post.image_url }} style={styles.imagePreview} />
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={{
            uri:
              profile?.avatar_url ||
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
          }}
          style={styles.profilePic}
        />
        <Text style={styles.username}>{profile?.username || "User"}</Text>
      </View>

      {/* Caption Editor */}
      <View style={styles.captionSection}>
        <Text style={styles.sectionTitle}>Caption</Text>
        <TextInput
          style={styles.captionInput}
          placeholder="What's on your mind?"
          value={caption}
          onChangeText={setCaption}
          multiline
          numberOfLines={4}
          maxLength={500}
          editable={!loading}
        />
        <Text style={styles.charCount}>{caption.length}/500</Text>
      </View>

      {/* Delete Post Option */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeletePost}
        disabled={loading}
      >
        <MaterialIcons name="delete-outline" size={20} color="#e74c3c" />
        <Text style={styles.deleteButtonText}>Delete Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerButton: {
    padding: 8,
    marginHorizontal: 8,
  },
  saveButtonText: {
    color: "#6200EA",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButtonDisabled: {
    color: "#ccc",
  },
  imageSection: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  userInfo: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  captionSection: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 16,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  deleteButtonText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default EditPostScreen;
