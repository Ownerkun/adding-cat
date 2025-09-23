// TODO Post card component to display individual posts have a user's name, profile picture, post image, and caption. have a like button.
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post.initialLikes || 0);
  const { width } = useWindowDimensions();

  const cardWidth = width - 32;

  const handleLikePress = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <View style={styles.card} width={cardWidth}>
      <View style={styles.header}>
        <Image
          source={{ uri: post.userProfilePic }}
          style={styles.profilePic}
        />
        <Text style={styles.username}>{post.username}</Text>
      </View>
      <Image source={{ uri: post.postImage }} style={styles.postImage} />
      <Text style={styles.caption}>{post.caption}</Text>
      <TouchableOpacity style={styles.likeButton}>
        <Text style={styles.likeButtonText}>Like</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  caption: {
    padding: 8,
    fontSize: 14,
    color: "#333",
  },
  likeButton: {
    padding: 8,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#f8f8f8",
  },
  likeButtonText: {
    color: "#6200EA",
    fontWeight: "bold",
  },
});

export default PostCard;
