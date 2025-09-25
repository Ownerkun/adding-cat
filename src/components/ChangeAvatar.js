import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";
import { supabase } from "../config/supabase";

const ChangeAvatar = ({ isVisible, onClose, onAvatarUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user, updateProfile } = useAuth();

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
        mediaTypes: ImagePicker.mediaTypes,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
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
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const uploadAvatar = async (imageUri) => {
    try {
      if (!user) throw new Error("User not authenticated");

      // Simplify the filename - use just the user ID without nested folders
      const filename = `${user.id}.jpg`;
      console.log("Uploading avatar:", filename);

      // Use FormData approach like in PostContext
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: filename,
        type: "image/jpeg",
      });

      // Upload to Supabase Storage - use upsert to overwrite existing avatars
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filename, formData, {
          contentType: "image/jpeg",
          upsert: true, // This will overwrite if file exists
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filename);

      console.log("Avatar uploaded successfully:", publicUrl);
      return { url: publicUrl, error: null };
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return { url: null, error };
    }
  };

  const handleSave = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    setLoading(true);

    try {
      // Upload the image
      const { url: avatarUrl, error: uploadError } = await uploadAvatar(
        selectedImage
      );

      if (uploadError) {
        // If upload fails due to RLS, try a different approach
        if (uploadError.message.includes("row-level security")) {
          throw new Error(
            "Upload permission denied. Please check storage policies."
          );
        }
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      if (!avatarUrl) {
        throw new Error("No avatar URL returned from upload");
      }

      // Update user profile with new avatar URL
      const { data, error: updateError } = await updateProfile({
        avatar_url: avatarUrl,
      });

      if (updateError) {
        throw updateError;
      }

      Alert.alert("Success", "Avatar updated successfully!");
      onAvatarUpdate(avatarUrl);
      handleClose();
    } catch (error) {
      console.error("Error updating avatar:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to update avatar. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setLoading(false);
    onClose();
  };

  const removeAvatar = async () => {
    Alert.alert(
      "Remove Avatar",
      "Are you sure you want to remove your avatar?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              // Also try to delete the file from storage
              if (user) {
                const filename = `${user.id}.jpg`;
                await supabase.storage.from("avatars").remove([filename]);
              }

              const { data, error } = await updateProfile({
                avatar_url: null,
              });

              if (error) {
                throw error;
              }

              Alert.alert("Success", "Avatar removed successfully!");
              onAvatarUpdate(null);
              handleClose();
            } catch (error) {
              console.error("Error removing avatar:", error);
              Alert.alert(
                "Error",
                "Failed to remove avatar. Please try again."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Avatar</Text>
            <TouchableOpacity onPress={handleClose} disabled={loading}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Image Preview */}
          {selectedImage ? (
            <View style={styles.imagePreviewSection}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={() => setSelectedImage(null)}
                disabled={loading}
              >
                <Text style={styles.changeImageText}>
                  Choose Different Image
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadOptions}>
              <TouchableOpacity
                style={styles.uploadOption}
                onPress={pickImage}
                disabled={loading}
              >
                <MaterialIcons name="photo-library" size={40} color="#6200EA" />
                <Text style={styles.uploadOptionText}>Choose from Library</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadOption}
                onPress={takePhoto}
                disabled={loading}
              >
                <MaterialIcons name="photo-camera" size={40} color="#6200EA" />
                <Text style={styles.uploadOptionText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {selectedImage ? (
              <TouchableOpacity
                style={[styles.saveButton, loading && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Avatar</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.removeButton, loading && styles.buttonDisabled]}
                onPress={removeAvatar}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#e74c3c" size="small" />
                ) : (
                  <>
                    <MaterialIcons
                      name="delete-outline"
                      size={20}
                      color="#e74c3c"
                    />
                    <Text style={styles.removeButtonText}>
                      Remove Current Avatar
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  imagePreviewSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
  },
  changeImageButton: {
    padding: 10,
  },
  changeImageText: {
    color: "#6200EA",
    fontSize: 14,
    fontWeight: "500",
  },
  uploadOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  uploadOption: {
    alignItems: "center",
    padding: 20,
  },
  uploadOptionText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  actionButtons: {
    gap: 10,
  },
  saveButton: {
    backgroundColor: "#6200EA",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  removeButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButtonText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ChangeAvatar;
