import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";
import { usePost } from "../PostContext";

const PostCard = ({ post, isOwnPost = false, onDelete }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const { user } = useAuth();
  const { likePost, unlikePost } = usePost();
  const { width } = useWindowDimensions();

  const cardWidth = width - 32;

  const handleLikePress = async () => {
    try {
      if (isLiked) {
        await unlikePost(post.id);
        setLikeCount(likeCount - 1);
      } else {
        await likePost(post.id);
        setLikeCount(likeCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking post:", error);
      Alert.alert("Error", "Failed to like post");
    }
  };

  const showActionSheet = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Edit Post", "Delete Post"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleEditPost();
          } else if (buttonIndex === 2) {
            handleDeletePost();
          }
        }
      );
    } else {
      Alert.alert("Post Options", "Choose an action", [
        { text: "Cancel", style: "cancel" },
        { text: "Edit Post", onPress: handleEditPost },
        {
          text: "Delete Post",
          style: "destructive",
          onPress: handleDeletePost,
        },
      ]);
    }
  };

  const handleEditPost = () => {
    Alert.alert("Edit Post", "Edit functionality will be implemented soon");
    // TODO: Navigate to edit post screen
  };

  const handleDeletePost = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete && onDelete(post.id),
      },
    ]);
  };

  return (
    <View style={styles.card} width={cardWidth}>
      <View style={styles.header}>
        <Image
          source={{
            uri:
              post.users?.avatar_url ||
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
          }}
          style={styles.profilePic}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>
            {post.users?.username || "Unknown User"}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(post.created_at).toLocaleDateString()}
          </Text>
        </View>
        {isOwnPost && (
          <TouchableOpacity style={styles.menuButton} onPress={showActionSheet}>
            <MaterialIcons name="more-vert" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {post.caption && <Text style={styles.caption}>{post.caption}</Text>}

      <Image source={{ uri: post.image_url }} style={styles.postImage} />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
          <MaterialIcons
            name={isLiked ? "favorite" : "favorite-border"}
            size={24}
            color={isLiked ? "#e74c3c" : "#666"}
          />
          <Text style={styles.likeCount}>{likeCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  menuButton: {
    padding: 4,
  },
  caption: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
  postImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  actions: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  likeCount: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666",
  },
});

export default PostCard;
