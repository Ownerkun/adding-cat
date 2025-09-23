import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import EditUsernameModal from "./EditUsernameModal";

const ProfileHeader = ({ user, onUpdateUser }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.username);

  const handleSaveProfile = (newUsername) => {
    onUpdateUser({
      ...user,
      username: newUsername,
    });

    setIsEditModalVisible(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleEditAvatar = () => {
    Alert.alert("Edit Avatar", "Avatar editing functionality would go here");
    // TODO: Integrate image picker to change avatar
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
          <Image source={{ uri: user.profilePic }} style={styles.avatar} />
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
          {/* Edit Username Button */}
          <TouchableOpacity
            style={styles.usernameEditButton}
            onPress={openEditModal}
          >
            <MaterialIcons name="edit" color={"#fff"} size={12} />
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
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarEditButton: {
    position: "absolute",
    bottom: 0,
    left: "18%",
    backgroundColor: "#6200EA",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 16,
    flexDirection: "row",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  usernameEditButton: {
    backgroundColor: "#6200EA",
    padding: 6,
    borderRadius: 16,
    marginLeft: 10,
  },
});

export default ProfileHeader;
