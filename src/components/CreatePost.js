import React, { useState } from "react";
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
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { usePost } from "../PostContext";
import { useAuth } from "../AuthContext";

const CreatePost = ({ navigation }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { createPost, uploadImage } = usePost();
  const { profile } = useAuth();

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera permissions to make this work!"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handlePost = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image");
      return;
    }

    if (!caption.trim()) {
      Alert.alert("Error", "Please write a caption");
      return;
    }

    try {
      setUploading(true);

      const { url: imageUrl, error: uploadError } = await uploadImage(image);

      if (uploadError) {
        throw uploadError;
      }

      const { error: postError } = await createPost(imageUrl, caption.trim());

      if (postError) {
        throw postError;
      }

      Alert.alert("Success", "Post created successfully!");
      setCaption("");
      setImage(null);
      navigation.goBack();
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Post</Text>
      </View>

      {/* Image Upload Section */}
      <View style={styles.imageSection}>
        <Text style={styles.sectionTitle}>Add Photo</Text>

        {image ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
            >
              <MaterialIcons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageUploadOptions}>
            <TouchableOpacity style={styles.uploadOption} onPress={pickImage}>
              <MaterialIcons name="photo-library" size={40} color="#6200EA" />
              <Text style={styles.uploadOptionText}>Choose from Library</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadOption} onPress={takePhoto}>
              <MaterialIcons name="photo-camera" size={40} color="#6200EA" />
              <Text style={styles.uploadOptionText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Caption Section */}
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
        />
        <Text style={styles.charCount}>{caption.length}/500</Text>
      </View>

      {/* Post Button */}
      <TouchableOpacity
        style={[
          styles.postButton,
          (!image || !caption.trim() || uploading) && styles.postButtonDisabled,
        ]}
        onPress={handlePost}
        disabled={!image || !caption.trim() || uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.postButtonText}>Post</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
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
  },
  imagePreviewContainer: {
    position: "relative",
    alignItems: "center",
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  imageUploadOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  uploadOption: {
    alignItems: "center",
    padding: 16,
  },
  uploadOptionText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  captionSection: {
    backgroundColor: "#fff",
    margin: 16,
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
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  postButton: {
    backgroundColor: "#6200EA",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  postButtonDisabled: {
    backgroundColor: "#ccc",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreatePost;
