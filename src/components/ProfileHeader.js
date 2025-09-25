import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import EditUsernameModal from "./EditUsernameModal";
import { useAuth } from "../AuthContext";

const ProfileHeader = ({ user, onUpdateUser }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.username);
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateProfile } = useAuth();

  const handleSaveProfile = async (newUsername) => {
    if (!newUsername.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    if (newUsername === user.username) {
      setIsEditModalVisible(false);
      return;
    }

    setIsUpdating(true);

    try {
      const { data, error } = await updateProfile({
        username: newUsername,
      });

      if (error) {
        throw error;
      }

      onUpdateUser({
        ...user,
        username: newUsername,
      });

      setIsEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditAvatar = () => {
    Alert.alert(
      "Edit Avatar",
      "Avatar editing functionality will be implemented soon"
    );
    // TODO: Implement avatar upload functionality
  };

  const openEditModal = () => {
    setEditedUsername(user.username);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
  };

  return (
    <View>
      {/* Profile Info Section */}
      <View style={styles.profileSection}>
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                user.profilePic ||
                "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
            }}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.avatarEditButton}
            onPress={handleEditAvatar}
          >
            <MaterialIcons name="image" color={"#fff"} size={16} />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.username}</Text>
          <TouchableOpacity
            style={styles.usernameEditButton}
            onPress={openEditModal}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="edit" color={"#fff"} size={14} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <EditUsernameModal
        isVisible={isEditModalVisible}
        onClose={closeEditModal}
        username={editedUsername}
        onUsernameChange={setEditedUsername}
        onSave={handleSaveProfile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6200EA",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginRight: 8,
  },
  usernameEditButton: {
    backgroundColor: "#6200EA",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileHeader;
